// Phase key rules shared by live data, sessions and exported files.
// No imports, so `node --test` can load this file directly.

const PHASE_ALIASES: Record<string, 'R' | 'S' | 'T'> = {
  L12: 'R', L1: 'R', R: 'R',
  L13: 'S', L2: 'S', S: 'S',
  L14: 'T', L3: 'T', T: 'T',
}

// Keys in a Flask live payload that are not sensors.
const NON_PHASE_KEYS = new Set(['Timestamp', 'timestamp', 'meta', 'offline', 'status', 'cmd', 'realtime', 'RealTime'])
const PHASE_KEY_PATTERN = /^[A-Za-z0-9_\-\s]{1,50}$/
const MAIN_ORDER: Record<string, number> = { R: 0, S: 1, T: 2 }

export function normalizePhaseKey(raw: string): string {
  const key = raw.trim()
  return PHASE_ALIASES[key.toUpperCase()] ?? key
}

export function isExcludedPhase(raw: string): boolean {
  const key = raw.trim().toUpperCase()
  return key === 'L6' || key.includes('DUMMY')
}

export function isPhaseKey(key: string): boolean {
  if (!key || NON_PHASE_KEYS.has(key)) return false
  return PHASE_KEY_PATTERN.test(key.trim()) && key.trim().length > 0
}

// Object.hasOwn so sensor keys like "constructor" are not read from Object.prototype.
const mainOrder = (phase: string): number => (Object.hasOwn(MAIN_ORDER, phase) ? MAIN_ORDER[phase] : 99)

export function comparePhase(a: string, b: string): number {
  const oa = mainOrder(a)
  const ob = mainOrder(b)
  if (oa !== ob) return oa - ob
  return a.localeCompare(b, 'id-ID', { numeric: true })
}

export function defaultPhaseName(phase: string): string {
  return Object.hasOwn(MAIN_ORDER, phase) ? `Fase ${phase}` : phase
}

// Every colour here keeps 3:1 against the light and dark card (tests/phase-keys.test.mjs).
export const DEFAULT_PALETTE = [
  '#2e9b84',
  '#3b82f6',
  '#c27803',
  '#a855f7',
  '#ec4899',
  '#0e93ab',
  '#e0641a',
  '#7b8794',
]

export function sensorColor(phase: string, name: string, index: number): string {
  const p = phase.toUpperCase()
  const n = (name || '').toLowerCase()

  if (n.includes('fase r') || n.includes('phase r') || p === 'R') return '#2e9b84'
  if (n.includes('fase s') || n.includes('phase s') || p === 'S') return '#3b82f6'
  if (n.includes('fase t') || n.includes('phase t') || p === 'T') return '#c27803'
  if (n.includes('ac') || n.includes('air conditioner') || n.includes('hvac') || n.includes('cooler')) return '#0e93ab'
  if (n.includes('chiller') || n.includes('showcase') || n.includes('refrigerat')) return '#3b82f6'
  if (n.includes('freezer')) return '#7477f3'
  if (n.includes('lampu') || n.includes('light') || n.includes('penerangan')) return '#a88400'
  if (n.includes('heater') || n.includes('cooker') || n.includes('oven') || n.includes('microwave')) return '#e0641a'
  if (n.includes('dummy') || p === 'L6') return '#7b8794'

  return DEFAULT_PALETTE[index % DEFAULT_PALETTE.length]
}
