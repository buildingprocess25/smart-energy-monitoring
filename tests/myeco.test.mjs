import { test } from 'node:test'
import assert from 'node:assert/strict'
import { createMyEcoClient, MyEcoError } from '../lib/myeco-client.ts'
import {
  appendSample,
  dailyUsage,
  findMyEcoStore,
  hourlyUsage,
  MYECO_STORES,
  parseMeters,
  todayKwh,
} from '../lib/myeco.ts'

const NOW = Date.parse('2026-11-24T07:56:00Z')
const meter = (over = {}) => ({
  id: 'a', is_online: true, current_kwh: 10, current_power_watt: 1400, current_ampere: 6.5,
  current_voltage: 225, power_factor: 0.98, updated_at: '2026-11-24T07:55:59Z', ...over,
})
const list = (...meters) => ({ data: { meters } })
const log = (timestamp, kwh_total, kwh = null) => ({ timestamp, kwh_total, kwh })

test('every mapped meter belongs to one store', () => {
  const ids = MYECO_STORES.flatMap((s) => s.meters.map((m) => m.id))
  assert.equal(ids.length, 13)
  assert.equal(new Set(ids).size, 13)
  assert.equal(findMyEcoStore('tg14')?.meters.length, 5)
  assert.equal(findMyEcoStore('TE77'), null)
})

test('readings keep their age, and late, missing or offline meters are told apart', () => {
  const map = parseMeters(list(meter(), meter({ id: 'b', updated_at: '2026-11-24T07:50:00Z' }), meter({ id: 'c', is_online: false })), NOW)
  assert.equal(map.get('a').state, 'live')
  assert.equal(map.get('a').power, 1400)
  assert.equal(map.get('b').state, 'late')
  assert.equal(map.get('c').state, 'offline')
  assert.equal(map.get('d'), undefined)
})

test('odd values are no reading, never 0', () => {
  const row = parseMeters(list(meter({ current_power_watt: null, current_voltage: 'x', current_kwh: 900000000, updated_at: 'kapan' })), NOW).get('a')
  assert.equal(row.power, null)
  assert.equal(row.voltage, null)
  assert.equal(row.state, 'late')
  assert.equal(parseMeters({ data: null }, NOW).size, 0)
  assert.equal(parseMeters('rusak', NOW).size, 0)
})

test('an hourly log counts for the hour before it, whatever the order and jitter', () => {
  const hours = hourlyUsage({ data: { logs: [
    log('2026-11-24T07:00:00.166Z', 12.5),
    log('2026-11-24T05:59:59.400Z', 11),
    log('2026-11-24T05:00:00.100Z', 10),
  ] } })
  assert.deepEqual(hours, [
    { start: Date.parse('2026-11-24T05:00:00Z'), kwh: 1 },
    { start: Date.parse('2026-11-24T06:00:00Z'), kwh: 1.5 },
  ])
})

test('a gap, a counter reset and an impossible jump are not spread or invented', () => {
  const hours = hourlyUsage({ data: { logs: [
    log('2026-11-24T01:00:00Z', 10),
    log('2026-11-24T04:00:00Z', 16, 1.2), // three hours later: only its own hour is known
    log('2026-11-24T05:00:00Z', 2, 1.1), // reset
    log('2026-11-24T06:00:00Z', 900, 898), // impossible
  ] } })
  assert.deepEqual(hours.map((h) => h.kwh), [1.2, 1.1])
})

test('days follow Jakarta time', () => {
  const hours = [
    { start: Date.parse('2026-11-23T16:00:00Z'), kwh: 1 }, // 23.00 WIB
    { start: Date.parse('2026-11-23T17:00:00Z'), kwh: 2 }, // 00.00 WIB
    { start: Date.parse('2026-11-24T06:00:00Z'), kwh: 3 },
  ]
  assert.deepEqual(dailyUsage(hours), [
    { date: '2026-11-23', kwh: 1, hours: 1 },
    { date: '2026-11-24', kwh: 5, hours: 2 },
  ])
})

test('today adds what ran since the last log, only when that log is recent', () => {
  const raw = { data: { logs: [log('2026-11-24T06:00:00Z', 10), log('2026-11-24T07:00:00Z', 11)] } }
  assert.equal(todayKwh(raw, 11.4, NOW), 1.4)
  assert.equal(todayKwh(raw, null, NOW), 1)
  assert.equal(todayKwh({ data: { logs: [] } }, 11.4, NOW), null)
  assert.equal(todayKwh(raw, 11.4, NOW + 5 * 3600_000), 1)
})

test('samples are kept in order, capped, and late meters leave a gap', () => {
  let samples = []
  for (let i = 0; i < 5; i++) samples = appendSample(samples, { at: i * 15000, power: { a: i } }, 3)
  assert.deepEqual(samples.map((s) => s.at), [30000, 45000, 60000])
  assert.equal(appendSample(samples, { at: 60000, power: {} }, 3).length, 3)
})

function server(replies) {
  const calls = []
  const fetchFn = async (url, init) => {
    calls.push({ url, init })
    const reply = replies(url, calls)
    return { ok: reply.status < 400, status: reply.status, json: async () => reply.body }
  }
  return { calls, fetchFn }
}
const token = (n = 1) => ({ status: 200, body: { data: { access_token: `t${n}`, expires_in: 3600 } } })
const make = (fetchFn, now = () => NOW) => createMyEcoClient({ baseUrl: 'https://x', apiKey: 'k', fetchFn, now })

test('one token serves many calls, also when they start together', async () => {
  const { calls, fetchFn } = server((url) => (url.endsWith('/token') ? token() : { status: 200, body: {} }))
  const get = make(fetchFn)
  await Promise.all([get('/a'), get('/b')])
  await get('/c')
  assert.equal(calls.filter((c) => c.url.endsWith('/token')).length, 1)
  assert.ok(calls.every((c) => c.init.redirect === 'error'))
})

test('the token is renewed before it ends and once after a 401', async () => {
  let time = NOW
  const { calls, fetchFn } = server((url, all) =>
    url.endsWith('/token') ? token() : { status: all.length === 2 ? 401 : 200, body: { ok: true } })
  const get = make(fetchFn, () => time)
  assert.deepEqual(await get('/a'), { ok: true })
  assert.equal(calls.filter((c) => c.url.endsWith('/token')).length, 2)
  time += 3500_000
  await get('/b')
  assert.equal(calls.filter((c) => c.url.endsWith('/token')).length, 3)
})

test('a repeated 401 stops, and a blocked IP is named', async () => {
  const denied = server((url) => (url.endsWith('/token') ? token() : { status: 401, body: {} }))
  await assert.rejects(make(denied.fetchFn)('/a'), (e) => e instanceof MyEcoError && e.kind === 'auth')
  assert.equal(denied.calls.length, 4)
  const blocked = server(() => ({ status: 403, body: {} }))
  await assert.rejects(make(blocked.fetchFn)('/a'), (e) => e.kind === 'blocked')
})

test('without a key nothing is sent, and errors never carry the key', async () => {
  const { calls, fetchFn } = server(() => token())
  await assert.rejects(createMyEcoClient({ baseUrl: 'https://x', apiKey: '', fetchFn })('/a'), (e) => e.kind === 'unconfigured')
  assert.equal(calls.length, 0)
  const broken = async () => { throw new Error('gagal dengan kunci rahasia-k') }
  await assert.rejects(createMyEcoClient({ baseUrl: 'https://x', apiKey: 'rahasia-k', fetchFn: broken })('/a'),
    (e) => e.kind === 'unreachable' && !String(e.message).includes('rahasia-k') && e.cause === undefined)
})
