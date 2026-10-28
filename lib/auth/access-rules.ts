// Role rules shared with sparta-energy (lib/role-access.ts there).
// No imports, so `node --test` can load this file directly.

export const ROLES = ['ADMIN', 'AUDITOR', 'GS', 'AREA', 'USER'] as const
export type Role = (typeof ROLES)[number]

export const SESSION_COOKIE = 'sso_session'
export const DEV_ROLE_COOKIE = 'dev_role'
// Loop breaker: set by proxy.ts when it sends a page request to the sparta login.
export const BOUNCE_COOKIE = 'sso_bounce'
export const BOUNCE_MAX_AGE_SECONDS = 60
export const SESSION_DENIED_PATH = '/akses-ditolak?alasan=sesi'
export const INTERNAL_TOKEN_HEADER = 'x-internal-token'
// Set by proxy.ts on every request; any value sent by the client is overwritten.
export const PATHNAME_HEADER = 'x-sem-pathname'

export type AccessScope =
  | { kind: 'all' }
  | { kind: 'devices'; deviceIds: string[] }
  | { kind: 'none' }

export type PortalDecision =
  | { allow: true }
  | { allow: false; redirect: 'calculator' | 'admin-dashboard' | 'forbidden' }

export function isRole(value: unknown): value is Role {
  return typeof value === 'string' && (ROLES as readonly string[]).includes(value)
}

// dev_role only counts in local development, matching sparta's resolveRole.
export function resolveRole(
  dbRole: string | null | undefined,
  devRole: string | null | undefined,
  isDev: boolean
): Role | null {
  if (isDev && isRole(devRole)) return devRole
  return isRole(dbRole) ? dbRole : null
}

export function portalDecision(role: Role | null): PortalDecision {
  if (role === 'ADMIN' || role === 'AUDITOR' || role === 'GS') return { allow: true }
  if (role === 'USER') return { allow: false, redirect: 'calculator' }
  if (role === 'AREA') return { allow: false, redirect: 'admin-dashboard' }
  return { allow: false, redirect: 'forbidden' }
}

// A page request without sso_session goes to the sparta login once. Coming back still
// without it while the bounce cookie lives means sparta set no session cookie: stop there.
export function anonymousPageTarget(bounced: boolean): 'sparta-login' | 'session-denied' {
  return bounced ? 'session-denied' : 'sparta-login'
}

export function scopeFor(role: Role | null, deviceIds: string[]): AccessScope {
  if (role === 'ADMIN' || role === 'AUDITOR') return { kind: 'all' }
  if (role === 'GS') return { kind: 'devices', deviceIds: Array.from(new Set(deviceIds)) }
  return { kind: 'none' }
}

export function parseDeviceIds(raw: string | null | undefined): string[] {
  if (!raw) return []
  return raw
    .split(',')
    .map((id) => id.trim())
    .filter(Boolean)
}

export function isDeviceAllowed(scope: AccessScope, deviceId: string): boolean {
  if (scope.kind === 'all') return true
  if (scope.kind === 'devices') return scope.deviceIds.includes(deviceId)
  return false
}

// Constant-time comparison; an unset token never matches.
export function isValidInternalToken(
  received: string | null | undefined,
  expected: string | null | undefined
): boolean {
  if (!received || !expected || received.length !== expected.length) return false
  let diff = 0
  for (let i = 0; i < expected.length; i++) {
    diff |= received.charCodeAt(i) ^ expected.charCodeAt(i)
  }
  return diff === 0
}
