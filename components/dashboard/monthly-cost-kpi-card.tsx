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


interface MonthlyCostKpiCardProps {
  monthlyCosts?: MonthlyCostRecord[]
  className?: string
}

export function MonthlyCostKpiCard({ monthlyCosts = [], className }: MonthlyCostKpiCardProps) {
  if (monthlyCosts.length > 0) {
    return <MonthlyCostCard enrichedMonthlyCosts={monthlyCosts} className={className} />
  }
  return (
    <div
      className={cn(
        'flex flex-col justify-between gap-3 rounded-2xl bg-card ring-1 ring-foreground/10 p-4',
        className
      )}
    >
      <span className="text-xs text-muted-foreground">
        Estimasi biaya PLN
      </span>
      <p className="text-sm text-muted-foreground">
        Biaya belum bisa dihitung. Muat ulang halaman, atau cek apakah panel utama sudah merekam.
      </p>
    </div>
  )
}

function MonthlyCostCard({
  enrichedMonthlyCosts,
  className,
}: {
  enrichedMonthlyCosts: MonthlyCostRecord[]
  className?: string
}) {
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
        'group flex flex-col justify-between rounded-2xl bg-card ring-1 ring-foreground/10 p-4 transition-all hover:border-warning/30 hover:shadow-sm',
        className
      )}
    >
      {/* Card Header: Title, Icon & Month Selector */}
      <div className="flex items-center justify-between gap-2">
        <span className="text-sm text-muted-foreground">Estimasi biaya PLN</span>

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
              <SelectValue>{() => activeRecord.monthShortLabel || activeRecord.monthLabel}</SelectValue>
            </SelectTrigger>
            <SelectContent align="end" className="w-48 text-xs">
              {enrichedMonthlyCosts.map((item) => (
                <SelectItem key={item.monthKey} value={item.monthKey}>
                  <div className="flex items-center justify-between w-full gap-2">
                    <span>{item.monthLabel}</span>
                    {item.isCurrentMonth && (
                      <span className="text-xs font-semibold text-primary">
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
        <div className="text-2xl font-medium tabular-nums text-foreground">
          Rp {activeRecord.cost.toLocaleString('id-ID', { maximumFractionDigits: 0 })}
        </div>

        <div className="mt-1.5 flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
          <span className="font-semibold text-foreground">
            {activeRecord.kwh.toLocaleString('id-ID', { maximumFractionDigits: 1 })} kWh
          </span>
          <span>x Rp1.444,7 per kWh</span>
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
                ? 'text-primary'
                : 'text-destructive'
            )}
          >
            {activeRecord.diffPercentage <= 0 ? (
              <TrendingDown className="size-3.5" />
            ) : (
              <TrendingUp className="size-3.5" />
            )}
            <span>
              {activeRecord.diffPercentage > 0 ? '+' : ''}
              {activeRecord.diffPercentage.toLocaleString('id-ID')}% per jam terekam vs bln lalu
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
          <SheetTrigger className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline cursor-pointer">
            <span>Riwayat</span>
            <History className="size-3" />
          </SheetTrigger>

          <SheetContent
            side="right"
            className="w-full sm:max-w-xl overflow-y-auto p-6"
          >
            <SheetHeader className="text-left">
              <div className="flex items-center gap-2">
                <div className="flex size-9 items-center justify-center rounded-lg bg-warning/10 text-warning">
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
                <Zap className="size-4 text-warning" />
                <div>
                  <div className="font-semibold text-foreground">Tarif PLN B2/TR Bisnis</div>
                  <div className="text-muted-foreground">Golongan Tarif Rendah Retail</div>
                </div>
              </div>
              <Badge variant="outline" className="bg-background tabular-nums text-xs">
                Rp 1.444,7 / kWh
              </Badge>
            </div>

            {/* Quick Stat Highlights */}
            <div className="mt-4 grid grid-cols-3 gap-2">
              <div className="rounded-lg border bg-card p-3 shadow-2xs">
                <div className="text-xs font-medium text-muted-foreground">
                  Rata-rata / Bulan
                </div>
                <div className="mt-1 text-sm font-bold text-foreground">
                  Rp {historyStats.avgCost.toLocaleString('id-ID')}
                </div>
                <div className="text-xs text-muted-foreground">
                  ~{historyStats.avgKwh.toLocaleString('id-ID')} kWh
                </div>
              </div>

              <div className="rounded-lg border bg-card p-3 shadow-2xs">
                <div className="text-xs font-medium text-muted-foreground">
                  Total Tahun Ini
                </div>
                <div className="mt-1 text-sm font-bold text-foreground">
                  Rp {historyStats.totalYearCost.toLocaleString('id-ID')}
                </div>
                <div className="text-xs text-muted-foreground">
                  {enrichedMonthlyCosts.length} Bulan Tercatat
                </div>
              </div>

              <div className="rounded-lg border bg-card p-3 shadow-2xs">
                <div className="text-xs font-medium text-muted-foreground">
                  Bulan Tertinggi
                </div>
                <div className="mt-1 text-sm font-bold text-warning">
                  {historyStats.peakRecord?.monthShortLabel || '-'}
                </div>
                <div className="text-xs text-muted-foreground">
                  Rp {historyStats.peakRecord?.cost.toLocaleString('id-ID') || 0}
                </div>
              </div>
            </div>

            {/* Monthly History Table */}
            <div className="mt-6 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-semibold text-muted-foreground">
                  Daftar Periode Bulanan
                </h3>
                <span className="text-xs text-muted-foreground">
                  {enrichedMonthlyCosts.length} Periode
                </span>
              </div>

              <div className="overflow-hidden rounded-2xl bg-card ring-1 ring-foreground/10">
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
                            isSelected && 'bg-warning/10 hover:bg-warning/15 font-medium'
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
                                <span className="text-xs font-medium text-primary">
                                  Bulan Berjalan
                                </span>
                              )}
                            </div>
                          </TableCell>

                          <TableCell className="text-right py-2.5 tabular-nums text-xs">
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
                                  'text-xs px-1.5 py-0 font-medium',
                                  row.diffPercentage <= 0
                                    ? 'border-primary/30 text-primary bg-primary/10'
                                    : 'border-destructive/30 text-destructive bg-destructive/10'
                                )}
                              >
                                {row.diffPercentage > 0 ? '+' : ''}
                                {row.diffPercentage.toLocaleString('id-ID')}%
                              </Badge>
                            ) : (
                              <span className="text-xs text-muted-foreground">-</span>
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
            <div className="mt-6 flex items-start gap-2 rounded-lg bg-muted/50 p-3 text-xs text-muted-foreground">
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
