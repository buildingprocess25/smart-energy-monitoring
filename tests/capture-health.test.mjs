import { test } from 'node:test'
import assert from 'node:assert/strict'
import { isCaptureStalled, parseWibTimestamp } from '../lib/capture-health.ts'

const now = Date.parse('2026-11-24T10:26:00+07:00')
const base = { active: true, interval: 15, startedAt: '10:44:57 23/11/2026', lastRecordAt: null }

test('WIB timestamps from Flask', () => {
  assert.equal(parseWibTimestamp('10:44:57 23/11/2026'), Date.parse('2026-11-23T10:44:57+07:00'))
  for (const bad of [null, '', '---', '23/11/2026', 'x']) assert.equal(parseWibTimestamp(bad), null)
})

test('a recording without new rows is stalled', () => {
  assert.equal(isCaptureStalled({ ...base, lastRecordAt: Date.parse('2026-11-23T12:18:15+07:00') }, now), true)
  assert.equal(isCaptureStalled({ ...base, lastRecordAt: now - 30_000 }, now), false)
})

test('the limit is three intervals and at least two minutes', () => {
  assert.equal(isCaptureStalled({ ...base, lastRecordAt: now - 119_000 }, now), false)
  assert.equal(isCaptureStalled({ ...base, lastRecordAt: now - 121_000 }, now), true)
  assert.equal(isCaptureStalled({ ...base, interval: 3600, lastRecordAt: now - 3 * 3600_000 + 1000 }, now), false)
  assert.equal(isCaptureStalled({ ...base, interval: 3600, lastRecordAt: now - 3 * 3600_000 - 1000 }, now), true)
})

test('a recording that just started has time for its first row', () => {
  assert.equal(isCaptureStalled({ ...base, startedAt: '10:25:30 24/11/2026' }, now), false)
  assert.equal(isCaptureStalled(base, now), true)
})

test('nothing is claimed without evidence', () => {
  assert.equal(isCaptureStalled({ ...base, active: false }, now), false)
  assert.equal(isCaptureStalled({ ...base, startedAt: null }, now), false)
  assert.equal(isCaptureStalled({ ...base, lastRecordAt: undefined }, now), false)
})
