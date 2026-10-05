export type StoreStatus = 'live' | 'historical' | 'unassigned'

export interface DailyConsumption {
  day: string
  dayDate: string
  dayLabel?: string
  dayFullDate?: string
  kwh: number
  cost: number
}

export interface LoadProfilePoint {
  time: string // "00:00", "01:00", ...
  fullTime?: string // "14:00 WIB"
  powerWatts: number
  powerKw: number
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
  isLive: boolean
  peakPowerWatts: number
  avgPowerWatts: number
  basePowerWatts: number
  loadProfile24h: LoadProfilePoint[]
  dailyConsumption: DailyConsumption[]
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
  deviceCount: number
  lastUpdate: string // ISO string or time string
  phases: PhaseData[]
  deviceId?: string
  plnPowerVa?: number
  is24Hours?: boolean
  salesAreaM2?: number
  warehouseAreaM2?: number
}

export interface SensorMeta {
  phase: string // e.g. "L12", "L13", "L14", "L6"
  name: string // e.g. "Fase R", "Fase S", "Fase T", "Dummy"
  color: string
}

export type MetricType = 'power' | 'voltage' | 'current' | 'powerFactor' | 'energy' | 'frequency'
export type TimeRangeType = 'day' | 'week' | 'session'

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

