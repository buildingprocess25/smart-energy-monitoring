// Energy per device from 15-minute buckets of the cumulative counter.
// No `@/` imports, so `node --test` can load this file directly.
import { JAKARTA_OFFSET_MS, jakartaDate } from './jakarta-range.ts'

export const BUCKET_MS = 15 * 60 * 1000
const BUCKET_HOURS = 0.25
// Buckets further apart than this are separate recordings.
const MAX_STEP = 2
// Room for the counter's resolution on top of what the power explains.
const POWER_MARGIN = 1.8
const SLACK_KWH = 0.05

const MAIN_PHASES = new Set(['R', 'S', 'T'])

export interface BucketRow {
  deviceId: string
  phase: string // already normalized to R/S/T
  bucket: number // epoch ms / BUCKET_MS
  min: number | null // counter in kWh, null when the bucket has no reading
  max: number | null
  powerSum: number // watts
  count: number
}

export interface DailyEnergy {
  date: string
  kwh: number // main panel when the device has one, otherwise all its sensors
  mainKwh: number
  hours: number // time with a counter reading
  phases: Record<string, number>
}

export interface EnergyTotal {
  main: number
  all: number
  hasMain: boolean
}

type Bucket = Omit<BucketRow, 'deviceId' | 'phase'>
type DeviceSummary = { daily: DailyEnergy[]; total: EnergyTotal; dates: string[] }

const smaller = (a: number | null, b: number | null) => (a === null ? b : b === null ? a : Math.min(a, b))
const larger = (a: number | null, b: number | null) => (a === null ? b : b === null ? a : Math.max(a, b))

// A delta beyond what the power explains is a counter reset or a bad jump.
function guarded(delta: number, kw: number, hours: number): number {
  const expected = Math.max(0, kw) * hours
  return delta >= 0 && delta <= expected * POWER_MARGIN + SLACK_KWH ? delta : expected
}

function bucketEnergy(current: Bucket, previous: Bucket | null): number {
  if (current.min === null || current.max === null) return 0
  const kw = current.count > 0 ? current.powerSum / current.count / 1000 : 0
  if (previous && previous.max !== null && current.max >= previous.max) {
    const steps = current.bucket - previous.bucket
    if (steps <= MAX_STEP) return guarded(current.max - previous.max, kw, steps * BUCKET_HOURS)
  }
  return guarded(current.max - current.min, kw, BUCKET_HOURS)
}

export function createEnergyIndex() {
  const devices = new Map<string, Map<string, Map<number, Bucket>>>()
  const summaries = new Map<string, DeviceSummary>()

  function merge(rows: BucketRow[]) {
    for (const { deviceId, phase, ...row } of rows) {
      let phases = devices.get(deviceId)
      if (!phases) devices.set(deviceId, (phases = new Map()))
      let buckets = phases.get(phase)
      if (!buckets) phases.set(phase, (buckets = new Map()))
      const known = buckets.get(row.bucket)
      buckets.set(
        row.bucket,
        known
          ? {
              bucket: row.bucket,
              min: smaller(known.min, row.min),
              max: larger(known.max, row.max),
              powerSum: known.powerSum + row.powerSum,
              count: known.count + row.count,
            }
          : row
      )
      summaries.delete(deviceId)
    }
  }

  function summary(deviceId: string): DeviceSummary {
    const cached = summaries.get(deviceId)
    if (cached) return cached

    const days = new Map<string, Record<string, number>>()
    const recorded = new Map<string, Set<number>>()
    const total: EnergyTotal = { main: 0, all: 0, hasMain: false }

    for (const [phase, buckets] of devices.get(deviceId) ?? []) {
      let previous: Bucket | null = null
      for (const bucket of [...buckets.values()].sort((a, b) => a.bucket - b.bucket)) {
        const date = jakartaDate(bucket.bucket * BUCKET_MS)
        let phases = days.get(date)
        if (!phases) days.set(date, (phases = {}))
        if (bucket.max === null) continue
        const seen = recorded.get(date)
        if (seen) seen.add(bucket.bucket)
        else recorded.set(date, new Set([bucket.bucket]))

        const kwh = bucketEnergy(bucket, previous)
        previous = bucket
        phases[phase] = (phases[phase] ?? 0) + kwh
        total.all += kwh
        if (MAIN_PHASES.has(phase)) {
          total.main += kwh
          total.hasMain = true
        }
      }
    }

    const daily = [...days.entries()]
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, phases]) => {
        let main = 0
        let all = 0
        for (const [phase, kwh] of Object.entries(phases)) {
          all += kwh
          if (MAIN_PHASES.has(phase)) main += kwh
        }
        return { date, kwh: total.hasMain ? main : all, mainKwh: main, hours: (recorded.get(date)?.size ?? 0) * BUCKET_HOURS, phases }
      })
    const result = { daily, total, dates: daily.map((d) => d.date).reverse() }
    summaries.set(deviceId, result)
    return result
  }

  // Average watts per Jakarta hour, null where nothing was recorded.
  function loadProfile(deviceId: string, date: string): (number | null)[] {
    const hours = Array.from({ length: 24 }, (): number | null => null)
    const phases = devices.get(deviceId)
    if (!phases) return hours
    const { hasMain } = summary(deviceId).total

    for (const [phase, buckets] of phases) {
      if (hasMain && !MAIN_PHASES.has(phase)) continue
      const sums = hours.map(() => ({ power: 0, count: 0 }))
      const first = (Date.parse(`${date}T00:00:00Z`) - JAKARTA_OFFSET_MS) / BUCKET_MS
      for (let i = 0; i < 96; i++) {
        const bucket = buckets.get(first + i)
        if (!bucket) continue
        sums[Math.floor(i / 4)].power += bucket.powerSum
        sums[Math.floor(i / 4)].count += bucket.count
      }
      sums.forEach((s, hour) => {
        if (s.count > 0) hours[hour] = (hours[hour] ?? 0) + s.power / s.count
      })
    }
    return hours
  }

  return {
    merge,
    loadProfile,
    daily: (deviceId: string) => summary(deviceId).daily,
    total: (deviceId: string) => summary(deviceId).total,
    dates: (deviceId: string) => summary(deviceId).dates,
  }
}

export type EnergyIndex = ReturnType<typeof createEnergyIndex>
