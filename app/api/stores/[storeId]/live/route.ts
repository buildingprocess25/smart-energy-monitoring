import { NextRequest, NextResponse } from 'next/server'
import { requireApiAccess } from '@/lib/auth/api-guard'
import { parseSinceParam } from '@/lib/request-params'
import { BackoffError } from '@/lib/shared-fetch'
import { getStoreLiveBuffer } from '@/lib/services/live-buffer-service'
import { TelemetryApiError } from '@/lib/services/telemetry-api'

export const dynamic = 'force-dynamic'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ storeId: string }> }
) {
  const denied = await requireApiAccess()
  if (denied) return denied

  const since = parseSinceParam(request.nextUrl.searchParams.get('since'))
  if (!since.ok) return NextResponse.json({ error: since.error }, { status: 400 })

  try {
    const { storeId } = await params
    const result = await getStoreLiveBuffer(storeId, since.value)
    if (!result) return NextResponse.json({ error: 'Toko tidak ditemukan.' }, { status: 404 })
    return NextResponse.json(result)
  } catch (error) {
    if (error instanceof TelemetryApiError || error instanceof BackoffError) {
      return NextResponse.json({ error: 'Data live tidak bisa diambil dari server IoT.' }, { status: 502 })
    }
    console.error('API /api/stores/[storeId]/live error:', error)
    return NextResponse.json({ error: 'Gagal mengambil data live.' }, { status: 500 })
  }
}
