import { NextRequest, NextResponse } from 'next/server'
import { getStoreById } from '@/lib/services/store-service'
import { getAuditSessions, getLiveTelemetry } from '@/lib/services/telemetry-service'

export const dynamic = 'force-dynamic'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ storeId: string }> }
) {
  try {
    const { storeId } = await params
    const store = await getStoreById(storeId)

    if (!store) {
      return NextResponse.json({ error: 'Store not found' }, { status: 404 })
    }

    const sessions = await getAuditSessions(store.id)
    const livePhases = await getLiveTelemetry(store.id)

    return NextResponse.json({
      store: {
        ...store,
        phases: livePhases.length > 0 ? livePhases : store.phases,
      },
      sessions,
    })
  } catch (error) {
    console.error('API /api/stores/[storeId] error:', error)
    return NextResponse.json({ error: 'Failed to fetch store details' }, { status: 500 })
  }
}
