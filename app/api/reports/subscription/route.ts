import { NextResponse, type NextRequest } from 'next/server'
import { requireWriteAccess } from '@/lib/auth/api-guard'
import { canReceiveReports } from '@/lib/auth/access-rules'
import { readJsonBody } from '@/lib/json-body'
import { setSubscribed, StoreError } from '@/lib/services/report-template-store'

export const dynamic = 'force-dynamic'

// Everyone decides only for their own account.
export async function POST(request: NextRequest) {
  const access = await requireWriteAccess(canReceiveReports, 'Langganan laporan hanya untuk Admin dan Auditor.')
  if ('denied' in access) return access.denied
  const body = (await readJsonBody(request)) as { subscribed?: unknown } | null
  if (typeof body?.subscribed !== 'boolean') return NextResponse.json({ error: 'Permintaan tidak valid.' }, { status: 400 })
  try {
    await setSubscribed(access.viewer.userId, body.subscribed)
    return NextResponse.json({ ok: true })
  } catch (error) {
    if (error instanceof StoreError) return NextResponse.json({ error: error.message }, { status: 409 })
    console.error('API /api/reports/subscription error:', error)
    return NextResponse.json({ error: 'Langganan gagal disimpan.' }, { status: 500 })
  }
}
