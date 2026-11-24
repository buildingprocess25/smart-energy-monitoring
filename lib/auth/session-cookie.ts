import { SESSION_COOKIE } from './access-rules.ts'

// sparta may have set sso_session host-only or on SSO_COOKIE_DOMAIN, so both are expired.
export function expiredSessionCookies(sharedDomain: string | undefined, secure: boolean): string[] {
  const base = `${SESSION_COOKIE}=; Path=/; Max-Age=0; HttpOnly; SameSite=Lax${secure ? '; Secure' : ''}`
  return sharedDomain ? [base, `${base}; Domain=${sharedDomain}`] : [base]
}

// Call this last: response.cookies.set() rebuilds Set-Cookie and drops appended headers.
export function clearSessionCookie(response: { headers: Headers }) {
  const cookies = expiredSessionCookies(
    process.env.SSO_COOKIE_DOMAIN?.trim() || undefined,
    process.env.NODE_ENV === 'production'
  )
  for (const cookie of cookies) response.headers.append('Set-Cookie', cookie)
}
