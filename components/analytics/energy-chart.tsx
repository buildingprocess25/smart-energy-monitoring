'use client'

import {
  Bar,
  CartesianGrid,
  Cell,
  ComposedChart,
  Line,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import type { ReactElement, SVGProps } from 'react'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { PLN_TARIFF_PER_KWH } from '@/lib/usage-insights'

export type EnergyUnit = 'kwh' | 'cost'
export type EnergyChartType = 'bar' | 'line'

export interface EnergyRow {
  label: string
  title: string
  kwh: number | null // null when nothing was recorded
  mainKwh: number
  diffPct?: number
}

export interface EnergyLimit {
  kwh: number
  label: string
}

const PRESSED = 'aria-pressed:border-primary aria-pressed:bg-primary aria-pressed:text-primary-foreground'

export const formatRupiah = (value: number) => `Rp ${Math.round(value).toLocaleString('id-ID')}`

const formatUnit = (value: number, unit: EnergyUnit) =>
  unit === 'cost' ? formatRupiah(value) : `${value.toLocaleString('id-ID', { maximumFractionDigits: 1 })} kWh`

function formatAxis(value: number, unit: EnergyUnit): string {
  if (unit === 'kwh') return value.toLocaleString('id-ID')
  if (value >= 1_000_000) return `${(value / 1_000_000).toLocaleString('id-ID', { maximumFractionDigits: 1 })} jt`
  if (value >= 1_000) return `${(value / 1_000).toLocaleString('id-ID', { maximumFractionDigits: 0 })} rb`
  return String(value)
}

export function EnergyChartControls({
  unit,
  onUnitChange,
  type,
  onTypeChange,
  hasMainPanel,
}: {
  unit: EnergyUnit
  onUnitChange: (unit: EnergyUnit) => void
  type: EnergyChartType
  onTypeChange: (type: EnergyChartType) => void
  hasMainPanel: boolean
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <ToggleGroup
        aria-label="Satuan grafik"
        variant="outline"
        spacing={0}
        value={[unit]}
        onValueChange={(value) => value[0] && onUnitChange(value[0] as EnergyUnit)}
      >
        <ToggleGroupItem value="kwh" className={PRESSED}>
          kWh
        </ToggleGroupItem>
        <ToggleGroupItem value="cost" disabled={!hasMainPanel} className={PRESSED}>
          Rupiah
        </ToggleGroupItem>
      </ToggleGroup>
      <ToggleGroup
        aria-label="Jenis grafik"
        variant="outline"
        spacing={0}
        value={[type]}
        onValueChange={(value) => value[0] && onTypeChange(value[0] as EnergyChartType)}
      >
        <ToggleGroupItem value="bar" className={PRESSED}>
          Batang
        </ToggleGroupItem>
        <ToggleGroupItem value="line" className={PRESSED}>
          Garis
        </ToggleGroupItem>
      </ToggleGroup>
      {!hasMainPanel && (
        <span className="text-xs text-muted-foreground">Rupiah dan ambang butuh panel utama R/S/T.</span>
      )}
    </div>
  )
}

export function EnergyChart({
  rows,
  unit,
  type,
  limit,
  periodNoun,
  className,
  tick,
}: {
  rows: EnergyRow[]
  unit: EnergyUnit
  type: EnergyChartType
  limit: EnergyLimit | null
  periodNoun: 'hari' | 'bulan'
  className: string
  tick?: ReactElement<SVGProps<SVGElement>>
}) {
  const factor = unit === 'cost' ? PLN_TARIFF_PER_KWH : 1
  const isAbove = (row: EnergyRow) => limit !== null && row.kwh !== null && row.mainKwh > limit.kwh
  const data = rows.map((row) => ({
    ...row,
    value: row.kwh === null ? null : unit === 'cost' ? row.mainKwh * factor : row.kwh,
    above: isAbove(row),
  }))
  const recorded = data.filter((row) => row.value !== null).length
  const aboveCount = data.filter((row) => row.above).length
  const colorOf = (above: boolean) => (above ? 'var(--destructive)' : 'var(--primary)')

  return (
    <div className="flex flex-col gap-2">
      <div className={className}>
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" className="text-border/40" />
            <XAxis
              dataKey="label"
              tickLine={false}
              axisLine={false}
              tick={tick ?? { fontSize: 12, fill: 'var(--muted-foreground)' }}
              interval={tick ? 0 : 'preserveStartEnd'}
              height={tick ? 38 : 30}
              padding={type === 'line' ? { left: 24, right: 24 } : undefined}
            />
            <YAxis
              tick={{ fontSize: 12, fill: 'var(--muted-foreground)' }}
              tickLine={false}
              axisLine={false}
              width={50}
              tickFormatter={(value: number) => formatAxis(value, unit)}
            />
            <Tooltip
              cursor={{ fill: 'var(--muted)', opacity: 0.5 }}
              content={({ active, payload }) => {
                const row = payload?.[0]?.payload as (typeof data)[number] | undefined
                if (!active || !row || row.kwh === null) return null
                return (
                  <div className="flex flex-col gap-0.5 rounded-lg border bg-popover p-3 text-xs text-popover-foreground shadow-md">
                    <p className="font-semibold text-muted-foreground">{row.title}</p>
                    <p className="text-sm font-bold text-foreground tabular-nums">{formatUnit(row.kwh, 'kwh')}</p>
                    {row.mainKwh > 0 && (
                      <p className="text-muted-foreground tabular-nums">
                        Biaya PLN {formatRupiah(row.mainKwh * PLN_TARIFF_PER_KWH)}
                      </p>
                    )}
                    {limit && (
                      <p className="text-muted-foreground tabular-nums">
                        {limit.label} {formatUnit(limit.kwh, 'kwh')}
                        {row.above && <span className="font-semibold text-destructive"> (terlewati)</span>}
                      </p>
                    )}
                    {row.diffPct !== undefined && (
                      <p className="text-muted-foreground tabular-nums">
                        {Math.abs(row.diffPct).toLocaleString('id-ID')}% lebih {row.diffPct > 0 ? 'tinggi' : 'rendah'}{' '}
                        dari bulan tercatat sebelumnya, per jam terekam
                      </p>
                    )}
                  </div>
                )
              }}
            />
            {type === 'bar' ? (
              <Bar dataKey="value" radius={[6, 6, 0, 0]} maxBarSize={72} isAnimationActive={false}>
                {data.map((row) => (
                  <Cell key={row.title} fill={colorOf(row.above)} />
                ))}
              </Bar>
            ) : (
              <Line
                dataKey="value"
                stroke="var(--primary)"
                strokeWidth={2}
                connectNulls={false}
                isAnimationActive={false}
                dot={({ cx, cy, payload, index }) =>
                  cx == null || cy == null || payload.value === null ? (
                    <g key={index} />
                  ) : (
                    <circle key={index} cx={cx} cy={cy} r={4} fill={colorOf(payload.above)} />
                  )
                }
              />
            )}
            {limit && (
              <ReferenceLine
                y={limit.kwh * factor}
                stroke="var(--warning)"
                strokeDasharray="6 4"
                strokeWidth={1.5}
                ifOverflow="extendDomain"
              />
            )}
          </ComposedChart>
        </ResponsiveContainer>
      </div>
      {limit && (
        <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground tabular-nums">
          <span aria-hidden="true" className="w-5 border-t-2 border-dashed border-warning" />
          {limit.label} {formatUnit(limit.kwh * factor, unit)} per {periodNoun}.
          <span className={aboveCount > 0 ? 'font-semibold text-destructive' : undefined}>
            {aboveCount} dari {recorded} {periodNoun} terekam di atasnya.
          </span>
        </p>
      )}
    </div>
  )
}
