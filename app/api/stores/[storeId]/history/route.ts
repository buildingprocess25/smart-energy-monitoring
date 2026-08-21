import { NextRequest, NextResponse } from 'next/server'
import { getTelemetryHistory } from '@/lib/services/telemetry-service'
import { TimeRangeType } from '@/lib/types'

export const dynamic = 'force-dynamic'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ storeId: string }> }
) {
  try {
    const { storeId } = await params
    const { searchParams } = new URL(request.url)

    const rangeType = (searchParams.get('rangeType') as TimeRangeType) || 'day'
    const date = searchParams.get('date') || undefined
    const sessionId = searchParams.get('sessionId') || undefined
    const page = searchParams.get('page') ? parseInt(searchParams.get('page')!) : undefined
    const pageSize = searchParams.get('pageSize') ? parseInt(searchParams.get('pageSize')!) : undefined

    const history = await getTelemetryHistory(storeId, {
      rangeType,
      date,
      sessionId,
      page,
      pageSize,
    })

    return NextResponse.json(history)
  } catch (error) {
    console.error('API /api/stores/[storeId]/history error:', error)
    return NextResponse.json({ error: 'Failed to fetch history' }, { status: 500 })
  }
}
