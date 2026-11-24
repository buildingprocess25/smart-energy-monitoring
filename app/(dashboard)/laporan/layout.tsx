import { ReportNav } from '@/components/reports/report-nav'
import { SubscriptionSwitch } from '@/components/reports/subscription-switch'
import { getRequestAccess } from '@/lib/auth/access'
import { canControlDevices, canReceiveReports } from '@/lib/auth/access-rules'
import { isStoreConfigured, readSubscriberIds } from '@/lib/services/report-template-store'

// null hides the switch: nothing can be stored yet.
async function isSubscribed(userId: string): Promise<boolean | null> {
  if (!isStoreConfigured()) return null
  try {
    return (await readSubscriberIds()).includes(userId)
  } catch (error) {
    console.error('Laporan: gagal membaca langganan', error)
    return null
  }
}

export default async function ReportsLayout({ children }: { children: React.ReactNode }) {
  const access = await getRequestAccess()
  const viewer = access.status === 'ok' ? access.viewer : null
  const subscribed = viewer && canReceiveReports(viewer.role) ? await isSubscribed(viewer.userId) : null

  return (
    <div className="flex min-w-0 flex-col gap-6">
      <div className="flex flex-col gap-2">
        <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-1">
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">Laporan</h1>
          {viewer && subscribed !== null && <SubscriptionSwitch subscribed={subscribed} email={viewer.email} />}
        </div>
        <ReportNav canManage={canControlDevices(viewer?.role ?? null)} />
      </div>
      {children}
    </div>
  )
}
