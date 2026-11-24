import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import { getStoreById } from '@/lib/services/store-service'
import {
  getAuditSessions,
  getTelemetryHistory,
  getStoreAnalyticsData,
} from '@/lib/services/telemetry-service'
import { StoreHero } from '@/components/monitoring/store-hero'
import { StoreMonitoringPage } from '@/components/monitoring/store-monitoring-page'
import { Skeleton } from '@/components/ui/skeleton'
import type { Store } from '@/lib/types'

export const dynamic = 'force-dynamic'

interface PageProps {
  params: Promise<{ storeId: string }>
}

async function StoreDetail({ store }: { store: Store }) {
  const [sessions, initialHistory, initialAnalytics] = await Promise.all([
    getAuditSessions(store.id),
    getTelemetryHistory(store.id, { rangeType: 'day' }),
    getStoreAnalyticsData(store.id),
  ])

  return (
    <StoreMonitoringPage
      store={store}
      sessions={sessions}
      initialHistory={initialHistory}
      initialAnalytics={initialAnalytics}
    />
  )
}

function StoreDetailFallback({ store }: { store: Store }) {
  return (
    <div className="flex flex-col gap-6">
      <StoreHero store={store} />
      <div role="status" aria-live="polite" className="flex flex-col gap-4">
        <p className="text-sm text-muted-foreground">Memuat riwayat dan analitik toko</p>
        <Skeleton className="h-40 w-full rounded-xl motion-reduce:animate-none" />
        <Skeleton className="h-80 w-full rounded-xl motion-reduce:animate-none" />
      </div>
    </div>
  )
}

export default async function MonitoringDetailPage({ params }: PageProps) {
  const { storeId } = await params
  const store = await getStoreById(storeId)

  if (!store) {
    notFound()
  }

  return (
    <Suspense fallback={<StoreDetailFallback store={store} />}>
      <StoreDetail store={store} />
    </Suspense>
  )
}
