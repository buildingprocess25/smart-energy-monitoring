import { cache } from 'react'
import { getSpartaPool, getTelemetryPool } from '@/lib/db/pools'
import { getRequestScope } from '@/lib/auth/access'
import { isDeviceAllowed } from '@/lib/auth/access-rules'
import { Store, PhaseData, StoreStatus } from '@/lib/types'
import { extractStoreCode } from '@/lib/store-code'
import { createSharedFetch } from '@/lib/shared-fetch'
import { isCaptureStalled, parseWibTimestamp } from '@/lib/capture-health'
import { readLastRecordTimes } from '@/lib/services/capture-health-service'
import { fetchTelemetryApi } from '@/lib/services/telemetry-api'
import { getEnergyIndexWithin } from '@/lib/services/energy-service'
import type { EnergyTotal } from '@/lib/energy-index'
import { currentMembers, isVirtualDeviceId, macOf, macsEverIn } from '@/lib/device-topology'
import { defaultPhaseName, normalizePhaseKey } from '@/lib/phase-keys'
import { getDeviceTopology } from '@/lib/services/topology-service'
import type { TopologyMap } from '@/lib/device-topology'

// /capture/status is the same for every viewer (scope is applied afterwards): ask Flask at most every 5 s,
// and after a failure use DB capture_states for 15 s instead of waiting on the timeout.
const loadCaptureStatus = createSharedFetch(() => fetchTelemetryApi('/capture/status', 1500), {
  ttlMs: 5000,
  failureBackoffMs: 15000,
})

interface IotDeviceData {
  deviceId: string
  deviceName: string
  storeCode: string | null
  online: boolean
  lastSeen: string
  deviceClock: number | null
  phases: PhaseData[]
  energy: EnergyTotal | null
  isRecording: boolean
  recordingStalled: boolean
  recordingSessionName?: string
  latitude?: number
  longitude?: number
  storeId?: string
  members?: { deviceId: string; phase: string; prefix: string }[] // physical SpartaEnergy devices behind a SPARTA-<code> device
}

interface CaptureReport {
  active?: boolean
  session_id?: string | null
  session_name?: string
  interval?: number
  started_at?: string | null
}

function parseCaptureState(raw: unknown): CaptureReport | null {
  if (typeof raw !== 'string') return (raw as CaptureReport | null) ?? null
  try {
    return JSON.parse(raw) as CaptureReport
  } catch {
    return null
  }
}

interface SensorConfig {
  name: string
  phase: string
  enabled?: boolean
}

type LatestRow = {
  device_id: string
  phase: string
  phase_name?: string | null
  voltage: number | null
  current: number | null
  power: number | null
  power_factor: number | null
}

// One query for all devices; only devices without telemetry rows fall back to history.
async function loadLatestRows(deviceIds: string[]): Promise<Map<string, LatestRow[]>> {
  const pool = getTelemetryPool()
  const byDevice = new Map<string, LatestRow[]>()
  try {
    const res = await pool.query<LatestRow>(
      `SELECT DISTINCT ON (device_id, phase) device_id, phase, voltage, current, power, power_factor
       FROM telemetry
       WHERE device_id = ANY($1::text[])
       ORDER BY device_id, phase, epoch DESC`,
      [deviceIds]
    )
    for (const row of res.rows) {
      const rows = byDevice.get(row.device_id)
      if (rows) rows.push(row)
      else byDevice.set(row.device_id, [row])
    }
  } catch (error) {
    console.warn('Error querying telemetry:', error)
  }

  await Promise.all(
    deviceIds
      .filter((id) => !byDevice.has(id))
      .map(async (id) => {
        try {
          const res = await pool.query<LatestRow>(
            `SELECT DISTINCT ON (phase) device_id, phase, phase_name, voltage, current, power, power_factor
             FROM (
               SELECT device_id, phase, phase_name, voltage, current, power, power_factor, epoch
               FROM history
               WHERE device_id = $1
               ORDER BY id DESC
               LIMIT 30
             ) sub
             ORDER BY phase, epoch DESC`,
            [id]
          )
          byDevice.set(id, res.rows)
        } catch (error) {
          console.warn('Error querying history fallback:', error)
        }
      })
  )
  return byDevice
}

const ENERGY_WAIT_MS = 1000

function loadEnergyIndex() {
  return getEnergyIndexWithin(ENERGY_WAIT_MS).catch((error) => {
    console.error('Error loading energy index:', error)
    return null
  })
}

// A store with a main panel counts R/S/T only, so sub-meters are not counted twice.
function storeEnergy(devices: { energy: EnergyTotal | null }[]): Pick<Store, 'kwhTotal' | 'energyBasis'> {
  const totals = devices.flatMap((d) => (d.energy ? [d.energy] : []))
  const main = totals.filter((t) => t.hasMain)
  const kwh = main.length > 0
    ? main.reduce((sum, t) => sum + t.main, 0)
    : totals.reduce((sum, t) => sum + t.all, 0)
  return {
    kwhTotal: Math.round(kwh * 10) / 10,
    energyBasis: main.length > 0 ? 'main' : kwh > 0 ? 'sensor' : 'none',
  }
}

// React cache() lasts one server request only, so every page load still reads live data.
// It lets the page sections share one read instead of repeating it; route handlers are not memoized.
export const getIotDeviceDataList = cache(loadIotDeviceDataList)
export const getStores = cache(loadStores)
export const getStoreById = cache(loadStoreById)

// SpartaEnergy devices measure one phase or one load each, so the devices placed in a store
// become one SPARTA-<code> device. A store they left stays as a historical device with its data.
function foldPlacedDevices(
  devices: IotDeviceData[],
  map: TopologyMap,
  allowed: (deviceId: string) => boolean,
  energy: { total(id: string): EnergyTotal } | null
): IotDeviceData[] {
  if (map.size === 0) return devices
  const members = currentMembers(map, Date.now())
  const byMac = new Map(devices.flatMap((d) => {
    const mac = macOf(d.deviceId)
    return mac ? [[mac, d] as const] : []
  }))
  const virtualIds = new Set([...map.values()].flatMap((list) => list.map((p) => p.deviceId)))
  const folded = new Set<string>()
  const virtual: IotDeviceData[] = []

  for (const id of virtualIds) {
    // A GS sees the store only when every device it ever had is in their list.
    if (!macsEverIn(map, id).every((mac) => allowed(`CT-${mac}`) || allowed(`Plug-${mac}`))) continue
    const placed = (members.get(id) ?? []).flatMap((m) => {
      const device = byMac.get(m.mac)
      return device ? [{ device, phase: m.phase, prefix: m.prefix }] : []
    })
    placed.forEach(({ device }) => folded.add(device.deviceId))
    const list = placed.map((p) => p.device)
    const newest = (pick: (d: IotDeviceData) => number | null) =>
      list.reduce<number | null>((max, d) => {
        const v = pick(d)
        return v === null ? max : max === null ? v : Math.max(max, v)
      }, null)
    const recording = list.find((d) => d.isRecording && d.recordingSessionName)

    virtual.push({
      deviceId: id,
      deviceName: `SpartaEnergy [${id.slice('SPARTA-'.length)}]`,
      storeCode: id.slice('SPARTA-'.length),
      online: list.some((d) => d.online),
      lastSeen: new Date(newest((d) => Date.parse(d.lastSeen)) ?? 0).toISOString(),
      deviceClock: newest((d) => d.deviceClock),
      phases: placed.flatMap(({ device, phase, prefix }) => {
        // Latest values are per key with no age limit, so a device that once reported R/S/T and now
        // sends one channel would show both. Its own channels win; R/S/T only when it has nothing else.
        const isReported = (p: PhaseData) => ['R', 'S', 'T'].includes(normalizePhaseKey(p.phase))
        const channels = device.phases.filter((p) => !isReported(p))
        const shown = channels.length > 0 ? channels : device.phases
        return shown.map((p) => {
          const key = isReported(p)
            ? `${prefix} ${normalizePhaseKey(p.phase)}`.trim()
            : shown.length === 1 ? phase : `${phase} ${p.phase}`
          return { ...p, phase: key, phaseName: defaultPhaseName(key) }
        })
      }),
      energy: energy ? energy.total(id) : null,
      isRecording: list.some((d) => d.isRecording),
      recordingStalled: list.some((d) => d.recordingStalled),
      recordingSessionName: recording?.recordingSessionName,
      latitude: list.find((d) => d.latitude)?.latitude,
      longitude: list.find((d) => d.longitude)?.longitude,
      storeId: list.find((d) => d.storeId)?.storeId,
      members: placed.map(({ device, phase, prefix }) => ({ deviceId: device.deviceId, phase, prefix })),
    })
  }
  return [...devices.filter((d) => !folded.has(d.deviceId)), ...virtual]
}

async function loadIotDeviceDataList(): Promise<IotDeviceData[]> {
  const telemetryDb = getTelemetryPool()

  // Every store, page and API route reads devices through here, so the role scope is applied once.
  const scope = await getRequestScope()
  if (scope.kind === 'none') return []

  try {
    const captureStatus = loadCaptureStatus('all').catch(() => null)
    const energyIndex = loadEnergyIndex()
    let devRows: any[] = []
    try {
      const devRes = await telemetryDb.query(`
        SELECT 
          d.id, 
          d.name, 
          d.online, 
          d.last_seen, 
          d.sensors, 
          d.latitude, 
          d.longitude, 
          d.store_id,
          cs.state as capture_state
        FROM devices d
        LEFT JOIN capture_states cs ON cs.device_id = d.id
        ORDER BY d.id ASC
      `)
      devRows = devRes.rows
    } catch {
      const devRes = await telemetryDb.query(`
        SELECT id, name, online, last_seen, sensors 
        FROM devices
        ORDER BY id ASC
      `)
      devRows = devRes.rows
    }

    // Active capture states from Flask, shared across requests (see loadCaptureStatus)
    const liveApiCaptureMap = new Map<string, CaptureReport>()
    try {
      const data = (await captureStatus) as {
        devices?: Record<string, (CaptureReport & { finalizing?: boolean }) | null>
      } | null
      if (data && data.devices) {
        for (const [did, dinfo] of Object.entries(data.devices)) {
          if (dinfo && (dinfo.active || dinfo.finalizing)) {
            liveApiCaptureMap.set(did, {
              active: true,
              session_name: dinfo.session_name,
              session_id: dinfo.session_id,
              interval: dinfo.interval,
              started_at: dinfo.started_at,
            })
          }
        }
      }
    } catch {
      // Graceful fallback to DB capture_states
    }

    const allowedIds = devRows.map((d) => String(d.id)).filter((id) => isDeviceAllowed(scope, id))
    const activeSessions = devRows.flatMap((d) => {
      const report = liveApiCaptureMap.get(d.id) ?? parseCaptureState(d.capture_state)
      return report?.active && report.session_id ? [report.session_id] : []
    })
    const [latestRows, energy, lastRecord, topology] = await Promise.all([
      loadLatestRows(allowedIds),
      energyIndex,
      readLastRecordTimes(activeSessions),
      getDeviceTopology().catch(() => null),
    ])
    const results: IotDeviceData[] = []

    for (const dev of devRows) {
      if (!isDeviceAllowed(scope, String(dev.id))) continue
      const storeCode = extractStoreCode(dev.name)

      const captureStateObj = parseCaptureState(dev.capture_state)
      const apiCapture = liveApiCaptureMap.get(dev.id)
      const isRecording = Boolean(
        apiCapture?.active || (captureStateObj && captureStateObj.active === true)
      )
      const recordingSessionName =
        apiCapture?.session_name ||
        captureStateObj?.session_name ||
        captureStateObj?.session_id ||
        undefined
      const report = apiCapture?.active ? apiCapture : captureStateObj
      const recordingStalled = isCaptureStalled(
        {
          active: isRecording,
          interval: report?.interval ?? null,
          startedAt: report?.started_at ?? null,
          lastRecordAt: lastRecord(report?.session_id ?? null),
        },
        Date.now()
      )
      const lat = dev.latitude ? parseFloat(dev.latitude) : undefined
      const lng = dev.longitude ? parseFloat(dev.longitude) : undefined

      // Parse sensors config from devices table
      const sensorMap = new Map<string, { name: string; enabled: boolean }>()
      let sensorsList: SensorConfig[] = []
      if (Array.isArray(dev.sensors)) {
        sensorsList = dev.sensors
      } else if (typeof dev.sensors === 'string') {
        try {
          sensorsList = JSON.parse(dev.sensors)
        } catch {
          sensorsList = []
        }
      }

      sensorsList.forEach((s) => {
        if (s.phase) {
          sensorMap.set(s.phase, {
            name: s.name || s.phase,
            enabled: s.enabled !== false,
          })
        }
      })

      const telemRows = latestRows.get(String(dev.id)) ?? []

      const phases: PhaseData[] = []

      for (const row of telemRows) {
        const v = Number(row.voltage) || 0
        const a = Number(row.current) || 0
        const w = Number(row.power) || 0
        const pf = Number(row.power_factor) || 0

        const sInfo = sensorMap.get(row.phase)
        let sensorName = sInfo?.name || row.phase_name

        // Smart fallback if not defined in sensors JSON or history
        if (!sensorName) {
          if (row.phase === 'L12' || row.phase === 'L1' || row.phase === 'R') sensorName = 'Fase R'
          else if (row.phase === 'L13' || row.phase === 'L2' || row.phase === 'S') sensorName = 'Fase S'
          else if (row.phase === 'L14' || row.phase === 'L3' || row.phase === 'T') sensorName = 'Fase T'
          else sensorName = `Sensor ${row.phase}`
        }

        phases.push({
          phase: row.phase,
          phaseName: sensorName,
          voltage: v,
          current: a,
          power: w,
          powerFactor: pf,
        })
      }

      // Sort phases: Non-dummy first, dummy last
      phases.sort((a, b) => {
        const aDummy = (a.phaseName || '').toLowerCase().includes('dummy')
        const bDummy = (b.phaseName || '').toLowerCase().includes('dummy')
        if (aDummy && !bDummy) return 1
        if (!aDummy && bDummy) return -1
        return a.phase.localeCompare(b.phase, undefined, { numeric: true })
      })

      results.push({
        deviceId: dev.id,
        deviceName: dev.name,
        storeCode,
        online: dev.online ?? true,
        // The device clock can be hours off; while Flask calls it online, it was just heard.
        lastSeen: new Date(dev.online ? Date.now() : (parseWibTimestamp(dev.last_seen) ?? 0)).toISOString(),
        deviceClock: parseWibTimestamp(dev.last_seen),
        phases: phases.length > 0 ? phases : [
          { phase: 'L1', phaseName: 'Fase R', voltage: 0, current: 0, power: 0, powerFactor: 1.0 },
          { phase: 'L2', phaseName: 'Fase S', voltage: 0, current: 0, power: 0, powerFactor: 1.0 },
          { phase: 'L3', phaseName: 'Fase T', voltage: 0, current: 0, power: 0, powerFactor: 1.0 },
        ],
        energy: energy ? energy.total(String(dev.id)) : null,
        isRecording,
        recordingStalled,
        recordingSessionName,
        latitude: lat,
        longitude: lng,
        storeId: dev.store_id || undefined,
      })
    }

    return topology ? foldPlacedDevices(results, topology.map, (id) => isDeviceAllowed(scope, id), energy) : results
  } catch (error) {
    console.error('Error fetching IoT device data:', error)
    return []
  }
}

// Get only stores that actually have IoT devices registered in database
async function loadStores(): Promise<Store[]> {
  const sparta = getSpartaPool()

  try {
    // 1. Get IoT devices from VPS Database
    const iotDevices = await getIotDeviceDataList()
    const activeStoreCodes = iotDevices
      .map((d) => d.storeCode)
      .filter((c): c is string => Boolean(c))

    if (activeStoreCodes.length === 0 && iotDevices.length === 0) {
      return []
    }

    // 2. Query matching stores from SPARTA DB strictly for the active device store codes
    let storesRes: { rows: any[] } = { rows: [] }
    if (activeStoreCodes.length > 0) {
      storesRes = await sparta.query(
        `
        SELECT id, code, name, branch, pln_power_va, sales_area_m2, warehouse_area_m2, is_24_hours, latitude, longitude
        FROM stores
        WHERE code = ANY($1::text[])
        ORDER BY name ASC
      `,
        [activeStoreCodes]
      )
    }

    // Group IoT devices by storeCode (or deviceId fallback)
    const iotDevicesByCode = new Map<string, IotDeviceData[]>()
    iotDevices.forEach((d) => {
      const codeKey = (d.storeCode || d.deviceId).toUpperCase()
      const existing = iotDevicesByCode.get(codeKey) || []
      existing.push(d)
      iotDevicesByCode.set(codeKey, existing)
    })

    const processedStoreCodes = new Set<string>()

    const stores: Store[] = storesRes.rows.map((s) => {
      const codeKey = (s.code || '').toUpperCase()
      processedStoreCodes.add(codeKey)
      const matchingDevices = iotDevicesByCode.get(codeKey) || []

      // If multiple devices exist for this store (e.g. EM-0002, EM-0005, EM-0006 for TI90), aggregate them
      const isRecording = matchingDevices.some((d) => d.isRecording)
      const isOnline = matchingDevices.some((d) => d.online)
      const status: StoreStatus = isRecording ? 'live' : (isOnline ? 'live' : 'historical')

      const recordingDevice = matchingDevices.find((d) => d.isRecording && d.recordingSessionName)
      const recordingSessionName = recordingDevice?.recordingSessionName || matchingDevices.find((d) => d.recordingSessionName)?.recordingSessionName

      // Combine all phases/equipment across devices, prioritizing active/online devices
      const allPhases: PhaseData[] = []
      matchingDevices.forEach((d) => {
        d.phases.forEach((p) => {
          allPhases.push(p)
        })
      })

      const deviceCount = matchingDevices.length > 0 ? matchingDevices.length : 1

      // Find the most recent lastSeen
      let latestLastSeen = new Date(0).toISOString()
      matchingDevices.forEach((d) => {
        if (d.lastSeen && d.lastSeen > latestLastSeen) {
          latestLastSeen = d.lastSeen
        }
      })

      const primaryIot =
        matchingDevices.find((d) => isVirtualDeviceId(d.deviceId) && d.energy?.hasMain) ||
        matchingDevices.find((d) => d.isRecording) || matchingDevices.find((d) => d.online) || matchingDevices[0]
      const latitude = primaryIot?.latitude || (s.latitude ? parseFloat(s.latitude) : undefined)
      const longitude = primaryIot?.longitude || (s.longitude ? parseFloat(s.longitude) : undefined)

      return {
        id: s.id,
        code: s.code,
        name: s.name,
        branch: s.branch || 'Head Office',
        latitude,
        longitude,
        status,
        ...storeEnergy(matchingDevices),
        deviceCount,
        lastUpdate: latestLastSeen === new Date(0).toISOString() ? '' : latestLastSeen,
        phases: allPhases.length > 0 ? allPhases : [
          { phase: 'L1', phaseName: 'Fase R', voltage: 0, current: 0, power: 0, powerFactor: 1.0 },
          { phase: 'L2', phaseName: 'Fase S', voltage: 0, current: 0, power: 0, powerFactor: 1.0 },
          { phase: 'L3', phaseName: 'Fase T', voltage: 0, current: 0, power: 0, powerFactor: 1.0 },
        ],
        deviceId: primaryIot?.deviceId,
        members: primaryIot?.members,
        plnPowerVa: s.pln_power_va ? parseInt(s.pln_power_va) : undefined,
        is24Hours: s.is_24_hours,
        salesAreaM2: s.sales_area_m2 ? parseFloat(s.sales_area_m2) : undefined,
        warehouseAreaM2: s.warehouse_area_m2 ? parseFloat(s.warehouse_area_m2) : undefined,
        isRecording,
        recordingStalled: matchingDevices.some((d) => d.recordingStalled),
        recordingSessionName,
        isOnline,
      }
    })

    // If an IoT device was not found in SPARTA query (fallback), add it directly
    for (const [codeKey, devGroup] of iotDevicesByCode.entries()) {
      if (!processedStoreCodes.has(codeKey)) {
        const isRecording = devGroup.some((d) => d.isRecording)
        const isOnline = devGroup.some((d) => d.online)
        const status: StoreStatus = isRecording ? 'live' : (isOnline ? 'live' : 'historical')
        const recordingDevice = devGroup.find((d) => d.isRecording && d.recordingSessionName)
        const recordingSessionName = recordingDevice?.recordingSessionName || devGroup.find((d) => d.recordingSessionName)?.recordingSessionName

        const allPhases: PhaseData[] = []
        devGroup.forEach((d) => {
          d.phases.forEach((p) => allPhases.push(p))
        })

        const primaryDev = devGroup.find((d) => d.isRecording) || devGroup.find((d) => d.online) || devGroup[0]

        let latestLastSeen = new Date(0).toISOString()
        devGroup.forEach((d) => {
          if (d.lastSeen && d.lastSeen > latestLastSeen) {
            latestLastSeen = d.lastSeen
          }
        })

        stores.unshift({
          id: `iot-${primaryDev.deviceId}`,
          code: primaryDev.storeCode || primaryDev.deviceId,
          name: primaryDev.deviceName || `Perangkat IoT (${primaryDev.deviceId})`,
          branch: 'CIANJUR',
          latitude: primaryDev.latitude || -6.86805,
          longitude: primaryDev.longitude || 107.10027,
          status,
          ...storeEnergy(devGroup),
          deviceCount: devGroup.length,
          lastUpdate: latestLastSeen === new Date(0).toISOString() ? '' : latestLastSeen,
          phases: allPhases,
          deviceId: primaryDev.deviceId,
          members: primaryDev.members,
          isRecording,
          recordingStalled: devGroup.some((d) => d.recordingStalled),
          recordingSessionName,
          isOnline,
        })
      }
    }

    return stores
  } catch (error) {
    console.error('Error in getStores:', error)
    return []
  }
}

// Get single store details
async function loadStoreById(storeId: string): Promise<Store | null> {
  const stores = await getStores()
  const found = stores.find(
    (s) => s.id === storeId || s.code.toUpperCase() === storeId.toUpperCase()
  )
  if (found) return found

  // A limited scope (GS) only reaches stores of its assigned devices, never other DB 1 stores.
  if ((await getRequestScope()).kind !== 'all') return null

  // If queried by direct ID or code from SPARTA DB
  const sparta = getSpartaPool()
  try {
    const res = await sparta.query(
      `
      SELECT id, code, name, branch, pln_power_va, sales_area_m2, warehouse_area_m2, is_24_hours, latitude, longitude
      FROM stores
      WHERE id::text = $1 OR UPPER(code) = UPPER($1)
      LIMIT 1
    `,
      [storeId]
    )

    if (res.rows.length === 0) return null
    const s = res.rows[0]

    // Check if this store happens to have an active IoT device
    const iotDevices = await getIotDeviceDataList()
    const iot = iotDevices.find((d) => d.storeCode === s.code)

    return {
      id: s.id,
      code: s.code,
      name: s.name,
      branch: s.branch || 'Head Office',
      latitude: s.latitude ? parseFloat(s.latitude) : undefined,
      longitude: s.longitude ? parseFloat(s.longitude) : undefined,
      status: iot ? 'live' : 'unassigned',
      ...storeEnergy(iot ? [iot] : []),
      deviceCount: iot ? 1 : 0,
      lastUpdate: iot?.lastSeen || new Date().toISOString(),
      phases: iot?.phases ?? [],
      deviceId: iot?.deviceId,
      plnPowerVa: s.pln_power_va ? parseInt(s.pln_power_va) : undefined,
      is24Hours: s.is_24_hours,
      salesAreaM2: s.sales_area_m2 ? parseFloat(s.sales_area_m2) : undefined,
      warehouseAreaM2: s.warehouse_area_m2 ? parseFloat(s.warehouse_area_m2) : undefined,
    }
  } catch (err) {
    console.error('Error fetching store by ID:', err)
    return null
  }
}
