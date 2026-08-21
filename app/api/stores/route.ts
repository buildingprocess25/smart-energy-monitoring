import { NextResponse } from 'next/server'
import { getStores } from '@/lib/services/store-service'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const stores = await getStores()
    return NextResponse.json(stores)
  } catch (error) {
    console.error('API /api/stores error:', error)
    return NextResponse.json({ error: 'Failed to fetch stores' }, { status: 500 })
  }
}
