import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { getRequestAccess } from '@/lib/auth/access'
import { canControlDevices } from '@/lib/auth/access-rules'
import { MailSettingsForm } from '@/components/reports/mail-settings-form'
import { RecipientGroups } from '@/components/reports/recipient-groups'
import { loadMail, serverProblems } from '@/lib/services/report-mail-service'
import { readGroups, readMailSettings } from '@/lib/services/report-template-store'
import { getSubscribers } from '@/lib/services/subscriber-service'

export const dynamic = 'force-dynamic'
export const metadata: Metadata = { title: 'Pengaturan Email | Smart Energy Monitoring' }

async function load() {
  try {
    const [settings, groups, subscribers, mail] = await Promise.all([readMailSettings(), readGroups(), getSubscribers(), loadMail()])
    return { settings, groups, subscribers, mail }
  } catch (error) {
    console.error('Pengaturan email: gagal memuat', error)
    return null
  }
}

export default async function MailSettingsPage() {
  const access = await getRequestAccess()
  if (access.status !== 'ok' || !canControlDevices(access.viewer?.role ?? null)) redirect('/laporan')
  const missing = serverProblems()
  const data = missing.length === 0 ? await load() : null

  if (!data) {
    return (
      <p role="alert" className={missing.length > 0 ? 'text-sm text-warning' : 'text-sm text-destructive'}>
        {missing.length > 0
          ? `Server belum disiapkan. Isi ${missing.join(' dan ')} di Dokploy, lalu deploy ulang.`
          : 'Pengaturan gagal dimuat. Muat ulang halaman.'}
      </p>
    )
  }
  const { settings } = data
  return (
    <div className="flex min-w-0 flex-col">
      <MailSettingsForm
        settings={
          settings && {
            provider: settings.provider,
            host: settings.host,
            port: settings.port,
            user: settings.user,
            from: settings.from,
            domains: settings.domains,
          }
        }
        problem={'problem' in data.mail ? data.mail.problem : null}
        viewerEmail={access.viewer?.email ?? ''}
      />
      <RecipientGroups groups={data.groups} subscribers={data.subscribers} domains={settings?.domains ?? []} />
    </div>
  )
}
