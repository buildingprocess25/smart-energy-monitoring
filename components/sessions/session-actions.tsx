'use client'

import { useState } from 'react'
import { MoreHorizontal } from 'lucide-react'
import type { RecordingSessionSummary, SessionRecordsResult } from '@/lib/types'
import { MAX_NAME_LENGTH } from '@/lib/control-commands'
import { exportFileName, sessionSheets } from '@/lib/session-export'
import { buildXlsx } from '@/lib/xlsx'
import { useCommand } from '@/components/devices/use-command'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'

type Open = 'rename' | 'renameSensor' | 'delete' | 'export' | null

async function downloadSession(session: RecordingSessionSummary) {
  const res = await fetch(`/api/sessions/${encodeURIComponent(session.id)}/records`)
  const data = (await res.json().catch(() => null)) as (SessionRecordsResult & { error?: string }) | null
  if (!res.ok || !data) throw new Error(data?.error ?? 'Data sesi gagal diunduh.')
  const blob = new Blob([buildXlsx(sessionSheets(data))], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = exportFileName(data.session.name)
  link.click()
  setTimeout(() => URL.revokeObjectURL(url), 10_000)
}

export function SessionActions({ session, canControl }: { session: RecordingSessionSummary; canControl: boolean }) {
  const { run, pending, error, clearError } = useCommand()
  const [open, setOpen] = useState<Open>(null)
  const [text, setText] = useState('')
  const [phase, setPhase] = useState(session.phases[0] ?? '')
  const [exportError, setExportError] = useState<string | null>(null)
  const path = `/api/control/sessions/${encodeURIComponent(session.id)}`

  function show(next: Exclude<Open, null>) {
    clearError()
    setText(next === 'rename' ? session.name : '')
    setOpen(next)
  }

  async function submit(body: object) {
    if (await run(path, body)) setOpen(null)
  }

  async function exportExcel() {
    setExportError(null)
    setOpen('export')
    try {
      await downloadSession(session)
      setOpen(null)
    } catch (e) {
      setExportError(e instanceof Error ? e.message : 'Data sesi gagal diunduh.')
    }
  }

  const cancel = (
    <DialogClose render={<Button type="button" variant="outline" disabled={pending} />}>Batal</DialogClose>
  )
  const alert = error && (
    <p role="alert" className="text-sm text-destructive">
      {error}
    </p>
  )

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label={`Aksi untuk sesi ${session.name}`}
              className="relative after:absolute after:-inset-1.5"
            />
          }
        >
          <MoreHorizontal aria-hidden="true" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-52">
          <DropdownMenuGroup>
            <DropdownMenuItem onClick={exportExcel}>Unduh Excel</DropdownMenuItem>
            {canControl && (
              <>
                <DropdownMenuItem onClick={() => show('rename')}>Ubah Nama Sesi</DropdownMenuItem>
                {session.phases.length > 0 && (
                  <DropdownMenuItem onClick={() => show('renameSensor')}>Ubah Nama Sensor</DropdownMenuItem>
                )}
              </>
            )}
          </DropdownMenuGroup>
          {canControl && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem variant="destructive" onClick={() => show('delete')}>
                  Hapus Sesi
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={open !== null} onOpenChange={(next) => !next && !pending && setOpen(null)}>
        <DialogContent>
          {open === 'export' && (
            <>
              <DialogHeader>
                <DialogTitle>Unduh {session.name}</DialogTitle>
                <DialogDescription>
                  {exportError ? 'File belum dibuat.' : `Menyiapkan ${session.recordCount.toLocaleString('id-ID')} record.`}
                </DialogDescription>
              </DialogHeader>
              {exportError && (
                <p role="alert" className="text-sm text-destructive">
                  {exportError}
                </p>
              )}
              <DialogFooter>
                <DialogClose render={<Button type="button" variant="outline" />}>Tutup</DialogClose>
                {exportError && <Button onClick={exportExcel}>Coba Lagi</Button>}
              </DialogFooter>
            </>
          )}

          {(open === 'rename' || open === 'renameSensor') && (
            <form
              className="flex flex-col gap-5"
              onSubmit={(e) => {
                e.preventDefault()
                submit(open === 'rename' ? { action: 'rename', name: text } : { action: 'renameSensor', phase, name: text })
              }}
            >
              <DialogHeader>
                <DialogTitle>{open === 'rename' ? 'Ubah nama sesi' : 'Ubah nama sensor'}</DialogTitle>
                <DialogDescription>
                  {open === 'rename' ? 'Data rekamannya tidak berubah.' : `Hanya untuk sesi "${session.name}".`}
                </DialogDescription>
              </DialogHeader>
              {open === 'renameSensor' && (
                <label className="flex flex-col gap-1.5">
                  <span className="font-medium">Sensor</span>
                  <select
                    value={phase}
                    onChange={(e) => setPhase(e.target.value)}
                    className="h-9 rounded-lg border border-input bg-popover px-2.5 text-sm outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
                  >
                    {session.phases.map((p) => (
                      <option key={p}>{p}</option>
                    ))}
                  </select>
                </label>
              )}
              <label className="flex flex-col gap-1.5">
                <span className="font-medium">Nama baru</span>
                <Input required maxLength={MAX_NAME_LENGTH} value={text} onChange={(e) => setText(e.target.value)} className="h-9" />
              </label>
              {alert}
              <DialogFooter>
                {cancel}
                <Button type="submit" disabled={pending}>
                  {pending ? 'Menyimpan' : 'Simpan Nama'}
                </Button>
              </DialogFooter>
            </form>
          )}

          {open === 'delete' && (
            <form
              className="flex flex-col gap-5"
              onSubmit={(e) => {
                e.preventDefault()
                submit({ action: 'delete', confirmName: text })
              }}
            >
              <DialogHeader>
                <DialogTitle>Hapus sesi ini?</DialogTitle>
                <DialogDescription>
                  {session.recordCount.toLocaleString('id-ID')} record dari {session.deviceId} dihapus permanen. Unduh Excel
                  dulu kalau datanya masih diperlukan.
                </DialogDescription>
              </DialogHeader>
              <label className="flex flex-col gap-1.5">
                <span>
                  Ketik <span className="font-medium">{session.name}</span> untuk melanjutkan
                </span>
                <Input autoComplete="off" value={text} onChange={(e) => setText(e.target.value)} className="h-9" />
              </label>
              {alert}
              <DialogFooter>
                {cancel}
                <Button type="submit" variant="destructive" disabled={pending || text !== session.name}>
                  {pending ? 'Menghapus' : 'Hapus Sesi'}
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
