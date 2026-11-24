// No `@/` imports, so `node --test` can load this file directly.
import type { EnergyIndex } from './energy-index.ts'
import { isIsoDate, type ParseResult } from './request-params.ts'
import type { CellValue } from './xlsx.ts'

export const PLN_TARIFF = 1444.7
export const MAX_REPORT_DAYS = 366

export const REPORT_TYPES = {
  summary: 'Ringkasan per toko',
  daily: 'Konsumsi harian',
  monthly: 'Konsumsi bulanan',
  profile: 'Profil beban per jam',
  health: 'Kesehatan perangkat',
  alerts: 'Peringatan saat ini',
  sessions: 'Daftar sesi rekaman',
  sangatBoros: 'Perbandingan Sangat Boros',
} as const
export type ReportType = keyof typeof REPORT_TYPES

// Health always covers the last 30 days and alerts the current state, so neither takes dates.
export const usesDates = (type: ReportType) => type !== 'health' && type !== 'alerts'

const CONSUMPTION = ['Kode toko', 'Nama toko', 'Perangkat', 'Sumber', 'Energi (kWh)', 'Jam terekam', 'Biaya (Rp)']

// Saved workbooks name columns by these labels, so renaming one breaks them.
export const REPORT_COLUMNS: Record<ReportType, string[]> = {
  summary: ['Kode toko', 'Nama toko', 'Perangkat', 'Sumber', 'Energi (kWh)', 'Jam terekam', 'Hari terekam', 'Rata-rata per 24 jam (kWh)', 'Biaya (Rp)', 'Energi sebelumnya (kWh)', 'Perubahan per jam (%)'],
  daily: ['Tanggal', ...CONSUMPTION],
  monthly: ['Bulan', ...CONSUMPTION],
  profile: ['Kode toko', 'Nama toko', 'Perangkat', 'Jam', 'Rata-rata (W)', 'Tertinggi (W)', 'Terendah (W)', 'Hari terekam'],
  health: ['Kode toko', 'Perangkat', 'Jenis', 'Status', 'Sensor', 'Kelengkapan 30 hari (%)', 'Hari lengkap', 'Hari dihitung', 'Data terakhir (WIB)'],
  alerts: ['Tingkat', 'Kode toko', 'Perangkat', 'Masalah', 'Penjelasan', 'Data terakhir (WIB)'],
  sessions: ['Sesi', 'Kode toko', 'Nama toko', 'Perangkat', 'Mulai (WIB)', 'Selesai (WIB)', 'Durasi', 'Record', 'Sensor'],
  sangatBoros: ['Peringkat', 'Kode toko', 'Nama toko', 'Cabang', 'PLN (kWh/bulan)', 'Standar (kWh/bulan)', 'Selisih (%)', 'Panel utama (kWh/hari)', 'Hari terekam', 'Dibanding PLN (%)', 'Dibanding standar (%)'],
}

export interface ReportParams {
  type: ReportType
  store: string // a code, or 'all'
  stores?: string[] // several codes; replaces store
  from: string
  to: string
}

export interface ReportTable {
  title: string
  columns: string[]
  rows: CellValue[][]
  note?: string
}

export interface ReportDevice {
  id: string
  storeCode: string
  storeName: string
  sensors: Map<string, string> // phase -> name
}

export function parseReportParams(q: URLSearchParams): ParseResult<ReportParams> {
  const type = q.get('type') ?? ''
  const store = q.get('store') ?? ''
  const from = q.get('from') ?? ''
  const to = q.get('to') ?? ''
  if (!Object.hasOwn(REPORT_TYPES, type)) return { ok: false, error: 'Jenis laporan tidak dikenal.' }
  if (!/^[A-Za-z0-9_-]{1,50}$/.test(store)) return { ok: false, error: 'Toko tidak valid.' }
  if (!isIsoDate(from) || !isIsoDate(to)) return { ok: false, error: 'Tanggal harus berformat YYYY-MM-DD.' }
  const days = (Date.parse(to) - Date.parse(from)) / 86_400_000 + 1
  if (days < 1) return { ok: false, error: 'Tanggal akhir harus sama atau setelah tanggal awal.' }
  if (days > MAX_REPORT_DAYS) return { ok: false, error: `Rentang paling panjang ${MAX_REPORT_DAYS} hari.` }
  return { ok: true, value: { type: type as ReportType, store, from, to } }
}

const round = (n: number, digits: number) => Number(n.toFixed(digits))
const MAIN = new Set(['R', 'S', 'T'])

export function buildConsumption(
  index: EnergyIndex,
  devices: ReportDevice[],
  type: 'daily' | 'monthly',
  from: string,
  to: string
): ReportTable {
  const rows: CellValue[][] = []
  const keyLength = type === 'daily' ? 10 : 7
  for (const device of devices) {
    const periods = new Map<string, { main: number; hours: number; sensors: Map<string, number> }>()
    for (const day of index.daily(device.id)) {
      if (day.date < from || day.date > to) continue
      const key = day.date.slice(0, keyLength)
      const period = periods.get(key) ?? { main: 0, hours: 0, sensors: new Map<string, number>() }
      period.main += day.mainKwh
      period.hours += day.hours
      for (const [phase, kwh] of Object.entries(day.phases)) {
        if (!MAIN.has(phase)) period.sensors.set(phase, (period.sensors.get(phase) ?? 0) + kwh)
      }
      periods.set(key, period)
    }
    const { hasMain } = index.total(device.id)
    for (const [key, p] of periods) {
      const start = [key, device.storeCode, device.storeName, device.id]
      if (hasMain) {
        rows.push([...start, 'Panel utama (R/S/T)', round(p.main, 2), round(p.hours, 2), Math.round(p.main * PLN_TARIFF)])
      }
      for (const [phase, kwh] of p.sensors) {
        rows.push([...start, `Sensor ${device.sensors.get(phase) ?? phase}`, round(kwh, 2), round(p.hours, 2), null])
      }
    }
  }
  rows.sort((a, b) => String(a[0]).localeCompare(String(b[0])) || String(a[1]).localeCompare(String(b[1])))
  return {
    title: REPORT_TYPES[type],
    columns: REPORT_COLUMNS[type],
    rows,
    note: 'Energi dihitung selama perangkat merekam. Biaya hanya dari panel utama, Rp1.444,7 per kWh. Sensor mengukur sebagian panel utama, jadi jangan dijumlah.',
  }
}

// Compared per recorded hour with the same number of days just before.
export function buildSummary(index: EnergyIndex, devices: ReportDevice[], from: string, to: string): ReportTable {
  const DAY_MS = 86_400_000
  const length = Math.round((Date.parse(to) - Date.parse(from)) / DAY_MS) + 1
  const iso = (ms: number) => new Date(ms).toISOString().slice(0, 10)
  const before = { from: iso(Date.parse(from) - length * DAY_MS), to: iso(Date.parse(from) - DAY_MS) }
  const rows: CellValue[][] = []
  for (const device of devices) {
    const daily = index.daily(device.id)
    const sum = (start: string, end: string) => {
      const days = daily.filter((d) => d.date >= start && d.date <= end)
      const kwh = new Map<string, number>()
      for (const d of days) {
        for (const [phase, value] of Object.entries(d.phases)) {
          const key = MAIN.has(phase) ? 'main' : phase
          kwh.set(key, (kwh.get(key) ?? 0) + value)
        }
      }
      return { days: days.length, hours: days.reduce((total, d) => total + d.hours, 0), kwh }
    }
    const now = sum(from, to)
    const previous = sum(before.from, before.to)
    for (const [key, kwh] of [...now.kwh].sort(([a], [b]) => Number(b === 'main') - Number(a === 'main'))) {
      const old = previous.kwh.get(key)
      const rate = now.hours > 0 ? kwh / now.hours : 0
      const oldRate = old !== undefined && previous.hours > 0 ? old / previous.hours : 0
      rows.push([
        device.storeCode, device.storeName, device.id,
        key === 'main' ? 'Panel utama (R/S/T)' : `Sensor ${device.sensors.get(key) ?? key}`,
        round(kwh, 2), round(now.hours, 2), now.days, round(rate * 24, 2),
        key === 'main' ? Math.round(kwh * PLN_TARIFF) : null,
        old === undefined ? null : round(old, 2),
        oldRate > 0 ? round((rate / oldRate - 1) * 100, 1) : null,
      ])
    }
  }
  return {
    title: REPORT_TYPES.summary,
    columns: REPORT_COLUMNS.summary,
    rows,
    note: `Dibanding ${before.from} sampai ${before.to}, per jam terekam. Biaya hanya dari panel utama.`,
  }
}

export function buildLoadProfile(index: EnergyIndex, devices: ReportDevice[], from: string, to: string): ReportTable {
  const rows: CellValue[][] = []
  for (const device of devices) {
    const dates = index.dates(device.id).filter((d) => d >= from && d <= to)
    const hours = Array.from({ length: 24 }, () => [] as number[])
    for (const date of dates) {
      index.loadProfile(device.id, date).forEach((watts, hour) => {
        if (watts !== null) hours[hour].push(watts)
      })
    }
    hours.forEach((values, hour) => {
      if (values.length === 0) return
      rows.push([
        device.storeCode, device.storeName, device.id, `${String(hour).padStart(2, '0')}:00`,
        Math.round(values.reduce((sum, v) => sum + v, 0) / values.length),
        Math.round(Math.max(...values)), Math.round(Math.min(...values)), values.length,
      ])
    })
  }
  return {
    title: REPORT_TYPES.profile,
    columns: REPORT_COLUMNS.profile,
    rows,
    note: 'Rata-rata daya per jam. Perangkat dengan panel utama memakai R/S/T, perangkat lain memakai semua sensornya.',
  }
}

// Semicolon and decimal comma, as Excel expects with Indonesian settings.
export function toCsv(table: ReportTable): string {
  const cell = (value: CellValue): string => {
    if (value === null) return ''
    if (typeof value === 'number') return String(value).replace('.', ',')
    // A leading = + - @ would run as a formula.
    const safe = /^[=+\-@\t\r]/.test(value) ? `'${value}` : value
    return /[";\r\n]/.test(safe) ? `"${safe.replace(/"/g, '""')}"` : safe
  }
  return `\uFEFF${[table.columns, ...table.rows].map((row) => row.map(cell).join(';')).join('\r\n')}\r\n`
}
