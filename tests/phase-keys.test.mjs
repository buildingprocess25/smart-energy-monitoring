import { test } from 'node:test'
import assert from 'node:assert/strict'
import { DEFAULT_PALETTE,
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
  assert.equal(sensorColor('R', '', 0), '#2e9b84')
  assert.equal(sensorColor('S', '', 0), '#3b82f6')
  assert.equal(sensorColor('T', '', 0), '#c27803')
  assert.equal(sensorColor('X1', 'Freezer Es Krim', 0), '#7477f3')
  assert.equal(sensorColor('X2', '', 1), '#3b82f6')
})

test('prototype keys are treated as ordinary sensor names', () => {
  assert.equal(defaultPhaseName('constructor'), 'constructor')
  assert.deepEqual(['toString', 'R', 'constructor'].sort(comparePhase), ['R', 'constructor', 'toString'])
})

test('sensor colours keep 3:1 against the light and dark card', () => {
  const luminance = (hex) => {
    const [r, g, b] = [1, 3, 5].map((i) => {
      const v = parseInt(hex.slice(i, i + 2), 16) / 255
      return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4
    })
    return 0.2126 * r + 0.7152 * g + 0.0722 * b
  }
  const ratio = (a, b) => {
    const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x)
    return (hi + 0.05) / (lo + 0.05)
  }
  const names = ['Fase R', 'Fase S', 'Fase T', 'AC', 'Chiller', 'Freezer', 'Lampu', 'Heater', 'Dummy']
  const colors = [...names.map((n) => sensorColor('X', n, 0)), ...DEFAULT_PALETTE]
  for (const color of colors) {
    for (const card of ['#ffffff', '#1e2a1f']) {
      assert.ok(ratio(color, card) >= 3, `${color} on ${card}: ${ratio(color, card).toFixed(2)}`)
    }
  }
})

test('1F is a main panel phase after R, S and T', () => {
  assert.equal(defaultPhaseName('1F'), '1 Fasa')
  assert.deepEqual(['OVEN', '1F', 'T', 'R'].sort(comparePhase), ['R', 'T', '1F', 'OVEN'])
})
