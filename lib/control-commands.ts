// Checks for device control requests. No `@/` imports, so `node --test` can load this file directly.
import { isPhaseKey } from './phase-keys.ts'
import type { ParseResult } from './request-params.ts'

export const MIN_INTERVAL_S = 15
export const MAX_INTERVAL_S = 3600
export const MAX_NAME_LENGTH = 100

export type CaptureCommand =
  | { action: 'start'; deviceId: string; sessionName: string; interval: number; phases: string[] }
  | { action: 'stop'; deviceId: string }
  | { action: 'interval'; deviceId: string; interval: number }

export type SessionCommand =
  | { action: 'rename'; name: string }
  | { action: 'renameSensor'; phase: string; name: string }
  | { action: 'delete'; confirmName: string }

export type DeviceCommand =
  | { action: 'assign'; storeId: string }
  | { action: 'sensorName'; phase: string; name: string }
  | { action: 'sensorColor'; phase: string; color: string }
  | { action: 'sensorEnabled'; phase: string; enabled: boolean }

const fail = (error: string) => ({ ok: false as const, error })

export function parseDeviceId(raw: unknown): string | null {
  return typeof raw === 'string' && /^[A-Za-z0-9_-]{1,50}$/.test(raw) ? raw : null
}

function parseName(raw: unknown): string | null {
  if (typeof raw !== 'string') return null
  const name = raw.trim()
  // Control characters would break the Flask UI, logs and exports.
  return name.length > 0 && name.length <= MAX_NAME_LENGTH && !/[\u0000-\u001f\u007f]/.test(name) ? name : null
}

function parsePhase(raw: unknown): string | null {
  return typeof raw === 'string' && isPhaseKey(raw) ? raw : null
}

function parseInterval(raw: unknown): number | null {
  return typeof raw === 'number' && Number.isInteger(raw) && raw >= MIN_INTERVAL_S && raw <= MAX_INTERVAL_S ? raw : null
}

function asRecord(body: unknown): Record<string, unknown> | null {
  return typeof body === 'object' && body !== null && !Array.isArray(body) ? (body as Record<string, unknown>) : null
}

const NAME_ERROR = `Nama wajib diisi, paling banyak ${MAX_NAME_LENGTH} karakter.`
const INTERVAL_ERROR = `Interval harus ${MIN_INTERVAL_S} sampai ${MAX_INTERVAL_S} detik.`

export function parseCaptureCommand(body: unknown): ParseResult<CaptureCommand> {
  const b = asRecord(body)
  const deviceId = parseDeviceId(b?.deviceId)
  if (!b || !deviceId) return fail('Perangkat tidak valid.')

  if (b.action === 'stop') return { ok: true, value: { action: 'stop', deviceId } }

  const interval = parseInterval(b.interval)
  if (b.action === 'interval') {
    return interval ? { ok: true, value: { action: 'interval', deviceId, interval } } : fail(INTERVAL_ERROR)
  }
  if (b.action !== 'start') return fail('Perintah tidak dikenal.')

  const sessionName = parseName(b.sessionName)
  if (!sessionName) return fail(NAME_ERROR)
  if (!interval) return fail(INTERVAL_ERROR)
  if (!Array.isArray(b.phases) || b.phases.length === 0 || b.phases.length > 50) return fail('Pilih minimal satu sensor.')
  const phases = b.phases.map(parsePhase)
  if (phases.some((p) => p === null)) return fail('Sensor tidak valid.')
  return { ok: true, value: { action: 'start', deviceId, sessionName, interval, phases: [...new Set(phases as string[])] } }
}

export function parseSessionCommand(body: unknown): ParseResult<SessionCommand> {
  const b = asRecord(body)
  const name = parseName(b?.name)
  if (b?.action === 'rename') return name ? { ok: true, value: { action: 'rename', name } } : fail(NAME_ERROR)
  if (b?.action === 'renameSensor') {
    const phase = parsePhase(b.phase)
    if (!phase) return fail('Sensor tidak valid.')
    return name ? { ok: true, value: { action: 'renameSensor', phase, name } } : fail(NAME_ERROR)
  }
  if (b?.action === 'delete') {
    return typeof b.confirmName === 'string'
      ? { ok: true, value: { action: 'delete', confirmName: b.confirmName } }
      : fail('Ketik nama sesi untuk menghapus.')
  }
  return fail('Perintah tidak dikenal.')
}

export function parseDeviceCommand(body: unknown): ParseResult<DeviceCommand> {
  const b = asRecord(body)
  if (b?.action === 'assign') {
    return typeof b.storeId === 'string' && /^[0-9a-f]{8}(-[0-9a-f]{4}){3}-[0-9a-f]{12}$/i.test(b.storeId)
      ? { ok: true, value: { action: 'assign', storeId: b.storeId } }
      : fail('Toko tidak valid.')
  }
  const phase = parsePhase(b?.phase)
  if (!b || !phase) return fail('Sensor tidak valid.')
  if (b.action === 'sensorName') {
    const name = parseName(b.name)
    return name ? { ok: true, value: { action: 'sensorName', phase, name } } : fail(NAME_ERROR)
  }
  if (b.action === 'sensorColor') {
    return typeof b.color === 'string' && /^#[0-9a-f]{6}$/i.test(b.color)
      ? { ok: true, value: { action: 'sensorColor', phase, color: b.color } }
      : fail('Warna harus berformat #rrggbb.')
  }
  if (b.action === 'sensorEnabled') {
    return typeof b.enabled === 'boolean'
      ? { ok: true, value: { action: 'sensorEnabled', phase, enabled: b.enabled } }
      : fail('Status sensor tidak valid.')
  }
  return fail('Perintah tidak dikenal.')
}

// The session cookie covers sibling subdomains, so SameSite alone does not stop them.
export function isSameOrigin(origin: string | null, host: string | null): boolean {
  if (!origin || !host) return false
  try {
    return new URL(origin).host === host
  } catch {
    return false
  }
}

export function deviceDisplayName(store: { code: string; name: string }): string {
  return `[${store.code}] ${store.name}`
}
