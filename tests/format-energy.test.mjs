import { test } from 'node:test'
import assert from 'node:assert/strict'
import { formatStoreKwh, mainPanelKwh } from '../lib/format-energy.ts'

test('a store without a reading shows a dash, not zero', () => {
  assert.equal(formatStoreKwh({ kwhTotal: 0, energyBasis: 'none' }), '-')
  assert.equal(formatStoreKwh({ kwhTotal: 7866.8, energyBasis: 'main' }), '7.866,8')
})

test('only main panels add up to the network total', () => {
  const stores = [
    { kwhTotal: 100, energyBasis: 'main' },
    { kwhTotal: 30, energyBasis: 'sensor' },
    { kwhTotal: 0, energyBasis: 'none' },
  ]
  assert.equal(mainPanelKwh(stores), 100)
})
