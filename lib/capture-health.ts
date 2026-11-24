// No imports, so `node --test` can load this file directly.

const MIN_LIMIT_MS = 2 * 60_000
const DEFAULT_INTERVAL_S = 15

// Flask writes "HH:MM:SS DD/MM/YYYY" in WIB.
export function parseWibTimestamp(text: string | null | undefined): number | null {
  const m = text?.match(/^(\d{2}:\d{2}(?::\d{2})?) (\d{2})\/(\d{2})\/(\d{4})$/)
  if (!m) return null
  const ms = Date.parse(`${m[4]}-${m[3]}-${m[2]}T${m[1]}+07:00`)
  return Number.isNaN(ms) ? null : ms
}

// Flask can report a recording as active while nothing is written, so rows decide.
// lastRecordAt: null means no row yet, undefined means it could not be read.
export function isCaptureStalled(
  capture: {
    active: boolean
    interval: number | null
    startedAt: string | null
    lastRecordAt: number | null | undefined
  },
  now: number
): boolean {
  if (!capture.active || capture.lastRecordAt === undefined) return false
  const since = Math.max(capture.lastRecordAt ?? -Infinity, parseWibTimestamp(capture.startedAt) ?? -Infinity)
  if (!Number.isFinite(since)) return false
  return now - since > Math.max(MIN_LIMIT_MS, (capture.interval ?? DEFAULT_INTERVAL_S) * 3000)
}
