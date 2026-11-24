import type { SessionRecordsResult } from '@/lib/types'

export async function fetchSession(id: string): Promise<SessionRecordsResult> {
  const res = await fetch(`/api/sessions/${encodeURIComponent(id)}/records`)
  const data = (await res.json().catch(() => null)) as (SessionRecordsResult & { error?: string }) | null
  if (!res.ok || !data) throw new Error(data?.error ?? 'Data sesi gagal diunduh.')
  return data
}
