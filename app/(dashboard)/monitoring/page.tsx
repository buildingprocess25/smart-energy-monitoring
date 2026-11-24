import { Suspense } from 'react'
import { getStores } from '@/lib/services/store-service'
import { getSangatBorosStores, withInstallStatus } from '@/lib/services/sangat-boros-service'
import { getMonthlyCostSummary } from '@/lib/services/telemetry-service'
import { getRequestScope } from '@/lib/auth/access'
import { StoreGallery } from '@/components/dashboard/store-gallery'
import { MyEcoStoreList } from '@/components/monitoring/myeco-store-list'
import { Skeleton } from '@/components/ui/skeleton'
import { NoAssignedDevices } from '@/components/layout/no-assigned-devices'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Monitoring Toko | Smart Energy Monitoring',
  description: 'Daftar dan pemantauan telemetri energi seluruh cabang toko Alfamart.',
}

export default async function MonitoringPage() {
  const scope = await getRequestScope()
  const [stores, monthlyCosts, sangatBoros] = await Promise.all([
    getStores(),
    getMonthlyCostSummary(),
    // The install priority list is for ADMIN and AUDITOR; GS only sees assigned devices.
    scope.kind === 'all' ? getSangatBorosStores() : null,
  ])

  if (scope.kind === 'devices' && stores.length === 0) return <NoAssignedDevices />

  return (
    <div className="flex flex-col gap-6">
    <StoreGallery
      initialStores={stores}
      monthlyCosts={monthlyCosts}
      sangatBoros={
        sangatBoros
          ? { status: sangatBoros.status, items: withInstallStatus(sangatBoros.stores, stores) }
          : undefined
      }
    />
    {scope.kind === 'all' && (
      <Suspense fallback={<Skeleton className="h-40 w-full rounded-2xl motion-reduce:animate-none" />}>
        <MyEcoStoreList />
      </Suspense>
    )}
    </div>
  )
}
