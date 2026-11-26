import { test } from 'node:test'
import assert from 'node:assert/strict'
import { parseLiveBuffer, formatJakartaTime, combineLiveBuffers } from '../lib/live-buffer.ts'

const metrics = (w, v = 220) => ({
  'Voltage (V)': v,
  'Current (A)': w / v,
  'Power (W)': w,
  'Frequency (Hz)': 50,
  'Active Energy (kWh)': 12.5,
  'Power Factor': 0.9,
})

// 2026-11-09 10:00:00 WIB
const T0 = Date.UTC(2026, 10, 9, 3, 0, 0)

test('formatJakartaTime shows WIB clock time', () => {
  assert.equal(formatJakartaTime(T0), '10:00:00')
})

test('parseLiveBuffer normalizes phases and drops metadata and L6', () => {
  const raw = [
    {
      timestamp: T0,
      data: { L12: metrics(100), L13: metrics(200), L6: metrics(5), Timestamp: 'x', status: { relay: 'ON' } },
    },
  ]
  const r = parseLiveBuffer(raw, null)
  assert.deepEqual(r.sensors.map((s) => s.phase), ['R', 'S'])
  assert.equal(r.sensors[0].name, 'Fase R')
  assert.equal(r.points.length, 1)
  assert.equal(r.points[0].R_power, 100)
  assert.equal(r.points[0].S_voltage, 220)
  assert.equal(r.points[0].totalPower, 300)
  assert.equal(r.points[0].timestamp, '10:00:00')
  assert.equal(r.offline, false)
  assert.equal(r.lastEpoch, T0)
})

test('parseLiveBuffer keeps only points after since', () => {
  const raw = [
    { timestamp: T0, data: { R: metrics(100) } },
    { timestamp: T0 + 1000, data: { R: metrics(110) } },
  ]
  const r = parseLiveBuffer(raw, T0)
  assert.equal(r.points.length, 1)
  assert.equal(r.points[0].R_power, 110)
  assert.equal(r.lastEpoch, T0 + 1000)
})

test('parseLiveBuffer reports offline when the latest item is offline', () => {
  const raw = [
    { timestamp: T0, data: { R: metrics(100) } },
    { timestamp: T0 + 1000, data: { offline: true } },
  ]
  const r = parseLiveBuffer(raw, null)
  assert.equal(r.offline, true)
  assert.equal(r.points.length, 1)
  assert.equal(r.lastEpoch, T0 + 1000)
})

test('parseLiveBuffer tolerates bad input', () => {
  assert.deepEqual(parseLiveBuffer(null, null), { sensors: [], points: [], offline: true, lastEpoch: null })
  assert.deepEqual(parseLiveBuffer([{ nope: 1 }, 'x'], null).points, [])
})

test('parseLiveBuffer treats null and empty values as missing, not zero', () => {
  const raw = [
    { timestamp: null, data: { R: metrics(100) } },
    { timestamp: T0, data: { R: { 'Power (W)': null, 'Voltage (V)': '', 'Current (A)': true, 'Power Factor': '0.9' } } },
    { timestamp: T0 + 1000, data: { Timestamp: 'x', status: {} } },
  ]
  const r = parseLiveBuffer(raw, null)
  assert.equal(r.lastEpoch, T0 + 1000)
  assert.equal(r.points.length, 1)
  assert.equal('R_power' in r.points[0], false)
  assert.equal('R_voltage' in r.points[0], false)
  assert.equal('R_current' in r.points[0], false)
  assert.equal(r.points[0].R_powerFactor, 0.9)
  assert.equal(r.points[0].totalPower, 0)
})

test('the live total counts R/S/T only when the device has a main panel', () => {
  const sample = (data) => parseLiveBuffer([{ timestamp: 1000, data }], null).points[0].totalPower
  assert.equal(sample({ R: { 'Power (W)': 100 }, S: { 'Power (W)': 50 }, FREEZER_01: { 'Power (W)': 30 } }), 150)
  assert.equal(sample({ PG: { 'Power (W)': 30 } }), 30)
})

test('combineLiveBuffers puts each device under its store phase', () => {
  const r = [{ timestamp: 1000, data: { CT: { 'Power (W)': 100 }, status: { relay: 'ON' } } }]
  const s = [
    { timestamp: 1400, data: { CT: { 'Power (W)': 200 } } },
    { timestamp: 2000, data: { offline: true } },
  ]
  assert.deepEqual(combineLiveBuffers([{ raw: r, phase: 'R', prefix: '' }, { raw: s, phase: 'S', prefix: '' }]), [
    { timestamp: 1000, data: { R: { 'Power (W)': 100 }, S: { 'Power (W)': 200 } } },
    { timestamp: 2000, data: { offline: true } },
  ])
})

test('combineLiveBuffers keeps every channel of a multi-channel device', () => {
  const raw = [{ timestamp: 1000, data: { CT1: { 'Power (W)': 1 }, CT2: { 'Power (W)': 2 } } }]
  assert.deepEqual(combineLiveBuffers([{ raw, phase: 'OVEN', prefix: 'OVEN' }]), [
    { timestamp: 1000, data: { 'OVEN CT1': { 'Power (W)': 1 }, 'OVEN CT2': { 'Power (W)': 2 } } },
  ])
})

test('combineLiveBuffers keeps the phases a three-phase device reports itself', () => {
  const raw = [{ timestamp: 1000, data: { L12: { 'Power (W)': 1 }, S: { 'Power (W)': 2 } } }]
  assert.deepEqual(combineLiveBuffers([{ raw, phase: 'R', prefix: '' }]), [
    { timestamp: 1000, data: { R: { 'Power (W)': 1 }, S: { 'Power (W)': 2 } } },
  ])
  assert.deepEqual(combineLiveBuffers([{ raw, phase: 'AC', prefix: 'AC' }]), [
    { timestamp: 1000, data: { 'AC R': { 'Power (W)': 1 }, 'AC S': { 'Power (W)': 2 } } },
  ])
})

test('combineLiveBuffers ignores what is not a buffer', () => {
  assert.deepEqual(combineLiveBuffers([{ raw: null, phase: 'R', prefix: '' }, { raw: [{ nope: 1 }], phase: 'S', prefix: '' }]), [])
})
