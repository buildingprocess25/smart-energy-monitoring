'use client'

import Link from 'next/link'
import {
  Zap,
  Coins,
  Activity,
  Cpu,
  TrendingUp,
  ArrowRight,
  Building2,
  CheckCircle2,
} from 'lucide-react'
import { Store, StoreAnalyticsResult, MonthlyCostRecord } from '@/lib/types'
import { buttonVariants } from '@/components/ui/button'
import { NetworkMapWidget } from './network-map-widget'
import { StoreAnalyticsWidget } from './store-analytics-widget'
import { MonthlyCostKpiCard } from './monthly-cost-kpi-card'
import { cn } from '@/lib/utils'

interface DashboardOverviewProps {
  stores?: Store[]
  initialStoreAnalytics?: StoreAnalyticsResult | null
  monthlyCosts?: MonthlyCostRecord[]
}

export function DashboardOverview({
  stores = [],
  initialStoreAnalytics = null,
  monthlyCosts = [],
}: DashboardOverviewProps) {
  // Hitung total energi
  const totalKwh = stores.reduce((acc, s) => acc + (s.kwhTotal || 0), 0)
  const liveCount = stores.filter((s) => s.status === 'live').length
  const totalCount = stores.length || 1
  const livePercentage = (liveCount / totalCount) * 100
  const activeDevices = stores.filter((s) => s.status === 'live').reduce(
    (acc, s) => acc + (s.deviceCount || 1),
    0
  )

  // Hitung konsumsi per cabang
  const branchMap: Record<string, number> = {}
  stores.forEach((s) => {
    if (s.branch) {
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
            buttonVariants({ variant: 'default', size: 'sm' }),
            'h-9 gap-1.5 bg-emerald-600 font-semibold text-white shadow-xs hover:bg-emerald-700 dark:bg-emerald-600 dark:hover:bg-emerald-500'
          )}
        >
          Buka Monitoring Toko
          <ArrowRight className="size-3.5" />
        </Link>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* KPI 1 */}
        <div className="flex flex-col justify-between rounded-xl border bg-card p-4 shadow-xs transition-all hover:border-emerald-500/30 hover:shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Total Energi Terpantau
            </span>
            <div className="flex size-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400">
              <Zap className="size-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              {totalKwh.toLocaleString('id-ID', { maximumFractionDigits: 1 })}{' '}
              <span className="text-sm font-normal text-muted-foreground">
                kWh
              </span>
            </div>
            <div className="mt-2 flex items-center gap-1.5 text-xs text-emerald-700 dark:text-emerald-400">
              <TrendingUp className="size-3.5" />
              <span className="font-medium">+3.2% vs pekan lalu</span>
            </div>
          </div>
        </div>

        {/* KPI 2: Estimasi Biaya PLN (Per Bulan dengan Selector & Riwayat) */}
        <MonthlyCostKpiCard
          monthlyCosts={monthlyCosts}
          totalCumulativeKwh={totalKwh}
        />

        {/* KPI 3 */}
        <div className="flex flex-col justify-between rounded-xl border bg-card p-4 shadow-xs transition-all hover:border-blue-500/30 hover:shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Toko Live Monitoring
            </span>
            <div className="flex size-8 items-center justify-center rounded-lg bg-blue-500/10 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
              <Activity className="size-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              {liveCount}{' '}
              <span className="text-sm font-normal text-muted-foreground">
                / {totalCount} Toko
              </span>
            </div>
            <div className="mt-2.5 flex items-center gap-2">
              <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-emerald-500 transition-all duration-500"
                  style={{ width: `${livePercentage}%` }}
                />
              </div>
              <span className="text-[11px] font-semibold text-muted-foreground">
                {livePercentage.toFixed(0)}% Aktif
              </span>
            </div>
          </div>
        </div>

        {/* KPI 4 */}
        <div className="flex flex-col justify-between rounded-xl border bg-card p-4 shadow-xs transition-all hover:border-purple-500/30 hover:shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Sensor ESP32 Aktif
            </span>
            <div className="flex size-8 items-center justify-center rounded-lg bg-purple-500/10 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400">
              <Cpu className="size-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              {activeDevices}{' '}
              <span className="text-sm font-normal text-muted-foreground">
                Perangkat
              </span>
            </div>
            <div className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
              <span className="size-1.5 animate-pulse rounded-full bg-emerald-500" />
              ESP32 Telemetri Realtime
            </div>
          </div>
        </div>
      </div>

      {/* Bento Grid: Charts & Analytics */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Widget Analisis Toko Terpilih (Profil 24 Jam & Tren 7 Hari) */}
        <StoreAnalyticsWidget
          stores={stores}
          initialAnalytics={initialStoreAnalytics}
        />

        {/* Status Perangkat & Distribusi Wilayah (Col 4) */}
        <div className="flex flex-col rounded-xl border bg-card p-5 shadow-xs lg:col-span-4">
          <h2 className="text-base font-semibold text-foreground">
            Distribusi Energi per Cabang
          </h2>
          <p className="text-xs text-muted-foreground">
            Proporsi pemakaian listrik berdasarkan wilayah cabang.
          </p>

          <div className="mt-5 flex flex-1 flex-col justify-around gap-4">
            {branchStats.map((branch) => (
              <div key={branch.name} className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-foreground flex items-center gap-1.5">
                    <Building2 className="size-3.5 text-muted-foreground" />
                    Cabang {branch.name}
                  </span>
                  <span className="font-bold text-foreground">
                    {branch.kwh.toLocaleString('id-ID')} kWh{' '}
                    <span className="font-normal text-muted-foreground">
                      ({branch.percentage.toFixed(1)}%)
                    </span>
                  </span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-emerald-500 transition-all duration-500"
                    style={{ width: `${branch.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 rounded-lg border bg-muted/30 p-3 text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="size-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>Semua data terhubung dengan telemetri live &amp; historis.</span>
            </div>
          </div>
        </div>

        {/* Peta Sebaran Alat IoT Aktif (Col 12) */}
        <div className="lg:col-span-12">
          <NetworkMapWidget stores={stores} />
        </div>

        {/* Toko Konsumsi Tertinggi (Col 12) */}
        <div className="flex flex-col rounded-xl border bg-card shadow-xs lg:col-span-12">
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
              className="text-xs font-semibold text-emerald-600 hover:underline dark:text-emerald-400"
            >
              Lihat Seluruh Toko →
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b bg-muted/40 text-xs font-semibold uppercase text-muted-foreground">
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
                    <td className="p-4 font-mono text-xs font-bold text-muted-foreground">
                      {store.code}
                    </td>
                    <td className="p-4 font-semibold text-foreground">
                      {store.name}
                    </td>
                    <td className="p-4 text-xs text-muted-foreground">
                      Cabang {store.branch}
                    </td>
                    <td className="p-4 text-right font-bold text-foreground">
                      {(store.kwhTotal || 0).toLocaleString('id-ID', { maximumFractionDigits: 1 })} kWh
                    </td>
                    <td className="p-4 text-center">
                      <span
                        className={cn(
                          'inline-flex items-center gap-1 rounded px-2 py-0.5 text-xs font-semibold',
                          store.status === 'live'
                            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                            : 'bg-blue-500/10 text-blue-600 dark:text-blue-400'
                        )}
                      >
                        {store.status === 'live' && (
                          <span className="size-1.5 animate-pulse rounded-full bg-emerald-500" />
                        )}
                        {store.status === 'live' ? 'Live Telemetry' : 'Historical Audit'}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <Link
                        href={`/monitoring/${store.code || store.id}`}
                        className={cn(
                          buttonVariants({ variant: 'ghost', size: 'sm' }),
                          'h-7 text-xs text-emerald-600 hover:text-emerald-700 dark:text-emerald-400'
                        )}
                      >
                        Detail →
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
