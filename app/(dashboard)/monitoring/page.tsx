import { getStores } from '@/lib/services/store-service'
import { getSangatBorosStores, withInstallStatus } from '@/lib/services/sangat-boros-service'
import { getRequestScope } from '@/lib/auth/access'
import { StoreGallery } from '@/components/dashboard/store-gallery'
import { NoAssignedDevices } from '@/components/layout/no-assigned-devices'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Monitoring Toko | Smart Energy Monitoring',
  description: 'Daftar dan pemantauan telemetri energi seluruh cabang toko Alfamart.',
}

export default async function MonitoringPage() {
  const scope = await getRequestScope()
  const [stores, sangatBoros] = await Promise.all([
    getStores(),
    // The install priority list is for ADMIN and AUDITOR; GS only sees assigned devices.
    scope.kind === 'all' ? getSangatBorosStores() : null,
  ])

  if (scope.kind === 'devices' && stores.length === 0) return <NoAssignedDevices />

  return (
    <StoreGallery
      initialStores={stores}
      sangatBoros={
        sangatBoros
          ? { status: sangatBoros.status, items: withInstallStatus(sangatBoros.stores, stores) }
          : undefined
      }
    />
  )
}
