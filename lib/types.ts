// lib/types.ts
export type StoreStatus = 'live' | 'historical' | 'unassigned'

export interface PhaseData {
  phase: 'L1' | 'L2' | 'L3'
  voltage: number // Volt
  current: number // Ampere
  power: number // Watt
  powerFactor: number // 0-1
}

export interface Store {
  id: string
  name: string
  address: string
  photoUrl: string
  status: StoreStatus
  kwhTotal: number
  deviceCount: number
  lastUpdate: string // ISO string
  phases: PhaseData[]
}

export interface TelemetryPoint {
  timestamp: string // "HH:MM" format
  powerL1: number
  powerL2: number
  powerL3: number
  totalPower: number
}

export interface AuditSession {
  id: string
  storeId: string
  label: string // e.g. "10-17 Aug 2026 (Aktif)"
  startDate: string
  endDate: string | null
  isActive: boolean
}
