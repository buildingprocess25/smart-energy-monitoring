// Period summaries, spike marks and daily limits per store.
// No imports, so `node --test` and client components can both load it.

export const PLN_TARIFF_PER_KWH = 1444.7

export const SPIKE_LIMITS = {
  days: 28, // earlier recorded days that form the pattern
  minDays: 7,
  warningRatio: 1.25,
  criticalRatio: 1.5,
  minRiseWatts: 300,
}

export const FULL_DAY_HOURS = 20
const MIN_COMPARE_HOURS = 4
const OWN_LIMIT_RATIO = 1.2

export interface UsageDay {
  date: string // YYYY-MM-DD, Jakarta
  kwh: number
  mainKwh: number
  hours: number
}

export interface PeriodSummary {
  kwh: number
  mainKwh: number
  days: number // days with a reading
  hours: number
  avgPerDay: number | null
  diffPct: number | null // per recorded hour against the previous period
}

export type SpikeLevel = 'warning' | 'critical'

export interface HourPattern {
  typicalWatts: number | null
  level: SpikeLevel | null
}

export interface DailyThreshold {
  source: 'standard' | 'own'
  kwhPerDay: number
}

export function shiftDate(date: string, days: number): string {
  const shifted = new Date(`${date}T00:00:00Z`)
  shifted.setUTCDate(shifted.getUTCDate() + days)
  return shifted.toISOString().slice(0, 10)
}

function quantile(sorted: number[], q: number): number {
  const position = (sorted.length - 1) * q
  const low = Math.floor(position)
  const high = Math.ceil(position)
  return sorted[low] + (sorted[high] - sorted[low]) * (position - low)
}

const ascending = (values: number[]) => [...values].sort((a, b) => a - b)

function add(days: UsageDay[], from: string, to: string) {
  const sum = { kwh: 0, mainKwh: 0, hours: 0, days: 0 }
  for (const d of days) {
    if (d.date < from || d.date > to || d.hours <= 0) continue
    sum.kwh += d.kwh
    sum.mainKwh += d.mainKwh
    sum.hours += d.hours
    sum.days += 1
  }
  return sum
}

export function summarizePeriod(
  days: UsageDay[],
  from: string,
  to: string,
  previousFrom?: string,
  previousTo?: string,
  minHours = MIN_COMPARE_HOURS
): PeriodSummary {
  const now = add(days, from, to)
  let diffPct: number | null = null
  if (previousFrom && previousTo) {
    const before = add(days, previousFrom, previousTo)
    if (now.hours >= minHours && before.hours >= minHours && before.kwh > 0) {
      const base = before.kwh / before.hours
      diffPct = Math.round(((now.kwh / now.hours - base) / base) * 1000) / 10
    }
  }
  return { ...now, avgPerDay: now.days > 0 ? now.kwh / now.days : null, diffPct }
}

// A spike is above what this hour usually reaches (p95), not only above its median.
export function findSpikes(profile: (number | null)[], history: (number | null)[][]): HourPattern[] {
  return profile.map((watts, hour) => {
    const values = ascending(history.map((day) => day[hour]).filter((v): v is number => v != null))
    if (values.length < SPIKE_LIMITS.minDays) return { typicalWatts: null, level: null }

    const typical = quantile(values, 0.5)
    let level: SpikeLevel | null = null
    if (watts !== null && watts > quantile(values, 0.95) && watts - typical >= SPIKE_LIMITS.minRiseWatts) {
      if (watts >= typical * SPIKE_LIMITS.criticalRatio) level = 'critical'
      else if (watts >= typical * SPIKE_LIMITS.warningRatio) level = 'warning'
    }
    return { typicalWatts: Math.round(typical), level }
  })
}

// Main panel only. Without a SPARTA standard: 120% of the store's median full day before the date.
export function dailyThreshold(
  days: UsageDay[],
  beforeDate: string,
  standardKwhPerDay: number | null
): DailyThreshold | null {
  if (!days.some((d) => d.mainKwh > 0)) return null
  if (standardKwhPerDay !== null && standardKwhPerDay > 0) {
    return { source: 'standard', kwhPerDay: standardKwhPerDay }
  }
  const full = days
    .filter((d) => d.date < beforeDate && d.hours >= FULL_DAY_HOURS && d.mainKwh > 0)
    .slice(-SPIKE_LIMITS.days)
  if (full.length < SPIKE_LIMITS.minDays) return null
  const median = quantile(ascending(full.map((d) => d.mainKwh)), 0.5)
  return { source: 'own', kwhPerDay: Math.round(median * OWN_LIMIT_RATIO * 10) / 10 }
}
