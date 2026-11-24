// Power samples of myECO AC meters: file format, ranges and averages. Pure.
import { jakartaDate } from './jakarta-range.ts'
import { MYECO_POLL_MS, MYECO_STORES, type PowerSample } from './myeco.ts'

export const KEEP_DAYS = 30
const DAY_MS = 24 * 60 * 60_000
const MAX_BACKOFF_MS = 5 * 60_000
const KEY_LENGTH = 6

export const POWER_RANGES = {
  '1h': { ms: 60 * 60_000, bucketMs: MYECO_POLL_MS },
  '24h': { ms: DAY_MS, bucketMs: 2 * 60_000 },
  '7d': { ms: 7 * DAY_MS, bucketMs: 15 * 60_000 },
} as const
export type PowerRange = keyof typeof POWER_RANGES

export const isPowerRange = (value: string): value is PowerRange => Object.hasOwn(POWER_RANGES, value)

// The end of a meter id keeps a day near 1 MB; a test checks that it stays unique.
export const meterKey = (id: string) => id.slice(-KEY_LENGTH)
const METER_IDS = MYECO_STORES.flatMap((s) => s.meters.map((m) => m.id))
const idByKey = new Map(METER_IDS.map((id) => [meterKey(id), id]))

// Starts with a newline too, so a line cut off by a crash never spoils the next one.
export function encodeSamples(samples: PowerSample[]): string {
  const lines = samples.map(({ at, power }) => {
    const p: Record<string, number> = {}
    for (const id of METER_IDS) {
      const watts = power[id]
      if (typeof watts === 'number') p[meterKey(id)] = Math.round(watts)
    }
    return JSON.stringify({ t: at, p })
  })
  return lines.length > 0 ? `\n${lines.join('\n')}\n` : ''
}

export function decodeSamples(text: string): PowerSample[] {
  const samples: PowerSample[] = []
  for (const line of text.split('\n')) {
    if (line.trim() === '') continue
    let row: unknown
    try {
      row = JSON.parse(line)
    } catch {
      continue
    }
    const { t, p } = (row ?? {}) as { t?: unknown; p?: unknown }
    if (typeof t !== 'number' || !Number.isFinite(t) || typeof p !== 'object' || p === null) continue
    const power: PowerSample['power'] = {}
    for (const [key, watts] of Object.entries(p)) {
      const id = idByKey.get(key)
      if (id && typeof watts === 'number' && Number.isFinite(watts)) power[id] = watts
    }
    samples.push({ at: t, power })
  }
  return samples
}

// One sample per moment, in order. Two containers may write the same file during a deploy.
export function mergeSamples(...lists: PowerSample[][]): PowerSample[] {
  const byTime = new Map<number, PowerSample>()
  for (const list of lists) for (const sample of list) byTime.set(sample.at, sample)
  return [...byTime.values()].sort((a, b) => a.at - b.at)
}

// Averages per bucket and meter; a bucket without samples is left out.
export function averageSamples(samples: PowerSample[], ids: string[], from: number, bucketMs: number): PowerSample[] {
  const buckets = new Map<number, Map<string, { sum: number; count: number }>>()
  for (const { at, power } of samples) {
    if (at < from) continue
    const start = Math.floor(at / bucketMs) * bucketMs
    let meters = buckets.get(start)
    if (!meters) buckets.set(start, (meters = new Map()))
    for (const id of ids) {
      const watts = power[id]
      if (typeof watts !== 'number') continue
      const total = meters.get(id) ?? { sum: 0, count: 0 }
      total.sum += watts
      total.count += 1
      meters.set(id, total)
    }
  }
  return [...buckets.entries()]
    .sort(([a], [b]) => a - b)
    .map(([at, meters]) => ({
      at,
      power: Object.fromEntries(
        ids.map((id) => {
          const total = meters.get(id)
          return [id, total ? Math.round(total.sum / total.count) : null]
        })
      ),
    }))
}

export const fileName = (date: string) => `${date}.jsonl`

export function datesBetween(from: number, to: number): string[] {
  const last = jakartaDate(to)
  const dates = [jakartaDate(from)]
  for (let at = from + DAY_MS; dates[dates.length - 1] < last; at += DAY_MS) dates.push(jakartaDate(at))
  return dates
}

// Only names this module writes, so nothing else in the folder is ever removed.
export function expiredFiles(names: string[], now: number): string[] {
  const oldest = jakartaDate(now - (KEEP_DAYS - 1) * DAY_MS)
  return names.filter((name) => /^\d{4}-\d{2}-\d{2}\.jsonl$/.test(name) && name.slice(0, 10) < oldest)
}

export function nextDelay(failures: number): number {
  return Math.min(MYECO_POLL_MS * 2 ** failures, MAX_BACKOFF_MS)
}
