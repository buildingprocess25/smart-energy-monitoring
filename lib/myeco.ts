// AC meters that a store has in myECO. They are sub-meters, so they never count in a store total.
import { JAKARTA_OFFSET_MS, jakartaDate } from './jakarta-range.ts'

export const MYECO_POLL_MS = 15_000
// Meters send about every 30 s.
const LATE_MS = 2 * 60_000
const HOUR_MS = 60 * 60_000
const MAX_AC_KWH_PER_HOUR = 10

export interface MyEcoStore {
  code: string // stores.code in DB 1
  meters: { id: string; label: string }[]
}

// By meter id, because a store's meters sit in more than one myECO room.
export const MYECO_STORES: MyEcoStore[] = [
  {
    code: 'TG14', // Exit Tol Jelupang
    meters: [
      { id: '6ad091c438648241ac8ee878', label: 'AC 1' },
      { id: '6ad091e338648241ac8ef149', label: 'AC 2' },
      { id: '6ad0920138648241ac8efa02', label: 'AC 3' },
      { id: '6ad0921a38648241ac8f0186', label: 'AC 4' },
      { id: '6ad0923138648241ac8f07d7', label: 'AC 5' },
    ],
  },
  {
    code: 'AC46', // Serpong Raya
    meters: [
      { id: '6ace585d38648241acfcbc9a', label: 'AC 1' },
      { id: '6ace58b338648241acfcd353', label: 'AC 2' },
      { id: '6ace58dd38648241acfcde85', label: 'AC 3' },
      { id: '6ace590238648241acfce7d8', label: 'AC 4' },
    ],
  },
  {
    code: 'AA77', // Pondok Kacang 3
    meters: [
      { id: '6979bae09e93383dbf4b4557', label: 'AC 1' },
      { id: '6979bac69e93383dbf4b3e48', label: 'AC 2' },
      { id: '6979baef9e93383dbf4b4923', label: 'AC 3' },
      { id: '6979bb009e93383dbf4b4dd5', label: 'AC 4' },
    ],
  },
]

export type MeterState = 'live' | 'late' | 'offline'

export interface MeterReading {
  power: number | null
  current: number | null
  voltage: number | null
  powerFactor: number | null
  kwhTotal: number | null
  updatedAt: number | null
  state: MeterState
}

export interface HourUsage {
  start: number // epoch ms
  kwh: number
}

export interface DayUsage {
  date: string // Jakarta
  kwh: number
  hours: number
}

export interface PowerSample {
  at: number
  power: Record<string, number | null> // meter id -> watts
}

export interface MyEcoLive {
  at: number
  meters: (MeterReading & { id: string; label: string; todayKwh: number | null })[]
  samples: PowerSample[]
}

export interface MyEcoPower {
  meters: { id: string; label: string }[]
  bucketMs: number
  samples: PowerSample[]
}

export interface MyEcoHistory {
  meters: { id: string; label: string; hours: HourUsage[]; days: DayUsage[] }[]
}

export function findMyEcoStore(code: string): MyEcoStore | null {
  const wanted = code.toUpperCase()
  return MYECO_STORES.find((s) => s.code === wanted) ?? null
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function numberIn(value: unknown, max: number): number | null {
  return typeof value === 'number' && Number.isFinite(value) && value >= 0 && value <= max ? value : null
}

function timeOf(value: unknown): number | null {
  const time = typeof value === 'string' ? Date.parse(value) : NaN
  return Number.isNaN(time) ? null : time
}

function listIn(raw: unknown, key: string): Record<string, unknown>[] {
  const data = isRecord(raw) ? raw.data : null
  const list = isRecord(data) ? data[key] : null
  return Array.isArray(list) ? list.filter(isRecord) : []
}

export function parseMeters(raw: unknown, now: number): Map<string, MeterReading> {
  const readings = new Map<string, MeterReading>()
  for (const m of listIn(raw, 'meters')) {
    if (typeof m.id !== 'string') continue
    const updatedAt = timeOf(m.updated_at)
    readings.set(m.id, {
      power: numberIn(m.current_power_watt, 50_000),
      current: numberIn(m.current_ampere, 500),
      voltage: numberIn(m.current_voltage, 300),
      powerFactor: numberIn(m.power_factor, 1),
      kwhTotal: numberIn(m.current_kwh, 100_000_000),
      updatedAt,
      state: m.is_online !== true ? 'offline' : updatedAt === null || now - updatedAt > LATE_MS ? 'late' : 'live',
    })
  }
  return readings
}

interface Log {
  hourEnd: number
  total: number | null
  kwh: number | null
}

function parseLogs(raw: unknown): Log[] {
  const byHour = new Map<number, Log>()
  for (const row of listIn(raw, 'logs')) {
    const time = timeOf(row.timestamp)
    if (time === null) continue
    // Logs land within seconds of the full hour, on either side.
    const hourEnd = Math.round(time / HOUR_MS) * HOUR_MS
    byHour.set(hourEnd, {
      hourEnd,
      total: numberIn(row.kwh_total, 100_000_000),
      kwh: numberIn(row.kwh, MAX_AC_KWH_PER_HOUR),
    })
  }
  return [...byHour.values()].sort((a, b) => a.hourEnd - b.hourEnd)
}

const round3 = (value: number) => Math.round(value * 1000) / 1000

// A log holds the energy of the hour before it. Hours without a log stay unknown.
export function hourlyUsage(raw: unknown): HourUsage[] {
  const logs = parseLogs(raw)
  return logs.flatMap((log, i) => {
    const previous = logs[i - 1]
    let kwh = log.kwh
    if (previous && log.hourEnd - previous.hourEnd === HOUR_MS && log.total !== null && previous.total !== null) {
      const delta = log.total - previous.total
      if (delta >= 0 && delta <= MAX_AC_KWH_PER_HOUR) kwh = delta
    }
    return kwh === null ? [] : [{ start: log.hourEnd - HOUR_MS, kwh: round3(kwh) }]
  })
}

export function dailyUsage(hours: HourUsage[]): DayUsage[] {
  const days = new Map<string, DayUsage>()
  for (const { start, kwh } of hours) {
    const date = jakartaDate(start)
    const day = days.get(date) ?? { date, kwh: 0, hours: 0 }
    day.kwh = round3(day.kwh + kwh)
    day.hours += 1
    days.set(date, day)
  }
  return [...days.values()].sort((a, b) => a.date.localeCompare(b.date))
}

export function todayKwh(rawLogs: unknown, currentTotal: number | null, now: number): number | null {
  const today = jakartaDate(now)
  const hours = hourlyUsage(rawLogs).filter((h) => jakartaDate(h.start) === today)
  let sum = hours.reduce((total, h) => total + h.kwh, 0)
  let known = hours.length > 0

  const last = parseLogs(rawLogs).at(-1)
  const midnight = Date.parse(`${today}T00:00:00Z`) - JAKARTA_OFFSET_MS
  if (last && last.total !== null && currentTotal !== null && last.hourEnd >= midnight && now - last.hourEnd < 2 * HOUR_MS) {
    const since = currentTotal - last.total
    if (since >= 0 && since <= 2 * MAX_AC_KWH_PER_HOUR) {
      sum += since
      known = true
    }
  }
  return known ? Math.round(sum * 100) / 100 : null
}

export function appendSample(samples: PowerSample[], sample: PowerSample, max: number): PowerSample[] {
  const last = samples.at(-1)
  if (last && sample.at <= last.at) return samples
  return [...samples, sample].slice(-max)
}
