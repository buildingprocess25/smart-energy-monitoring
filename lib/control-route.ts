import 'server-only'
import { NextResponse, type NextRequest } from 'next/server'
import { requireControlAccess } from '@/lib/auth/api-guard'
import type { ParseResult } from '@/lib/request-params'
import { ControlError } from '@/lib/services/device-control'

const MAX_BODY_BYTES = 10_000

// Shared by the control routes: ADMIN check, body check, audit line, error mapping.
export async function handleControl<T extends { action: string }>(
  request: NextRequest,
  target: string | null,
  parse: (body: unknown) => ParseResult<T>,
  run: (command: T) => Promise<object | void>
): Promise<NextResponse> {
  const access = await requireControlAccess()
  if ('denied' in access) return access.denied
  if (target === null) return NextResponse.json({ error: 'Target tidak valid.' }, { status: 400 })

  const text = await request.text()
  let body: unknown = null
  try {
    if (text.length <= MAX_BODY_BYTES) body = JSON.parse(text)
  } catch {
    body = null
  }
  const command = parse(body)
  if (!command.ok) return NextResponse.json({ error: command.error }, { status: 400 })

  const audit = { userId: access.viewer.userId, target, ...command.value }
  try {
    const result = await run(command.value)
    console.info('Control', JSON.stringify({ ...audit, result: 'ok' }))
    return NextResponse.json({ ok: true, ...result })
  } catch (error) {
    if (error instanceof ControlError) {
      console.warn('Control', JSON.stringify({ ...audit, result: error.status }))
      return NextResponse.json({ error: error.message }, { status: error.status })
    }
    console.error('Control failed', JSON.stringify(audit), error)
    return NextResponse.json({ error: 'Perintah gagal dijalankan.' }, { status: 500 })
  }
}
