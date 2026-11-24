import 'server-only'
import { cache } from 'react'
import { getRequestScope } from '@/lib/auth/access'
import { isDeviceAllowed } from '@/lib/auth/access-rules'
import { computeAlerts, type Alert, type AlertDevice, type AlertSensor } from '@/lib/alerts'
import { coverageDays, coverageSummary, type CoverageDay } from '@/lib/coverage'
import { getTelemetryPool } from '@/lib/db/pools'
import { readOnlyQuery } from '@/lib/db/read-only'
import { BUCKET_MS } from '@/lib/energy-index'
import { normalizePhaseKey } from '@/lib/phase-keys'
import { getManagedDevices } from '@/lib/services/device-service'
import { getEnergyIndex, VALID_SAMPLE_SQL } from '@/lib/services/energy-service'
import { extractStoreCode } from '@/lib/store-code'
import { createStaleCache } from '@/lib/stale-cache'

export const HEALTH_DAYS = 30
const RECENT_MS = 2 * 60 * 60 * 1000
const DAY_MS = 24 * 60 * 60 * 1000

type RecentRow = { device_id: string; phase: string; epoch: string; voltage: number | null; power_factor: number | null; power: number | null }

// Every device, shared by all viewers; callers pick the ones in scope.
const recentCache = createStaleCache<RecentRow[]>({
  ttlMs: 60_000,
  onError: (error) => console.error('Error refreshing recent telemetry:', error),
})

async function loadRecentRows(): Promise<RecentRow[]> {
  const res = await readOnlyQuery<RecentRow>(
    getTelemetryPool(),
    `SELECT device_id, phase, epoch, voltage, power_factor, power
     FROM telemetry
     WHERE epoch > $1 AND ${VALID_SAMPLE_SQL}
     ORDER BY epoch DESC
     LIMIT 5000`,
    [Date.now() - RECENT_MS]
  )
  return res.rows
}

export interface SensorHealth {
  phase: string
  name: string
  enabled: boolean
  lastSampleAt: number | null
  days: CoverageDay[]
  percent: number | null
  completeDays: number
}

export interface DeviceHealth {
  id: string
  name: string
  storeCode: string | null
  online: boolean
  kind: string
  sensors: SensorHealth[]
}

export const getDeviceHealth = cache(async (): Promise<{ devices: DeviceHealth[]; alerts: Alert[] }> => {
  const scope = await getRequestScope()
  if (scope.kind === 'none') return { devices: [], alerts: [] }
  const [devices, index, recent] = await Promise.all([
    getManagedDevices(),
    getEnergyIndex(),
    recentCache('all', loadRecentRows).catch(() => [] as RecentRow[]),
  ])
  const now = Date.now()
  const dayStart = Math.floor((now - DAY_MS) / BUCKET_MS)

  const alertDevices: AlertDevice[] = []
  const health: DeviceHealth[] = []
  for (const device of devices) {
    if (!isDeviceAllowed(scope, device.id)) continue
    const firstSampleAt = index.firstSampleAt(device.id)
    const storeCode = extractStoreCode(device.name)
    const alertSensors: AlertSensor[] = []
    const sensors = device.sensors.map((sensor): SensorHealth => {
      const key = normalizePhaseKey(sensor.phase)
      const info = index.phase(device.id, key)
      const days = coverageDays(info.buckets, now, HEALTH_DAYS, firstSampleAt)
      alertSensors.push({
        phase: key,
        name: sensor.name,
        enabled: sensor.enabled,
        lastSampleAt: info.lastSampleAt,
        counterSameSince: info.counterSameSince,
        avgWatts24h: index.averageWatts(device.id, key, dayStart),
        recent: recent
          .filter((r) => r.device_id === device.id && normalizePhaseKey(r.phase) === key)
          .map((r) => ({
            voltage: r.voltage ?? 0,
            powerFactor: r.power_factor ?? 0,
            power: r.power ?? 0,
            at: Number(r.epoch),
          })),
      })
      const { percent, completeDays } = coverageSummary(days)
      return { phase: key, name: sensor.name, enabled: sensor.enabled, lastSampleAt: info.lastSampleAt, days, percent, completeDays }
    })
    alertDevices.push({
      id: device.id,
      name: device.name,
      storeCode,
      online: device.online,
      deviceClock: device.deviceClock,
      recordingStalled: device.capture?.stalled === true,
      sensors: alertSensors,
    })
    health.push({ id: device.id, name: device.name, storeCode, online: device.online, kind: device.kind, sensors })
  }
  return { devices: health, alerts: computeAlerts(alertDevices, now) }
})
