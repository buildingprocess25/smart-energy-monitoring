import { getSpartaPool, getAivenPool } from '@/lib/db/pools'
import { Store, PhaseData, StoreStatus } from '@/lib/types'

// Helper: Extract Store Code from IoT Device Name
// Example: "Dc Cianjur ( 2JC2 )" -> "2JC2"
export function extractStoreCode(deviceName: string): string | null {
  if (!deviceName) return null
  const match = deviceName.match(/\(\s*([A-Za-z0-9_-]+)\s*\)/)
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
}

// Fetch latest metrics from Aiven IoT Database
interface SensorConfig {
  name: string
  phase: string
  enabled?: boolean
}

export async function getIotDeviceDataList(): Promise<IotDeviceData[]> {
  const aiven = getAivenPool()
  try {
    const devRes = await aiven.query(`
      SELECT id, name, online, last_seen, sensors 
      FROM devices
    `)

    const results: IotDeviceData[] = []

    for (const dev of devRes.rows) {
      const storeCode = extractStoreCode(dev.name)

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

      // Fetch latest telemetry for each phase of this device
      const telemRes = await aiven.query(
        `
        SELECT DISTINCT ON (phase) phase, voltage, current, power, power_factor, energy, timestamp, epoch
        FROM telemetry
        WHERE device_id = $1
        ORDER BY phase, id DESC
      `,
        [dev.id]
      )

      const phases: PhaseData[] = []
      let totalEnergy = 0

      for (const row of telemRes.rows) {
        const v = parseFloat(row.voltage) || 0
        const a = parseFloat(row.current) || 0
        const w = parseFloat(row.power) || 0
        const pf = parseFloat(row.power_factor) || 0
        const kwh = parseFloat(row.energy) || 0

        const sInfo = sensorMap.get(row.phase)
        let sensorName = sInfo?.name

        // Smart fallback if not defined in sensors JSON
        if (!sensorName) {
          if (row.phase === 'L12' || row.phase === 'L1') sensorName = 'Fase R'
          else if (row.phase === 'L13' || row.phase === 'L2') sensorName = 'Fase S'
          else if (row.phase === 'L14' || row.phase === 'L3') sensorName = 'Fase T'
          else sensorName = `Sensor ${row.phase}`
        }

        const isDummy = sensorName.toLowerCase().includes('dummy')
        if (!isDummy) {
          totalEnergy += kwh
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

      // Sort phases: Non-dummy (Fase R, S, T) first, dummy last
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
        lastSeen: parseLastSeenToIso(dev.last_seen),
        phases: phases.length > 0 ? phases : [
          { phase: 'L1', phaseName: 'Fase R', voltage: 0, current: 0, power: 0, powerFactor: 1.0 },
          { phase: 'L2', phaseName: 'Fase S', voltage: 0, current: 0, power: 0, powerFactor: 1.0 },
          { phase: 'L3', phaseName: 'Fase T', voltage: 0, current: 0, power: 0, powerFactor: 1.0 },
        ],
        kwhTotal: Math.round(totalEnergy * 10) / 10,
      })
    }

    return results
  } catch (error) {
    console.error('Error fetching IoT device data:', error)
    return []
  }
}

// Get only stores that actually have IoT devices registered in Aiven
export async function getStores(): Promise<Store[]> {
  const sparta = getSpartaPool()

  try {
    // 1. Get IoT devices from Aiven (currently 1 device: MC1 / 2JC2)
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

    const iotMapByCode = new Map<string, IotDeviceData>()
    iotDevices.forEach((d) => {
      if (d.storeCode) iotMapByCode.set(d.storeCode, d)
    })

    const stores: Store[] = storesRes.rows.map((s) => {
      const iot = iotMapByCode.get(s.code)

      const status: StoreStatus = 'live'
      const phases: PhaseData[] = iot?.phases || [
        { phase: 'L1', voltage: 0, current: 0, power: 0, powerFactor: 1.0 },
        { phase: 'L2', voltage: 0, current: 0, power: 0, powerFactor: 1.0 },
        { phase: 'L3', voltage: 0, current: 0, power: 0, powerFactor: 1.0 },
      ]

      const kwhTotal = iot?.kwhTotal || 0
      const deviceCount = 1
      const lastUpdate = iot?.lastSeen || new Date().toISOString()

      return {
        id: s.id,
        code: s.code,
        name: s.name,
        branch: s.branch || 'Head Office',
        latitude: s.latitude ? parseFloat(s.latitude) : undefined,
        longitude: s.longitude ? parseFloat(s.longitude) : undefined,
        status,
        kwhTotal,
        deviceCount,
        lastUpdate,
        phases,
        deviceId: iot?.deviceId,
        plnPowerVa: s.pln_power_va ? parseInt(s.pln_power_va) : undefined,
        is24Hours: s.is_24_hours,
        salesAreaM2: s.sales_area_m2 ? parseFloat(s.sales_area_m2) : undefined,
        warehouseAreaM2: s.warehouse_area_m2 ? parseFloat(s.warehouse_area_m2) : undefined,
      }
    })

    // If an IoT device was not found in SPARTA query (fallback), add it directly
    for (const iot of iotDevices) {
      const alreadyInList = stores.some(
        (st) => st.code.toUpperCase() === (iot.storeCode || '').toUpperCase()
      )
      if (!alreadyInList) {
        stores.unshift({
          id: `iot-${iot.deviceId}`,
          code: iot.storeCode || '2JC2',
          name: iot.deviceName,
          branch: 'CIANJUR',
          latitude: -6.86805,
          longitude: 107.10027,
          status: 'live',
          kwhTotal: iot.kwhTotal,
          deviceCount: 1,
          lastUpdate: iot.lastSeen,
          phases: iot.phases,
          deviceId: iot.deviceId,
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
