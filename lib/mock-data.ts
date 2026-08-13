// lib/mock-data.ts
import type { Store, TelemetryPoint, AuditSession } from './types'

export const MOCK_STORES: Store[] = [
  {
    id: 'pondok-kacang-3',
    name: 'Alfamart Pondok Kacang 3',
    address: 'Jl. Pondok Kacang Raya No. 3, Pondok Karya, Tangerang Selatan',
    photoUrl: '/mock/store-1.jpg',
    status: 'live',
    kwhTotal: 1842.5,
    deviceCount: 3,
    lastUpdate: new Date(Date.now() - 45 * 1000).toISOString(),
    phases: [
      { phase: 'L1', voltage: 221.4, current: 12.8, power: 2834, powerFactor: 0.95 },
      { phase: 'L2', voltage: 219.8, current: 10.2, power: 2241, powerFactor: 0.93 },
      { phase: 'L3', voltage: 222.1, current: 13.5, power: 2999, powerFactor: 0.94 },
    ],
  },
  {
    id: 'exit-tol-jelupang',
    name: 'Alfamart Exit Tol Jelupang',
    address: 'Jl. Raya Serpong, Exit Tol Jelupang, Tangerang Selatan',
    photoUrl: '/mock/store-2.jpg',
    status: 'live',
    kwhTotal: 2103.7,
    deviceCount: 3,
    lastUpdate: new Date(Date.now() - 120 * 1000).toISOString(),
    phases: [
      { phase: 'L1', voltage: 220.0, current: 15.1, power: 3322, powerFactor: 0.92 },
      { phase: 'L2', voltage: 218.5, current: 14.3, power: 3124, powerFactor: 0.91 },
      { phase: 'L3', voltage: 221.3, current: 16.0, power: 3541, powerFactor: 0.93 },
    ],
  },
  {
    id: 'bsd-sektor-7',
    name: 'Alfamart BSD Sektor 7',
    address: 'Jl. Pahlawan Seribu, BSD City, Tangerang Selatan',
    photoUrl: '/mock/store-3.jpg',
    status: 'historical',
    kwhTotal: 3456.2,
    deviceCount: 2,
    lastUpdate: new Date('2026-08-10T14:30:00').toISOString(),
    phases: [],
  },
  {
    id: 'ciputat-timur',
    name: 'Alfamart Ciputat Timur',
    address: 'Jl. Raya Ciputat, Ciputat Timur, Tangerang Selatan',
    photoUrl: '/mock/store-4.jpg',
    status: 'historical',
    kwhTotal: 1928.4,
    deviceCount: 2,
    lastUpdate: new Date('2026-07-28T09:15:00').toISOString(),
    phases: [],
  },
  {
    id: 'pamulang-permai',
    name: 'Alfamart Pamulang Permai',
    address: 'Jl. Surya Kencana, Pamulang, Tangerang Selatan',
    photoUrl: '/mock/store-5.jpg',
    status: 'unassigned',
    kwhTotal: 0,
    deviceCount: 0,
    lastUpdate: '',
    phases: [],
  },
  {
    id: 'serpong-bumi',
    name: 'Alfamart Serpong Bumi',
    address: 'Jl. Raya Serpong, Serpong, Tangerang Selatan',
    photoUrl: '/mock/store-6.jpg',
    status: 'unassigned',
    kwhTotal: 0,
    deviceCount: 0,
    lastUpdate: '',
    phases: [],
  },
]

export function getMockStore(id: string): Store | undefined {
  return MOCK_STORES.find((s) => s.id === id)
}

export function getMockTelemetry(storeId: string): TelemetryPoint[] {
  const base = storeId === 'exit-tol-jelupang' ? 3200 : 2800
  return Array.from({ length: 48 }, (_, i) => {
    const hour = Math.floor(i / 2)
    const minute = i % 2 === 0 ? '00' : '30'
    const isPeak = hour >= 10 && hour <= 14
    const isLow = hour >= 0 && hour <= 5
    const multiplier = isPeak ? 1.4 : isLow ? 0.3 : 1.0
    const jitter = () => (Math.random() - 0.5) * 200
    const p1 = Math.max(0, base * multiplier * 0.33 + jitter())
    const p2 = Math.max(0, base * multiplier * 0.33 + jitter())
    const p3 = Math.max(0, base * multiplier * 0.34 + jitter())
    return {
      timestamp: `${String(hour).padStart(2, '0')}:${minute}`,
      powerL1: Math.round(p1),
      powerL2: Math.round(p2),
      powerL3: Math.round(p3),
      totalPower: Math.round(p1 + p2 + p3),
    }
  })
}

export const MOCK_AUDIT_SESSIONS: AuditSession[] = [
  {
    id: 's1',
    storeId: 'pondok-kacang-3',
    label: '10–17 Agt 2026 (Aktif)',
    startDate: '2026-08-10',
    endDate: null,
    isActive: true,
  },
  {
    id: 's2',
    storeId: 'pondok-kacang-3',
    label: '15–22 Jul 2026',
    startDate: '2026-07-15',
    endDate: '2026-07-22',
    isActive: false,
  },
  {
    id: 's3',
    storeId: 'exit-tol-jelupang',
    label: '10–17 Agt 2026 (Aktif)',
    startDate: '2026-08-10',
    endDate: null,
    isActive: true,
  },
  {
    id: 's4',
    storeId: 'bsd-sektor-7',
    label: '1–10 Agt 2026',
    startDate: '2026-08-01',
    endDate: '2026-08-10',
    isActive: false,
  },
  {
    id: 's5',
    storeId: 'ciputat-timur',
    label: '21–28 Jul 2026',
    startDate: '2026-07-21',
    endDate: '2026-07-28',
    isActive: false,
  },
]
