import { test } from 'node:test'
import assert from 'node:assert/strict'
import {
  resolveRole,
  portalDecision,
  scopeFor,
  parseDeviceIds,
  isDeviceAllowed,
  isValidInternalToken,
} from '../lib/auth/access-rules.ts'

test('resolveRole uses dev_role only in development and only for known roles', () => {
  assert.equal(resolveRole('ADMIN', 'GS', true), 'GS')
  assert.equal(resolveRole('ADMIN', 'GS', false), 'ADMIN')
  assert.equal(resolveRole('ADMIN', 'SUPERUSER', true), 'ADMIN')
  assert.equal(resolveRole('USER', undefined, true), 'USER')
  assert.equal(resolveRole('SOMETHING', undefined, false), null)
  assert.equal(resolveRole(null, null, true), null)
})

test('portalDecision allows ADMIN, AUDITOR, GS and redirects the rest', () => {
  assert.deepEqual(portalDecision('ADMIN'), { allow: true })
  assert.deepEqual(portalDecision('AUDITOR'), { allow: true })
  assert.deepEqual(portalDecision('GS'), { allow: true })
  assert.deepEqual(portalDecision('USER'), { allow: false, redirect: 'calculator' })
  assert.deepEqual(portalDecision('AREA'), { allow: false, redirect: 'admin-dashboard' })
  assert.deepEqual(portalDecision(null), { allow: false, redirect: 'forbidden' })
})

test('scopeFor gives full access to ADMIN and AUDITOR, assigned devices to GS', () => {
  assert.deepEqual(scopeFor('ADMIN', ['EM-1']), { kind: 'all' })
  assert.deepEqual(scopeFor('AUDITOR', []), { kind: 'all' })
  assert.deepEqual(scopeFor('GS', ['EM-2', 'EM-1', 'EM-2']), {
    kind: 'devices',
    deviceIds: ['EM-2', 'EM-1'],
  })
  assert.deepEqual(scopeFor('GS', []), { kind: 'devices', deviceIds: [] })
  assert.deepEqual(scopeFor('USER', ['EM-1']), { kind: 'none' })
  assert.deepEqual(scopeFor('AREA', ['EM-1']), { kind: 'none' })
  assert.deepEqual(scopeFor(null, []), { kind: 'none' })
})

test('parseDeviceIds trims entries and drops empty ones', () => {
  assert.deepEqual(parseDeviceIds(' EM-0010, ,EM-0002,, '), ['EM-0010', 'EM-0002'])
  assert.deepEqual(parseDeviceIds(''), [])
  assert.deepEqual(parseDeviceIds(undefined), [])
})

test('isDeviceAllowed follows the scope', () => {
  assert.equal(isDeviceAllowed({ kind: 'all' }, 'EM-9'), true)
  assert.equal(isDeviceAllowed({ kind: 'devices', deviceIds: ['EM-1'] }, 'EM-1'), true)
  assert.equal(isDeviceAllowed({ kind: 'devices', deviceIds: ['EM-1'] }, 'EM-2'), false)
  assert.equal(isDeviceAllowed({ kind: 'none' }, 'EM-1'), false)
})

test('isValidInternalToken rejects missing configuration and mismatches', () => {
  assert.equal(isValidInternalToken('abc', 'abc'), true)
  assert.equal(isValidInternalToken('abd', 'abc'), false)
  assert.equal(isValidInternalToken('abc', 'abcd'), false)
  assert.equal(isValidInternalToken('', ''), false)
  assert.equal(isValidInternalToken('abc', undefined), false)
  assert.equal(isValidInternalToken(null, 'abc'), false)
})
