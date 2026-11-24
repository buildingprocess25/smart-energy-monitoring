export type StoreStatus = 'live' | 'historical' | 'unassigned'

export interface DailyConsumption {
  day: string
  dayDate: string
  dayLabel?: string
  dayFullDate?: string
  kwh: number
  mainPanelKwh?: number // Only main panel phases R/S/T, excluding sub-metering sensors
  cost: number
}

export interface LoadProfilePoint {
  time: string // "00:00", "01:00", ...
  fullTime?: string // "14:00 WIB"
  powerWatts: number | null // null when nothing was recorded in that hour
  powerKw: number | null
}

export interface RealMonthlyConsumption {
  monthKey: string // "2026-08"
  monthLabel: string // "Agu 2026"
  year: number
  month: number
  kwh: number
  mainPanelKwh?: number // Only main panel phases R/S/T, excluding sub-metering sensors
  cost: number
  diffPct?: number // MoM % difference vs previous month
  isLatest?: boolean
}

export interface MonthlyTrendSummary {
  recordedMonthsCount: number
  totalKwh: number
  totalCost: number
  avgMonthlyKwh: number
  latestMonthLabel: string
  latestMonthKwh: number
  momDiffPct?: number
  trendStatus: 'hemat' | 'stabil' | 'waspada'
}

export interface StoreAnalyticsResult {
  storeId: string
  storeCode: string
  storeName: string
  branch: string
  status: StoreStatus
  deviceId?: string
  anchorDate: string // "YYYY-MM-DD"
  anchorDateLabel: string // "18 Agu 2026"
  availableDates?: string[] // List of dates with telemetry
  isLive: boolean
  peakPowerWatts: number
  avgPowerWatts: number
  basePowerWatts: number
  loadProfile24h: LoadProfilePoint[]
  dailyConsumption: DailyConsumption[]
  monthlyHistory?: RealMonthlyConsumption[]
  monthlySummary?: MonthlyTrendSummary
  sangatBoros?: SangatBorosComparison | null
}

// One row of the read-only view v_toko_sangat_boros in DB 1 (owned by sparta-energy)
export interface SangatBorosStore {
  rank: number
  storeCode: string
  storeName: string
  branch: string
  latitude?: number
  longitude?: number
  auditId: string
  calculatedAt: string // ISO string
  gapPercent: number
  actualPlnKwhPerMonth: number
  standardKwhPerMonth: number
  standardKwhPerDay: number
  validationStatus: 'PENDING' | 'VALIDATED'
  isDemo: boolean
}

export interface SangatBorosPriorityItem extends SangatBorosStore {
  isInstalled: boolean
  deviceCount: number
}

export type SangatBorosListStatus = 'ok' | 'missing' | 'error'

// Main panel (R/S/T) daily average compared with the PLN bill and the standard
export interface SangatBorosComparison {
  store: SangatBorosStore
  periodLabel: string // e.g. "Okt 2026"
  mainPanelDays: number // days in the period with main panel kWh > 0
  avgDailyMainKwh: number | null
  reductionVsPlnPct: number | null // positive = lower than the PLN bill before IoT
  vsStandardPct: number | null // positive = above the standard
}

export interface PhaseData {
  phase: string // e.g. "L12", "L13", "L14", "L1"
  phaseName?: string // e.g. "Fase R", "Fase S", "Fase T"
  voltage: number // Volt
  current: number // Ampere
  power: number // Watt
  powerFactor: number // 0-1
}

export interface Store {
  id: string
  code: string // Kode Toko (e.g. 2JC2, 1YI4, etc)
  name: string // Nama Toko
  branch: string // Cabang (e.g. CIANJUR, GORONTALO)
  photoUrl?: string
  latitude?: number
  longitude?: number
  status: StoreStatus
  kwhTotal: number
  // 'main': R/S/T of the main panel. 'sensor': sub-meters only. 'none': no reading available.
  energyBasis?: 'main' | 'sensor' | 'none'
  deviceCount: number
  lastUpdate: string // ISO string or time string
  phases: PhaseData[]
  deviceId?: string
  plnPowerVa?: number
  is24Hours?: boolean
  salesAreaM2?: number
  warehouseAreaM2?: number
  isRecording?: boolean
  recordingStalled?: boolean // reported as recording, but no new rows arrive
  recordingSessionName?: string
  isOnline?: boolean
}

export interface SensorMeta {
  phase: string // e.g. "L12", "L13", "L14", "L6"
  name: string // e.g. "Fase R", "Fase S", "Fase T", "Dummy"
  color: string
}

export type MetricType = 'power' | 'voltage' | 'current' | 'powerFactor' | 'energy' | 'frequency'
export type TimeRangeType = 'day' | 'week' | 'month' | 'year' | 'session'

export interface TelemetryPoint {
  timestamp: string // "HH:MM" or "DD/MM HH:MM" format
  fullTime?: string // "YYYY-MM-DD HH:MM" format
  totalPower?: number
  // Dynamic fields by sensor phase code: [phase]_[metric]
  // e.g. L12_power, L12_voltage, L13_power, L6_power, etc.
  [key: string]: any
}

export interface PaginationMeta {
  page: number
  totalPages: number
  totalPoints: number
  pageSize: number
}

export interface TelemetryHistoryResult {
  sensors: SensorMeta[]
  points: TelemetryPoint[]
  availableDates?: string[]
  pagination?: PaginationMeta
}

export interface AuditSession {
  id: string
  storeId: string
  label: string // e.g. "Toko DC Cianjur Bulan Juli"
  startDate: string
  endDate: string | null
  isActive: boolean
  dataPointCount?: number
}

export interface MonthlyCostRecord {
  monthKey: string // "YYYY-MM"
  monthLabel: string // "Maret 2026"
  monthShortLabel: string // "Mar 2026"
  year: number
  month: number
  kwh: number
  cost: number
  previousCost?: number
  diffPercentage?: number
  isCurrentMonth?: boolean
  activeStoresCount?: number
  avgDailyKwh?: number
}

export interface LiveBufferResult {
  sensors: SensorMeta[]
  points: TelemetryPoint[]
  offline: boolean
  lastEpoch: number | null
}

export interface SessionRecord {
  timestamp: string // "HH:MM:SS DD/MM/YYYY" WIB, as stored by Flask
  epoch: number
  offline: boolean
  voltage: number
  current: number
  power: number
  frequency: number
  energy: number // cumulative counter, not a delta
  powerFactor: number
}

export interface SessionPhaseRecords {
  phase: string // raw key as stored, e.g. "L12", "CT"
  name: string
  records: SessionRecord[]
}

export interface SessionInfo {
  id: string
  name: string
  deviceId: string
  deviceName: string
  startTime: string
  endTime: string | null
  recordCount: number
}

export interface SessionRecordsResult {
  session: SessionInfo
  phases: SessionPhaseRecords[]
}

export interface RecordingSessionSummary {
  id: string
  name: string
  deviceId: string
  deviceName: string
  storeId: string | null
  storeCode: string | null
  storeName: string | null
  startEpoch: number
  endEpoch: number
  recordCount: number
  phases: string[]
}

export interface SessionSummaryStats {
  totalRecords: number
  onlineRecords: number
  offlineRecords: number
  avgVoltage: number
  avgCurrent: number
  avgPower: number
  avgFrequency: number
  avgPowerFactor: number
  energyKwh: number
}

export interface CaptureState {
  active: boolean
  finalizing: boolean
  sessionId: string | null
  sessionName: string | null
  interval: number | null // seconds
  count: number
  startedAt: string | null
  lastRecordAt?: number | null // epoch ms; undefined when it could not be read
  stalled?: boolean
}

export interface ManagedSensor {
  phase: string
  name: string
  enabled: boolean
  color: string | null
}

export interface ManagedDevice {
  id: string
  name: string
  kind: 'CT' | 'Plug' | 'Meter energi'
  online: boolean
  lastSeen: string | null
  deviceClock: number | null // time the device itself reported, epoch ms
  storeId: string | null
  position: { latitude: number | null; longitude: number | null }
  sensors: ManagedSensor[]
  capture: CaptureState | null // null when the IoT server did not answer
}

export interface StoreOption {
  id: string
  code: string
  name: string
  branch: string
}
