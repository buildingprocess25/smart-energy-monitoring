import 'server-only'
import { getRequestScope } from '@/lib/auth/access'
import { normalizePhaseKey } from '@/lib/phase-keys'
import { buildConsumption, buildLoadProfile, buildSummary, REPORT_COLUMNS, REPORT_TYPES, type ReportDevice, type ReportParams, type ReportTable } from '@/lib/reports'
import { getManagedDevices } from '@/lib/services/device-service'
import { getEnergyIndex } from '@/lib/services/energy-service'
import { getDeviceHealth, HEALTH_DAYS } from '@/lib/services/health-service'
import { compareWithSangatBoros, getSangatBorosStores } from '@/lib/services/sangat-boros-service'
import { getRecordingSessions } from '@/lib/services/session-service'
import { getStores } from '@/lib/services/store-service'
import { extractStoreCode } from '@/lib/store-code'
import { formatDuration } from '@/lib/format-duration'
import { jakartaDate } from '@/lib/jakarta-range'

const formatTime = (epoch: number | null) =>
  epoch === null
    ? '-'
    : new Date(epoch).toLocaleString('sv-SE', { timeZone: 'Asia/Jakarta', dateStyle: 'short', timeStyle: 'short' })

// Everything below reads services that already limit devices to the viewer's scope.
export async function buildReport(params: ReportParams): Promise<ReportTable | { error: string }> {
  const { type, store, from, to } = params
  const codes = params.stores?.length ? params.stores : store === 'all' ? null : [store]
  const wanted = (code: string | null) => codes === null || (code !== null && codes.includes(code))

  if (type === 'health') {
    const { devices } = await getDeviceHealth()
    return {
      title: REPORT_TYPES.health,
      columns: REPORT_COLUMNS.health,
      rows: devices
        .filter((d) => wanted(d.storeCode))
        .flatMap((d) =>
          d.sensors.map((s) => [d.storeCode, d.id, d.kind, d.online ? 'Online' : 'Offline', s.name, s.percent, s.completeDays, s.days.length, formatTime(s.lastSampleAt)])
        ),
      note: `Selalu ${HEALTH_DAYS} hari terakhir. Hari lengkap berarti minimal 90% data 15 menit masuk.`,
    }
  }

  if (type === 'alerts') {
    const { alerts } = await getDeviceHealth()
    return {
      title: REPORT_TYPES.alerts,
      columns: REPORT_COLUMNS.alerts,
      rows: alerts
        .filter((a) => wanted(a.storeCode))
        .map((a) => [a.severity === 'critical' ? 'Penting' : 'Perhatian', a.storeCode, a.deviceId, a.title, a.detail, formatTime(a.since)]),
      note: 'Keadaan saat laporan dibuat.',
    }
  }

  if (type === 'sessions') {
    const sessions = await getRecordingSessions()
    return {
      title: REPORT_TYPES.sessions,
      columns: REPORT_COLUMNS.sessions,
      rows: sessions
        .filter((s) => wanted(s.storeCode) && jakartaDate(s.endEpoch) >= from && jakartaDate(s.startEpoch) <= to)
        .map((s) => [s.name, s.storeCode, s.storeName, s.deviceId, formatTime(s.startEpoch), formatTime(s.endEpoch), formatDuration(s.endEpoch - s.startEpoch), s.recordCount, s.phases.join(', ')]),
      note: 'Data record tiap sesi diunduh dari menu Sesi Rekaman.',
    }
  }

  const [managed, stores, index] = await Promise.all([getManagedDevices(), getStores(), getEnergyIndex()])
  const devices: ReportDevice[] = managed.flatMap((d) => {
    const code = extractStoreCode(d.name)
    if (!wanted(code)) return []
    const known = stores.find((s) => s.code.toUpperCase() === code)
    return [{
      id: d.id,
      storeCode: code ?? '-',
      storeName: known?.name ?? d.name,
      sensors: new Map(d.sensors.map((s) => [normalizePhaseKey(s.phase), s.name])),
    }]
  })

  if (type === 'sangatBoros') {
    if ((await getRequestScope()).kind !== 'all') return { error: 'Laporan ini hanya untuk Admin dan Auditor.' }
    const list = await getSangatBorosStores()
    if (list.status !== 'ok') return { error: 'Daftar Sangat Boros dari SPARTA belum tersedia.' }
    return {
      title: REPORT_TYPES.sangatBoros,
      columns: REPORT_COLUMNS.sangatBoros,
      rows: list.stores
        .filter((s) => wanted(s.storeCode) && !s.isDemo)
        .map((s) => {
          const device = devices.find((d) => d.storeCode === s.storeCode && index.total(d.id).hasMain)
          const daily = device
            ? index.daily(device.id).filter((d) => d.date <= to).map((d) => ({ day: '', dayDate: d.date, kwh: d.kwh, mainPanelKwh: d.mainKwh, cost: 0 }))
            : []
          const c = compareWithSangatBoros(s, daily, to)
          return [s.rank, s.storeCode, s.storeName, s.branch, Math.round(s.actualPlnKwhPerMonth), Math.round(s.standardKwhPerMonth), s.gapPercent, c.avgDailyMainKwh, c.mainPanelDays, c.reductionVsPlnPct === null ? null : -c.reductionVsPlnPct, c.vsStandardPct]
        }),
      note: `Aktual memakai hari terekam di bulan ${to.slice(0, 7)}. Nilai minus berarti lebih hemat. Kosong berarti toko belum punya sensor panel utama.`,
    }
  }

  if (type === 'summary') return buildSummary(index, devices, from, to)
  return type === 'profile' ? buildLoadProfile(index, devices, from, to) : buildConsumption(index, devices, type, from, to)
}

// Stores with a device in the viewer's scope.
export async function getReportStores(): Promise<{ value: string; label: string }[]> {
  const [devices, stores] = await Promise.all([getManagedDevices(), getStores()])
  const codes = [...new Set(devices.map((d) => extractStoreCode(d.name)).filter((c) => c !== null))].sort()
  return codes.map((code) => {
    const name = stores.find((s) => s.code.toUpperCase() === code)?.name
    return { value: code, label: name ? `${code} ${name}` : code }
  })
}
