import { test } from 'node:test'
import assert from 'node:assert/strict'
import { usagePeriod } from '../lib/usage-period.ts'
import { dailyThreshold, findSpikes, shiftDate, summarizePeriod } from '../lib/usage-insights.ts'

const day = (date, kwh, hours = 24, mainKwh = kwh) => ({ date, kwh, mainKwh, hours })
const flat = (watts) => Array.from({ length: 24 }, () => watts)

test('shiftDate crosses months', () => {
  assert.equal(shiftDate('2026-03-01', -1), '2026-02-28')
})

test('the average is per recorded day and the comparison per recorded hour', () => {
  const days = [day('2026-11-01', 100), day('2026-11-02', 100), day('2026-11-08', 60, 12)]
  const s = summarizePeriod(days, '2026-11-08', '2026-11-14', '2026-11-01', '2026-11-07')
  assert.equal(s.kwh, 60)
  assert.equal(s.days, 1)
  assert.equal(s.avgPerDay, 60)
  assert.equal(s.hours, 12)
  assert.equal(s.diffPct, 20) // 5 kWh per hour now, 200 / 48 before
})

test('an empty or uncovered period has no average and no comparison', () => {
  const s = summarizePeriod([day('2026-11-08', 60)], '2026-11-08', '2026-11-08', '2026-11-01', '2026-11-01')
  assert.equal(s.diffPct, null)
  assert.equal(summarizePeriod([], '2026-11-01', '2026-11-07').avgPerDay, null)
})

test('too little recording on either side gives no comparison', () => {
  const days = [day('2026-11-01', 1, 0.5), day('2026-11-08', 100)]
  assert.equal(summarizePeriod(days, '2026-11-08', '2026-11-08', '2026-11-01', '2026-11-01').diffPct, null)
})

test('spikes compare with the same hour of earlier days', () => {
  const today = flat(4000)
  today[2] = 5400
  today[3] = 6800
  const spikes = findSpikes(today, Array.from({ length: 10 }, () => flat(4000)))
  assert.equal(spikes[0].level, null)
  assert.equal(spikes[0].typicalWatts, 4000)
  assert.equal(spikes[2].level, 'warning')
  assert.equal(spikes[3].level, 'critical')
})

test('no pattern before enough days, and no mark without a reading', () => {
  const few = findSpikes(flat(9000), Array.from({ length: 6 }, () => flat(1000)))
  assert.ok(few.every((s) => s.level === null && s.typicalWatts === null))
  const gap = findSpikes(flat(null), Array.from({ length: 10 }, () => flat(1000)))
  assert.ok(gap.every((s) => s.level === null))
})

test('a small rise or a load this hour often reaches is not a spike', () => {
  const small = findSpikes(flat(160), Array.from({ length: 10 }, () => flat(100)))
  assert.equal(small[0].level, null)
  const usual = Array.from({ length: 10 }, (_, i) => flat(i < 7 ? 4000 : 7000))
  assert.equal(findSpikes(flat(7000), usual)[0].level, null)
})

test('the standard wins, otherwise 120% of the own median of full days before the date', () => {
  const days = Array.from({ length: 8 }, (_, i) => day(`2026-11-0${i + 1}`, 100))
  assert.deepEqual(dailyThreshold(days, '2026-11-09', 80), { source: 'standard', kwhPerDay: 80 })
  assert.deepEqual(dailyThreshold(days, '2026-11-09', null), { source: 'own', kwhPerDay: 120 })
  // partial days and later days never count
  assert.equal(dailyThreshold(days.map((d) => ({ ...d, hours: 10 })), '2026-11-09', null), null)
  assert.equal(dailyThreshold(days, '2026-11-04', null), null)
})

test('a device without a main panel has no threshold', () => {
  const days = Array.from({ length: 8 }, (_, i) => day(`2026-11-0${i + 1}`, 100, 24, 0))
  assert.equal(dailyThreshold(days, '2026-11-09', null), null)
})

test('each tab summarizes its own period', () => {
  const days = Array.from({ length: 20 }, (_, i) => day(shiftDate('2026-11-01', i), 100))
  const labels = { day: 'hari', week: 'minggu' }
  assert.equal(usagePeriod('daily', days, '2026-11-20', 0, labels).summary.diffPct, 0)
  const week = usagePeriod('weekly', days, '2026-11-20', 1, labels).summary
  assert.equal(week.days, 7)
  assert.equal(usagePeriod('monthly', days, '2026-11-20', 0, labels).expectedHours, 720)
})

test('a half recorded day is not compared', () => {
  const days = [day('2026-11-13', 100), day('2026-11-20', 80, 12)]
  assert.equal(usagePeriod('daily', days, '2026-11-20', 0, { day: '', week: '' }).summary.diffPct, null)
})
