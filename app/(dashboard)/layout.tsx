import { redirect } from 'next/navigation'
import { AdminShell } from '@/components/layout/admin-shell'
import { AccessCheckFailed } from '@/components/layout/access-check-failed'
import { getRequestAccess, spartaUrl } from '@/lib/auth/access'
import { portalDecision } from '@/lib/auth/access-rules'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const access = await getRequestAccess()

  if (access.status === 'error') return <AccessCheckFailed />
  if (access.status === 'invalid') redirect('/api/auth/session-invalid')
  if (access.status === 'anonymous' || access.internal) redirect(spartaUrl('/login'))
  if (!access.viewer) redirect('/akses-ditolak')

  const { viewer } = access
  const decision = portalDecision(viewer.role)
  if (!decision.allow) {
    if (decision.redirect === 'calculator') redirect(spartaUrl('/dashboard'))
    if (decision.redirect === 'admin-dashboard') redirect(spartaUrl('/admin/dashboard'))
    redirect('/akses-ditolak')
  }

  return (
    <AdminShell
      viewer={{
        name: viewer.name,
        email: viewer.email,
        role: viewer.role,
        simulated: viewer.simulated,
      }}
    >
      {children}
    </AdminShell>
  )
}
