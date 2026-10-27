import { getSpartaPool } from '@/lib/db/pools'
import {
  DailyConsumption,
  SangatBorosComparison,
  SangatBorosListStatus,
  SangatBorosPriorityItem,
  SangatBorosStore,
  Store,
} from '@/lib/types'

// Postgres error code for "relation does not exist"
const UNDEFINED_TABLE = '42P01'

const MONTH_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des']

function toNumber(value: unknown): number {
  const n = typeof value === 'number' ? value : parseFloat(String(value))
  return Number.isFinite(n) ? n : 0
}

function toOptionalNumber(value: unknown): number | undefined {
  if (value === null || value === undefined) return undefined
  const n = typeof value === 'number' ? value : parseFloat(String(value))
  return Number.isFinite(n) ? n : undefined
}

function mapRow(r: Record<string, unknown>): SangatBorosStore {
  return {
    rank: toNumber(r.peringkat),
    storeCode: String(r.store_code || '').toUpperCase(),
    storeName: String(r.store_name || ''),
    branch: String(r.branch || ''),
    latitude: toOptionalNumber(r.latitude),
    longitude: toOptionalNumber(r.longitude),
    auditId: String(r.audit_id),
    calculatedAt: r.tanggal_kalkulasi ? new Date(r.tanggal_kalkulasi as string | Date).toISOString() : '',
    gapPercent: toNumber(r.gap_percent),
    actualPlnKwhPerMonth: toNumber(r.aktual_pln_kwh_per_bulan),
    standardKwhPerMonth: toNumber(r.standar_konsumsi_kwh_per_bulan),
    standardKwhPerDay: toNumber(r.standar_konsumsi_kwh_per_hari),
    validationStatus: r.status_validasi === 'VALIDATED' ? 'VALIDATED' : 'PENDING',
    isDemo: r.is_demo === true,
  }
}

// The 12 Sangat Boros stores from v_toko_sangat_boros (DB 1, owned by sparta-energy).
// 'missing' means the view does not exist yet; the page keeps working either way.
export async function getSangatBorosStores(): Promise<{
  status: SangatBorosListStatus
  stores: SangatBorosStore[]
}> {
  try {
    const res = await getSpartaPool().query(
      'SELECT * FROM v_toko_sangat_boros ORDER BY peringkat'
    )
    return { status: 'ok', stores: res.rows.map(mapRow) }
  } catch (error) {
    if ((error as { code?: string } | null)?.code === UNDEFINED_TABLE) {
      console.warn('v_toko_sangat_boros is not available in SPARTA database yet')
      return { status: 'missing', stores: [] }
    }
    console.error('Error fetching v_toko_sangat_boros:', error)
    return { status: 'error', stores: [] }
  }
}

export async function getSangatBorosByCode(storeCode: string): Promise<SangatBorosStore | null> {
  const code = storeCode.toUpperCase()
  const { stores } = await getSangatBorosStores()
  return stores.find((s) => s.storeCode === code) || null
}

// getStores() only returns stores with an IoT device, and their codes come from
// extractStoreCode() on the device name, so a code match means a device is installed.
export function withInstallStatus(
  list: SangatBorosStore[],
  iotStores: Store[]
): SangatBorosPriorityItem[] {
  const devicesByCode = new Map<string, number>()
  iotStores.forEach((s) => {
    if (s.deviceId) devicesByCode.set(s.code.toUpperCase(), s.deviceCount || 1)
  })

  return list.map((s) => ({
    ...s,
    isInstalled: devicesByCode.has(s.storeCode),
    deviceCount: devicesByCode.get(s.storeCode) || 0,
  }))
}

// Daily average of main panel kWh (R/S/T) over the days that have data in the
// anchor month, compared per day so a partial month never looks like a drop.
export function compareWithSangatBoros(
  store: SangatBorosStore,
  dailyConsumption: DailyConsumption[],
  anchorDate: string
): SangatBorosComparison {
  const monthKey = anchorDate.substring(0, 7)
  const [y, m] = monthKey.split('-').map((p) => parseInt(p, 10))
  const periodLabel = y && m ? `${MONTH_SHORT[m - 1]} ${y}` : monthKey

  const days = dailyConsumption.filter(
    (d) => d.dayDate?.startsWith(monthKey) && (d.mainPanelKwh || 0) > 0
  )
  const totalMain = days.reduce((sum, d) => sum + (d.mainPanelKwh || 0), 0)
  const avgDailyMainKwh = days.length > 0 ? totalMain / days.length : null

  const plnPerDay = store.actualPlnKwhPerMonth / 30
  const round1 = (n: number) => Math.round(n * 10) / 10

  return {
    store,
    periodLabel,
    mainPanelDays: days.length,
    avgDailyMainKwh: avgDailyMainKwh !== null ? round1(avgDailyMainKwh) : null,
    reductionVsPlnPct:
      avgDailyMainKwh !== null && plnPerDay > 0
        ? round1(((plnPerDay - avgDailyMainKwh) / plnPerDay) * 100)
        : null,
    vsStandardPct:
      avgDailyMainKwh !== null && store.standardKwhPerDay > 0
        ? round1(((avgDailyMainKwh - store.standardKwhPerDay) / store.standardKwhPerDay) * 100)
        : null,
  }
}
