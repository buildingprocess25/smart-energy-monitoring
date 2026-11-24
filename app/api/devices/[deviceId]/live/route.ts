import { NextRequest, NextResponse } from 'next/server'
import { requireApiAccess } from '@/lib/auth/api-guard'
import { parseDeviceId } from '@/lib/control-commands'
import { parseSinceParam } from '@/lib/request-params'
import { getDeviceLiveBuffer } from '@/lib/services/live-buffer-service'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest, { params }: { params: Promise<{ deviceId: string }> }) {
  const denied = await requireApiAccess()
  if (denied) return denied

  const deviceId = parseDeviceId((await params).deviceId)
  const since = parseSinceParam(request.nextUrl.searchParams.get('since'))
  if (!deviceId || !since.ok) return NextResponse.json({ error: 'Parameter tidak valid.' }, { status: 400 })

  try {
    const result = await getDeviceLiveBuffer(deviceId, since.value)
    if (!result) return NextResponse.json({ error: 'Perangkat tidak ditemukan.' }, { status: 404 })
    return NextResponse.json(result)
  } catch {
    return NextResponse.json({ error: 'Data live tidak bisa dimuat.' }, { status: 502 })
  }
}
