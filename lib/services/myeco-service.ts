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
  type MyEcoPower,
  type MyEcoStore,
  type PowerSample,
} from '@/lib/myeco'
import { createMyEcoArchive } from '@/lib/myeco-archive'
import { createMyEcoClient } from '@/lib/myeco-client'
import { averageSamples, mergeSamples, nextDelay, POWER_RANGES, type PowerRange } from '@/lib/myeco-samples'
import { createSharedFetch } from '@/lib/shared-fetch'

const DEFAULT_URL = 'https://devmyeco.my.id'
const HISTORY_DAYS = 30
const DAY_MS = 24 * 60 * 60_000
const MAX_SAMPLES = 240 // one hour of 15 s samples
const SAVE_EVERY_MS = 60_000
const MAX_UNSAVED = 960 // four hours, when the volume cannot be written
const CLEANUP_EVERY_MS = 6 * 60 * 60_000

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
  let unsaved: PowerSample[] = []
  let recording = false
  const dataDir = process.env.REPORT_DATA_DIR?.trim()
  const archive = dataDir ? createMyEcoArchive(dataDir) : null

  // Taken out before writing: a sample that arrives meanwhile waits for the next save.
  async function save(): Promise<void> {
    if (!archive || unsaved.length === 0) return
    const batch = unsaved
    unsaved = []
    try {
      await archive.append(batch)
    } catch (error) {
      unsaved = [...batch, ...unsaved].slice(-MAX_UNSAVED)
      throw error
    }
  }

  return {
    samples: () => samples,
    archive,
    save,
    isConfigured: Boolean(process.env.MYECO_API_KEY?.trim()),
    startRecording: () => {
      if (recording) return false
      recording = true
      return true
    },
    restore: (older: PowerSample[]) => {
      samples = mergeSamples(older, samples).slice(-MAX_SAMPLES)
    },
    // Stored and not yet stored samples of every meter.
    range: createSharedFetch<PowerSample[]>(
      async (key) => {
        const now = Date.now()
        const { ms, bucketMs } = POWER_RANGES[key as PowerRange]
        const stored = archive ? await archive.read(now - ms, now) : []
        const ids = MYECO_STORES.flatMap((s) => s.meters.map((m) => m.id))
        return averageSamples(mergeSamples(stored, samples, unsaved), ids, now - ms, bucketMs)
      },
      { ttlMs: 60_000, failureBackoffMs: 15_000 }
    ),
    // One list call holds every meter, whatever the number of stores and viewers.
    snapshot: createSharedFetch<Snapshot>(
      async () => {
        const raw = await get('/open/energy-meter?limit=100')
        const at = Date.now()
        const readings = parseMeters(raw, at)
        const power: PowerSample['power'] = {}
        for (const [id, r] of readings) power[id] = r.state === 'live' ? r.power : null
        samples = appendSample(samples, { at, power }, MAX_SAMPLES)
        if (recording && archive) unsaved = [...unsaved, { at, power }].slice(-MAX_UNSAVED)
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

const reason = (error: unknown) =>
  (error as NodeJS.ErrnoException | null)?.code ?? (error instanceof Error ? error.message : 'gagal')

// Reads and stores without any viewer. Production only, so a local server never doubles the calls.
export function startMyEcoRecorder(): void {
  const s = state()
  if (!s.isConfigured || !s.startRecording()) return
  if (!s.archive) console.error('myECO: REPORT_DATA_DIR belum diisi, daya AC hanya disimpan di memori.')

  let failures = 0
  let savedAt = Date.now()
  let cleanedAt = 0

  const loop = async () => {
    try {
      await s.snapshot('all')
      failures = 0
    } catch (error) {
      failures += 1
      if (failures === 1) console.error('myECO recorder:', reason(error))
    }
    const now = Date.now()
    if (now - savedAt >= SAVE_EVERY_MS) {
      savedAt = now
      await s.save().catch((error) => console.error('myECO: gagal menyimpan', reason(error)))
    }
    if (s.archive && now - cleanedAt >= CLEANUP_EVERY_MS) {
      cleanedAt = now
      await s.archive.removeExpired(now).catch((error) => console.error('myECO: gagal menghapus file lama', reason(error)))
    }
    setTimeout(loop, nextDelay(failures)).unref()
  }

  const now = Date.now()
  const restored = s.archive ? s.archive.read(now - POWER_RANGES['1h'].ms, now).then(s.restore) : Promise.resolve()
  restored.catch((error) => console.error('myECO: gagal memuat data lama', reason(error))).finally(loop)
}

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

export async function getMyEcoPower(store: MyEcoStore, range: PowerRange): Promise<MyEcoPower> {
  const samples = await state().range(range)
  return {
    meters: store.meters,
    bucketMs: POWER_RANGES[range].bucketMs,
    samples: samples.map((s) => ({
      at: s.at,
      power: Object.fromEntries(store.meters.map((m) => [m.id, s.power[m.id] ?? null])),
    })),
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
