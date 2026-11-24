import type { Metadata } from 'next'
import { unstable_rethrow } from 'next/navigation'
import { getRequestAccess } from '@/lib/auth/access'
import { canControlDevices } from '@/lib/auth/access-rules'
import { getRecordingSessions } from '@/lib/services/session-service'
import { BackoffError } from '@/lib/shared-fetch'
import { SessionTable } from '@/components/sessions/session-table'
import type { RecordingSessionSummary } from '@/lib/types'

export const dynamic = 'force-dynamic'
export const metadata: Metadata = {
  title: 'Sesi Rekaman | Smart Energy Monitoring',
  description: 'Daftar sesi rekaman telemetri dari seluruh perangkat, terbaru di atas.',
}

async function loadSessions(): Promise<RecordingSessionSummary[] | null> {
  try {
    return await getRecordingSessions()
  } catch (error) {
    unstable_rethrow(error)
    if (!(error instanceof BackoffError)) {
      console.error('Sesi rekaman: gagal memuat daftar sesi', error)
    }
    return null
  }
}

export default async function SessionsPage() {
  const [access, sessions] = await Promise.all([getRequestAccess(), loadSessions()])
  const canControl = access.status === 'ok' && canControlDevices(access.viewer?.role ?? null)

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          Sesi Rekaman
        </h1>
        <p className="text-sm text-muted-foreground">
          Setiap sesi rekaman telemetri dari perangkat yang boleh Anda lihat, terbaru di atas.
        </p>
      </div>
      {sessions ? (
        <SessionTable sessions={sessions} canControl={canControl} />
      ) : (
        <p role="alert" className="text-sm text-muted-foreground">
          Daftar sesi belum bisa dimuat. Coba lagi sebentar lagi.
        </p>
      )}
    </div>
  )
}
