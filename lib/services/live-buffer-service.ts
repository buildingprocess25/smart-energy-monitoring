import 'server-only'
import type { LiveBufferResult } from '@/lib/types'
import { combineLiveBuffers, parseLiveBuffer } from '@/lib/live-buffer'
import { createSharedFetch } from '@/lib/shared-fetch'
import { getRequestScope } from '@/lib/auth/access'
import { isDeviceAllowed, scopeKey } from '@/lib/auth/access-rules'
import { parseDeviceStatus, type DeviceStatus } from '@/lib/device-status'
import { getStoreById } from '@/lib/services/store-service'
import { fetchTelemetryApi } from '@/lib/services/telemetry-api'

// Flask runs MQTT, capture and its API in one Gunicorn process, so the portal calls
// /live-buffer at most once per device every 3 s, however many viewers are open.
// After a failure the device is left alone for 15 s.
const loadLiveBuffer = createSharedFetch(
  (deviceId) => fetchTelemetryApi(`/live-buffer/${encodeURIComponent(deviceId)}`),
  { ttlMs: 3000, failureBackoffMs: 15000 }
)

// scopeKey() is JSON, which never holds a raw newline, so the first '\n' splits the key.
const KEY_SEPARATOR = '\n'
const MAX_STORE_ID_LENGTH = 64

// getStoreById() runs the whole getStores() pipeline (Flask /capture/status plus DB 1 and
// DB 2 queries), so a live poll resolves store -> device at most once per (scope, store)
// per 60 s, with a 15 s pause after a failure. The loader runs in the first caller's
// request, whose scope equals the key's scope, so the result is valid for every caller
// with that key. A GS revocation takes effect within 60 s.
const resolveStoreDevice = createSharedFetch(
  async (key) => {
    const storeId = key.slice(key.indexOf(KEY_SEPARATOR) + 1)
    const store = await getStoreById(storeId)
    return store?.deviceId ? { deviceId: store.deviceId, members: store.members ?? [] } : null
  },
  { ttlMs: 60_000, failureBackoffMs: 15_000 }
)

// Returns null when the store is outside the caller's scope or has no device.
export async function getStoreLiveBuffer(
  storeId: string,
  since: number | null
): Promise<LiveBufferResult | null> {
  if (storeId.length > MAX_STORE_ID_LENGTH || storeId.includes(KEY_SEPARATOR)) return null
  const scope = await getRequestScope()
  if (scope.kind === 'none') return null

  const device = await resolveStoreDevice(scopeKey(scope) + KEY_SEPARATOR + storeId)
  if (!device) return null
  if (device.members.length === 0) return parseLiveBuffer(await loadLiveBuffer(device.deviceId), since)
  // Each member is still fetched through the shared 3 s cache, so viewers do not multiply Flask calls.
  const parts = await Promise.all(
    device.members.map(async (m) => ({ raw: await loadLiveBuffer(m.deviceId).catch(() => null), phase: m.phase, prefix: m.prefix }))
  )
  return parseLiveBuffer(combineLiveBuffers(parts), since)
}

// Returns null when the device is outside the caller's scope.
export async function getDeviceLiveBuffer(
  deviceId: string,
  since: number | null
): Promise<(LiveBufferResult & { status: DeviceStatus }) | null> {
  const scope = await getRequestScope()
  if (!isDeviceAllowed(scope, deviceId)) return null
  const raw = await loadLiveBuffer(deviceId)
  return { ...parseLiveBuffer(raw, since), status: parseDeviceStatus(raw) }
}
