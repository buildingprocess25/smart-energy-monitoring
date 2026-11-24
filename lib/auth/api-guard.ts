import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { getRequestAccess, type Viewer } from '@/lib/auth/access'
import { canControlDevices } from '@/lib/auth/access-rules'
import { isSameOrigin } from '@/lib/control-commands'

// Returns an error response when the request may not use the API, otherwise null.
// Store-level checks happen in the services, which only see devices in the caller's scope.
export async function requireApiAccess(): Promise<NextResponse | null> {
  const access = await getRequestAccess()
  if (access.status === 'anonymous' || access.status === 'invalid') {
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

// For routes that change data through Flask: a signed-in ADMIN, from a page of this portal.
export async function requireControlAccess(): Promise<{ denied: NextResponse } | { viewer: Viewer }> {
  const denied = await requireApiAccess()
  if (denied) return { denied }

  const access = await getRequestAccess()
  if (access.status !== 'ok' || !access.viewer || !canControlDevices(access.viewer.role)) {
    return { denied: NextResponse.json({ error: 'Hanya Admin yang boleh mengubah perangkat.' }, { status: 403 }) }
  }
  const headerStore = await headers()
  if (!isSameOrigin(headerStore.get('origin'), headerStore.get('host'))) {
    return { denied: NextResponse.json({ error: 'Permintaan harus dari halaman portal.' }, { status: 403 }) }
  }
  return { viewer: access.viewer }
}
