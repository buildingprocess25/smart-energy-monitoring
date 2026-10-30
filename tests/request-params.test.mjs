import { test } from 'node:test'
import assert from 'node:assert/strict'
import { isIsoDate, parseDateParam, parseHistoryParams } from '../lib/request-params.ts'

const parse = (query) => parseHistoryParams(new URLSearchParams(query))

test('isIsoDate accepts real calendar dates only', () => {
  assert.equal(isIsoDate('2026-10-28'), true)
  assert.equal(isIsoDate('2024-02-29'), true)
  assert.equal(isIsoDate('2026-02-30'), false)
  assert.equal(isIsoDate('2026-1-5'), false)
  assert.equal(isIsoDate("2026-10-28' OR 1=1"), false)
})

test('parseDateParam treats a missing or empty date as no date', () => {
  assert.deepEqual(parseDateParam(null), { ok: true, value: undefined })
  assert.deepEqual(parseDateParam(''), { ok: true, value: undefined })
  assert.equal(parseDateParam('kemarin').ok, false)
})

test('parseHistoryParams keeps what the monitoring page sends', () => {
  assert.deepEqual(parse('rangeType=day&date=2026-10-28').value, {
    rangeType: 'day',
    date: '2026-10-28',
    sessionId: undefined,
    page: undefined,
    pageSize: undefined,
  })
  assert.equal(parse('rangeType=session&sessionId=sess_123&page=2').value.page, 2)
  assert.equal(parse('').value.rangeType, 'day')
})

test('parseHistoryParams rejects bad input', () => {
  assert.equal(parse('rangeType=hour').ok, false)
  assert.equal(parse('date=2026-13-01').ok, false)
  assert.equal(parse('page=0').ok, false)
  assert.equal(parse('page=abc').ok, false)
  assert.equal(parse('pageSize=501').ok, false)
  assert.equal(parse('pageSize=-5').ok, false)
  assert.equal(parse(`sessionId=${'x'.repeat(201)}`).ok, false)
})
