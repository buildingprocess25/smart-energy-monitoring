import { getStores } from '@/lib/services/store-service'
import { getStoreAnalyticsData } from '@/lib/services/telemetry-service'
import { DashboardOverview } from '@/components/dashboard/dashboard-overview'

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  const [stores, initialStoreAnalytics] = await Promise.all([
    getStores(),
    getStoreAnalyticsData(),
  ])

  return (
    <DashboardOverview
      stores={stores}
      initialStoreAnalytics={initialStoreAnalytics}
    />
  )
}
