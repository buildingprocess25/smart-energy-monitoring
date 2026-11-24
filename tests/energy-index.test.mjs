import { test } from 'node:test'
import assert from 'node:assert/strict'
import { createEnergyIndex, BUCKET_MS } from '../lib/energy-index.ts'
import { jakartaRange } from '../lib/jakarta-range.ts'

// 2026-11-10 00:00 in Jakarta
const DAY = Date.parse('2026-11-10T00:00:00+07:00') / BUCKET_MS

// One 15-minute bucket; power in watts.
function row(bucket, min, max, watts, phase = 'R', deviceId = 'D1') {
  return { deviceId, phase, bucket, min, max, powerSum: watts * 60, count: 60 }
}

const near = (a, b) => assert.ok(Math.abs(a - b) < 1e-6, `${a} != ${b}`)

test('energy is the counter delta, including the step between buckets', () => {
  const index = createEnergyIndex()
  index.merge([row(DAY, 100, 100.9, 4000), row(DAY + 1, 100.95, 101.9, 4000)])
  near(index.total('D1').main, 1.9)
})

test('a counter reset between buckets keeps both sides', () => {
  const index = createEnergyIndex()
  index.merge([row(DAY, 295, 295.4, 2000), row(DAY + 1, 0.002, 0.402, 2000)])
  near(index.total('D1').main, 0.8)
})

test('a jump the power cannot explain becomes average power times time', () => {
  const index = createEnergyIndex()
  index.merge([row(DAY, 100, 100.5, 2000), row(DAY + 1, 100.5, 5000, 2000)])
  near(index.total('D1').main, 0.5 + 0.5)
})

test('time without records adds nothing', () => {
  const index = createEnergyIndex()
  index.merge([row(DAY, 100, 100.5, 2000), row(DAY + 40, 300, 300.5, 2000)])
  near(index.total('D1').main, 1)
})

test('a bucket without a counter reading adds no energy but keeps its power', () => {
  const index = createEnergyIndex()
  index.merge([row(DAY, null, null, 2000)])
  near(index.total('D1').main, 0)
  assert.equal(index.loadProfile('D1', '2026-11-10')[0], 2000)
})

test('only R/S/T count as main panel, sub-meters stay separate', () => {
  const index = createEnergyIndex()
  index.merge([row(DAY, 10, 10.5, 2000, 'S'), row(DAY, 5, 5.2, 800, 'FREEZER_01')])
  const total = index.total('D1')
  near(total.main, 0.5)
  near(total.all, 0.7)
  assert.equal(total.hasMain, true)
  assert.equal(index.loadProfile('D1', '2026-11-10')[0], 2000)
})

test('a device without R/S/T reports its sensors only', () => {
  const index = createEnergyIndex()
  index.merge([row(DAY, 5, 5.2, 800, 'CT')])
  assert.equal(index.total('D1').hasMain, false)
  near(index.daily('D1')[0].kwh, 0.2)
  assert.equal(index.daily('D1')[0].mainKwh, 0)
})

test('days follow Jakarta and devices stay apart', () => {
  const index = createEnergyIndex()
  index.merge([
    row(DAY - 1, 100, 100.4, 2000),
    row(DAY, 100.4, 100.9, 2000),
    row(DAY, 1, 1.1, 400, 'R', 'D2'),
  ])
  assert.deepEqual(index.daily('D1').map((d) => d.date), ['2026-11-09', '2026-11-10'])
  near(index.daily('D1')[1].kwh, 0.5)
  near(index.daily('D2')[0].kwh, 0.1)
  assert.deepEqual(index.dates('D1'), ['2026-11-10', '2026-11-09'])
  assert.deepEqual(index.dates('unknown'), [])
})

test('merging new rows of the same bucket extends it', () => {
  const index = createEnergyIndex()
  index.merge([row(DAY, 100, 100.2, 2000)])
  near(index.total('D1').main, 0.2)
  index.merge([row(DAY, 100.2, 100.5, 2000)])
  near(index.total('D1').main, 0.5)
})

test('daily energy can be read per phase', () => {
  const index = createEnergyIndex()
  index.merge([row(DAY, 10, 10.5, 2000, 'R'), row(DAY, 20, 20.25, 1000, 'S')])
  const phases = index.daily('D1')[0].phases
  near(phases.R, 0.5)
  near(phases.S, 0.25)
})

test('jakartaRange covers whole Jakarta periods', () => {
  const iso = (r) => [new Date(r.from).toISOString(), new Date(r.to).toISOString()]
  assert.deepEqual(iso(jakartaRange('day', '2026-11-10')), ['2026-11-09T17:00:00.000Z', '2026-11-10T17:00:00.000Z'])
  assert.deepEqual(iso(jakartaRange('week', '2026-11-10')), ['2026-11-03T17:00:00.000Z', '2026-11-10T17:00:00.000Z'])
  assert.deepEqual(iso(jakartaRange('month', '2026-12-31')), ['2026-11-30T17:00:00.000Z', '2026-12-31T17:00:00.000Z'])
  assert.deepEqual(iso(jakartaRange('year', '2026-11-10')), ['2025-12-31T17:00:00.000Z', '2026-12-31T17:00:00.000Z'])
})

test('recorded hours count each bucket once, whatever the number of phases', () => {
  const index = createEnergyIndex()
  index.merge([row(DAY, 1, 1.5, 2000, 'R'), row(DAY, 1, 1.5, 2000, 'S'), row(DAY + 1, 1.5, 2, 2000, 'R')])
  assert.equal(index.daily('D1')[0].hours, 0.5)
})
