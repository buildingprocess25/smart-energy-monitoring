import { getStores } from '@/lib/services/store-service'
import {
  getStoreAnalyticsData,
  getMonthlyCostSummary,
} from '@/lib/services/telemetry-service'
import { DashboardOverview } from '@/components/dashboard/dashboard-overview'

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  const [stores, initialStoreAnalytics, monthlyCosts] = await Promise.all([
    getStores(),
    getStoreAnalyticsData(),
    getMonthlyCostSummary(),
  ])

  return (
    <DashboardOverview
      stores={stores}
      initialStoreAnalytics={initialStoreAnalytics}
      monthlyCosts={monthlyCosts}
    />
  )
}

