import { getTelemetryPool as getAivenPool } from '@/lib/db/pools'
import { compareWithSangatBoros, getSangatBorosByCode } from '@/lib/services/sangat-boros-service'
import {
  Store,
  AuditSession,
  TelemetryPoint,
  PhaseData,
  SensorMeta,
  TelemetryHistoryResult,
  TimeRangeType,
  DailyConsumption,
  StoreAnalyticsResult,
  LoadProfilePoint,
  MonthlyCostRecord,
  RealMonthlyConsumption,
  MonthlyTrendSummary,
} from '@/lib/types'
import { getIotDeviceDataList, getStoreById, getStores } from './store-service'
import { getEnergyIndex, VALID_SAMPLE_SQL } from './energy-service'
import { jakartaRange } from '@/lib/jakarta-range'
import { sensorColor as getSensorColor } from '@/lib/phase-keys'
import { analyticsStore } from '@/lib/store-choice'
import { createStaleCache } from '@/lib/stale-cache'
import { dailyThreshold, findSpikes, SPIKE_LIMITS } from '@/lib/usage-insights'
import { isVirtualDeviceId, sqlSource, type TopologyMap } from '@/lib/device-topology'
import { getDeviceTopology } from './topology-service'

const PHASE_SQL = `CASE
              WHEN phase IN ('L12', 'L1', 'R', 'r') THEN 'R'
              WHEN phase IN ('L13', 'L2', 'S', 's') THEN 'S'
              WHEN phase IN ('L14', 'L3', 'T', 't') THEN 'T'
              ELSE phase
            END`

const NO_TOPOLOGY: TopologyMap = new Map()

// Normal devices never depend on topology. For a store device a topology error is thrown,
// so an empty result is not cached as if the store had no data.
const topologyMap = async (deviceId: string): Promise<TopologyMap> =>
  isVirtualDeviceId(deviceId) ? (await getDeviceTopology()).map : NO_TOPOLOGY

// The phase parameters of sqlSource are dropped and the rest renumbered, because a query
// that only filters would leave them unreferenced and Postgres rejects that.
function sqlFilter(deviceId: string, map: TopologyMap, firstParam: number): { where: string; params: unknown[] } {
  const src = sqlSource(deviceId, map, firstParam, 'phase')
  const params: unknown[] = []
  const renumbered = new Map<number, number>()
  const where = src.where.replace(/\$(\d+)/g, (_, n: string) => {
    const old = Number(n)
    let next = renumbered.get(old)
    if (next === undefined) {
      next = firstParam + params.length
      renumbered.set(old, next)
      params.push(src.params[old - firstParam])
    }
    return `$${next}`
  })
  return { where, params }
}

// Compared per recorded hour, so a partly recorded month is never set against a full one.
function hourlyAverageDiffPct(
  current: { kwh: number; hours: number },
  previous: { kwh: number; hours: number }
): number | undefined {
  if (current.hours === 0 || previous.hours === 0 || previous.kwh <= 0) return undefined
  const before = previous.kwh / previous.hours
  return Math.round(((current.kwh / current.hours - before) / before) * 1000) / 10
}

// Fetch store-specific analytics: 24h load profile on latest/selected recorded date & daily consumption
export async function getStoreAnalyticsData(
  storeCodeOrId?: string,
  targetDate?: string
): Promise<StoreAnalyticsResult | null> {
  const PLN_TARIFF = 1444.7

  // 1. Dapatkan data store
  const store = storeCodeOrId
    ? analyticsStore<Store>(true, await getStoreById(storeCodeOrId), [])
    : analyticsStore<Store>(false, null, await getStores())
  if (!store?.deviceId) return null

  const { deviceId, code: storeCode, name: storeName, branch } = store
  const isLive = store.status === 'live'

  const monthNamesShort = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des']
  const monthNames = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ]
  const dayNameMap: Record<string, string> = {
    Mon: 'Sen', Tue: 'Sel', Wed: 'Rab', Thu: 'Kam', Fri: 'Jum', Sat: 'Sab', Sun: 'Min',
  }
  const dayFullMap: Record<string, string> = {
    Mon: 'Senin', Tue: 'Selasa', Wed: 'Rabu', Thu: 'Kamis', Fri: 'Jumat', Sat: 'Sabtu', Sun: 'Minggu',
  }

  try {
    const [energy, sangatBorosStore] = await Promise.all([
      getEnergyIndex(),
      getSangatBorosByCode(storeCode),
    ])
    const dailyEnergy = energy.daily(deviceId)
    const availableDates = energy.dates(deviceId)
    const todayJakarta = new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Jakarta' })

    // Tentukan anchor date: Selalu prioritaskan tanggal terbaru yang tercatat (availableDates[0]) jika tidak ada targetDate spesifik
    const anchorDate = targetDate || availableDates[0] || todayJakarta

    let anchorDateLabel = anchorDate
    if (anchorDate) {
      const parts = anchorDate.split('-')
      if (parts.length === 3) {
        const y = parseInt(parts[0], 10)
        const m = parseInt(parts[1], 10) - 1
        const d = parseInt(parts[2], 10)
        anchorDateLabel = `${d} ${monthNamesShort[m]} ${y}`
      }
    }

    const hourlyWatts = energy.loadProfile(deviceId, anchorDate)
    const patternDates = availableDates.filter((date) => date < anchorDate).slice(0, SPIKE_LIMITS.days)
    const hourPattern = findSpikes(
      hourlyWatts,
      patternDates.map((date) => energy.loadProfile(deviceId, date))
    )

    const loadProfile24h: LoadProfilePoint[] = []
    let peakPowerWatts = 0
    let minPowerWatts = Infinity
    let totalLoadSum = 0
    let validLoadCount = 0

    for (let h = 0; h < 24; h++) {
      const hourStr = `${String(h).padStart(2, '0')}:00`
      const pWatts = hourlyWatts[h]
      
      if (pWatts !== null && pWatts > 0) {
        peakPowerWatts = Math.max(peakPowerWatts, pWatts)
        minPowerWatts = Math.min(minPowerWatts, pWatts)
        totalLoadSum += pWatts
        validLoadCount++
      }

      loadProfile24h.push({
        time: hourStr,
        fullTime: `${hourStr} WIB`,
        powerWatts: pWatts === null ? null : Math.round(pWatts),
        powerKw: pWatts === null ? null : Math.round((pWatts / 1000) * 10) / 10,
        typicalWatts: hourPattern[h].typicalWatts,
        spike: hourPattern[h].level,
      })
    }

    const avgPowerWatts = validLoadCount > 0 ? Math.round(totalLoadSum / validLoadCount) : 0
    const basePowerWatts = minPowerWatts !== Infinity ? Math.round(minPowerWatts) : 0

    const dailyConsumption: DailyConsumption[] = dailyEnergy.map((r) => {
      const kwh = Math.round(r.kwh * 10) / 10
      const dayKey = new Date(`${r.date}T00:00:00Z`).toLocaleDateString('en-US', {
        weekday: 'short',
        timeZone: 'UTC',
      })
      const shortDay = dayNameMap[dayKey]
      const fullDay = dayFullMap[dayKey]

      let dayLabel = shortDay
      let dayFullDate = `${fullDay}, ${r.date}`
      if (r.date) {
        const parts = r.date.split('-')
        if (parts.length === 3) {
          const y = parseInt(parts[0], 10)
          const m = parseInt(parts[1], 10) - 1
          const d = parseInt(parts[2], 10)
          const dd = String(d).padStart(2, '0')
          const mm = String(m + 1).padStart(2, '0')
          dayLabel = `${shortDay} (${dd}/${mm})`
          dayFullDate = `${fullDay}, ${d} ${monthNames[m]} ${y}`
        }
      }

      return {
        day: shortDay,
        dayDate: r.date,
        dayLabel,
        dayFullDate,
        kwh,
        mainPanelKwh: Math.round(r.mainKwh * 10) / 10,
        hours: r.hours,
        cost: Math.round(kwh * PLN_TARIFF),
      }
    })

    const monthShortLabels = monthNamesShort
    const monthTotals = new Map<string, { kwh: number; main: number; hours: number }>()
    for (const day of dailyEnergy) {
      const key = day.date.slice(0, 7)
      const month = monthTotals.get(key) ?? { kwh: 0, main: 0, hours: 0 }
      month.kwh += day.kwh
      month.main += day.mainKwh
      month.hours += day.hours
      monthTotals.set(key, month)
    }

    const recordedMonths = [...monthTotals.entries()].filter(([, m]) => m.kwh > 0)
    const monthlyHistory: RealMonthlyConsumption[] = recordedMonths.map(([monthKey, m], idx) => {
      const [year, month] = monthKey.split('-').map(Number)
      const prev = idx > 0 ? recordedMonths[idx - 1][1] : undefined
      return {
        monthKey,
        monthLabel: `${monthShortLabels[month - 1]} ${year}`,
        year,
        month,
        kwh: Math.round(m.kwh * 10) / 10,
        mainPanelKwh: Math.round(m.main * 10) / 10,
        cost: Math.round(m.kwh * PLN_TARIFF),
        diffPct: prev ? hourlyAverageDiffPct(m, prev) : undefined,
        isLatest: idx === recordedMonths.length - 1,
      }
    })

    const totalMonthlyKwh = monthlyHistory.reduce((sum, m) => sum + m.kwh, 0)
    const totalMonthlyCost = monthlyHistory.reduce((sum, m) => sum + m.cost, 0)
    const avgMonthlyKwh = monthlyHistory.length > 0 ? Math.round((totalMonthlyKwh / monthlyHistory.length) * 10) / 10 : 0
    const latestItem = monthlyHistory[monthlyHistory.length - 1]

    const monthlySummary: MonthlyTrendSummary = {
      recordedMonthsCount: monthlyHistory.length,
      totalKwh: Math.round(totalMonthlyKwh * 10) / 10,
      totalCost: totalMonthlyCost,
      avgMonthlyKwh,
      latestMonthLabel: latestItem?.monthLabel || 'Bulan Terkini',
      latestMonthKwh: latestItem?.kwh || 0,
      momDiffPct: latestItem?.diffPct,
      trendStatus: (latestItem?.diffPct ?? 0) <= 0 ? 'hemat' : ((latestItem?.diffPct ?? 0) > 8 ? 'waspada' : 'stabil'),
    }

    const result: StoreAnalyticsResult = {
      storeId: store.id,
      storeCode,
      storeName,
      branch,
      status: store.status,
      deviceId,
      anchorDate,
      anchorDateLabel,
      availableDates,
      isLive,
      peakPowerWatts,
      avgPowerWatts,
      basePowerWatts,
      loadProfile24h,
      dailyConsumption,
      monthlyHistory,
      monthlySummary,
      sangatBoros: sangatBorosStore
        ? compareWithSangatBoros(sangatBorosStore, dailyConsumption, anchorDate)
        : null,
      hasMainPanel: energy.total(deviceId).hasMain,
      threshold: dailyThreshold(dailyEnergy, anchorDate, sangatBorosStore?.standardKwhPerDay ?? null),
    }

    return result
  } catch (error) {
    console.error('Error in getStoreAnalyticsData:', error)
    return null
  }
}

type AuditSessionRow = {
  session_id: string
  session_name: string | null
  start_time: string | null
  end_time: string | null
  total_rows: string
}

const auditSessionCache = createStaleCache<AuditSessionRow[]>({
  ttlMs: 30_000,
  onError: (error) => console.error('Error refreshing audit sessions:', error),
})

// Fetch list of audit recording sessions for a store
export async function getAuditSessions(storeId: string): Promise<AuditSession[]> {
  const store = await getStoreById(storeId)
  if (!store || !store.deviceId) {
    return []
  }

  const deviceId = store.deviceId
  const aiven = getAivenPool()
  try {
    const rows = await auditSessionCache(deviceId, async () => {
      const filter = sqlFilter(deviceId, await topologyMap(deviceId), 1)
      const res = await aiven.query<AuditSessionRow>(
      `
      SELECT session_id, session_name, MIN(timestamp) as start_time, MAX(timestamp) as end_time, MIN(epoch) as min_epoch, MAX(epoch) as max_epoch, COUNT(*) as total_rows
      FROM history
      WHERE ${filter.where}
      GROUP BY session_id, session_name
      ORDER BY MAX(epoch) DESC
    `,
      filter.params
      )
      return res.rows
    })

    return rows.map((row, index) => ({
      id: row.session_id,
      storeId: storeId,
      label: row.session_name || `Sesi ${row.start_time}`,
      startDate: row.start_time || new Date().toISOString(),
      endDate: row.end_time || null,
      isActive: index === 0, // Latest session marked as active
      dataPointCount: parseInt(row.total_rows) || 0,
    }))
  } catch (error) {
    console.error('Error in getAuditSessions:', error)
    return []
  }
}

export interface TelemetryQueryOptions {
  rangeType?: TimeRangeType
  date?: string // e.g. "2026-08-18"
  sessionId?: string
  page?: number
  pageSize?: number
}

interface HistoryPayload {
  sensors: SensorMeta[]
  points: TelemetryPoint[]
  availableDates: string[]
}

const logHistoryError = (error: unknown) => console.error('Error refreshing telemetry history:', error)
// A period that still receives samples goes stale quickly; the rest hardly changes.
const growingHistoryCache = createStaleCache<HistoryPayload>({ ttlMs: 60_000, onError: logHistoryError })
const settledHistoryCache = createStaleCache<HistoryPayload>({ ttlMs: 30 * 60_000, onError: logHistoryError })

// Fetch dynamic telemetry history points for day (1-hr), week (1-day), or session (15-min paginated)
export async function getTelemetryHistory(
  storeId: string,
  options?: TelemetryQueryOptions | string
): Promise<TelemetryHistoryResult> {
  const store = await getStoreById(storeId)
  if (!store || !store.deviceId) {
    return { sensors: [], points: [], availableDates: [] }
  }

  const deviceId = store.deviceId

  // Parse options
  let rangeType: TimeRangeType = 'day'
  let targetDate: string | undefined = undefined
  let targetSessionId: string | undefined = undefined
  let page = 1
  let pageSize = 96 // Default: 96 intervals = 24 jam @ 15 min

  if (typeof options === 'string') {
    targetSessionId = options
    rangeType = 'session'
  } else if (options) {
    rangeType = options.rangeType || 'day'
    targetDate = options.date
    targetSessionId = options.sessionId
    page = options.page && options.page > 0 ? options.page : 1
    pageSize = options.pageSize && options.pageSize > 0 ? options.pageSize : 96
  }

  // The default request follows the newest recorded date, so it never counts as settled.
  const today = new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Jakarta' })
  const isSettled =
    rangeType !== 'session' && targetDate !== undefined && jakartaRange(rangeType, targetDate).to <= jakartaRange('day', today).from
  const cache = isSettled ? settledHistoryCache : growingHistoryCache

  try {
    const { sensors, points: allPoints, availableDates } = await cache(
      JSON.stringify([deviceId, rangeType, rangeType === 'session' ? targetSessionId : targetDate]),
      () => loadHistory(deviceId, rangeType, targetDate, targetSessionId)
    )
    if (rangeType !== 'session') return { sensors, points: allPoints, availableDates }

    // Page 1 is the latest window; later pages go back in time.
    const totalPoints = allPoints.length
    const totalPages = Math.max(Math.ceil(totalPoints / pageSize), 1)
    const validPage = Math.min(Math.max(page, 1), totalPages)
    const endIndex = Math.max(totalPoints - (validPage - 1) * pageSize, 0)
    const startIndex = Math.max(endIndex - pageSize, 0)
    return {
      sensors,
      points: allPoints.slice(startIndex, endIndex),
      availableDates,
      pagination: { page: validPage, totalPages, totalPoints, pageSize },
    }
  } catch (error) {
    console.error('Error in getTelemetryHistory:', error)
    return { sensors: [], points: [], availableDates: [] }
  }
}

async function loadHistory(
  deviceId: string,
  rangeType: TimeRangeType,
  targetDate: string | undefined,
  targetSessionId: string | undefined
): Promise<HistoryPayload> {
    const aiven = getAivenPool()
    const [energy, map] = await Promise.all([getEnergyIndex(), topologyMap(deviceId)])
    const src = sqlSource(deviceId, map, 1, PHASE_SQL)
    const availableDates = energy.dates(deviceId)
    const todayJakarta = new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Jakarta' })

    // Set default target date to newest available date from database, or today's date
    if (!targetDate) {
      targetDate = availableDates[0] || todayJakarta
    }

    if (rangeType === 'session' && !targetSessionId) {
      const filter = sqlFilter(deviceId, map, 1)
      const latest = await aiven.query<{ session_id: string }>(
        `SELECT session_id FROM history WHERE ${filter.where} ORDER BY id DESC LIMIT 1`,
        filter.params
      )
      targetSessionId = latest.rows[0]?.session_id ?? ''
    }

    // Epoch bounds, not a date expression per row, so an index on epoch can be used.
    const range = rangeType === 'session' ? null : jakartaRange(rangeType, targetDate)
    const queryParams: unknown[] = range
      ? [...src.params, range.from, range.to]
      : [...src.params, targetSessionId ?? '']
    const p = src.params.length
    const periodWhere = range ? `epoch >= $${p + 1} AND epoch < $${p + 2}` : `session_id = $${p + 1}`
    const sensorSources = range
      ? `SELECT ${src.phase} AS phase, phase_name FROM history WHERE ${src.where} AND ${periodWhere}
          UNION ALL
          SELECT ${src.phase} AS phase, NULL as phase_name FROM telemetry WHERE ${src.where} AND ${periodWhere}`
      : `SELECT ${src.phase} AS phase, phase_name FROM history WHERE ${src.where} AND ${periodWhere}`
    const sensorWhere = `WHERE phase != 'L6' AND phase NOT ILIKE '%dummy%'`

    const sensorSql = `
      WITH raw_combined AS (
        SELECT 
          CASE
            WHEN phase IN ('L12', 'L1', 'R', 'r') THEN 'R'
            WHEN phase IN ('L13', 'L2', 'S', 's') THEN 'S'
            WHEN phase IN ('L14', 'L3', 'T', 't') THEN 'T'
            ELSE phase
          END as phase,
          phase_name
        FROM (
          ${sensorSources}
        ) combined_sensors
        ${sensorWhere}
      )
      SELECT 
        phase,
        COALESCE(
          NULLIF(MAX(phase_name), ''), 
          CASE
            WHEN phase = 'R' THEN 'Fase R'
            WHEN phase = 'S' THEN 'Fase S'
            WHEN phase = 'T' THEN 'Fase T'
            ELSE phase
          END
        ) as name, 
        COUNT(*) as count
      FROM raw_combined
      GROUP BY phase
      ORDER BY phase ASC
    `

    const pointsPromise = aiven.query(buildPointsQuery(), queryParams)
    const devSensorPromise = aiven.query(`SELECT sensors FROM devices WHERE id = $1`, [deviceId])
    // Handled here so a failure of the sensor query does not leave these unhandled.
    pointsPromise.catch(() => undefined)
    devSensorPromise.catch(() => undefined)
    let sensorRes = await aiven.query(sensorSql, queryParams)

    // Fallback if no records in that specific scope: query all device sensors
    if (sensorRes.rows.length === 0) {
      sensorRes = await aiven.query(
        `
        WITH raw_combined AS (
          SELECT 
            CASE
              WHEN phase IN ('L12', 'L1', 'R', 'r') THEN 'R'
              WHEN phase IN ('L13', 'L2', 'S', 's') THEN 'S'
              WHEN phase IN ('L14', 'L3', 'T', 't') THEN 'T'
              ELSE phase
            END as phase,
            phase_name
          FROM (
            SELECT ${src.phase} AS phase, phase_name FROM history WHERE ${src.where}
            UNION ALL
            SELECT ${src.phase} AS phase, NULL as phase_name FROM telemetry WHERE ${src.where}
          ) combined_sensors
          WHERE phase != 'L6' AND phase NOT ILIKE '%dummy%'
        )
        SELECT 
          phase,
          COALESCE(
            NULLIF(MAX(phase_name), ''), 
            CASE
              WHEN phase = 'R' THEN 'Fase R'
              WHEN phase = 'S' THEN 'Fase S'
              WHEN phase = 'T' THEN 'Fase T'
              ELSE phase
            END
          ) as name, 
          COUNT(*) as count
        FROM raw_combined
        GROUP BY phase
        ORDER BY phase ASC
      `,
        src.params
      )
    }

    // Get device sensor config from devices table to resolve human-readable names if needed
    const devSensorRes = await devSensorPromise
    const deviceSensorsMap = new Map<string, string>()
    if (devSensorRes.rows.length > 0 && devSensorRes.rows[0].sensors) {
      let slist = devSensorRes.rows[0].sensors
      if (typeof slist === 'string') {
        try {
          slist = JSON.parse(slist)
        } catch {
          slist = []
        }
      }
      if (Array.isArray(slist)) {
        slist.forEach((s: any) => {
          if (s.phase && s.name) {
            let phKey = s.phase
            if (['L12', 'L1', 'R', 'r'].includes(phKey)) phKey = 'R'
            else if (['L13', 'L2', 'S', 's'].includes(phKey)) phKey = 'S'
            else if (['L14', 'L3', 'T', 't'].includes(phKey)) phKey = 'T'
            deviceSensorsMap.set(phKey, s.name)
          }
        })
      }
    }

    const sensors: SensorMeta[] = sensorRes.rows.map((r, index) => {
      let name = r.name
      // If history name is just raw phase code or generic "Sensor XX", try device sensor config
      if ((name === r.phase || name.startsWith('Sensor ')) && deviceSensorsMap.has(r.phase)) {
        name = deviceSensorsMap.get(r.phase)!
      }
      return {
        phase: r.phase,
        name,
        color: getSensorColor(r.phase, name, index),
      }
    })

    function buildPointsQuery(): string {
    if (rangeType === 'day') {
      // Harian: Rata-rata per 1 jam (24 jam) menggabungkan telemetry + history
      return `
        WITH raw_day AS (
          SELECT 
            epoch, 
            ${src.phase} as phase,
            power, voltage, current, energy, power_factor, frequency
          FROM history
          WHERE ${src.where} AND ${periodWhere} AND ${VALID_SAMPLE_SQL}
          UNION ALL
          SELECT 
            epoch, 
            ${src.phase} as phase,
            power, voltage, current, energy, power_factor, frequency
          FROM telemetry
          WHERE ${src.where} AND ${periodWhere} AND ${VALID_SAMPLE_SQL}
        ),
        buckets AS (
          SELECT 
            (epoch / (1000 * 60 * 60)) as bucket_id,
            TO_CHAR(TO_TIMESTAMP(epoch / 1000.0) AT TIME ZONE 'Asia/Jakarta', 'HH24:00') as time_str,
            TO_CHAR(TO_TIMESTAMP(epoch / 1000.0) AT TIME ZONE 'Asia/Jakarta', 'YYYY-MM-DD HH24:00') as full_time,
            phase,
            power,
            voltage,
            current,
            energy,
            power_factor,
            frequency
          FROM raw_day
        )
        SELECT 
          bucket_id,
          time_str,
          full_time,
          phase,
          ROUND(AVG(power)::numeric, 1) as power,
          ROUND(AVG(voltage)::numeric, 1) as voltage,
          ROUND(AVG(current)::numeric, 2) as current,
          ROUND(
            CASE 
              WHEN (MAX(energy) - MIN(energy)) > 0 AND (MAX(energy) - MIN(energy)) <= GREATEST((AVG(power) / 1000.0) * 1.8 + 0.2, 0.5) THEN (MAX(energy) - MIN(energy))
              ELSE GREATEST(0, (AVG(power) / 1000.0))
            END::numeric, 
            2
          ) as energy,
          ROUND(AVG(power_factor)::numeric, 2) as power_factor,
          ROUND(AVG(frequency)::numeric, 1) as frequency
        FROM buckets
        GROUP BY bucket_id, time_str, full_time, phase
        ORDER BY bucket_id ASC
      `
    } else if (rangeType === 'week') {
      // Mingguan: Rata-rata per 1 hari (7 hari terakhir dari tanggal terpilih) menggabungkan telemetry + history
      return `
        WITH raw_week AS (
          SELECT 
            epoch, 
            ${src.phase} as phase,
            power, voltage, current, energy, power_factor, frequency
          FROM history
          WHERE ${src.where} AND ${periodWhere} AND ${VALID_SAMPLE_SQL}
          UNION ALL
          SELECT 
            epoch, 
            ${src.phase} as phase,
            power, voltage, current, energy, power_factor, frequency
          FROM telemetry
          WHERE ${src.where} AND ${periodWhere} AND ${VALID_SAMPLE_SQL}
        ),
        buckets AS (
          SELECT 
            TO_CHAR(TO_TIMESTAMP(epoch / 1000.0) AT TIME ZONE 'Asia/Jakarta', 'YYYY-MM-DD') as day_key,
            TO_CHAR(TO_TIMESTAMP(epoch / 1000.0) AT TIME ZONE 'Asia/Jakarta', 'Dy, DD/MM') as time_str,
            TO_CHAR(TO_TIMESTAMP(epoch / 1000.0) AT TIME ZONE 'Asia/Jakarta', 'YYYY-MM-DD') as full_time,
            phase,
            power,
            voltage,
            current,
            energy,
            power_factor,
            frequency
          FROM raw_week
        )
        SELECT 
          day_key as bucket_id,
          time_str,
          full_time,
          phase,
          ROUND(AVG(power)::numeric, 1) as power,
          ROUND(AVG(voltage)::numeric, 1) as voltage,
          ROUND(AVG(current)::numeric, 2) as current,
          ROUND(
            CASE 
              WHEN (MAX(energy) - MIN(energy)) > 0 AND (MAX(energy) - MIN(energy)) <= GREATEST((AVG(power) / 1000.0) * 24 * 1.8 + 5.0, 10.0) THEN (MAX(energy) - MIN(energy))
              ELSE GREATEST(0, (AVG(power) / 1000.0) * 24)
            END::numeric, 
            2
          ) as energy,
          ROUND(AVG(power_factor)::numeric, 2) as power_factor,
          ROUND(AVG(frequency)::numeric, 1) as frequency
        FROM buckets
        GROUP BY day_key, time_str, full_time, phase
        ORDER BY day_key ASC
      `
    } else if (rangeType === 'month') {
      // Bulanan: Rata-rata per 1 hari dalam bulan targetDate (~30 titik data harian)
      return `
        WITH raw_month AS (
          SELECT 
            epoch, 
            ${src.phase} as phase,
            power, voltage, current, energy, power_factor, frequency
          FROM history
          WHERE ${src.where} AND ${periodWhere} AND ${VALID_SAMPLE_SQL}
          UNION ALL
          SELECT 
            epoch, 
            ${src.phase} as phase,
            power, voltage, current, energy, power_factor, frequency
          FROM telemetry
          WHERE ${src.where} AND ${periodWhere} AND ${VALID_SAMPLE_SQL}
        ),
        buckets AS (
          SELECT 
            TO_CHAR(TO_TIMESTAMP(epoch / 1000.0) AT TIME ZONE 'Asia/Jakarta', 'YYYY-MM-DD') as day_key,
            TO_CHAR(TO_TIMESTAMP(epoch / 1000.0) AT TIME ZONE 'Asia/Jakarta', 'DD/MM') as time_str,
            TO_CHAR(TO_TIMESTAMP(epoch / 1000.0) AT TIME ZONE 'Asia/Jakarta', 'YYYY-MM-DD') as full_time,
            phase,
            power,
            voltage,
            current,
            energy,
            power_factor,
            frequency
          FROM raw_month
        )
        SELECT 
          day_key as bucket_id,
          time_str,
          full_time,
          phase,
          ROUND(AVG(power)::numeric, 1) as power,
          ROUND(AVG(voltage)::numeric, 1) as voltage,
          ROUND(AVG(current)::numeric, 2) as current,
          ROUND(
            CASE 
              WHEN (MAX(energy) - MIN(energy)) > 0 AND (MAX(energy) - MIN(energy)) <= GREATEST((AVG(power) / 1000.0) * 24 * 1.8 + 5.0, 10.0) THEN (MAX(energy) - MIN(energy))
              ELSE GREATEST(0, (AVG(power) / 1000.0) * 24)
            END::numeric, 
            2
          ) as energy,
          ROUND(AVG(power_factor)::numeric, 2) as power_factor,
          ROUND(AVG(frequency)::numeric, 1) as frequency
        FROM buckets
        GROUP BY day_key, time_str, full_time, phase
        ORDER BY day_key ASC
      `
    } else if (rangeType === 'year') {
      // Tahunan: Rata-rata per bulan dalam tahun targetDate (12 titik bulan)
      return `
        WITH raw_year AS (
          SELECT 
            epoch, 
            ${src.phase} as phase,
            power, voltage, current, energy, power_factor, frequency
          FROM history
          WHERE ${src.where} AND ${periodWhere} AND ${VALID_SAMPLE_SQL}
          UNION ALL
          SELECT 
            epoch, 
            ${src.phase} as phase,
            power, voltage, current, energy, power_factor, frequency
          FROM telemetry
          WHERE ${src.where} AND ${periodWhere} AND ${VALID_SAMPLE_SQL}
        ),
        buckets AS (
          SELECT 
            TO_CHAR(TO_TIMESTAMP(epoch / 1000.0) AT TIME ZONE 'Asia/Jakarta', 'YYYY-MM') as month_key,
            EXTRACT(MONTH FROM (TO_TIMESTAMP(epoch / 1000.0) AT TIME ZONE 'Asia/Jakarta'))::int as mo,
            EXTRACT(YEAR FROM (TO_TIMESTAMP(epoch / 1000.0) AT TIME ZONE 'Asia/Jakarta'))::int as yr,
            phase,
            power,
            voltage,
            current,
            energy,
            power_factor,
            frequency
          FROM raw_year
        )
        SELECT 
          month_key as bucket_id,
          CASE mo
            WHEN 1 THEN 'Jan'
            WHEN 2 THEN 'Feb'
            WHEN 3 THEN 'Mar'
            WHEN 4 THEN 'Apr'
            WHEN 5 THEN 'Mei'
            WHEN 6 THEN 'Jun'
            WHEN 7 THEN 'Jul'
            WHEN 8 THEN 'Agu'
            WHEN 9 THEN 'Sep'
            WHEN 10 THEN 'Okt'
            WHEN 11 THEN 'Nov'
            WHEN 12 THEN 'Des'
          END as time_str,
          CASE mo
            WHEN 1 THEN 'Januari ' || yr
            WHEN 2 THEN 'Februari ' || yr
            WHEN 3 THEN 'Maret ' || yr
            WHEN 4 THEN 'April ' || yr
            WHEN 5 THEN 'Mei ' || yr
            WHEN 6 THEN 'Juni ' || yr
            WHEN 7 THEN 'Juli ' || yr
            WHEN 8 THEN 'Agustus ' || yr
            WHEN 9 THEN 'September ' || yr
            WHEN 10 THEN 'Oktober ' || yr
            WHEN 11 THEN 'November ' || yr
            WHEN 12 THEN 'Desember ' || yr
          END as full_time,
          phase,
          ROUND(AVG(power)::numeric, 1) as power,
          ROUND(AVG(voltage)::numeric, 1) as voltage,
          ROUND(AVG(current)::numeric, 2) as current,
          ROUND(
            CASE 
              WHEN (MAX(energy) - MIN(energy)) > 0 AND (MAX(energy) - MIN(energy)) <= GREATEST((AVG(power) / 1000.0) * 720 * 1.8 + 50.0, 50.0) THEN (MAX(energy) - MIN(energy))
              ELSE GREATEST(0, (AVG(power) / 1000.0) * 720)
            END::numeric, 
            2
          ) as energy,
          ROUND(AVG(power_factor)::numeric, 2) as power_factor,
          ROUND(AVG(frequency)::numeric, 1) as frequency
        FROM buckets
        GROUP BY month_key, mo, yr, phase
        ORDER BY month_key ASC
      `
    } else {
      // Sesi Audit: Fast integer aggregation with phase normalization
      return `
        WITH raw_sess AS (
          SELECT 
            epoch,
            ${src.phase} as phase,
            power, voltage, current, energy, power_factor, frequency
          FROM history
          WHERE ${src.where} AND ${periodWhere} AND ${VALID_SAMPLE_SQL}
        ),
        agg AS (
          SELECT 
            (epoch / 900000) as bucket_id,
            phase,
            ROUND(AVG(power)::numeric, 1) as power,
            ROUND(AVG(voltage)::numeric, 1) as voltage,
            ROUND(AVG(current)::numeric, 2) as current,
            ROUND(
              CASE 
                WHEN (MAX(energy) - MIN(energy)) > 0 AND (MAX(energy) - MIN(energy)) <= GREATEST((AVG(power) * 0.25 / 1000.0) * 1.8 + 0.1, 0.2) THEN (MAX(energy) - MIN(energy))
                ELSE (AVG(power) * 0.25 / 1000.0)
              END::numeric, 
              2
            ) as energy,
            ROUND(AVG(power_factor)::numeric, 2) as power_factor,
            ROUND(AVG(frequency)::numeric, 1) as frequency
          FROM raw_sess
          GROUP BY (epoch / 900000), phase
        )
        SELECT 
          bucket_id,
          phase,
          TO_CHAR(TO_TIMESTAMP(bucket_id * 900), 'DD/MM HH24:MI') as time_str,
          TO_CHAR(TO_TIMESTAMP(bucket_id * 900), 'YYYY-MM-DD HH24:MI') as full_time,
          power, voltage, current, energy, power_factor, frequency
        FROM agg
        ORDER BY bucket_id ASC
      `
    }

    }

    const pointsRes = await pointsPromise

    // Group rows by bucket_id into single time points with dynamic sensor properties
    const bucketMap = new Map<string, TelemetryPoint>()

    for (const row of pointsRes.rows) {
      if (!bucketMap.has(row.bucket_id)) {
        bucketMap.set(row.bucket_id, {
          timestamp: row.time_str,
          fullTime: row.full_time,
          totalPower: 0,
          totalEnergy: 0,
        })
      }

      const pt = bucketMap.get(row.bucket_id)!
      const phaseKey = row.phase
      const p = parseFloat(row.power) || 0
      const v = parseFloat(row.voltage) || 0
      const a = parseFloat(row.current) || 0
      const pf = parseFloat(row.power_factor) || 0
      const kwh = parseFloat(row.energy) || 0
      const hz = parseFloat(row.frequency) || 0

      pt[`${phaseKey}_power`] = p
      pt[`${phaseKey}_voltage`] = v
      pt[`${phaseKey}_current`] = a
      pt[`${phaseKey}_powerFactor`] = pf
      pt[`${phaseKey}_energy`] = kwh
      pt[`${phaseKey}_frequency`] = hz

      // Accumulate to totalPower & totalEnergy (skip dummy sensor if labeled dummy)
      if (!phaseKey.toLowerCase().includes('dummy') && phaseKey !== 'L6') {
        pt.totalPower = Math.round(((pt.totalPower || 0) + p) * 10) / 10
        pt.totalEnergy = Math.round(((pt.totalEnergy || 0) + kwh) * 100) / 100
      }
    }

    // The counter delta over a long period misses resets, so these totals come from the energy index.
    if (rangeType === 'week' || rangeType === 'month' || rangeType === 'year') {
      const keyLength = rangeType === 'year' ? 7 : 10
      const byPeriod = new Map<string, Record<string, number>>()
      for (const day of energy.daily(deviceId)) {
        const period = byPeriod.get(day.date.slice(0, keyLength)) ?? {}
        for (const [phase, kwh] of Object.entries(day.phases)) period[phase] = (period[phase] ?? 0) + kwh
        byPeriod.set(day.date.slice(0, keyLength), period)
      }
      for (const [key, point] of bucketMap) {
        let total = 0
        for (const [phase, kwh] of Object.entries(byPeriod.get(key) ?? {})) {
          point[`${phase}_energy`] = Math.round(kwh * 100) / 100
          total += kwh
        }
        point.totalEnergy = Math.round(total * 100) / 100
      }
    }

    return { sensors, points: Array.from(bucketMap.values()), availableDates }
}

// Fetch realtime phase data
export async function getLiveTelemetry(storeId: string): Promise<PhaseData[]> {
  const store = await getStoreById(storeId)
  if (!store || !store.deviceId) {
    return []
  }

  const deviceId = store.deviceId
  const aiven = getAivenPool()
  try {
    const src = sqlSource(deviceId, await topologyMap(deviceId), 1, 'phase')
    const res = await aiven.query(
      `
      SELECT DISTINCT ON (1) ${src.phase} AS phase, voltage, current, power, power_factor
      FROM telemetry
      WHERE ${src.where}
      ORDER BY 1, id DESC
    `,
      src.params
    )

    return res.rows.map((row) => ({
      phase: row.phase,
      voltage: parseFloat(row.voltage) || 0,
      current: parseFloat(row.current) || 0,
      power: parseFloat(row.power) || 0,
      powerFactor: parseFloat(row.power_factor) || 0,
    }))
  } catch (error) {
    console.error('Error in getLiveTelemetry:', error)
    return []
  }
}

// Monthly energy and cost of the devices in the viewer's scope; empty when nothing was recorded.
export async function getMonthlyCostSummary(): Promise<MonthlyCostRecord[]> {
  const PLN_TARIFF = 1444.7
  const monthNames = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ]
  const monthNamesShort = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des']

  const rows: { monthKey: string; kwh: number; hours: number; devices: number }[] = []
  try {
    const [devices, energy] = await Promise.all([getIotDeviceDataList(), getEnergyIndex()])
    const months = new Map<string, { kwh: number; hours: number; devices: Set<string> }>()
    for (const { deviceId } of devices) {
      // Sub-meters measure part of a main panel, so they are not added to the bill.
      if (!energy.total(deviceId).hasMain) continue
      for (const day of energy.daily(deviceId)) {
        if (day.mainKwh <= 0) continue
        const key = day.date.slice(0, 7)
        const month = months.get(key) ?? { kwh: 0, hours: 0, devices: new Set<string>() }
        month.kwh += day.mainKwh
        month.hours += day.hours
        month.devices.add(deviceId)
        months.set(key, month)
      }
    }
    for (const [monthKey, m] of [...months.entries()].sort(([a], [b]) => a.localeCompare(b))) {
      rows.push({ monthKey, kwh: m.kwh, hours: m.hours, devices: m.devices.size })
    }
  } catch (error) {
    console.error('Error in getMonthlyCostSummary:', error)
    return []
  }

  const currentMonthKey = new Date()
    .toLocaleDateString('en-CA', { timeZone: 'Asia/Jakarta' })
    .slice(0, 7)

  return rows
    .map((r, i): MonthlyCostRecord => {
      const [y, m] = r.monthKey.split('-').map(Number)
      const prev = i > 0 ? rows[i - 1] : undefined
      return {
        monthKey: r.monthKey,
        monthLabel: `${monthNames[m - 1]} ${y}`,
        monthShortLabel: `${monthNamesShort[m - 1]} ${y}`,
        year: y,
        month: m,
        kwh: Math.round(r.kwh * 10) / 10,
        cost: Math.round(r.kwh * PLN_TARIFF),
        previousCost: prev ? Math.round(prev.kwh * PLN_TARIFF) : undefined,
        diffPercentage: prev ? hourlyAverageDiffPct(r, prev) : undefined,
        isCurrentMonth: r.monthKey === currentMonthKey,
        activeStoresCount: r.devices,
        avgDailyKwh: r.hours > 0 ? Math.round((r.kwh / r.hours) * 24 * 10) / 10 : 0,
      }
    })
    .reverse()
}

