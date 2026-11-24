import { test } from 'node:test'
import assert from 'node:assert/strict'
import { computeAlerts } from '../lib/alerts.ts'
import { BUCKET_MS, createEnergyIndex } from '../lib/energy-index.ts'
import { coverageDays, coverageSummary } from '../lib/coverage.ts'

const HOUR = 3_600_000
const now = Date.parse('2026-11-24T11:00:00+07:00')
const sensor = (phase, over = {}) => ({ phase, name: phase, enabled: true, lastSampleAt: now - 10 * 60_000, counterSameSince: null, avgWatts24h: 1000, recent: [], ...over })
const device = (over = {}) => ({ id: 'D1', name: '[AB1] TOKO', storeCode: 'AB1', online: true, deviceClock: now, recordingStalled: false, sensors: [sensor('R'), sensor('S'), sensor('T')], ...over })
const kinds = (d) => computeAlerts([d], now).map((a) => a.kind)

test('a healthy device has no alerts', () => assert.deepEqual(kinds(device()), []))

test('a dead phase is reported while the others report', () => {
  const alerts = computeAlerts([device({ sensors: [sensor('R', { lastSampleAt: now - 26 * HOUR }), sensor('S'), sensor('T')] })], now)
  assert.deepEqual(alerts.map((a) => [a.kind, a.severity]), [['sensor-silent', 'critical']])
  assert.match(alerts[0].title, /R/)
  assert.equal(alerts[0].since, now - 26 * HOUR)
})

test('an offline device gives one alert, not one per sensor', () => {
  const old = ['R', 'S', 'T'].map((p) => sensor(p, { lastSampleAt: now - 5 * HOUR }))
  assert.deepEqual(kinds(device({ online: false, sensors: old })), ['device-offline'])
  const short = ['R', 'S', 'T'].map((p) => sensor(p, { lastSampleAt: now - 30 * 60_000 }))
  assert.deepEqual(kinds(device({ online: false, sensors: short })), [])
})

test('a device that never reported is not called offline since 1970', () => {
  const alerts = computeAlerts([device({ online: false, sensors: [sensor('R', { lastSampleAt: null })] })], now)
  assert.equal(alerts[0].since, null)
})

test('disabled sensors are ignored', () => {
  assert.deepEqual(kinds(device({ sensors: [sensor('R', { enabled: false, lastSampleAt: null }), sensor('S')] })), [])
})

test('a stalled recording is critical and comes first', () => {
  const alerts = computeAlerts([device({ recordingStalled: true, deviceClock: now - 6 * HOUR })], now)
  assert.deepEqual(alerts.map((a) => a.kind), ['recording-stalled', 'device-clock'])
})

test('a counter that stands still under load is frozen', () => {
  assert.deepEqual(kinds(device({ sensors: [sensor('R', { counterSameSince: now - 3 * HOUR })] })), ['counter-frozen'])
  assert.deepEqual(kinds(device({ sensors: [sensor('R', { counterSameSince: now - 1 * HOUR })] })), [])
  assert.deepEqual(kinds(device({ sensors: [sensor('R', { counterSameSince: now - 3 * HOUR, avgWatts24h: 5 })] })), [])
})

test('voltage and power factor need three of the last four samples', () => {
  const s = (v, pf = 1, power = 500) => ({ voltage: v, powerFactor: pf, power, at: now - 10 * 60_000 })
  assert.deepEqual(kinds(device({ sensors: [sensor('R', { recent: [s(190), s(191), s(192), s(220)] })] })), ['voltage'])
  assert.deepEqual(kinds(device({ sensors: [sensor('R', { recent: [s(190), s(220), s(220), s(192)] })] })), [])
  assert.deepEqual(kinds(device({ sensors: [sensor('R', { recent: [s(250), s(250), s(250), s(250)] })] })), ['voltage'])
  assert.deepEqual(kinds(device({ sensors: [sensor('R', { recent: [s(220, 0.5), s(220, 0.5), s(220, 0.5)] })] })), ['power-factor'])
  assert.deepEqual(kinds(device({ sensors: [sensor('R', { recent: [s(220, 0.3, 20), s(220, 0.3, 20), s(220, 0.3, 20)] })] })), [])
  const old = [s(190), s(190), s(190)].map((x) => ({ ...x, at: now - 5 * HOUR }))
  assert.deepEqual(kinds(device({ sensors: [sensor('R', { recent: old })] })), [])
})

test('phase imbalance needs all three phases and a daily average above 50 percent', () => {
  const w = (r, s, t) => device({ sensors: [sensor('R', { avgWatts24h: r }), sensor('S', { avgWatts24h: s }), sensor('T', { avgWatts24h: t })] })
  assert.deepEqual(kinds(w(1000, 1000, 1000)), [])
  assert.deepEqual(kinds(w(1000, 1000, 2000)), [])
  assert.deepEqual(kinds(w(500, 500, 2000)), ['phase-imbalance'])
  assert.deepEqual(kinds(device({ sensors: [sensor('R', { avgWatts24h: 0, lastSampleAt: now - 26 * HOUR }), sensor('S'), sensor('T')] })), ['sensor-silent'])
})

const DAY = Date.parse('2026-11-10T00:00:00+07:00') / BUCKET_MS
const row = (bucket, min, max, watts, phase = 'R') => ({ deviceId: 'D1', phase, bucket, min, max, powerSum: watts * 60, count: 60 })

test('the index knows the last sample and since when a counter stands still', () => {
  const index = createEnergyIndex()
  index.merge([row(DAY, 1, 2, 4000), row(DAY + 1, 2, 2, 4000), row(DAY + 2, 2, 2, 4000), row(DAY + 3, null, null, 4000)])
  const p = index.phase('D1', 'R')
  assert.equal(p.lastSampleAt, (DAY + 3) * BUCKET_MS)
  assert.equal(p.counterSameSince, (DAY + 1) * BUCKET_MS)
  assert.equal(index.phase('D1', 'S').lastSampleAt, null)
  assert.equal(index.averageWatts('D1', 'R', DAY), 4000)
  assert.equal(index.averageWatts('D1', 'R', DAY + 10), null)
})

test('coverage counts quarter hours per Jakarta day, today only up to now', () => {
  const index = createEnergyIndex()
  index.merge(Array.from({ length: 96 }, (_, i) => row(DAY + i, 1, 2, 10)))
  index.merge(Array.from({ length: 24 }, (_, i) => row(DAY + 96 + i, 1, 2, 10)))
  const noon = (DAY + 96 + 48) * BUCKET_MS
  const days = coverageDays(index.phase('D1', 'R').buckets, noon, 3, index.firstSampleAt('D1'))
  assert.deepEqual(days.map((d) => [d.date, d.recorded, d.expected]), [['2026-11-10', 96, 96], ['2026-11-11', 24, 48]])
  assert.deepEqual(coverageSummary(days), { percent: 83.3, completeDays: 1, days: 2 })
})

test('coverage of a device that never reported is empty, not zero percent', () => {
  assert.deepEqual(coverageDays(new Set(), now, 30, null), [])
  assert.equal(coverageSummary([]).percent, null)
})
