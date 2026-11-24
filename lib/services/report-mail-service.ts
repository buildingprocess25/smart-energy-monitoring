import 'server-only'
import { runAsJob } from '@/lib/auth/access'
import { exportFileName } from '@/lib/session-export'
import { resolveRecipients, secretContext, type MailSettings } from '@/lib/mail-settings'
import { isSecretKey, openSecret, sealSecret } from '@/lib/secret-box'
import { checkLogin, sendMail, SmtpError, type SmtpConfig } from '@/lib/smtp'
import { getSubscribers } from '@/lib/services/subscriber-service'
import { claimSlot, cleanClaims, isStoreConfigured, readGroups, readMailSettings, readRuns, readTemplates, recordRun, saveMailSettings, StoreError, type SavedTemplate } from '@/lib/services/report-template-store'
import { buildWorkbook, WorkbookError } from '@/lib/services/workbook-service'
import { dueSlot, isAllowedRecipient } from '@/lib/workbook'

const TICK_MS = 60_000
const MAX_ATTEMPTS = 3
const RETRY_MS = 10 * 60_000

const MAX_RECIPIENTS_PER_MAIL = 100

export interface ReadyMail {
  config: SmtpConfig
  from: string
  domains: string[]
}

// What is missing on the server itself; only someone with Dokploy access can fix these.
export function serverProblems(): string[] {
  const missing: string[] = []
  if (!isStoreConfigured()) missing.push('REPORT_DATA_DIR')
  if (!isSecretKey(process.env.REPORT_SECRET_KEY)) missing.push('REPORT_SECRET_KEY')
  return missing
}

export async function loadMail(): Promise<{ mail: ReadyMail } | { problem: string; domains: string[] }> {
  const missing = serverProblems()
  if (missing.length > 0) return { problem: `Server belum disiapkan. Isi ${missing.join(' dan ')} di Dokploy.`, domains: [] }
  const settings = await readMailSettings()
  if (!settings) return { problem: 'Akun pengirim belum diatur di Pengaturan Email.', domains: [] }
  const { host, port, user, from, domains } = settings
  const password = openSecret(settings.secret, process.env.REPORT_SECRET_KEY!, secretContext(settings))
  if (password === null) return { problem: 'Password email tidak bisa dibuka. Isi ulang di Pengaturan Email.', domains }
  return { mail: { config: { host, port, user, password, implicitTls: port === 465 }, from, domains } }
}

export async function saveMail(settings: MailSettings & { password: string | null }): Promise<void> {
  const missing = serverProblems()
  if (missing.length > 0) throw new StoreError(`Server belum disiapkan. Isi ${missing.join(' dan ')} di Dokploy.`)
  const key = process.env.REPORT_SECRET_KEY!
  const { password, ...rest } = settings
  const context = secretContext(rest)
  const old = await readMailSettings()
  // A kept password only opens for the same server and account, so it cannot be sent elsewhere.
  const plain = password ?? openSecret(old?.secret ?? null, key, context)
  if (plain === null) throw new StoreError('Isi password. Password lama hanya berlaku untuk server dan akun yang sama.')
  await saveMailSettings({ ...rest, secret: sealSecret(plain, key, context) })
}

export async function testLogin(): Promise<void> {
  const ready = await loadMail()
  if ('problem' in ready) throw new StoreError(ready.problem)
  await checkLogin(ready.mail.config)
}

export async function sendPlainTest(to: string): Promise<void> {
  const ready = await loadMail()
  if ('problem' in ready) throw new StoreError(ready.problem)
  const { config, from, domains } = ready.mail
  if (!isAllowedRecipient(to, domains)) throw new StoreError('Alamat tidak valid atau domainnya tidak diizinkan.')
  await sendMail(config, {
    from,
    fromName: 'Smart Energy Monitoring',
    to: [to],
    subject: 'Email uji Smart Energy Monitoring',
    text: 'Pengaturan email portal sudah berfungsi.',
    attachment: null,
  })
}

// testTo replaces the recipients. Returns how many addresses got the report.
async function deliver(template: SavedTemplate, slot: number, testTo: string | null): Promise<number> {
  const ready = await loadMail()
  if ('problem' in ready) throw new WorkbookError(ready.problem)
  const { config, from, domains } = ready.mail
  // Resolved on every send, so unsubscribing or losing the role takes effect at once.
  const recipients =
    testTo === null
      ? resolveRecipients(template, await getSubscribers(), await readGroups(), domains)
      : [testTo].filter((address) => isAllowedRecipient(address, domains))
  if (recipients.length === 0) throw new WorkbookError('Tidak ada penerima yang berlangganan atau domainnya diizinkan.')
  if (recipients.length > MAX_RECIPIENTS_PER_MAIL) throw new WorkbookError(`Penerima ${recipients.length}, paling banyak ${MAX_RECIPIENTS_PER_MAIL}. Bagi ke beberapa template.`)
  const { workbook, subject, message } = template
  const built = await runAsJob({ kind: 'all' }, () => buildWorkbook(workbook, slot))
  const period = `${built.period.from} sampai ${built.period.to}`
  const text = [
    message.replaceAll('{periode}', period),
    '',
    `Periode: ${period}`,
    'Isi file:',
    ...built.sheets.map((s) => `- ${s.name}: ${s.rows.toLocaleString('id-ID')} baris`),
    '',
    'Email otomatis dari Smart Energy Monitoring.',
  ].join('\n')
  await sendMail(config, {
    from,
    fromName: 'Smart Energy Monitoring',
    to: recipients,
    subject: `${testTo === null ? '' : '[Uji] '}${subject.replaceAll('{periode}', period)}`,
    text,
    attachment: { name: exportFileName(`${workbook.name} ${built.period.from} ${built.period.to}`), data: built.data },
  })
  return recipients.length
}

// Returns null when sent, otherwise what went wrong.
export async function sendTemplate(
  template: SavedTemplate,
  options: { slot: number; attempt: number; testTo: string | null }
): Promise<string | null> {
  const run = { slot: options.slot, attempt: options.attempt, at: Date.now(), test: options.testTo !== null }
  await recordRun(template.id, { ...run, status: 'sending', error: null })
  let count: number
  try {
    count = await deliver(template, options.slot, options.testTo)
  } catch (error) {
    const known = error instanceof SmtpError || error instanceof WorkbookError
    const message = known ? error.message : 'Laporan gagal dibuat.'
    const maybeSent = error instanceof SmtpError && error.maybeSent
    if (!known) console.error('Report email failed', template.id, error)
    await recordRun(template.id, { ...run, status: maybeSent ? 'unknown' : 'failed', error: message })
    return maybeSent ? 'Server email tidak memberi kepastian. Cek kotak masuk sebelum mengirim lagi.' : message
  }
  await recordRun(template.id, { ...run, status: 'sent', error: null })
  console.info('Report email', JSON.stringify({ id: template.id, slot: options.slot, recipients: count, test: run.test }))
  return null
}

async function tick(): Promise<void> {
  const now = Date.now()
  const [templates, runs] = await Promise.all([readTemplates(), readRuns()])
  for (const template of templates) {
    const slot = dueSlot(template.schedule, now, template.activeSince)
    if (slot === null) continue
    const tries = (runs[template.id] ?? []).filter((r) => r.slot === slot && !r.test)
    // Only a clear failure is repeated: a lost answer may mean the email arrived.
    if (tries.some((r) => r.status !== 'failed') || tries.length >= MAX_ATTEMPTS) continue
    if (tries.some((r) => now - r.at < RETRY_MS)) continue
    const attempt = tries.length + 1
    if (!(await claimSlot(template.id, slot, attempt))) continue
    await sendTemplate(template, { slot, attempt, testTo: null })
  }
  await cleanClaims(now)
}

declare global {
  var _reportSchedulerStarted: boolean | undefined
}

export function startReportScheduler(): void {
  if (globalThis._reportSchedulerStarted || !isStoreConfigured()) return
  globalThis._reportSchedulerStarted = true
  const loop = async () => {
    try {
      if (serverProblems().length === 0) await tick()
    } catch (error) {
      console.error('Report scheduler failed', error)
    }
    setTimeout(loop, TICK_MS).unref()
  }
  setTimeout(loop, TICK_MS).unref()
}
