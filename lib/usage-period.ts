import { FULL_DAY_HOURS, shiftDate, summarizePeriod, type PeriodSummary, type UsageDay } from './usage-insights.ts'

export interface UsagePeriod {
  title: string
  summary: PeriodSummary
  expectedHours: number
  compareLabel?: string
}

// The period a tab shows. A month has no comparison here because the month cards already compare.
export function usagePeriod(
  tab: 'daily' | 'weekly' | 'monthly',
  days: UsageDay[],
  anchorDate: string,
  weekOffset: number,
  labels: { day: string; week: string }
): UsagePeriod {
  if (!anchorDate) return { title: 'periode', summary: summarizePeriod([], '', ''), expectedHours: 0 }
  if (tab === 'daily') {
    const previous = shiftDate(anchorDate, -7)
    return {
      title: labels.day,
      // Half a day is never set against a full one: day and night loads differ.
      summary: summarizePeriod(days, anchorDate, anchorDate, previous, previous, FULL_DAY_HOURS),
      expectedHours: 24,
      compareLabel: 'Dibanding hari yang sama minggu lalu',
    }
  }
  if (tab === 'weekly') {
    const to = shiftDate(anchorDate, -7 * weekOffset)
    const from = shiftDate(to, -6)
    return {
      title: labels.week,
      summary: summarizePeriod(days, from, to, shiftDate(from, -7), shiftDate(to, -7)),
      expectedHours: 7 * 24,
      compareLabel: 'Dibanding 7 hari sebelumnya',
    }
  }
  const month = days.findLast((d) => d.hours > 0)?.date.slice(0, 7) ?? anchorDate.slice(0, 7)
  const [year, number] = month.split('-').map(Number)
  const label = new Date(`${month}-01T00:00:00Z`).toLocaleDateString('id-ID', {
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  })
  return {
    title: label,
    summary: summarizePeriod(days, `${month}-01`, `${month}-31`),
    expectedHours: new Date(Date.UTC(year, number, 0)).getUTCDate() * 24,
  }
}
