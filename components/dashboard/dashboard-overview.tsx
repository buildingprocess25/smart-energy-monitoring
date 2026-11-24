'use client'

import { Suspense, use } from 'react'
import Link from 'next/link'
import {
  ArrowRight,
  Building2,
} from 'lucide-react'
import { Store, StoreAnalyticsResult, MonthlyCostRecord } from '@/lib/types'
import { buttonVariants } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { NetworkMapWidget } from './network-map-widget'
import { StoreAnalyticsWidget } from './store-analytics-widget'
import { MonthlyCostKpiCard } from './monthly-cost-kpi-card'
import { DashboardKpiSummary } from './dashboard-kpi-summary'
import { StatusBadge } from './status-badge'
import { cn } from '@/lib/utils'
import { formatKwh, formatStoreKwh, mainPanelKwh } from '@/lib/format-energy'

interface DashboardOverviewProps {
  stores?: Store[]
  storeAnalyticsPromise: Promise<StoreAnalyticsResult | null>
  monthlyCostsPromise: Promise<MonthlyCostRecord[]>
}

function MonthlyCostSection({
  monthlyCostsPromise,
}: {
  monthlyCostsPromise: Promise<MonthlyCostRecord[]>
}) {
  return (
    <MonthlyCostKpiCard
      monthlyCosts={use(monthlyCostsPromise)}
    />
  )
}

function StoreAnalyticsSection({
  stores,
  storeAnalyticsPromise,
}: {
  stores: Store[]
  storeAnalyticsPromise: Promise<StoreAnalyticsResult | null>
}) {
  return <StoreAnalyticsWidget stores={stores} initialAnalytics={use(storeAnalyticsPromise)} />
}

function MonthlyCostFallback() {
  return (
    <div
      role="status"
      aria-live="polite"
      className="flex flex-col justify-between gap-3 rounded-2xl bg-card ring-1 ring-foreground/10 p-4"
    >
      <span className="text-xs font-semibold text-muted-foreground">
        Estimasi Biaya PLN
      </span>
      <Skeleton className="h-8 w-40 motion-reduce:animate-none" />
      <span className="text-xs text-muted-foreground">Menghitung biaya bulanan</span>
    </div>
  )
}

function StoreAnalyticsFallback() {
  return (
    <div
      role="status"
      aria-live="polite"
      className="flex flex-col gap-4 rounded-2xl bg-card ring-1 ring-foreground/10 p-5 lg:col-span-8"
    >
      <div className="flex flex-col gap-2">
        <Skeleton className="h-5 w-56 motion-reduce:animate-none" />
        <p className="text-xs text-muted-foreground">Memuat analitik energi toko</p>
      </div>
      <Skeleton className="h-64 w-full motion-reduce:animate-none" />
    </div>
  )
}

export function DashboardOverview({
  stores = [],
  storeAnalyticsPromise,
  monthlyCostsPromise,
}: DashboardOverviewProps) {
  // Hitung total energi
  const totalKwh = mainPanelKwh(stores)
  // Hitung konsumsi per cabang
  const branchMap: Record<string, number> = {}
  stores.forEach((s) => {
    if (s.branch && s.energyBasis === 'main') {
      branchMap[s.branch] = (branchMap[s.branch] || 0) + (s.kwhTotal || 0)
    }
  })

  const branchStats = Object.entries(branchMap).map(([name, kwh]) => ({
    name,
    kwh,
    percentage: totalKwh > 0 ? (kwh / totalKwh) * 100 : 0,
  })).sort((a, b) => b.kwh - a.kwh).slice(0, 5)

  // Toko konsumsi tertinggi
  const topStores = stores
    .slice()
    .sort((a, b) => (b.kwhTotal || 0) - (a.kwhTotal || 0))
    .slice(0, 5)

  return (
    <div className="flex flex-col gap-6">
      {/* Top Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Dashboard Monitoring Energi
          </h1>
          <p className="text-sm text-muted-foreground">
            Ringkasan performa energi, status perangkat IoT, dan konsumsi seluruh cabang Alfamart.
          </p>
        </div>

        <Link
          href="/monitoring"
          className={cn(
            buttonVariants(),
            'self-start sm:self-auto'
          )}
        >
          Buka Monitoring Toko
          <ArrowRight data-icon="inline-end" aria-hidden="true" />
        </Link>
      </div>

      <DashboardKpiSummary
        stores={stores}
        costCard={
          <Suspense fallback={<MonthlyCostFallback />}>
            <MonthlyCostSection monthlyCostsPromise={monthlyCostsPromise} />
          </Suspense>
        }
      />

      <div className="grid grid-cols-1 gap-6 *:min-w-0 lg:grid-cols-12">
        {/* Widget Analisis Toko Terpilih (Profil 24 Jam & Tren 7 Hari) */}
        <Suspense fallback={<StoreAnalyticsFallback />}>
          <StoreAnalyticsSection stores={stores} storeAnalyticsPromise={storeAnalyticsPromise} />
        </Suspense>

        {/* Status Perangkat & Distribusi Wilayah (Col 4) */}
        <div className="flex flex-col rounded-2xl bg-card ring-1 ring-foreground/10 p-5 lg:col-span-4">
          <h2 className="text-base font-semibold text-foreground">
            Distribusi Energi per Cabang
          </h2>
          <p className="text-xs text-muted-foreground">
            Proporsi pemakaian listrik berdasarkan wilayah cabang.
          </p>

          <div className="mt-5 flex flex-1 flex-col gap-4">
            {branchStats.map((branch) => (
              <div key={branch.name} className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-foreground flex items-center gap-1.5">
                    <Building2 className="size-3.5 text-muted-foreground" />
                    Cabang {branch.name}
                  </span>
                  <span className="font-bold text-foreground">
                    {formatKwh(branch.kwh)} kWh{' '}
                    <span className="font-normal text-muted-foreground">
                      ({formatKwh(branch.percentage)}%)
                    </span>
                  </span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-primary transition-all duration-500"
                    style={{ width: `${branch.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <p className="mt-4 text-xs text-muted-foreground">
            {branchStats.length > 0
              ? 'Hanya toko dengan sensor panel utama (R/S/T).'
              : 'Energi belum tersedia. Muat ulang sebentar lagi.'}
          </p>
        </div>

        {/* Peta Sebaran Alat IoT Aktif (Col 12) */}
        <div className="lg:col-span-12">
          <NetworkMapWidget stores={stores} />
        </div>

        {/* Toko Konsumsi Tertinggi (Col 12) */}
        <div className="flex flex-col rounded-2xl bg-card ring-1 ring-foreground/10 lg:col-span-12">
          <div className="flex items-center justify-between border-b p-5">
            <div>
              <h2 className="text-base font-semibold text-foreground">
                Toko Terpantau &amp; Beban Konsumsi
              </h2>
              <p className="text-xs text-muted-foreground">
                Daftar toko dengan data telemetri aktif dan riwayat audit energi.
              </p>
            </div>
            <Link
              href="/monitoring"
              className="text-xs font-semibold text-primary hover:underline"
            >
              Lihat Semua Toko
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b bg-muted/40 text-xs font-semibold text-muted-foreground">
                <tr>
                  <th className="p-4">Kode</th>
                  <th className="p-4">Nama Toko</th>
                  <th className="p-4">Cabang</th>
                  <th className="p-4 text-right">Total Energi</th>
                  <th className="p-4 text-center">Status</th>
                  <th className="p-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {topStores.map((store) => (
                  <tr
                    key={store.id}
                    className="transition-colors hover:bg-muted/30"
                  >
                    <td className="p-4 tabular-nums text-xs font-bold text-muted-foreground">
                      {store.code}
                    </td>
                    <td className="p-4 font-semibold text-foreground">
                      {store.name}
                    </td>
                    <td className="p-4 text-xs text-muted-foreground">
                      Cabang {store.branch}
                    </td>
                    <td className="p-4 text-right font-bold text-foreground">
                      {formatStoreKwh(store)} kWh
                      {store.energyBasis === 'sensor' && (
                        <span className="block text-xs font-normal text-muted-foreground">sensor peralatan</span>
                      )}
                    </td>
                    <td className="p-4 text-center">
                      <StatusBadge
                        status={store.status}
                        isRecording={store.isRecording}
                        recordingSessionName={store.recordingSessionName}
                      />
                    </td>
                    <td className="p-4 text-right">
                      <Link
                        href={`/monitoring/${store.code || store.id}`}
                        className={cn(
                          buttonVariants({ variant: 'ghost', size: 'sm' }),
                          'text-primary'
                        )}
                      >
                        Detail
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
