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
} from 'recharts'
import { TelemetryPoint, SensorMeta, MetricType } from '@/lib/types'

interface TelemetryChartProps {
  data: TelemetryPoint[]
  sensors: SensorMeta[]
  metric: MetricType
  selectedSensorPhase?: string // 'all' or specific phase like 'L12'
  className?: string
}

export const METRIC_CONFIG: Record<
  MetricType,
  { label: string; unit: string; description: string; yAxisFormatter: (val: number) => string }
> = {
  power: {
    label: 'Daya Listrik (Active Power)',
    unit: 'W',
    description: 'Beban daya aktif per interval waktu',
    yAxisFormatter: (v) => (v >= 1000 ? `${(v / 1000).toFixed(1)} kW` : `${v} W`),
  },
  voltage: {
    label: 'Tegangan Listrik (Voltage)',
    unit: 'V',
    description: 'Tegangan antar fasa/netral',
    yAxisFormatter: (v) => `${v.toFixed(0)} V`,
  },
  current: {
    label: 'Arus Listrik (Current)',
    unit: 'A',
    description: 'Arus listrik per sensor/fasa',
    yAxisFormatter: (v) => `${v.toFixed(1)} A`,
  },
  powerFactor: {
    label: 'Faktor Daya (Power Factor)',
    unit: 'PF',
    description: 'Rasio efisiensi daya aktif terhadap daya semu (0.0 - 1.0)',
    yAxisFormatter: (v) => v.toFixed(2),
  },
  energy: {
    label: 'Energi Listrik (Active Energy)',
    unit: 'kWh',
    description: 'Akumulasi pemakaian energi listrik',
    yAxisFormatter: (v) => `${v.toFixed(1)} kWh`,
  },
  frequency: {
    label: 'Frekuensi Jaringan (Frequency)',
    unit: 'Hz',
    description: 'Frekuensi listrik PLN (standar 50 Hz)',
    yAxisFormatter: (v) => `${v.toFixed(1)} Hz`,
  },
}

export function TelemetryChart({
  data,
  sensors,
  metric = 'power',
  selectedSensorPhase = 'all',
  className,
}: TelemetryChartProps) {
  const config = METRIC_CONFIG[metric] || METRIC_CONFIG.power

  // Filter dynamic sensors based on selected filter
  const visibleSensors = useMemo(() => {
    if (selectedSensorPhase !== 'all') {
      return sensors.filter((s) => s.phase === selectedSensorPhase)
    }
    return sensors
  }, [sensors, selectedSensorPhase])

  // Sample ticks on XAxis so labels don't collide
  const xAxisTicks = useMemo(() => {
    if (!data || data.length === 0) return []
    const step = Math.max(Math.floor(data.length / 10), 1)
    return data.filter((_, i) => i % step === 0).map((d) => d.timestamp)
  }, [data])

  if (!data || data.length === 0) {
    return (
      <div className="flex h-[400px] w-full items-center justify-center rounded-xl border border-dashed text-muted-foreground text-sm">
        Tidak ada data titik telemetri pada sesi ini.
      </div>
    )
  }

  return (
    <div className={className}>
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart
          data={data}
          margin={{ top: 15, right: 15, left: 0, bottom: 5 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
            stroke="currentColor"
            className="opacity-10"
          />

          <XAxis
            dataKey="timestamp"
            ticks={xAxisTicks}
            tick={{ fontSize: 11 }}
            tickMargin={8}
            stroke="currentColor"
            className="text-muted-foreground"
          />

          <YAxis
            tickFormatter={config.yAxisFormatter}
            tick={{ fontSize: 11 }}
            width={65}
            stroke="currentColor"
            className="text-muted-foreground"
            domain={
              metric === 'powerFactor'
                ? [0, 1.05]
                : metric === 'frequency'
                ? [48, 52]
                : ['auto', 'auto']
            }
          />

          <Tooltip
            content={({ active, payload, label }) => {
              if (active && payload && payload.length) {
                const pt = payload[0]?.payload
                return (
                  <div className="rounded-xl border bg-background/95 backdrop-blur-md p-3.5 shadow-xl text-xs flex flex-col gap-2 min-w-[200px]">
                    <div className="flex items-center justify-between border-b pb-1.5 font-semibold text-foreground">
                      <span className="font-mono text-muted-foreground">{pt.fullTime || label}</span>
                      <span className="rounded bg-muted px-1.5 py-0.5 text-[10px] uppercase font-bold text-emerald-600 dark:text-emerald-400">
                        {config.unit}
                      </span>
                    </div>

                    <div className="flex flex-col gap-1">
                      {payload.map((item: any) => (
                        <div
                          key={item.dataKey}
                          className="flex items-center justify-between gap-3"
                        >
                          <span
                            className="flex items-center gap-1.5 font-medium"
                            style={{ color: item.color }}
                          >
                            <span
                              className="size-2 rounded-full shrink-0"
                              style={{ backgroundColor: item.color }}
                            />
                            {item.name}
                          </span>
                          <span className="font-mono font-bold text-foreground">
                            {typeof item.value === 'number'
                              ? `${item.value.toLocaleString('id-ID')} ${config.unit}`
                              : item.value}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              }
              return null
            }}
          />

          <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '16px' }} />

          {/* Area fill for Total Power if power metric and all sensors visible */}
          {metric === 'power' && selectedSensorPhase === 'all' && (
            <Area
              type="monotone"
              dataKey="totalPower"
              name="Total Daya Beban"
              fill="#10b981"
              fillOpacity={0.12}
              stroke="#10b981"
              strokeWidth={1}
              strokeDasharray="4 4"
            />
          )}

          {/* Dynamic Lines for each Sensor / Phase in database */}
          {visibleSensors.map((sensor) => {
            const dataKey = `${sensor.phase}_${metric}`
            const displayName = `${sensor.phase} (${sensor.name})`

            return (
              <Line
                key={sensor.phase}
                type="monotone"
                dataKey={dataKey}
                name={displayName}
                stroke={sensor.color}
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 5 }}
              />
            )
          })}
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  )
}
