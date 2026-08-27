'use client'

import { useState, useMemo, useEffect } from 'react'
import Link from 'next/link'
import {
  Zap,
  Activity,
  Calendar,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Building2,
  TrendingUp,
  ArrowUpRight,
  Clock,
  Flame,
  Moon,
  ChevronDown,
} from 'lucide-react'
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { Store, StoreAnalyticsResult, DailyConsumption } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const PLN_TARIFF_PER_KWH = 1444.7

const ID_DAYS_SHORT = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab']
const ID_DAYS_FULL = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu']
const ID_MONTHS_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des']
const ID_MONTHS_FULL = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
]

function formatDateToIso(d: Date): string {
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function CustomXAxisTick({ x, y, payload }: any) {
  const label: string = payload?.value || ''
  const match = label.match(/^([A-Za-z]+)\s*\((.+)\)$/)
  const day = match ? match[1] : label
  const date = match ? match[2] : ''

  return (
    <g transform={`translate(${x},${y})`}>
      <text
        x={0}
        y={0}
        dy={10}
        textAnchor="middle"
        className="fill-foreground/85 text-[11px] font-semibold tracking-tight select-none"
      >
        {day}
      </text>
      {date && (
        <text
          x={0}
          y={0}
          dy={23}
          textAnchor="middle"
          className="fill-muted-foreground/80 font-mono text-[9.5px] font-medium tracking-tighter select-none"
        >
          {date}
        </text>
      )}
    </g>
  )
}

interface StoreAnalyticsWidgetProps {
  stores: Store[]
  initialAnalytics: StoreAnalyticsResult | null
}

export function StoreAnalyticsWidget({
  stores,
  initialAnalytics,
}: StoreAnalyticsWidgetProps) {
  const [selectedStoreId, setSelectedStoreId] = useState<string>(
    initialAnalytics?.storeCode || initialAnalytics?.storeId || stores[0]?.code || ''
  )
  const [analytics, setAnalytics] = useState<StoreAnalyticsResult | null>(initialAnalytics)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [activeTab, setActiveTab] = useState<'loadProfile' | 'dailyTrend'>('loadProfile')
  const [weekOffset, setWeekOffset] = useState<number>(0)

  // Fetch analytics when user selects a different store
  useEffect(() => {
    if (!selectedStoreId) return
    if (analytics && (analytics.storeCode === selectedStoreId || analytics.storeId === selectedStoreId)) {
      return
    }

    let isMounted = true
    setIsLoading(true)
    setWeekOffset(0)

    fetch(`/api/stores/${encodeURIComponent(selectedStoreId)}/overview-analytics`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load store analytics')
        return res.json()
      })
      .then((data: StoreAnalyticsResult) => {
        if (isMounted) {
          setAnalytics(data)
          setIsLoading(false)
        }
      })
      .catch((err) => {
        console.error(err)
        if (isMounted) setIsLoading(false)
      })

    return () => {
      isMounted = false
    }
  }, [selectedStoreId, analytics])

  // Map daily consumption from store data
  const dbDataMap = useMemo(() => {
    const map = new Map<string, DailyConsumption>()
    if (analytics?.dailyConsumption) {
      analytics.dailyConsumption.forEach((item) => {
        if (item.dayDate) {
          map.set(item.dayDate, item)
        }
      })
    }
    return map
  }, [analytics])

  // Calculate 7-day sliding window anchored to store's anchorDate
  const { displayedTrend, periodLabel, windowTotalKwh } = useMemo(() => {
    const baseAnchorStr = analytics?.anchorDate || '2026-08-26'
    const parts = baseAnchorStr.split('-')
    const baseAnchor =
      parts.length === 3
        ? new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10))
        : new Date()

    // Shift anchor by weekOffset * 7 days
    const currentAnchor = new Date(baseAnchor)
    currentAnchor.setDate(baseAnchor.getDate() - weekOffset * 7)

    const trend: DailyConsumption[] = []
    let sumKwh = 0

    for (let i = 6; i >= 0; i--) {
      const cur = new Date(currentAnchor)
      cur.setDate(currentAnchor.getDate() - i)

      const isoDate = formatDateToIso(cur)
      const dayIdx = cur.getDay()
      const d = cur.getDate()
      const m = cur.getMonth()
      const y = cur.getFullYear()
      const dd = String(d).padStart(2, '0')
      const mm = String(m + 1).padStart(2, '0')

      const shortDay = ID_DAYS_SHORT[dayIdx]
      const fullDay = ID_DAYS_FULL[dayIdx]
      const dayLabel = `${shortDay} (${dd}/${mm})`
      const dayFullDate = `${fullDay}, ${d} ${ID_MONTHS_FULL[m]} ${y}`

      let kwh = 0
      if (dbDataMap.has(isoDate)) {
        kwh = dbDataMap.get(isoDate)!.kwh
      }

      sumKwh += kwh

      trend.push({
        day: shortDay,
        dayDate: isoDate,
        dayLabel,
        dayFullDate,
        kwh,
        cost: Math.round(kwh * PLN_TARIFF_PER_KWH),
      })
    }

    const startDate = new Date(currentAnchor)
    startDate.setDate(currentAnchor.getDate() - 6)
    const startStr = `${startDate.getDate()} ${ID_MONTHS_SHORT[startDate.getMonth()]} ${startDate.getFullYear()}`
    const endStr = `${currentAnchor.getDate()} ${ID_MONTHS_SHORT[currentAnchor.getMonth()]} ${currentAnchor.getFullYear()}`
    const period = `${startStr} – ${endStr}`

    return {
      displayedTrend: trend,
      periodLabel: period,
      windowTotalKwh: Math.round(sumKwh * 10) / 10,
    }
  }, [analytics, weekOffset, dbDataMap])

  const selectedStore = stores.find(
    (s) => s.code === selectedStoreId || s.id === selectedStoreId
  ) || stores[0]

  const peakKw = analytics?.peakPowerWatts ? (analytics.peakPowerWatts / 1000).toFixed(2) : '0.00'
  const avgKw = analytics?.avgPowerWatts ? (analytics.avgPowerWatts / 1000).toFixed(2) : '0.00'
  const baseKw = analytics?.basePowerWatts ? (analytics.basePowerWatts / 1000).toFixed(2) : '0.00'

  return (
    <div className="flex flex-col rounded-xl border bg-card p-5 shadow-xs transition-all lg:col-span-8">
      {/* Header Widget */}
      <div className="flex flex-col gap-3 border-b pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Store Selector Dropdown */}
          <div className="relative">
            <select
              value={selectedStoreId}
              onChange={(e) => setSelectedStoreId(e.target.value)}
              className="h-9 cursor-pointer appearance-none rounded-lg border bg-background py-1.5 pl-3 pr-8 text-sm font-semibold text-foreground shadow-2xs transition-colors hover:border-emerald-500/50 focus:border-emerald-500 focus:outline-hidden"
              aria-label="Pilih Toko"
            >
              {stores.map((s) => (
                <option key={s.id} value={s.code || s.id}>
                  {s.name} ({s.code}) - {s.status === 'live' ? '🟢 Live' : '🔵 Audit'}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          </div>

          {/* Status Badge & Link */}
          <div className="flex items-center gap-1.5">
            <span
              className={cn(
                'inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-semibold',
                analytics?.isLive
                  ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400'
                  : 'bg-blue-500/10 text-blue-700 dark:text-blue-400'
              )}
            >
              {analytics?.isLive && (
                <span className="size-1.5 animate-pulse rounded-full bg-emerald-500" />
              )}
              {analytics?.isLive ? 'Live IoT' : `Audit: ${analytics?.anchorDateLabel || 'Selesai'}`}
            </span>

            <Link
              href={`/monitoring/${analytics?.storeCode || selectedStore?.code || ''}`}
              className="inline-flex items-center gap-0.5 text-xs font-semibold text-emerald-600 hover:underline dark:text-emerald-400"
            >
              Detail Toko
              <ArrowUpRight className="size-3.5" />
            </Link>
          </div>
        </div>

        {/* Tab Mode Buttons */}
        <div className="flex items-center rounded-lg border bg-muted/30 p-0.5 text-xs">
          <button
            type="button"
            onClick={() => setActiveTab('loadProfile')}
            className={cn(
              'flex items-center gap-1.5 rounded-md px-2.5 py-1.5 font-semibold transition-all',
              activeTab === 'loadProfile'
                ? 'bg-card text-foreground shadow-xs'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            <Zap className="size-3.5 text-amber-500" />
            Profil 24 Jam
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('dailyTrend')}
            className={cn(
              'flex items-center gap-1.5 rounded-md px-2.5 py-1.5 font-semibold transition-all',
              activeTab === 'dailyTrend'
                ? 'bg-card text-foreground shadow-xs'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            <Activity className="size-3.5 text-emerald-500" />
            Tren 7 Hari (kWh)
          </button>
        </div>
      </div>

      {/* Quick Metrics Bar */}
      <div className="mt-3.5 grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3">
        <div className="flex items-center gap-2.5 rounded-lg border bg-muted/20 p-2.5">
          <div className="flex size-7 shrink-0 items-center justify-center rounded bg-amber-500/10 text-amber-600 dark:text-amber-400">
            <Flame className="size-3.5" />
          </div>
          <div>
            <div className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
              Beban Puncak
            </div>
            <div className="text-sm font-bold text-foreground">
              {peakKw} <span className="text-[10px] font-normal text-muted-foreground">kW</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5 rounded-lg border bg-muted/20 p-2.5">
          <div className="flex size-7 shrink-0 items-center justify-center rounded bg-blue-500/10 text-blue-600 dark:text-blue-400">
            <Clock className="size-3.5" />
          </div>
          <div>
            <div className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
              Rata-rata Beban
            </div>
            <div className="text-sm font-bold text-foreground">
              {avgKw} <span className="text-[10px] font-normal text-muted-foreground">kW</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5 rounded-lg border bg-muted/20 p-2.5">
          <div className="flex size-7 shrink-0 items-center justify-center rounded bg-purple-500/10 text-purple-600 dark:text-purple-400">
            <Moon className="size-3.5" />
          </div>
          <div>
            <div className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
              Beban Dasar
            </div>
            <div className="text-sm font-bold text-foreground">
              {baseKw} <span className="text-[10px] font-normal text-muted-foreground">kW</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5 rounded-lg border bg-muted/20 p-2.5">
          <div className="flex size-7 shrink-0 items-center justify-center rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            <TrendingUp className="size-3.5" />
          </div>
          <div>
            <div className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
              Total Periode
            </div>
            <div className="text-sm font-bold text-foreground">
              {windowTotalKwh.toLocaleString('id-ID')}{' '}
              <span className="text-[10px] font-normal text-muted-foreground">kWh</span>
            </div>
          </div>
        </div>
      </div>

      {/* Chart Section */}
      <div className="mt-4 flex-1">
        {isLoading ? (
          <div className="flex h-64 items-center justify-center text-xs text-muted-foreground">
            <span className="size-4 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent mr-2" />
            Memuat data toko...
          </div>
        ) : activeTab === 'loadProfile' ? (
          /* Tab 1: 24-Hour Load Curve */
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>
                Kurva fluktuasi daya 24 jam •{' '}
                <strong className="text-foreground font-semibold">
                  {analytics?.anchorDateLabel || 'Rekaman Terakhir'}
                </strong>
              </span>
              <span className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
                Puncak: {peakKw} kW
              </span>
            </div>

            <div className="h-60 w-full sm:h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={analytics?.loadProfile24h || []}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="emeraldLoadGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="currentColor"
                    className="text-border/40"
                  />
                  <XAxis
                    dataKey="time"
                    tickLine={false}
                    axisLine={false}
                    stroke="currentColor"
                    className="text-xs text-muted-foreground font-mono"
                    interval={3}
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    stroke="currentColor"
                    className="text-xs text-muted-foreground font-mono"
                    tickFormatter={(val) => `${val}W`}
                  />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload
                        return (
                          <div className="rounded-lg border bg-popover p-3 text-popover-foreground shadow-md">
                            <p className="font-semibold text-xs text-muted-foreground">
                              Waktu: {data.fullTime || data.time}
                            </p>
                            <p className="mt-1 font-bold text-sm text-emerald-600 dark:text-emerald-400">
                              {data.powerKw} kW ({data.powerWatts.toLocaleString('id-ID')} W)
                            </p>
                            <p className="text-[11px] text-muted-foreground">
                              Est. Biaya: Rp{' '}
                              {Math.round(
                                (data.powerKw * PLN_TARIFF_PER_KWH)
                              ).toLocaleString('id-ID')}
                              /jam
                            </p>
                          </div>
                        )
                      }
                      return null
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="powerWatts"
                    stroke="#10b981"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#emeraldLoadGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        ) : (
          /* Tab 2: 7-Day Daily Consumption Bar Chart */
          <div className="flex flex-col gap-2">
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
              <span className="text-muted-foreground">
                Konsumsi harian 7 hari • Total:{' '}
                <strong className="text-foreground font-semibold">
                  {windowTotalKwh.toLocaleString('id-ID')} kWh
                </strong>
              </span>

              {/* Slider / Window Navigation Controls */}
              <div className="flex items-center gap-1.5">
                <Button
                  variant="outline"
                  size="icon-sm"
                  onClick={() => setWeekOffset((prev) => prev + 1)}
                  title="7 Hari Sebelumnya (Mundur)"
                  aria-label="7 Hari Sebelumnya"
                >
                  <ChevronLeft className="size-4" />
                </Button>

                <div className="flex items-center gap-1.5 rounded-md border bg-muted/40 px-2.5 py-1 text-xs font-semibold text-foreground shadow-2xs">
                  <Calendar className="size-3.5 text-muted-foreground" />
                  <span>{periodLabel}</span>
                </div>

                <Button
                  variant="outline"
                  size="icon-sm"
                  disabled={weekOffset === 0}
                  onClick={() => setWeekOffset((prev) => Math.max(0, prev - 1))}
                  title="7 Hari Berikutnya (Maju)"
                  aria-label="7 Hari Berikutnya"
                >
                  <ChevronRight className="size-4" />
                </Button>

                {weekOffset > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setWeekOffset(0)}
                    className="h-8 gap-1 px-2 text-xs font-medium text-emerald-600 hover:text-emerald-700 dark:text-emerald-400"
                    title="Kembali ke 7 Hari Terkini Toko Ini"
                  >
                    <RotateCcw className="size-3.5" />
                    Terkini
                  </Button>
                )}
              </div>
            </div>

            <div className="h-60 w-full sm:h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={displayedTrend}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="currentColor"
                    className="text-border/40"
                  />
                  <XAxis
                    dataKey="dayLabel"
                    tickLine={false}
                    axisLine={false}
                    tick={<CustomXAxisTick />}
                    interval={0}
                    height={38}
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    stroke="currentColor"
                    className="text-xs text-muted-foreground font-mono"
                    tickFormatter={(val) => `${val}`}
                  />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload
                        return (
                          <div className="rounded-lg border bg-popover p-3 text-popover-foreground shadow-md">
                            <p className="font-semibold text-xs text-muted-foreground">
                              {data.dayFullDate || data.day}
                            </p>
                            <p className="mt-1 font-bold text-sm text-emerald-600 dark:text-emerald-400">
                              {data.kwh.toLocaleString('id-ID', { maximumFractionDigits: 1 })}{' '}
                              kWh
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Est. Biaya PLN: Rp {data.cost.toLocaleString('id-ID')}
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
        )}
      </div>
    </div>
  )
}
