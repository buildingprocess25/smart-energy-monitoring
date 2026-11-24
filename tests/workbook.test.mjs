import { test } from 'node:test'
import assert from 'node:assert/strict'
import net from 'node:net'
import { dueSlot, isAllowedRecipient, nextSlot, parseDomains, parseWorkbook, parseTemplate, previewSheet, scheduleText, resolvePeriod, shapeSheet } from '../lib/workbook.ts'
import { buildMime, parseAddress, sendMail } from '../lib/smtp.ts'
import { buildXlsx } from '../lib/xlsx.ts'
import { buildSummary } from '../lib/reports.ts'
import { BUCKET_MS, createEnergyIndex } from '../lib/energy-index.ts'

const at = (text) => Date.parse(`${text}+07:00`)
const sheet = (over = {}) => ({ name: 'Harian', type: 'daily', stores: [], columns: ['Tanggal', 'Energi (kWh)'], source: 'all', sortBy: null, sortDesc: false, total: false, period: null, ...over })
const workbook = (over = {}) => ({ name: 'Mingguan', period: 'lastWeek', from: null, to: null, sheets: [sheet()], ...over })
const schedule = (over = {}) => ({ enabled: true, frequency: 'weekly', weekdays: [1], monthDay: 1, time: '07:00', ...over })
const template = (over = {}) => ({ workbook: workbook(), schedule: schedule(), recipients: ['a@toko.test'], subject: 'Laporan {periode}', message: 'Halo', ...over })

test('periods follow Jakarta days', () => {
  const now = at('2026-11-24T00:30:00') // Tuesday, still Monday in UTC
  assert.deepEqual(resolvePeriod(workbook({ period: 'yesterday' }), now), { from: '2026-11-23', to: '2026-11-23' })
  assert.deepEqual(resolvePeriod(workbook({ period: 'last7' }), now), { from: '2026-11-17', to: '2026-11-23' })
  assert.deepEqual(resolvePeriod(workbook({ period: 'lastWeek' }), now), { from: '2026-11-16', to: '2026-11-22' })
  assert.deepEqual(resolvePeriod(workbook({ period: 'last30' }), now), { from: '2026-10-25', to: '2026-11-23' })
  assert.deepEqual(resolvePeriod(workbook({ period: 'monthToDate' }), now), { from: '2026-11-01', to: '2026-11-24' })
  assert.deepEqual(resolvePeriod(workbook({ period: 'lastMonth' }), at('2027-01-05T08:00:00')), { from: '2026-12-01', to: '2026-12-31' })
  assert.deepEqual(resolvePeriod(workbook({ period: 'lastWeek' }), at('2026-11-23T07:00:00')), { from: '2026-11-16', to: '2026-11-22' })
  assert.deepEqual(resolvePeriod(workbook({ period: 'lastWeek' }), at('2026-11-22T07:00:00')), { from: '2026-11-09', to: '2026-11-15' })
  assert.deepEqual(resolvePeriod(workbook({ period: 'custom', from: '2026-11-01', to: '2026-11-02' }), now), { from: '2026-11-01', to: '2026-11-02' })
})

test('a weekly slot is due after its time, for a day, and never before it was switched on', () => {
  const monday = at('2026-11-23T07:00:00')
  assert.equal(dueSlot(schedule(), monday - 1, 0), null)
  assert.equal(dueSlot(schedule(), monday, 0), monday)
  assert.equal(dueSlot(schedule(), monday + 20 * 3_600_000, 0), monday)
  assert.equal(dueSlot(schedule(), monday + 25 * 3_600_000, 0), null)
  assert.equal(dueSlot(schedule(), monday + 1000, monday + 500), null)
  assert.equal(dueSlot(schedule({ enabled: false }), monday, 0), null)
})

test('daily and monthly slots, and the next one', () => {
  assert.equal(dueSlot(schedule({ frequency: 'daily', time: '23:30' }), at('2026-11-24T01:00:00'), 0), at('2026-11-23T23:30:00'))
  assert.equal(dueSlot(schedule({ frequency: 'monthly', monthDay: 1 }), at('2026-12-01T08:00:00'), 0), at('2026-12-01T07:00:00'))
  assert.equal(nextSlot(schedule(), at('2026-11-23T07:00:00')), at('2026-11-30T07:00:00'))
  assert.equal(nextSlot(schedule({ frequency: 'monthly', monthDay: 28 }), at('2026-11-29T07:00:00')), at('2026-12-28T07:00:00'))
  assert.equal(nextSlot(schedule({ enabled: false }), 0), null)
})

test('workbooks are checked', () => {
  assert.equal(parseWorkbook(workbook()).ok, true)
  const bad = [null, {}, workbook({ name: '' }), workbook({ sheets: [] }), workbook({ period: 'x' }), workbook({ period: 'custom' }),
    workbook({ period: 'custom', from: '2026-11-03', to: '2026-11-02' }), workbook({ sheets: [sheet({ type: 'x' })] }),
    workbook({ sheets: [sheet({ columns: ['Biaya palsu'] })] }), workbook({ sheets: [sheet({ columns: [] })] }),
    workbook({ sheets: [sheet({ stores: ["a'b"] })] }), workbook({ sheets: [sheet({ sortBy: 'x' })] }),
    workbook({ sheets: [sheet({ period: 'custom' })] }), workbook({ sheets: Array.from({ length: 21 }, () => sheet()) })]
  for (const b of bad) assert.equal(parseWorkbook(b).ok, false, JSON.stringify(b))
})

test('templates need allowed recipients and a relative period', () => {
  const domains = parseDomains(' toko.test, @Kantor.test ')
  assert.deepEqual(domains, ['toko.test', 'kantor.test'])
  assert.equal(parseTemplate(template(), domains).ok, true)
  const bad = [template({ recipients: [] }), template({ recipients: ['a@evil.test'] }), template({ recipients: ['a@toko.test\r\nBcc: x@evil.test'] }),
    template({ subject: 'x\r\nBcc: y' }), template({ workbook: workbook({ period: 'custom', from: '2026-11-01', to: '2026-11-02' }) }),
    template({ schedule: schedule({ time: '25:00' }) }), template({ schedule: schedule({ weekdays: [] }) }), template({ schedule: schedule({ monthDay: 31 }) })]
  for (const b of bad) assert.equal(parseTemplate(b, domains).ok, false, JSON.stringify(b))
  assert.equal(parseTemplate(template(), []).ok, false)
  assert.equal(parseTemplate(template({ recipients: [], schedule: schedule({ enabled: false }) }), domains).ok, true)
  assert.equal(isAllowedRecipient('a@sub.toko.test', domains), false)
})

const table = {
  title: 'Konsumsi harian',
  columns: ['Tanggal', 'Kode toko', 'Nama toko', 'Perangkat', 'Sumber', 'Energi (kWh)', 'Jam terekam', 'Biaya (Rp)'],
  rows: [
    ['2026-11-01', 'A', 'a', 'D1', 'Panel utama (R/S/T)', 10, 24, 100],
    ['2026-11-01', 'A', 'a', 'D1', 'Sensor AC', 4, 24, null],
    ['2026-11-02', 'A', 'a', 'D1', 'Panel utama (R/S/T)', 30, 24, 300],
  ],
}

test('a sheet keeps the chosen columns in order, filters, sorts and totals the main panel only', () => {
  const s = shapeSheet(table, sheet({ columns: ['Energi (kWh)', 'Tanggal', 'Biaya (Rp)'], sortBy: 'Energi (kWh)', sortDesc: true, total: true }), { from: '2026-11-01', to: '2026-11-02' })
  assert.deepEqual(s.rows[s.headerRow], ['Energi (kWh)', 'Tanggal', 'Biaya (Rp)'])
  assert.deepEqual(s.rows.slice(s.headerRow + 1, s.headerRow + 4).map((r) => r[0]), [30, 10, 4])
  assert.deepEqual(s.rows[s.totalRow], [40, 'Total panel utama', 400])
  const main = shapeSheet(table, sheet({ columns: ['Tanggal'], source: 'main' }), { from: 'a', to: 'b' })
  assert.equal(main.rows.length - main.headerRow - 1, 2)
  const sub = shapeSheet(table, sheet({ columns: ['Tanggal'], source: 'sensor' }), { from: 'a', to: 'b' })
  assert.equal(sub.rows.length - sub.headerRow - 1, 1)
})

test('empty values sort last in both directions', () => {
  for (const sortDesc of [true, false]) {
    const s = shapeSheet(table, sheet({ columns: ['Biaya (Rp)'], sortBy: 'Biaya (Rp)', sortDesc }), { from: 'a', to: 'b' })
    assert.equal(s.rows.at(-1)[0], null)
  }
})

test('a styled sheet has a frozen, filtered header; a plain one does not', () => {
  const text = new TextDecoder().decode(buildXlsx([{ name: 'A', headerRow: 2, totalRow: 4, rows: [['T'], [], ['a', 'b'], [1.5, 2], [1, 2]] }, { name: 'B', rows: [['x']] }]))
  assert.equal(text.match(/<pane ySplit="3"/g).length, 1)
  assert.match(text, /<autoFilter ref="A3:B4"\/>/)
  assert.match(text, /xl\/styles\.xml/)
})

test('summary compares with the period before it, per recorded hour', () => {
  const day = at('2026-11-10T00:00:00') / BUCKET_MS
  const row = (bucket, min, max) => ({ deviceId: 'EM', phase: 'R', bucket, min, max, powerSum: 4000 * 60, count: 60 })
  const index = createEnergyIndex()
  index.merge([row(day, 1, 2), row(day + 96, 3, 5)])
  const r = buildSummary(index, [{ id: 'EM', storeCode: 'A', storeName: 'a', sensors: new Map() }], '2026-11-11', '2026-11-11')
  const get = (name) => r.rows[0][r.columns.indexOf(name)]
  assert.equal(r.rows.length, 1)
  assert.equal(get('Energi (kWh)') > 0, true)
  assert.equal(get('Hari terekam'), 1)
  assert.equal(typeof get('Perubahan per jam (%)'), 'number')
  assert.equal(buildSummary(index, [{ id: 'EM', storeCode: 'A', storeName: 'a', sensors: new Map() }], '2026-11-10', '2026-11-10').rows[0].at(-1), null)
})

test('addresses are strict', () => {
  assert.equal(parseAddress('A@Toko.test'), 'A@toko.test')
  for (const bad of ['', 'a', 'a@b', 'a b@c.test', 'a@c.test>', 'a@c.test\nX', '"x"@c.test', 'a@@c.test']) assert.equal(parseAddress(bad), null, bad)
})

const mail = { from: 'p@toko.test', fromName: 'Portal', to: ['a@toko.test'], subject: 'Laporan énergi', text: 'Baris\n.titik', attachment: { name: 'x.xlsx', data: new Uint8Array([1, 2, 3]) } }

test('a message cannot smuggle headers or break lines', () => {
  const mime = buildMime({ ...mail, subject: 'a\r\nBcc: z@evil.test' }, 'id', new Date(0))
  assert.doesNotMatch(mime, /^Bcc:/m)
  assert.ok(mime.split('\r\n').every((l) => l.length <= 78), 'line length')
  assert.match(mime, /filename="x\.xlsx"/)
  assert.ok(mime.includes('AQID'))
})

function server(script) {
  const got = []
  const s = net.createServer((c) => {
    c.write('220 hi\r\n')
    let data = false, buf = ''
    c.on('error', () => {})
    c.on('data', (d) => {
      buf += d
      for (let i; (i = buf.indexOf('\r\n')) >= 0; ) {
        const line = buf.slice(0, i); buf = buf.slice(i + 2); got.push(line)
        if (data) { if (line === '.') { data = false; c.write(script.end ?? '250 ok\r\n') } continue }
        const verb = line.split(' ')[0].toUpperCase()
        if (verb === 'DATA') data = true
        c.write(script[verb] ?? ({ EHLO: '250-x\r\n250 AUTH PLAIN\r\n', AUTH: '235 ok\r\n', DATA: '354 go\r\n', QUIT: '221 bye\r\n' })[verb] ?? '250 ok\r\n')
      }
    })
  })
  return new Promise((r) => s.listen(0, '127.0.0.1', () => r({ port: s.address().port, got, close: () => s.close() })))
}
const open = (o) => net.connect({ host: o.host, port: o.port })
const config = (port) => ({ host: '127.0.0.1', port, user: 'u', password: 'rahasia', implicitTls: true })

test('mail is sent once with the envelope and body', async () => {
  const s = await server({})
  await sendMail(config(s.port), mail, { connectTls: open })
  s.close()
  assert.ok(s.got.includes('MAIL FROM:<p@toko.test>') && s.got.includes('RCPT TO:<a@toko.test>'))
  assert.equal(s.got.filter((l) => l === 'DATA').length, 1)
})

test('refusals before the body may be retried, a lost answer after it may not', async () => {
  const refused = await server({ RCPT: '550 no\r\n' })
  await assert.rejects(sendMail(config(refused.port), mail, { connectTls: open }), (e) => e.maybeSent === false && !/rahasia/.test(e.message))
  refused.close()
  const lost = await server({ end: '' })
  await assert.rejects(sendMail(config(lost.port), mail, { connectTls: open, timeoutMs: 300 }), (e) => e.maybeSent === true)
  lost.close()
  const spam = await server({ end: '554 spam\r\n' })
  await assert.rejects(sendMail(config(spam.port), mail, { connectTls: open }), (e) => e.maybeSent === false)
  spam.close()
})

test('a server without STARTTLS never gets the password', async () => {
  const s = await server({})
  const plain = { ...config(s.port), implicitTls: false }
  await assert.rejects(sendMail(plain, mail, { connectPlain: open }), /TLS/)
  s.close()
  assert.equal(s.got.some((l) => l.startsWith('AUTH')), false)
})

test('no total without main panel rows, and no date range on a current-state sheet', () => {
  const sensors = { ...table, rows: table.rows.slice(1, 2) }
  assert.equal(shapeSheet(sensors, sheet({ total: true }), { from: 'a', to: 'b' }).totalRow, undefined)
  const now = shapeSheet({ title: 't', columns: ['Masalah'], rows: [['x']], note: 'Keadaan' }, sheet({ type: 'alerts', columns: ['Masalah'] }), { from: 'a', to: 'b' })
  assert.deepEqual(now.rows.slice(0, 2), [['Harian'], ['Keadaan']])
})

test('the preview keeps the rows and numbers of the file, shortened', () => {
  const s = shapeSheet(table, sheet({ columns: ['Energi (kWh)', 'Tanggal'], total: true }), { from: '2026-11-01', to: '2026-11-02' })
  const full = previewSheet(s, 10)
  assert.deepEqual(full.rows.map((r) => r.kind), ['title', 'meta', 'meta', 'header', 'body', 'body', 'body', 'total'])
  assert.equal(full.hidden, 0)
  assert.equal(full.rows.find((r) => r.kind === 'header').number, s.headerRow + 1)
  const short = previewSheet(s, 2)
  assert.equal(short.hidden, 1)
  assert.deepEqual(short.rows.map((r) => r.kind).slice(-3), ['body', 'body', 'total'])
  assert.equal(short.rows.at(-1).number, s.totalRow + 1)
})

test('a schedule reads as a sentence', () => {
  assert.equal(scheduleText(schedule({ weekdays: [1, 5], time: '07:00' })), 'Setiap Senin dan Jumat pukul 07.00 WIB')
  assert.equal(scheduleText(schedule({ weekdays: [0, 1, 3] })), 'Setiap Senin, Rabu, dan Minggu pukul 07.00 WIB')
  assert.equal(scheduleText(schedule({ frequency: 'daily' })), 'Setiap hari pukul 07.00 WIB')
  assert.equal(scheduleText(schedule({ frequency: 'monthly', monthDay: 5 })), 'Setiap tanggal 5 pukul 07.00 WIB')
})
