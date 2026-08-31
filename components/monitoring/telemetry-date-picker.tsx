'use client'

import { useState, useRef, useEffect, useMemo } from 'react'
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ChevronDown,
  Sparkles,
  Check,
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface TelemetryDatePickerProps {
  selectedDate: string // YYYY-MM-DD
  onDateSelect: (dateStr: string) => void
  availableDates?: string[] // List of YYYY-MM-DD with real data
  rangeType?: 'day' | 'week'
  onDateShift?: (direction: 'prev' | 'next') => void
  canShiftPrev?: boolean
  canShiftNext?: boolean
  className?: string
}

const ID_DAYS = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab']
const ID_MONTHS = [
  'Januari',
  'Februari',
  'Maret',
  'April',
  'Mei',
  'Juni',
  'Juli',
  'Agustus',
  'September',
  'Oktober',
  'November',
  'Desember',
]

function parseIso(dateStr: string): Date {
  const parts = dateStr.split('-')
  if (parts.length === 3) {
    return new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10))
  }
  return new Date(dateStr)
}

function formatIso(d: Date): string {
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function getSevenDaysBefore(d: Date): Date {
  const start = new Date(d)
  start.setDate(start.getDate() - 6)
  return start
}

export function TelemetryDatePicker({
  selectedDate,
  onDateSelect,
  availableDates = [],
  rangeType = 'day',
  onDateShift,
  canShiftPrev = false,
  canShiftNext = false,
  className,
}: TelemetryDatePickerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  // Selected date as Date object
  const selectedDateObj = useMemo(() => {
    return parseIso(selectedDate || '2026-08-18')
  }, [selectedDate])

  // Calendar navigation month/year state
  const [viewDate, setViewDate] = useState<Date>(() => selectedDateObj)

  // Sync calendar view month when selectedDate changes
  useEffect(() => {
    setViewDate(selectedDateObj)
  }, [selectedDateObj])

  // Hover state for range preview in 'week' mode
  const [hoveredDate, setHoveredDate] = useState<string | null>(null)

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  // Calendar calculation
  const calendarDays = useMemo(() => {
    const year = viewDate.getFullYear()
    const month = viewDate.getMonth()

    const firstDayOfMonth = new Date(year, month, 1)
    const lastDayOfMonth = new Date(year, month + 1, 0)

    const days = []

    // Previous month padding (Start week on Monday: 0 = Sun, 1 = Mon, ..., 6 = Sat)
    let startDayOfWeek = firstDayOfMonth.getDay() // 0 = Sun
    // Adjust to Monday start (Mon=0, Sun=6)
    const padPrev = startDayOfWeek === 0 ? 6 : startDayOfWeek - 1

    const prevMonthLastDay = new Date(year, month, 0).getDate()
    for (let i = padPrev - 1; i >= 0; i--) {
      const d = new Date(year, month - 1, prevMonthLastDay - i)
      days.push({ date: d, isCurrentMonth: false, iso: formatIso(d) })
    }

    // Current month days
    for (let day = 1; day <= lastDayOfMonth.getDate(); day++) {
      const d = new Date(year, month, day)
      days.push({ date: d, isCurrentMonth: true, iso: formatIso(d) })
    }

    // Next month padding to fill 35 or 42 grid cells
    const remaining = (7 - (days.length % 7)) % 7
    for (let i = 1; i <= remaining; i++) {
      const d = new Date(year, month + 1, i)
      days.push({ date: d, isCurrentMonth: false, iso: formatIso(d) })
    }

    return days
  }, [viewDate])

  const availableDateSet = useMemo(() => new Set(availableDates), [availableDates])

  // Display trigger label
  const triggerLabel = useMemo(() => {
    if (!selectedDate) return 'Pilih Tanggal'
    const d = selectedDateObj

    const dayName = ID_DAYS[d.getDay()]
    const monthName = ID_MONTHS[d.getMonth()]?.slice(0, 3)

    if (rangeType === 'week') {
      const startDate = getSevenDaysBefore(d)
      const startDay = startDate.getDate()
      const startMonth = ID_MONTHS[startDate.getMonth()]?.slice(0, 3)
      const endDay = d.getDate()
      const endMonth = monthName
      const endYear = d.getFullYear()

      if (startDate.getMonth() === d.getMonth()) {
        return `7 Hari: ${startDay} - ${endDay} ${endMonth} ${endYear}`
      }
      return `7 Hari: ${startDay} ${startMonth} - ${endDay} ${endMonth} ${endYear}`
    }

    return `${dayName}, ${d.getDate()} ${monthName} ${d.getFullYear()}`
  }, [selectedDate, selectedDateObj, rangeType])

  // Check if a day is in the selected 7-day range (for week mode)
  const isDateInWeekRange = (iso: string, targetIso: string) => {
    const target = parseIso(targetIso)
    const start = getSevenDaysBefore(target)
    const current = parseIso(iso)
    return current >= start && current <= target
  }

  const isSelected = (iso: string) => iso === selectedDate

  const isInRange = (iso: string) => {
    if (rangeType !== 'week') return false
    const activeTarget = hoveredDate || selectedDate
    return isDateInWeekRange(iso, activeTarget)
  }

  const isRangeEnd = (iso: string) => {
    const activeTarget = hoveredDate || selectedDate
    return iso === activeTarget
  }

  const isRangeStart = (iso: string) => {
    if (rangeType !== 'week') return false
    const activeTarget = hoveredDate || selectedDate
    const start = getSevenDaysBefore(parseIso(activeTarget))
    return iso === formatIso(start)
  }

  // Month navigation
  const nextMonth = () => {
    setViewDate((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1))
  }

  const prevMonth = () => {
    setViewDate((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1))
  }

  const nextYear = () => {
    setViewDate((prev) => new Date(prev.getFullYear() + 1, prev.getMonth(), 1))
  }

  const prevYear = () => {
    setViewDate((prev) => new Date(prev.getFullYear() - 1, prev.getMonth(), 1))
  }

  const handleSelect = (iso: string) => {
    onDateSelect(iso)
    setIsOpen(false)
  }

  return (
    <div ref={containerRef} className={cn('relative inline-flex items-center gap-1.5', className)}>
      {/* Quick Shift Left Button (<) */}
      {onDateShift && (
        <button
          type="button"
          onClick={() => onDateShift('prev')}
          title="Tanggal Sebelumnya (Lebih Lama)"
          disabled={!canShiftPrev}
          className="flex size-8 items-center justify-center rounded-lg border border-border/80 bg-background text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:pointer-events-none disabled:opacity-30 cursor-pointer shadow-xs"
        >
          <ChevronLeft className="size-4" />
        </button>
      )}

      {/* Main Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={cn(
          'flex items-center gap-2 rounded-lg border bg-background px-3 py-1.5 text-xs font-semibold shadow-xs transition-all cursor-pointer',
          isOpen
            ? 'border-emerald-500 ring-2 ring-emerald-500/20 text-foreground'
            : 'border-border/80 text-foreground hover:bg-muted/50'
        )}
      >
        <CalendarIcon className="size-4 text-emerald-600 dark:text-emerald-400" />
        <span className="font-mono font-bold tracking-tight">{triggerLabel}</span>
        <ChevronDown className={cn('size-3.5 text-muted-foreground transition-transform duration-200', isOpen && 'rotate-180')} />
      </button>

      {/* Quick Shift Right Button (>) */}
      {onDateShift && (
        <button
          type="button"
          onClick={() => onDateShift('next')}
          title="Tanggal Berikutnya (Terbaru)"
          disabled={!canShiftNext}
          className="flex size-8 items-center justify-center rounded-lg border border-border/80 bg-background text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:pointer-events-none disabled:opacity-30 cursor-pointer shadow-xs"
        >
          <ChevronRight className="size-4" />
        </button>
      )}

      {/* Calendar Popover Modal */}
      {isOpen && (
        <div className="absolute top-full left-0 z-50 mt-2 w-80 rounded-2xl border border-border/80 bg-popover p-4 text-popover-foreground shadow-2xl backdrop-blur-xl animate-in fade-in-0 zoom-in-95 duration-150">
          {/* Header Controls: Month, Year, and Navigation */}
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={prevYear}
                title="Tahun Sebelumnya"
                className="rounded-md p-1 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
              >
                <ChevronsLeft className="size-4" />
              </button>
              <button
                type="button"
                onClick={prevMonth}
                title="Bulan Sebelumnya"
                className="rounded-md p-1 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
              >
                <ChevronLeft className="size-4" />
              </button>
            </div>

            <div className="text-center font-semibold text-sm text-foreground">
              {ID_MONTHS[viewDate.getMonth()]} {viewDate.getFullYear()}
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={nextMonth}
                title="Bulan Berikutnya"
                className="rounded-md p-1 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
              >
                <ChevronRight className="size-4" />
              </button>
              <button
                type="button"
                onClick={nextYear}
                title="Tahun Berikutnya"
                className="rounded-md p-1 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
              >
                <ChevronsRight className="size-4" />
              </button>
            </div>
          </div>

          {/* Mode Indicator & Tip */}
          <div className="mb-2.5 flex flex-col gap-1 rounded-xl bg-muted/70 p-2 text-[11px] text-muted-foreground border border-border/50">
            <div className="flex items-center justify-between">
              <span>
                Mode: <strong className="text-foreground font-semibold">{rangeType === 'week' ? 'Mingguan (7 Hari)' : 'Harian (24 Jam)'}</strong>
              </span>
              {availableDates.length > 0 && (
                <span className="flex items-center gap-1 text-[10px] text-emerald-700 dark:text-emerald-300 font-semibold bg-emerald-100/80 dark:bg-emerald-950 px-1.5 py-0.5 rounded">
                  <span className="size-1.5 rounded-full bg-emerald-600 animate-pulse" />
                  {availableDates.length} Hari Ada Data
                </span>
              )}
            </div>
            {rangeType === 'week' && (
              <div className="text-[10px] text-emerald-800 dark:text-emerald-300 font-mono font-medium">
                Pilih tanggal akhir untuk melihat 7 hari ke belakang.
              </div>
            )}
          </div>

          {/* Day of Week Headers (Mon - Sun) */}
          <div className="grid grid-cols-7 mb-1 text-center text-[10px] font-bold text-muted-foreground uppercase">
            {['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'].map((day) => (
              <div key={day} className="py-1">
                {day}
              </div>
            ))}
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-y-1 text-center text-xs">
            {calendarDays.map(({ date, isCurrentMonth, iso }, idx) => {
              const dayNum = date.getDate()
              const hasData = availableDateSet.has(iso)
              const selected = isSelected(iso)
              const inRange = isInRange(iso)
              const rangeStart = isRangeStart(iso)
              const rangeEnd = isRangeEnd(iso)

              return (
                <div
                  key={idx}
                  className={cn(
                    'relative flex items-center justify-center p-0.5 transition-colors',
                    rangeType === 'week' && inRange && 'bg-emerald-100/90 dark:bg-emerald-900/40',
                    rangeType === 'week' && rangeStart && 'rounded-l-xl',
                    rangeType === 'week' && rangeEnd && 'rounded-r-xl'
                  )}
                  onMouseEnter={() => {
                    if (rangeType === 'week' && isCurrentMonth) {
                      setHoveredDate(iso)
                    }
                  }}
                  onMouseLeave={() => {
                    if (rangeType === 'week') {
                      setHoveredDate(null)
                    }
                  }}
                >
                  <button
                    type="button"
                    onClick={() => handleSelect(iso)}
                    className={cn(
                      'relative flex size-8 items-center justify-center rounded-lg font-mono text-xs transition-all cursor-pointer',
                      !isCurrentMonth && 'text-muted-foreground/30 hover:text-muted-foreground',
                      isCurrentMonth && !selected && !rangeEnd && !inRange && 'text-foreground hover:bg-muted',
                      rangeType === 'week' && inRange && !rangeEnd && 'text-emerald-950 dark:text-emerald-100 font-bold bg-emerald-200/60 dark:bg-emerald-800/50',
                      rangeType === 'week' && rangeStart && !rangeEnd && 'ring-1.5 ring-emerald-600/40 font-black',
                      (selected || rangeEnd) &&
                        'bg-emerald-600 font-bold text-white shadow-md shadow-emerald-600/30 scale-105 z-10 ring-2 ring-emerald-400/40'
                    )}
                  >
                    {dayNum}

                    {/* Green dot indicator for dates with real telemetry data */}
                    {hasData && (
                      <span
                        className={cn(
                          'absolute bottom-0.5 left-1/2 -translate-x-1/2 size-1 rounded-full',
                          selected || rangeEnd ? 'bg-white' : 'bg-emerald-500'
                        )}
                      />
                    )}
                  </button>
                </div>
              )
            })}
          </div>

          {/* Quick Jump Buttons Footer */}
          <div className="mt-3 pt-2.5 border-t border-border/60 flex items-center justify-between text-xs">
            {availableDates[0] && (
              <button
                type="button"
                onClick={() => handleSelect(availableDates[0])}
                className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer"
              >
                <Sparkles className="size-3" />
                Data Terbaru ({availableDates[0]})
              </button>
            )}

            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="text-[11px] font-medium text-muted-foreground hover:text-foreground cursor-pointer"
            >
              Tutup
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
