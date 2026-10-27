import { NextResponse, type NextRequest } from 'next/server'
import { PATHNAME_HEADER, SESSION_COOKIE } from '@/lib/auth/access-rules'

// Optimistic check only: real authorization runs on the server (lib/auth/access.ts).
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  const requestHeaders = new Headers(request.headers)
  requestHeaders.set(PATHNAME_HEADER, pathname)

  const isApi = pathname.startsWith('/api/')
  const isPublicPage = pathname === '/akses-ditolak'
  const spartaBase = process.env.NEXT_PUBLIC_SPARTA_AUDIT_URL

  if (!isApi && !isPublicPage && !request.cookies.has(SESSION_COOKIE) && spartaBase) {
    return NextResponse.redirect(new URL('/login', spartaBase))
  }

  return NextResponse.next({ request: { headers: requestHeaders } })
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api/assets|assets).*)'],
}
