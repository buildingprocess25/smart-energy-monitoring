import { PhaseData } from '@/lib/types'
import { CircularGauge } from './circular-gauge'
import { cn } from '@/lib/utils'

interface PhaseGaugeGridProps {
  phases: PhaseData[]
  className?: string
}

const PHASE_COLORS: Record<string, string> = {
  L1: '#10b981', // emerald-500
  L2: '#3b82f6', // blue-500
  L3: '#f59e0b', // amber-500
}

export function PhaseGaugeGrid({ phases, className }: PhaseGaugeGridProps) {
  if (!phases || phases.length === 0) {
    return (
      <div className={cn('rounded-xl border border-dashed p-12 text-center text-muted-foreground', className)}>
        Data fase tidak tersedia.
      </div>
    )
  }

  return (
    <div className={cn('flex flex-col gap-4', className)}>
      {phases.map((phaseData) => {
        const color = PHASE_COLORS[phaseData.phase] ?? '#64748b'

        return (
          <div
            key={phaseData.phase}
            className="flex flex-col md:flex-row gap-6 items-center justify-between rounded-xl border bg-card p-6 shadow-sm"
          >
            {/* Phase Label */}
            <div className="flex w-full md:w-32 items-center gap-2">
              <span
                className="size-3 shrink-0 rounded-full"
                style={{ backgroundColor: color }}
              />
              <span className="text-xl font-semibold tracking-tight">
                Fase {phaseData.phase}
              </span>
            </div>

            {/* Gauges Grid */}
            <div className="flex w-full flex-wrap justify-around gap-4 md:flex-nowrap md:gap-8">
              <CircularGauge
                value={phaseData.voltage}
                max={260}
                unit="Volt"
                label="Tegangan (V)"
                color={color}
              />
              <CircularGauge
                value={phaseData.current}
                max={30}
                unit="Amp"
                label="Arus (A)"
                color={color}
              />
              <CircularGauge
                value={phaseData.power}
                max={5000}
                unit="Watt"
                label="Daya (W)"
                color={color}
              />
              <CircularGauge
                value={phaseData.powerFactor}
                max={1.0}
                unit="PF"
                label="Power Factor"
                color={color}
              />
            </div>
          </div>
        )
      })}
    </div>
  )
}
