import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import { getMyEcoStore } from '@/lib/services/myeco-service'
import { getStoreById } from '@/lib/services/store-service'
import {
  getAuditSessions,
  getTelemetryHistory,
  getStoreAnalyticsData,
} from '@/lib/services/telemetry-service'
import { MyEcoAcSection } from '@/components/monitoring/myeco-ac-section'
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

  const myEco = await getMyEcoStore(store.code)

  // Without an own device there is no panel, session or analytics to show for this store.
  if (!store.deviceId) {
    return (
      <div className="flex flex-col gap-6 pb-12">
        <StoreHero store={store} myEcoOnly={myEco !== null} />
        <p className="text-sm text-muted-foreground">
          {myEco ? 'Toko ini hanya punya data AC dari myECO.' : 'Toko ini belum punya alat IoT.'} Panel R/S/T, sesi
          rekaman, dan biaya tampil setelah alat IoT SPARTA terpasang.
        </p>
        {myEco && <MyEcoAcSection storeCode={myEco.code} />}
      </div>
    )
  }

  return (
    <>
      <Suspense fallback={<StoreDetailFallback store={store} />}>
        <StoreDetail store={store} />
      </Suspense>
      {myEco && <MyEcoAcSection storeCode={myEco.code} />}
    </>
  )
}
