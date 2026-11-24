import { NextResponse, type NextRequest } from 'next/server'
import { requireApiAccess } from '@/lib/auth/api-guard'
import { buildWorkbook, WorkbookError } from '@/lib/services/workbook-service'
import { parseWorkbook } from '@/lib/workbook'
import { readJsonBody } from '@/lib/json-body'

export const dynamic = 'force-dynamic'

// POST only because the definition is too long for a URL; nothing is changed.
export async function POST(request: NextRequest) {
  const denied = await requireApiAccess()
  if (denied) return denied
  const spec = parseWorkbook(await readJsonBody(request))
  if (!spec.ok) return NextResponse.json({ error: spec.error }, { status: 400 })
  try {
    const { data } = await buildWorkbook(spec.value, Date.now())
    return new NextResponse(data, {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Cache-Control': 'no-store',
      },
    })
  } catch (error) {
    if (error instanceof WorkbookError) return NextResponse.json({ error: error.message }, { status: 422 })
    console.error('API /api/reports/workbook error:', error)
    return NextResponse.json({ error: 'File gagal dibuat.' }, { status: 500 })
  }
}
