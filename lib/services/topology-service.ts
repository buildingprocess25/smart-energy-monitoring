import 'server-only'
import { getTelemetryPool } from '@/lib/db/pools'
import { readOnlyQuery } from '@/lib/db/read-only'
import { resolveTopology, type TopologyMap } from '@/lib/device-topology'
import { createStaleCache } from '@/lib/stale-cache'

export interface DeviceTopology {
  version: string // changes whenever Flask records a new location
  map: TopologyMap
}

export const EMPTY_TOPOLOGY: DeviceTopology = { version: 'none', map: new Map() }

type Row = { id: number; mac: string; notes: string; valid_from: string; valid_to: string | null }

async function load(): Promise<DeviceTopology> {
  try {
    const res = await readOnlyQuery<Row>(
      getTelemetryPool(),
      'SELECT id, mac, notes, valid_from, valid_to FROM device_topology ORDER BY valid_from, id',
      []
    )
    const version = res.rows.map((r) => `${r.id}:${r.valid_to ?? ''}`).join(',') || 'none'
    return {
      version,
      map: resolveTopology(
        res.rows.map((r) => ({
          mac: r.mac,
          notes: r.notes,
          validFrom: Number(r.valid_from),
          validTo: r.valid_to === null ? null : Number(r.valid_to),
        }))
      ),
    }
  } catch (error) {
    // 42P01: Flask has not created the table yet, so no device has a location.
    if ((error as { code?: string }).code === '42P01') return EMPTY_TOPOLOGY
    throw error
  }
}

declare global {
  var _topologyCache: ReturnType<typeof createStaleCache<DeviceTopology>> | undefined
}

const topologyCache = (globalThis._topologyCache ??= createStaleCache<DeviceTopology>({
  ttlMs: 60_000,
  onError: (error) => console.error('Error reading device topology:', error),
}))

// Every device, not limited to the viewer's scope. Callers apply the scope.
export function getDeviceTopology(): Promise<DeviceTopology> {
  return topologyCache('all', load)
}
