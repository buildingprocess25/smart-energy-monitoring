// No `@/` imports, so `node --test` can load this file directly.
import { BUCKET_MS } from './energy-index.ts'
import { JAKARTA_OFFSET_MS, jakartaDate } from './jakarta-range.ts'

const BUCKETS_PER_DAY = 96
const DAY_MS = BUCKETS_PER_DAY * BUCKET_MS
// A day with a short dropout still counts as complete.
const COMPLETE_SHARE = 0.9

export interface CoverageDay {
  date: string
  recorded: number // quarter hours with samples
  expected: number // quarter hours that have passed, or since the device first reported
}

// The last `days` Jakarta days, oldest first; days before the device first reported are left out.
export function coverageDays(
  buckets: ReadonlySet<number>,
  now: number,
  days: number,
  firstSampleAt: number | null
): CoverageDay[] {
  if (firstSampleAt === null) return []
  const todayStart = Math.floor((now + JAKARTA_OFFSET_MS) / DAY_MS) * DAY_MS - JAKARTA_OFFSET_MS
  const result: CoverageDay[] = []
  for (let i = days - 1; i >= 0; i--) {
    const start = todayStart - i * DAY_MS
    const from = Math.floor(Math.max(start, firstSampleAt) / BUCKET_MS)
    const to = Math.floor(Math.min(start + DAY_MS, now) / BUCKET_MS)
    if (to <= from) continue
    let recorded = 0
    for (let b = from; b < to; b++) if (buckets.has(b)) recorded++
    result.push({ date: jakartaDate(start), recorded, expected: to - from })
  }
  return result
}

export function coverageSummary(days: CoverageDay[]): { percent: number | null; completeDays: number; days: number } {
  const expected = days.reduce((sum, d) => sum + d.expected, 0)
  const recorded = days.reduce((sum, d) => sum + d.recorded, 0)
  return {
    percent: expected > 0 ? Math.round((recorded / expected) * 1000) / 10 : null,
    completeDays: days.filter((d) => d.recorded / d.expected >= COMPLETE_SHARE).length,
    days: days.length,
  }
}
