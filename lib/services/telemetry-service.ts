import { getAivenPool } from '@/lib/db/pools'
import {
  Store,
  AuditSession,
  TelemetryPoint,
  PhaseData,
  SensorMeta,
  TelemetryHistoryResult,
  TimeRangeType,
  PaginationMeta,
  DailyConsumption,
  StoreAnalyticsResult,
  LoadProfilePoint,
  MonthlyCostRecord,
  RealMonthlyConsumption,
  MonthlyTrendSummary,
} from '@/lib/types'
import { getStoreById, getStores } from './store-service'

const DEFAULT_PALETTE = [
  '#10b981', // emerald-500
  '#3b82f6', // blue-500
  '#f59e0b', // amber-500
  '#a855f7', // purple-500
  '#ec4899', // pink-500
  '#06b6d4', // cyan-500
  '#f97316', // orange-500
  '#64748b', // slate-500
]

function getSensorColor(phase: string, name: string, index: number): string {
  const p = phase.toUpperCase()
  const n = name.toLowerCase()

  if (n.includes('fase r') || n.includes('phase r') || p === 'L1' || p === 'L12') return '#10b981' // Green (R)
  if (n.includes('fase s') || n.includes('phase s') || p === 'L2' || p === 'L13') return '#3b82f6' // Blue (S)
  if (n.includes('fase t') || n.includes('phase t') || p === 'L3' || p === 'L14') return '#f59e0b' // Amber/Yellow (T)
  if (n.includes('dummy') || p === 'L6') return '#94a3b8' // Slate (Dummy)

  return DEFAULT_PALETTE[index % DEFAULT_PALETTE.length]
}

// Fetch real daily energy consumption trend across recorded days
export async function getDailyConsumptionTrend(): Promise<DailyConsumption[]> {
  const aiven = getAivenPool()
  const PLN_TARIFF = 1444.7

  try {
    // Query combined daily delta energy per phase across telemetry & history sources with phase normalization
    const res = await aiven.query(`
      WITH raw_combined AS (
        SELECT 
          device_id,
          CASE
            WHEN phase IN ('L12', 'L1', 'R', 'r') THEN 'R'
            WHEN phase IN ('L13', 'L2', 'S', 's') THEN 'S'
            WHEN phase IN ('L14', 'L3', 'T', 't') THEN 'T'
            ELSE phase
          END as phase,
          epoch,
          energy
        FROM (
          SELECT device_id, phase, epoch, energy FROM telemetry WHERE energy > 0 AND phase != 'L6' AND phase NOT ILIKE '%dummy%'
          UNION ALL
          SELECT device_id, phase, epoch, energy FROM history WHERE energy > 0 AND phase != 'L6' AND phase NOT ILIKE '%dummy%'
        ) combined
      ),
      per_phase_day AS (
        SELECT 
          device_id,
          phase,
          TO_CHAR(TO_TIMESTAMP(epoch / 1000.0) AT TIME ZONE 'Asia/Jakarta', 'YYYY-MM-DD') as day_date,
          TO_CHAR(TO_TIMESTAMP(epoch / 1000.0) AT TIME ZONE 'Asia/Jakarta', 'Dy') as day_name,
          GREATEST(0, (MAX(energy) - MIN(energy))) as phase_delta
        FROM raw_combined
        GROUP BY device_id, phase, day_date, day_name
      ),
      per_device_day AS (
        SELECT 
          device_id,
          day_date,
          day_name,
          SUM(phase_delta) as delta_kwh
        FROM per_phase_day
        GROUP BY device_id, day_date, day_name
      )
      SELECT 
        day_date,
        day_name,
        ROUND(COALESCE(SUM(delta_kwh), 0)::numeric, 1) as delta_kwh
      FROM per_device_day
      GROUP BY day_date, day_name
      ORDER BY day_date ASC
    `)

    const rows = res.rows
    if (rows.length === 0) return []

    const dayNameMap: Record<string, string> = {
      Mon: 'Sen',
      Tue: 'Sel',
      Wed: 'Rab',
      Thu: 'Kam',
      Fri: 'Jum',
      Sat: 'Sab',
      Sun: 'Min',
    }

    const dayFullMap: Record<string, string> = {
      Mon: 'Senin',
      Tue: 'Selasa',
      Wed: 'Rabu',
      Thu: 'Kamis',
      Fri: 'Jumat',
      Sat: 'Sabtu',
      Sun: 'Minggu',
    }

    const monthNames = [
      'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
      'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ]

    return rows.map((r) => {
      const kwh = Math.max(parseFloat(r.delta_kwh) || 0, 0)
      const shortDay = dayNameMap[r.day_name] || r.day_name
      const fullDay = dayFullMap[r.day_name] || r.day_name
      
      let dayLabel = shortDay
      let dayFullDate = `${fullDay}, ${r.day_date}`
      if (r.day_date) {
        const parts = r.day_date.split('-')
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
        dayDate: r.day_date,
        dayLabel,
        dayFullDate,
        kwh,
        cost: Math.round(kwh * PLN_TARIFF),
      }
    })
  } catch (error) {
    console.error('Error in getDailyConsumptionTrend:', error)
    return []
  }
}

// Fetch store-specific analytics: 24h load profile on latest/selected recorded date & daily consumption
export async function getStoreAnalyticsData(
  storeCodeOrId?: string,
  targetDate?: string
): Promise<StoreAnalyticsResult | null> {
  const aiven = getAivenPool()
  const PLN_TARIFF = 1444.7

  // 1. Dapatkan data store
  let store: Store | null = null
  if (storeCodeOrId) {
    store = await getStoreById(storeCodeOrId)
  }
  if (!store) {
    const stores = await getStores()
    store = stores.find((s) => s.status === 'live') || stores[0] || null
  }

  if (!store) return null

  const deviceId = store.deviceId || 'MC1 :'
  const storeCode = store.code || '2JC2'
  const storeName = store.name || 'DC Cianjur'
  const branch = store.branch || 'CIANJUR'
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
    // 2. Cari tanggal-tanggal rekaman yang tersedia untuk device ini
    const datesRes = await aiven.query(`
      SELECT DISTINCT TO_CHAR(TO_TIMESTAMP(epoch / 1000.0) AT TIME ZONE 'Asia/Jakarta', 'YYYY-MM-DD') as day_date
      FROM (
        SELECT epoch FROM history WHERE device_id = $1
        UNION ALL
        SELECT epoch FROM telemetry WHERE device_id = $1
      ) sub
      ORDER BY day_date DESC
    `, [deviceId])

    let availableDates: string[] = datesRes.rows.map((r) => r.day_date).filter(Boolean)

    // Tentukan anchor date: Jika targetDate spesifik diberikan, pakai targetDate!
    let anchorDate = availableDates[0] || '2026-08-26'
    if (targetDate) {
      anchorDate = targetDate
    } else if (isLive) {
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)
      const yIso = yesterday.toISOString().split('T')[0]
      if (availableDates.includes(yIso)) {
        anchorDate = yIso
      } else if (availableDates.length > 0) {
        anchorDate = availableDates[0]
      }
    }

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

    // 3. Query Profil Beban 24 Jam pada anchorDate (Agregasi per jam 00:00 - 23:00 WIB)
    const loadRes = await aiven.query(`
      SELECT 
        TO_CHAR(TO_TIMESTAMP(epoch / 1000.0) AT TIME ZONE 'Asia/Jakarta', 'HH24:00') as hour_str,
        ROUND(AVG(total_power)::numeric, 1) as avg_power
      FROM (
        SELECT 
          epoch,
          SUM(power) as total_power
        FROM (
          SELECT epoch, phase, power FROM history 
          WHERE device_id = $1 AND TO_CHAR(TO_TIMESTAMP(epoch / 1000.0) AT TIME ZONE 'Asia/Jakarta', 'YYYY-MM-DD') = $2 AND phase != 'L6'
          UNION ALL
          SELECT epoch, phase, power FROM telemetry 
          WHERE device_id = $1 AND TO_CHAR(TO_TIMESTAMP(epoch / 1000.0) AT TIME ZONE 'Asia/Jakarta', 'YYYY-MM-DD') = $2 AND phase != 'L6'
        ) p
        GROUP BY epoch
      ) grouped_epoch
      GROUP BY hour_str
      ORDER BY hour_str ASC
    `, [deviceId, anchorDate])

    const loadMap = new Map<string, number>()
    loadRes.rows.forEach((r) => {
      loadMap.set(r.hour_str, parseFloat(r.avg_power) || 0)
    })

    const loadProfile24h: LoadProfilePoint[] = []
    let peakPowerWatts = 0
    let minPowerWatts = Infinity
    let totalLoadSum = 0
    let validLoadCount = 0

    for (let h = 0; h < 24; h++) {
      const hourStr = `${String(h).padStart(2, '0')}:00`
      let pWatts = loadMap.get(hourStr) || 0
      
      if (pWatts > 0) {
        peakPowerWatts = Math.max(peakPowerWatts, pWatts)
        minPowerWatts = Math.min(minPowerWatts, pWatts)
        totalLoadSum += pWatts
        validLoadCount++
      }

      loadProfile24h.push({
        time: hourStr,
        fullTime: `${hourStr} WIB`,
        powerWatts: Math.round(pWatts),
        powerKw: Math.round((pWatts / 1000) * 10) / 10,
      })
    }

    const avgPowerWatts = validLoadCount > 0 ? Math.round(totalLoadSum / validLoadCount) : 0
    const basePowerWatts = minPowerWatts !== Infinity ? Math.round(minPowerWatts) : 0

    // 4. Query Daily Consumption Trend khusus untuk device ini (per-phase calculation with phase normalization)
    const dailyRes = await aiven.query(`
      WITH raw_combined AS (
        SELECT 
          CASE
            WHEN phase IN ('L12', 'L1', 'R', 'r') THEN 'R'
            WHEN phase IN ('L13', 'L2', 'S', 's') THEN 'S'
            WHEN phase IN ('L14', 'L3', 'T', 't') THEN 'T'
            ELSE phase
          END as phase,
          epoch,
          energy
        FROM (
          SELECT phase, epoch, energy FROM telemetry WHERE device_id = $1 AND energy > 0 AND phase != 'L6' AND phase NOT ILIKE '%dummy%'
          UNION ALL
          SELECT phase, epoch, energy FROM history WHERE device_id = $1 AND energy > 0 AND phase != 'L6' AND phase NOT ILIKE '%dummy%'
        ) combined
      ),
      per_phase_day AS (
        SELECT 
          phase,
          TO_CHAR(TO_TIMESTAMP(epoch / 1000.0) AT TIME ZONE 'Asia/Jakarta', 'YYYY-MM-DD') as day_date,
          TO_CHAR(TO_TIMESTAMP(epoch / 1000.0) AT TIME ZONE 'Asia/Jakarta', 'Dy') as day_name,
          GREATEST(0, (MAX(energy) - MIN(energy))) as phase_delta
        FROM raw_combined
        GROUP BY phase, day_date, day_name
      )
      SELECT 
        day_date,
        day_name,
        ROUND(COALESCE(SUM(phase_delta), 0)::numeric, 1) as delta_kwh
      FROM per_phase_day
      GROUP BY day_date, day_name
      ORDER BY day_date ASC
    `, [deviceId])

    const dailyConsumption: DailyConsumption[] = dailyRes.rows.map((r) => {
      const kwh = Math.max(parseFloat(r.delta_kwh) || 0, 0)
      const shortDay = dayNameMap[r.day_name] || r.day_name
      const fullDay = dayFullMap[r.day_name] || r.day_name
      
      let dayLabel = shortDay
      let dayFullDate = `${fullDay}, ${r.day_date}`
      if (r.day_date) {
        const parts = r.day_date.split('-')
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
        dayDate: r.day_date,
        dayLabel,
        dayFullDate,
        kwh,
        cost: Math.round(kwh * PLN_TARIFF),
      }
    })

    // 5. Query Real Monthly Aggregation recorded in database for this store
    const monthlyYearRes = await aiven.query(`
      WITH raw_combined AS (
        SELECT 
          CASE
            WHEN phase IN ('L12', 'L1', 'R', 'r') THEN 'R'
            WHEN phase IN ('L13', 'L2', 'S', 's') THEN 'S'
            WHEN phase IN ('L14', 'L3', 'T', 't') THEN 'T'
            ELSE phase
          END as phase,
          epoch,
          energy
        FROM (
          SELECT phase, epoch, energy FROM telemetry WHERE device_id = $1 AND energy > 0 AND phase != 'L6' AND phase NOT ILIKE '%dummy%'
          UNION ALL
          SELECT phase, epoch, energy FROM history WHERE device_id = $1 AND energy > 0 AND phase != 'L6' AND phase NOT ILIKE '%dummy%'
        ) combined
      ),
      per_phase_month AS (
        SELECT 
          phase,
          TO_CHAR(TO_TIMESTAMP(epoch / 1000.0) AT TIME ZONE 'Asia/Jakarta', 'YYYY-MM') as month_key,
          EXTRACT(YEAR FROM (TO_TIMESTAMP(epoch / 1000.0) AT TIME ZONE 'Asia/Jakarta')) as yr,
          EXTRACT(MONTH FROM (TO_TIMESTAMP(epoch / 1000.0) AT TIME ZONE 'Asia/Jakarta')) as mo,
          GREATEST(0, (MAX(energy) - MIN(energy))) as phase_delta
        FROM raw_combined
        GROUP BY phase, month_key, yr, mo
      )
      SELECT 
        month_key,
        yr::int as yr,
        mo::int as mo,
        ROUND(COALESCE(SUM(phase_delta), 0)::numeric, 1) as delta_kwh
      FROM per_phase_month
      GROUP BY month_key, yr, mo
      HAVING COALESCE(SUM(phase_delta), 0) > 0
      ORDER BY month_key ASC
    `, [deviceId])

    let monthlyHistory: RealMonthlyConsumption[] = []
    const monthShortLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des']

    if (monthlyYearRes.rows.length > 0) {
      monthlyYearRes.rows.forEach((r, idx) => {
        const kwh = Math.max(parseFloat(r.delta_kwh) || 0, 0)
        const cost = Math.round(kwh * PLN_TARIFF)
        const m = r.mo || 1
        const y = r.yr || 2026
        const monthLabel = `${monthShortLabels[m - 1]} ${y}`
        
        let diffPct: number | undefined = undefined
        if (idx > 0) {
          const prevKwh = monthlyHistory[idx - 1].kwh
          if (prevKwh > 0) {
            diffPct = Math.round(((kwh - prevKwh) / prevKwh) * 1000) / 10
          }
        }

        monthlyHistory.push({
          monthKey: r.month_key,
          monthLabel,
          year: y,
          month: m,
          kwh,
          cost,
          diffPct,
          isLatest: idx === monthlyYearRes.rows.length - 1,
        })
      })
    } else {
      // Fallback: If no direct monthly partition found, aggregate from store's daily consumption
      const monthMap = new Map<string, number>()
      dailyConsumption.forEach((d) => {
        if (d.dayDate) {
          const mKey = d.dayDate.substring(0, 7) // "YYYY-MM"
          monthMap.set(mKey, (monthMap.get(mKey) || 0) + d.kwh)
        }
      })

      const sortedKeys = Array.from(monthMap.keys()).sort()
      sortedKeys.forEach((mKey, idx) => {
        const [yStr, mStr] = mKey.split('-')
        const y = parseInt(yStr, 10) || 2026
        const m = parseInt(mStr, 10) || 1
        const kwh = Math.round((monthMap.get(mKey) || 0) * 10) / 10
        const cost = Math.round(kwh * PLN_TARIFF)
        const monthLabel = `${monthShortLabels[m - 1]} ${y}`

        let diffPct: number | undefined = undefined
        if (idx > 0) {
          const prevKwh = monthlyHistory[idx - 1].kwh
          if (prevKwh > 0) {
            diffPct = Math.round(((kwh - prevKwh) / prevKwh) * 1000) / 10
          }
        }

        monthlyHistory.push({
          monthKey: mKey,
          monthLabel,
          year: y,
          month: m,
          kwh,
          cost,
          diffPct,
          isLatest: idx === sortedKeys.length - 1,
        })
      })
    }

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

    // Ensure availableDates includes all recorded dates from both dates query and daily aggregation
    if (availableDates.length === 0 && dailyConsumption.length > 0) {
      const set = new Set<string>()
      dailyConsumption.forEach((d) => {
        if (d.dayDate) set.add(d.dayDate)
      })
      availableDates = Array.from(set).sort().reverse()
    }

    return {
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
    }
  } catch (error) {
    console.error('Error in getStoreAnalyticsData:', error)
    return null
  }
}

// Fetch list of audit recording sessions for a store
export async function getAuditSessions(storeId: string): Promise<AuditSession[]> {
  const store = await getStoreById(storeId)
  if (!store || !store.deviceId) {
    return []
  }

  const deviceId = store.deviceId
  const aiven = getAivenPool()
  try {
    const res = await aiven.query(
      `
      SELECT session_id, session_name, MIN(timestamp) as start_time, MAX(timestamp) as end_time, MIN(epoch) as min_epoch, MAX(epoch) as max_epoch, COUNT(*) as total_rows
      FROM history
      WHERE device_id = $1
      GROUP BY session_id, session_name
      ORDER BY MAX(epoch) DESC
    `,
      [deviceId]
    )

    if (res.rows.length === 0) {
      return []
    }

    return res.rows.map((row, index) => ({
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

interface CachedHistoryPayload {
  sensors: SensorMeta[]
  points: TelemetryPoint[]
  availableDates: string[]
  timestamp: number
}

// In-memory cache for aggregated telemetry history (TTL: 30 minutes)
const _historyCache = new Map<string, CachedHistoryPayload>()
const CACHE_TTL_MS = 30 * 60 * 1000

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
  const aiven = getAivenPool()

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

  // Generate cache key
  const cacheKey = `${deviceId}_${rangeType}_${targetSessionId || targetDate || 'default'}`
  const cached = _historyCache.get(cacheKey)

  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    let returnPoints = cached.points
    let paginationMeta: PaginationMeta | undefined = undefined

    if (rangeType === 'session') {
      const totalPoints = cached.points.length
      const totalPages = Math.max(Math.ceil(totalPoints / pageSize), 1)
      const validPage = Math.min(Math.max(page, 1), totalPages)

      // Page 1 = Latest window (paling baru), Page 2+ = Mundur ke waktu sebelumnya
      const endIndex = Math.max(totalPoints - (validPage - 1) * pageSize, 0)
      const startIndex = Math.max(endIndex - pageSize, 0)

      returnPoints = cached.points.slice(startIndex, endIndex)
      paginationMeta = {
        page: validPage,
        totalPages,
        totalPoints,
        pageSize,
      }
    }

    return {
      sensors: cached.sensors,
      points: returnPoints,
      availableDates: cached.availableDates,
      pagination: paginationMeta,
    }
  }

  try {
    // 1. Get available dates sorted from newest (DESC) across history & telemetry
    const datesRes = await aiven.query(
      `
      SELECT DISTINCT TO_CHAR(TO_TIMESTAMP(epoch / 1000.0) AT TIME ZONE 'Asia/Jakarta', 'YYYY-MM-DD') as date_str
      FROM (
        SELECT epoch FROM history WHERE device_id = $1
        UNION ALL
        SELECT epoch FROM telemetry WHERE device_id = $1
      ) sub
      ORDER BY date_str DESC
    `,
      [deviceId]
    )

    const availableDates: string[] = datesRes.rows.map((r) => r.date_str)

    // Set default target date to newest available date
    if (!targetDate && availableDates.length > 0) {
      targetDate = availableDates[0] // e.g. '2026-08-18'
    }

    // 2. Fetch distinct sensors SCOPED to the active query with phase normalization
    let sensorWhere = `WHERE phase != 'L6' AND phase NOT ILIKE '%dummy%'`
    const sensorParams: any[] = [deviceId]

    if (rangeType === 'session' && targetSessionId) {
      sensorWhere += ` AND session_id = $2`
      sensorParams.push(targetSessionId)
    } else if (rangeType === 'day' && targetDate) {
      sensorWhere += ` AND (TO_TIMESTAMP(epoch / 1000.0) AT TIME ZONE 'Asia/Jakarta')::date = $2::date`
      sensorParams.push(targetDate)
    } else if (rangeType === 'week' && targetDate) {
      sensorWhere += ` AND (TO_TIMESTAMP(epoch / 1000.0) AT TIME ZONE 'Asia/Jakarta')::date <= $2::date 
                     AND (TO_TIMESTAMP(epoch / 1000.0) AT TIME ZONE 'Asia/Jakarta')::date >= ($2::date - interval '6 days')`
      sensorParams.push(targetDate)
    }

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
          SELECT phase, phase_name, epoch, session_id FROM history WHERE device_id = $1
          UNION ALL
          SELECT phase, NULL as phase_name, epoch, NULL as session_id FROM telemetry WHERE device_id = $1
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

    let sensorRes = await aiven.query(sensorSql, sensorParams)

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
            SELECT phase, phase_name FROM history WHERE device_id = $1
            UNION ALL
            SELECT phase, NULL as phase_name FROM telemetry WHERE device_id = $1
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
        [deviceId]
      )
    }

    // Get device sensor config from devices table to resolve human-readable names if needed
    const devSensorRes = await aiven.query(
      `SELECT sensors FROM devices WHERE id = $1`,
      [deviceId]
    )
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

    let pointsQuery = ''
    let queryParams: any[] = [deviceId]
    let paginationMeta: PaginationMeta | undefined = undefined

    // 3. Construct specific SQL query per range mode with phase normalization
    if (rangeType === 'day') {
      // Harian: Rata-rata per 1 jam (24 jam) menggabungkan telemetry + history
      queryParams.push(targetDate || '2026-08-18')
      pointsQuery = `
        WITH raw_day AS (
          SELECT 
            epoch, 
            CASE
              WHEN phase IN ('L12', 'L1', 'R', 'r') THEN 'R'
              WHEN phase IN ('L13', 'L2', 'S', 's') THEN 'S'
              WHEN phase IN ('L14', 'L3', 'T', 't') THEN 'T'
              ELSE phase
            END as phase,
            power, voltage, current, energy, power_factor, frequency
          FROM history
          WHERE device_id = $1 AND (TO_TIMESTAMP(epoch / 1000.0) AT TIME ZONE 'Asia/Jakarta')::date = $2::date
          UNION ALL
          SELECT 
            epoch, 
            CASE
              WHEN phase IN ('L12', 'L1', 'R', 'r') THEN 'R'
              WHEN phase IN ('L13', 'L2', 'S', 's') THEN 'S'
              WHEN phase IN ('L14', 'L3', 'T', 't') THEN 'T'
              ELSE phase
            END as phase,
            power, voltage, current, energy, power_factor, frequency
          FROM telemetry
          WHERE device_id = $1 AND (TO_TIMESTAMP(epoch / 1000.0) AT TIME ZONE 'Asia/Jakarta')::date = $2::date
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
          ROUND(MAX(energy)::numeric, 3) as energy,
          ROUND(AVG(power_factor)::numeric, 2) as power_factor,
          ROUND(AVG(frequency)::numeric, 1) as frequency
        FROM buckets
        GROUP BY bucket_id, time_str, full_time, phase
        ORDER BY bucket_id ASC
      `
    } else if (rangeType === 'week') {
      // Mingguan: Rata-rata per 1 hari (7 hari terakhir dari tanggal terpilih) menggabungkan telemetry + history
      queryParams.push(targetDate || '2026-08-18')
      pointsQuery = `
        WITH raw_week AS (
          SELECT 
            epoch, 
            CASE
              WHEN phase IN ('L12', 'L1', 'R', 'r') THEN 'R'
              WHEN phase IN ('L13', 'L2', 'S', 's') THEN 'S'
              WHEN phase IN ('L14', 'L3', 'T', 't') THEN 'T'
              ELSE phase
            END as phase,
            power, voltage, current, energy, power_factor, frequency
          FROM history
          WHERE device_id = $1 
            AND (TO_TIMESTAMP(epoch / 1000.0) AT TIME ZONE 'Asia/Jakarta')::date >= ($2::date - interval '6 days')
            AND (TO_TIMESTAMP(epoch / 1000.0) AT TIME ZONE 'Asia/Jakarta')::date <= $2::date
          UNION ALL
          SELECT 
            epoch, 
            CASE
              WHEN phase IN ('L12', 'L1', 'R', 'r') THEN 'R'
              WHEN phase IN ('L13', 'L2', 'S', 's') THEN 'S'
              WHEN phase IN ('L14', 'L3', 'T', 't') THEN 'T'
              ELSE phase
            END as phase,
            power, voltage, current, energy, power_factor, frequency
          FROM telemetry
          WHERE device_id = $1 
            AND (TO_TIMESTAMP(epoch / 1000.0) AT TIME ZONE 'Asia/Jakarta')::date >= ($2::date - interval '6 days')
            AND (TO_TIMESTAMP(epoch / 1000.0) AT TIME ZONE 'Asia/Jakarta')::date <= $2::date
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
          ROUND(GREATEST(0, (MAX(energy) - MIN(energy)))::numeric, 2) as energy,
          ROUND(AVG(power_factor)::numeric, 2) as power_factor,
          ROUND(AVG(frequency)::numeric, 1) as frequency
        FROM buckets
        GROUP BY day_key, time_str, full_time, phase
        ORDER BY day_key ASC
      `
    } else {
      // Sesi Audit: Fast integer aggregation with phase normalization
      if (!targetSessionId) {
        const latestSessRes = await aiven.query(
          `SELECT session_id FROM history WHERE device_id = $1 ORDER BY epoch DESC LIMIT 1`,
          [deviceId]
        )
        if (latestSessRes.rows.length > 0) {
          targetSessionId = latestSessRes.rows[0].session_id
        }
      }

      queryParams.push(targetSessionId || '')
      pointsQuery = `
        WITH raw_sess AS (
          SELECT 
            epoch,
            CASE
              WHEN phase IN ('L12', 'L1', 'R', 'r') THEN 'R'
              WHEN phase IN ('L13', 'L2', 'S', 's') THEN 'S'
              WHEN phase IN ('L14', 'L3', 'T', 't') THEN 'T'
              ELSE phase
            END as phase,
            power, voltage, current, energy, power_factor, frequency
          FROM history
          WHERE device_id = $1 AND session_id = $2
        ),
        agg AS (
          SELECT 
            (epoch / 900000) as bucket_id,
            phase,
            ROUND(AVG(power)::numeric, 1) as power,
            ROUND(AVG(voltage)::numeric, 1) as voltage,
            ROUND(AVG(current)::numeric, 2) as current,
            ROUND(AVG(energy)::numeric, 3) as energy,
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

    const pointsRes = await aiven.query(pointsQuery, queryParams)

    // Group rows by bucket_id into single time points with dynamic sensor properties
    const bucketMap = new Map<string, TelemetryPoint>()

    for (const row of pointsRes.rows) {
      if (!bucketMap.has(row.bucket_id)) {
        bucketMap.set(row.bucket_id, {
          timestamp: row.time_str,
          fullTime: row.full_time,
          totalPower: 0,
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

      // Accumulate to totalPower (skip dummy sensor if labeled dummy)
      if (!phaseKey.toLowerCase().includes('dummy') && phaseKey !== 'L6') {
        pt.totalPower = Math.round(((pt.totalPower || 0) + p) * 10) / 10
      }
    }

    const allPoints = Array.from(bucketMap.values())

    // Save to in-memory cache for blazing fast subsequent pagination & metric switching
    _historyCache.set(cacheKey, {
      sensors,
      points: allPoints,
      availableDates,
      timestamp: Date.now(),
    })

    let points = allPoints

    // For session mode: apply pagination (Page 1 = Latest window, Page 2+ = Mundur ke waktu sebelumnya)
    if (rangeType === 'session') {
      const totalPoints = points.length
      const totalPages = Math.max(Math.ceil(totalPoints / pageSize), 1)
      const validPage = Math.min(Math.max(page, 1), totalPages)
      const endIndex = Math.max(totalPoints - (validPage - 1) * pageSize, 0)
      const startIndex = Math.max(endIndex - pageSize, 0)

      points = points.slice(startIndex, endIndex)
      paginationMeta = {
        page: validPage,
        totalPages,
        totalPoints,
        pageSize,
      }
    }

    return {
      sensors,
      points,
      availableDates,
      pagination: paginationMeta,
    }
  } catch (error) {
    console.error('Error in getTelemetryHistory:', error)
    return { sensors: [], points: [], availableDates: [] }
  }
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
    const res = await aiven.query(
      `
      SELECT DISTINCT ON (phase) phase, voltage, current, power, power_factor
      FROM telemetry
      WHERE device_id = $1
      ORDER BY phase, id DESC
    `,
      [deviceId]
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

// Fetch monthly energy consumption & cost history across all recorded months
export async function getMonthlyCostSummary(): Promise<MonthlyCostRecord[]> {
  const aiven = getAivenPool()
  const PLN_TARIFF = 1444.7

  const monthNames = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ]
  const monthNamesShort = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des']

  try {
    const res = await aiven.query(`
      WITH raw_combined AS (
        SELECT 
          device_id,
          CASE
            WHEN phase IN ('L12', 'L1', 'R', 'r') THEN 'R'
            WHEN phase IN ('L13', 'L2', 'S', 's') THEN 'S'
            WHEN phase IN ('L14', 'L3', 'T', 't') THEN 'T'
            ELSE phase
          END as phase,
          epoch,
          energy
        FROM (
          SELECT device_id, phase, epoch, energy FROM telemetry WHERE energy > 0 AND phase != 'L6' AND phase NOT ILIKE '%dummy%'
          UNION ALL
          SELECT device_id, phase, epoch, energy FROM history WHERE energy > 0 AND phase != 'L6' AND phase NOT ILIKE '%dummy%'
        ) combined
      ),
      per_phase_month AS (
        SELECT 
          device_id,
          phase,
          TO_CHAR(TO_TIMESTAMP(epoch / 1000.0) AT TIME ZONE 'Asia/Jakarta', 'YYYY-MM') as month_key,
          GREATEST(0, (MAX(energy) - MIN(energy))) as phase_delta,
          COUNT(DISTINCT TO_CHAR(TO_TIMESTAMP(epoch / 1000.0) AT TIME ZONE 'Asia/Jakarta', 'YYYY-MM-DD')) as active_days
        FROM raw_combined
        GROUP BY device_id, phase, month_key
      ),
      per_month AS (
        SELECT 
          month_key,
          COUNT(DISTINCT device_id) as active_devices,
          MAX(active_days) as max_days,
          SUM(phase_delta) as delta_kwh
        FROM per_phase_month
        GROUP BY month_key
      )
      SELECT 
        month_key,
        active_devices,
        COALESCE(max_days, 1) as recorded_days,
        ROUND(COALESCE(delta_kwh, 0)::numeric, 1) as delta_kwh
      FROM per_month
      WHERE month_key IS NOT NULL
      ORDER BY month_key ASC
    `)

    const rows = res.rows || []
    const now = new Date()
    const currentMonthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`

    if (rows.length === 0) {
      const stores = await getStores()
      const totalKwh = stores.reduce((acc, s) => acc + (s.kwhTotal || 0), 0)
      const cost = Math.round(totalKwh * PLN_TARIFF)
      const y = now.getFullYear()
      const m = now.getMonth()

      return [
        {
          monthKey: currentMonthKey,
          monthLabel: `${monthNames[m]} ${y}`,
          monthShortLabel: `${monthNamesShort[m]} ${y}`,
          year: y,
          month: m + 1,
          kwh: Math.round(totalKwh * 10) / 10,
          cost,
          isCurrentMonth: true,
          activeStoresCount: stores.filter((s) => s.status === 'live').length || stores.length,
          avgDailyKwh: Math.round((totalKwh / 30) * 10) / 10,
        },
      ]
    }

    const records: MonthlyCostRecord[] = []

    for (let i = 0; i < rows.length; i++) {
      const r = rows[i]
      const [yStr, mStr] = (r.month_key || '').split('-')
      const y = parseInt(yStr, 10) || now.getFullYear()
      const m = parseInt(mStr, 10) || 1
      const kwh = Math.max(parseFloat(r.delta_kwh) || 0, 0)
      const cost = Math.round(kwh * PLN_TARIFF)
      const recordedDays = parseInt(r.recorded_days, 10) || 1

      const prev = i > 0 ? records[i - 1] : undefined
      const prevCost = prev ? prev.cost : undefined
      let diffPercentage: number | undefined = undefined
      if (prevCost && prevCost > 0) {
        diffPercentage = Math.round(((cost - prevCost) / prevCost) * 1000) / 10
      }

      records.push({
        monthKey: r.month_key,
        monthLabel: `${monthNames[m - 1]} ${y}`,
        monthShortLabel: `${monthNamesShort[m - 1]} ${y}`,
        year: y,
        month: m,
        kwh,
        cost,
        previousCost: prevCost,
        diffPercentage,
        isCurrentMonth: r.month_key === currentMonthKey || i === rows.length - 1,
        activeStoresCount: parseInt(r.active_devices, 10) || 1,
        avgDailyKwh: Math.round((kwh / Math.max(1, recordedDays)) * 10) / 10,
      })
    }

    return records.reverse()
  } catch (error) {
    console.error('Error in getMonthlyCostSummary:', error)
    return []
  }
}

