'use client'

import Link from 'next/link'
import {
  Zap,
  Coins,
  Activity,
  Cpu,
  TrendingUp,
  ArrowRight,
  AlertTriangle,
  Building2,
  CheckCircle2,
} from 'lucide-react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { MOCK_STORES } from '@/lib/mock-data'
import { buttonVariants } from '@/components/ui/button'
import { NetworkMapWidget } from './network-map-widget'
import { cn } from '@/lib/utils'

// Data Tren Konsumsi 7 Hari Terakhir (kWh)
const CONSUMPTION_TREND_DATA = [
  { day: 'Sen', kwh: 1240, cost: 1791428 },
  { day: 'Sel', kwh: 1480, cost: 2138156 },
  { day: 'Rab', kwh: 1390, cost: 2008133 },
  { day: 'Kam', kwh: 1560, cost: 2253732 },
  { day: 'Jum', kwh: 1620, cost: 2340414 },
  { day: 'Sab', kwh: 1840, cost: 2658248 },
  { day: 'Min', kwh: 1910, cost: 2759377 },
]

// Data Toko Konsumsi Tertinggi (High Consumption)
const TOP_CONSUMING_STORES = [
  {
    code: 'TK003',
    name: 'Alfamart BSD Sektor 7',
    branch: 'Tangerang 2',
    kwh: 3456.2,
    spike: '+24%',
    status: 'warning',
  },
  {
    code: 'TK002',
    name: 'Alfamart Exit Tol Jelupang',
    branch: 'Tangerang 1',
    kwh: 2103.7,
    spike: '+12%',
    status: 'normal',
  },
  {
    code: 'TK004',
    name: 'Alfamart Ciputat Timur',
    branch: 'Jakarta Selatan',
    kwh: 1928.4,
    spike: '+8%',
    status: 'normal',
  },
  {
    code: 'TK001',
    name: 'Alfamart Pondok Kacang 3',
    branch: 'Tangerang 1',
    kwh: 1842.5,
    spike: '+4%',
    status: 'normal',
  },
]

const PLN_TARIFF_PER_KWH = 1444.7

export function DashboardOverview() {
  // Hitung total energi
  const totalKwh = MOCK_STORES.reduce((acc, s) => acc + (s.kwhTotal || 0), 0)
  const totalCost = totalKwh * PLN_TARIFF_PER_KWH
  const liveCount = MOCK_STORES.filter((s) => s.status === 'live').length
  const totalCount = MOCK_STORES.length
  const livePercentage = (liveCount / totalCount) * 100
  const activeDevices = MOCK_STORES.filter((s) => s.status === 'live').reduce(
    (acc, s) => acc + s.deviceCount,
    0
  )

  // Hitung konsumsi per cabang
  const branchMap: Record<string, number> = {}
  MOCK_STORES.forEach((s) => {
    if (s.branch) {
      branchMap[s.branch] = (branchMap[s.branch] || 0) + s.kwhTotal
    }
  })

  const branchStats = Object.entries(branchMap).map(([name, kwh]) => ({
    name,
    kwh,
    percentage: totalKwh > 0 ? (kwh / totalKwh) * 100 : 0,
  }))

  return (
    <div className="flex flex-col gap-6">
      {/* Top Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Dashboard Eksekutif Energi
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

        {/* KPI 2 */}
        <div className="flex flex-col justify-between rounded-xl border bg-card p-4 shadow-xs transition-all hover:border-amber-500/30 hover:shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Estimasi Biaya PLN
            </span>
            <div className="flex size-8 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400">
              <Coins className="size-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Rp {totalCost.toLocaleString('id-ID', { maximumFractionDigits: 0 })}
            </div>
            <div className="mt-2 text-xs text-muted-foreground">
              Tarif PLN B2/TR (Rp 1.444,7/kWh)
            </div>
          </div>
        </div>

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
        {/* Tren Konsumsi Energi 7 Hari (Col 8) */}
        <div className="flex flex-col rounded-xl border bg-card p-5 shadow-xs lg:col-span-8">
          <div className="flex items-center justify-between border-b pb-4">
            <div>
              <h2 className="text-base font-semibold text-foreground">
                Tren Konsumsi Energi Harian
              </h2>
              <p className="text-xs text-muted-foreground">
                Akumulasi konsumsi listrik seluruh cabang selama 7 hari terakhir.
              </p>
            </div>
            <span className="rounded-md bg-muted px-2.5 py-1 text-xs font-semibold text-muted-foreground">
              7 Hari Terakhir
            </span>
          </div>

          <div className="mt-4 h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={CONSUMPTION_TREND_DATA}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="currentColor"
                  className="text-border/40"
                />
                <XAxis
                  dataKey="day"
                  tickLine={false}
                  axisLine={false}
                  stroke="currentColor"
                  className="text-xs text-muted-foreground"
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  stroke="currentColor"
                  className="text-xs text-muted-foreground"
                  tickFormatter={(val) => `${val}`}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload
                      return (
                        <div className="rounded-lg border bg-popover p-3 text-popover-foreground shadow-md">
                          <p className="font-semibold text-xs text-muted-foreground">
                            Hari: {data.day}
                          </p>
                          <p className="mt-1 font-bold text-sm text-emerald-600 dark:text-emerald-400">
                            {data.kwh} kWh
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Est. Biaya: Rp {data.cost.toLocaleString('id-ID')}
                          </p>
                        </div>
                      )
                    }
                    return null
                  }}
                />
                <Bar
                  dataKey="kwh"
                  fill="currentColor"
                  className="fill-emerald-600 hover:fill-emerald-500 dark:fill-emerald-500"
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

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
          <NetworkMapWidget />
        </div>

        {/* Toko Konsumsi Tertinggi (Col 12) */}
        <div className="flex flex-col rounded-xl border bg-card shadow-xs lg:col-span-12">
          <div className="flex items-center justify-between border-b p-5">
            <div>
              <h2 className="text-base font-semibold text-foreground">
                Toko dengan Beban Konsumsi Terbesar
              </h2>
              <p className="text-xs text-muted-foreground">
                Daftar toko dengan total kWh tertinggi yang memerlukan perhatian efisiensi.
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
                  <th className="p-4 text-center">Lonjakan</th>
                  <th className="p-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {TOP_CONSUMING_STORES.map((store) => (
                  <tr
                    key={store.code}
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
                      {store.kwh.toLocaleString('id-ID')} kWh
                    </td>
                    <td className="p-4 text-center">
                      <span
                        className={cn(
                          'inline-flex items-center gap-1 rounded px-2 py-0.5 text-xs font-semibold',
                          store.status === 'warning'
                            ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                            : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                        )}
                      >
                        {store.status === 'warning' && (
                          <AlertTriangle className="size-3" />
                        )}
                        {store.spike}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <Link
                        href="/monitoring"
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
