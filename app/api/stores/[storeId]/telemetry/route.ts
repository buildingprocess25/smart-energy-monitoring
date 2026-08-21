import { NextRequest, NextResponse } from 'next/server'
import { getLiveTelemetry } from '@/lib/services/telemetry-service'

export const dynamic = 'force-dynamic'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ storeId: string }> }
) {
  try {
    const { storeId } = await params
    const phases = await getLiveTelemetry(storeId)

    return NextResponse.json({ phases })
  } catch (error) {
    console.error('API /api/stores/[storeId]/telemetry error:', error)
    return NextResponse.json({ error: 'Failed to fetch telemetry' }, { status: 500 })
  }
}
