import { NextRequest, NextResponse } from 'next/server'
import { getStoreAnalyticsData } from '@/lib/services/telemetry-service'

export const dynamic = 'force-dynamic'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ storeId: string }> }
) {
  try {
    const { storeId } = await params
    const decodedStoreId = decodeURIComponent(storeId)

    const data = await getStoreAnalyticsData(decodedStoreId)
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
