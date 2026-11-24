import { test } from 'node:test'
import assert from 'node:assert/strict'
import { countDays, countHours, hoursOfDate, HOUR_MS, isComplete, validPercent } from '../lib/sample-count.ts'

const START = Date.parse('2026-11-10T00:00:00+07:00')
const H = START / HOUR_MS
// A row of one hour; `first` and `last` are seconds into that hour.
const row = (hour, over = {}, first = 4, last = 3589, sessionId = 'S1') => ({
  sessionId, hour: H + hour, valid: 240, offline: 0, invalid: 0,
  first: (H + hour) * HOUR_MS + first * 1000, last: (H + hour) * HOUR_MS + last * 1000, ...over,
})

test('a full hour expects 240 samples and splits what came in', () => {
  const hours = countHours([row(0), row(1, { valid: 200, offline: 30, invalid: 2 }), row(2)])
  assert.deepEqual(hours.get(H + 1), { expected: 240, valid: 200, offline: 30, invalid: 2, missing: 8 })
  assert.equal(hours.get(H).expected, 240)
})

test('time outside sessions expects nothing, a hole inside a session is missing', () => {
  const separate = countHours([row(0), row(5, {}, 4, 3589, 'S2')])
  assert.equal(separate.has(H + 2), false)
  const hole = countHours([row(0), row(5)])
  assert.deepEqual(hole.get(H + 2), { expected: 240, valid: 0, offline: 0, invalid: 0, missing: 240 })
})

test('a session that starts and ends inside an hour expects only its own samples', () => {
  const hours = countHours([row(0, { valid: 40 }, 1800, 2385)])
  assert.deepEqual(hours.get(H), { expected: 40, valid: 40, offline: 0, invalid: 0, missing: 0 })
})

test('overlapping sessions are expected once', () => {
  const hours = countHours([row(0), row(0, { valid: 100 }, 4, 3589, 'S2')])
  assert.equal(hours.get(H).expected, 240)
  assert.equal(hours.get(H).valid, 240)
})

test('a stalled session keeps expecting samples, an unknown one adds nothing', () => {
  const rows = [row(0)]
  assert.equal(countHours(rows, { id: 'S1', until: (H + 2) * HOUR_MS }).get(H + 1).missing, 240)
  assert.equal(countHours(rows, { id: 'X', until: (H + 2) * HOUR_MS }).has(H + 1), false)
})

test('days keep unrecorded dates with nothing expected', () => {
  const hours = countHours([row(0), row(1)])
  const days = countDays(hours, START + 30 * HOUR_MS, 3)
  assert.deepEqual(days.map((d) => [d.date, d.expected]), [['2026-11-09', 0], ['2026-11-10', 480], ['2026-11-11', 0]])
  const list = hoursOfDate(hours, '2026-11-10')
  assert.equal(list.length, 24)
  assert.equal(list[1].expected, 240)
  assert.equal(list[2].expected, 0)
})

test('percent never rounds up to 100 and nothing expected has no percent', () => {
  const c = (expected, valid) => ({ expected, valid, offline: 0, invalid: 0, missing: 0 })
  assert.equal(validPercent(c(10000, 9999)), 99.9)
  assert.equal(validPercent(c(0, 0)), null)
  assert.equal(isComplete(c(240, 216)), true)
  assert.equal(isComplete(c(240, 215)), false)
})
