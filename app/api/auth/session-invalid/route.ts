import { NextResponse, type NextRequest } from 'next/server'
import { SESSION_DENIED_PATH } from '@/lib/auth/access-rules'
import { clearSessionCookie } from '@/lib/auth/session-cookie'

export const dynamic = 'force-dynamic'

// The dashboard layout sends a stale or unknown sso_session here instead of back to
// sparta, which would redirect a GS straight back and loop. Server components cannot
// clear cookies, so this route does it.
export async function GET(request: NextRequest) {
  const response = NextResponse.redirect(new URL(SESSION_DENIED_PATH, request.url))
  clearSessionCookie(response)
  return response
}
