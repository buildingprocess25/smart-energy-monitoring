'use client'

import { useState } from 'react'
import type { RecordingSessionSummary } from '@/lib/types'
import { downloadFile } from '@/lib/download'
import { exportFileName, sessionSheets } from '@/lib/session-export'
import { buildXlsx, zip } from '@/lib/xlsx'
import { Button } from '@/components/ui/button'
import { fetchSession } from './fetch-session'

// All files are built in the browser's memory.
const MAX_SESSIONS = 10
const MAX_RECORDS = 300_000

export function BulkDownload({ sessions, onDone }: { sessions: RecordingSessionSummary[]; onDone: () => void }) {
  const [progress, setProgress] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)
  if (sessions.length === 0) return null

  const records = sessions.reduce((sum, s) => sum + s.recordCount, 0)
  const tooMany =
    sessions.length > MAX_SESSIONS
      ? `Pilih paling banyak ${MAX_SESSIONS} sesi.`
      : records > MAX_RECORDS
        ? `Pilihan berisi ${records.toLocaleString('id-ID')} record. Batasnya ${MAX_RECORDS.toLocaleString('id-ID')}.`
        : null

  async function download() {
    setError(null)
    const files: { name: string; content: Uint8Array }[] = []
    try {
      // One at a time, so the server never reads several large sessions at once.
      for (const [i, s] of sessions.entries()) {
        setProgress(i + 1)
        const data = await fetchSession(s.id)
        files.push({ name: `${i + 1} ${exportFileName(data.session.name)}`, content: buildXlsx(sessionSheets(data)) })
      }
      downloadFile(zip(files), 'sesi-rekaman.zip', 'application/zip')
      onDone()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Data sesi gagal diunduh.')
    } finally {
      setProgress(null)
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button onClick={download} disabled={progress !== null || tooMany !== null}>
        {progress === null ? `Unduh ${sessions.length} Sesi` : `Menyiapkan ${progress} dari ${sessions.length}`}
      </Button>
      <Button variant="outline" onClick={onDone} disabled={progress !== null}>
        Batal Pilih
      </Button>
      {(error ?? tooMany) && (
        <p role="alert" className="w-full text-sm text-destructive">
          {error ?? tooMany}
        </p>
      )}
    </div>
  )
}
