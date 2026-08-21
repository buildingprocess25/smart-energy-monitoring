import { notFound } from 'next/navigation'
import { getStoreById } from '@/lib/services/store-service'
import { getAuditSessions, getTelemetryHistory } from '@/lib/services/telemetry-service'
import { StoreMonitoringPage } from '@/components/monitoring/store-monitoring-page'

export const dynamic = 'force-dynamic'

interface PageProps {
  params: Promise<{ storeId: string }>
}

export default async function MonitoringDetailPage({ params }: PageProps) {
  const { storeId } = await params
  const store = await getStoreById(storeId)

  if (!store) {
    notFound()
  }

  const sessions = await getAuditSessions(store.id)
  const initialHistory = await getTelemetryHistory(store.id, { rangeType: 'day' })

  return (
    <StoreMonitoringPage
      store={store}
      sessions={sessions}
      initialHistory={initialHistory}
    />
  )
}
