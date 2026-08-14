import { Zap, Coins, Activity, Cpu, TrendingUp } from 'lucide-react'
import { Store } from '@/lib/types'

interface DashboardKpiSummaryProps {
  stores: Store[]
}

// Tarif Dasar Listrik PLN B2/TR Bisnis Retail (Rp/kWh)
const PLN_TARIFF_PER_KWH = 1444.7

export function DashboardKpiSummary({ stores }: DashboardKpiSummaryProps) {
  // 1. Total Energi Terukur (kWh)
  const totalKwh = stores.reduce((acc, s) => acc + (s.kwhTotal || 0), 0)

  // 2. Estimasi Biaya Listrik (Rp)
  const totalCost = totalKwh * PLN_TARIFF_PER_KWH

  // 3. Toko Live Monitoring
  const liveStoresCount = stores.filter((s) => s.status === 'live').length
  const totalStoresCount = stores.length
  const livePercentage =
    totalStoresCount > 0 ? (liveStoresCount / totalStoresCount) * 100 : 0

  // 4. Total Perangkat IoT Aktif
  const totalDevices = stores
    .filter((s) => s.status === 'live')
    .reduce((acc, s) => acc + (s.deviceCount || 0), 0)

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {/* KPI 1: Total Energi */}
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
            {totalKwh.toLocaleString('id-ID', {
              maximumFractionDigits: 1,
            })}{' '}
            <span className="text-sm font-normal text-muted-foreground">
              kWh
            </span>
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-xs text-emerald-700 dark:text-emerald-400">
            <TrendingUp className="size-3.5" />
            <span className="font-medium">Akumulasi seluruh sesi</span>
          </div>
        </div>
      </div>

      {/* KPI 2: Estimasi Biaya Listrik */}
      <div className="flex flex-col justify-between rounded-xl border bg-card p-4 shadow-xs transition-all hover:border-amber-500/30 hover:shadow-sm">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Estimasi Biaya Energi
          </span>
          <div className="flex size-8 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400">
            <Coins className="size-4" />
          </div>
        </div>
        <div className="mt-3">
          <div className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Rp{' '}
            {totalCost.toLocaleString('id-ID', {
              maximumFractionDigits: 0,
            })}
          </div>
          <div className="mt-2 text-xs text-muted-foreground">
            Tarif PLN B2/TR (Rp 1.444,7/kWh)
          </div>
        </div>
      </div>

      {/* KPI 3: Toko Live Monitoring */}
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
            {liveStoresCount}{' '}
            <span className="text-sm font-normal text-muted-foreground">
              / {totalStoresCount} Toko
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

      {/* KPI 4: Perangkat IoT Terpasang */}
      <div className="flex flex-col justify-between rounded-xl border bg-card p-4 shadow-xs transition-all hover:border-purple-500/30 hover:shadow-sm">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Sensor IoT Live
          </span>
          <div className="flex size-8 items-center justify-center rounded-lg bg-purple-500/10 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400">
            <Cpu className="size-4" />
          </div>
        </div>
        <div className="mt-3">
          <div className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            {totalDevices}{' '}
            <span className="text-sm font-normal text-muted-foreground">
              Perangkat
            </span>
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
            <span className="size-1.5 animate-pulse rounded-full bg-emerald-500" />
            ESP32 Smart Energy Meter
          </div>
        </div>
      </div>
    </div>
  )
}
