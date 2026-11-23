import { test } from 'node:test'
import assert from 'node:assert/strict'
import {
  normalizePhaseKey,
  isExcludedPhase,
  isPhaseKey,
  comparePhase,
  defaultPhaseName,
  sensorColor,
} from '../lib/phase-keys.ts'

test('normalizePhaseKey maps old and new topics to R/S/T', () => {
  assert.equal(normalizePhaseKey('L12'), 'R')
  assert.equal(normalizePhaseKey('l1'), 'R')
  assert.equal(normalizePhaseKey('r'), 'R')
  assert.equal(normalizePhaseKey('L13'), 'S')
  assert.equal(normalizePhaseKey('L2'), 'S')
  assert.equal(normalizePhaseKey('L14'), 'T')
  assert.equal(normalizePhaseKey('L3'), 'T')
  assert.equal(normalizePhaseKey(' CT '), 'CT')
  assert.equal(normalizePhaseKey('AC_1'), 'AC_1')
})

test('isExcludedPhase drops L6 and dummy sensors', () => {
  assert.equal(isExcludedPhase('L6'), true)
  assert.equal(isExcludedPhase('l6'), true)
  assert.equal(isExcludedPhase('Dummy_1'), true)
  assert.equal(isExcludedPhase('sensor-dummy'), true)
  assert.equal(isExcludedPhase('R'), false)
})

test('isPhaseKey rejects Flask metadata keys', () => {
  for (const k of ['Timestamp', 'timestamp', 'meta', 'offline', 'status', 'cmd', 'realtime', 'RealTime']) {
    assert.equal(isPhaseKey(k), false, k)
  }
  assert.equal(isPhaseKey('L12'), true)
  assert.equal(isPhaseKey('AC_1'), true)
  assert.equal(isPhaseKey('a/b'), false)
  assert.equal(isPhaseKey(''), false)
})

test('comparePhase puts R, S, T first then sorts by name', () => {
  assert.deepEqual(['CT', 'T', 'AC_1', 'R', 'S'].sort(comparePhase), ['R', 'S', 'T', 'AC_1', 'CT'])
})

test('defaultPhaseName labels main phases', () => {
  assert.equal(defaultPhaseName('R'), 'Fase R')
  assert.equal(defaultPhaseName('CT'), 'CT')
})

test('sensorColor keeps the existing R/S/T colors', () => {
  assert.equal(sensorColor('R', '', 0), '#10b981')
  assert.equal(sensorColor('S', '', 0), '#3b82f6')
  assert.equal(sensorColor('T', '', 0), '#f59e0b')
  assert.equal(sensorColor('X1', 'Freezer Es Krim', 0), '#6366f1')
  assert.equal(sensorColor('X2', '', 1), '#3b82f6')
})

test('prototype keys are treated as ordinary sensor names', () => {
  assert.equal(defaultPhaseName('constructor'), 'constructor')
  assert.deepEqual(['toString', 'R', 'constructor'].sort(comparePhase), ['R', 'constructor', 'toString'])
})
