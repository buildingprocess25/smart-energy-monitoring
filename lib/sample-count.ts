// Actual against expected rows in history, per Jakarta hour and day, only while a session records.
// No `@/` imports, so `node --test` can load this file directly.
import { JAKARTA_OFFSET_MS, jakartaDate } from './jakarta-range.ts'

// Flask writes one row per sensor every 15 seconds: 240 per hour.
export const SAMPLE_MS = 15_000
export const HOUR_MS = 60 * 60 * 1000
const DAY_MS = 24 * HOUR_MS
const COMPLETE_SHARE = 0.9

// One sensor, one session, one hour.
export interface SampleRow {
  sessionId: string
  hour: number // epoch ms / HOUR_MS
  valid: number
  offline: number
  invalid: number // voltage or current out of range
  first: number // epoch ms
  last: number
}

export interface SampleCount {
  expected: number
  valid: number
  offline: number
  invalid: number
  missing: number // expected, but no row was written
}

export type SampleHour = SampleCount & { hour: number } // Jakarta hour, 0 to 23
export type SampleDay = SampleCount & { date: string }

type Range = { from: number; to: number }

const empty = (): SampleCount => ({ expected: 0, valid: 0, offline: 0, invalid: 0, missing: 0 })

export function addCounts(counts: SampleCount[]): SampleCount {
  const sum = empty()
  for (const c of counts) {
    sum.expected += c.expected
    sum.valid += c.valid
    sum.offline += c.offline
    sum.invalid += c.invalid
    sum.missing += c.missing
  }
  return sum
}

// Floored to one decimal, so 100% always means nothing is missing.
export const validPercent = (c: SampleCount): number | null =>
  c.expected > 0 ? Math.floor((c.valid / c.expected) * 1000) / 10 : null

export const isComplete = (c: SampleCount): boolean => c.expected > 0 && c.valid / c.expected >= COMPLETE_SHARE

// Sessions that overlap are one recording, so their time is not expected twice.
function recordingRanges(rows: SampleRow[], openSession: { id: string; until: number } | null): Range[] {
  const sessions = new Map<string, Range>()
  for (const row of rows) {
    const known = sessions.get(row.sessionId)
    const to = row.last + SAMPLE_MS
    if (known) {
      known.from = Math.min(known.from, row.first)
      known.to = Math.max(known.to, to)
    } else sessions.set(row.sessionId, { from: row.first, to })
  }
  const open = openSession && sessions.get(openSession.id)
  if (open) open.to = Math.max(open.to, openSession!.until)

  const merged: Range[] = []
  for (const range of [...sessions.values()].sort((a, b) => a.from - b.from)) {
    const last = merged[merged.length - 1]
    if (last && range.from <= last.to) last.to = Math.max(last.to, range.to)
    else merged.push({ ...range })
  }
  return merged
}

// Samples of a range fall on from, from + 15 s, ... up to but not including to.
const samplesBefore = (range: Range, time: number): number =>
  Math.ceil((Math.min(Math.max(time, range.from), range.to) - range.from) / SAMPLE_MS)

// Keys are hours since the epoch; hours outside every session are left out.
// openSession: a recording that stopped writing rows still expects them until then.
export function countHours(
  rows: SampleRow[],
  openSession: { id: string; until: number } | null = null
): Map<number, SampleCount> {
  const hours = new Map<number, SampleCount>()
  for (const range of recordingRanges(rows, openSession)) {
    for (let h = Math.floor(range.from / HOUR_MS); h * HOUR_MS < range.to; h++) {
      const expected = samplesBefore(range, (h + 1) * HOUR_MS) - samplesBefore(range, h * HOUR_MS)
      const count = hours.get(h) ?? empty()
      count.expected += expected
      hours.set(h, count)
    }
  }
  for (const row of rows) {
    const count = hours.get(row.hour)
    if (!count) continue
    count.valid += row.valid
    count.offline += row.offline
    count.invalid += row.invalid
  }
  for (const [h, count] of hours) {
    // Shifted or overlapping sessions can hold a few rows more than expected.
    count.valid = Math.min(count.valid, count.expected)
    count.missing = Math.max(0, count.expected - count.valid - count.offline - count.invalid)
    if (count.expected === 0) hours.delete(h)
  }
  return hours
}

// Start of the Jakarta day `days - 1` days before today.
export const windowStart = (now: number, days: number): number =>
  Math.floor((now + JAKARTA_OFFSET_MS) / DAY_MS) * DAY_MS - JAKARTA_OFFSET_MS - (days - 1) * DAY_MS

// Every Jakarta day of the window, oldest first; expected is 0 when nothing was recorded.
export function countDays(hours: Map<number, SampleCount>, now: number, days: number): SampleDay[] {
  const start = windowStart(now, days)
  return Array.from({ length: days }, (_, i) => {
    const date = jakartaDate(start + i * DAY_MS)
    return { date, ...addCounts(hoursOfDate(hours, date)) }
  })
}

export function hoursOfDate(hours: Map<number, SampleCount>, date: string): SampleHour[] {
  const first = (Date.parse(`${date}T00:00:00Z`) - JAKARTA_OFFSET_MS) / HOUR_MS
  return Array.from({ length: 24 }, (_, hour) => ({ hour, ...(hours.get(first + hour) ?? empty()) }))
}
