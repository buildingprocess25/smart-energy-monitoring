import { NextResponse } from 'next/server'
import { requireInternalAccess } from '@/lib/auth/api-guard'
import { getIotDeviceDataList, getStores } from '@/lib/services/store-service'

export const dynamic = 'force-dynamic'

// Device list for the GS device checklist in sparta-energy (User & Akses).
// Only sparta may call it, with the x-internal-token header.
export async function GET() {
  const denied = await requireInternalAccess()
  if (denied) return denied

  try {
    const [devices, stores] = await Promise.all([getIotDeviceDataList(), getStores()])
    const storeNameByCode = new Map(stores.map((s) => [s.code.toUpperCase(), s.name]))

    return NextResponse.json({
      devices: devices.map((d) => ({
        id: d.deviceId,
        name: d.deviceName,
        storeCode: d.storeCode,
        storeName: d.storeCode ? storeNameByCode.get(d.storeCode) ?? null : null,
        online: d.online,
        sensors: d.phases.map((p) => ({ phase: p.phase, name: p.phaseName || p.phase })),
      })),
    })
  } catch (error) {
    console.error('API /api/internal/devices error:', error)
    return NextResponse.json({ error: 'Gagal memuat daftar alat.' }, { status: 500 })
  }
}
