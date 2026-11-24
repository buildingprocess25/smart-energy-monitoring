import { NextResponse, type NextRequest } from 'next/server'
import { requireControlAccess } from '@/lib/auth/api-guard'
import { readJsonBody } from '@/lib/json-body'
import { parseGroup, parseMailSettings } from '@/lib/mail-settings'
import { loadMail, saveMail, sendPlainTest, testLogin } from '@/lib/services/report-mail-service'
import { deleteGroup, isTemplateId, saveGroup, StoreError } from '@/lib/services/report-template-store'
import { SmtpError } from '@/lib/smtp'

export const dynamic = 'force-dynamic'

const bad = (error: string, status = 400) => NextResponse.json({ error }, { status })

export async function POST(request: NextRequest) {
  const access = await requireControlAccess()
  if ('denied' in access) return access.denied
  const body = (await readJsonBody(request)) as Record<string, unknown> | null
  const id = body?.id ?? null
  if (!body || (id !== null && !isTemplateId(id))) return bad('Permintaan tidak valid.')
  const { action } = body
  // Never the body itself: it may hold the password and addresses.
  console.info('Report mail', JSON.stringify({ userId: access.viewer.userId, action: String(action).slice(0, 20) }))

  try {
    switch (action) {
      case 'save': {
        const settings = parseMailSettings(body.settings)
        if (!settings.ok) return bad(settings.error)
        await saveMail(settings.value)
        break
      }
      case 'check':
        await testLogin()
        break
      case 'test':
        await sendPlainTest(typeof body.to === 'string' ? body.to.trim() : '')
        break
      case 'saveGroup': {
        const ready = await loadMail()
        const group = parseGroup(body.group, 'mail' in ready ? ready.mail.domains : ready.domains)
        if (!group.ok) return bad(group.error)
        await saveGroup(id, group.value)
        break
      }
      case 'deleteGroup':
        if (id === null) return bad('Grup belum dipilih.')
        await deleteGroup(id)
        break
      default:
        return bad('Perintah tidak dikenal.')
    }
    return NextResponse.json({ ok: true })
  } catch (error) {
    if (error instanceof StoreError) return bad(error.message, 409)
    if (error instanceof SmtpError) return bad(error.message, 502)
    console.error('API /api/reports/mail error:', error)
    return bad('Perintah gagal dijalankan.', 500)
  }
}
