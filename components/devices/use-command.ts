'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

async function send(path: string, body: object): Promise<string | null> {
  let res: Response
  try {
    res = await fetch(path, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
  } catch {
    throw new Error('Portal tidak menjawab. Muat ulang dan cek status sebelum mencoba lagi.')
  }
  const data = (await res.json().catch(() => null)) as { error?: string; warning?: string } | null
  if (res.ok) return data?.warning ?? null
  throw new Error(data?.error ?? 'Perintah gagal dijalankan.')
}

// Commands are sent once; the page is re-read afterwards, also on failure, because the outcome may be unknown.
export function useCommand() {
  const router = useRouter()
  const [pending, setPending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [warning, setWarning] = useState<string | null>(null)

  async function run(path: string, body: object): Promise<boolean> {
    if (pending) return false
    setPending(true)
    setError(null)
    setWarning(null)
    try {
      setWarning(await send(path, body))
      return true
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Perintah gagal dijalankan.')
      return false
    } finally {
      setPending(false)
      router.refresh()
    }
  }

  return { run, pending, error, warning, clearError: () => setError(null) }
}
