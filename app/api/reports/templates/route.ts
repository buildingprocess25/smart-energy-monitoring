import { NextResponse, type NextRequest } from 'next/server'
import { requireControlAccess } from '@/lib/auth/api-guard'
import { readJsonBody } from '@/lib/json-body'
import { loadMail, sendTemplate } from '@/lib/services/report-mail-service'
import { deleteTemplate, isTemplateId, readTemplates, saveTemplate, StoreError } from '@/lib/services/report-template-store'
import { parseTemplate } from '@/lib/workbook'

export const dynamic = 'force-dynamic'

const bad = (error: string, status = 400) => NextResponse.json({ error }, { status })

export async function POST(request: NextRequest) {
  const access = await requireControlAccess()
  if ('denied' in access) return access.denied
  const { viewer } = access
  const body = (await readJsonBody(request)) as Record<string, unknown> | null
  const action = body?.action
  const id = body?.id ?? null
  if (!body || (id !== null && !isTemplateId(id))) return bad('Permintaan tidak valid.')

  try {
    if (action === 'save') {
      const ready = await loadMail()
      const spec = parseTemplate(body.template, 'mail' in ready ? ready.mail.domains : ready.domains)
      if (!spec.ok) return bad(spec.error)
      const saved = await saveTemplate(id, spec.value, viewer.userId)
      console.info('Report template', JSON.stringify({ userId: viewer.userId, action, id: saved }))
      return NextResponse.json({ ok: true, id: saved })
    }
    if (id === null) return bad('Template belum dipilih.')
    if (action === 'delete') {
      await deleteTemplate(id)
      console.info('Report template', JSON.stringify({ userId: viewer.userId, action, id }))
      return NextResponse.json({ ok: true })
    }
    if (action === 'send' || action === 'test') {
      const template = (await readTemplates()).find((t) => t.id === id)
      if (!template) return bad('Template tidak ditemukan. Muat ulang halaman.', 404)
      const testTo = action === 'test' ? (typeof body.to === 'string' ? body.to.trim() : '') : null
      console.info('Report template', JSON.stringify({ userId: viewer.userId, action, id }))
      const error = await sendTemplate(template, { slot: Date.now(), attempt: 1, testTo })
      return error ? bad(error, 502) : NextResponse.json({ ok: true })
    }
    return bad('Perintah tidak dikenal.')
  } catch (error) {
    if (error instanceof StoreError) return bad(error.message, 409)
    console.error('API /api/reports/templates error:', error)
    return bad('Perintah gagal dijalankan.', 500)
  }
}
