import 'server-only'
import { getTelemetryPool } from '@/lib/db/pools'
import { readOnlyQuery } from '@/lib/db/read-only'

// Newest row per session; undefined for every session when the database did not answer.
export async function readLastRecordTimes(
  sessionIds: string[]
): Promise<(sessionId: string | null) => number | null | undefined> {
  if (sessionIds.length === 0) return () => undefined
  try {
    const res = await readOnlyQuery<{ id: string; epoch: string | null }>(
      getTelemetryPool(),
      `SELECT s.id, (SELECT epoch FROM history WHERE session_id = s.id ORDER BY epoch DESC LIMIT 1) AS epoch
       FROM unnest($1::text[]) AS s(id)`,
      [sessionIds]
    )
    const times = new Map(res.rows.map((r) => [r.id, r.epoch === null ? null : Number(r.epoch)]))
    return (id) => (id === null ? undefined : times.get(id))
  } catch (error) {
    console.error('Last record times could not be read:', error)
    return () => undefined
  }
}
