// Turns the Flask /api/live-buffer/<device_id> response into chart points.
// No `@/` imports, so `node --test` can load this file directly.
import type { LiveBufferResult, SensorMeta, TelemetryPoint } from './types.ts'
import {
  comparePhase,
  defaultPhaseName,
  isExcludedPhase,
  isPhaseKey,
  normalizePhaseKey,
  sensorColor,
} from './phase-keys.ts'

const FIELD_MAP: Record<string, string> = {
  'Power (W)': 'power',
  'Voltage (V)': 'voltage',
  'Current (A)': 'current',
  'Power Factor': 'powerFactor',
  'Frequency (Hz)': 'frequency',
  'Active Energy (kWh)': 'energy',
}

const MAIN_PHASES = new Set(['R', 'S', 'T'])

const TIME_FORMAT = new Intl.DateTimeFormat('en-GB', {
  timeZone: 'Asia/Jakarta',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  hour12: false,
})

export function formatJakartaTime(epochMs: number): string {
  return TIME_FORMAT.format(new Date(epochMs))
}

// Only real numbers count. null, '', booleans and other values are "no reading",
// never 0, so a missing metric is not plotted as 0 W and a missing time is not 1970.
function toNumber(value: unknown): number | null {
  if (typeof value === 'number') return Number.isFinite(value) ? value : null
  if (typeof value === 'string' && value.trim() !== '') {
    const n = Number(value)
    return Number.isFinite(n) ? n : null
  }
  return null
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

export function parseLiveBuffer(raw: unknown, since: number | null): LiveBufferResult {
  if (!Array.isArray(raw)) return { sensors: [], points: [], offline: true, lastEpoch: null }

  const phases = new Set<string>()
  const points: TelemetryPoint[] = []
  let offline = true
  let lastEpoch: number | null = null

  for (const item of raw) {
    if (!isRecord(item)) continue
    const epoch = toNumber(item.timestamp)
    if (epoch === null || !isRecord(item.data)) continue

    lastEpoch = lastEpoch === null ? epoch : Math.max(lastEpoch, epoch)
    if (item.data.offline === true) {
      offline = true
      continue
    }
    offline = false
    if (since !== null && epoch <= since) continue

    const point: TelemetryPoint = {
      timestamp: formatJakartaTime(epoch),
      epoch,
      totalPower: 0,
    }
    let hasReading = false
    let mainPower: number | null = null
    let sensorPower = 0
    for (const [key, value] of Object.entries(item.data)) {
      if (!isPhaseKey(key) || isExcludedPhase(key) || !isRecord(value)) continue
      const phase = normalizePhaseKey(key)
      phases.add(phase)
      for (const [field, metric] of Object.entries(FIELD_MAP)) {
        const n = toNumber(value[field])
        if (n === null) continue
        point[`${phase}_${metric}`] = n
        if (metric === 'power') {
          sensorPower += n
          if (MAIN_PHASES.has(phase)) mainPower = (mainPower ?? 0) + n
        }
        hasReading = true
      }
    }
    // Sub-meters measure part of the main panel, so they are not added to it.
    point.totalPower = mainPower ?? sensorPower
    // A sample with no sensor reading would draw a false zero.
    if (hasReading) points.push(point)
  }

  const sensors: SensorMeta[] = [...phases].sort(comparePhase).map((phase, index) => {
    const name = defaultPhaseName(phase)
    return { phase, name, color: sensorColor(phase, name, index) }
  })

  return { sensors, points, offline, lastEpoch }
}
