import 'server-only'
import { ROLES, canReceiveReports } from '@/lib/auth/access-rules'
import { getSpartaPool } from '@/lib/db/pools'
import { readOnlyQuery } from '@/lib/db/read-only'
import type { Subscriber } from '@/lib/mail-settings'
import { readSubscriberIds } from '@/lib/services/report-template-store'

// Reads only the users who subscribed. A user who lost the role or was deactivated drops out.
export async function getSubscribers(): Promise<Subscriber[]> {
  const ids = await readSubscriberIds()
  if (ids.length === 0) return []
  // is_active exists only after sparta's migration; to_jsonb() gives null before that.
  const res = await readOnlyQuery<{ id: string; email: string; full_name: string | null; role: string }>(
    getSpartaPool(),
    `SELECT u.id::text AS id, u.email, u.full_name, u.role::text AS role
     FROM users u
     WHERE u.id::text = ANY($1) AND u.role::text = ANY($2)
       AND COALESCE((to_jsonb(u)->>'is_active')::boolean, true)
     ORDER BY u.full_name NULLS LAST, u.email`,
    [ids, ROLES.filter(canReceiveReports)]
  )
  return res.rows.map((r) => ({ id: r.id, name: r.full_name || r.email, email: r.email, role: r.role }))
}
