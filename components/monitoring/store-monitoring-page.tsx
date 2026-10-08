'use client'

import { useState, useTransition, useMemo } from 'react'
import {
  Store,
  AuditSession,
  TelemetryHistoryResult,
  StoreAnalyticsResult,
  MetricType,
  TimeRangeType,
  SensorMeta,
  TelemetryPoint,
} from '@/lib/types'
import { StoreHero } from './store-hero'
import { TelemetryChart, METRIC_CONFIG } from './telemetry-chart'
import { SessionSelector } from './session-selector'
import { TelemetryDatePicker } from './telemetry-date-picker'
import { StoreDetailAnalytics } from './store-detail-analytics'
import { Separator } from '@/components/ui/separator'
import {
  Zap,
  Activity,
  Gauge,
  Cpu,
  RefreshCw,
  SlidersHorizontal,
  Layers,
  TrendingUp,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Clock,
  FileSpreadsheet,
  BarChart3,
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface StoreMonitoringPageProps {
  store: Store
  sessions: AuditSession[]
  initialHistory: TelemetryHistoryResult
  initialAnalytics?: StoreAnalyticsResult | null
}

export function StoreMonitoringPage({
  store,
  sessions,
  initialHistory,
  initialAnalytics = null,
}: StoreMonitoringPageProps) {
  // Main Sub-Tab: 'telemetry' (Multi-fasa & Sesi) | 'analytics' (Per Hari, Per Minggu, Per Bulan)
  const [activeMainTab, setActiveMainTab] = useState<'telemetry' | 'analytics'>('telemetry')

  // Time Range Mode: 'day' | 'week' | 'month' | 'session' (Default: 'day')
  const [rangeType, setRangeType] = useState<TimeRangeType>('day')

  // Available dates from database (newest first)
  const availableDates = initialHistory.availableDates || []
  const defaultDate =
    availableDates[0] || new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Jakarta' })
  const [selectedDate, setSelectedDate] = useState<string>(defaultDate)

  // Active session state (for 'session' mode)
  const defaultSessionId = sessions.find((s) => s.isActive)?.id ?? sessions[0]?.id ?? ''
  const [sessionId, setSessionId] = useState(defaultSessionId)

  // Session pagination state
  const [sessionPage, setSessionPage] = useState<number>(1)

  // Selected Metric (Default: power)
  const [selectedMetric, setSelectedMetric] = useState<MetricType>('power')

  // Selected Sensor Phases Filter (multi-select array: e.g. ['all'] or ['R', 'S'])
  const [selectedSensorPhases, setSelectedSensorPhases] = useState<string[]>(['all'])

  // Telemetry data state
  const [historyResult, setHistoryResult] = useState<TelemetryHistoryResult>(initialHistory)
  const [isPending, startTransition] = useTransition()
  const [isLoadingChart, setIsLoadingChart] = useState(false)

  const sensors: SensorMeta[] = historyResult.sensors || []
  const points: TelemetryPoint[] = historyResult.points || []
  const pagination = historyResult.pagination

  // Active Session info (if session mode)
  const activeSession = useMemo(() => {
    return sessions.find((s) => s.id === sessionId) ?? sessions[0]
  }, [sessions, sessionId])

  // Multi-select phase helper functions
  const togglePhase = (phase: string) => {
    if (phase === 'all') {
      setSelectedSensorPhases(['all'])
      return
    }

    if (selectedSensorPhases.includes('all')) {
      setSelectedSensorPhases([phase])
      return
    }

    if (selectedSensorPhases.includes(phase)) {
      const remaining = selectedSensorPhases.filter((p) => p !== phase)
      if (remaining.length === 0) {
        setSelectedSensorPhases(['all'])
      } else {
        setSelectedSensorPhases(remaining)
      }
    } else {
      const next = [...selectedSensorPhases, phase]
      const allPhases = sensors.map((s) => s.phase)
      if (allPhases.length > 0 && allPhases.every((p) => next.includes(p))) {
        setSelectedSensorPhases(['all'])
      } else {
        setSelectedSensorPhases(next)
      }
    }
  }

  const isPhaseSelected = (phase: string) => {
    if (selectedSensorPhases.includes('all')) return true
    return selectedSensorPhases.includes(phase)
  }

  const isAllPhasesSelected =
    selectedSensorPhases.includes('all') ||
    (sensors.length > 0 && sensors.every((s) => selectedSensorPhases.includes(s.phase)))

  // Trigger query when rangeType, date, session, or page changes
  const fetchTelemetry = (
    newRange: TimeRangeType,
    newDate: string,
    newSession: string,
    newPage: number = 1
  ) => {
    setIsLoadingChart(true)

    startTransition(async () => {
      try {
        const params = new URLSearchParams()
        params.set('rangeType', newRange)
        if (newRange === 'session') {
          if (newSession) params.set('sessionId', newSession)
          params.set('page', String(newPage))
        } else {
          if (newDate) params.set('date', newDate)
        }

        const res = await fetch(`/api/stores/${store.id}/history?${params.toString()}`)
        if (res.ok) {
          const data: TelemetryHistoryResult = await res.json()
          setHistoryResult(data)
        }
      } catch (error) {
        console.error('Failed to fetch telemetry history:', error)
      } finally {
        setIsLoadingChart(false)
      }
    })
  }

  // Handle Range Mode Switch
  const handleRangeChange = (newRange: TimeRangeType) => {
    setRangeType(newRange)
    setSessionPage(1)
    fetchTelemetry(newRange, selectedDate, sessionId, 1)
  }

  // Handle Date Shift (< or >) for Day, Month, & Year mode
  const handleDateShift = (direction: 'prev' | 'next') => {
    if (rangeType === 'year') {
      const curYear = parseInt(selectedDate.substring(0, 4), 10) || new Date().getFullYear()
      const targetYear = direction === 'prev' ? curYear - 1 : curYear + 1
      const nextDate = `${targetYear}-01-01`
      setSelectedDate(nextDate)
      fetchTelemetry('year', nextDate, sessionId, 1)
      return
    }

    if (rangeType === 'month') {
      const parts = selectedDate.split('-')
      const y = parseInt(parts[0], 10) || 2026
      const m = parseInt(parts[1], 10) || 1
      let targetY = y
      let targetM = direction === 'prev' ? m - 1 : m + 1
      if (targetM < 1) {
        targetM = 12
        targetY -= 1
      } else if (targetM > 12) {
        targetM = 1
        targetY += 1
      }
      const nextDate = `${targetY}-${String(targetM).padStart(2, '0')}-01`
      setSelectedDate(nextDate)
      fetchTelemetry('month', nextDate, sessionId, 1)
      return
    }

    if (availableDates.length === 0) return
    const currentIndex = availableDates.indexOf(selectedDate)
    if (currentIndex === -1) return

    let nextIndex = currentIndex
    if (direction === 'prev') {
      // availableDates is sorted DESC, so older date is index + 1
      nextIndex = Math.min(currentIndex + 1, availableDates.length - 1)
    } else {
      // newer date is index - 1
      nextIndex = Math.max(currentIndex - 1, 0)
    }

    const nextDate = availableDates[nextIndex]
    if (nextDate !== selectedDate) {
      setSelectedDate(nextDate)
      fetchTelemetry('day', nextDate, sessionId, 1)
    }
  }

  // Handle Specific Date Selection
  const handleDateSelect = (dateStr: string) => {
    setSelectedDate(dateStr)
    fetchTelemetry(rangeType, dateStr, sessionId, 1)
  }

  // Handle Session Change
  const handleSessionChange = (newSessionId: string) => {
    setSessionId(newSessionId)
    setSessionPage(1)
    fetchTelemetry('session', selectedDate, newSessionId, 1)
  }

  // Handle Session Page Shift (< or >)
  const handleSessionPageShift = (direction: 'prev' | 'next') => {
    if (!pagination) return
    const targetPage =
      direction === 'prev'
        ? Math.max(pagination.page - 1, 1)
        : Math.min(pagination.page + 1, pagination.totalPages)

    if (targetPage !== pagination.page) {
      setSessionPage(targetPage)
      fetchTelemetry('session', selectedDate, sessionId, targetPage)
    }
  }

  // Calculate Sensor Stats (Average, Max, Latest) for selected metric
  const sensorStats = useMemo(() => {
    if (!points || points.length === 0 || !sensors) return []

    return sensors.map((sensor) => {
      const dataKey = `${sensor.phase}_${selectedMetric}`
      const values = points
        .map((p) => (typeof p[dataKey] === 'number' ? p[dataKey] : null))
        .filter((v): v is number => v !== null)

      if (values.length === 0) {
        return {
          sensor,
          avg: 0,
          max: 0,
          min: 0,
          latest: 0,
        }
      }

      const sum = values.reduce((a, b) => a + b, 0)
      const avg = sum / values.length
      const max = Math.max(...values)
      const min = Math.min(...values)
      const latest = values[values.length - 1]

      const decimals = selectedMetric === 'energy' ? 100 : 10
      return {
        sensor,
        avg: Math.round(avg * decimals) / decimals,
        max: Math.round(max * decimals) / decimals,
        min: Math.round(min * decimals) / decimals,
        latest: Math.round(latest * decimals) / decimals,
      }
    })
  }, [points, sensors, selectedMetric])

  // Calculate Total stats if metric is power or energy
  const totalSummaryStats = useMemo(() => {
    if (!points || points.length === 0) return null
    if (selectedMetric !== 'power' && selectedMetric !== 'energy') return null

    const isEnergy = selectedMetric === 'energy'
    const key = isEnergy ? 'totalEnergy' : 'totalPower'
    const values = points
      .map((p) => (typeof p[key] === 'number' ? p[key] : null))
      .filter((v): v is number => v !== null && v > 0)

    if (values.length === 0) {
      return {
        label: isEnergy ? 'Total Energi' : 'Total Beban',
        unit: isEnergy ? 'kWh' : 'W',
        avg: 0,
        max: 0,
        latest: 0,
      }
    }

    const sum = values.reduce((a, b) => a + b, 0)
    const avg = sum / values.length
    const max = Math.max(...values)
    const latest = values[values.length - 1]

    const decimals = isEnergy ? 100 : 10
    return {
      label: isEnergy ? 'Total Energi' : 'Total Beban',
      unit: isEnergy ? 'kWh' : 'W',
      avg: Math.round(avg * decimals) / decimals,
      max: Math.round(max * decimals) / decimals,
      latest: Math.round(latest * decimals) / decimals,
    }
  }, [points, selectedMetric])

  const metricMeta = METRIC_CONFIG[selectedMetric] || METRIC_CONFIG.power

  // Format display date: "18 Agu 2026"
  const formattedDisplayDate = useMemo(() => {
    if (!selectedDate) return ''
    const parts = selectedDate.split('-')
    if (parts.length === 3) {
      const d = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]))
      return d.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      })
    }
    return selectedDate
  }, [selectedDate])

  // Format display month: "Oktober 2026"
  const formattedDisplayMonth = useMemo(() => {
    if (!selectedDate) return ''
    const parts = selectedDate.split('-')
    if (parts.length >= 2) {
      const m = parseInt(parts[1], 10) - 1
      const y = parts[0]
      const monthNames = [
        'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
        'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
      ]
      return `${monthNames[m] || ''} ${y}`
    }
    return selectedDate
  }, [selectedDate])

  return (
    <div className="flex flex-col gap-6 pb-12">
      {/* Store Header Info */}
      <StoreHero store={store} />

      {/* Sub-Tab Navigation Bar */}
      <div className="flex items-center gap-2 border-b pb-0">
        <button
          type="button"
          onClick={() => setActiveMainTab('telemetry')}
          className={cn(
            'flex items-center gap-2 border-b-2 px-4 py-2.5 text-sm font-semibold transition-all cursor-pointer',
            activeMainTab === 'telemetry'
              ? 'border-emerald-600 text-emerald-600 dark:border-emerald-400 dark:text-emerald-400'
              : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
          )}
        >
          <Gauge className="size-4" />
          <span>Telemetri IoT &amp; Sesi Audit</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveMainTab('analytics')}
          className={cn(
            'flex items-center gap-2 border-b-2 px-4 py-2.5 text-sm font-semibold transition-all cursor-pointer',
            activeMainTab === 'analytics'
              ? 'border-emerald-600 text-emerald-600 dark:border-emerald-400 dark:text-emerald-400'
              : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
          )}
        >
          <BarChart3 className="size-4" />
          <span>Analitik Profil Beban (Hari / Minggu / Bulan)</span>
        </button>
      </div>

      {/* Sub-Tab 1: Telemetri Multi-Fasa & Sesi */}
      {activeMainTab === 'telemetry' && (
        <div className="flex flex-col gap-5">
          {/* Controls Bar: Time Range, Date/Session Navigator, and Metric Selector */}
          <div className="flex flex-col gap-4 rounded-xl border bg-card p-4 shadow-xs lg:flex-row lg:items-center lg:justify-between">
            {/* Left: Time Range Mode (Day / Month / Year / Session) & Date/Session Navigator */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Range Mode Pills with clean, intuitive diksi */}
              <div className="flex rounded-lg bg-muted/70 p-1 border">
                {(
                  [
                    { key: 'day', label: 'Harian' },
                    { key: 'month', label: 'Bulanan' },
                    { key: 'year', label: 'Tahunan' },
                    { key: 'session', label: 'Sesi Audit' },
                  ] as const
                ).map((r) => {
                  const isSelected = rangeType === r.key
                  return (
                    <button
                      key={r.key}
                      onClick={() => handleRangeChange(r.key)}
                      className={cn(
                        'rounded-md px-3 py-1.5 text-xs font-semibold transition-all cursor-pointer',
                        isSelected
                          ? 'bg-background text-foreground shadow-xs font-bold border border-border/80'
                          : 'text-muted-foreground hover:text-foreground hover:bg-background/40'
                      )}
                    >
                      {r.label}
                    </button>
                  )
                })}
              </div>

              {/* Date Navigator with Calendar Popover (for Day, Week, & Month mode) */}
              {rangeType !== 'session' ? (
                <TelemetryDatePicker
                  selectedDate={selectedDate}
                  onDateSelect={handleDateSelect}
                  availableDates={availableDates}
                  rangeType={rangeType as 'day' | 'week' | 'month' | 'year'}
                  onDateShift={handleDateShift}
                  canShiftPrev={
                    rangeType === 'day'
                      ? availableDates.indexOf(selectedDate) < availableDates.length - 1
                      : true
                  }
                  canShiftNext={
                    rangeType === 'day'
                      ? availableDates.indexOf(selectedDate) > 0
                      : true
                  }
                />
              ) : (
                /* Session Selector & Page Navigator (for Session mode) */
                <div className="flex flex-wrap items-center gap-2">
                  {sessions.length > 0 ? (
                    <SessionSelector
                      sessions={sessions}
                      activeSessionId={sessionId}
                      onSessionChange={handleSessionChange}
                    />
                  ) : (
                    <span className="text-xs text-muted-foreground italic">
                      Belum ada rekaman sesi
                    </span>
                  )}

                  {/* Session Pagination Controls */}
                  {pagination && pagination.totalPages > 1 && (
                    <div className="flex items-center gap-1.5 rounded-lg border bg-background px-2 py-1 shadow-xs">
                      <button
                        onClick={() => handleSessionPageShift('prev')}
                        title="Waktu Lebih Baru"
                        disabled={pagination.page <= 1}
                        className="rounded p-1 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
                      >
                        <ChevronLeft className="size-4" />
                      </button>
                      <div className="flex items-center gap-1 text-[11px] font-mono font-semibold px-1 text-foreground">
                        <span>Hal {pagination.page} / {pagination.totalPages}</span>
                        {pagination.page === 1 ? (
                          <span className="text-[10px] bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 font-sans font-bold px-1.5 py-0.5 rounded">
                            Terbaru
                          </span>
                        ) : (
                          <span className="text-[10px] text-muted-foreground font-sans font-normal">
                            (Mundur)
                          </span>
                        )}
                      </div>
                      <button
                        onClick={() => handleSessionPageShift('next')}
                        title="Waktu Sebelumnya (Mundur)"
                        disabled={pagination.page >= pagination.totalPages}
                        className="rounded p-1 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
                      >
                        <ChevronRight className="size-4" />
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Right: Metric Selector Pills */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Parameter:
              </span>
              <div className="flex flex-wrap gap-1 rounded-lg bg-muted/60 p-1 border">
                {(
                  [
                    { key: 'power', label: 'Daya (W)', icon: Zap },
                    { key: 'voltage', label: 'Tegangan (V)', icon: Activity },
                    { key: 'current', label: 'Arus (A)', icon: Gauge },
                    { key: 'powerFactor', label: 'PF', icon: TrendingUp },
                    { key: 'energy', label: 'Energi (kWh)', icon: Layers },
                    { key: 'frequency', label: 'Frekuensi (Hz)', icon: Cpu },
                  ] as const
                ).map((m) => {
                  const isSelected = selectedMetric === m.key
                  return (
                    <button
                      key={m.key}
                      onClick={() => setSelectedMetric(m.key)}
                      className={cn(
                        'flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-semibold transition-all cursor-pointer',
                        isSelected
                          ? 'bg-background text-foreground shadow-xs font-bold border border-border/80'
                          : 'text-muted-foreground hover:text-foreground hover:bg-background/50'
                      )}
                    >
                      <m.icon
                        className={cn(
                          'size-3.5',
                          isSelected && 'text-emerald-600 dark:text-emerald-400'
                        )}
                      />
                      {m.label}
                    </button>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Dynamic Sensor Cards Breakdown (Summary KPI Fasa with Multi-Select) */}
          {sensorStats.length > 0 && (
            <div className="flex flex-col gap-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <Gauge className="size-3.5" />
                  Rincian Statistik Per Sensor / Titik ({metricMeta.label})
                </h3>
                <span className="text-[11px] text-muted-foreground">
                  Klik kartu untuk memilih sensor (Multi-Select)
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {/* Total Beban / Total Energi Card (Tampil di posisi pertama jika parameter Daya atau Energi) */}
                {totalSummaryStats && (
                  <button
                    type="button"
                    onClick={() => togglePhase('all')}
                    className={cn(
                      'group flex flex-col justify-between rounded-lg border px-3 py-2 text-left transition-all cursor-pointer select-none',
                      isAllPhasesSelected
                        ? 'border-emerald-500/60 bg-emerald-50/50 shadow-xs ring-1 ring-emerald-500/20 dark:bg-emerald-950/30 dark:border-emerald-500/40'
                        : 'bg-card hover:border-emerald-500/30 hover:bg-muted/30 opacity-60 hover:opacity-95'
                    )}
                  >
                    <div className="flex items-center justify-between gap-1.5 min-w-0">
                      <div className="flex items-center gap-1.5 min-w-0 truncate">
                        <span className="size-2 rounded-full bg-emerald-500 shrink-0" />
                        <span className="text-xs font-bold text-foreground truncate">
                          {totalSummaryStats.label}
                        </span>
                        <span className="text-[10px] text-muted-foreground shrink-0">
                          (Semua)
                        </span>
                      </div>
                      {isAllPhasesSelected && (
                        <span className="shrink-0 text-[9.5px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-300 bg-emerald-500/15 px-1.5 py-0.5 rounded">
                          Aktif
                        </span>
                      )}
                    </div>

                    <div className="mt-1.5 flex items-baseline justify-between gap-2">
                      <div className="flex items-baseline gap-1 min-w-0">
                        <span className="text-sm sm:text-base font-bold font-mono tracking-tight text-foreground">
                          {totalSummaryStats.avg.toLocaleString('id-ID', {
                            minimumFractionDigits: selectedMetric === 'energy' ? 2 : 1,
                            maximumFractionDigits: 2,
                          })}
                        </span>
                        <span className="text-[10px] font-medium text-muted-foreground">
                          {totalSummaryStats.unit}
                        </span>
                      </div>

                      <div
                        className="flex items-baseline gap-1 text-[11px] text-muted-foreground font-mono shrink-0"
                        title={`Maks Total: ${totalSummaryStats.max.toLocaleString('id-ID')} ${totalSummaryStats.unit}`}
                      >
                        <span className="text-[9px] uppercase font-sans text-muted-foreground/75 font-medium">
                          Maks
                        </span>
                        <span className="font-semibold text-foreground/80">
                          {totalSummaryStats.max.toLocaleString('id-ID', {
                            minimumFractionDigits: selectedMetric === 'energy' ? 2 : 1,
                            maximumFractionDigits: 2,
                          })}
                        </span>
                      </div>
                    </div>
                  </button>
                )}

                {/* Individual Equipment / Sensor Cards */}
                {sensorStats.map(({ sensor, avg, max }) => {
                  const isSelected = isPhaseSelected(sensor.phase)
                  const hasCustomName = sensor.name && sensor.name.trim() !== '' && sensor.name !== sensor.phase
                  const isShortPhase = sensor.phase.length <= 2 // e.g. 'R', 'S', 'T'
                  const displayName = hasCustomName ? sensor.name : (isShortPhase ? `Phase ${sensor.phase}` : sensor.phase)
                  const subLabel = !hasCustomName && isShortPhase ? `(${sensor.phase})` : null

                  return (
                    <button
                      key={sensor.phase}
                      type="button"
                      onClick={() => togglePhase(sensor.phase)}
                      className={cn(
                        'group flex flex-col justify-between rounded-lg border px-3 py-2 text-left transition-all cursor-pointer select-none',
                        isSelected
                          ? 'border-border/80 bg-card shadow-xs ring-1 ring-border/50 dark:bg-card'
                          : 'bg-card/60 hover:border-border hover:bg-muted/20 opacity-50 hover:opacity-90'
                      )}
                      style={{
                        borderColor: isSelected ? sensor.color : undefined,
                        backgroundColor: isSelected ? `${sensor.color}0c` : undefined,
                        boxShadow: isSelected ? `0 0 0 1px ${sensor.color}35` : undefined,
                      }}
                    >
                      <div className="flex items-center justify-between gap-1.5 min-w-0">
                        <div className="flex items-center gap-1.5 min-w-0 truncate">
                          <span
                            className="size-2 rounded-full shrink-0"
                            style={{ backgroundColor: sensor.color }}
                          />
                          <span
                            className="text-xs font-bold text-foreground truncate"
                            title={hasCustomName ? `${sensor.name} (${sensor.phase})` : `Phase ${sensor.phase}`}
                          >
                            {displayName}
                          </span>
                          {subLabel && (
                            <span className="font-mono text-[10px] text-muted-foreground shrink-0">
                              {subLabel}
                            </span>
                          )}
                        </div>
                        {isSelected && (
                          <span
                            className="shrink-0 text-[9.5px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded"
                            style={{
                              color: sensor.color,
                              backgroundColor: `${sensor.color}18`,
                            }}
                          >
                            Pilih
                          </span>
                        )}
                      </div>

                      <div className="mt-1.5 flex items-baseline justify-between gap-2">
                        <div className="flex items-baseline gap-1 min-w-0">
                          <span className="text-sm sm:text-base font-bold font-mono tracking-tight text-foreground">
                            {avg.toLocaleString('id-ID', {
                              minimumFractionDigits: selectedMetric === 'energy' ? 2 : 1,
                              maximumFractionDigits: 2,
                            })}
                          </span>
                          <span className="text-[10px] font-medium text-muted-foreground">
                            {metricMeta.unit}
                          </span>
                        </div>

                        <div
                          className="flex items-baseline gap-1 text-[11px] text-muted-foreground font-mono shrink-0"
                          title={`Maksimum: ${max.toLocaleString('id-ID', {
                            minimumFractionDigits: selectedMetric === 'energy' ? 2 : 1,
                            maximumFractionDigits: 2,
                          })} ${metricMeta.unit}`}
                        >
                          <span className="text-[9px] uppercase font-sans text-muted-foreground/75 font-medium">
                            Maks
                          </span>
                          <span className="font-semibold text-foreground/80">
                            {max.toLocaleString('id-ID', {
                              minimumFractionDigits: selectedMetric === 'energy' ? 2 : 1,
                              maximumFractionDigits: 2,
                            })}
                          </span>
                        </div>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {/* Chart Card */}
          <div className="flex flex-col rounded-xl border bg-card p-5 shadow-xs sm:p-6">
            {/* Header of Chart */}
            <div className="flex flex-col gap-3 border-b pb-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-bold tracking-tight text-foreground sm:text-xl">
                    {metricMeta.label}
                  </h2>
                  {isLoadingChart && (
                    <span className="flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400 animate-pulse font-medium">
                      <RefreshCw className="size-3 animate-spin" />
                      Memuat data...
                    </span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {metricMeta.description} &bull;{' '}
                  <span className="font-semibold text-foreground">
                    {rangeType === 'day' &&
                      `Harian (${formattedDisplayDate}): Rata-rata per 1 Jam (24 Titik)`}
                    {rangeType === 'month' &&
                      `Bulanan (${formattedDisplayMonth}): Rata-rata per Hari (Hari 1 s/d 31)`}
                    {rangeType === 'year' &&
                      `Tahunan (Tahun ${selectedDate.substring(0, 4) || '2026'}): Rata-rata per Bulan (Perbandingan 12 Bulan)`}
                    {rangeType === 'session' && (
                      <>
                        Sesi: {activeSession?.label || 'Rekaman'} (Detail 15 Menit)
                        {points && points.length > 0 && (
                          <span className="ml-1.5 text-emerald-600 dark:text-emerald-400 font-medium">
                            &bull; Rentang: {points[0].timestamp} s/d {points[points.length - 1].timestamp}
                          </span>
                        )}
                        {pagination && (
                          <span className="ml-1 font-mono text-[11px] text-muted-foreground">
                            — Hal {pagination.page}/{pagination.totalPages}
                          </span>
                        )}
                      </>
                    )}
                  </span>
                </p>
              </div>

              {/* Sensor / Phase Filter Buttons with Multi-Select */}
              {sensors.length > 0 && (
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="text-[11px] font-semibold text-muted-foreground flex items-center gap-1">
                    <SlidersHorizontal className="size-3" />
                    Filter Sensor:
                  </span>
                  <button
                    onClick={() => togglePhase('all')}
                    className={cn(
                      'rounded-md px-2.5 py-1 text-xs font-semibold border transition-colors cursor-pointer',
                      isAllPhasesSelected
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300'
                        : 'border-border bg-muted/40 text-muted-foreground hover:bg-muted'
                    )}
                  >
                    Semua ({sensors.length})
                  </button>
                  {sensors.map((s) => {
                    const isSelected = isPhaseSelected(s.phase)
                    const hasCustomName = s.name && s.name.trim() !== '' && s.name !== s.phase
                    const isShortPhase = s.phase.length <= 2
                    const btnLabel = hasCustomName ? s.name : (isShortPhase ? `Phase ${s.phase}` : s.phase)

                    return (
                      <button
                        key={s.phase}
                        onClick={() => togglePhase(s.phase)}
                        style={{
                          borderColor: isSelected ? s.color : undefined,
                          color: isSelected ? s.color : undefined,
                        }}
                        title={hasCustomName ? `${s.name} (${s.phase})` : s.phase}
                        className={cn(
                          'flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-semibold border transition-colors cursor-pointer',
                          isSelected
                            ? 'bg-background shadow-xs font-bold'
                            : 'border-border bg-muted/40 text-muted-foreground hover:bg-muted opacity-50'
                        )}
                      >
                        <span
                          className="size-2 rounded-full shrink-0"
                          style={{ backgroundColor: s.color }}
                        />
                        {btnLabel}
                      </button>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Chart Rendering */}
            <div className="pt-4">
              <TelemetryChart
                data={points}
                sensors={sensors}
                metric={selectedMetric}
                selectedSensorPhases={selectedSensorPhases}
                showTotalPower={isAllPhasesSelected}
                rangeType={rangeType}
                className="h-[420px] w-full"
              />
            </div>
          </div>
        </div>
      )}

      {/* Sub-Tab 2: Analitik Energi (Per Hari / Per Minggu / Per Bulan) */}
      {activeMainTab === 'analytics' && (
        <StoreDetailAnalytics
          store={store}
          initialAnalytics={initialAnalytics}
        />
      )}
    </div>
  )
}
