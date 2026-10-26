import { NextResponse } from 'next/server'
import { requireApiAccess } from '@/lib/auth/api-guard'
import { getStores } from '@/lib/services/store-service'

export const dynamic = 'force-dynamic'

export async function GET() {
  const denied = await requireApiAccess()
  if (denied) return denied

  try {
    const stores = await getStores()
    return NextResponse.json(stores)
  } catch (error) {
    console.error('API /api/stores error:', error)
    return NextResponse.json({ error: 'Failed to fetch stores' }, { status: 500 })
  }
}
