import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readOnlyQuery, SESSION_QUERY_TIMEOUT_MS } from '../lib/db/read-only.ts'

function fakePool({ failOn, failRollback } = {}) {
  const log = []
  const client = {
    released: false,
    releasedWith: undefined,
    async query(text, values) {
      log.push(values ? [text, values] : text)
      if (failRollback && text === 'ROLLBACK') throw new Error('rollback failed')
      if (failOn && text.includes(failOn)) throw new Error('boom')
      return { rows: text.startsWith('SELECT') ? [{ id: 1 }] : [] }
    },
    release(err) {
      this.released = true
      this.releasedWith = err
    },
  }
  return { log, client, pool: { connect: async () => client } }
}

test('runs the query inside a read-only transaction with a statement timeout', async () => {
  const { log, client, pool } = fakePool()
  const res = await readOnlyQuery(pool, 'SELECT 1 WHERE a = $1', ['x'])
  assert.deepEqual(res.rows, [{ id: 1 }])
  assert.deepEqual(log, [
    'BEGIN READ ONLY',
    `SET LOCAL statement_timeout = ${SESSION_QUERY_TIMEOUT_MS}`,
    ['SELECT 1 WHERE a = $1', ['x']],
    'COMMIT',
  ])
  assert.equal(client.released, true)
})

test('rolls back and releases the client when the query fails', async () => {
  const { log, client, pool } = fakePool({ failOn: 'SELECT' })
  await assert.rejects(readOnlyQuery(pool, 'SELECT 1', []), /boom/)
  assert.equal(log.at(-1), 'ROLLBACK')
  assert.equal(client.released, true)
})

test('rejects a timeout that is not a positive whole number', async () => {
  const { pool } = fakePool()
  await assert.rejects(readOnlyQuery(pool, 'SELECT 1', [], 0), /timeout/)
  await assert.rejects(readOnlyQuery(pool, 'SELECT 1', [], 1.5), /timeout/)
})

test('destroys the client when ROLLBACK itself fails, and rethrows the query error', async () => {
  const { log, client, pool } = fakePool({ failOn: 'SELECT', failRollback: true })
  await assert.rejects(readOnlyQuery(pool, 'SELECT 1', []), /boom/)
  assert.equal(log.at(-1), 'ROLLBACK')
  assert.equal(client.releasedWith, true)
})

test('returns the client to the pool normally after a successful ROLLBACK', async () => {
  const { client, pool } = fakePool({ failOn: 'SELECT' })
  await assert.rejects(readOnlyQuery(pool, 'SELECT 1', []), /boom/)
  assert.equal(client.released, true)
  assert.equal(client.releasedWith, undefined)
})
