import { test } from 'node:test'
import assert from 'node:assert/strict'
import net from 'node:net'
import { parseGroup, parseMailSettings, resolveRecipients } from '../lib/mail-settings.ts'
import { isSecretKey, openSecret, sealSecret } from '../lib/secret-box.ts'
import { buildMime, checkLogin } from '../lib/smtp.ts'
import { parseTemplate } from '../lib/workbook.ts'
import { canReceiveReports } from '../lib/auth/access-rules.ts'

const KEY = 'k'.repeat(44)
const settings = (over = {}) => ({ provider: 'gmail', host: '', port: 0, user: '', from: 'lapor@gmail.com', password: 'abcd efgh ijkl mnop', domains: 'gmail.com, Toko.test', ...over })

test('a secret opens only with the same key and the same account', () => {
  const sealed = sealSecret('rahasia', KEY, 'smtp.gmail.com|587|u')
  assert.doesNotMatch(JSON.stringify(sealed), /rahasia/)
  assert.equal(openSecret(sealed, KEY, 'smtp.gmail.com|587|u'), 'rahasia')
  assert.equal(openSecret(sealed, 'x'.repeat(44), 'smtp.gmail.com|587|u'), null)
  assert.equal(openSecret(sealed, KEY, 'evil.test|587|u'), null)
  assert.equal(openSecret({ ...sealed, data: 'AAAA' }, KEY, 'smtp.gmail.com|587|u'), null)
  assert.equal(openSecret(null, KEY, 'x'), null)
  assert.notEqual(sealSecret('a', KEY, 'x').data + sealSecret('a', KEY, 'x').iv, sealSecret('a', KEY, 'x').data + sealSecret('a', KEY, 'x').iv)
  assert.equal(isSecretKey('pendek'), false)
  assert.equal(isSecretKey(undefined), false)
  assert.equal(isSecretKey(KEY), true)
})

test('known providers fix host and port; spaces leave an app password', () => {
  const r = parseMailSettings(settings({ host: 'evil.test', port: 25 }))
  assert.deepEqual(r.value, { provider: 'gmail', host: 'smtp.gmail.com', port: 587, user: 'lapor@gmail.com', from: 'lapor@gmail.com', password: 'abcdefghijklmnop', domains: ['gmail.com', 'toko.test'] })
})

test('other servers must be public names on a TLS port', () => {
  const other = (over) => parseMailSettings(settings({ provider: 'other', host: 'mail.kantor.co.id', port: 465, user: 'robot', ...over })).ok
  assert.equal(other({}), true)
  for (const bad of [{ host: 'localhost' }, { host: '127.0.0.1' }, { host: '10.0.0.5' }, { host: '[::1]' }, { host: 'db.internal' }, { host: 'x.local' }, { host: 'a b.com' }, { port: 25 }, { port: 5432 }, { user: 'a\r\nb' }, { user: '' }]) assert.equal(other(bad), false, JSON.stringify(bad))
})

test('the other fields are checked', () => {
  assert.equal(parseMailSettings(settings({ password: '' })).value.password, null)
  for (const bad of [null, settings({ provider: 'x' }), settings({ from: 'x' }), settings({ domains: '' }), settings({ domains: 'a b' }), settings({ domains: '*' }), settings({ password: 'x'.repeat(300) }), settings({ password: 'a\nb' })]) assert.equal(parseMailSettings(bad).ok, false, JSON.stringify(bad))
})

const id = '11111111-1111-4111-8111-111111111111'
test('groups need a name and at least one member', () => {
  assert.equal(parseGroup({ name: 'Tim', userIds: [id], addresses: [] }, ['toko.test']).ok, true)
  for (const bad of [{ name: '', userIds: [id], addresses: [] }, { name: 'a', userIds: [], addresses: [] }, { name: 'a', userIds: ['x\'y'], addresses: [] }, { name: 'a', userIds: [], addresses: ['a@evil.test'] }]) assert.equal(parseGroup(bad, ['toko.test']).ok, false)
})

const subscribers = [{ id, name: 'A', email: 'a@toko.test', role: 'ADMIN' }, { id: '2', name: 'B', email: 'b@luar.test', role: 'AUDITOR' }]
const target = (over = {}) => ({ allSubscribers: false, userIds: [], groupIds: [], recipients: [], ...over })
test('only subscribers, allowed domains and no address twice', () => {
  const groups = [{ id: 'g', name: 'G', userIds: [id, 'bukan-pelanggan'], addresses: ['A@toko.test', 'c@toko.test'] }]
  const run = (t) => resolveRecipients(target(t), subscribers, groups, ['toko.test'])
  assert.deepEqual(run({ allSubscribers: true }), ['a@toko.test'])
  assert.deepEqual(run({ userIds: ['bukan-pelanggan'] }), [])
  assert.deepEqual(run({ userIds: [id], groupIds: ['g', 'hilang'], recipients: ['d@evil.test'] }), ['a@toko.test', 'c@toko.test'])
})

test('a schedule may target subscribers or groups instead of addresses', () => {
  const t = { workbook: { name: 'x', period: 'last7', from: null, to: null, sheets: [{ name: 's', type: 'daily', stores: [], columns: ['Tanggal'], source: 'all', sortBy: null, sortDesc: false, total: false, period: null }] }, schedule: { enabled: true, frequency: 'daily', weekdays: [], monthDay: 1, time: '07:00' }, subject: 's', message: '' }
  assert.equal(parseTemplate({ ...t, ...target() }, []).ok, false)
  assert.equal(parseTemplate({ ...t, ...target({ allSubscribers: true }) }, []).ok, true)
  assert.equal(parseTemplate({ ...t, ...target({ groupIds: [id] }) }, []).ok, true)
  assert.equal(parseTemplate({ ...t, ...target({ userIds: ['../x'] }) }, []).ok, false)
})

test('GS cannot subscribe until reports are limited to their stores', () => {
  assert.deepEqual(['ADMIN', 'AUDITOR', 'GS', 'AREA', 'USER', null].filter(canReceiveReports), ['ADMIN', 'AUDITOR'])
})

test('recipients do not see each other', () => {
  const mime = buildMime({ from: 'p@toko.test', fromName: 'P', to: ['a@toko.test', 'b@toko.test'], subject: 's', text: 't', attachment: null }, 'id', new Date(0))
  assert.doesNotMatch(mime, /a@toko|b@toko/)
  assert.match(mime, /^To: <p@toko\.test>$/m)
})

test('checking the login sends no message', async () => {
  const got = []
  const s = net.createServer((c) => {
    c.write('220 hi\r\n')
    c.on('error', () => {})
    c.on('data', (d) => { const v = String(d).split(' ')[0].trim(); got.push(v); c.write(v === 'EHLO' ? '250-x\r\n250 AUTH PLAIN\r\n' : v === 'AUTH' ? '535 no\r\n' : '250 ok\r\n') })
  })
  await new Promise((r) => s.listen(0, '127.0.0.1', r))
  await assert.rejects(checkLogin({ host: '127.0.0.1', port: s.address().port, user: 'u', password: 'rahasia', implicitTls: true }, { connectTls: (o) => net.connect(o) }), (e) => /login/.test(e.message) && !/rahasia/.test(e.message))
  s.close()
  assert.deepEqual(got, ['EHLO', 'AUTH'])
})
