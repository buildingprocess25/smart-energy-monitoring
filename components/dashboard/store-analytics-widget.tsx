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
  BarChart3,
  Sparkles,
} from 'lucide-react'
import { Store, StoreAnalyticsResult, DailyConsumption } from '@/lib/types'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { TelemetryDatePicker } from '@/components/monitoring/telemetry-date-picker'
import {
  EnergyChart,
  EnergyChartControls,
  formatRupiah,
  type EnergyChartType,
  type EnergyRow,
  type EnergyUnit,
} from '@/components/analytics/energy-chart'
import { LoadProfileChart, spikeText } from '@/components/analytics/load-profile-chart'
import { PeriodSummary } from '@/components/analytics/period-summary'
import { usagePeriod } from '@/lib/usage-period'
import { PLN_TARIFF_PER_KWH } from '@/lib/usage-insights'
import { cn } from '@/lib/utils'

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
  const date = match ? match[2].slice(0, 2) : ''

  return (
    <g transform={`translate(${x},${y})`}>
      <text
        x={0}
        y={0}
        dy={10}
        textAnchor="middle"
        className="fill-foreground/85 text-xs font-semibold tracking-tight select-none"
      >
        {day}
      </text>
      {date && (
        <text
          x={0}
          y={0}
          dy={23}
          textAnchor="middle"
          className="fill-muted-foreground/80 tabular-nums text-xs font-medium tracking-tighter select-none"
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

function formatKw(watts: number | undefined): string {
  return watts ? (watts / 1000).toLocaleString('id-ID', { maximumFractionDigits: 2 }) : '-'
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
  const [chartUnit, setChartUnit] = useState<EnergyUnit>('kwh')
  const [chartType, setChartType] = useState<EnergyChartType>('bar')
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
        if (!isMounted) return
        // Never leave another store's numbers under the chosen name.
        setAnalytics((shown) =>
          shown?.storeCode === selectedStoreId || shown?.storeId === selectedStoreId ? shown : null
        )
        setIsLoading(false)
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
    const todayJakarta = new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Jakarta' })
    const baseAnchorStr = analytics?.anchorDate || todayJakarta
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

  const peakKw = formatKw(analytics?.peakPowerWatts)
  const avgKw = formatKw(analytics?.avgPowerWatts)
  const baseKw = formatKw(analytics?.basePowerWatts)

  const realMonthlyList = analytics?.monthlyHistory || []
  const monthlySummary = analytics?.monthlySummary
  const sangatBoros = analytics?.sangatBoros || null

  const hasMainPanel = analytics?.hasMainPanel ?? false
  const activeUnit: EnergyUnit = hasMainPanel ? chartUnit : 'kwh'
  const threshold = analytics?.threshold ?? null
  const dailyLimit = threshold && {
    kwh: threshold.kwhPerDay,
    label: threshold.source === 'standard' ? 'Standar SPARTA' : '120% dari hari biasa toko ini',
  }
  const monthlyLimit =
    hasMainPanel && sangatBoros ? { kwh: sangatBoros.store.standardKwhPerMonth, label: 'Standar SPARTA' } : null
  const weeklyRows: EnergyRow[] = displayedTrend.map((d) => {
    const recorded = dbDataMap.get(d.dayDate)
    return {
      label: d.dayLabel || d.day,
      title: d.dayFullDate || d.dayDate,
      kwh: recorded && (recorded.hours ?? 0) > 0 ? recorded.kwh : null,
      mainKwh: recorded?.mainPanelKwh ?? 0,
    }
  })
  const monthlyRows: EnergyRow[] = realMonthlyList.map((m) => ({
    label: m.monthLabel,
    title: m.monthLabel,
    kwh: m.kwh,
    mainKwh: m.mainPanelKwh ?? 0,
    diffPct: m.diffPct,
  }))
  const period = usagePeriod(
    activeTab,
    (analytics?.dailyConsumption || []).map((d) => ({
      date: d.dayDate,
      kwh: d.kwh,
      mainKwh: d.mainPanelKwh ?? 0,
      hours: d.hours ?? 0,
    })),
    analytics?.anchorDate || '',
    weekOffset,
    { day: analytics?.anchorDateLabel || '', week: periodLabel }
  )
  const chartControls = (
    <EnergyChartControls
      unit={activeUnit}
      onUnitChange={setChartUnit}
      type={chartType}
      onTypeChange={setChartType}
      hasMainPanel={hasMainPanel}
    />
  )

  return (
    <div className="flex flex-col min-w-0 rounded-2xl bg-card ring-1 ring-foreground/10 p-5 transition-all lg:col-span-8">
      {/* Header Widget */}
      <div className="flex flex-col items-start gap-3 border-b pb-4 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Store Selector Dropdown */}
          <Select
            items={stores.map((s) => ({ value: s.code || s.id, label: `${s.name} (${s.code}) - ${s.status === 'live' ? 'Live' : 'Audit'}` }))}
            value={selectedStoreId}
            onValueChange={(next) => {
              if (next === null) return
              setSelectedStoreId(next)
              setSelectedDailyDate('')
            }}
          >
            <SelectTrigger aria-label="Pilih Toko" className="max-w-full font-semibold">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {stores.map((s) => (
                  <SelectItem key={s.id} value={s.code || s.id}>
                    {s.name} ({s.code}) - {s.status === 'live' ? 'Live' : 'Audit'}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>

          {/* Status Badge & Link */}
          <div className="flex items-center gap-1.5">
            <span
              className={cn(
                'inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-semibold',
                analytics?.isLive
                  ? 'bg-primary/10 text-primary'
                  : 'bg-muted text-muted-foreground'
              )}
            >
              {analytics?.isLive && (
                <span className="size-1.5 rounded-full bg-primary" />
              )}
              {analytics?.isLive ? 'Live IoT' : `Audit: ${analytics?.anchorDateLabel || 'Selesai'}`}
            </span>

            <Link
              href={`/monitoring/${analytics?.storeCode || selectedStore?.code || ''}`}
              className="inline-flex items-center gap-0.5 text-xs font-semibold text-primary hover:underline"
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
            <Zap className="size-3.5 text-warning" />
            <span>Harian</span>
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
            <Activity className="size-3.5 text-primary" />
            <span>Mingguan</span>
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
            <BarChart3 className="size-3.5 text-muted-foreground" />
            <span>Bulanan</span>
          </button>
        </div>
      </div>

      {/* Quick Metrics Bar */}
      {activeTab === 'monthly' ? (
        /* Real Monthly History Specific KPI Badges */
        <div className="mt-3.5 grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3">
          <div className="flex items-center gap-2.5 rounded-lg border bg-muted/20 p-2.5">
            <div className="flex size-7 shrink-0 items-center justify-center rounded bg-primary/10 text-primary">
              <TrendingUp className="size-3.5" />
            </div>
            <div>
              <div className="text-xs font-medium text-muted-foreground">
                Total Akumulasi
              </div>
              <div className="text-sm font-bold text-foreground">
                {monthlySummary?.totalKwh.toLocaleString('id-ID') || 0}{' '}
                <span className="text-xs font-normal text-muted-foreground">kWh</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5 rounded-lg border bg-muted/20 p-2.5">
            <div className="flex size-7 shrink-0 items-center justify-center rounded bg-muted text-muted-foreground">
              <Clock className="size-3.5" />
            </div>
            <div>
              <div className="text-xs font-medium text-muted-foreground">
                Rata-rata / Bulan
              </div>
              <div className="text-sm font-bold text-foreground">
                {monthlySummary?.avgMonthlyKwh.toLocaleString('id-ID') || 0}{' '}
                <span className="text-xs font-normal text-muted-foreground">kWh</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5 rounded-lg border bg-muted/20 p-2.5">
            <div className="flex size-7 shrink-0 items-center justify-center rounded bg-muted text-muted-foreground">
              <Calendar className="size-3.5" />
            </div>
            <div>
              <div className="text-xs font-medium text-muted-foreground">
                {monthlySummary?.latestMonthLabel || 'Bulan Terkini'}
              </div>
              <div className="text-sm font-bold text-foreground">
                {monthlySummary?.latestMonthKwh.toLocaleString('id-ID') || 0}{' '}
                <span className="text-xs font-normal text-muted-foreground">kWh</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5 rounded-lg border bg-muted/20 p-2.5">
            <div className={cn(
              "flex size-7 shrink-0 items-center justify-center rounded",
              (monthlySummary?.momDiffPct ?? 0) <= 0 
                ? "bg-primary/10 text-primary"
                : "bg-warning/10 text-warning"
            )}>
              {(monthlySummary?.momDiffPct ?? 0) <= 0 ? <TrendingDown className="size-3.5" /> : <TrendingUp className="size-3.5" />}
            </div>
            <div>
              <div className="text-xs font-medium text-muted-foreground">
                MoM (Bulan Terkini)
              </div>
              <div className={cn(
                "text-sm font-bold",
                (monthlySummary?.momDiffPct ?? 0) <= 0 
                  ? "text-primary"
                  : "text-warning"
              )}>
                {monthlySummary?.momDiffPct !== undefined 
                  ? (monthlySummary.momDiffPct > 0 ? `+${monthlySummary.momDiffPct}%` : `${monthlySummary.momDiffPct}%`) 
                  : 'Tercatat Awal'}
              </div>
            </div>
          </div>
        </div>
      ) : activeTab === 'daily' ? (
        <div className="mt-3.5 grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3">
          <div className="flex items-center gap-2.5 rounded-lg border bg-muted/20 p-2.5">
            <div className="flex size-7 shrink-0 items-center justify-center rounded bg-warning/10 text-warning">
              <Flame className="size-3.5" />
            </div>
            <div>
              <div className="text-xs font-medium text-muted-foreground">
                Beban Puncak
              </div>
              <div className="text-sm font-bold text-foreground">
                {peakKw} <span className="text-xs font-normal text-muted-foreground">kW</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5 rounded-lg border bg-muted/20 p-2.5">
            <div className="flex size-7 shrink-0 items-center justify-center rounded bg-muted text-muted-foreground">
              <Clock className="size-3.5" />
            </div>
            <div>
              <div className="text-xs font-medium text-muted-foreground">
                Rata-rata Beban
              </div>
              <div className="text-sm font-bold text-foreground">
                {avgKw} <span className="text-xs font-normal text-muted-foreground">kW</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5 rounded-lg border bg-muted/20 p-2.5">
            <div className="flex size-7 shrink-0 items-center justify-center rounded bg-muted text-muted-foreground">
              <Moon className="size-3.5" />
            </div>
            <div>
              <div className="text-xs font-medium text-muted-foreground">
                Beban Dasar
              </div>
              <div className="text-sm font-bold text-foreground">
                {baseKw} <span className="text-xs font-normal text-muted-foreground">kW</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5 rounded-lg border bg-muted/20 p-2.5">
            <div className="flex size-7 shrink-0 items-center justify-center rounded bg-primary/10 text-primary">
              <TrendingUp className="size-3.5" />
            </div>
            <div>
              <div className="text-xs font-medium text-muted-foreground">
                Lonjakan 24 Jam
              </div>
              <div className="text-sm font-bold text-foreground">
                {spikeText(analytics?.loadProfile24h || [])}
              </div>
            </div>
          </div>
        </div>
      ) : null}

      <PeriodSummary {...period} hasMainPanel={hasMainPanel} />

      {/* Chart Section */}
      <div className="mt-4 flex-1">
        {isLoading ? (
          <div className="flex h-64 items-center justify-center text-xs text-muted-foreground">
            <span className="size-4 animate-spin rounded-full border-2 border-primary border-t-transparent mr-2" />
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

              <span className="text-xs font-medium text-primary">
                Puncak: {peakKw} kW
              </span>
            </div>

            <LoadProfileChart
              points={analytics?.loadProfile24h || []}
              dateLabel={analytics?.anchorDateLabel || ''}
              className="h-60 w-full sm:h-64"
              hasMainPanel={hasMainPanel}
            />
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
                    className="h-8 gap-1 px-2 text-xs font-medium text-primary hover:text-primary"
                    title="Kembali ke 7 Hari Terkini Toko Ini"
                  >
                    <RotateCcw className="size-3.5" />
                    Terkini
                  </Button>
                )}
              </div>
            </div>

            {chartControls}
            <EnergyChart
              rows={weeklyRows}
              unit={activeUnit}
              type={chartType}
              limit={dailyLimit}
              periodNoun="hari"
              className="h-60 w-full sm:h-64"
              tick={<CustomXAxisTick />}
            />
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
                <Badge variant="outline" className="text-xs font-medium flex items-center gap-1.5">
                  <span className={cn(
                    "size-1.5 rounded-full",
                    monthlySummary?.trendStatus === 'hemat' ? "bg-primary" : (monthlySummary?.trendStatus === 'waspada' ? "bg-destructive" : "bg-warning")
                  )} />
                  <span>
                    {monthlySummary?.trendStatus === 'hemat' ? 'Tren Konsumsi Efisien' : (monthlySummary?.trendStatus === 'waspada' ? 'Waspada Kenaikan Beban' : 'Tren Konsumsi Stabil')}
                  </span>
                </Badge>
              </div>
            </div>

            {chartControls}
            <EnergyChart
              rows={monthlyRows}
              unit={activeUnit}
              type={chartType}
              limit={monthlyLimit}
              periodNoun="bulan"
              className="h-60 w-full sm:h-64"
            />

            {/* Bottom Insight Footer */}
            <div className="mt-1 rounded-lg border border-border/60 bg-muted/20 px-3 py-2 text-xs text-muted-foreground flex items-center justify-between flex-wrap gap-2">
              <span className="flex items-center gap-1.5">
                <Sparkles className="size-3.5 text-primary shrink-0" />
                <span>
                  Total Biaya Listrik ({realMonthlyList.length} bulan): <strong>{hasMainPanel ? formatRupiah(realMonthlyList.reduce((sum, m) => sum + (m.mainPanelKwh ?? 0), 0) * PLN_TARIFF_PER_KWH) : '-'}</strong>
                </span>
              </span>
              <span className="text-xs font-semibold text-foreground">
                Tarif PLN: Rp {PLN_TARIFF_PER_KWH}/kWh
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
