import { cache } from 'react'
import { cookies, headers } from 'next/headers'
import { getSpartaPool } from '@/lib/db/pools'
import {
  AccessScope,
  DEV_ROLE_COOKIE,
  INTERNAL_TOKEN_HEADER,
  isValidInternalToken,
  parseDeviceIds,
  PATHNAME_HEADER,
  resolveRole,
  Role,
  scopeFor,
  SESSION_COOKIE,
} from '@/lib/auth/access-rules'

// Postgres error code for "relation does not exist"
const UNDEFINED_TABLE = '42P01'

export interface Viewer {
  userId: string
  email: string
  name: string
  role: Role
  simulated: boolean
}

export type RequestAccess =
  | { status: 'anonymous' }
  // sso_session is present but matches no live session row.
  | { status: 'invalid' }
  | { status: 'error' }
  | { status: 'ok'; viewer: Viewer | null; scope: AccessScope; internal: boolean }

export function spartaUrl(path: string): string {
  const base = (process.env.NEXT_PUBLIC_SPARTA_AUDIT_URL || '').replace(/\/+$/, '')
  return `${base}${path}`
}

async function getAssignedDeviceIds(viewer: Viewer): Promise<string[]> {
  if (viewer.simulated) return parseDeviceIds(process.env.DEV_GS_DEVICE_IDS)
  try {
    const res = await getSpartaPool().query(
      'SELECT device_id FROM user_device_access WHERE user_id = $1',
      [viewer.userId]
    )
    return res.rows.map((r) => String(r.device_id))
  } catch (error) {
    // Until sparta runs its migration the table does not exist: GS has no devices yet.
    if ((error as { code?: string } | null)?.code === UNDEFINED_TABLE) return []
    throw error
  }
}

// Who is asking and which devices they may see. Cached per request; reads DB 1 only.
export const getRequestAccess = cache(async (): Promise<RequestAccess> => {
  const headerStore = await headers()
  const expectedToken = process.env.MONITORING_INTERNAL_TOKEN

  if (isValidInternalToken(headerStore.get(INTERNAL_TOKEN_HEADER), expectedToken)) {
    return { status: 'ok', viewer: null, scope: { kind: 'all' }, internal: true }
  }

  const cookieStore = await cookies()
  const sessionToken = cookieStore.get(SESSION_COOKIE)?.value

  if (!sessionToken) {
    // sparta reads GET /api/stores without a session. Without a configured token it stays
    // open only in development; production never serves it unauthenticated.
    const isProduction = process.env.NODE_ENV === 'production'
    if (!expectedToken && !isProduction && headerStore.get(PATHNAME_HEADER) === '/api/stores') {
      return { status: 'ok', viewer: null, scope: { kind: 'all' }, internal: true }
    }
    return { status: 'anonymous' }
  }

  try {
    const res = await getSpartaPool().query(
      `SELECT u.id, u.email, u.full_name, u.role::text AS role
       FROM session s
       JOIN users u ON u.id = s.user_id
       WHERE s.token = $1 AND s.expires_at > NOW()
       LIMIT 1`,
      [sessionToken]
    )
    const row = res.rows[0]
    if (!row) return { status: 'invalid' }

    const isDev = process.env.NODE_ENV === 'development'
    const devRole = cookieStore.get(DEV_ROLE_COOKIE)?.value
    const role = resolveRole(row.role, devRole, isDev)
    if (!role) {
      return { status: 'ok', viewer: null, scope: { kind: 'none' }, internal: false }
    }

    const viewer: Viewer = {
      userId: String(row.id),
      email: String(row.email || ''),
      name: String(row.full_name || row.email || ''),
      role,
      simulated: role !== row.role,
    }
    const deviceIds = role === 'GS' ? await getAssignedDeviceIds(viewer) : []
    return { status: 'ok', viewer, scope: scopeFor(role, deviceIds), internal: false }
  } catch (error) {
    console.error('Access check against SPARTA database failed:', error)
    return { status: 'error' }
  }
})

export async function getRequestScope(): Promise<AccessScope> {
  const access = await getRequestAccess()
  return access.status === 'ok' ? access.scope : { kind: 'none' }
}
