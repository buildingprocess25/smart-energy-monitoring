import 'server-only'
import { getSpartaPool, getTelemetryPool } from '@/lib/db/pools'
import { readOnlyQuery } from '@/lib/db/read-only'
import {
  deviceDisplayName,
  type CaptureCommand,
  type DeviceCommand,
  type SessionCommand,
} from '@/lib/control-commands'
import { getManagedDevices, IDLE_CAPTURE, readCaptureStates } from '@/lib/services/device-service'
import { requestFullEnergyRead } from '@/lib/services/energy-service'
import { expireSessionList } from '@/lib/services/session-service'
import { isControlConfigured, sendTelemetryCommand, TelemetryApiError } from '@/lib/services/telemetry-api'
import type { CaptureState, ManagedDevice, StoreOption } from '@/lib/types'

export class ControlError extends Error {
  readonly status: number
  constructor(status: number, message: string) {
    super(message)
    this.status = status
  }
}

const UNKNOWN_RESULT = 'Server IoT tidak menjawab, jadi hasilnya belum pasti. Muat ulang dan cek status sebelum mencoba lagi.'

// Flask retries on its own; until then a restart there would bring the old state back.
const NOT_STORED =
  'Perintah sudah jalan, tetapi belum tersimpan di database server IoT. Kalau server itu restart sekarang, status lama bisa kembali. Cek lagi sebentar.'

async function send(path: string, payload: Record<string, unknown>): Promise<Record<string, unknown>> {
  if (!isControlConfigured()) {
    throw new ControlError(503, 'Kontrol perangkat belum diaktifkan di portal ini (PORTAL_CONTROL_TOKEN kosong).')
  }
  let reply
  try {
    reply = await sendTelemetryCommand(path, payload)
  } catch (error) {
    if (error instanceof TelemetryApiError) throw new ControlError(504, UNKNOWN_RESULT)
    throw error
  }
  if (reply.status === 200 && reply.body.ok === true) return reply.body
  if (reply.status === 401 || reply.status === 503) {
    throw new ControlError(502, 'Server IoT menolak portal. Cek PORTAL_CONTROL_TOKEN di kedua aplikasi.')
  }
  // Flask writes these messages itself; a 500 text could carry internals.
  if ([400, 404, 409].includes(reply.status) && typeof reply.body.error === 'string') {
    throw new ControlError(reply.status, reply.body.error)
  }
  throw new ControlError(502, 'Server IoT gagal menjalankan perintah.')
}

async function captureStates(): Promise<Map<string, CaptureState>> {
  try {
    return await readCaptureStates()
  } catch {
    throw new ControlError(502, 'Status rekaman tidak terbaca, jadi perintah tidak dikirim.')
  }
}

async function findDevice(deviceId: string): Promise<ManagedDevice> {
  const device = (await getManagedDevices()).find((d) => d.id === deviceId)
  if (!device) throw new ControlError(404, 'Perangkat tidak ditemukan.')
  return device
}

// The state after a command, or null when it could not be read back.
async function stateAfter(deviceId: string): Promise<CaptureState | null> {
  const states = await readCaptureStates().catch(() => null)
  return states ? (states.get(deviceId) ?? IDLE_CAPTURE) : null
}

export async function runCaptureCommand(command: CaptureCommand): Promise<{ capture: CaptureState | null; warning?: string }> {
  let reply: Record<string, unknown> = {}
  const device = await findDevice(command.deviceId)
  const before = (await captureStates()).get(device.id) ?? IDLE_CAPTURE

  if (command.action === 'start') {
    if (before.active) throw new ControlError(409, `Perangkat ini sedang merekam "${before.sessionName ?? '-'}".`)
    if (before.finalizing) throw new ControlError(409, 'Rekaman sebelumnya masih ditutup. Coba lagi dalam beberapa detik.')
    const enabled = new Set(device.sensors.filter((s) => s.enabled).map((s) => s.phase))
    if (command.phases.some((p) => !enabled.has(p))) {
      throw new ControlError(400, 'Ada sensor yang tidak terdaftar atau tidak aktif di perangkat ini.')
    }
    reply = await send('/capture/start', {
      deviceId: device.id,
      deviceName: device.name === device.id ? device.id : `${device.id} ${device.name}`,
      sessionName: command.sessionName,
      interval: command.interval,
      phases: command.phases,
    })
  } else if (!before.active) {
    // Stopping twice ends in the state the user asked for.
    if (command.action === 'interval') throw new ControlError(409, 'Perangkat ini sedang tidak merekam.')
  } else if (command.action === 'stop') {
    reply = await send('/capture/stop', { deviceId: device.id })
  } else {
    reply = await send('/capture/interval', { deviceId: device.id, interval: command.interval })
  }

  expireSessionList()
  const capture = await stateAfter(device.id)
  return reply.persisted === false ? { capture, warning: NOT_STORED } : { capture }
}

type SessionRow = { device_id: string; session_name: string | null }

async function findSession(sessionId: string): Promise<SessionRow> {
  const res = await readOnlyQuery<SessionRow>(
    getTelemetryPool(),
    `SELECT device_id, MAX(session_name) AS session_name FROM history WHERE session_id = $1 GROUP BY device_id`,
    [sessionId]
  )
  if (res.rows.length === 0) throw new ControlError(404, 'Sesi tidak ditemukan.')
  if (res.rows.length > 1) throw new ControlError(409, 'Sesi ini berisi lebih dari satu perangkat, jadi tidak diubah dari portal.')
  return res.rows[0]
}

export async function runSessionCommand(sessionId: string, command: SessionCommand): Promise<void> {
  const session = await findSession(sessionId)

  if (command.action === 'rename') {
    await send('/capture/rename-session', { sessionId, name: command.name })
  } else if (command.action === 'renameSensor') {
    await send('/capture/rename-session-sensor', { sessionId, phase: command.phase, name: command.name })
  } else {
    const name = session.session_name || 'Tanpa nama'
    if (command.confirmName !== name) throw new ControlError(400, 'Nama yang diketik tidak sama dengan nama sesi.')
    const state = (await captureStates()).get(session.device_id)
    if (state?.sessionId === sessionId || state?.finalizing) {
      throw new ControlError(409, 'Sesi masih merekam. Hentikan rekaman dulu.')
    }
    await send('/capture/delete-session', { sessionId })
    requestFullEnergyRead()
  }
  expireSessionList()
}

export async function runDeviceCommand(deviceId: string, command: DeviceCommand): Promise<void> {
  const device = await findDevice(deviceId)
  const path = `/devices/${encodeURIComponent(device.id)}`

  if (command.action === 'assign') {
    const res = await getSpartaPool().query<StoreRow>(
      'SELECT id::text AS id, code, name, branch, latitude, longitude FROM stores WHERE id::text = $1',
      [command.storeId]
    )
    const store = res.rows[0]
    if (!store) throw new ControlError(404, 'Toko tidak ditemukan.')
    await send(`${path}/rename`, {
      name: deviceDisplayName(store),
      store_id: store.id,
      // SPARTA often has no coordinates; keep the device's own while it stays at the same store.
      ...(store.latitude === null && device.storeId === store.id
        ? device.position
        : { latitude: store.latitude, longitude: store.longitude }),
    })
    return
  }

  const sensor = device.sensors.find((s) => s.phase === command.phase)
  if (!sensor) throw new ControlError(404, 'Sensor tidak ditemukan.')
  const sensorPath = `${path}/sensors/${encodeURIComponent(sensor.phase)}`
  if (command.action === 'sensorName') await send(`${sensorPath}/rename`, { name: command.name })
  else if (command.action === 'sensorColor') await send(`${sensorPath}/color`, { color: command.color })
  else {
    const capture = (await captureStates()).get(device.id)
    if (capture?.active && !command.enabled) {
      throw new ControlError(409, 'Sensor tidak bisa dimatikan selagi perangkat merekam.')
    }
    await send(`${sensorPath}/enabled`, { enabled: command.enabled })
  }
}

type StoreRow = StoreOption & { latitude: number | string | null; longitude: number | string | null }

export async function searchStores(query: string): Promise<StoreOption[]> {
  const pattern = `%${query.replace(/[\\%_]/g, '\\$&')}%`
  const res = await getSpartaPool().query<StoreOption>(
    `SELECT id::text AS id, code, name, COALESCE(branch, '') AS branch
     FROM stores
     WHERE code ILIKE $1 OR name ILIKE $1
     ORDER BY (UPPER(code) = UPPER($2)) DESC, code
     LIMIT 20`,
    [pattern, query]
  )
  return res.rows
}
