// Query string checks for the store API routes.
// No imports, so `node --test` can load this file directly.

export const RANGE_TYPES = ['day', 'week', 'month', 'year', 'session'] as const
export type RangeType = (typeof RANGE_TYPES)[number]

export const MAX_PAGE_SIZE = 500
const MAX_SESSION_ID_LENGTH = 200

// A real calendar date written as YYYY-MM-DD.
export function isIsoDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false
  const date = new Date(`${value}T00:00:00Z`)
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value
}

function parsePositiveInt(raw: string | null, max: number): number | undefined | null {
  if (raw === null) return undefined
  if (!/^\d+$/.test(raw)) return null
  const value = Number(raw)
  return value >= 1 && value <= max ? value : null
}

export type HistoryParams = {
  rangeType: RangeType
  date?: string
  sessionId?: string
  page?: number
  pageSize?: number
}

export type ParseResult<T> = { ok: true; value: T } | { ok: false; error: string }

export function parseDateParam(raw: string | null): ParseResult<string | undefined> {
  if (raw === null || raw === '') return { ok: true, value: undefined }
  return isIsoDate(raw)
    ? { ok: true, value: raw }
    : { ok: false, error: 'Parameter date harus berformat YYYY-MM-DD.' }
}

export function parseHistoryParams(params: URLSearchParams): ParseResult<HistoryParams> {
  const rawRange = params.get('rangeType') || 'day'
  if (!(RANGE_TYPES as readonly string[]).includes(rawRange)) {
    return { ok: false, error: `Parameter rangeType harus salah satu dari: ${RANGE_TYPES.join(', ')}.` }
  }

  const date = parseDateParam(params.get('date'))
  if (!date.ok) return date

  const sessionId = params.get('sessionId') || undefined
  if (sessionId && sessionId.length > MAX_SESSION_ID_LENGTH) {
    return { ok: false, error: 'Parameter sessionId terlalu panjang.' }
  }

  const page = parsePositiveInt(params.get('page'), Number.MAX_SAFE_INTEGER)
  if (page === null) return { ok: false, error: 'Parameter page harus bilangan bulat mulai 1.' }

  const pageSize = parsePositiveInt(params.get('pageSize'), MAX_PAGE_SIZE)
  if (pageSize === null) {
    return { ok: false, error: `Parameter pageSize harus bilangan bulat 1 sampai ${MAX_PAGE_SIZE}.` }
  }

  return {
    ok: true,
    value: { rangeType: rawRange as RangeType, date: date.value, sessionId, page, pageSize },
  }
}
