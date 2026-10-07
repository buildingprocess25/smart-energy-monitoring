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
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  Clock,
  Flame,
  Moon,
  ChevronDown,
  BarChart3,
  Sparkles,
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
import { Store, StoreAnalyticsResult, DailyConsumption, RealMonthlyConsumption } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { TelemetryDatePicker } from '@/components/monitoring/telemetry-date-picker'
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
  
  // 3-Granularity Tabs: 'daily' (24 Jam) | 'weekly' (7 Hari) | 'monthly' (Bulan Riil Tercatat)
  const [activeTab, setActiveTab] = useState<'daily' | 'weekly' | 'monthly'>('daily')
  const [weekOffset, setWeekOffset] = useState<number>(0)
  const [selectedDailyDate, setSelectedDailyDate] = useState<string>('')

  // Available dates for Daily 24h curve selection
  const availableDatesList = useMemo(() => {
    if (analytics?.availableDates && analytics.availableDates.length > 0) {
      return analytics.availableDates
    }
    if (analytics?.dailyConsumption && analytics.dailyConsumption.length > 0) {
      const dates = analytics.dailyConsumption.map((d) => d.dayDate).filter(Boolean) as string[]
      if (dates.length > 0) return Array.from(new Set(dates)).sort().reverse()
    }
    return analytics?.anchorDate ? [analytics.anchorDate] : []
  }, [analytics])

  const currentDateIdx = useMemo(() => {
    const cur = selectedDailyDate || analytics?.anchorDate || ''
    const idx = availableDatesList.indexOf(cur)
    return idx !== -1 ? idx : 0
  }, [selectedDailyDate, analytics?.anchorDate, availableDatesList])

  // Fetch analytics when user selects a different store or selects a date
  useEffect(() => {
    if (!selectedStoreId) return
    if (
      analytics &&
      (analytics.storeCode === selectedStoreId || analytics.storeId === selectedStoreId) &&
      !selectedDailyDate
    ) {
      return
    }

    let isMounted = true
    setIsLoading(true)

    const dateParam = selectedDailyDate ? `?date=${encodeURIComponent(selectedDailyDate)}` : ''
    fetch(`/api/stores/${encodeURIComponent(selectedStoreId)}/overview-analytics${dateParam}`)
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
  }, [selectedStoreId, selectedDailyDate])

  const handleDateSelect = (dateStr: string) => {
    setSelectedDailyDate(dateStr)
  }

  const handleNavigateDate = (newIdx: number) => {
    if (newIdx >= 0 && newIdx < availableDatesList.length) {
      setSelectedDailyDate(availableDatesList[newIdx])
    }
  }

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

  const realMonthlyList = analytics?.monthlyHistory || []
  const monthlySummary = analytics?.monthlySummary

  return (
    <div className="flex flex-col rounded-xl border bg-card p-5 shadow-xs transition-all lg:col-span-8">
      {/* Header Widget */}
      <div className="flex flex-col gap-3 border-b pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Store Selector Dropdown */}
          <div className="relative">
            <select
              value={selectedStoreId}
              onChange={(e) => {
                setSelectedStoreId(e.target.value)
                setSelectedDailyDate('')
              }}
              className="h-9 cursor-pointer appearance-none rounded-lg border bg-background py-1.5 pl-3 pr-8 text-sm font-semibold text-foreground shadow-2xs transition-colors hover:border-emerald-500/50 focus:border-emerald-500 focus:outline-hidden"
              aria-label="Pilih Toko"
            >
              {stores.map((s) => (
                <option key={s.id} value={s.code || s.id}>
                  {s.name} ({s.code}) - {s.status === 'live' ? 'Live' : 'Audit'}
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

        {/* 3 Granularity Switcher Buttons (Harian | Mingguan | Bulanan) */}
        <div className="flex items-center rounded-lg border bg-muted/30 p-0.5 text-xs">
          <button
            type="button"
            onClick={() => setActiveTab('daily')}
            className={cn(
              'flex items-center gap-1.5 rounded-md px-2.5 py-1.5 font-semibold transition-all cursor-pointer',
              activeTab === 'daily'
                ? 'bg-card text-foreground shadow-xs'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            <Zap className="size-3.5 text-amber-500" />
            <span>Harian (24 Jam)</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('weekly')}
            className={cn(
              'flex items-center gap-1.5 rounded-md px-2.5 py-1.5 font-semibold transition-all cursor-pointer',
              activeTab === 'weekly'
                ? 'bg-card text-foreground shadow-xs'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            <Activity className="size-3.5 text-emerald-500" />
            <span>Mingguan (7 Hari)</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('monthly')}
            className={cn(
              'flex items-center gap-1.5 rounded-md px-2.5 py-1.5 font-semibold transition-all cursor-pointer',
              activeTab === 'monthly'
                ? 'bg-card text-foreground shadow-xs'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            <BarChart3 className="size-3.5 text-sky-500" />
            <span>Bulanan (Riil)</span>
          </button>
        </div>
      </div>

      {/* Quick Metrics Bar */}
      {activeTab === 'monthly' ? (
        /* Real Monthly History Specific KPI Badges */
        <div className="mt-3.5 grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3">
          <div className="flex items-center gap-2.5 rounded-lg border bg-muted/20 p-2.5">
            <div className="flex size-7 shrink-0 items-center justify-center rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <TrendingUp className="size-3.5" />
            </div>
            <div>
              <div className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                Total Akumulasi
              </div>
              <div className="text-sm font-bold text-foreground">
                {monthlySummary?.totalKwh.toLocaleString('id-ID') || 0}{' '}
                <span className="text-[10px] font-normal text-muted-foreground">kWh</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5 rounded-lg border bg-muted/20 p-2.5">
            <div className="flex size-7 shrink-0 items-center justify-center rounded bg-blue-500/10 text-blue-600 dark:text-blue-400">
              <Clock className="size-3.5" />
            </div>
            <div>
              <div className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                Rata-rata / Bulan
              </div>
              <div className="text-sm font-bold text-foreground">
                {monthlySummary?.avgMonthlyKwh.toLocaleString('id-ID') || 0}{' '}
                <span className="text-[10px] font-normal text-muted-foreground">kWh</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5 rounded-lg border bg-muted/20 p-2.5">
            <div className="flex size-7 shrink-0 items-center justify-center rounded bg-purple-500/10 text-purple-600 dark:text-purple-400">
              <Calendar className="size-3.5" />
            </div>
            <div>
              <div className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                {monthlySummary?.latestMonthLabel || 'Bulan Terkini'}
              </div>
              <div className="text-sm font-bold text-foreground">
                {monthlySummary?.latestMonthKwh.toLocaleString('id-ID') || 0}{' '}
                <span className="text-[10px] font-normal text-muted-foreground">kWh</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5 rounded-lg border bg-muted/20 p-2.5">
            <div className={cn(
              "flex size-7 shrink-0 items-center justify-center rounded",
              (monthlySummary?.momDiffPct ?? 0) <= 0 
                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                : "bg-amber-500/10 text-amber-600 dark:text-amber-400"
            )}>
              {(monthlySummary?.momDiffPct ?? 0) <= 0 ? <TrendingDown className="size-3.5" /> : <TrendingUp className="size-3.5" />}
            </div>
            <div>
              <div className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                MoM (Bulan Terkini)
              </div>
              <div className={cn(
                "text-sm font-bold",
                (monthlySummary?.momDiffPct ?? 0) <= 0 
                  ? "text-emerald-600 dark:text-emerald-400"
                  : "text-amber-600 dark:text-amber-400"
              )}>
                {monthlySummary?.momDiffPct !== undefined 
                  ? (monthlySummary.momDiffPct > 0 ? `+${monthlySummary.momDiffPct}%` : `${monthlySummary.momDiffPct}%`) 
                  : 'Tercatat Awal'}
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Daily / Weekly Quick Metrics Bar */
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
      )}

      {/* Chart Section */}
      <div className="mt-4 flex-1">
        {isLoading ? (
          <div className="flex h-64 items-center justify-center text-xs text-muted-foreground">
            <span className="size-4 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent mr-2" />
            Memuat data toko...
          </div>
        ) : activeTab === 'daily' ? (
          /* Tab 1: 24-Hour Load Curve (Harian with Interactive Date Picker) */
          <div className="flex flex-col gap-2">
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                <span>Kurva 24 Jam •</span>
                <TelemetryDatePicker
                  selectedDate={selectedDailyDate || analytics?.anchorDate || ''}
                  onDateSelect={handleDateSelect}
                  availableDates={availableDatesList}
                  rangeType="day"
                  onDateShift={(direction) => {
                    if (direction === 'prev') {
                      handleNavigateDate(currentDateIdx + 1)
                    } else {
                      handleNavigateDate(currentDateIdx - 1)
                    }
                  }}
                  canShiftPrev={currentDateIdx < availableDatesList.length - 1}
                  canShiftNext={currentDateIdx > 0}
                />
              </div>

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
                              Waktu: {data.fullTime || data.time} ({analytics?.anchorDateLabel || ''})
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
        ) : activeTab === 'weekly' ? (
          /* Tab 2: 7-Day Daily Consumption Bar Chart (Mingguan) */
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
        ) : (
          /* Tab 3: Real Monthly Consumption History (Bulanan Murni Riil) */
          <div className="flex flex-col gap-2">
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
              <span className="text-muted-foreground">
                Rekaman Riil: <strong>{realMonthlyList.length} Bulan Tercatat</strong> • Total:{' '}
                <strong className="text-foreground font-semibold">
                  {monthlySummary?.totalKwh.toLocaleString('id-ID') || 0} kWh
                </strong>
              </span>

              <div className="flex items-center gap-1.5">
                <Badge variant="outline" className="text-[10.5px] font-medium flex items-center gap-1.5">
                  <span className={cn(
                    "size-1.5 rounded-full",
                    monthlySummary?.trendStatus === 'hemat' ? "bg-emerald-500" : (monthlySummary?.trendStatus === 'waspada' ? "bg-rose-500" : "bg-amber-500")
                  )} />
                  <span>
                    {monthlySummary?.trendStatus === 'hemat' ? 'Tren Konsumsi Efisien' : (monthlySummary?.trendStatus === 'waspada' ? 'Waspada Kenaikan Beban' : 'Tren Konsumsi Stabil')}
                  </span>
                </Badge>
              </div>
            </div>

            <div className="h-60 w-full sm:h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={realMonthlyList}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="currentColor"
                    className="text-border/40"
                  />
                  <XAxis
                    dataKey="monthLabel"
                    tickLine={false}
                    axisLine={false}
                    stroke="currentColor"
                    className="text-xs text-muted-foreground font-semibold"
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
                        const data: RealMonthlyConsumption = payload[0].payload
                        const diff = data.diffPct
                        return (
                          <div className="rounded-lg border bg-popover p-3 text-popover-foreground shadow-md min-w-[200px] space-y-1">
                            <p className="font-bold text-xs text-foreground border-b pb-1">
                              Bulan {data.monthLabel}
                            </p>
                            <p className="mt-1 font-bold text-sm text-emerald-600 dark:text-emerald-400">
                              {data.kwh.toLocaleString('id-ID')} kWh
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Est. Biaya PLN: Rp {data.cost.toLocaleString('id-ID')}
                            </p>
                            {diff !== undefined && (
                              <div className="pt-1 border-t flex items-center justify-between text-[11px]">
                                <span className="text-muted-foreground font-medium">MoM (vs Bulan Lalu):</span>
                                <span className={cn(
                                  "font-bold",
                                  diff <= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"
                                )}>
                                  {diff > 0 ? `+${diff}% (Naik)` : `${diff}% (Turun)`}
                                </span>
                              </div>
                            )}
                          </div>
                        )
                      }
                      return null
                    }}
                  />
                  <Bar
                    dataKey="kwh"
                    fill="#10b981"
                    radius={[6, 6, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Bottom Insight Footer */}
            <div className="mt-1 rounded-lg border border-border/60 bg-muted/20 px-3 py-2 text-[11px] text-muted-foreground flex items-center justify-between flex-wrap gap-2">
              <span className="flex items-center gap-1.5">
                <Sparkles className="size-3.5 text-primary shrink-0" />
                <span>
                  Total Biaya Listrik ({realMonthlyList.length} bulan): <strong>Rp {monthlySummary?.totalCost.toLocaleString('id-ID') || 0}</strong>
                </span>
              </span>
              <span className="text-[10.5px] font-semibold text-foreground">
                Tarif PLN: Rp {PLN_TARIFF_PER_KWH}/kWh
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
