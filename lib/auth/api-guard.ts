import { NextResponse } from 'next/server'
import { getRequestAccess } from '@/lib/auth/access'

// Returns an error response when the request may not use the API, otherwise null.
// Store-level checks happen in the services, which only see devices in the caller's scope.
export async function requireApiAccess(): Promise<NextResponse | null> {
  const access = await getRequestAccess()
  if (access.status === 'anonymous') {
    return NextResponse.json({ error: 'Sesi login tidak ditemukan.' }, { status: 401 })
  }
  if (access.status === 'error') {
    return NextResponse.json({ error: 'Akses tidak bisa diperiksa.' }, { status: 503 })
  }
  if (!access.internal && access.scope.kind === 'none') {
    return NextResponse.json({ error: 'Akun ini tidak punya akses ke portal monitoring.' }, { status: 403 })
  }
  return null
}

// For endpoints that only sparta-energy may call, with the shared internal token.
export async function requireInternalAccess(): Promise<NextResponse | null> {
  const access = await getRequestAccess()
  if (access.status === 'ok' && access.internal && process.env.MONITORING_INTERNAL_TOKEN) {
    return null
  }
  return NextResponse.json({ error: 'Token internal tidak valid.' }, { status: 401 })
}
