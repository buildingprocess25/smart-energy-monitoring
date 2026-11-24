import { NextRequest } from 'next/server'
import { handleControl } from '@/lib/control-route'
import { parseCaptureCommand } from '@/lib/control-commands'
import { runCaptureCommand } from '@/lib/services/device-control'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  return handleControl(request, 'capture', parseCaptureCommand, async (command) => {
    const result = await runCaptureCommand(command)
    return { deviceId: command.deviceId, ...result }
  })
}
