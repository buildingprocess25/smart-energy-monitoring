import { test } from 'node:test'
import assert from 'node:assert/strict'
import { inflateRawSync } from 'node:zlib'
import { canControlDevices } from '../lib/auth/access-rules.ts'
import {
  deviceDisplayName,
  isSameOrigin,
  parseCaptureCommand,
  parseDeviceCommand,
  parseSessionCommand,
} from '../lib/control-commands.ts'
import { deviceKind, parseDeviceStatus } from '../lib/device-status.ts'
import { buildXlsx, columnName, crc32 } from '../lib/xlsx.ts'
import { sessionSheets } from '../lib/session-export.ts'

test('only ADMIN controls devices', () => {
  assert.equal(canControlDevices('ADMIN'), true)
  for (const role of ['AUDITOR', 'GS', 'AREA', 'USER', null]) assert.equal(canControlDevices(role), false)
})

test('a control request must come from the portal itself', () => {
  assert.equal(isSameOrigin('https://portal.test', 'portal.test'), true)
  assert.equal(isSameOrigin('http://localhost:3001', 'localhost:3001'), true)
  for (const origin of [null, '', 'null', 'https://evil.test', 'https://portal.test.evil.test', 'nonsense']) {
    assert.equal(isSameOrigin(origin, 'portal.test'), false, String(origin))
  }
  assert.equal(isSameOrigin('https://portal.test', null), false)
})

test('start needs a device, a name and at least one sensor', () => {
  const good = { action: 'start', deviceId: 'EM-0010', sessionName: ' Uji ', interval: 15, phases: ['R', 'S', 'R'] }
  assert.deepEqual(parseCaptureCommand(good), {
    ok: true,
    value: { action: 'start', deviceId: 'EM-0010', sessionName: 'Uji', interval: 15, phases: ['R', 'S'] },
  })
  for (const bad of [
    { ...good, deviceId: '../x' }, { ...good, deviceId: '' }, { ...good, sessionName: '  ' },
    { ...good, sessionName: 'x'.repeat(101) }, { ...good, sessionName: 'a\u0000b' }, { ...good, interval: 14 },
    { ...good, interval: 3601 }, { ...good, interval: 15.5 }, { ...good, interval: '15' }, { ...good, phases: [] },
    { ...good, phases: 'R' }, { ...good, phases: ['R/S'] }, { ...good, phases: ['status'] }, { ...good, action: 'clear-all' },
    null, [], 'x',
  ]) assert.equal(parseCaptureCommand(bad).ok, false, JSON.stringify(bad))
})

test('stop and interval always name a device', () => {
  assert.deepEqual(parseCaptureCommand({ action: 'stop', deviceId: 'D1' }), { ok: true, value: { action: 'stop', deviceId: 'D1' } })
  assert.equal(parseCaptureCommand({ action: 'stop' }).ok, false)
  assert.equal(parseCaptureCommand({ action: 'interval', interval: 60 }).ok, false)
  assert.equal(parseCaptureCommand({ action: 'interval', deviceId: 'D1', interval: 60 }).ok, true)
})

test('session commands', () => {
  assert.equal(parseSessionCommand({ action: 'rename', name: 'Baru' }).ok, true)
  assert.equal(parseSessionCommand({ action: 'renameSensor', phase: 'PG', name: 'Cooler' }).ok, true)
  assert.equal(parseSessionCommand({ action: 'delete', confirmName: 'Baru' }).ok, true)
  for (const bad of [{ action: 'rename' }, { action: 'renameSensor', name: 'x' }, { action: 'delete' }, { action: 'shift' }]) {
    assert.equal(parseSessionCommand(bad).ok, false, JSON.stringify(bad))
  }
})

test('device commands', () => {
  const storeId = 'cf374bd3-cf9e-4fdd-b8da-608cb52e4b4e'
  assert.equal(parseDeviceCommand({ action: 'assign', storeId }).ok, true)
  assert.equal(parseDeviceCommand({ action: 'sensorName', phase: 'PG', name: 'Cooler' }).ok, true)
  assert.equal(parseDeviceCommand({ action: 'sensorColor', phase: 'PG', color: '#2e9b84' }).ok, true)
  assert.equal(parseDeviceCommand({ action: 'sensorEnabled', phase: 'PG', enabled: false }).ok, true)
  for (const bad of [
    { action: 'assign', storeId: "x' OR 1=1" }, { action: 'sensorColor', phase: 'PG', color: 'red;}' },
    { action: 'sensorEnabled', phase: 'PG', enabled: 'false' }, { action: 'relay', state: 'ON' },
  ]) assert.equal(parseDeviceCommand(bad).ok, false, JSON.stringify(bad))
})

test('device names keep the code in brackets that links a device to its store', () => {
  assert.equal(deviceDisplayName({ code: 'TF67', name: 'KYAI MAJA 2' }), '[TF67] KYAI MAJA 2')
})

test('device kind comes from the id', () => {
  assert.equal(deviceKind('CT-E62A34'), 'CT')
  assert.equal(deviceKind('Plug-B80E68'), 'Plug')
  assert.equal(deviceKind('EM-0010'), 'Meter energi')
})

test('device status is read from the newest live sample and never guessed', () => {
  const raw = [
    { timestamp: 2000, data: { status: { relay: 'ON', uptime: '1T02:00:00', wifi: 70 } } },
    { timestamp: 1000, data: { status: { relay: 'OFF' } } },
  ]
  assert.deepEqual(parseDeviceStatus(raw), { relay: 'ON', uptime: '1T02:00:00', wifi: '70', bufferSync: null })
  assert.deepEqual(parseDeviceStatus([{ timestamp: 1, data: { offline: true } }]), { relay: null, uptime: null, wifi: null, bufferSync: null })
  assert.deepEqual(parseDeviceStatus([{ timestamp: 1, data: { status: { relay: { x: 1 }, wifi: '' } } }]), { relay: null, uptime: null, wifi: null, bufferSync: null })
  assert.deepEqual(parseDeviceStatus('x'), { relay: null, uptime: null, wifi: null, bufferSync: null })
})

test('buffer sync progress is read, unknown states are ignored', () => {
  const sync = (buffer_sync) => parseDeviceStatus([{ timestamp: 1, data: { status: { buffer_sync } } }]).bufferSync
  assert.deepEqual(sync({ status: 'SYNCING', total: 40, replayed: 10 }), { state: 'syncing', replayed: 10, total: 40 })
  assert.deepEqual(sync({ status: 'COMPLETED', total: 40, replayed: 40 }), { state: 'done', replayed: 40, total: 40 })
  for (const bad of [undefined, null, 'x', { status: 'CLEARED', total: 0, replayed: 0 }, { status: 'SYNCING', total: 'x', replayed: 1 }]) assert.equal(sync(bad), null)
})

test('xlsx column names and checksum', () => {
  assert.deepEqual([0, 25, 26, 701, 702].map(columnName), ['A', 'Z', 'AA', 'ZZ', 'AAA'])
  assert.equal(crc32(new TextEncoder().encode('123456789')), 0xcbf43926)
})

// Minimal reader: enough to prove the archive is a valid stored or deflated zip.
function unzip(bytes) {
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength)
  const files = {}
  let at = 0
  while (view.getUint32(at, true) === 0x04034b50) {
    const method = view.getUint16(at + 8, true)
    const size = view.getUint32(at + 18, true)
    const nameLength = view.getUint16(at + 26, true)
    const start = at + 30 + nameLength + view.getUint16(at + 28, true)
    const body = bytes.subarray(start, start + size)
    files[new TextDecoder().decode(bytes.subarray(at + 30, at + 30 + nameLength))] = new TextDecoder().decode(method === 8 ? inflateRawSync(body) : body)
    at = start + size
  }
  return files
}

test('xlsx escapes text and keeps formulas as text', () => {
  const files = unzip(buildXlsx([{ name: 'A', rows: [['a<b>&"', '=1+1', 1.5, null, '\u0001x']] }]))
  const sheet = files['xl/worksheets/sheet1.xml']
  assert.match(sheet, /a&lt;b&gt;&amp;&quot;/)
  assert.match(sheet, /t="inlineStr"><is><t xml:space="preserve">=1\+1</)
  assert.match(sheet, /<c r="C1"><v>1\.5<\/v>/)
  assert.doesNotMatch(sheet, /<f>|\u0001/)
})

test('xlsx sheet names are legal and unique', () => {
  const files = unzip(buildXlsx([
    { name: 'a/b:c*[d]?', rows: [] }, { name: 'a/b:c*[d]?', rows: [] }, { name: 'x'.repeat(40), rows: [] }, { name: '', rows: [] },
  ]))
  const names = [...files['xl/workbook.xml'].matchAll(/sheet name="([^"]*)"/g)].map((m) => m[1])
  assert.equal(new Set(names.map((n) => n.toLowerCase())).size, 4)
  for (const n of names) assert.ok(n.length > 0 && n.length <= 31 && !/[\\/?*[\]:]/.test(n), n)
})

test('a session exports a summary and one sheet per sensor', () => {
  const record = (epoch, energy, power, offline = false) => ({ timestamp: 't', epoch, offline, voltage: 220, current: 1, power, frequency: 50, energy, powerFactor: 1 })
  const sheets = sessionSheets({
    session: { id: 's', name: 'Uji', deviceId: 'D1', deviceName: 'D1', startTime: 'a', endTime: 'b', recordCount: 2 },
    phases: [{ phase: 'PG', name: 'Cooler', records: [record(0, 1, 1000), record(3_600_000, 2, 1000), record(3_700_000, 0, 0, true)] }],
  })
  assert.deepEqual(sheets.map((s) => s.name), ['Ringkasan', 'Cooler'])
  assert.equal(sheets[1].rows.length, 4)
  assert.ok(sheets[0].rows.some((r) => r[0] === 'Energi (kWh)' && r[1] === 1))
})
