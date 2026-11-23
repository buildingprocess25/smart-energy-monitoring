// Grouping, energy and chart shaping for recording session records (history table).
// No `@/` imports, so `node --test` can load this file directly.
import type {
  SensorMeta,
  SessionPhaseRecords,
  SessionRecord,
  SessionSummaryStats,
  TelemetryPoint,
} from './types.ts'
import { comparePhase, defaultPhaseName, isExcludedPhase, normalizePhaseKey, sensorColor } from './phase-keys.ts'
import { formatJakartaTime } from './live-buffer.ts'

// A type alias, not an interface: pg's query<T> needs an implicit index signature.
export type HistoryRow = {
  phase: string
  timestamp: string
  epoch: string | number
  voltage: unknown
  current: unknown
  power: unknown
  frequency: unknown
  energy: unknown
  power_factor: unknown
  offline: boolean | null
}

const num = (v: unknown): number => {
  const n = typeof v === 'number' ? v : Number(v)
  return Number.isFinite(n) ? n : 0
}

export function groupSessionRows(rows: HistoryRow[], names: Record<string, string>): SessionPhaseRecords[] {
  const byPhase = new Map<string, SessionRecord[]>()
  for (const r of rows) {
    if (isExcludedPhase(r.phase)) continue
    const list = byPhase.get(r.phase) ?? []
    list.push({
      timestamp: r.timestamp,
      epoch: num(r.epoch),
      offline: Boolean(r.offline),
      voltage: num(r.voltage),
      current: num(r.current),
      power: num(r.power),
      frequency: num(r.frequency),
      energy: num(r.energy),
      powerFactor: num(r.power_factor),
    })
    byPhase.set(r.phase, list)
  }
  return [...byPhase.entries()]
    .map(([phase, records]) => ({
      phase,
      name: names[phase] || defaultPhaseName(normalizePhaseKey(phase)),
      records: records.sort((a, b) => a.epoch - b.epoch),
    }))
    .sort((a, b) => comparePhase(normalizePhaseKey(a.phase), normalizePhaseKey(b.phase)))
}

// A delta is trusted when it fits what the higher of the two power readings allows
// for the interval, with 50% headroom plus 0.01 kWh for counter rounding.
export function energyDeltaKwh(records: SessionRecord[]): number {
  let total = 0
  for (let i = 1; i < records.length; i++) {
    const a = records[i - 1]
    const b = records[i]
    if (a.offline || b.offline) continue
    const hours = (b.epoch - a.epoch) / 3_600_000
    if (hours <= 0) continue
    const delta = b.energy - a.energy
    const maxKwh = (Math.max(a.power, b.power) / 1000) * hours * 1.5 + 0.01
    total += delta >= 0 && delta <= maxKwh ? delta : ((a.power + b.power) / 2 / 1000) * hours
  }
  return total
}

export function summarizeSession(phases: SessionPhaseRecords[]): SessionSummaryStats {
  const all = phases.flatMap((p) => p.records)
  const online = all.filter((r) => !r.offline)
  const avg = (pick: (r: SessionRecord) => number) =>
    online.length ? online.reduce((s, r) => s + pick(r), 0) / online.length : 0
  return {
    totalRecords: all.length,
    onlineRecords: online.length,
    offlineRecords: all.length - online.length,
    avgVoltage: avg((r) => r.voltage),
    avgCurrent: avg((r) => r.current),
    avgPower: avg((r) => r.power),
    avgFrequency: avg((r) => r.frequency),
    avgPowerFactor: avg((r) => r.powerFactor),
    energyKwh: phases.reduce((s, p) => s + energyDeltaKwh(p.records), 0),
  }
}

export function toChartData(phases: SessionPhaseRecords[]): { sensors: SensorMeta[]; points: TelemetryPoint[] } {
  const byEpoch = new Map<number, TelemetryPoint>()
  const sensors: SensorMeta[] = []
  phases.forEach((p, index) => {
    const phase = normalizePhaseKey(p.phase)
    if (!sensors.some((s) => s.phase === phase)) {
      sensors.push({ phase, name: p.name, color: sensorColor(phase, p.name, index) })
    }
    for (const r of p.records) {
      if (r.offline) continue
      const point = byEpoch.get(r.epoch) ?? { timestamp: formatJakartaTime(r.epoch), epoch: r.epoch, totalPower: 0 }
      point[`${phase}_power`] = r.power
      point[`${phase}_voltage`] = r.voltage
      point[`${phase}_current`] = r.current
      point[`${phase}_powerFactor`] = r.powerFactor
      point[`${phase}_frequency`] = r.frequency
      point[`${phase}_energy`] = r.energy
      point.totalPower = (point.totalPower ?? 0) + r.power
      byEpoch.set(r.epoch, point)
    }
  })
  const points = [...byEpoch.values()].sort((a, b) => Number(a.epoch) - Number(b.epoch))
  return { sensors, points }
}
