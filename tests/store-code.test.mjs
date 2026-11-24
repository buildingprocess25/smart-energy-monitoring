import { test } from 'node:test'
import assert from 'node:assert/strict'
import { extractStoreCode, sessionStore } from '../lib/store-code.ts'
import { formatDuration } from '../lib/format-duration.ts'

const stores = [
  { id: 's1', code: '2JC2', name: 'DC CIANJUR', deviceId: 'EM-0010' },
  { id: 's2', code: 'TF67', name: 'KYAI MAJA 2', deviceId: 'CT-E62A34' },
]

test('extractStoreCode reads the code in brackets', () => {
  assert.equal(extractStoreCode('Dc Cianjur ( 2jc2 )'), '2JC2')
  assert.equal(extractStoreCode('EM-0002 [TI90] RUKO ELEVEE'), 'TI90')
  assert.equal(extractStoreCode('EM-0002'), null)
})

test('a session belongs to the store named when it was recorded, not to where the device is now', () => {
  assert.deepEqual(sessionStore('CT-E62A34', 'CT-E62A34 [KG21] SPBU BP ICON', stores), {
    storeId: null,
    storeCode: 'KG21',
    storeName: 'SPBU BP ICON',
  })
})

test('every device of a store links to it, not only the main one', () => {
  assert.deepEqual(sessionStore('Plug-B80E68', 'Plug-B80E68 [TF67] KYAI MAJA 2', stores), {
    storeId: 's2',
    storeCode: 'TF67',
    storeName: 'KYAI MAJA 2',
  })
})

test('a device name without a code falls back to the store of the device', () => {
  assert.equal(sessionStore('EM-0010', 'EM-0010', stores).storeId, 's1')
  assert.deepEqual(sessionStore('X', 'X', stores), { storeId: null, storeCode: null, storeName: null })
})

test('formatDuration keeps the two largest units', () => {
  const min = 60_000
  assert.equal(formatDuration(30_000), 'kurang dari 1 menit')
  assert.equal(formatDuration(93 * min), '1 jam 33 menit')
  assert.equal(formatDuration(120 * min), '2 jam')
  assert.equal(formatDuration(7 * 1440 * min + 61 * min), '7 hari 1 jam')
})
