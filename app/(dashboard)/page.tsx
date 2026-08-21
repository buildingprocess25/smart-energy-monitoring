import { getStores } from '@/lib/services/store-service'
import { getDailyConsumptionTrend } from '@/lib/services/telemetry-service'
import { DashboardOverview } from '@/components/dashboard/dashboard-overview'

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  const [stores, consumptionTrend] = await Promise.all([
    getStores(),
    getDailyConsumptionTrend(),
  ])

  return (
    <DashboardOverview
      stores={stores}
      initialConsumptionTrend={consumptionTrend}
    />
  )
}
