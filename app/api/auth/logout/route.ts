import { NextResponse } from 'next/server'
import { DEV_ROLE_COOKIE, SESSION_COOKIE } from '@/lib/auth/access-rules'
import { spartaUrl } from '@/lib/auth/access'

export const dynamic = 'force-dynamic'

// Second step of sign-out. The sidebar first calls sparta's POST /api/auth/sign-out,
// which deletes the session row; this route clears the cookies the portal can see
// and sends the browser to the sparta login page.
export async function GET() {
  const response = NextResponse.redirect(spartaUrl('/login'))
  const expired = { path: '/', maxAge: 0 }

  response.cookies.set(SESSION_COOKIE, '', expired)
  response.cookies.set(DEV_ROLE_COOKIE, '', expired)

  // In production sparta sets sso_session on the parent domain (SSO_COOKIE_DOMAIN).
  const sharedDomain = process.env.SSO_COOKIE_DOMAIN
  if (sharedDomain) {
    response.headers.append(
      'Set-Cookie',
      `${SESSION_COOKIE}=; Path=/; Domain=${sharedDomain}; Max-Age=0; HttpOnly; SameSite=Lax`
    )
  }

  return response
}
