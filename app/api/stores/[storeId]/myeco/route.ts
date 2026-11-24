import { NextRequest, NextResponse } from 'next/server'
import { requireApiAccess } from '@/lib/auth/api-guard'
import { MyEcoError } from '@/lib/myeco-client'
import { isPowerRange } from '@/lib/myeco-samples'
import { getMyEcoHistory, getMyEcoLive, getMyEcoPower, getMyEcoStore } from '@/lib/services/myeco-service'
import { BackoffError } from '@/lib/shared-fetch'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest, { params }: { params: Promise<{ storeId: string }> }) {
  const denied = await requireApiAccess()
  if (denied) return denied

  const view = request.nextUrl.searchParams.get('view') ?? 'live'
  const range = request.nextUrl.searchParams.get('range') ?? '24h'
  if (view !== 'live' && view !== 'history' && view !== 'power') {
    return NextResponse.json({ error: 'Parameter view harus live, power, atau history.' }, { status: 400 })
  }
  if (!isPowerRange(range)) {
    return NextResponse.json({ error: 'Parameter range harus 1h, 24h, atau 7d.' }, { status: 400 })
  }

  try {
    const store = await getMyEcoStore((await params).storeId)
    if (!store) return NextResponse.json({ error: 'Toko tidak ditemukan.' }, { status: 404 })
    if (view === 'power') return NextResponse.json(await getMyEcoPower(store, range))
    return NextResponse.json(view === 'live' ? await getMyEcoLive(store) : await getMyEcoHistory(store))
  } catch (error) {
    if (error instanceof MyEcoError && error.kind === 'unconfigured') {
      return NextResponse.json({ error: 'Koneksi myECO belum diatur di server.' }, { status: 503 })
    }
    if (error instanceof MyEcoError || error instanceof BackoffError) {
      if (error instanceof MyEcoError) console.error(error.message)
      return NextResponse.json({ error: 'Data AC tidak bisa diambil dari myECO.' }, { status: 502 })
    }
    console.error('API /api/stores/[storeId]/myeco error:', error)
    return NextResponse.json({ error: 'Gagal mengambil data AC.' }, { status: 500 })
  }
}
