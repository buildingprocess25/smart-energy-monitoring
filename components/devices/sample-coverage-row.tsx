'use client'

import { useState } from 'react'
import { TableProperties } from 'lucide-react'
import {
  formatCount,
  formatCountDate,
  formatCountPercent,
  SampleCoverageDialog,
} from '@/components/devices/sample-coverage-dialog'
import { Button } from '@/components/ui/button'
import { TableCell, TableRow } from '@/components/ui/table'
import { isComplete, type SampleCount, type SampleDay } from '@/lib/sample-count'
import { cn } from '@/lib/utils'

function dayClass(day: SampleDay): string {
  if (day.expected === 0) return 'bg-border'
  if (isComplete(day)) return 'bg-primary'
  return day.valid > 0 ? 'bg-warning' : 'bg-destructive'
}

const dayTitle = (day: SampleDay) =>
  day.expected === 0
    ? `${formatCountDate(day.date)}: tidak direkam`
    : `${formatCountDate(day.date)}: ${formatCount(day.valid)} dari ${formatCount(day.expected)} (${formatCountPercent(day)})`

export interface SampleCoverageRowProps {
  deviceId: string
  phase: string
  name: string
  enabled: boolean
  lastSample: string
  days: SampleDay[]
  total: SampleCount
  recordedDays: number
  completeDays: number
}

export function SampleCoverageRow(props: SampleCoverageRowProps) {
  const { deviceId, phase, name, enabled, lastSample, days, total, recordedDays, completeDays } = props
  const [open, setOpen] = useState(false)
  const recorded = days.filter((d) => d.expected > 0).reverse()

  return (
    <TableRow>
      <TableCell className="py-3 max-sm:w-full max-sm:max-w-0">
        <span className="block truncate font-medium">
          {name}
          {!enabled && <span className="font-normal text-muted-foreground"> (tidak aktif)</span>}
        </span>
        <span className="block truncate text-xs text-muted-foreground">{deviceId}</span>
        <span className="block truncate text-xs text-muted-foreground sm:hidden">{lastSample}</span>
      </TableCell>
      <TableCell className="py-3 max-lg:hidden">
        <div aria-hidden="true" className="flex gap-0.5">
          {days.map((day) => (
            <span key={day.date} title={dayTitle(day)} className={cn('h-5 w-1.5 rounded-sm', dayClass(day))} />
          ))}
        </div>
      </TableCell>
      <TableCell className="py-3 text-right tabular-nums">
        {total.expected === 0 ? (
          <span className="text-muted-foreground">Tidak direkam</span>
        ) : (
          <>
            <span className="block font-medium">{formatCountPercent(total)}</span>
            <span className="block text-xs text-muted-foreground">
              {formatCount(total.valid)} <span className="max-sm:block">dari {formatCount(total.expected)}</span>
            </span>
          </>
        )}
      </TableCell>
      <TableCell className="py-3 text-right tabular-nums max-sm:hidden">
        {recordedDays === 0 ? '-' : `${completeDays} dari ${recordedDays}`}
      </TableCell>
      <TableCell className="py-3 tabular-nums max-sm:hidden">{lastSample}</TableCell>
      <TableCell className="py-3 text-right max-sm:pl-0">
        {recorded.length > 0 && (
          <>
            <Button
              variant="outline"
              className="min-h-11 max-sm:size-11 max-sm:px-0"
              aria-haspopup="dialog"
              aria-label={`Rincian ${name}, ${deviceId}`}
              onClick={() => setOpen(true)}
            >
              <TableProperties aria-hidden="true" />
              <span className="max-sm:hidden">Rincian</span>
            </Button>
            <SampleCoverageDialog
              open={open}
              onOpenChange={setOpen}
              deviceId={deviceId}
              phase={phase}
              name={name}
              days={recorded}
            />
          </>
        )}
      </TableCell>
    </TableRow>
  )
}
