import { NextRequest, NextResponse } from 'next/server'
import { requireApiAccess } from '@/lib/auth/api-guard'
import { parseHistoryParams } from '@/lib/request-params'
import { getTelemetryHistory } from '@/lib/services/telemetry-service'

export const dynamic = 'force-dynamic'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ storeId: string }> }
) {
  const denied = await requireApiAccess()
  if (denied) return denied

  const parsed = parseHistoryParams(new URL(request.url).searchParams)
  if (!parsed.ok) {
    return NextResponse.json({ error: parsed.error }, { status: 400 })
  }

  try {
    const { storeId } = await params
    const history = await getTelemetryHistory(storeId, parsed.value)

    return NextResponse.json(history)
  } catch (error) {
    console.error('API /api/stores/[storeId]/history error:', error)
    return NextResponse.json({ error: 'Failed to fetch history' }, { status: 500 })
  }
}
