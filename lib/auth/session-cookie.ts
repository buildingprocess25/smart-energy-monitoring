import type { NextResponse } from 'next/server'
import { SESSION_COOKIE } from '@/lib/auth/access-rules'

// Expires sso_session both as a host-only cookie and, in production, on the parent
// domain where sparta sets it (SSO_COOKIE_DOMAIN).
export function clearSessionCookie(response: NextResponse) {
  response.cookies.set(SESSION_COOKIE, '', { path: '/', maxAge: 0 })

  const sharedDomain = process.env.SSO_COOKIE_DOMAIN
  if (sharedDomain) {
    response.headers.append(
      'Set-Cookie',
      `${SESSION_COOKIE}=; Path=/; Domain=${sharedDomain}; Max-Age=0; HttpOnly; SameSite=Lax`
    )
  }
}
