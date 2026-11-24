// No imports, so `node --test` can load this file directly.

export interface DeviceStatus {
  relay: 'ON' | 'OFF' | null
  uptime: string | null
  wifi: string | null
}

export function deviceKind(deviceId: string): 'CT' | 'Plug' | 'Meter energi' {
  if (/^ct-/i.test(deviceId)) return 'CT'
  return /^plug-/i.test(deviceId) ? 'Plug' : 'Meter energi'
}

const isRecord = (v: unknown): v is Record<string, unknown> => typeof v === 'object' && v !== null && !Array.isArray(v)

function text(value: unknown): string | null {
  if (typeof value === 'number' && Number.isFinite(value)) return String(value)
  return typeof value === 'string' && value.trim() !== '' ? value.trim().slice(0, 60) : null
}

// null means the device did not report it.
export function parseDeviceStatus(liveBuffer: unknown): DeviceStatus {
  let newest: Record<string, unknown> | null = null
  let newestAt = -Infinity
  for (const item of Array.isArray(liveBuffer) ? liveBuffer : []) {
    if (!isRecord(item) || !isRecord(item.data) || !isRecord(item.data.status)) continue
    const at = Number(item.timestamp)
    if (at >= newestAt) {
      newest = item.data.status
      newestAt = at
    }
  }
  const relay = text(newest?.relay)?.toUpperCase()
  return {
    relay: relay === 'ON' || relay === 'OFF' ? relay : null,
    uptime: text(newest?.uptime),
    wifi: text(newest?.wifi),
  }
}
