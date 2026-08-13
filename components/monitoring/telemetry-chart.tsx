'use client'

import { useMemo } from 'react'
import {
  ComposedChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts'
import { TelemetryPoint } from '@/lib/types'

interface TelemetryChartProps {
  data: TelemetryPoint[]
  className?: string
}

export function TelemetryChart({ data, className }: TelemetryChartProps) {
  // Hanya ambil sample setiap 5 titik untuk label XAxis agar tidak bertumpuk
  const xAxisTicks = useMemo(() => {
    return data
      .filter((_, i) => i % 6 === 0)
      .map((d) => d.timestamp)
  }, [data])

  if (!data || data.length === 0) {
    return (
      <div className="flex h-[400px] w-full items-center justify-center rounded-xl border border-dashed text-muted-foreground">
        Tidak ada data telemetri.
      </div>
    )
  }

  return (
    <div className={className}>
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart
          data={data}
          margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" className="opacity-10" />
          
          <XAxis
            dataKey="timestamp"
            ticks={xAxisTicks}
            tick={{ fontSize: 12 }}
            tickMargin={10}
            stroke="currentColor"
            className="text-muted-foreground"
          />
          
          <YAxis
            tickFormatter={(value) => `${(value / 1000).toFixed(1)}k`}
            tick={{ fontSize: 12 }}
            width={50}
            stroke="currentColor"
            className="text-muted-foreground"
          />
          
          <Tooltip
            contentStyle={{
              backgroundColor: 'var(--background)',
              borderColor: 'var(--border)',
              borderRadius: '8px',
              fontSize: '12px',
              boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
            }}
            itemStyle={{ color: 'var(--foreground)' }}
            labelStyle={{ fontWeight: 'bold', color: 'var(--foreground)', marginBottom: '8px' }}
          />
          
          <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '20px' }} />

          {/* Reference Lines for Peak Hours */}
          <ReferenceLine
            x="10:00"
            stroke="#f59e0b"
            strokeDasharray="3 3"
            label={{ position: 'insideTopLeft', value: 'WBP Start', fill: '#f59e0b', fontSize: 10 }}
          />
          <ReferenceLine
            x="14:00"
            stroke="#f59e0b"
            strokeDasharray="3 3"
            label={{ position: 'insideTopRight', value: 'WBP End', fill: '#f59e0b', fontSize: 10 }}
          />

          {/* Area: Total Power */}
          <Area
            type="monotone"
            dataKey="totalPower"
            name="Total Daya (W)"
            fill="#10b981"
            fillOpacity={0.15}
            stroke="none"
          />

          {/* Lines: L1, L2, L3 */}
          <Line
            type="monotone"
            dataKey="powerL1"
            name="L1 (W)"
            stroke="#10b981"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4 }}
          />
          <Line
            type="monotone"
            dataKey="powerL2"
            name="L2 (W)"
            stroke="#3b82f6"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4 }}
          />
          <Line
            type="monotone"
            dataKey="powerL3"
            name="L3 (W)"
            stroke="#f59e0b"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4 }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  )
}
