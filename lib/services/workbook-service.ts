import 'server-only'
import { buildReport } from '@/lib/services/report-service'
import { previewSheet, resolvePeriod, shapeSheet, type PreviewRow, type WorkbookSpec } from '@/lib/workbook'
import { buildXlsx, type Sheet } from '@/lib/xlsx'

const MAX_ROWS = 50_000
const MAX_BYTES = 12_000_000

export class WorkbookError extends Error {}

export interface BuiltWorkbook {
  data: Uint8Array<ArrayBuffer>
  period: { from: string; to: string }
  sheets: { name: string; rows: number }[]
}

const PREVIEW_ROWS = 25

export interface SheetPreview {
  rows: PreviewRow[]
  hidden: number
}

// One sheet of the workbook; the caller has already checked the spec.
export async function buildPreview(spec: WorkbookSpec, now: number): Promise<SheetPreview> {
  const [sheet] = spec.sheets
  const range = resolvePeriod(sheet.period ? { period: sheet.period, from: null, to: null } : spec, now)
  const table = await buildReport({ type: sheet.type, store: 'all', stores: sheet.stores, ...range })
  if ('error' in table) throw new WorkbookError(table.error)
  return previewSheet(shapeSheet(table, sheet, range), PREVIEW_ROWS)
}

export async function buildWorkbook(spec: WorkbookSpec, now: number): Promise<BuiltWorkbook> {
  const period = resolvePeriod(spec, now)
  const sheets: Sheet[] = []
  const summary: BuiltWorkbook['sheets'] = []
  let total = 0
  for (const sheet of spec.sheets) {
    const range = sheet.period ? resolvePeriod({ period: sheet.period, from: null, to: null }, now) : period
    const table = await buildReport({ type: sheet.type, store: 'all', stores: sheet.stores, ...range })
    if ('error' in table) throw new WorkbookError(`Sheet ${sheet.name}: ${table.error}`)
    const shaped = shapeSheet(table, sheet, range)
    total += shaped.rows.length
    if (total > MAX_ROWS) throw new WorkbookError('File terlalu besar. Kurangi sheet, toko, atau periode.')
    sheets.push(shaped)
    summary.push({ name: sheet.name, rows: (shaped.totalRow ?? shaped.rows.length) - shaped.headerRow! - 1 })
  }
  const data = buildXlsx(sheets)
  if (data.length > MAX_BYTES) throw new WorkbookError('File terlalu besar. Kurangi sheet, toko, atau periode.')
  return { data, period, sheets: summary }
}
