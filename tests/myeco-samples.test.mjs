import { test } from 'node:test'
import assert from 'node:assert/strict'
import { appendFile, mkdtemp, readdir, rm, writeFile } from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import { MYECO_STORES } from '../lib/myeco.ts'
import { createMyEcoArchive } from '../lib/myeco-archive.ts'
import {
  averageSamples,
  datesBetween,
  decodeSamples,
  encodeSamples,
  expiredFiles,
  isPowerRange,
  mergeSamples,
  meterKey,
  nextDelay,
} from '../lib/myeco-samples.ts'
import { analyticsStore } from '../lib/store-choice.ts'

const ids = MYECO_STORES.flatMap((s) => s.meters.map((m) => m.id))
const [A, B] = ids
const at = (time) => Date.parse(`2026-11-24T${time}+07:00`)

async function withArchive(run) {
  const dir = await mkdtemp(path.join(os.tmpdir(), 'myeco-'))
  try {
    await run(createMyEcoArchive(dir), path.join(dir, 'myeco'))
  } finally {
    await rm(dir, { recursive: true, force: true })
  }
}

test('short meter keys stay unique', () => {
  assert.equal(new Set(ids.map(meterKey)).size, ids.length)
})

test('samples survive a round trip, and a missing reading stays missing', () => {
  const [row] = decodeSamples(encodeSamples([{ at: 1000, power: { [A]: 1346.6, [B]: null, lain: 5 } }]))
  assert.deepEqual(row, { at: 1000, power: { [A]: 1347 } })
  assert.equal(encodeSamples([]), '')
})

test('broken lines are skipped, also when a crash cut the last one', () => {
  const text = encodeSamples([{ at: 1, power: { [A]: 5 } }]) + '{"t":2,"p":{"x' + encodeSamples([{ at: 3, power: {} }])
  assert.deepEqual(decodeSamples(text + 'null\n[]\n{"t":"x","p":{}}\n').map((s) => s.at), [1, 3])
})

test('averages skip missing readings and leave empty buckets out', () => {
  const rows = averageSamples(
    [
      { at: 0, power: { [A]: 1 } },
      { at: 100, power: { [A]: 100 } },
      { at: 150, power: { [A]: 200, [B]: null } },
      { at: 450, power: {} },
    ],
    [A, B],
    100,
    100
  )
  assert.deepEqual(rows, [
    { at: 100, power: { [A]: 150, [B]: null } },
    { at: 400, power: { [A]: null, [B]: null } },
  ])
})

test('the same moment from two containers counts once', () => {
  assert.deepEqual(mergeSamples([{ at: 2, power: {} }], [{ at: 1, power: {} }, { at: 2, power: {} }]).map((s) => s.at), [1, 2])
})

test('dates follow Jakarta, and only own old files expire', () => {
  assert.deepEqual(datesBetween(at('23:59:00'), at('23:59:00') + 120_000), ['2026-11-24', '2026-11-25'])
  assert.deepEqual(datesBetween(at('12:00:00'), at('12:00:00')), ['2026-11-24'])
  assert.equal(datesBetween(at('12:00:00') - 7 * 86_400_000, at('12:00:00')).length, 8)
  assert.deepEqual(
    expiredFiles(['2026-10-25.jsonl', '2026-10-26.jsonl', '2026-11-24.jsonl', 'mail-settings.json', '2020-01-01.txt'], at('12:00:00')),
    ['2026-10-25.jsonl']
  )
})

test('ranges are a closed list, and waiting grows up to five minutes', () => {
  assert.ok(isPowerRange('24h'))
  assert.ok(!isPowerRange('constructor'))
  assert.deepEqual([0, 1, 2, 10].map(nextDelay), [15_000, 30_000, 60_000, 300_000])
})

test('the archive keeps its data over a restart and splits days', () =>
  withArchive(async (archive, dir) => {
    const list = [
      { at: at('23:59:50'), power: { [A]: 10 } },
      { at: at('23:59:50') + 15_000, power: { [A]: 20 } },
    ]
    await archive.append(list)
    assert.deepEqual((await readdir(dir)).sort(), ['2026-11-24.jsonl', '2026-11-25.jsonl'])
    const again = createMyEcoArchive(path.dirname(dir))
    assert.deepEqual(await again.read(list[0].at, list[1].at), list)
    assert.deepEqual(await again.read(list[1].at, list[1].at), [list[1]])
  }))

test('a damaged file, a missing folder and other files do no harm', () =>
  withArchive(async (archive, dir) => {
    assert.deepEqual(await archive.read(at('10:00:00'), at('11:00:00')), [])
    await archive.removeExpired(at('10:00:00'))
    await archive.append([{ at: at('10:00:00'), power: { [A]: 1 } }])
    await appendFile(path.join(dir, '2026-11-24.jsonl'), '{"t":17')
    await archive.append([{ at: at('10:01:00'), power: { [A]: 2 } }])
    assert.equal((await archive.read(at('10:00:00'), at('11:00:00'))).length, 2)
    await writeFile(path.join(dir, '2020-01-01.jsonl'), '')
    await writeFile(path.join(dir, 'catatan.txt'), '')
    await archive.removeExpired(at('10:00:00'))
    assert.deepEqual((await readdir(dir)).sort(), ['2026-11-24.jsonl', 'catatan.txt'])
  }))

test('a requested store is never replaced by another store', () => {
  const live = { status: 'live', deviceId: 'EM-1' }
  const bare = { status: 'unassigned', deviceId: undefined }
  assert.equal(analyticsStore(true, null, [live]), null)
  assert.equal(analyticsStore(true, bare, [live]), null)
  assert.equal(analyticsStore(true, live, []), live)
})

test('a page that asks for no store gets one that has a device', () => {
  const old = { status: 'historical', deviceId: 'EM-2' }
  const live = { status: 'live', deviceId: 'EM-1' }
  const bare = { status: 'unassigned', deviceId: undefined }
  assert.equal(analyticsStore(false, null, [bare, old, live]), live)
  assert.equal(analyticsStore(false, null, [bare, old]), old)
  assert.equal(analyticsStore(false, null, [bare]), null)
})
