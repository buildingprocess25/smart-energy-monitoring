// No `@/` imports, so `node --test` can load this file directly.

const HOUR_MS = 3_600_000
export const ALERT_LIMITS = {
  offlineMs: HOUR_MS,
  silentMs: 2 * HOUR_MS,
  frozenMs: 2 * HOUR_MS,
  frozenMinWatts: 50,
  minVoltage: 195,
  maxVoltage: 245,
  minPowerFactor: 0.85,
  powerFactorMinWatts: 100,
  imbalancePercent: 50,
  clockMs: HOUR_MS,
}
// Single readings are noisy, so 3 of the last 4 quarter-hour samples must agree.
const SAMPLES = 4
const SAMPLES_NEEDED = 3

export type AlertKind =
  | 'recording-stalled'
  | 'device-offline'
  | 'sensor-silent'
  | 'counter-frozen'
  | 'voltage'
  | 'power-factor'
  | 'phase-imbalance'
  | 'device-clock'

export interface AlertSensor {
  phase: string
  name: string
  enabled: boolean
  lastSampleAt: number | null
  counterSameSince: number | null
  avgWatts24h: number | null
  recent: { voltage: number; powerFactor: number; power: number; at: number }[] // newest first
}

export interface AlertDevice {
  id: string
  name: string
  storeCode: string | null
  online: boolean
  deviceClock: number | null // time the device itself reported last
  recordingStalled: boolean
  sensors: AlertSensor[]
}

export interface Alert {
  id: string
  kind: AlertKind
  severity: 'critical' | 'warning'
  deviceId: string
  deviceName: string
  storeCode: string | null
  title: string
  detail: string
  since: number | null
}

const ORDER: AlertKind[] = [
  'recording-stalled', 'device-offline', 'sensor-silent', 'counter-frozen',
  'voltage', 'power-factor', 'phase-imbalance', 'device-clock',
]
const CRITICAL = new Set<AlertKind>(['recording-stalled', 'device-offline', 'sensor-silent'])

const fmt = (n: number, digits = 0) => n.toLocaleString('id-ID', { maximumFractionDigits: digits })

function deviceAlerts(device: AlertDevice, now: number): Alert[] {
  const alerts: Alert[] = []
  const add = (kind: AlertKind, title: string, detail: string, since: number | null = null, key = '') =>
    alerts.push({
      id: `${device.id}:${kind}:${key}`,
      kind,
      severity: CRITICAL.has(kind) ? 'critical' : 'warning',
      deviceId: device.id,
      deviceName: device.name,
      storeCode: device.storeCode,
      title,
      detail,
      since,
    })

  if (device.recordingStalled) {
    add('recording-stalled', 'Rekaman macet', 'Tercatat merekam, tetapi tidak ada record baru. Hentikan lalu mulai sesi baru.')
  }

  const sensors = device.sensors.filter((s) => s.enabled)
  const newest = sensors.reduce<number | null>(
    (max, s) => (s.lastSampleAt !== null && (max === null || s.lastSampleAt > max) ? s.lastSampleAt : max),
    null
  )
  if (!device.online) {
    if (newest === null || now - newest > ALERT_LIMITS.offlineMs) {
      add('device-offline', 'Perangkat offline', 'Cek listrik, WiFi, dan alat di toko.', newest)
    }
    return alerts
  }

  const isFresh = (s: AlertSensor) => s.lastSampleAt !== null && now - s.lastSampleAt <= ALERT_LIMITS.silentMs
  for (const s of sensors) {
    if (!isFresh(s)) {
      add('sensor-silent', `Sensor ${s.name} tidak mengirim data`, 'Perangkat online, tetapi sensor ini diam. Cek sensor dan kabelnya.', s.lastSampleAt, s.phase)
      continue
    }
    if (
      s.counterSameSince !== null &&
      now - s.counterSameSince > ALERT_LIMITS.frozenMs &&
      (s.avgWatts24h ?? 0) >= ALERT_LIMITS.frozenMinWatts
    ) {
      add('counter-frozen', `Counter energi ${s.name} tidak bergerak`, 'Ada beban, tetapi kWh tidak bertambah. Nilainya mungkin membeku.', s.counterSameSince, s.phase)
    }
    const recent = s.recent.filter((r) => now - r.at <= ALERT_LIMITS.silentMs).slice(0, SAMPLES)
    const low = recent.filter((r) => r.voltage > 0 && r.voltage < ALERT_LIMITS.minVoltage)
    const high = recent.filter((r) => r.voltage > ALERT_LIMITS.maxVoltage)
    if (low.length >= SAMPLES_NEEDED || high.length >= SAMPLES_NEEDED) {
      const v = (low.length >= SAMPLES_NEEDED ? low : high)[0].voltage
      add('voltage', `Tegangan ${s.name} ${fmt(v)} V`, `Di luar ${ALERT_LIMITS.minVoltage} sampai ${ALERT_LIMITS.maxVoltage} V.`, null, s.phase)
    }
    const weak = recent.filter((r) => r.power >= ALERT_LIMITS.powerFactorMinWatts && r.powerFactor < ALERT_LIMITS.minPowerFactor)
    if (weak.length >= SAMPLES_NEEDED) {
      add('power-factor', `Faktor daya ${s.name} ${fmt(weak[0].powerFactor, 2)}`, `Di bawah ${fmt(ALERT_LIMITS.minPowerFactor, 2)}.`, null, s.phase)
    }
  }

  const main = ['R', 'S', 'T'].map((phase) => sensors.find((s) => s.phase === phase))
  if (main.every((s) => s && isFresh(s) && s.avgWatts24h !== null)) {
    const watts = main.map((s) => s!.avgWatts24h!)
    const average = watts.reduce((sum, w) => sum + w, 0) / 3
    const percent = average > 0 ? Math.round(((Math.max(...watts) - average) / average) * 100) : 0
    if (percent > ALERT_LIMITS.imbalancePercent) {
      add('phase-imbalance', `Beban fase timpang ${fmt(percent)}%`, `Rata-rata 24 jam R ${fmt(watts[0])} W, S ${fmt(watts[1])} W, T ${fmt(watts[2])} W.`)
    }
  }

  if (device.deviceClock !== null && Math.abs(now - device.deviceClock) > ALERT_LIMITS.clockMs) {
    add('device-clock', 'Jam perangkat meleset', `Selisih sekitar ${fmt(Math.abs(now - device.deviceClock) / HOUR_MS, 1)} jam dari waktu server.`)
  }
  return alerts
}

export function computeAlerts(devices: AlertDevice[], now: number): Alert[] {
  return devices
    .flatMap((d) => deviceAlerts(d, now))
    .sort((a, b) => ORDER.indexOf(a.kind) - ORDER.indexOf(b.kind) || a.deviceId.localeCompare(b.deviceId))
}
