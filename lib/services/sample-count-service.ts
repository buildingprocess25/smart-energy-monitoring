import 'server-only'
import { cache } from 'react'
import { getTelemetryPool } from '@/lib/db/pools'
import { readOnlyQuery } from '@/lib/db/read-only'
import { normalizePhaseKey } from '@/lib/phase-keys'
import { getManagedDevices } from '@/lib/services/device-service'
import { PHASE_SQL, SENSOR_PHASE_SQL, VALID_SAMPLE_SQL } from '@/lib/services/energy-service'
import { HEALTH_DAYS } from '@/lib/services/health-service'
import { createStaleCache } from '@/lib/stale-cache'
import type { ManagedDevice } from '@/lib/types'
import {
  addCounts,
  countDays,
  countHours,
  HOUR_MS,
  hoursOfDate,
  isComplete,
  windowStart,
  type SampleCount,
  type SampleDay,
  type SampleHour,
  type SampleRow,
} from '@/lib/sample-count'

const TTL_MS = 5 * 60_000
const READ_TIMEOUT_MS = 30_000

type DbRow = {
  device_id: string
  phase: string
  session_id: string
  hour: string
  valid: string
  offline: string
  total: string
  first: string
  last: string
}
type Counts = { readAt: number; rows: Map<string, SampleRow[]> }

export const sampleKey = (deviceId: string, phase: string) => `${deviceId}\n${phase}`

// The energy index cannot answer this: it reads the newest rows more than once and leaves offline rows out.
async function loadCounts(): Promise<Counts> {
  const readAt = Date.now()
  const res = await readOnlyQuery<DbRow>(
    getTelemetryPool(),
    `SELECT device_id, ${PHASE_SQL} AS phase, COALESCE(session_id, '') AS session_id, epoch / ${HOUR_MS} AS hour,
            COUNT(*) FILTER (WHERE ${VALID_SAMPLE_SQL}) AS valid,
            COUNT(*) FILTER (WHERE offline IS TRUE) AS offline,
            COUNT(*) AS total, MIN(epoch) AS first, MAX(epoch) AS last
     FROM history
     WHERE epoch >= $1 AND ${SENSOR_PHASE_SQL}
     GROUP BY 1, 2, 3, 4`,
    [windowStart(readAt, HEALTH_DAYS)],
    READ_TIMEOUT_MS
  )
  const rows: Counts['rows'] = new Map()
  for (const r of res.rows) {
    const key = sampleKey(r.device_id, r.phase)
    const valid = Number(r.valid)
    const offline = Number(r.offline)
    const row: SampleRow = {
      sessionId: r.session_id,
      hour: Number(r.hour),
      valid,
      offline,
      invalid: Number(r.total) - valid - offline,
      first: Number(r.first),
      last: Number(r.last),
    }
    const list = rows.get(key)
    if (list) list.push(row)
    else rows.set(key, [row])
  }
  return { readAt, rows }
}

// Pages and API routes are bundled apart; globalThis gives them one cache. It holds every device.
declare global {
  var _sampleCountCache: ReturnType<typeof createStaleCache<Counts>> | undefined
}
const countsCache = (globalThis._sampleCountCache ??= createStaleCache<Counts>({
  ttlMs: TTL_MS,
  onError: (error) => console.error('Error refreshing sample counts:', error),
}))

function sensorHours(counts: Counts, device: ManagedDevice, phase: string): Map<number, SampleCount> {
  const capture = device.capture
  const stalled = capture?.active && capture.stalled && capture.sessionId
  return countHours(
    counts.rows.get(sampleKey(device.id, phase)) ?? [],
    stalled ? { id: stalled, until: counts.readAt } : null
  )
}

export interface SensorSamples {
  days: SampleDay[]
  total: SampleCount
  recordedDays: number
  completeDays: number
}

// Keys come from sampleKey(); only devices in the viewer's scope.
export const getSampleCoverage = cache(async (): Promise<{ readAt: number; sensors: Map<string, SensorSamples> }> => {
  const devices = await getManagedDevices()
  const sensors = new Map<string, SensorSamples>()
  if (devices.length === 0) return { readAt: Date.now(), sensors }
  const counts = await countsCache('all', loadCounts)
  for (const device of devices) {
    for (const sensor of device.sensors) {
      const phase = normalizePhaseKey(sensor.phase)
      const days = countDays(sensorHours(counts, device, phase), counts.readAt, HEALTH_DAYS)
      const recorded = days.filter((d) => d.expected > 0)
      sensors.set(sampleKey(device.id, phase), {
        days,
        total: addCounts(days),
        recordedDays: recorded.length,
        completeDays: recorded.filter(isComplete).length,
      })
    }
  }
  return { readAt: counts.readAt, sensors }
})

// null when the viewer may not see the device or it has no such sensor.
export async function getSampleHours(deviceId: string, phase: string, date: string): Promise<SampleHour[] | null> {
  const device = (await getManagedDevices()).find((d) => d.id === deviceId)
  const key = normalizePhaseKey(phase)
  if (!device?.sensors.some((s) => normalizePhaseKey(s.phase) === key)) return null
  return hoursOfDate(sensorHours(await countsCache('all', loadCounts), device, key), date)
}
