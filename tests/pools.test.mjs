import { test } from 'node:test'
import assert from 'node:assert/strict'
import { createPoolConfig, POOL_STATEMENT_TIMEOUT_MS } from '../lib/db/pools.ts'

test('every pool ends a statement that runs too long', () => {
  const config = createPoolConfig('postgresql://u:p@h:5432/d?sslmode=disable')
  assert.equal(config.statement_timeout, POOL_STATEMENT_TIMEOUT_MS)
  // The monthly cost query takes about 12 s, so the limit must leave it room.
  assert.ok(POOL_STATEMENT_TIMEOUT_MS >= 24_000)
  assert.equal(config.ssl, undefined)
})
