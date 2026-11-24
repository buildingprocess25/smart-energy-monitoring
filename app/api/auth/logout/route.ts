import { NextResponse, type NextRequest } from 'next/server'
import { DEV_ROLE_COOKIE, SESSION_COOKIE } from '@/lib/auth/access-rules'
import { spartaUrl } from '@/lib/auth/access'
import { clearSessionCookie } from '@/lib/auth/session-cookie'
import { revokeSpartaSession } from '@/lib/auth/sparta-sign-out'

export const dynamic = 'force-dynamic'

// Second step of sign-out, after the browser's own POST to sparta. When that POST worked the
// cookie is already gone; otherwise this ends the session row from the server.
export async function POST(request: NextRequest) {
  const token = request.cookies.get(SESSION_COOKIE)?.value
  if (token && !(await revokeSpartaSession(process.env.NEXT_PUBLIC_SPARTA_AUDIT_URL, token))) {
    console.error('Sign-out: sparta did not confirm that the session ended')
  }

  const response = NextResponse.json({ redirectTo: spartaUrl('/login') })
  response.cookies.set(DEV_ROLE_COOKIE, '', { path: '/', maxAge: 0 })
  clearSessionCookie(response)
  return response
}
