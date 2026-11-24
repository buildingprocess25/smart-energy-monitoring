'use client'

import { useState } from 'react'
import { MoreHorizontal } from 'lucide-react'
import type { RecordingSessionSummary } from '@/lib/types'
import { downloadFile } from '@/lib/download'
import { MAX_NAME_LENGTH } from '@/lib/control-commands'
import { exportFileName, sessionSheets } from '@/lib/session-export'
import { buildXlsx } from '@/lib/xlsx'
import { fetchSession } from './fetch-session'
import { useCommand } from '@/components/devices/use-command'
import { SelectField } from '@/components/form-controls'
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
  const data = await fetchSession(session.id)
  downloadFile(buildXlsx(sessionSheets(data)), exportFileName(data.session.name))
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
                <SelectField label="Sensor" value={phase} choices={session.phases.map((p) => ({ value: p, label: p }))} onChange={setPhase} />
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
