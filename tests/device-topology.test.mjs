import { test } from 'node:test'
import assert from 'node:assert/strict'
import {
  parseNotes,
  phaseKeyFor,
  macOf,
  virtualDeviceId,
  isVirtualDeviceId,
  resolveTopology,
  placementAt,
  storePhaseFor,
  currentMembers,
  macsEverIn,
  expandBucketRows,
  sqlSource,
} from '../lib/device-topology.ts'

const BUCKET = 15 * 60 * 1000

test('parseNotes reads store, panel and phase', () => {
  assert.deepEqual(parseNotes('t105/mdp/r'), { storeCode: 'T105', panel: 'MDP', phase: 'R' })
  assert.deepEqual(parseNotes('T200/SHOWCASE'), { storeCode: 'T200', panel: 'SHOWCASE', phase: '1F' })
  assert.equal(parseNotes('T105'), null)
  assert.equal(parseNotes('/MDP/R'), null)
  assert.equal(parseNotes(''), null)
})

test('phaseKeyFor keeps main panel phases and names sub-meters after the panel', () => {
  assert.equal(phaseKeyFor('MDP', 'R'), 'R')
  assert.equal(phaseKeyFor('LVMDP', '1F'), '1F')
  assert.equal(phaseKeyFor('OVEN', '1F'), 'OVEN')
  assert.equal(phaseKeyFor('AC', 'S'), 'AC S')
  assert.equal(phaseKeyFor('MDP', 'X'), 'MDP X')
  assert.equal(phaseKeyFor('A/C#1', '1F'), 'AC1')
})

test('macOf only reads SpartaEnergy device ids', () => {
  assert.equal(macOf('CT-e62a34'), 'E62A34')
  assert.equal(macOf('Plug-B80E68'), 'B80E68')
  assert.equal(macOf('EM-0002'), null)
  assert.equal(macOf('CT-E62A3'), null)
})

test('virtual ids are recognisable', () => {
  assert.equal(virtualDeviceId('T105'), 'SPARTA-T105')
  assert.equal(isVirtualDeviceId('SPARTA-T105'), true)
  assert.equal(isVirtualDeviceId('CT-E62A34'), false)
})

const rows = [
  { mac: 'AAAAAA', notes: 'T105/MDP/R', validFrom: 0, validTo: 10 * BUCKET },
  { mac: 'AAAAAA', notes: 'T200/MDP/S', validFrom: 10 * BUCKET, validTo: null },
  { mac: 'BBBBBB', notes: 'T105/MDP/S', validFrom: 0, validTo: null },
  { mac: 'CCCCCC', notes: 'rusak', validFrom: 0, validTo: null },
]

test('placementAt follows the location at the time of the sample', () => {
  const map = resolveTopology(rows)
  assert.equal(placementAt(map, 'AAAAAA', 5 * BUCKET).deviceId, 'SPARTA-T105')
  assert.equal(placementAt(map, 'AAAAAA', 5 * BUCKET).phase, 'R')
  assert.equal(placementAt(map, 'AAAAAA', 12 * BUCKET).deviceId, 'SPARTA-T200')
  assert.equal(placementAt(map, 'AAAAAA', 12 * BUCKET).phase, 'S')
  assert.equal(placementAt(map, 'CCCCCC', 5 * BUCKET), null)
  assert.equal(placementAt(map, 'DDDDDD', 5 * BUCKET), null)
})

test('the last configured device wins a shared store phase', () => {
  const map = resolveTopology([
    { mac: 'AAAAAA', notes: 'T105/MDP/R', validFrom: 0, validTo: null },
    { mac: 'DDDDDD', notes: 'T105/MDP/R', validFrom: 20 * BUCKET, validTo: null },
  ])
  assert.equal(placementAt(map, 'AAAAAA', 5 * BUCKET).phase, 'R')
  assert.equal(placementAt(map, 'AAAAAA', 25 * BUCKET), null)
  assert.equal(placementAt(map, 'DDDDDD', 25 * BUCKET).phase, 'R')
})

test('storePhaseFor keeps the phases a three-phase device reports itself', () => {
  const map = resolveTopology([
    { mac: 'AAAAAA', notes: 'T105/MDP/R', validFrom: 0, validTo: null },
    { mac: 'EEEEEE', notes: 'T105/AC', validFrom: 0, validTo: null },
  ])
  const main = placementAt(map, 'AAAAAA', 0)
  const sub = placementAt(map, 'EEEEEE', 0)
  assert.equal(main.panel, 'MDP')
  assert.equal(main.main, true)
  assert.equal(sub.main, false)
  assert.equal(storePhaseFor(main, 'CT'), 'R')
  assert.equal(storePhaseFor(main, 'S'), 'S')
  assert.equal(storePhaseFor(sub, 'PG'), 'AC')
  assert.equal(storePhaseFor(sub, 'T'), 'AC T')
})

test('currentMembers lists devices placed now, macsEverIn lists every device a store had', () => {
  const map = resolveTopology(rows)
  assert.deepEqual(currentMembers(map, 12 * BUCKET).get('SPARTA-T105'), [{ mac: 'BBBBBB', phase: 'S', prefix: '' }])
  assert.deepEqual(currentMembers(map, 12 * BUCKET).get('SPARTA-T200'), [{ mac: 'AAAAAA', phase: 'S', prefix: '' }])
  assert.deepEqual(macsEverIn(map, 'SPARTA-T105'), ['AAAAAA', 'BBBBBB'])
})

test('expandBucketRows keeps the physical row and adds the store copy', () => {
  const map = resolveTopology(rows)
  const row = { deviceId: 'CT-AAAAAA', phase: 'CT', bucket: 12, min: 1, max: 2, powerSum: 100, count: 4 }
  const threePhase = { deviceId: 'CT-BBBBBB', phase: 'T', bucket: 12, min: 1, max: 2, powerSum: 100, count: 4 }
  const legacy = { deviceId: 'EM-0002', phase: 'R', bucket: 12, min: 1, max: 2, powerSum: 100, count: 4 }
  assert.deepEqual(expandBucketRows([row, threePhase, legacy], map), [
    row,
    { ...row, deviceId: 'SPARTA-T200', phase: 'S' },
    threePhase,
    { ...threePhase, deviceId: 'SPARTA-T105', phase: 'T' },
    legacy,
  ])
})

test('sqlSource leaves normal devices alone', () => {
  const src = sqlSource('EM-0002', resolveTopology(rows), 3, 'phase')
  assert.equal(src.where, 'device_id = $3')
  assert.equal(src.phase, 'phase')
  assert.deepEqual(src.params, ['EM-0002'])
})

test('sqlSource reads every placement of a store with its phase', () => {
  const src = sqlSource('SPARTA-T105', resolveTopology(rows), 2, 'phase')
  assert.equal(
    src.where,
    '((device_id = ANY($2::text[]) AND epoch >= $3 AND epoch < $4) OR (device_id = ANY($7::text[]) AND epoch >= $8 AND epoch < $9))'
  )
  assert.equal(
    src.phase,
    "CASE WHEN device_id = ANY($2::text[]) AND epoch >= $3 AND epoch < $4 THEN CASE WHEN phase IN ('R', 'S', 'T') THEN ltrim($6::text || ' ' || phase) ELSE $5::text END" +
      " WHEN device_id = ANY($7::text[]) AND epoch >= $8 AND epoch < $9 THEN CASE WHEN phase IN ('R', 'S', 'T') THEN ltrim($11::text || ' ' || phase) ELSE $10::text END" +
      ' ELSE phase END'
  )
  assert.deepEqual(src.params, [
    ['CT-AAAAAA', 'Plug-AAAAAA'], 0, 10 * BUCKET, 'R', '',
    ['CT-BBBBBB', 'Plug-BBBBBB'], 0, Number.MAX_SAFE_INTEGER, 'S', '',
  ])
})

test('sqlSource names the panel for a three-phase sub-meter', () => {
  const src = sqlSource('SPARTA-T105', resolveTopology([{ mac: 'EEEEEE', notes: 'T105/AC', validFrom: 0, validTo: null }]), 1, 'phase')
  assert.deepEqual(src.params, [['CT-EEEEEE', 'Plug-EEEEEE'], 0, Number.MAX_SAFE_INTEGER, 'AC', 'AC'])
})

test('sqlSource of an unknown store reads nothing', () => {
  assert.deepEqual(sqlSource('SPARTA-X1', resolveTopology(rows), 1, 'phase'), { where: 'FALSE', phase: 'phase', params: [] })
})
