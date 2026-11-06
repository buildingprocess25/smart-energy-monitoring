import { NextRequest, NextResponse } from 'next/server'
import { requireApiAccess } from '@/lib/auth/api-guard'
import { parseDateParam } from '@/lib/request-params'
import { getStoreAnalyticsData } from '@/lib/services/telemetry-service'

export const dynamic = 'force-dynamic'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ storeId: string }> }
) {
  const denied = await requireApiAccess()
  if (denied) return denied

  const date = parseDateParam(new URL(request.url).searchParams.get('date'))
  if (!date.ok) {
    return NextResponse.json({ error: date.error }, { status: 400 })
  }

  try {
    const { storeId } = await params
    const decodedStoreId = decodeURIComponent(storeId)

    const data = await getStoreAnalyticsData(decodedStoreId, date.value)
    if (!data) {
      return NextResponse.json(
        { error: 'Data analisis toko tidak ditemukan' },
        { status: 404 }
      )
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching store overview analytics:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
