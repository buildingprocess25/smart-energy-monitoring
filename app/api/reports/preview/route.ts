import { NextResponse, type NextRequest } from 'next/server'
import { requireApiAccess } from '@/lib/auth/api-guard'
import { readJsonBody } from '@/lib/json-body'
import { buildPreview, WorkbookError } from '@/lib/services/workbook-service'
import { parseWorkbook } from '@/lib/workbook'

export const dynamic = 'force-dynamic'

// POST only because the definition is too long for a URL; nothing is changed.
export async function POST(request: NextRequest) {
  const denied = await requireApiAccess()
  if (denied) return denied
  const spec = parseWorkbook(await readJsonBody(request))
  if (!spec.ok) return NextResponse.json({ error: spec.error }, { status: 400 })
  try {
    return NextResponse.json(await buildPreview(spec.value, Date.now()))
  } catch (error) {
    if (error instanceof WorkbookError) return NextResponse.json({ error: error.message }, { status: 422 })
    console.error('API /api/reports/preview error:', error)
    return NextResponse.json({ error: 'Pratinjau gagal dimuat.' }, { status: 500 })
  }
}
