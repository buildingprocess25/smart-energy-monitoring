// Store location of SpartaEnergy CT and Plug devices, recorded by Flask in device_topology
// from the retained MQTT topic SpartaEnergy/meta/<MAC>/notes ("T105/MDP/R").
// No `@/` imports, so `node --test` can load this file directly.
import { BUCKET_MS, type BucketRow } from './energy-index.ts'

export const MAIN_PANELS: ReadonlySet<string> = new Set(['MDP', 'LVMDP'])
const MAIN_PHASES = new Set(['R', 'S', 'T', '1F'])
const VIRTUAL_PREFIX = 'SPARTA-'
const UNSAFE_KEY_CHARS = /[^A-Za-z0-9_\- ]/g
const OPEN_END = Number.MAX_SAFE_INTEGER

export interface TopologyRow {
  mac: string
  notes: string
  validFrom: number // epoch ms
  validTo: number | null // null while it still holds
}

export interface Placement {
  mac: string
  storeCode: string
  deviceId: string // virtual store device, SPARTA-<code>
  phase: string // R/S/T/1F on a main panel, otherwise the panel name
  panel: string
  main: boolean // counts toward the store total
  validFrom: number
  validTo: number | null
}

// Phases a three-phase device reports itself, after normalizePhaseKey.
const REPORTED_PHASES = new Set(['R', 'S', 'T'])

export type TopologyMap = Map<string, Placement[]>

export function parseNotes(notes: string): { storeCode: string; panel: string; phase: string } | null {
  const [storeCode = '', panel = '', phase = ''] = notes.trim().split('/').map((p) => p.trim().toUpperCase())
  if (!storeCode || !panel) return null
  // "T200/SHOWCASE" has no phase; the guide treats it as a single-phase load.
  return { storeCode, panel, phase: phase || '1F' }
}

export function phaseKeyFor(panel: string, phase: string): string {
  if (MAIN_PANELS.has(panel) && MAIN_PHASES.has(phase)) return phase
  const name = phase === '1F' ? panel : `${panel} ${phase}`
  return name.replace(UNSAFE_KEY_CHARS, '').trim().slice(0, 50) || 'SUB'
}

export function macOf(deviceId: string): string | null {
  const match = /^(?:ct|plug)-([0-9a-f]{6})$/i.exec(deviceId.trim())
  return match ? match[1].toUpperCase() : null
}

export const virtualDeviceId = (storeCode: string) => `${VIRTUAL_PREFIX}${storeCode}`
export const isVirtualDeviceId = (id: string) => id.startsWith(VIRTUAL_PREFIX)

const end = (p: { validTo: number | null }) => p.validTo ?? OPEN_END

export function resolveTopology(rows: TopologyRow[]): TopologyMap {
  const placements: Placement[] = []
  for (const row of rows) {
    const parsed = parseNotes(row.notes)
    if (!parsed) continue
    placements.push({
      mac: row.mac.toUpperCase(),
      storeCode: parsed.storeCode,
      deviceId: virtualDeviceId(parsed.storeCode),
      phase: phaseKeyFor(parsed.panel, parsed.phase),
      panel: parsed.panel,
      main: MAIN_PANELS.has(parsed.panel),
      validFrom: row.validFrom,
      validTo: row.validTo,
    })
  }

  // Two devices on one store phase: the one configured last takes over from that moment.
  placements.sort((a, b) => a.validFrom - b.validFrom)
  const latestBySlot = new Map<string, Placement>()
  for (const p of placements) {
    const slot = `${p.deviceId}\n${p.phase}`
    const earlier = latestBySlot.get(slot)
    if (earlier && earlier.mac !== p.mac && end(earlier) > p.validFrom) earlier.validTo = p.validFrom
    latestBySlot.set(slot, p)
  }

  const map: TopologyMap = new Map()
  for (const p of placements) {
    if (end(p) <= p.validFrom) continue
    const list = map.get(p.mac)
    if (list) list.push(p)
    else map.set(p.mac, [p])
  }
  return map
}

export function placementAt(map: TopologyMap, mac: string, epochMs: number): Placement | null {
  for (const p of map.get(mac) ?? []) {
    if (p.validFrom <= epochMs && epochMs < end(p)) return p
  }
  return null
}

// A device that reports R/S/T itself (a three-phase CT) keeps those phases; a single channel
// (CT, PG) takes the phase from its notes.
export function storePhaseFor(p: Placement, rawPhase: string): string {
  if (!REPORTED_PHASES.has(rawPhase)) return p.phase
  return p.main ? rawPhase : `${phaseKeyFor(p.panel, '1F')} ${rawPhase}`
}

const reportedPrefix = (p: Placement) => (p.main ? '' : phaseKeyFor(p.panel, '1F'))

// prefix is what goes before an R/S/T the device reports itself (see storePhaseFor).
export function currentMembers(map: TopologyMap, nowMs: number): Map<string, { mac: string; phase: string; prefix: string }[]> {
  const members = new Map<string, { mac: string; phase: string; prefix: string }[]>()
  for (const mac of map.keys()) {
    const p = placementAt(map, mac, nowMs)
    if (!p) continue
    const member = { mac, phase: p.phase, prefix: reportedPrefix(p) }
    const list = members.get(p.deviceId)
    if (list) list.push(member)
    else members.set(p.deviceId, [member])
  }
  return members
}

export function macsEverIn(map: TopologyMap, virtualId: string): string[] {
  const macs = new Set<string>()
  for (const [mac, list] of map) if (list.some((p) => p.deviceId === virtualId)) macs.add(mac)
  return [...macs].sort()
}

// The physical row stays for device health and sessions; the copy feeds the store.
export function expandBucketRows(rows: BucketRow[], map: TopologyMap): BucketRow[] {
  if (map.size === 0) return rows
  const out: BucketRow[] = []
  for (const row of rows) {
    out.push(row)
    const mac = macOf(row.deviceId)
    const p = mac ? placementAt(map, mac, row.bucket * BUCKET_MS) : null
    if (p) out.push({ ...row, deviceId: p.deviceId, phase: storePhaseFor(p, row.phase) })
  }
  return out
}

// SQL filter and phase expression for one device. A virtual store device reads each
// placement of its members only inside the time it held, so the (device_id, epoch) index is used.
export function sqlSource(
  deviceId: string,
  map: TopologyMap,
  firstParam: number,
  phaseSql: string
): { where: string; phase: string; params: unknown[] } {
  if (!isVirtualDeviceId(deviceId)) return { where: `device_id = $${firstParam}`, phase: phaseSql, params: [deviceId] }

  const params: unknown[] = []
  const conditions: string[] = []
  const cases: string[] = []
  for (const list of map.values()) {
    for (const p of list) {
      if (p.deviceId !== deviceId) continue
      const n = firstParam + params.length
      params.push([`CT-${p.mac}`, `Plug-${p.mac}`], p.validFrom, end(p), p.phase, reportedPrefix(p))
      const condition = `device_id = ANY($${n}::text[]) AND epoch >= $${n + 1} AND epoch < $${n + 2}`
      conditions.push(`(${condition})`)
      // Same rule as storePhaseFor, in SQL.
      cases.push(
        `WHEN ${condition} THEN CASE WHEN ${phaseSql} IN ('R', 'S', 'T') THEN ltrim($${n + 4}::text || ' ' || ${phaseSql}) ELSE $${n + 3}::text END`
      )
    }
  }
  if (conditions.length === 0) return { where: 'FALSE', phase: phaseSql, params: [] }
  return { where: `(${conditions.join(' OR ')})`, phase: `CASE ${cases.join(' ')} ELSE ${phaseSql} END`, params }
}
