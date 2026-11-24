import { test } from 'node:test'
import assert from 'node:assert/strict'
import { roleSwitchUrl } from '../lib/sparta-url.ts'
import { contentSecurityPolicy } from '../lib/security-headers.ts'
import { expiredSessionCookies } from '../lib/auth/session-cookie.ts'
import { revokeSpartaSession } from '../lib/auth/sparta-sign-out.ts'
import { relativeRedirect } from '../lib/relative-redirect.ts'

test('roleSwitchUrl points ADMIN and AUDITOR at the SPARTA chooser', () => {
  assert.equal(roleSwitchUrl('https://energy.test/', 'ADMIN'), 'https://energy.test/admin-entry')
  assert.equal(roleSwitchUrl('https://energy.test', 'AUDITOR'), 'https://energy.test/admin-entry')
})

test('roleSwitchUrl is null for GS and other roles, and without a sparta URL', () => {
  for (const role of ['GS', 'USER', 'AREA', '']) {
    assert.equal(roleSwitchUrl('https://energy.test', role), null)
  }
  assert.equal(roleSwitchUrl(undefined, 'ADMIN'), null)
  assert.equal(roleSwitchUrl('', 'ADMIN'), null)
})

test('CSP lets the page reach the sparta origin only, without its path', () => {
  const csp = contentSecurityPolicy('https://energy.test/base/', false)
  assert.match(csp, /connect-src 'self' https:\/\/energy\.test(;|$)/)
  assert.doesNotMatch(csp, /unsafe-eval| ws:/)
})

test('CSP without a valid sparta URL keeps connect-src at self', () => {
  for (const url of [undefined, '', 'not a url', "javascript:alert(1)"]) {
    assert.match(contentSecurityPolicy(url, false), /connect-src 'self'(;|$)/)
  }
})

test('expired session cookies cover the host and the shared domain', () => {
  assert.deepEqual(expiredSessionCookies(undefined, true), [
    'sso_session=; Path=/; Max-Age=0; HttpOnly; SameSite=Lax; Secure',
  ])
  assert.deepEqual(expiredSessionCookies('.energy.test', false), [
    'sso_session=; Path=/; Max-Age=0; HttpOnly; SameSite=Lax',
    'sso_session=; Path=/; Max-Age=0; HttpOnly; SameSite=Lax; Domain=.energy.test',
  ])
})

test('revokeSpartaSession posts the session token to the sparta sign-out', async () => {
  const calls = []
  const ok = await revokeSpartaSession('https://energy.test/', 'abc; x=1', async (url, init) => {
    calls.push([url, init])
    return { ok: true }
  })
  assert.equal(ok, true)
  assert.equal(calls[0][0], 'https://energy.test/api/auth/sign-out')
  assert.equal(calls[0][1].method, 'POST')
  assert.equal(calls[0][1].redirect, 'manual')
  assert.equal(calls[0][1].headers.cookie, 'sso_session=abc%3B%20x%3D1')
})

test('revokeSpartaSession reports failure instead of throwing', async () => {
  assert.equal(await revokeSpartaSession('https://e.test', 't', async () => ({ ok: false })), false)
  assert.equal(
    await revokeSpartaSession('https://e.test', 't', async () => {
      throw new Error('down')
    }),
    false
  )
  let called = false
  assert.equal(
    await revokeSpartaSession(undefined, 't', async () => {
      called = true
      return { ok: true }
    }),
    false
  )
  assert.equal(called, false)
})

test('the session-denied redirect is relative, so the container address never reaches the browser', () => {
  const response = relativeRedirect('/akses-ditolak?alasan=sesi')
  assert.equal(response.status, 307)
  assert.equal(response.headers.get('location'), '/akses-ditolak?alasan=sesi')
  assert.throws(() => relativeRedirect('//evil.test'))
  assert.throws(() => relativeRedirect('https://evil.test'))
})
