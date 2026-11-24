// Custom Excel workbooks and their email schedules.
// No `@/` imports, so `node --test` can load this file directly.
import { JAKARTA_OFFSET_MS, jakartaDate } from './jakarta-range.ts'
import { isIsoDate, type ParseResult } from './request-params.ts'
import { MAX_REPORT_DAYS, REPORT_COLUMNS, REPORT_TYPES, usesDates, type ReportTable, type ReportType } from './reports.ts'
import type { CellValue, Sheet } from './xlsx.ts'

const DAY_MS = 86_400_000
const CATCH_UP_MS = DAY_MS
export const MAX_SHEETS = 20
export const MAX_RECIPIENTS = 20

export const PERIODS = {
  yesterday: 'Kemarin',
  last7: '7 hari terakhir',
  lastWeek: 'Minggu lalu (Senin sampai Minggu)',
  last30: '30 hari terakhir',
  monthToDate: 'Bulan ini sampai hari ini',
  lastMonth: 'Bulan lalu',
  custom: 'Tanggal sendiri',
} as const
export type Period = keyof typeof PERIODS
export const WEEKDAYS = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu']

export interface SheetSpec {
  name: string
  type: ReportType
  stores: string[] // empty means every store in scope
  columns: string[] // in the order they appear
  source: 'all' | 'main' | 'sensor'
  sortBy: string | null
  sortDesc: boolean
  total: boolean
  period: Exclude<Period, 'custom'> | null // null follows the workbook
}

export interface WorkbookSpec {
  name: string
  period: Period
  from: string | null
  to: string | null
  sheets: SheetSpec[]
}

export interface Schedule {
  enabled: boolean
  frequency: 'daily' | 'weekly' | 'monthly'
  weekdays: number[] // 0 is Sunday
  monthDay: number
  time: string // HH:MM, WIB
}

export interface Recipients {
  allSubscribers: boolean
  userIds: string[] // sparta users, only while they subscribe
  groupIds: string[]
  recipients: string[] // extra addresses
}

export interface TemplateSpec extends Recipients {
  workbook: WorkbookSpec
  schedule: Schedule
  subject: string
  message: string
}

export interface DateRange {
  from: string
  to: string
}

const shift = (date: string, days: number) => new Date(Date.parse(date) + days * DAY_MS).toISOString().slice(0, 10)
const weekday = (date: string) => new Date(date).getUTCDay()

export function resolvePeriod(spec: Pick<WorkbookSpec, 'period' | 'from' | 'to'>, now: number): DateRange {
  const today = jakartaDate(now)
  const firstOfMonth = `${today.slice(0, 7)}-01`
  switch (spec.period) {
    case 'yesterday':
      return { from: shift(today, -1), to: shift(today, -1) }
    case 'last7':
      return { from: shift(today, -7), to: shift(today, -1) }
    case 'last30':
      return { from: shift(today, -30), to: shift(today, -1) }
    case 'lastWeek': {
      const monday = shift(today, -((weekday(today) + 6) % 7))
      return { from: shift(monday, -7), to: shift(monday, -1) }
    }
    case 'monthToDate':
      return { from: firstOfMonth, to: today }
    case 'lastMonth': {
      const last = shift(firstOfMonth, -1)
      return { from: `${last.slice(0, 7)}-01`, to: last }
    }
    case 'custom':
      return { from: spec.from ?? today, to: spec.to ?? today }
  }
}

function runsOn(schedule: Schedule, date: string): boolean {
  if (schedule.frequency === 'weekly') return schedule.weekdays.includes(weekday(date))
  if (schedule.frequency === 'monthly') return Number(date.slice(8)) === schedule.monthDay
  return true
}

const slotAt = (schedule: Schedule, date: string) => Date.parse(`${date}T${schedule.time}:00Z`) - JAKARTA_OFFSET_MS

// The newest slot of the last 24 hours, so a short outage does not skip a report.
export function dueSlot(schedule: Schedule, now: number, activeSince: number): number | null {
  if (!schedule.enabled) return null
  const today = jakartaDate(now)
  for (const date of [today, shift(today, -1)]) {
    const slot = slotAt(schedule, date)
    if (runsOn(schedule, date) && slot <= now && now - slot <= CATCH_UP_MS && slot >= activeSince) return slot
  }
  return null
}

export function nextSlot(schedule: Schedule, now: number): number | null {
  if (!schedule.enabled) return null
  const today = jakartaDate(now)
  for (let i = 0; i <= 62; i++) {
    const date = shift(today, i)
    const slot = slotAt(schedule, date)
    if (slot > now && runsOn(schedule, date)) return slot
  }
  return null
}

const ADDITIVE = new Set(['Energi (kWh)', 'Biaya (Rp)', 'Record'])
const isMain = (value: CellValue) => typeof value === 'string' && value.startsWith('Panel utama')

function compare(a: CellValue, b: CellValue): number {
  return typeof a === 'number' && typeof b === 'number' ? a - b : String(a).localeCompare(String(b), 'id')
}

export function shapeSheet(table: ReportTable, spec: SheetSpec, range: DateRange): Sheet {
  const sourceAt = table.columns.indexOf('Sumber')
  let rows = table.rows
  if (sourceAt >= 0 && spec.source !== 'all') {
    rows = rows.filter((row) => isMain(row[sourceAt]) === (spec.source === 'main'))
  }
  const sortAt = spec.sortBy === null ? -1 : table.columns.indexOf(spec.sortBy)
  if (sortAt >= 0) {
    rows = [...rows].sort((a, b) => {
      if (a[sortAt] === null || b[sortAt] === null) return Number(a[sortAt] === null) - Number(b[sortAt] === null)
      return compare(a[sortAt], b[sortAt]) * (spec.sortDesc ? -1 : 1)
    })
  }
  const picks = spec.columns.map((c) => table.columns.indexOf(c))
  const body = rows.map((row) => picks.map((i) => (i < 0 ? null : row[i])))

  const head: CellValue[][] = [[spec.name]]
  if (usesDates(spec.type)) head.push([`${range.from} sampai ${range.to}`])
  if (table.note) head.push([table.note])
  head.push([])
  const sheet: Sheet = { name: spec.name, headerRow: head.length, rows: [...head, spec.columns, ...body] }

  // Sensors measure part of the main panel, so only main panel rows are added up.
  const counted = sourceAt >= 0 ? rows.filter((row) => isMain(row[sourceAt])) : rows
  if (spec.total && counted.length > 0 && spec.columns.some((c) => ADDITIVE.has(c))) {
    const total: CellValue[] = spec.columns.map((column, i) =>
      ADDITIVE.has(column) && picks[i] >= 0
        ? Number(counted.reduce((sum, row) => sum + (typeof row[picks[i]] === 'number' ? (row[picks[i]] as number) : 0), 0).toFixed(2))
        : null
    )
    const label = total.indexOf(null)
    if (label >= 0) total[label] = sourceAt >= 0 ? 'Total panel utama' : 'Total'
    sheet.totalRow = sheet.rows.length
    sheet.rows.push(total)
  }
  return sheet
}

export interface PreviewRow {
  number: number // row in the file
  kind: 'title' | 'meta' | 'header' | 'body' | 'total'
  cells: CellValue[]
}

// The file as Excel shows it, with the body cut to `limit` rows.
export function previewSheet(sheet: Sheet, limit: number): { rows: PreviewRow[]; hidden: number } {
  const header = sheet.headerRow ?? 0
  const rows: PreviewRow[] = []
  let body = 0
  sheet.rows.forEach((cells, i) => {
    const kind = i === 0 ? 'title' : i < header ? 'meta' : i === header ? 'header' : i === sheet.totalRow ? 'total' : 'body'
    if (kind === 'body' && ++body > limit) return
    rows.push({ number: i + 1, kind, cells })
  })
  return { rows, hidden: Math.max(0, body - limit) }
}

export function scheduleText(schedule: Schedule): string {
  const time = `pukul ${schedule.time.replace(':', '.')} WIB`
  if (schedule.frequency === 'daily') return `Setiap hari ${time}`
  if (schedule.frequency === 'monthly') return `Setiap tanggal ${schedule.monthDay} ${time}`
  const names = [1, 2, 3, 4, 5, 6, 0].filter((d) => schedule.weekdays.includes(d)).map((d) => WEEKDAYS[d])
  return `Setiap ${new Intl.ListFormat('id-ID').format(names)} ${time}`
}

const fail = (error: string) => ({ ok: false as const, error })
const asRecord = (v: unknown): Record<string, unknown> | null =>
  typeof v === 'object' && v !== null && !Array.isArray(v) ? (v as Record<string, unknown>) : null

function parseText(raw: unknown, max: number): string | null {
  if (typeof raw !== 'string') return null
  const text = raw.trim()
  return text.length > 0 && text.length <= max && !/[\u0000-\u001f\u007f]/.test(text) ? text : null
}

const isPeriod = (v: unknown): v is Period => typeof v === 'string' && Object.hasOwn(PERIODS, v)

function parseSheet(raw: unknown, number: number): ParseResult<SheetSpec> {
  const s = asRecord(raw)
  const where = `Sheet ${number}`
  const name = parseText(s?.name, 31)
  if (!s || !name) return fail(`${where}: nama wajib diisi, paling banyak 31 karakter.`)
  if (typeof s.type !== 'string' || !Object.hasOwn(REPORT_TYPES, s.type)) return fail(`${where}: jenis laporan tidak dikenal.`)
  const type = s.type as ReportType
  const allowed = REPORT_COLUMNS[type]
  const { stores, columns, sortBy, period } = s
  if (!Array.isArray(stores) || stores.length > 500 || !stores.every((v) => typeof v === 'string' && /^[A-Za-z0-9_-]{1,50}$/.test(v))) {
    return fail(`${where}: toko tidak valid.`)
  }
  if (!Array.isArray(columns) || columns.length === 0) return fail(`${where}: pilih minimal satu kolom.`)
  if (new Set(columns).size !== columns.length || !columns.every((c) => allowed.includes(c))) return fail(`${where}: kolom tidak dikenal.`)
  if (sortBy !== null && (typeof sortBy !== 'string' || !allowed.includes(sortBy))) return fail(`${where}: kolom urutan tidak dikenal.`)
  if (s.source !== 'all' && s.source !== 'main' && s.source !== 'sensor') return fail(`${where}: sumber tidak valid.`)
  if (period !== null && (!isPeriod(period) || period === 'custom')) return fail(`${where}: periode tidak valid.`)
  return {
    ok: true,
    value: {
      name, type, source: s.source, sortBy, period,
      stores: stores as string[],
      columns: columns as string[],
      sortDesc: s.sortDesc === true,
      total: s.total === true,
    },
  }
}

export function parseWorkbook(raw: unknown): ParseResult<WorkbookSpec> {
  const w = asRecord(raw)
  const name = parseText(w?.name, 80)
  if (!w || !name) return fail('Nama file wajib diisi, paling banyak 80 karakter.')
  if (!isPeriod(w.period)) return fail('Periode tidak valid.')
  let from: string | null = null
  let to: string | null = null
  if (w.period === 'custom') {
    if (typeof w.from !== 'string' || typeof w.to !== 'string' || !isIsoDate(w.from) || !isIsoDate(w.to)) return fail('Isi tanggal awal dan akhir.')
    const days = (Date.parse(w.to) - Date.parse(w.from)) / DAY_MS + 1
    if (days < 1 || days > MAX_REPORT_DAYS) return fail(`Rentang tanggal harus 1 sampai ${MAX_REPORT_DAYS} hari.`)
    from = w.from
    to = w.to
  }
  if (!Array.isArray(w.sheets) || w.sheets.length === 0 || w.sheets.length > MAX_SHEETS) return fail(`Isi 1 sampai ${MAX_SHEETS} sheet.`)
  const sheets: SheetSpec[] = []
  for (const [i, raw] of w.sheets.entries()) {
    const sheet = parseSheet(raw, i + 1)
    if (!sheet.ok) return sheet
    sheets.push(sheet.value)
  }
  return { ok: true, value: { name, period: w.period, from, to, sheets } }
}

export function parseDomains(raw: string | undefined): string[] {
  return (raw ?? '')
    .split(',')
    .map((d) => d.trim().replace(/^@/, '').toLowerCase())
    .filter(Boolean)
}

const ADDRESS = /^[A-Za-z0-9._%+-]{1,64}@((?:[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?\.)+[A-Za-z]{2,})$/

export function isAllowedRecipient(address: string, domains: string[]): boolean {
  const match = address.length <= 254 ? address.match(ADDRESS) : null
  return match !== null && domains.includes(match[1].toLowerCase())
}

function parseSchedule(raw: unknown): ParseResult<Schedule> {
  const s = asRecord(raw)
  if (!s || (s.frequency !== 'daily' && s.frequency !== 'weekly' && s.frequency !== 'monthly')) return fail('Jadwal tidak valid.')
  const { weekdays, monthDay, time } = s
  if (typeof time !== 'string' || !/^([01]\d|2[0-3]):[0-5]\d$/.test(time)) return fail('Jam harus berformat HH:MM.')
  if (!Array.isArray(weekdays) || !weekdays.every((d) => Number.isInteger(d) && d >= 0 && d <= 6)) return fail('Hari tidak valid.')
  if (s.frequency === 'weekly' && weekdays.length === 0) return fail('Pilih minimal satu hari.')
  if (typeof monthDay !== 'number' || !Number.isInteger(monthDay) || monthDay < 1 || monthDay > 28) return fail('Tanggal kirim harus 1 sampai 28.')
  return {
    ok: true,
    value: { enabled: s.enabled === true, frequency: s.frequency, weekdays: [...new Set(weekdays as number[])].sort(), monthDay, time },
  }
}

export function parseTemplate(raw: unknown, domains: string[]): ParseResult<TemplateSpec> {
  const t = asRecord(raw)
  if (!t) return fail('Template tidak valid.')
  const workbook = parseWorkbook(t.workbook)
  if (!workbook.ok) return workbook
  const schedule = parseSchedule(t.schedule)
  if (!schedule.ok) return schedule
  const subject = parseText(t.subject, 150)
  if (!subject) return fail('Subjek email wajib diisi, paling banyak 150 karakter.')
  const { message, recipients, userIds = [], groupIds = [] } = t
  const allSubscribers = t.allSubscribers === true
  if (typeof message !== 'string' || message.length > 2000 || /[\u0000-\u0008\u000b\u000c\u000e-\u001f]/.test(message)) return fail('Isi email paling banyak 2.000 karakter.')
  if (!Array.isArray(recipients) || recipients.length > MAX_RECIPIENTS) return fail(`Penerima paling banyak ${MAX_RECIPIENTS}.`)
  const isId = (v: unknown) => typeof v === 'string' && /^[A-Za-z0-9-]{1,64}$/.test(v)
  if (![userIds, groupIds].every((list) => Array.isArray(list) && list.length <= 200 && list.every(isId))) return fail('Penerima tidak valid.')
  if (recipients.length > 0 && domains.length === 0) return fail('Isi domain penerima di Pengaturan Email dulu.')
  const wrong = recipients.find((r) => typeof r !== 'string' || !isAllowedRecipient(r, domains))
  if (wrong !== undefined) return fail(`Penerima ${JSON.stringify(wrong).slice(0, 60)} tidak valid atau domainnya tidak diizinkan.`)
  if (schedule.value.enabled) {
    if (!allSubscribers && recipients.length + (userIds as string[]).length + (groupIds as string[]).length === 0) return fail('Isi minimal satu penerima sebelum jadwal diaktifkan.')
    if (workbook.value.period === 'custom') return fail('Jadwal butuh periode yang bergerak, misalnya Minggu lalu.')
  }
  return {
    ok: true,
    value: { workbook: workbook.value, schedule: schedule.value, recipients: [...new Set(recipients as string[])], allSubscribers, userIds: [...new Set(userIds as string[])], groupIds: [...new Set(groupIds as string[])], subject, message },
  }
}
