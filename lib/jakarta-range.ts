// No imports, so `node --test` can load this file directly. Jakarta has no daylight saving.

export const JAKARTA_OFFSET_MS = 7 * 60 * 60 * 1000
const DAY_MS = 24 * 60 * 60 * 1000

export function jakartaDate(epochMs: number): string {
  return new Date(epochMs + JAKARTA_OFFSET_MS).toISOString().slice(0, 10)
}

// Epoch bounds [from, to) of the period that holds `date`; a week is the 7 days ending on it.
export function jakartaRange(
  range: 'day' | 'week' | 'month' | 'year',
  date: string
): { from: number; to: number } {
  const [y, m, d] = date.split('-').map(Number)
  const start = (year: number, month: number, day: number) => Date.UTC(year, month, day) - JAKARTA_OFFSET_MS
  if (range === 'year') return { from: start(y, 0, 1), to: start(y + 1, 0, 1) }
  if (range === 'month') return { from: start(y, m - 1, 1), to: start(y, m, 1) }
  const to = start(y, m - 1, d) + DAY_MS
  return { from: to - (range === 'week' ? 7 : 1) * DAY_MS, to }
}
