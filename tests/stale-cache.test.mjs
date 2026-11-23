import { test } from 'node:test'
import assert from 'node:assert/strict'
import { createStaleCache } from '../lib/stale-cache.ts'

function clock(start = 0) {
  let t = start
  return { now: () => t, advance: (ms) => { t += ms } }
}

function deferred() {
  let resolve, reject
  const promise = new Promise((res, rej) => { resolve = res; reject = rej })
  return { promise, resolve, reject }
}

test('a fresh entry is served without loading again', async () => {
  const c = clock()
  let calls = 0
  const get = createStaleCache({ ttlMs: 1000, now: c.now })
  const load = async () => ++calls
  assert.equal(await get('all', load), 1)
  c.advance(999)
  assert.equal(await get('all', load), 1)
  assert.equal(calls, 1)
})

test('a stale entry is served at once while one refresh runs behind it', async () => {
  const c = clock()
  const get = createStaleCache({ ttlMs: 1000, now: c.now })
  await get('all', async () => 'old')
  c.advance(1000)

  const slow = deferred()
  let refreshes = 0
  const load = () => { refreshes++; return slow.promise }
  assert.equal(await get('all', load), 'old')
  assert.equal(await get('all', load), 'old')
  assert.equal(refreshes, 1)

  slow.resolve('new')
  await slow.promise
  await Promise.resolve()
  assert.equal(await get('all', load), 'new')
  assert.equal(refreshes, 1)
})

test('a failed refresh keeps the old value and reports the error', async () => {
  const c = clock()
  const errors = []
  const get = createStaleCache({ ttlMs: 1000, now: c.now, onError: (e) => errors.push(e.message) })
  await get('all', async () => 'old')
  c.advance(1000)

  assert.equal(await get('all', async () => { throw new Error('db down') }), 'old')
  await new Promise((r) => setImmediate(r))
  assert.deepEqual(errors, ['db down'])
  assert.equal(await get('all', async () => 'new'), 'old')
  await new Promise((r) => setImmediate(r))
  assert.equal(await get('all', async () => 'unused'), 'new')
})

test('concurrent cold callers share one load', async () => {
  const get = createStaleCache({ ttlMs: 1000 })
  const slow = deferred()
  let calls = 0
  const load = () => { calls++; return slow.promise }
  const a = get('all', load)
  const b = get('all', load)
  slow.resolve('v')
  assert.deepEqual(await Promise.all([a, b]), ['v', 'v'])
  assert.equal(calls, 1)
})

test('a cold failure is rethrown and the next call loads again', async () => {
  const get = createStaleCache({ ttlMs: 1000 })
  await assert.rejects(get('all', async () => { throw new Error('boom') }), /boom/)
  assert.equal(await get('all', async () => 'ok'), 'ok')
})

test('keys are cached separately and the oldest key is dropped past maxKeys', async () => {
  let calls = 0
  const get = createStaleCache({ ttlMs: 1000, maxKeys: 2 })
  const load = async () => ++calls
  await get('a', load)
  await get('b', load)
  await get('c', load)
  assert.equal(calls, 3)
  assert.equal(await get('b', load), 2)
  assert.equal(await get('a', load), 4)
})
