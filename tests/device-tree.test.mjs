import { test } from 'node:test'
import assert from 'node:assert/strict'
import { buildDeviceTree } from '../lib/device-tree.ts'

const device = (over = {}) => ({
  id: 'EM-1', online: true, storeId: 's1', storeCode: '2JC2', storeName: 'DC Cianjur', branch: 'CIANJUR',
  sensors: [
    { phase: 'R', name: 'Fase R', isMain: true, kwh: 10 },
    { phase: 'S', name: 'Fase S', isMain: true, kwh: 5 },
    { phase: 'L4', name: 'AC 1', isMain: false, kwh: 8 },
  ],
  ...over,
})

test('only the main panel adds up, sub-meters are listed apart', () => {
  const [branch] = buildDeviceTree([device()])
  assert.equal(branch.name, 'CIANJUR')
  assert.equal(branch.stores[0].mainKwh, 15)
  assert.equal(branch.mainKwh, 15)
  assert.deepEqual(branch.stores[0].main.map((s) => s.name), ['Fase R', 'Fase S'])
  assert.deepEqual(branch.stores[0].sub.map((s) => s.name), ['AC 1'])
})

test('devices of one store become one node, branches are sorted', () => {
  const tree = buildDeviceTree([
    device({ id: 'Z', storeId: 's2', storeName: 'B', branch: 'SERANG' }),
    device(),
    device({ id: 'CT-1', online: false, sensors: [{ phase: 'x', name: 'Lampu', isMain: false, kwh: null }] }),
  ])
  assert.deepEqual(tree.map((b) => b.name), ['CIANJUR', 'SERANG'])
  assert.equal(tree[0].stores.length, 1)
  assert.equal(tree[0].stores[0].deviceCount, 2)
  assert.equal(tree[0].stores[0].onlineCount, 1)
  assert.equal(tree[0].stores[0].sub.length, 2)
})

test('no main panel means no total, not 0', () => {
  const [branch] = buildDeviceTree([device({ sensors: [{ phase: 'x', name: 'Lampu', isMain: false, kwh: 3 }] })])
  assert.equal(branch.stores[0].mainKwh, null)
  assert.equal(branch.mainKwh, null)
})

test('devices without a store come last', () => {
  const tree = buildDeviceTree([
    device({ id: 'A', storeId: null, storeCode: null, storeName: null, branch: null }),
    device(),
  ])
  assert.deepEqual(tree.map((b) => b.name), ['CIANJUR', 'Belum terhubung ke toko'])
  assert.equal(tree[1].stores[0].name, 'A')
})
