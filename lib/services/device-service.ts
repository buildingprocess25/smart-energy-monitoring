import 'server-only'
import { getRequestScope } from '@/lib/auth/access'
import { isDeviceAllowed } from '@/lib/auth/access-rules'
import { getTelemetryPool } from '@/lib/db/pools'
import { readOnlyQuery } from '@/lib/db/read-only'
import { isCaptureStalled } from '@/lib/capture-health'
import { readLastRecordTimes } from '@/lib/services/capture-health-service'
import { deviceKind } from '@/lib/device-status'
import { isPhaseKey } from '@/lib/phase-keys'
import { fetchTelemetryApi } from '@/lib/services/telemetry-api'
import type { CaptureState, ManagedDevice } from '@/lib/types'

type DeviceRow = {
  id: string
  name: string | null
  online: boolean | null
  last_seen: string | null
  sensors: unknown
  store_id: string | null
  latitude: number | null
  longitude: number | null
}

function parseSensors(raw: unknown): ManagedDevice['sensors'] {
  let list = raw
  if (typeof raw === 'string') {
    try {
      list = JSON.parse(raw)
    } catch {
      return []
    }
  }
  if (!Array.isArray(list)) return []
  return list.flatMap((s) =>
    s && typeof s.phase === 'string' && isPhaseKey(s.phase)
      ? [{ phase: s.phase, name: s.name || s.phase, enabled: s.enabled !== false, color: s.color || null }]
      : []
  )
}

// Fresh, not cached: commands decide on it. Throws when Flask does not answer.
export async function readCaptureStates(): Promise<Map<string, CaptureState>> {
  const raw = (await fetchTelemetryApi('/capture/status')) as {
    devices?: Record<string, Record<string, unknown> | null>
  } | null
  if (!raw?.devices) throw new Error('Status rekaman tidak terbaca.')
  const states = new Map<string, CaptureState>()
  for (const [id, s] of Object.entries(raw.devices)) {
    if (!s) continue
    states.set(id, {
      active: s.active === true,
      finalizing: s.finalizing === true,
      sessionId: typeof s.session_id === 'string' ? s.session_id : null,
      sessionName: typeof s.session_name === 'string' ? s.session_name : null,
      interval: Number(s.interval) || null,
      count: Number(s.count) || 0,
      startedAt: typeof s.started_at === 'string' ? s.started_at : null,
    })
  }
  return states
}

export const IDLE_CAPTURE: CaptureState = {
  active: false,
  finalizing: false,
  sessionId: null,
  sessionName: null,
  interval: null,
  count: 0,
  startedAt: null,
}

// Devices in the viewer's scope. capture is null when Flask did not answer, which is not "not recording".
export async function getManagedDevices(): Promise<ManagedDevice[]> {
  const scope = await getRequestScope()
  if (scope.kind === 'none') return []
  const [res, states] = await Promise.all([
    readOnlyQuery<DeviceRow>(
      getTelemetryPool(),
      'SELECT id, name, online, last_seen, sensors, store_id, latitude, longitude FROM devices ORDER BY id',
      []
    ),
    readCaptureStates().catch(() => null),
  ])
  const allowed = res.rows.filter((r) => isDeviceAllowed(scope, r.id))
  const activeSessions = allowed.flatMap((r) => {
    const state = states?.get(r.id)
    return state?.active && state.sessionId ? [state.sessionId] : []
  })
  const lastRecord = await readLastRecordTimes(activeSessions)
  const now = Date.now()
  const withHealth = (state: CaptureState): CaptureState => {
    const lastRecordAt = lastRecord(state.sessionId)
    return { ...state, lastRecordAt, stalled: isCaptureStalled({ ...state, lastRecordAt }, now) }
  }

  return allowed
    .map((r) => ({
      id: r.id,
      name: r.name || r.id,
      kind: deviceKind(r.id),
      online: r.online === true,
      lastSeen: r.last_seen && r.last_seen !== '---' ? r.last_seen : null,
      storeId: r.store_id,
      position: { latitude: r.latitude, longitude: r.longitude },
      sensors: parseSensors(r.sensors),
      capture: states ? withHealth(states.get(r.id) ?? IDLE_CAPTURE) : null,
    }))
}
