import { PhaseData } from '@/lib/types'
import { CircularGauge } from './circular-gauge'
import { cn } from '@/lib/utils'

interface PhaseGaugeGridProps {
  phases: PhaseData[]
  className?: string
}

function getPhaseColor(phase: string, name?: string): string {
  const p = phase.toUpperCase()
  const n = (name || '').toLowerCase()

  if (n.includes('fase r') || n.includes('phase r') || p === 'L1' || p === 'L12') return '#2e9b84'
  if (n.includes('fase s') || n.includes('phase s') || p === 'L2' || p === 'L13') return '#3b82f6'
  if (n.includes('fase t') || n.includes('phase t') || p === 'L3' || p === 'L14') return '#c27803'
  if (n.includes('dummy') || p === 'L6') return '#7b8794'

  return '#2e9b84'
}

export function PhaseGaugeGrid({ phases, className }: PhaseGaugeGridProps) {
  if (!phases || phases.length === 0) {
    return (
      <div className={cn('rounded-xl border border-dashed p-12 text-center text-muted-foreground', className)}>
        Data fasa atau sensor tidak tersedia.
      </div>
    )
  }

  return (
    <div className={cn('flex flex-col gap-4', className)}>
      {phases.map((phaseData) => {
        const color = getPhaseColor(phaseData.phase, phaseData.phaseName)
        const displayName = phaseData.phaseName || (phaseData.phase.startsWith('L') ? `Fase ${phaseData.phase}` : phaseData.phase)
        const isDummy = (phaseData.phaseName || '').toLowerCase().includes('dummy')

        return (
          <div
            key={phaseData.phase}
            className={cn(
              'flex flex-col md:flex-row gap-6 items-center justify-between rounded-2xl bg-card ring-1 ring-foreground/10 p-6 transition-all',
              isDummy ? 'opacity-70 bg-muted/20 border-dashed' : 'hover:border-border'
            )}
          >
            {/* Phase / Sensor Label */}
            <div className="flex w-full md:w-36 flex-col gap-1">
              <div className="flex items-center gap-2">
                <span
                  className="size-3 shrink-0 rounded-full"
                  style={{ backgroundColor: color }}
                />
                <span className="text-lg font-bold tracking-tight text-foreground">
                  {displayName}
                </span>
              </div>
              <div className="flex items-center gap-1.5 pl-5">
                <span className="tabular-nums text-xs font-semibold text-muted-foreground bg-muted/60 px-1.5 py-0.5 rounded">
                  Channel {phaseData.phase}
                </span>
                {isDummy && (
                  <span className="text-xs font-medium text-warning bg-warning/10 px-1.5 py-0.5 rounded">
                    Cadangan
                  </span>
                )}
              </div>
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
