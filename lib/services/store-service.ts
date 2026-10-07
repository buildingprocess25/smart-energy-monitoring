import { getSpartaPool, getTelemetryPool } from '@/lib/db/pools'
import { Store, PhaseData, StoreStatus } from '@/lib/types'

// Helper: Extract Store Code from IoT Device Name
// Examples: "Dc Cianjur ( 2JC2 )" -> "2JC2", "EM-0002 [TI90] RUKO ELEVEE" -> "TI90"
export function extractStoreCode(deviceName: string): string | null {
  if (!deviceName) return null
  const match = deviceName.match(/[(\[]\s*([A-Za-z0-9_-]+)\s*[)\]]/)
  if (match && match[1]) {
    return match[1].trim().toUpperCase()
  }
  return null
}

// Helper: Parse last_seen string ("09:52:42 21/08/2026") into ISO string
export function parseLastSeenToIso(lastSeenStr?: string | null): string {
  if (!lastSeenStr) return new Date().toISOString()
  
  // Format: "HH:mm:ss DD/MM/YYYY" or "HH:mm DD/MM/YYYY"
  const match = lastSeenStr.trim().match(/^(\d{1,2}):(\d{2})(?::(\d{2}))?\s+(\d{1,2})\/(\d{1,2})\/(\d{4})$/)
  if (match) {
    const hours = parseInt(match[1])
    const minutes = parseInt(match[2])
    const seconds = match[3] ? parseInt(match[3]) : 0
    const day = parseInt(match[4])
    const month = parseInt(match[5]) - 1 // 0-indexed
    const year = parseInt(match[6])

    const date = new Date(year, month, day, hours, minutes, seconds)
    if (!isNaN(date.getTime())) {
      return date.toISOString()
    }
  }

  // Fallback: Check if already valid Date
  const parsed = new Date(lastSeenStr)
  if (!isNaN(parsed.getTime())) {
    return parsed.toISOString()
  }

  return new Date().toISOString()
}

interface IotDeviceData {
  deviceId: string
  deviceName: string
  storeCode: string | null
  online: boolean
  lastSeen: string
  phases: PhaseData[]
  kwhTotal: number
  isRecording: boolean
  recordingSessionName?: string
  latitude?: number
  longitude?: number
  storeId?: string
}

// Fetch latest metrics from IoT Telemetry Database (Biznet VPS)
// In-memory cache for device energy totals to prevent redundant 1.2M row table scans
const _deviceEnergyCache = new Map<string, { kwh: number; timestamp: number }>()
const DEVICE_CACHE_TTL_MS = 2 * 60 * 1000 // 2 minutes TTL

interface SensorConfig {
  name: string
  phase: string
  enabled?: boolean
}

export async function getIotDeviceDataList(): Promise<IotDeviceData[]> {
  const telemetryDb = getTelemetryPool()
  const now = Date.now()

  try {
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

    // Fetch active capture states from Flask IoT Engine API in parallel (with fast 1.5s timeout)
    const liveApiCaptureMap = new Map<string, { active: boolean; session_name?: string }>()
    try {
      const apiUrl = process.env.NEXT_PUBLIC_TELEMETRY_API_URL || 'http://103.127.99.241:5000/api'
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 1500)
      const res = await fetch(`${apiUrl}/capture/status`, {
        signal: controller.signal,
        cache: 'no-store',
      })
      clearTimeout(timeoutId)
      if (res.ok) {
        const data = await res.json()
        if (data && data.devices) {
          for (const [did, dinfo] of Object.entries(data.devices as Record<string, any>)) {
            if (dinfo && (dinfo.active || dinfo.finalizing)) {
              liveApiCaptureMap.set(did, {
                active: true,
                session_name: dinfo.session_name,
              })
            }
          }
        }
      }
    } catch {
      // Graceful fallback to DB capture_states
    }

    const results: IotDeviceData[] = []

    for (const dev of devRows) {
      const storeCode = extractStoreCode(dev.name)

      let captureStateObj: any = null
      if (dev.capture_state) {
        if (typeof dev.capture_state === 'object') {
          captureStateObj = dev.capture_state
        } else if (typeof dev.capture_state === 'string') {
          try {
            captureStateObj = JSON.parse(dev.capture_state)
          } catch {}
        }
      }

      const apiCapture = liveApiCaptureMap.get(dev.id)
      const isRecording = Boolean(
        apiCapture?.active || (captureStateObj && captureStateObj.active === true)
      )
      const recordingSessionName =
        apiCapture?.session_name ||
        captureStateObj?.session_name ||
        captureStateObj?.session_id
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

      // 1. Fetch latest telemetry from telemetry table (fast, ~1ms)
      let telemRows: any[] = []
      try {
        const telemRes = await telemetryDb.query(
          `
          SELECT DISTINCT ON (phase) phase, voltage, current, power, power_factor, energy, timestamp, epoch
          FROM telemetry
          WHERE device_id = $1
          ORDER BY phase, epoch DESC
        `,
          [dev.id]
        )
        telemRows = telemRes.rows
      } catch (tErr) {
        console.warn('Error querying telemetry:', tErr)
      }

      // If telemetry table has no rows (device offline/archived), fallback to latest history records using index (fast, ~2ms)
      if (telemRows.length === 0) {
        try {
          const histRes = await telemetryDb.query(
            `
            SELECT DISTINCT ON (phase) phase, phase_name, voltage, current, power, power_factor, energy, timestamp, epoch
            FROM (
              SELECT phase, phase_name, voltage, current, power, power_factor, energy, timestamp, epoch
              FROM history
              WHERE device_id = $1
              ORDER BY id DESC
              LIMIT 30
            ) sub
            ORDER BY phase, epoch DESC
          `,
            [dev.id]
          )
          telemRows = histRes.rows
        } catch (hErr) {
          console.warn('Error querying history fallback:', hErr)
        }
      }

      // 2. Query or retrieve cached total energy
      let calculatedKwhTotal = 0
      const cached = _deviceEnergyCache.get(dev.id)
      if (cached && now - cached.timestamp < DEVICE_CACHE_TTL_MS) {
        calculatedKwhTotal = cached.kwh
      } else {
        try {
          const energyRes = await telemetryDb.query(
            `
            SELECT COALESCE(SUM(phase_delta), 0) as total_kwh
            FROM (
              SELECT session_id, phase, GREATEST(0, MAX(energy) - MIN(energy)) as phase_delta
              FROM history 
              WHERE device_id = $1 AND energy > 0 AND phase != 'L6' AND phase NOT ILIKE '%dummy%'
              GROUP BY session_id, phase
            ) sub
          `,
            [dev.id]
          )

          if (energyRes.rows.length > 0) {
            calculatedKwhTotal = parseFloat(energyRes.rows[0].total_kwh) || 0
          }
          _deviceEnergyCache.set(dev.id, { kwh: calculatedKwhTotal, timestamp: now })
        } catch (eErr) {
          console.warn('Error calculating total energy:', eErr)
        }
      }

      const phases: PhaseData[] = []
      let fallbackInstantEnergy = 0

      for (const row of telemRows) {
        const v = parseFloat(row.voltage) || 0
        const a = parseFloat(row.current) || 0
        const w = parseFloat(row.power) || 0
        const pf = parseFloat(row.power_factor) || 0
        const kwh = parseFloat(row.energy) || 0

        const sInfo = sensorMap.get(row.phase)
        let sensorName = sInfo?.name || row.phase_name

        // Smart fallback if not defined in sensors JSON or history
        if (!sensorName) {
          if (row.phase === 'L12' || row.phase === 'L1' || row.phase === 'R') sensorName = 'Fase R'
          else if (row.phase === 'L13' || row.phase === 'L2' || row.phase === 'S') sensorName = 'Fase S'
          else if (row.phase === 'L14' || row.phase === 'L3' || row.phase === 'T') sensorName = 'Fase T'
          else sensorName = `Sensor ${row.phase}`
        }

        const isDummy = sensorName.toLowerCase().includes('dummy')
        if (!isDummy) {
          fallbackInstantEnergy += kwh
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

      const finalKwhTotal =
        calculatedKwhTotal > 0
          ? calculatedKwhTotal
          : fallbackInstantEnergy

      results.push({
        deviceId: dev.id,
        deviceName: dev.name,
        storeCode,
        online: dev.online ?? true,
        lastSeen: parseLastSeenToIso(dev.last_seen),
        phases: phases.length > 0 ? phases : [
          { phase: 'L1', phaseName: 'Fase R', voltage: 0, current: 0, power: 0, powerFactor: 1.0 },
          { phase: 'L2', phaseName: 'Fase S', voltage: 0, current: 0, power: 0, powerFactor: 1.0 },
          { phase: 'L3', phaseName: 'Fase T', voltage: 0, current: 0, power: 0, powerFactor: 1.0 },
        ],
        kwhTotal: Math.round(finalKwhTotal * 10) / 10,
        isRecording,
        recordingSessionName,
        latitude: lat,
        longitude: lng,
        storeId: dev.store_id || undefined,
      })
    }

    return results
  } catch (error) {
    console.error('Error fetching IoT device data:', error)
    return []
  }
}

// Get only stores that actually have IoT devices registered in database
export async function getStores(): Promise<Store[]> {
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

      // Aggregate total energy across all store devices
      const kwhTotal = matchingDevices.reduce((sum, d) => sum + (d.kwhTotal || 0), 0)
      const deviceCount = matchingDevices.length > 0 ? matchingDevices.length : 1

      // Find the most recent lastSeen
      let latestLastSeen = new Date(0).toISOString()
      matchingDevices.forEach((d) => {
        if (d.lastSeen && d.lastSeen > latestLastSeen) {
          latestLastSeen = d.lastSeen
        }
      })
      if (latestLastSeen === new Date(0).toISOString()) {
        latestLastSeen = new Date().toISOString()
      }

      const primaryIot = matchingDevices.find((d) => d.isRecording) || matchingDevices.find((d) => d.online) || matchingDevices[0]
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
        kwhTotal: Math.round(kwhTotal * 10) / 10,
        deviceCount,
        lastUpdate: latestLastSeen,
        phases: allPhases.length > 0 ? allPhases : [
          { phase: 'L1', phaseName: 'Fase R', voltage: 0, current: 0, power: 0, powerFactor: 1.0 },
          { phase: 'L2', phaseName: 'Fase S', voltage: 0, current: 0, power: 0, powerFactor: 1.0 },
          { phase: 'L3', phaseName: 'Fase T', voltage: 0, current: 0, power: 0, powerFactor: 1.0 },
        ],
        deviceId: primaryIot?.deviceId,
        plnPowerVa: s.pln_power_va ? parseInt(s.pln_power_va) : undefined,
        is24Hours: s.is_24_hours,
        salesAreaM2: s.sales_area_m2 ? parseFloat(s.sales_area_m2) : undefined,
        warehouseAreaM2: s.warehouse_area_m2 ? parseFloat(s.warehouse_area_m2) : undefined,
        isRecording,
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

        const totalKwh = devGroup.reduce((sum, d) => sum + (d.kwhTotal || 0), 0)
        const primaryDev = devGroup.find((d) => d.isRecording) || devGroup.find((d) => d.online) || devGroup[0]

        let latestLastSeen = new Date(0).toISOString()
        devGroup.forEach((d) => {
          if (d.lastSeen && d.lastSeen > latestLastSeen) {
            latestLastSeen = d.lastSeen
          }
        })
        if (latestLastSeen === new Date(0).toISOString()) {
          latestLastSeen = new Date().toISOString()
        }

        stores.unshift({
          id: `iot-${primaryDev.deviceId}`,
          code: primaryDev.storeCode || primaryDev.deviceId,
          name: primaryDev.deviceName || `Perangkat IoT (${primaryDev.deviceId})`,
          branch: 'CIANJUR',
          latitude: primaryDev.latitude || -6.86805,
          longitude: primaryDev.longitude || 107.10027,
          status,
          kwhTotal: Math.round(totalKwh * 10) / 10,
          deviceCount: devGroup.length,
          lastUpdate: latestLastSeen,
          phases: allPhases,
          deviceId: primaryDev.deviceId,
          isRecording,
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
export async function getStoreById(storeId: string): Promise<Store | null> {
  const stores = await getStores()
  const found = stores.find(
    (s) => s.id === storeId || s.code.toUpperCase() === storeId.toUpperCase()
  )
  if (found) return found

  // If queried by direct ID or code from SPARTA DB
  const sparta = getSpartaPool()
  try {
    const res = await sparta.query(
      `
      SELECT id, code, name, branch, pln_power_va, sales_area_m2, warehouse_area_m2, is_24_hours, latitude, longitude
      FROM stores
      WHERE id::text = $1 OR code ILIKE $1
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
      kwhTotal: iot?.kwhTotal || 0,
      deviceCount: iot ? 1 : 0,
      lastUpdate: iot?.lastSeen || new Date().toISOString(),
      phases: iot?.phases || [
        { phase: 'L1', voltage: 0, current: 0, power: 0, powerFactor: 1.0 },
        { phase: 'L2', voltage: 0, current: 0, power: 0, powerFactor: 1.0 },
        { phase: 'L3', voltage: 0, current: 0, power: 0, powerFactor: 1.0 },
      ],
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
