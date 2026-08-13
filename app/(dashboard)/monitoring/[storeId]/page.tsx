import { StoreMonitoringPage } from '@/components/monitoring/store-monitoring-page'

interface PageProps {
  params: Promise<{ storeId: string }>
}

export default async function MonitoringDetailPage({ params }: PageProps) {
  const { storeId } = await params
  
  return <StoreMonitoringPage storeId={storeId} />
}
