import type { Metadata } from 'next'
import { getRequestAccess } from '@/lib/auth/access'
import { canControlDevices } from '@/lib/auth/access-rules'
import { WorkbookBuilder, type TemplateView } from '@/components/reports/workbook-builder'
import { getReportStores } from '@/lib/services/report-service'
import { loadMail, serverProblems } from '@/lib/services/report-mail-service'
import { getSubscribers } from '@/lib/services/subscriber-service'
import { isStoreConfigured, readGroups, readRuns, readTemplates, type Run } from '@/lib/services/report-template-store'
import type { RecipientGroup, Subscriber } from '@/lib/mail-settings'
import { nextSlot } from '@/lib/workbook'

export const dynamic = 'force-dynamic'
export const metadata: Metadata = { title: 'Excel Kustom | Smart Energy Monitoring' }

const formatTime = (epoch: number) =>
  `${new Date(epoch).toLocaleString('id-ID', { timeZone: 'Asia/Jakarta', dateStyle: 'medium', timeStyle: 'short' })} WIB`

function runText(run: Run | undefined): string | null {
  if (!run) return null
  const kind = run.test ? 'Email uji' : 'Email terakhir'
  const result = {
    sending: 'belum selesai',
    sent: 'terkirim',
    failed: `gagal: ${run.error ?? '-'}`,
    unknown: 'tidak pasti terkirim, cek kotak masuk',
  }[run.status]
  return `${kind} ${formatTime(run.at)}, ${result}`
}

// Recipients are personal data, so only ADMIN gets the templates.
type Saved = {
  templates: TemplateView[]
  subscribers: Subscriber[]
  groups: RecipientGroup[]
  mailProblem: string | null
  domains: string[]
  failed: boolean
}

const NOTHING: Saved = { templates: [], subscribers: [], groups: [], mailProblem: null, domains: [], failed: false }

async function loadSaved(): Promise<Saved> {
  const missing = serverProblems()
  if (!isStoreConfigured()) return { ...NOTHING, mailProblem: `Server belum disiapkan. Isi ${missing.join(' dan ')} di Dokploy.` }
  try {
    const [templates, runs, subscribers, groups, mail] = await Promise.all([readTemplates(), readRuns(), getSubscribers(), readGroups(), loadMail()])
    const now = Date.now()
    return {
      failed: false,
      subscribers,
      groups,
      mailProblem: 'problem' in mail ? mail.problem : null,
      domains: 'problem' in mail ? mail.domains : mail.mail.domains,
      templates: templates.map((t) => {
        const { id, workbook, schedule, allSubscribers, userIds, groupIds, recipients, subject, message } = t
        const next = nextSlot(schedule, now)
        return { id, workbook, schedule, allSubscribers, userIds, groupIds, recipients, subject, message, next: next === null ? null : formatTime(next), lastRun: runText(runs[id]?.[0]) }
      }),
    }
  } catch (error) {
    console.error('Excel kustom: gagal membaca template', error)
    return { ...NOTHING, failed: true }
  }
}

export default async function WorkbookPage() {
  const [access, stores] = await Promise.all([getRequestAccess(), getReportStores()])
  const viewer = access.status === 'ok' ? access.viewer : null
  const canSchedule = canControlDevices(viewer?.role ?? null)
  const saved = canSchedule ? await loadSaved() : NOTHING

  if (saved.failed) {
    return (
      <p role="alert" className="text-sm text-destructive">
        Data tersimpan gagal dibaca. Muat ulang halaman, lalu cek folder REPORT_DATA_DIR di server.
      </p>
    )
  }
  return (
    <WorkbookBuilder
      templates={saved.templates}
      subscribers={saved.subscribers}
      groups={saved.groups}
      stores={stores}
      canCompare={access.status === 'ok' && access.scope.kind === 'all'}
      canSchedule={canSchedule}
      mailProblem={saved.mailProblem}
      domains={saved.domains}
      viewerEmail={viewer?.email ?? ''}
    />
  )
}
