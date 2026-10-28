import { NextResponse, type NextRequest } from 'next/server'
import {
  anonymousPageTarget,
  BOUNCE_COOKIE,
  BOUNCE_MAX_AGE_SECONDS,
  PATHNAME_HEADER,
  SESSION_COOKIE,
  SESSION_DENIED_PATH,
} from '@/lib/auth/access-rules'

// Optimistic check only: real authorization runs on the server (lib/auth/access.ts).
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  const requestHeaders = new Headers(request.headers)
  requestHeaders.set(PATHNAME_HEADER, pathname)

  const isApi = pathname.startsWith('/api/')
  const isPublicPage = pathname === '/akses-ditolak'
  const spartaBase = process.env.NEXT_PUBLIC_SPARTA_AUDIT_URL
  const hasSession = request.cookies.has(SESSION_COOKIE)
  const bounced = request.cookies.has(BOUNCE_COOKIE)

  if (!isApi && !isPublicPage && !hasSession && spartaBase) {
    if (anonymousPageTarget(bounced) === 'session-denied') {
      const response = NextResponse.redirect(new URL(SESSION_DENIED_PATH, request.url))
      response.cookies.delete(BOUNCE_COOKIE)
      return response
    }

    const response = NextResponse.redirect(new URL('/login', spartaBase))
    response.cookies.set(BOUNCE_COOKIE, '1', {
      path: '/',
      maxAge: BOUNCE_MAX_AGE_SECONDS,
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
    })
    return response
  }

  const response = NextResponse.next({ request: { headers: requestHeaders } })
  if (hasSession && bounced) response.cookies.delete(BOUNCE_COOKIE)
  return response
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api/assets|assets).*)'],
}
