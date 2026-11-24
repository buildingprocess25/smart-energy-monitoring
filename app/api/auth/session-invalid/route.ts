import { SESSION_DENIED_PATH } from '@/lib/auth/access-rules'
import { clearSessionCookie } from '@/lib/auth/session-cookie'
import { relativeRedirect } from '@/lib/relative-redirect'

export const dynamic = 'force-dynamic'

// The dashboard layout sends a stale or unknown sso_session here instead of back to
// sparta, which would redirect a GS straight back and loop. Server components cannot
// clear cookies, so this route does it.
export async function GET() {
  const response = relativeRedirect(SESSION_DENIED_PATH)
  clearSessionCookie(response)
  return response
}
