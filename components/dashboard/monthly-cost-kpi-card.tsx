'use client'

import { useState, useMemo } from 'react'
import {
  Coins,
  TrendingDown,
  TrendingUp,
  Calendar,
  History,
  Info,
  CalendarDays,
  Zap,
  ArrowUpRight,
  Sparkles,
} from 'lucide-react'
import { MonthlyCostRecord } from '@/lib/types'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const PLN_TARIFF_PER_KWH = 1444.7

interface MonthlyCostKpiCardProps {
  monthlyCosts?: MonthlyCostRecord[]
  totalCumulativeKwh?: number
  className?: string
}

export function MonthlyCostKpiCard({
  monthlyCosts = [],
  totalCumulativeKwh = 0,
  className,
}: MonthlyCostKpiCardProps) {
  // Ensure we have at least one monthly cost record
  const enrichedMonthlyCosts = useMemo(() => {
    if (monthlyCosts.length > 0) return monthlyCosts

    const now = new Date()
    const monthNames = [
      'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
      'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ]
    const monthNamesShort = [
      'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun',
      'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'
    ]
    const m = now.getMonth()
    const y = now.getFullYear()
    const key = `${y}-${String(m + 1).padStart(2, '0')}`

    const kwh = totalCumulativeKwh > 0 ? totalCumulativeKwh : 0
    return [
      {
        monthKey: key,
        monthLabel: `${monthNames[m]} ${y}`,
        monthShortLabel: `${monthNamesShort[m]} ${y}`,
        year: y,
        month: m + 1,
        kwh: Math.round(kwh * 10) / 10,
        cost: Math.round(kwh * PLN_TARIFF_PER_KWH),
        isCurrentMonth: true,
        avgDailyKwh: Math.round((kwh / 30) * 10) / 10,
      } as MonthlyCostRecord,
    ]
  }, [monthlyCosts, totalCumulativeKwh])

  // Default selection: newest/current month (first in descending array)
  const [selectedKey, setSelectedKey] = useState<string>(
    enrichedMonthlyCosts[0]?.monthKey || 'all'
  )
  const [isSheetOpen, setIsSheetOpen] = useState(false)

  // Find currently active record
  const activeRecord = useMemo(() => {
    if (selectedKey === 'all') {
      const sumKwh = enrichedMonthlyCosts.reduce((acc, r) => acc + r.kwh, 0)
      const sumCost = enrichedMonthlyCosts.reduce((acc, r) => acc + r.cost, 0)
      return {
        monthKey: 'all',
        monthLabel: 'Semua Periode (Total)',
        monthShortLabel: 'Semua',
        year: 0,
        month: 0,
        kwh: Math.round(sumKwh * 10) / 10,
        cost: Math.round(sumCost),
        isCurrentMonth: false,
      } as MonthlyCostRecord
    }

    return (
      enrichedMonthlyCosts.find((r) => r.monthKey === selectedKey) ||
      enrichedMonthlyCosts[0]
    )
  }, [selectedKey, enrichedMonthlyCosts])

  // Summary statistics for the history sheet
  const historyStats = useMemo(() => {
    const list = enrichedMonthlyCosts.filter((r) => r.monthKey !== 'all')
    if (list.length === 0) return { avgCost: 0, avgKwh: 0, peakRecord: null, totalYearCost: 0 }

    const totalCost = list.reduce((acc, r) => acc + r.cost, 0)
    const totalKwh = list.reduce((acc, r) => acc + r.kwh, 0)
    const avgCost = Math.round(totalCost / list.length)
    const avgKwh = Math.round((totalKwh / list.length) * 10) / 10

    const peakRecord = list.reduce((max, r) => (r.cost > max.cost ? r : max), list[0])

    return {
      avgCost,
      avgKwh,
      peakRecord,
      totalYearCost: totalCost,
    }
  }, [enrichedMonthlyCosts])

  return (
    <div
      className={cn(
        'group flex flex-col justify-between rounded-xl border bg-card p-4 shadow-xs transition-all hover:border-amber-500/30 hover:shadow-sm',
        className
      )}
    >
      {/* Card Header: Title, Icon & Month Selector */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          <div className="flex size-7 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400">
            <Coins className="size-4" />
          </div>
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Estimasi Biaya PLN
          </span>
        </div>

        {/* Compact Month Dropdown Selector */}
        <div className="flex items-center">
          <Select
            value={selectedKey}
            onValueChange={(val) => {
              if (val) setSelectedKey(val)
            }}
          >
            <SelectTrigger
              size="sm"
              className="h-7 text-xs font-medium border-muted/80 bg-muted/30 px-2 text-foreground hover:bg-muted/60"
            >
              <SelectValue placeholder="Pilih Bulan" />
            </SelectTrigger>
            <SelectContent align="end" className="w-48 text-xs">
              {enrichedMonthlyCosts.map((item) => (
                <SelectItem key={item.monthKey} value={item.monthKey}>
                  <div className="flex items-center justify-between w-full gap-2">
                    <span>{item.monthLabel}</span>
                    {item.isCurrentMonth && (
                      <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                        (Aktif)
                      </span>
                    )}
                  </div>
                </SelectItem>
              ))}
              {enrichedMonthlyCosts.length > 1 && (
                <SelectItem value="all">
                  <span className="font-semibold">Semua Periode (Total)</span>
                </SelectItem>
              )}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Main KPI Value */}
      <div className="mt-3">
        <div className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          Rp {activeRecord.cost.toLocaleString('id-ID', { maximumFractionDigits: 0 })}
        </div>

        <div className="mt-1.5 flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
          <span className="font-semibold text-foreground">
            {activeRecord.kwh.toLocaleString('id-ID', { maximumFractionDigits: 1 })} kWh
          </span>
          <span>•</span>
          <span>Tarif B2/TR (Rp 1.444,7/kWh)</span>
        </div>
      </div>

      {/* Card Footer: Monthly Comparison & History Trigger */}
      <div className="mt-3 flex items-center justify-between border-t pt-2.5 text-xs">
        {/* Trend Comparison vs Previous Month */}
        {activeRecord.diffPercentage !== undefined ? (
          <div
            className={cn(
              'flex items-center gap-1 font-medium',
              activeRecord.diffPercentage <= 0
                ? 'text-emerald-600 dark:text-emerald-400'
                : 'text-rose-600 dark:text-rose-400'
            )}
          >
            {activeRecord.diffPercentage <= 0 ? (
              <TrendingDown className="size-3.5" />
            ) : (
              <TrendingUp className="size-3.5" />
            )}
            <span>
              {activeRecord.diffPercentage > 0 ? '+' : ''}
              {activeRecord.diffPercentage.toFixed(1)}% vs bln lalu
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-1 text-muted-foreground">
            <Calendar className="size-3.5" />
            <span>
              {selectedKey === 'all'
                ? 'Akumulasi seluruh sesi'
                : `Periode ${activeRecord.monthShortLabel || activeRecord.monthLabel}`}
            </span>
          </div>
        )}

        {/* History Modal / Sheet Trigger */}
        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <SheetTrigger className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-600 hover:text-amber-700 hover:underline dark:text-amber-400 dark:hover:text-amber-300 cursor-pointer">
            <span>Riwayat</span>
            <History className="size-3" />
          </SheetTrigger>

          <SheetContent
            side="right"
            className="w-full sm:max-w-xl overflow-y-auto p-6"
          >
            <SheetHeader className="text-left">
              <div className="flex items-center gap-2">
                <div className="flex size-9 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400">
                  <Coins className="size-5" />
                </div>
                <div>
                  <SheetTitle className="text-lg font-bold">
                    Riwayat Estimasi Biaya PLN
                  </SheetTitle>
                  <SheetDescription className="text-xs">
                    Rincian konsumsi energi dan kalkulasi tarif listrik per bulan kalender.
                  </SheetDescription>
                </div>
              </div>
            </SheetHeader>

            {/* Tarif Information Banner */}
            <div className="mt-4 flex items-center justify-between rounded-lg border bg-muted/40 p-3 text-xs">
              <div className="flex items-center gap-2">
                <Zap className="size-4 text-amber-500" />
                <div>
                  <div className="font-semibold text-foreground">Tarif PLN B2/TR Bisnis</div>
                  <div className="text-muted-foreground">Golongan Tarif Rendah Retail</div>
                </div>
              </div>
              <Badge variant="outline" className="bg-background font-mono text-xs">
                Rp 1.444,7 / kWh
              </Badge>
            </div>

            {/* Quick Stat Highlights */}
            <div className="mt-4 grid grid-cols-3 gap-2">
              <div className="rounded-lg border bg-card p-3 shadow-2xs">
                <div className="text-[11px] font-medium text-muted-foreground">
                  Rata-rata / Bulan
                </div>
                <div className="mt-1 text-sm font-bold text-foreground">
                  Rp {historyStats.avgCost.toLocaleString('id-ID')}
                </div>
                <div className="text-[10px] text-muted-foreground">
                  ~{historyStats.avgKwh.toLocaleString('id-ID')} kWh
                </div>
              </div>

              <div className="rounded-lg border bg-card p-3 shadow-2xs">
                <div className="text-[11px] font-medium text-muted-foreground">
                  Total Tahun Ini
                </div>
                <div className="mt-1 text-sm font-bold text-foreground">
                  Rp {historyStats.totalYearCost.toLocaleString('id-ID')}
                </div>
                <div className="text-[10px] text-muted-foreground">
                  {enrichedMonthlyCosts.length} Bulan Tercatat
                </div>
              </div>

              <div className="rounded-lg border bg-card p-3 shadow-2xs">
                <div className="text-[11px] font-medium text-muted-foreground">
                  Bulan Tertinggi
                </div>
                <div className="mt-1 text-sm font-bold text-amber-600 dark:text-amber-400">
                  {historyStats.peakRecord?.monthShortLabel || '-'}
                </div>
                <div className="text-[10px] text-muted-foreground">
                  Rp {historyStats.peakRecord?.cost.toLocaleString('id-ID') || 0}
                </div>
              </div>
            </div>

            {/* Monthly History Table */}
            <div className="mt-6 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Daftar Periode Bulanan
                </h3>
                <span className="text-[11px] text-muted-foreground">
                  {enrichedMonthlyCosts.length} Periode
                </span>
              </div>

              <div className="overflow-hidden rounded-xl border bg-card">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead className="text-xs">Periode</TableHead>
                      <TableHead className="text-right text-xs">Konsumsi</TableHead>
                      <TableHead className="text-right text-xs">Est. Biaya PLN</TableHead>
                      <TableHead className="text-center text-xs">Tren</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {enrichedMonthlyCosts.map((row) => {
                      const isSelected = row.monthKey === selectedKey
                      return (
                        <TableRow
                          key={row.monthKey}
                          className={cn(
                            'cursor-pointer transition-colors hover:bg-muted/50',
                            isSelected && 'bg-amber-500/10 hover:bg-amber-500/15 font-medium'
                          )}
                          onClick={() => {
                            setSelectedKey(row.monthKey)
                            setIsSheetOpen(false)
                          }}
                        >
                          <TableCell className="py-2.5">
                            <div className="flex flex-col">
                              <span className="font-semibold text-foreground text-xs">
                                {row.monthLabel}
                              </span>
                              {row.isCurrentMonth && (
                                <span className="text-[10px] font-medium text-emerald-600 dark:text-emerald-400">
                                  Bulan Berjalan
                                </span>
                              )}
                            </div>
                          </TableCell>

                          <TableCell className="text-right py-2.5 font-mono text-xs">
                            {row.kwh.toLocaleString('id-ID', { maximumFractionDigits: 1 })} kWh
                          </TableCell>

                          <TableCell className="text-right py-2.5 font-semibold text-foreground text-xs">
                            Rp {row.cost.toLocaleString('id-ID')}
                          </TableCell>

                          <TableCell className="text-center py-2.5">
                            {row.diffPercentage !== undefined ? (
                              <Badge
                                variant="outline"
                                className={cn(
                                  'text-[10px] px-1.5 py-0 font-medium',
                                  row.diffPercentage <= 0
                                    ? 'border-emerald-500/30 text-emerald-600 bg-emerald-500/10'
                                    : 'border-rose-500/30 text-rose-600 bg-rose-500/10'
                                )}
                              >
                                {row.diffPercentage > 0 ? '+' : ''}
                                {row.diffPercentage.toFixed(1)}%
                              </Badge>
                            ) : (
                              <span className="text-[10px] text-muted-foreground">-</span>
                            )}
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </div>
            </div>

            {/* Note info */}
            <div className="mt-6 flex items-start gap-2 rounded-lg bg-muted/50 p-3 text-[11px] text-muted-foreground">
              <Info className="size-4 shrink-0 text-muted-foreground mt-0.5" />
              <span>
                Estimasi biaya dihitung dari total akumulasi kWh seluruh meter ESP32 yang terhubung
                dikalikan Tarif Tenaga Listrik PLN B2/TR (Rp 1.444,7/kWh). Klik salah satu baris di atas
                untuk melihat data bulan tersebut di dashboard.
              </span>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  )
}
