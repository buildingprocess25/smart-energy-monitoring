import { test } from 'node:test'
import assert from 'node:assert/strict'
import { createSharedFetch, BackoffError } from '../lib/shared-fetch.ts'

function clock(start = 0) {
  let t = start
  return { now: () => t, advance: (ms) => { t += ms } }
}

test('serves one load per key within the TTL', async () => {
  const c = clock()
  let calls = 0
  const get = createSharedFetch(async (k) => { calls++; return `${k}:${calls}` }, { ttlMs: 3000, failureBackoffMs: 15000, now: c.now })
  assert.equal(await get('EM-1'), 'EM-1:1')
  c.advance(2999)
  assert.equal(await get('EM-1'), 'EM-1:1')
  assert.equal(calls, 1)
  c.advance(1)
  assert.equal(await get('EM-1'), 'EM-1:2')
  assert.equal(calls, 2)
})

test('keys are cached separately', async () => {
  let calls = 0
  const get = createSharedFetch(async (k) => { calls++; return k }, { ttlMs: 3000, failureBackoffMs: 0 })
  await get('A')
  await get('B')
  assert.equal(calls, 2)
})

test('concurrent callers share one in-flight load', async () => {
  let calls = 0
  let release
  const gate = new Promise((r) => { release = r })
  const get = createSharedFetch(async () => { calls++; await gate; return 'ok' }, { ttlMs: 3000, failureBackoffMs: 0 })
  const all = Promise.all([get('A'), get('A'), get('A'), get('A'), get('A')])
  release()
  assert.deepEqual(await all, ['ok', 'ok', 'ok', 'ok', 'ok'])
  assert.equal(calls, 1)
})

test('after a failure the key is not loaded again during the backoff', async () => {
  const c = clock()
  let calls = 0
  const get = createSharedFetch(async () => { calls++; throw new Error('down') }, { ttlMs: 3000, failureBackoffMs: 15000, now: c.now })
  await assert.rejects(get('A'), /down/)
  c.advance(14999)
  await assert.rejects(get('A'), BackoffError)
  assert.equal(calls, 1)
  c.advance(1)
  await assert.rejects(get('A'), /down/)
  assert.equal(calls, 2)
})

test('a failure keeps no stale success and the next success is cached again', async () => {
  const c = clock()
  let fail = false
  let calls = 0
  const get = createSharedFetch(async () => { calls++; if (fail) throw new Error('x'); return calls }, { ttlMs: 1000, failureBackoffMs: 0, now: c.now })
  assert.equal(await get('A'), 1)
  c.advance(1000)
  fail = true
  await assert.rejects(get('A'))
  fail = false
  assert.equal(await get('A'), 3)
  assert.equal(await get('A'), 3)
})

test('the cache never holds more than maxKeys entries', async () => {
  let calls = 0
  const get = createSharedFetch(async (k) => { calls++; return k }, { ttlMs: 60000, failureBackoffMs: 0, maxKeys: 2 })
  await get('A')
  await get('B')
  await get('C')
  await get('A')
  assert.equal(calls, 4)
})
