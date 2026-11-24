// Sender settings, recipient groups and subscribers. No `@/` imports, so `node --test` can load this file directly.
import type { ParseResult } from './request-params.ts'
import { isAllowedRecipient, parseDomains, type Recipients } from './workbook.ts'

export const MAIL_PROVIDERS = {
  gmail: { label: 'Gmail', host: 'smtp.gmail.com', port: 587 },
  microsoft: { label: 'Microsoft 365', host: 'smtp.office365.com', port: 587 },
  other: { label: 'Lainnya', host: '', port: 587 },
} as const
export type MailProvider = keyof typeof MAIL_PROVIDERS

export interface MailSettings {
  provider: MailProvider
  host: string
  port: number
  user: string
  from: string
  domains: string[]
}

export interface RecipientGroup {
  id: string
  name: string
  userIds: string[]
  addresses: string[]
}

export interface Subscriber {
  id: string
  name: string
  email: string
  role: string
}

const fail = (error: string) => ({ ok: false as const, error })
const asRecord = (v: unknown): Record<string, unknown> | null =>
  typeof v === 'object' && v !== null && !Array.isArray(v) ? (v as Record<string, unknown>) : null

const DOMAIN = /^(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z]{2,}$/i
const PRIVATE_NAME = /\.(?:local|localhost|internal|lan|home|corp)$/i
const CONTROL = /[\u0000-\u001f\u007f]/

// password is null when the stored one should be kept.
export function parseMailSettings(raw: unknown): ParseResult<MailSettings & { password: string | null }> {
  const s = asRecord(raw)
  if (!s || typeof s.provider !== 'string' || !Object.hasOwn(MAIL_PROVIDERS, s.provider)) return fail('Pilih layanan email.')
  const provider = s.provider as MailProvider
  const from = typeof s.from === 'string' ? s.from.trim() : ''
  const at = from.lastIndexOf('@')
  if (!isAllowedRecipient(from, [from.slice(at + 1).toLowerCase()])) return fail('Alamat pengirim tidak valid.')

  let host: string = MAIL_PROVIDERS[provider].host
  let port: number = MAIL_PROVIDERS[provider].port
  let user = from
  if (provider === 'other') {
    host = typeof s.host === 'string' ? s.host.trim().toLowerCase() : ''
    // Names inside the server network are refused, so the form cannot probe it.
    if (host.length > 253 || !DOMAIN.test(host) || PRIVATE_NAME.test(host)) return fail('Alamat server SMTP tidak valid.')
    if (s.port !== 465 && s.port !== 587) return fail('Port harus 465 atau 587.')
    port = s.port
    user = typeof s.user === 'string' ? s.user.trim() : ''
    if (user.length === 0 || user.length > 254 || CONTROL.test(user)) return fail('Username SMTP wajib diisi.')
  }

  if (typeof s.password !== 'string' || s.password.length > 200 || CONTROL.test(s.password)) return fail('Password tidak valid.')
  // Google shows app passwords in groups of four.
  const password = provider === 'gmail' ? s.password.replace(/ /g, '') : s.password

  const domains = parseDomains(typeof s.domains === 'string' ? s.domains : '')
  if (domains.length === 0 || domains.length > 20) return fail('Isi 1 sampai 20 domain penerima.')
  const wrong = domains.find((d) => !DOMAIN.test(d))
  if (wrong !== undefined) return fail(`Domain ${JSON.stringify(wrong).slice(0, 60)} tidak valid.`)
  return { ok: true, value: { provider, host, port, user, from, password: password === '' ? null : password, domains: [...new Set(domains)] } }
}

export const secretContext = (s: Pick<MailSettings, 'host' | 'port' | 'user'>) => `${s.host}|${s.port}|${s.user}`

export function parseGroup(raw: unknown, domains: string[]): ParseResult<Omit<RecipientGroup, 'id'>> {
  const g = asRecord(raw)
  const name = typeof g?.name === 'string' ? g.name.trim() : ''
  if (!g || name.length === 0 || name.length > 60 || CONTROL.test(name)) return fail('Nama grup wajib diisi, paling banyak 60 karakter.')
  const { userIds, addresses } = g
  if (!Array.isArray(userIds) || userIds.length > 200 || !userIds.every(isUserId)) return fail('Anggota tidak valid.')
  if (!Array.isArray(addresses) || addresses.length > 100) return fail('Alamat paling banyak 100.')
  const wrong = addresses.find((a) => typeof a !== 'string' || !isAllowedRecipient(a, domains))
  if (wrong !== undefined) return fail(`Alamat ${JSON.stringify(wrong).slice(0, 60)} tidak valid atau domainnya tidak diizinkan.`)
  if (userIds.length + addresses.length === 0) return fail('Pilih minimal satu anggota.')
  return { ok: true, value: { name, userIds: [...new Set(userIds)], addresses: [...new Set(addresses as string[])] } }
}

export const isUserId = (id: unknown): id is string => typeof id === 'string' && /^[A-Za-z0-9-]{1,64}$/.test(id)

// Users count only while they subscribe; every address must be in an allowed domain.
export function resolveRecipients(
  target: Recipients,
  subscribers: Subscriber[],
  groups: RecipientGroup[],
  domains: string[]
): string[] {
  const chosen = groups.filter((g) => target.groupIds.includes(g.id))
  const userIds = new Set([...target.userIds, ...chosen.flatMap((g) => g.userIds)])
  const addresses = [
    ...subscribers.filter((s) => target.allSubscribers || userIds.has(s.id)).map((s) => s.email),
    ...chosen.flatMap((g) => g.addresses),
    ...target.recipients,
  ]
  const unique = new Map<string, string>()
  for (const address of addresses) {
    const key = address.toLowerCase()
    if (isAllowedRecipient(address, domains) && !unique.has(key)) unique.set(key, address)
  }
  return [...unique.values()]
}
