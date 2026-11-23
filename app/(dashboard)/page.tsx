import { getStores } from '@/lib/services/store-service'
import {
  getStoreAnalyticsData,
  getMonthlyCostSummary,
} from '@/lib/services/telemetry-service'
import { getRequestScope } from '@/lib/auth/access'
import { DashboardOverview } from '@/components/dashboard/dashboard-overview'
import { NoAssignedDevices } from '@/components/layout/no-assigned-devices'

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  // Both aggregates scan history and take seconds, so they stream into their own Suspense boundaries.
  const storeAnalyticsPromise = getStoreAnalyticsData().catch((error) => {
    console.error('Error loading dashboard store analytics:', error)
    return null
  })
  const monthlyCostsPromise = getMonthlyCostSummary()

  const [scope, stores] = await Promise.all([getRequestScope(), getStores()])

  if (scope.kind === 'devices' && stores.length === 0) return <NoAssignedDevices />

  return (
    <DashboardOverview
      stores={stores}
      storeAnalyticsPromise={storeAnalyticsPromise}
      monthlyCostsPromise={monthlyCostsPromise}
    />
  )
}
