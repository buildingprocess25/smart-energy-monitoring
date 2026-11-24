// Writes a plain .xlsx (an uncompressed zip of XML). No imports, so it runs in the browser and in `node --test`.

export type CellValue = string | number | null
export interface Sheet {
  name: string
  rows: CellValue[][]
  headerRow?: number // index; turns on styling, a frozen header and a filter
  totalRow?: number
}

const CRC_TABLE = Uint32Array.from({ length: 256 }, (_, n) => {
  let c = n
  for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1
  return c >>> 0
})

export function crc32(bytes: Uint8Array): number {
  let crc = 0xffffffff
  for (let i = 0; i < bytes.length; i++) crc = CRC_TABLE[(crc ^ bytes[i]) & 0xff] ^ (crc >>> 8)
  return (crc ^ 0xffffffff) >>> 0
}

export function columnName(index: number): string {
  let name = ''
  for (let n = index + 1; n > 0; n = Math.floor((n - 1) / 26)) name = String.fromCharCode(65 + ((n - 1) % 26)) + name
  return name
}

function escapeXml(text: string): string {
  return text
    // XML 1.0 has no way to write these characters.
    .replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f￾￿]/g, '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function sheetNames(sheets: Sheet[]): string[] {
  const used = new Set<string>()
  return sheets.map((sheet, i) => {
    const base = sheet.name.replace(/[\\/?*[\]:\u0000-\u001f]/g, ' ').replace(/^'+|'+$/g, '').trim() || `Sheet ${i + 1}`
    let name = base.slice(0, 31)
    for (let n = 2; used.has(name.toLowerCase()); n++) {
      const suffix = ` (${n})`
      name = base.slice(0, 31 - suffix.length) + suffix
    }
    used.add(name.toLowerCase())
    return name
  })
}

// Text is always an inline string, so a value starting with "=" never becomes a formula.
const STYLE = { title: 1, header: 2, integer: 3, decimal: 4, total: 5, totalInteger: 6, totalDecimal: 7 }
const STYLES_XML = '<styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><fonts count="4"><font><sz val="11"/><name val="Calibri"/></font><font><b/><sz val="14"/><name val="Calibri"/></font><font><b/><sz val="11"/><color rgb="FFFFFFFF"/><name val="Calibri"/></font><font><b/><sz val="11"/><name val="Calibri"/></font></fonts><fills count="4"><fill><patternFill patternType="none"/></fill><fill><patternFill patternType="gray125"/></fill><fill><patternFill patternType="solid"><fgColor rgb="FF2C7A57"/></patternFill></fill><fill><patternFill patternType="solid"><fgColor rgb="FFE4E4E7"/></patternFill></fill></fills><borders count="1"><border/></borders><cellStyleXfs count="1"><xf/></cellStyleXfs><cellXfs count="8"><xf/><xf fontId="1" applyFont="1"/><xf fontId="2" fillId="2" applyFont="1" applyFill="1"/><xf numFmtId="3" applyNumberFormat="1"/><xf numFmtId="4" applyNumberFormat="1"/><xf fontId="3" fillId="3" applyFont="1" applyFill="1"/><xf numFmtId="3" fontId="3" fillId="3" applyNumberFormat="1" applyFont="1" applyFill="1"/><xf numFmtId="4" fontId="3" fillId="3" applyNumberFormat="1" applyFont="1" applyFill="1"/></cellXfs><cellStyles count="1"><cellStyle name="Normal" xfId="0" builtinId="0"/></cellStyles></styleSheet>'

function sheetXml({ rows, headerRow, totalRow }: Sheet): string {
  const parts = ['<?xml version="1.0" encoding="UTF-8" standalone="yes"?><worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">']
  const styled = headerRow !== undefined
  const header = styled ? rows[headerRow] : []
  const lastBody = (totalRow ?? rows.length) - 1
  // A column counts as decimal when any of its values is.
  const decimal = header.map((_, c) => rows.some((row, r) => r > headerRow! && typeof row[c] === 'number' && !Number.isInteger(row[c])))
  if (styled) {
    const widths = header.map((_, c) => rows.slice(headerRow).reduce((max, row) => Math.max(max, String(row[c] ?? '').length), 0))
    parts.push(
      `<sheetViews><sheetView workbookViewId="0"><pane ySplit="${headerRow + 1}" topLeftCell="A${headerRow + 2}" activePane="bottomLeft" state="frozen"/></sheetView></sheetViews>`,
      `<cols>${widths.map((w, c) => `<col min="${c + 1}" max="${c + 1}" width="${Math.min(60, Math.max(10, w + 4))}" customWidth="1"/>`).join('')}</cols>`
    )
  }
  const styleOf = (r: number, c: number, value: CellValue): string => {
    if (!styled) return ''
    let style = 0
    if (r === 0) style = STYLE.title
    else if (r === headerRow) style = STYLE.header
    else if (r > headerRow) {
      const total = r === totalRow
      if (typeof value === 'number') style = total ? (decimal[c] ? STYLE.totalDecimal : STYLE.totalInteger) : decimal[c] ? STYLE.decimal : STYLE.integer
      else if (total) style = STYLE.total
    }
    return style === 0 ? '' : ` s="${style}"`
  }
  parts.push('<sheetData>')
  rows.forEach((row, r) => {
    parts.push(`<row r="${r + 1}">`)
    row.forEach((value, c) => {
      const ref = `${columnName(c)}${r + 1}`
      if (typeof value === 'number' && Number.isFinite(value)) parts.push(`<c r="${ref}"${styleOf(r, c, value)}><v>${value}</v></c>`)
      else if (typeof value === 'string') parts.push(`<c r="${ref}"${styleOf(r, c, value)} t="inlineStr"><is><t xml:space="preserve">${escapeXml(value)}</t></is></c>`)
    })
    parts.push('</row>')
  })
  parts.push('</sheetData>')
  if (styled && lastBody > headerRow) parts.push(`<autoFilter ref="A${headerRow + 1}:${columnName(header.length - 1)}${lastBody + 1}"/>`)
  parts.push('</worksheet>')
  return parts.join('')
}

export function zip(files: { name: string; content: string | Uint8Array }[]): Uint8Array<ArrayBuffer> {
  const encoder = new TextEncoder()
  const entries = files.map((f) => {
    const name = encoder.encode(f.name)
    const body = typeof f.content === 'string' ? encoder.encode(f.content) : f.content
    return { name, body, crc: crc32(body), offset: 0 }
  })
  const size = entries.reduce((sum, e) => sum + 30 + 46 + 2 * e.name.length + e.body.length, 22)
  const out = new Uint8Array(size)
  const view = new DataView(out.buffer)
  let at = 0
  // Shared part of the local and the central header: version, flags, method, time, date (1980-01-01).
  const common = (e: (typeof entries)[number], start: number) => {
    view.setUint16(start, 20, true)
    view.setUint16(start + 2, 0x0800, true)
    view.setUint16(start + 8, 0x21, true)
    view.setUint32(start + 10, e.crc, true)
    view.setUint32(start + 14, e.body.length, true)
    view.setUint32(start + 18, e.body.length, true)
    view.setUint16(start + 22, e.name.length, true)
  }
  for (const e of entries) {
    e.offset = at
    view.setUint32(at, 0x04034b50, true)
    common(e, at + 4)
    out.set(e.name, at + 30)
    out.set(e.body, at + 30 + e.name.length)
    at += 30 + e.name.length + e.body.length
  }
  const directory = at
  for (const e of entries) {
    view.setUint32(at, 0x02014b50, true)
    view.setUint16(at + 4, 20, true)
    common(e, at + 6)
    view.setUint32(at + 42, e.offset, true)
    out.set(e.name, at + 46)
    at += 46 + e.name.length
  }
  view.setUint32(at, 0x06054b50, true)
  view.setUint16(at + 8, entries.length, true)
  view.setUint16(at + 10, entries.length, true)
  view.setUint32(at + 12, at - directory, true)
  view.setUint32(at + 16, directory, true)
  return out
}

export function buildXlsx(sheets: Sheet[]): Uint8Array<ArrayBuffer> {
  const names = sheetNames(sheets)
  const ns = 'http://schemas.openxmlformats.org'
  const head = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
  return zip([
    {
      name: '[Content_Types].xml',
      content: `${head}<Types xmlns="${ns}/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>${names.map((_, i) => `<Override PartName="/xl/worksheets/sheet${i + 1}.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>`).join('')}<Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/></Types>`,
    },
    {
      name: '_rels/.rels',
      content: `${head}<Relationships xmlns="${ns}/package/2006/relationships"><Relationship Id="rId1" Type="${ns}/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/></Relationships>`,
    },
    {
      name: 'xl/workbook.xml',
      content: `${head}<workbook xmlns="${ns}/spreadsheetml/2006/main" xmlns:r="${ns}/officeDocument/2006/relationships"><sheets>${names.map((n, i) => `<sheet name="${escapeXml(n)}" sheetId="${i + 1}" r:id="rId${i + 1}"/>`).join('')}</sheets></workbook>`,
    },
    {
      name: 'xl/_rels/workbook.xml.rels',
      content: `${head}<Relationships xmlns="${ns}/package/2006/relationships">${names.map((_, i) => `<Relationship Id="rId${i + 1}" Type="${ns}/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet${i + 1}.xml"/>`).join('')}<Relationship Id="rIdStyles" Type="${ns}/officeDocument/2006/relationships/styles" Target="styles.xml"/></Relationships>`,
    },
    { name: 'xl/styles.xml', content: head + STYLES_XML },
    ...sheets.map((sheet, i) => ({ name: `xl/worksheets/sheet${i + 1}.xml`, content: sheetXml(sheet) })),
  ])
}
