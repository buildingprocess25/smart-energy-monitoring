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
  const [scope, stores, initialStoreAnalytics, monthlyCosts] = await Promise.all([
    getRequestScope(),
    getStores(),
    getStoreAnalyticsData(),
    getMonthlyCostSummary(),
  ])

  if (scope.kind === 'devices' && stores.length === 0) return <NoAssignedDevices />

  return (
    <DashboardOverview
      stores={stores}
      initialStoreAnalytics={initialStoreAnalytics}
      monthlyCosts={monthlyCosts}
    />
  )
}
