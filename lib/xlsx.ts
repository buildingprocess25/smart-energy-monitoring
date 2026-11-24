// Writes a plain .xlsx (an uncompressed zip of XML). No imports, so it runs in the browser and in `node --test`.

export type CellValue = string | number | null
export interface Sheet {
  name: string
  rows: CellValue[][]
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
function sheetXml(rows: CellValue[][]): string {
  const parts = ['<?xml version="1.0" encoding="UTF-8" standalone="yes"?><worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><sheetData>']
  rows.forEach((row, r) => {
    parts.push(`<row r="${r + 1}">`)
    row.forEach((value, c) => {
      const ref = `${columnName(c)}${r + 1}`
      if (typeof value === 'number' && Number.isFinite(value)) parts.push(`<c r="${ref}"><v>${value}</v></c>`)
      else if (typeof value === 'string') parts.push(`<c r="${ref}" t="inlineStr"><is><t xml:space="preserve">${escapeXml(value)}</t></is></c>`)
    })
    parts.push('</row>')
  })
  parts.push('</sheetData></worksheet>')
  return parts.join('')
}

function zip(files: { name: string; content: string }[]): Uint8Array<ArrayBuffer> {
  const encoder = new TextEncoder()
  const entries = files.map((f) => {
    const name = encoder.encode(f.name)
    const body = encoder.encode(f.content)
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
      content: `${head}<Types xmlns="${ns}/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>${names.map((_, i) => `<Override PartName="/xl/worksheets/sheet${i + 1}.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>`).join('')}</Types>`,
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
      content: `${head}<Relationships xmlns="${ns}/package/2006/relationships">${names.map((_, i) => `<Relationship Id="rId${i + 1}" Type="${ns}/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet${i + 1}.xml"/>`).join('')}</Relationships>`,
    },
    ...sheets.map((sheet, i) => ({ name: `xl/worksheets/sheet${i + 1}.xml`, content: sheetXml(sheet.rows) })),
  ])
}
