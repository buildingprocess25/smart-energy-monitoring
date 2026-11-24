import { NextRequest, NextResponse } from 'next/server'
import { requireApiAccess } from '@/lib/auth/api-guard'
import { isIsoDate } from '@/lib/request-params'
import { isPhaseKey } from '@/lib/phase-keys'
import { getSampleHours } from '@/lib/services/sample-count-service'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest, { params }: { params: Promise<{ deviceId: string }> }) {
  const denied = await requireApiAccess()
  if (denied) return denied

  const query = new URL(request.url).searchParams
  const date = query.get('date') ?? ''
  const phase = query.get('phase') ?? ''
  if (!isIsoDate(date)) {
    return NextResponse.json({ error: 'Parameter date harus berformat YYYY-MM-DD.' }, { status: 400 })
  }
  if (!isPhaseKey(phase)) {
    return NextResponse.json({ error: 'Parameter phase tidak valid.' }, { status: 400 })
  }

  try {
    const { deviceId } = await params
    const hours = await getSampleHours(deviceId, phase, date)
    if (!hours) return NextResponse.json({ error: 'Sensor tidak ditemukan.' }, { status: 404 })
    return NextResponse.json({ hours })
  } catch (error) {
    console.error('API /api/devices/[deviceId]/samples error:', error)
    return NextResponse.json({ error: 'Rincian per jam gagal dimuat.' }, { status: 500 })
  }
}
