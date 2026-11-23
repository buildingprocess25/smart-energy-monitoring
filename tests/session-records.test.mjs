import { test } from 'node:test'
import assert from 'node:assert/strict'
import { groupSessionRows, energyDeltaKwh, summarizeSession, toChartData } from '../lib/session-records.ts'

const T0 = Date.UTC(2026, 10, 9, 3, 0, 0)
const MIN = 60_000
const row = (phase, i, power, energy, offline = false) => ({
  phase,
  timestamp: `10:0${i}:00 09/11/2026`,
  epoch: String(T0 + i * MIN),
  voltage: 220,
  current: power / 220,
  power,
  frequency: 50,
  energy,
  power_factor: 0.9,
  offline,
})
const rec = (i, power, energy, offline = false) => ({
  timestamp: '', epoch: T0 + i * MIN, offline, voltage: 220, current: 0, power, frequency: 50, energy, powerFactor: 0.9,
})

test('groupSessionRows groups by phase, keeps raw keys and drops L6', () => {
  const g = groupSessionRows(
    [row('L13', 0, 100, 1), row('L12', 0, 100, 1), row('L12', 1, 100, 1.01), row('L6', 0, 1, 0)],
    { L12: 'Panel Utama R' }
  )
  assert.deepEqual(g.map((p) => p.phase), ['L12', 'L13'])
  assert.equal(g[0].name, 'Panel Utama R')
  assert.equal(g[1].name, 'Fase S')
  assert.equal(g[0].records.length, 2)
  assert.equal(g[0].records[1].epoch, T0 + MIN)
  assert.equal(typeof g[0].records[0].voltage, 'number')
})

test('energyDeltaKwh sums counter deltas', () => {
  assert.equal(energyDeltaKwh([rec(0, 600, 10), rec(1, 600, 10.01), rec(2, 600, 10.02)]).toFixed(2), '0.02')
})

test('energyDeltaKwh replaces a counter reset with average power x interval', () => {
  // 600 W for 1 minute = 0.01 kWh
  const kwh = energyDeltaKwh([rec(0, 600, 10), rec(1, 600, 0.001)])
  assert.equal(kwh.toFixed(4), '0.0100')
})

test('energyDeltaKwh replaces an impossible jump with average power x interval', () => {
  const kwh = energyDeltaKwh([rec(0, 600, 10), rec(1, 600, 500)])
  assert.equal(kwh.toFixed(4), '0.0100')
})

test('energyDeltaKwh skips steps that touch an offline record', () => {
  assert.equal(energyDeltaKwh([rec(0, 600, 10), rec(1, 0, 0, true), rec(2, 600, 10.01)]), 0)
})

test('summarizeSession averages online records only', () => {
  const s = summarizeSession([{ phase: 'R', name: 'Fase R', records: [rec(0, 600, 10), rec(1, 0, 0, true), rec(2, 300, 10.01)] }])
  assert.equal(s.totalRecords, 3)
  assert.equal(s.onlineRecords, 2)
  assert.equal(s.offlineRecords, 1)
  assert.equal(s.avgPower, 450)
})

test('toChartData merges phases by epoch with normalized keys', () => {
  const { sensors, points } = toChartData([
    { phase: 'L12', name: 'Fase R', records: [rec(0, 100, 1), rec(1, 110, 1)] },
    { phase: 'L13', name: 'Fase S', records: [rec(0, 200, 1)] },
  ])
  assert.deepEqual(sensors.map((s) => s.phase), ['R', 'S'])
  assert.equal(points.length, 2)
  assert.equal(points[0].R_power, 100)
  assert.equal(points[0].S_power, 200)
  assert.equal(points[0].totalPower, 300)
  assert.equal(points[1].S_power, undefined)
})
