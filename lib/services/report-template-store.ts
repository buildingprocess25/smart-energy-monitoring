import 'server-only'
import { randomUUID } from 'node:crypto'
import { mkdir, readdir, readFile, rename, stat, unlink, writeFile } from 'node:fs/promises'
import path from 'node:path'
import type { MailSettings, RecipientGroup } from '@/lib/mail-settings'
import type { SealedSecret } from '@/lib/secret-box'
import type { TemplateSpec } from '@/lib/workbook'

// Files on a Dokploy volume: this app may not write to either database.
export interface SavedTemplate extends TemplateSpec {
  id: string
  activeSince: number // slots before this are never sent
  updatedBy: string
}

export type RunStatus = 'sending' | 'sent' | 'failed' | 'unknown'
export interface Run {
  slot: number
  attempt: number
  at: number
  status: RunStatus
  test: boolean
  error: string | null
}

const MAX_TEMPLATES = 50
const KEEP_RUNS = 20
const CLAIM_AGE_MS = 7 * 86_400_000

export class StoreError extends Error {}

export const isTemplateId = (id: unknown): id is string => typeof id === 'string' && /^[0-9a-f-]{36}$/.test(id)
export const isStoreConfigured = () => Boolean(process.env.REPORT_DATA_DIR?.trim())

function file(...parts: string[]): string {
  const dir = process.env.REPORT_DATA_DIR?.trim()
  if (!dir) throw new StoreError('REPORT_DATA_DIR belum diisi di server.')
  return path.join(/* turbopackIgnore: true */ dir, ...parts)
}

async function readJson<T>(name: string, empty: T): Promise<T> {
  try {
    return JSON.parse(await readFile(file(name), 'utf8')) as T
  } catch (error) {
    // A damaged file must not be replaced by an empty one.
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') return empty
    throw error
  }
}

async function writeJson(name: string, value: unknown): Promise<void> {
  await mkdir(file(), { recursive: true })
  const temporary = file(`${name}.${randomUUID()}.tmp`)
  await writeFile(temporary, JSON.stringify(value), { mode: 0o600 })
  await rename(temporary, file(name))
}

// Routes and instrumentation.ts are bundled apart, so the queue is global.
declare global {
  var _reportStoreQueue: Promise<unknown> | undefined
}

function queued<T>(run: () => Promise<T>): Promise<T> {
  const next = (globalThis._reportStoreQueue ?? Promise.resolve()).catch(() => {}).then(run)
  globalThis._reportStoreQueue = next.catch(() => {})
  return next
}

const TEMPLATES = 'templates.json'
const RUNS = 'runs.json'
const SETTINGS = 'mail-settings.json'
const SUBSCRIBERS = 'subscribers.json'
const GROUPS = 'groups.json'
const MAX_GROUPS = 50

export type StoredMailSettings = MailSettings & { secret: SealedSecret }

export const readMailSettings = () => readJson<StoredMailSettings | null>(SETTINGS, null)
export const readSubscriberIds = () => readJson<string[]>(SUBSCRIBERS, [])
export const readGroups = () => readJson<RecipientGroup[]>(GROUPS, [])
export const saveMailSettings = (settings: StoredMailSettings) => queued(() => writeJson(SETTINGS, settings))

export function setSubscribed(userId: string, subscribed: boolean): Promise<void> {
  return queued(async () => {
    const others = (await readSubscriberIds()).filter((id) => id !== userId)
    await writeJson(SUBSCRIBERS, subscribed ? [...others, userId] : others)
  })
}

export function saveGroup(id: string | null, group: Omit<RecipientGroup, 'id'>): Promise<void> {
  return queued(async () => {
    const all = await readGroups()
    if (id && !all.some((g) => g.id === id)) throw new StoreError('Grup tidak ditemukan. Muat ulang halaman.')
    if (!id && all.length >= MAX_GROUPS) throw new StoreError(`Grup paling banyak ${MAX_GROUPS}.`)
    const saved = { ...group, id: id ?? randomUUID() }
    await writeJson(GROUPS, id ? all.map((g) => (g.id === id ? saved : g)) : [...all, saved])
  })
}

export function deleteGroup(id: string): Promise<void> {
  return queued(async () => writeJson(GROUPS, (await readGroups()).filter((g) => g.id !== id)))
}

export const readTemplates = () => readJson<SavedTemplate[]>(TEMPLATES, [])
export const readRuns = () => readJson<Record<string, Run[]>>(RUNS, {})

export function saveTemplate(id: string | null, spec: TemplateSpec, userId: string): Promise<string> {
  return queued(async () => {
    const all = await readTemplates()
    const old = all.find((t) => t.id === id)
    if (id && !old) throw new StoreError('Template tidak ditemukan. Muat ulang halaman.')
    if (!old && all.length >= MAX_TEMPLATES) throw new StoreError(`Template paling banyak ${MAX_TEMPLATES}.`)
    const sameSchedule = old && JSON.stringify(old.schedule) === JSON.stringify(spec.schedule)
    const saved: SavedTemplate = {
      ...spec,
      id: old?.id ?? randomUUID(),
      activeSince: sameSchedule ? old.activeSince : Date.now(),
      updatedBy: userId,
    }
    await writeJson(TEMPLATES, old ? all.map((t) => (t.id === saved.id ? saved : t)) : [...all, saved])
    return saved.id
  })
}

export function deleteTemplate(id: string): Promise<void> {
  return queued(async () => {
    const all = await readTemplates()
    await writeJson(TEMPLATES, all.filter((t) => t.id !== id))
    const runs = await readRuns()
    delete runs[id]
    await writeJson(RUNS, runs)
  })
}

export function recordRun(id: string, run: Run): Promise<void> {
  return queued(async () => {
    const runs = await readRuns()
    const others = (runs[id] ?? []).filter((r) => r.slot !== run.slot || r.attempt !== run.attempt || r.test !== run.test)
    await writeJson(RUNS, { ...runs, [id]: [run, ...others].slice(0, KEEP_RUNS) })
  })
}

// One container wins each attempt, also while a deploy runs two of them.
export async function claimSlot(id: string, slot: number, attempt: number): Promise<boolean> {
  await mkdir(file('claims'), { recursive: true })
  try {
    await writeFile(file('claims', `${id}-${slot}-${attempt}`), '', { flag: 'wx' })
    return true
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'EEXIST') return false
    throw error
  }
}

export async function cleanClaims(now: number): Promise<void> {
  const names = await readdir(file('claims')).catch(() => [] as string[])
  for (const name of names) {
    const target = file('claims', name)
    const info = await stat(target).catch(() => null)
    if (info && now - info.mtimeMs > CLAIM_AGE_MS) await unlink(target).catch(() => {})
  }
}
