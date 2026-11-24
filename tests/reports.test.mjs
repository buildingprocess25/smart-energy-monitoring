import { test } from 'node:test'
import assert from 'node:assert/strict'
import { buildConsumption, buildLoadProfile, parseReportParams, toCsv } from '../lib/reports.ts'
import { BUCKET_MS, createEnergyIndex } from '../lib/energy-index.ts'

const DAY = Date.parse('2026-11-10T00:00:00+07:00') / BUCKET_MS
const row = (deviceId, phase, bucket, min, max, watts) => ({ deviceId, phase, bucket, min, max, powerSum: watts * 60, count: 60 })
const devices = [
  { id: 'EM', storeCode: 'AB1', storeName: 'Toko', sensors: new Map([['R', 'Fase R'], ['FREEZER', 'Freezer']]) },
  { id: 'PLUG', storeCode: 'AB1', storeName: 'Toko', sensors: new Map([['PG', 'Cooler']]) },
]
function index() {
  const i = createEnergyIndex()
  i.merge([row('EM', 'R', DAY, 1, 1.5, 2000), row('EM', 'FREEZER', DAY, 1, 1.2, 800), row('PLUG', 'PG', DAY, 5, 5.1, 400), row('EM', 'R', DAY + 96, 2, 2.4, 2000)])
  return i
}

test('params: a real range of at most 366 days', () => {
  const ok = (q) => parseReportParams(new URLSearchParams(q)).ok
  assert.equal(ok('type=daily&store=all&from=2026-11-01&to=2026-11-24'), true)
  for (const q of ['', 'type=x&store=all&from=2026-11-01&to=2026-11-02', 'type=daily&store=all&from=2026-11-02&to=2026-11-01', 'type=daily&store=all&from=2025-01-01&to=2026-11-01', 'type=daily&store=all&from=2026-02-30&to=2026-03-01', "type=daily&store=a'b&from=2026-11-01&to=2026-11-02"]) assert.equal(ok(q), false, q)
})

test('daily report: cost only for the main panel, sensors listed but never added', () => {
  const r = buildConsumption(index(), devices, 'daily', '2026-11-10', '2026-11-10')
  assert.deepEqual(r.columns, ['Tanggal', 'Kode toko', 'Nama toko', 'Perangkat', 'Sumber', 'Energi (kWh)', 'Jam terekam', 'Biaya (Rp)'])
  assert.deepEqual(r.rows, [
    ['2026-11-10', 'AB1', 'Toko', 'EM', 'Panel utama (R/S/T)', 0.5, 0.25, 722],
    ['2026-11-10', 'AB1', 'Toko', 'EM', 'Sensor Freezer', 0.2, 0.25, null],
    ['2026-11-10', 'AB1', 'Toko', 'PLUG', 'Sensor Cooler', 0.1, 0.25, null],
  ])
})

test('monthly report sums days and range bounds are inclusive', () => {
  const r = buildConsumption(index(), devices.slice(0, 1), 'monthly', '2026-11-10', '2026-11-11')
  assert.deepEqual(r.rows[0], ['2026-11', 'AB1', 'Toko', 'EM', 'Panel utama (R/S/T)', 0.9, 0.5, 1300])
  assert.equal(buildConsumption(index(), devices, 'daily', '2026-11-12', '2026-11-20').rows.length, 0)
})

test('load profile averages recorded hours only', () => {
  const r = buildLoadProfile(index(), devices.slice(0, 1), '2026-11-10', '2026-11-11')
  assert.deepEqual(r.rows, [['AB1', 'Toko', 'EM', '00:00', 2000, 2000, 2000, 2]])
})

test('csv opens in Indonesian Excel and never carries a formula', () => {
  const csv = toCsv({ title: 't', columns: ['A', 'B'], rows: [['=1+1', 1234.5], ['x;"y"', null], ['-5', -5]] })
  assert.equal(csv, '﻿A;B\r\n\'=1+1;1234,5\r\n"x;""y""";\r\n\'-5;-5\r\n')
})
