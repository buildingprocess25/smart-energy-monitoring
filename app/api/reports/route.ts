import { NextRequest, NextResponse } from 'next/server'
import { requireApiAccess } from '@/lib/auth/api-guard'
import { parseReportParams } from '@/lib/reports'
import { buildReport } from '@/lib/services/report-service'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  const denied = await requireApiAccess()
  if (denied) return denied
  const params = parseReportParams(request.nextUrl.searchParams)
  if (!params.ok) return NextResponse.json({ error: params.error }, { status: 400 })
  try {
    const report = await buildReport(params.value)
    if ('error' in report) return NextResponse.json(report, { status: 403 })
    return NextResponse.json(report)
  } catch (error) {
    console.error('API /api/reports error:', error)
    return NextResponse.json({ error: 'Laporan gagal dibuat.' }, { status: 500 })
  }
}
