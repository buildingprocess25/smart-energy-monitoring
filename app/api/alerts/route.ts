import { NextResponse } from 'next/server'
import { requireApiAccess } from '@/lib/auth/api-guard'
import { getDeviceHealth } from '@/lib/services/health-service'

export const dynamic = 'force-dynamic'

export async function GET() {
  const denied = await requireApiAccess()
  if (denied) return denied
  try {
    const { alerts } = await getDeviceHealth()
    return NextResponse.json({ alerts })
  } catch (error) {
    console.error('API /api/alerts error:', error)
    return NextResponse.json({ error: 'Peringatan gagal dimuat.' }, { status: 500 })
  }
}
