'use client'

import { useState, useTransition, useMemo } from 'react'
import {
  Store,
  AuditSession,
  TelemetryHistoryResult,
  MetricType,
  TimeRangeType,
  SensorMeta,
  TelemetryPoint,
} from '@/lib/types'
import { StoreHero } from './store-hero'
import { TelemetryChart, METRIC_CONFIG } from './telemetry-chart'
import { SessionSelector } from './session-selector'
import { TelemetryDatePicker } from './telemetry-date-picker'
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
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface StoreMonitoringPageProps {
  store: Store
  sessions: AuditSession[]
  initialHistory: TelemetryHistoryResult
}

export function StoreMonitoringPage({
  store,
  sessions,
  initialHistory,
}: StoreMonitoringPageProps) {
  // Time Range Mode: 'day' | 'week' | 'session' (Default: 'day')
  const [rangeType, setRangeType] = useState<TimeRangeType>('day')

  // Available dates from database (newest first)
  const availableDates = initialHistory.availableDates || []
  const defaultDate = availableDates[0] || '2026-08-18'
  const [selectedDate, setSelectedDate] = useState<string>(defaultDate)

  // Active session state (for 'session' mode)
  const defaultSessionId = sessions.find((s) => s.isActive)?.id ?? sessions[0]?.id ?? ''
  const [sessionId, setSessionId] = useState(defaultSessionId)

  // Session pagination state
  const [sessionPage, setSessionPage] = useState<number>(1)

  // Selected Metric (Default: power)
  const [selectedMetric, setSelectedMetric] = useState<MetricType>('power')

  // Selected Sensor Phase Filter ('all' or 'L12', etc.)
  const [selectedSensorPhase, setSelectedSensorPhase] = useState<string>('all')

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

  // Handle Date Shift (< or >) for Day & Week mode
  const handleDateShift = (direction: 'prev' | 'next') => {
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
      fetchTelemetry(rangeType, nextDate, sessionId, 1)
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

      return {
        sensor,
        avg: Math.round(avg * 10) / 10,
        max: Math.round(max * 10) / 10,
        min: Math.round(min * 10) / 10,
        latest: Math.round(latest * 10) / 10,
      }
    })
  }, [points, sensors, selectedMetric])

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

  return (
    <div className="flex flex-col gap-6 pb-12">
      {/* Store Header Info */}
      <StoreHero store={store} />

      <Separator />

      {/* Main Audit Telemetry Section */}
      <div className="flex flex-col gap-5">
        {/* Controls Bar: Time Range, Date/Session Navigator, and Metric Selector */}
        <div className="flex flex-col gap-4 rounded-xl border bg-card p-4 shadow-xs lg:flex-row lg:items-center lg:justify-between">
          {/* Left: Time Range Mode (Day / Week / Session) & Date/Session Navigator */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Range Mode Pills */}
            <div className="flex rounded-lg bg-muted/70 p-1 border">
              {(
                [
                  { key: 'day', label: 'Harian (1 Jam)' },
                  { key: 'week', label: 'Mingguan (1 Hari)' },
                  { key: 'session', label: 'Sesi Audit (Detail)' },
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

            {/* Date Navigator with Calendar Popover (for Day & Week mode) */}
            {rangeType !== 'session' ? (
              <TelemetryDatePicker
                selectedDate={selectedDate}
                onDateSelect={handleDateSelect}
                availableDates={availableDates}
                rangeType={rangeType as 'day' | 'week'}
                onDateShift={handleDateShift}
                canShiftPrev={availableDates.indexOf(selectedDate) < availableDates.length - 1}
                canShiftNext={availableDates.indexOf(selectedDate) > 0}
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
                  {rangeType === 'week' &&
                    `Mingguan (7 Hari s/d ${formattedDisplayDate}): Rata-rata per 1 Hari (7 Titik)`}
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

            {/* Sensor / Phase Filter Buttons */}
            {sensors.length > 0 && (
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-[11px] font-semibold text-muted-foreground flex items-center gap-1">
                  <SlidersHorizontal className="size-3" />
                  Filter Sensor:
                </span>
                <button
                  onClick={() => setSelectedSensorPhase('all')}
                  className={cn(
                    'rounded-md px-2.5 py-1 text-xs font-semibold border transition-colors cursor-pointer',
                    selectedSensorPhase === 'all'
                      ? 'border-emerald-500 bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300'
                      : 'border-border bg-muted/40 text-muted-foreground hover:bg-muted'
                  )}
                >
                  Semua ({sensors.length})
                </button>
                {sensors.map((s) => {
                  const isSelected = selectedSensorPhase === s.phase
                  return (
                    <button
                      key={s.phase}
                      onClick={() => setSelectedSensorPhase(s.phase)}
                      style={{
                        borderColor: isSelected ? s.color : undefined,
                        color: isSelected ? s.color : undefined,
                      }}
                      className={cn(
                        'flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-semibold border transition-colors cursor-pointer',
                        isSelected
                          ? 'bg-background shadow-xs font-bold'
                          : 'border-border bg-muted/40 text-muted-foreground hover:bg-muted'
                      )}
                    >
                      <span
                        className="size-2 rounded-full shrink-0"
                        style={{ backgroundColor: s.color }}
                      />
                      {s.phase} ({s.name})
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
              selectedSensorPhase={selectedSensorPhase}
              className="h-[420px] w-full"
            />
          </div>
        </div>

        {/* Dynamic Sensor Cards Breakdown */}
        {sensorStats.length > 0 && (
          <div className="flex flex-col gap-3">
            <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider text-muted-foreground">
              Rincian Statistik Per Sensor / Fasa ({metricMeta.label})
            </h3>
            <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-4">
              {sensorStats.map(({ sensor, avg, max, latest }) => {
                const isFiltered =
                  selectedSensorPhase !== 'all' && selectedSensorPhase !== sensor.phase
                return (
                  <div
                    key={sensor.phase}
                    onClick={() =>
                      setSelectedSensorPhase(
                        selectedSensorPhase === sensor.phase ? 'all' : sensor.phase
                      )
                    }
                    className={cn(
                      'flex flex-col justify-between rounded-xl border p-4 shadow-xs transition-all cursor-pointer',
                      selectedSensorPhase === sensor.phase
                        ? 'border-emerald-500 bg-emerald-50/20 ring-2 ring-emerald-500/20 dark:bg-emerald-950/20'
                        : 'bg-card hover:border-emerald-500/30',
                      isFiltered && 'opacity-50'
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span
                          className="size-2.5 rounded-full shrink-0"
                          style={{ backgroundColor: sensor.color }}
                        />
                        <span className="font-mono text-xs font-bold text-foreground">
                          {sensor.phase}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          ({sensor.name})
                        </span>
                      </div>
                    </div>

                    <div className="mt-3 flex items-baseline justify-between">
                      <div className="flex flex-col">
                        <span className="text-[10px] uppercase font-semibold text-muted-foreground">
                          Rata-rata
                        </span>
                        <span className="text-xl font-bold font-mono text-foreground">
                          {avg.toLocaleString('id-ID')}{' '}
                          <span className="text-xs font-normal text-muted-foreground">
                            {metricMeta.unit}
                          </span>
                        </span>
                      </div>

                      <div className="flex flex-col text-right">
                        <span className="text-[10px] uppercase font-semibold text-muted-foreground">
                          Maksimum
                        </span>
                        <span className="text-sm font-semibold font-mono text-muted-foreground">
                          {max.toLocaleString('id-ID')} {metricMeta.unit}
                        </span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
