import 'server-only'
import { jakartaRange, jakartaToday } from '@/lib/jakarta-range'
import { getRequestScope } from '@/lib/auth/access'
import { getSpartaPool } from '@/lib/db/pools'
import { readOnlyQuery } from '@/lib/db/read-only'
import {
  appendSample,
  dailyUsage,
  findMyEcoStore,
  hourlyUsage,
  MYECO_POLL_MS,
  MYECO_STORES,
  parseMeters,
  todayKwh,
  type MeterReading,
  type MyEcoHistory,
  type MyEcoLive,
  type MyEcoStore,
  type PowerSample,
} from '@/lib/myeco'
import { createMyEcoClient } from '@/lib/myeco-client'
import { createSharedFetch } from '@/lib/shared-fetch'

const DEFAULT_URL = 'https://devmyeco.my.id'
const HISTORY_DAYS = 30
const DAY_MS = 24 * 60 * 60_000
const MAX_SAMPLES = 240 // one hour of 15 s samples

interface Snapshot {
  at: number
  readings: Map<string, MeterReading>
}

function createMyEcoState() {
  const get = createMyEcoClient({
    baseUrl: (process.env.MYECO_API_URL || DEFAULT_URL).replace(/\/+$/, ''),
    apiKey: process.env.MYECO_API_KEY?.trim() ?? '',
  })
  let samples: PowerSample[] = []

  return {
    samples: () => samples,
    // One list call holds every meter, whatever the number of stores and viewers.
    snapshot: createSharedFetch<Snapshot>(
      async () => {
        const raw = await get('/open/energy-meter?limit=100')
        const at = Date.now()
        const readings = parseMeters(raw, at)
        const power: PowerSample['power'] = {}
        for (const [id, r] of readings) power[id] = r.state === 'live' ? r.power : null
        samples = appendSample(samples, { at, power }, MAX_SAMPLES)
        return { at, readings }
      },
      // Just under the poll interval, so a viewer's next poll is never served the same snapshot.
      { ttlMs: MYECO_POLL_MS - 1000, failureBackoffMs: 15_000 }
    ),
    logs: createSharedFetch<unknown>(
      (meterId) => {
        const now = Date.now()
        const query = new URLSearchParams({
          // From a Jakarta midnight, so the first day is whole.
          start_date: new Date(jakartaRange('day', jakartaToday()).from - (HISTORY_DAYS - 1) * DAY_MS).toISOString(),
          end_date: new Date(now).toISOString(),
          limit: '1000',
        })
        return get(`/open/energy-meter/${encodeURIComponent(meterId)}/history?${query}`)
      },
      { ttlMs: 5 * 60_000, failureBackoffMs: 30_000 }
    ),
  }
}

// Pages and API routes are bundled apart; globalThis gives them one token and one cache.
declare global {
  var _myEco: ReturnType<typeof createMyEcoState> | undefined
}
const state = () => (globalThis._myEco ??= createMyEcoState())

// GS access is per own device, and myECO meters are not on that list.
export async function getMyEcoStore(code: string): Promise<MyEcoStore | null> {
  const scope = await getRequestScope()
  return scope.kind === 'all' ? findMyEcoStore(code) : null
}

export async function getMyEcoLive(store: MyEcoStore): Promise<MyEcoLive> {
  const [{ at, readings }, logs] = await Promise.all([
    state().snapshot('all'),
    Promise.all(store.meters.map((m) => state().logs(m.id).catch(() => null))),
  ])
  const now = Date.now()
  return {
    at,
    meters: store.meters.map((m, i) => {
      const reading: MeterReading = readings.get(m.id) ?? {
        power: null,
        current: null,
        voltage: null,
        powerFactor: null,
        kwhTotal: null,
        updatedAt: null,
        state: 'offline',
      }
      return { ...m, ...reading, todayKwh: logs[i] === null ? null : todayKwh(logs[i], reading.kwhTotal, now) }
    }),
    samples: state()
      .samples()
      .map((s) => ({ at: s.at, power: Object.fromEntries(store.meters.map((m) => [m.id, s.power[m.id] ?? null])) })),
  }
}

export async function getMyEcoHistory(store: MyEcoStore): Promise<MyEcoHistory> {
  const meters = await Promise.all(
    store.meters.map(async (m) => {
      const hours = hourlyUsage(await state().logs(m.id))
      return { ...m, hours, days: dailyUsage(hours) }
    })
  )
  return { meters }
}

export interface MyEcoListItem {
  code: string
  name: string
  branch: string
  meterCount: number
  onlineCount: number | null // null when myECO did not answer
  powerWatts: number | null
}

export async function getMyEcoList(): Promise<MyEcoListItem[]> {
  const scope = await getRequestScope()
  if (scope.kind !== 'all') return []
  const [stores, snapshot] = await Promise.all([
    readOnlyQuery<{ code: string; name: string; branch: string | null }>(
      getSpartaPool(),
      'SELECT code, name, branch FROM stores WHERE code = ANY($1) ORDER BY name',
      [MYECO_STORES.map((s) => s.code)]
    ),
    state()
      .snapshot('all')
      .catch((error) => {
        console.error('myECO list:', error instanceof Error ? error.message : 'gagal')
        return null
      }),
  ])
  return stores.rows.flatMap((row) => {
    const meters = findMyEcoStore(row.code)?.meters
    if (!meters) return []
    const live = snapshot?.readings
      ? meters.flatMap((m) => {
          const reading = snapshot.readings.get(m.id)
          return reading?.state === 'live' ? [reading] : []
        })
      : null
    return [
      {
        code: row.code,
        name: row.name,
        branch: row.branch || '-',
        meterCount: meters.length,
        onlineCount: live?.length ?? null,
        powerWatts: live && live.length > 0 ? live.reduce((sum, r) => sum + (r.power ?? 0), 0) : null,
      },
    ]
  })
}
