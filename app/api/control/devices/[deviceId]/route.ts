import { NextRequest } from 'next/server'
import { handleControl } from '@/lib/control-route'
import { parseDeviceCommand, parseDeviceId } from '@/lib/control-commands'
import { runDeviceCommand } from '@/lib/services/device-control'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest, { params }: { params: Promise<{ deviceId: string }> }) {
  const deviceId = parseDeviceId((await params).deviceId)
  return handleControl(request, deviceId, parseDeviceCommand, (command) =>
    runDeviceCommand(deviceId ?? '', command)
  )
}
