import { test } from 'node:test'
import assert from 'node:assert/strict'
import { isIsoDate, parseDateParam, parseHistoryParams, parseSinceParam, parseSessionId } from '../lib/request-params.ts'

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

test('parseSinceParam accepts a missing value or a positive epoch in ms', () => {
  assert.deepEqual(parseSinceParam(null), { ok: true, value: null })
  assert.deepEqual(parseSinceParam(''), { ok: true, value: null })
  assert.deepEqual(parseSinceParam('1762657200000'), { ok: true, value: 1762657200000 })
  assert.equal(parseSinceParam('-1').ok, false)
  assert.equal(parseSinceParam('12abc').ok, false)
  assert.equal(parseSinceParam('1e20').ok, false)
})

test('parseSessionId accepts ids the history table can hold', () => {
  assert.deepEqual(parseSessionId('sess_1762657200'), { ok: true, value: 'sess_1762657200' })
  assert.equal(parseSessionId('').ok, false)
  assert.equal(parseSessionId('a'.repeat(51)).ok, false)
  assert.equal(parseSessionId("x' OR 1=1").ok, false)
})
