import { getAivenPool } from '@/lib/db/pools'
import {
  AuditSession,
  TelemetryPoint,
  PhaseData,
  SensorMeta,
  TelemetryHistoryResult,
  TimeRangeType,
  PaginationMeta,
} from '@/lib/types'
import { getStoreById } from './store-service'

export interface DailyConsumption {
  day: string
  dayDate: string
  kwh: number
  cost: number
}

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

  if (p === 'L12' || n.includes('fase r')) return '#10b981' // Green (R)
  if (p === 'L13' || n.includes('fase s')) return '#3b82f6' // Blue (S)
  if (p === 'L14' || n.includes('fase t')) return '#f59e0b' // Amber/Yellow (T)
  if (n.includes('dummy') || p === 'L6') return '#94a3b8' // Slate (Dummy)

  return DEFAULT_PALETTE[index % DEFAULT_PALETTE.length]
}

// Fetch real daily energy consumption trend over the last recorded days
export async function getDailyConsumptionTrend(): Promise<DailyConsumption[]> {
  const aiven = getAivenPool()
  const PLN_TARIFF = 1444.7

  try {
    const res = await aiven.query(`
      SELECT 
        TO_CHAR(TO_TIMESTAMP(epoch / 1000), 'YYYY-MM-DD') as day_date,
        TO_CHAR(TO_TIMESTAMP(epoch / 1000), 'Dy') as day_name,
        ROUND((MAX(energy) - MIN(energy))::numeric, 1) as delta_kwh
      FROM history
      WHERE device_id = 'MC1 :'
      GROUP BY day_date, day_name
      ORDER BY day_date DESC
      LIMIT 7
    `)

    if (res.rows.length === 0) return []

    const dayNameMap: Record<string, string> = {
      Mon: 'Sen',
      Tue: 'Sel',
      Wed: 'Rab',
      Thu: 'Kam',
      Fri: 'Jum',
      Sat: 'Sab',
      Sun: 'Min',
    }

    return res.rows.reverse().map((r) => {
      const kwh = parseFloat(r.delta_kwh) || 0
      return {
        day: dayNameMap[r.day_name] || r.day_name,
        dayDate: r.day_date,
        kwh,
        cost: Math.round(kwh * PLN_TARIFF),
      }
    })
  } catch (error) {
    console.error('Error in getDailyConsumptionTrend:', error)
    return []
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

  try {
    // 1. Get available dates sorted from newest (DESC)
    const datesRes = await aiven.query(
      `
      SELECT DISTINCT TO_CHAR(TO_TIMESTAMP(epoch / 1000), 'YYYY-MM-DD') as date_str
      FROM history
      WHERE device_id = $1
      ORDER BY date_str DESC
    `,
      [deviceId]
    )

    const availableDates: string[] = datesRes.rows.map((r) => r.date_str)

    // Set default target date to newest available date
    if (!targetDate && availableDates.length > 0) {
      targetDate = availableDates[0] // e.g. '2026-08-18'
    }

    // 2. Fetch distinct sensors
    const sensorRes = await aiven.query(
      `
      SELECT phase, COALESCE(NULLIF(MAX(phase_name), ''), phase) as name, COUNT(*) as count
      FROM history
      WHERE device_id = $1
      GROUP BY phase
      ORDER BY phase ASC
    `,
      [deviceId]
    )

    const sensors: SensorMeta[] = sensorRes.rows.map((r, index) => ({
      phase: r.phase,
      name: r.name,
      color: getSensorColor(r.phase, r.name, index),
    }))

    let pointsQuery = ''
    let queryParams: any[] = [deviceId]
    let paginationMeta: PaginationMeta | undefined = undefined

    // 3. Construct specific SQL query per range mode
    if (rangeType === 'day') {
      // Harian: Rata-rata per 1 jam (24 jam)
      queryParams.push(targetDate || '2026-08-18')
      pointsQuery = `
        WITH buckets AS (
          SELECT 
            (epoch / (1000 * 60 * 60)) as bucket_id,
            TO_CHAR(TO_TIMESTAMP(epoch / 1000), 'HH24:00') as time_str,
            TO_CHAR(TO_TIMESTAMP(epoch / 1000), 'YYYY-MM-DD HH24:00') as full_time,
            phase,
            power,
            voltage,
            current,
            energy,
            power_factor,
            frequency
          FROM history
          WHERE device_id = $1 AND TO_CHAR(TO_TIMESTAMP(epoch / 1000), 'YYYY-MM-DD') = $2
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
      // Mingguan: Rata-rata per 1 hari (7 hari terakhir dari tanggal terpilih)
      queryParams.push(targetDate || '2026-08-18')
      pointsQuery = `
        WITH buckets AS (
          SELECT 
            TO_CHAR(TO_TIMESTAMP(epoch / 1000), 'YYYY-MM-DD') as day_key,
            TO_CHAR(TO_TIMESTAMP(epoch / 1000), 'Dy, DD/MM') as time_str,
            TO_CHAR(TO_TIMESTAMP(epoch / 1000), 'YYYY-MM-DD') as full_time,
            phase,
            power,
            voltage,
            current,
            energy,
            power_factor,
            frequency
          FROM history
          WHERE device_id = $1 
            AND TO_TIMESTAMP(epoch / 1000) >= ($2::date - interval '6 days')
            AND TO_TIMESTAMP(epoch / 1000) < ($2::date + interval '1 day')
        )
        SELECT 
          day_key as bucket_id,
          time_str,
          full_time,
          phase,
          ROUND(AVG(power)::numeric, 1) as power,
          ROUND(AVG(voltage)::numeric, 1) as voltage,
          ROUND(AVG(current)::numeric, 2) as current,
          ROUND((MAX(energy) - MIN(energy))::numeric, 2) as energy,
          ROUND(AVG(power_factor)::numeric, 2) as power_factor,
          ROUND(AVG(frequency)::numeric, 1) as frequency
        FROM buckets
        GROUP BY day_key, time_str, full_time, phase
        ORDER BY day_key ASC
      `
    } else {
      // Sesi Audit: Detail per 15 menit dengan pagination (windowing)
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
        WITH buckets AS (
          SELECT 
            (epoch / (1000 * 60 * 15)) as bucket_id,
            TO_CHAR(TO_TIMESTAMP(epoch / 1000), 'DD/MM HH24:MI') as time_str,
            TO_CHAR(TO_TIMESTAMP(epoch / 1000), 'YYYY-MM-DD HH24:MI') as full_time,
            phase,
            power,
            voltage,
            current,
            energy,
            power_factor,
            frequency
          FROM history
          WHERE device_id = $1 AND session_id = $2
        )
        SELECT 
          bucket_id,
          time_str,
          full_time,
          phase,
          ROUND(AVG(power)::numeric, 1) as power,
          ROUND(AVG(voltage)::numeric, 1) as voltage,
          ROUND(AVG(current)::numeric, 2) as current,
          ROUND(AVG(energy)::numeric, 3) as energy,
          ROUND(AVG(power_factor)::numeric, 2) as power_factor,
          ROUND(AVG(frequency)::numeric, 1) as frequency
        FROM buckets
        GROUP BY bucket_id, time_str, full_time, phase
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

    let points = Array.from(bucketMap.values())

    // For session mode: apply pagination
    if (rangeType === 'session') {
      const totalPoints = points.length
      const totalPages = Math.max(Math.ceil(totalPoints / pageSize), 1)
      const validPage = Math.min(Math.max(page, 1), totalPages)
      const startIndex = (validPage - 1) * pageSize
      const endIndex = startIndex + pageSize

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
