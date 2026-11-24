import { NextRequest, NextResponse } from 'next/server'
import { requireApiAccess } from '@/lib/auth/api-guard'
import { getRequestAccess } from '@/lib/auth/access'
import { canControlDevices } from '@/lib/auth/access-rules'
import { searchStores } from '@/lib/services/device-control'

export const dynamic = 'force-dynamic'

// Store search for assigning a device. ADMIN only: it reaches stores without a device.
export async function GET(request: NextRequest) {
  const denied = await requireApiAccess()
  if (denied) return denied
  const access = await getRequestAccess()
  if (access.status !== 'ok' || !canControlDevices(access.viewer?.role ?? null)) {
    return NextResponse.json({ error: 'Hanya Admin.' }, { status: 403 })
  }

  const query = (request.nextUrl.searchParams.get('q') ?? '').trim()
  if (query.length < 2 || query.length > 60) {
    return NextResponse.json({ error: 'Ketik 2 sampai 60 karakter.' }, { status: 400 })
  }
  try {
    return NextResponse.json({ stores: await searchStores(query) })
  } catch (error) {
    console.error('API /api/control/stores error:', error)
    return NextResponse.json({ error: 'Daftar toko gagal dimuat.' }, { status: 500 })
  }
}
