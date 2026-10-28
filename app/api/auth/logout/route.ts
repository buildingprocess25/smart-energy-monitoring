import { NextResponse } from 'next/server'
import { DEV_ROLE_COOKIE } from '@/lib/auth/access-rules'
import { spartaUrl } from '@/lib/auth/access'
import { clearSessionCookie } from '@/lib/auth/session-cookie'

export const dynamic = 'force-dynamic'

// Second step of sign-out. The sidebar first calls sparta's POST /api/auth/sign-out,
// which deletes the session row; this route clears the cookies the portal can see
// and sends the browser to the sparta login page.
export async function GET() {
  const response = NextResponse.redirect(spartaUrl('/login'))
  clearSessionCookie(response)
  response.cookies.set(DEV_ROLE_COOKIE, '', { path: '/', maxAge: 0 })
  return response
}
