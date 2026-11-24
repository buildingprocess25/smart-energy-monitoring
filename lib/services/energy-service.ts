import 'server-only'
import { getTelemetryPool } from '@/lib/db/pools'
import { readOnlyQuery } from '@/lib/db/read-only'
import { BUCKET_MS, createEnergyIndex, type BucketRow, type EnergyIndex } from '@/lib/energy-index'
import { createStaleCache } from '@/lib/stale-cache'

// history holds over 2 million rows, so it is read once and then only past the last id.
const REFRESH_MS = 60_000
// Renamed, shifted or deleted sessions only show up in a full read.
const FULL_READ_MS = 6 * 60 * 60 * 1000
const REPLAY_READ_MS = 15 * 60 * 1000
const FULL_READ_TIMEOUT_MS = 30_000
// Rows committed out of id order near the last read are read again.
const ID_OVERLAP = 200

export const PHASE_SQL = `CASE
  WHEN phase IN ('L12', 'L1', 'R', 'r') THEN 'R'
  WHEN phase IN ('L13', 'L2', 'S', 's') THEN 'S'
  WHEN phase IN ('L14', 'L3', 'T', 't') THEN 'T'
  ELSE phase
END`

// Broken sensor frames (12 to 14 October 2026) carry 512 V and millions of ampere.
export const VALID_SAMPLE_SQL = `offline IS NOT TRUE AND voltage <= 300 AND current <= 500`
export const SENSOR_PHASE_SQL = `phase <> 'L6' AND phase NOT ILIKE '%dummy%'`

type Table = 'history' | 'telemetry'
type Row = {
  device_id: string
  phase: string
  bucket: string
  min_energy: number | null
  max_energy: number | null
  power_sum: number | null
  samples: string
}

interface EnergyState {
  index: EnergyIndex
  lastIds: Record<Table, number>
  fullReadAt: number
  replayedAt: string | null
}

async function readBuckets(
  table: Table,
  after: number,
  upTo: number
): Promise<BucketRow[]> {
  const res = await readOnlyQuery<Row>(
    getTelemetryPool(),
    `SELECT device_id, ${PHASE_SQL} AS phase, epoch / ${BUCKET_MS} AS bucket,
            MIN(energy) FILTER (WHERE energy > 0) AS min_energy,
            MAX(energy) FILTER (WHERE energy > 0) AS max_energy,
            SUM(power) AS power_sum, COUNT(*) AS samples
     FROM ${table}
     WHERE id > $1 AND id <= $2 AND ${VALID_SAMPLE_SQL} AND ${SENSOR_PHASE_SQL}
     GROUP BY 1, 2, 3`,
    [after, upTo],
    FULL_READ_TIMEOUT_MS
  )
  return res.rows.map((r) => ({
    deviceId: r.device_id,
    phase: r.phase,
    bucket: Number(r.bucket),
    min: r.min_energy,
    max: r.max_energy,
    powerSum: r.power_sum ?? 0,
    count: Number(r.samples),
  }))
}

async function lastId(table: Table): Promise<number> {
  const res = await readOnlyQuery<{ id: number | null }>(
    getTelemetryPool(),
    `SELECT MAX(id) AS id FROM ${table}`,
    []
  )
  return res.rows[0]?.id ?? 0
}

// Devices that were offline fill old telemetry rows in place, which reading past the last id misses.
async function lastReplay(): Promise<string | null> {
  try {
    const res = await readOnlyQuery<{ at: string | null }>(
      getTelemetryPool(),
      'SELECT MAX(replayed_at)::text AS at FROM buffered_telemetry',
      []
    )
    return res.rows[0]?.at ?? null
  } catch {
    return globalThis._energyState?.replayedAt ?? null
  }
}

// Pages, API routes and instrumentation.ts are bundled apart; globalThis gives them one index.
declare global {
  var _energyState: EnergyState | undefined
  var _energyCache: ReturnType<typeof createStaleCache<EnergyIndex>> | undefined
}

async function refresh(): Promise<EnergyIndex> {
  const state = globalThis._energyState
  const replayedAt = await lastReplay()
  const age = state ? Date.now() - state.fullReadAt : Infinity
  const healed = state !== undefined && replayedAt !== state.replayedAt && age > REPLAY_READ_MS
  const full = !state || healed || age > FULL_READ_MS
  const next: EnergyState =
    full || !state
      ? { index: createEnergyIndex(), lastIds: { history: 0, telemetry: 0 }, fullReadAt: Date.now(), replayedAt }
      : state

  // Both tables are read before anything is merged, so a failed read changes nothing.
  const reads: { table: Table; upTo: number; rows: BucketRow[] }[] = []
  for (const table of ['history', 'telemetry'] as const) {
    const upTo = await lastId(table)
    const after = Math.max(0, next.lastIds[table] - ID_OVERLAP)
    reads.push({ table, upTo, rows: await readBuckets(table, after, upTo) })
  }
  for (const { table, upTo, rows } of reads) {
    next.index.merge(rows)
    next.lastIds[table] = upTo
  }
  globalThis._energyState = next
  return next.index
}

const energyCache = (globalThis._energyCache ??= createStaleCache<EnergyIndex>({
  ttlMs: REFRESH_MS,
  onError: (error) => console.error('Error refreshing energy index:', error),
}))

// Holds every device. Callers must only ask for devices in the viewer's scope.
export function getEnergyIndex(): Promise<EnergyIndex> {
  return energyCache('all', refresh)
}

// Right after a restart the first full read takes seconds; null means it is not ready yet.
export async function getEnergyIndexWithin(ms: number): Promise<EnergyIndex | null> {
  let timer: ReturnType<typeof setTimeout> | undefined
  const late = new Promise<null>((resolve) => {
    timer = setTimeout(() => resolve(null), ms)
  })
  try {
    return await Promise.race([getEnergyIndex(), late])
  } finally {
    clearTimeout(timer)
  }
}

// Deleted rows are only noticed by a full read.
export function requestFullEnergyRead() {
  if (globalThis._energyState) globalThis._energyState.fullReadAt = 0
}
