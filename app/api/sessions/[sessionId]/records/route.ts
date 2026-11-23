import { NextRequest, NextResponse } from 'next/server'
import { requireApiAccess } from '@/lib/auth/api-guard'
import { parseSessionId } from '@/lib/request-params'
import { getSessionRecords, SessionTooLargeError } from '@/lib/services/session-service'

export const dynamic = 'force-dynamic'

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  const denied = await requireApiAccess()
  if (denied) return denied

  const parsed = parseSessionId((await params).sessionId)
  if (!parsed.ok) return NextResponse.json({ error: parsed.error }, { status: 400 })

  try {
    const result = await getSessionRecords(parsed.value)
    if (!result) return NextResponse.json({ error: 'Sesi tidak ditemukan.' }, { status: 404 })
    return NextResponse.json(result)
  } catch (error) {
    if (error instanceof SessionTooLargeError) {
      return NextResponse.json({ error: 'Sesi terlalu besar untuk diunduh sekaligus.' }, { status: 413 })
    }
    console.error('API /api/sessions/[sessionId]/records error:', error)
    return NextResponse.json({ error: 'Gagal mengambil data sesi.' }, { status: 500 })
  }
}
