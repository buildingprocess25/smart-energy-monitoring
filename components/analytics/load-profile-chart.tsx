'use client'

import { Area, CartesianGrid, ComposedChart, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { formatRupiah } from '@/components/analytics/energy-chart'
import type { LoadProfilePoint } from '@/lib/types'
import { PLN_TARIFF_PER_KWH, SPIKE_LIMITS, type SpikeLevel } from '@/lib/usage-insights'

const SPIKE_LABEL: Record<SpikeLevel, string> = { warning: 'Waspada', critical: 'Kritis' }
const SPIKE_COLOR: Record<SpikeLevel, string> = { warning: 'var(--warning)', critical: 'var(--destructive)' }
const SPIKE_TEXT: Record<SpikeLevel, string> = { warning: 'text-warning', critical: 'text-destructive' }

const kw = (watts: number) => `${(watts / 1000).toLocaleString('id-ID', { maximumFractionDigits: 2 })} kW`

export function spikeText(points: LoadProfilePoint[]): string {
  if (!points.some((p) => p.typicalWatts != null)) return '-'
  const count = points.filter((p) => p.spike).length
  return count === 0 ? 'Tidak ada' : `${count} jam`
}

export function LoadProfileChart({
  points,
  dateLabel,
  className,
  hasMainPanel,
}: {
  points: LoadProfilePoint[]
  dateLabel: string
  className: string
  hasMainPanel: boolean
}) {
  const spikes = points.filter((p) => p.spike)
  const hasPattern = points.some((p) => p.typicalWatts != null)

  return (
    <div className="flex flex-col gap-2">
      <div className={className}>
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={points} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" className="text-border/40" />
            <XAxis
              tick={{ fontSize: 12, fill: 'var(--muted-foreground)' }}
              dataKey="time"
              tickLine={false}
              axisLine={false}
              interval={3}
            />
            <YAxis
              tick={{ fontSize: 12, fill: 'var(--muted-foreground)' }}
              tickLine={false}
              axisLine={false}
              width={60}
              tickFormatter={(value: number) => `${(value / 1000).toLocaleString('id-ID')} kW`}
            />
            <Tooltip
              content={({ active, payload }) => {
                const point = payload?.[0]?.payload as LoadProfilePoint | undefined
                if (!active || !point) return null
                return (
                  <div className="flex flex-col gap-0.5 rounded-lg border bg-popover p-3 text-xs text-popover-foreground shadow-md">
                    <p className="font-semibold text-muted-foreground">
                      {point.fullTime || point.time}, {dateLabel}
                    </p>
                    <p className="text-sm font-bold text-foreground tabular-nums">
                      {point.powerWatts === null ? 'Tidak ada rekaman' : kw(point.powerWatts)}
                    </p>
                    {hasMainPanel && point.powerWatts !== null && (
                      <p className="text-muted-foreground tabular-nums">
                        Biaya PLN {formatRupiah((point.powerWatts / 1000) * PLN_TARIFF_PER_KWH)} per jam
                      </p>
                    )}
                    {point.typicalWatts != null && (
                      <p className="text-muted-foreground tabular-nums">Biasanya {kw(point.typicalWatts)}</p>
                    )}
                    {point.spike && (
                      <p className={`font-semibold ${SPIKE_TEXT[point.spike]}`}>Lonjakan: {SPIKE_LABEL[point.spike]}</p>
                    )}
                  </div>
                )
              }}
            />
            <Area
              type="monotone"
              dataKey="powerWatts"
              stroke="var(--primary)"
              strokeWidth={2.5}
              fill="var(--primary)"
              fillOpacity={0.12}
              isAnimationActive={false}
              dot={({ cx, cy, payload, index }) => {
                const level = (payload as LoadProfilePoint).spike
                return level && cx != null && cy != null ? (
                  <circle key={index} cx={cx} cy={cy} r={5} fill={SPIKE_COLOR[level]} stroke="var(--card)" strokeWidth={2} />
                ) : (
                  <g key={index} />
                )
              }}
            />
            {hasPattern && (
              <Line
                type="monotone"
                dataKey="typicalWatts"
                stroke="var(--muted-foreground)"
                strokeWidth={1.5}
                strokeDasharray="5 4"
                dot={false}
                isAnimationActive={false}
              />
            )}
          </ComposedChart>
        </ResponsiveContainer>
      </div>
      {hasPattern ? (
        <div className="flex flex-col gap-1 text-xs text-muted-foreground tabular-nums">
          <p className="flex flex-wrap items-center gap-x-2">
            <span aria-hidden="true" className="w-5 border-t-2 border-dashed border-muted-foreground" />
            Beban biasa jam itu: nilai tengah sampai {SPIKE_LIMITS.days} hari terekam sebelumnya.
          </p>
          {spikes.length > 0 && (
            <ul className="flex flex-wrap gap-x-4 gap-y-1">
              {spikes.map((p) => (
                <li key={p.time}>
                  <span className={`font-semibold ${SPIKE_TEXT[p.spike!]}`}>{SPIKE_LABEL[p.spike!]}</span> {p.time},{' '}
                  {kw(p.powerWatts!)} (biasa {kw(p.typicalWatts!)})
                </li>
              ))}
            </ul>
          )}
        </div>
      ) : (
        <p className="text-xs text-muted-foreground">
          Lonjakan belum bisa ditandai: butuh {SPIKE_LIMITS.minDays} hari rekaman sebelum tanggal ini.
        </p>
      )}
    </div>
  )
}
