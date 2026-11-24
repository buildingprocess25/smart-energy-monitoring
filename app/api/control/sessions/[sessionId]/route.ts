import { NextRequest } from 'next/server'
import { handleControl } from '@/lib/control-route'
import { parseSessionCommand } from '@/lib/control-commands'
import { parseSessionId } from '@/lib/request-params'
import { runSessionCommand } from '@/lib/services/device-control'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest, { params }: { params: Promise<{ sessionId: string }> }) {
  const parsed = parseSessionId((await params).sessionId)
  const sessionId = parsed.ok ? parsed.value : null
  return handleControl(request, sessionId, parseSessionCommand, (command) =>
    runSessionCommand(sessionId ?? '', command)
  )
}
