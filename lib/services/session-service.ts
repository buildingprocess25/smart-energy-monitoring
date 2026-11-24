import 'server-only'
import type { RecordingSessionSummary, SessionRecordsResult, Store } from '@/lib/types'
import type { AccessScope } from '@/lib/auth/access-rules'
import { getTelemetryPool } from '@/lib/db/pools'
import { readOnlyQuery } from '@/lib/db/read-only'
import { getRequestScope } from '@/lib/auth/access'
import { isDeviceAllowed, scopeKey } from '@/lib/auth/access-rules'
import { sessionStore } from '@/lib/store-code'
import { createSharedFetch } from '@/lib/shared-fetch'
import { createStaleCache } from '@/lib/stale-cache'
import { getStores } from '@/lib/services/store-service'
import { groupSessionRows, type HistoryRow } from '@/lib/session-records'

// Above this many rows the JSON response gets too large for the browser to export.
export const MAX_SESSION_RECORDS = 200_000

export class SessionTooLargeError extends Error {}

type SessionListRow = {
  device_id: string
  session_id: string
  session_name: string | null
  device_name: string | null
  start_epoch: string
  end_epoch: string
  total_rows: string
  phases: string[] | null
}

// Queries run one after another on a single connection at a time, inside READ ONLY
// transactions with a 15 s statement timeout, so Flask's INSERTs never wait on the portal.
async function loadSessionRows(scope: AccessScope) {
  const filter = scope.kind === 'devices' ? 'WHERE device_id = ANY($1::text[])' : ''
  const params = scope.kind === 'devices' ? [scope.deviceIds] : []
  const pool = getTelemetryPool()

  const res = await readOnlyQuery<SessionListRow>(
    pool,
    `
    SELECT device_id, session_id, MAX(session_name) AS session_name, MAX(device_name) AS device_name,
           MIN(epoch) AS start_epoch, MAX(epoch) AS end_epoch, COUNT(*) AS total_rows,
           ARRAY_AGG(DISTINCT phase) AS phases
    FROM history
    ${filter}
    GROUP BY device_id, session_id
    ORDER BY MAX(epoch) DESC
    LIMIT 500
  `,
    params
  )
  const devRes = await readOnlyQuery<{ id: string; name: string | null }>(pool, `SELECT id, name FROM devices`, [])
  return { sessions: res.rows, devices: devRes.rows }
}

type SessionRows = Awaited<ReturnType<typeof loadSessionRows>>

function toSummaries({ sessions, devices }: SessionRows, stores: Store[]): RecordingSessionSummary[] {
  const deviceNames = new Map<string, string>(
    devices.filter((d) => d.name).map((d) => [d.id, d.name as string])
  )

  return sessions.map((r) => {
    const deviceName = r.device_name || deviceNames.get(r.device_id) || r.device_id
    return {
      id: r.session_id,
      name: r.session_name || 'Tanpa nama',
      deviceId: r.device_id,
      deviceName,
      ...sessionStore(r.device_id, deviceName, stores),
      startEpoch: Number(r.start_epoch),
      endEpoch: Number(r.end_epoch),
      recordCount: Number(r.total_rows) || 0,
      phases: r.phases ?? [],
    }
  })
}

// The full-table GROUP BY takes seconds, so an expired list is served while one refresh runs.
// The key carries the scope, so a GS user never gets another scope's list.
const sharedSessions = createSharedFetch((key) => loadSessionRows(JSON.parse(key) as AccessScope), {
  ttlMs: 0,
  failureBackoffMs: 30_000,
})
const sessionRowsCache = createStaleCache<SessionRows>({ ttlMs: 60_000 })

export async function getRecordingSessions(): Promise<RecordingSessionSummary[]> {
  const scope = await getRequestScope()
  if (scope.kind === 'none') return []
  const key = scopeKey(scope)
  const [rows, stores] = await Promise.all([
    sessionRowsCache(key, () => sharedSessions(key)),
    getStores(),
  ])
  return toSummaries(rows, stores)
}

type SessionMetaRow = {
  device_id: string
  session_name: string | null
  device_name: string | null
  start_time: string | null
  end_time: string | null
  total_rows: string
}

export async function getSessionRecords(sessionId: string): Promise<SessionRecordsResult | null> {
  const scope = await getRequestScope()
  if (scope.kind === 'none') return null
  const pool = getTelemetryPool()

  const metaRes = await readOnlyQuery<SessionMetaRow>(
    pool,
    `
    SELECT device_id, MAX(session_name) AS session_name, MAX(device_name) AS device_name,
           to_char(to_timestamp(MIN(epoch) / 1000.0) AT TIME ZONE 'Asia/Jakarta', 'HH24:MI:SS DD/MM/YYYY') AS start_time,
           to_char(to_timestamp(MAX(epoch) / 1000.0) AT TIME ZONE 'Asia/Jakarta', 'HH24:MI:SS DD/MM/YYYY') AS end_time,
           COUNT(*) AS total_rows
    FROM history
    WHERE session_id = $1
    GROUP BY device_id
  `,
    [sessionId]
  )
  const meta = metaRes.rows.find((r) => isDeviceAllowed(scope, r.device_id))
  if (!meta) return null

  const total = Number(meta.total_rows) || 0
  if (total > MAX_SESSION_RECORDS) throw new SessionTooLargeError(String(total))

  // One after another, so an export uses a single connection at a time.
  const nameRes = await readOnlyQuery<{ phase: string; phase_name: string | null }>(
    pool,
    `SELECT phase, MAX(phase_name) AS phase_name FROM history WHERE session_id = $1 AND device_id = $2 GROUP BY phase`,
    [sessionId, meta.device_id]
  )
  const rowRes = await readOnlyQuery<HistoryRow>(
    pool,
    `
    SELECT phase, timestamp, epoch, voltage, current, power, frequency, energy, power_factor, offline
    FROM history
    WHERE session_id = $1 AND device_id = $2
    ORDER BY phase, epoch
  `,
    [sessionId, meta.device_id]
  )

  const names: Record<string, string> = {}
  for (const n of nameRes.rows) if (n.phase_name) names[n.phase] = n.phase_name

  return {
    session: {
      id: sessionId,
      name: meta.session_name || 'Tanpa nama',
      deviceId: meta.device_id,
      deviceName: meta.device_name || meta.device_id,
      startTime: meta.start_time || '---',
      endTime: meta.end_time || null,
      recordCount: total,
    },
    phases: groupSessionRows(rowRes.rows, names),
  }
}
