'use client'

import { useState } from 'react'
import type { ManagedDevice } from '@/lib/types'
import { MAX_INTERVAL_S, MAX_NAME_LENGTH, MIN_INTERVAL_S } from '@/lib/control-commands'
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
import { Input } from '@/components/ui/input'
import { useCommand } from './use-command'

type Open = 'start' | 'stop' | 'interval' | null

function CommandError({ message }: { message: string | null }) {
  return message ? (
    <p role="alert" className="text-sm text-destructive">
      {message}
    </p>
  ) : null
}

function IntervalField({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="font-medium">Interval (detik)</span>
      <Input
        type="number"
        inputMode="numeric"
        min={MIN_INTERVAL_S}
        max={MAX_INTERVAL_S}
        step={1}
        required
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-9"
      />
      <span className="text-xs text-muted-foreground">
        {MIN_INTERVAL_S} sampai {MAX_INTERVAL_S} detik.
      </span>
    </label>
  )
}

export function CaptureControls({ device }: { device: ManagedDevice }) {
  const { run, pending, error, warning, clearError } = useCommand()
  const enabled = device.sensors.filter((s) => s.enabled)
  const [open, setOpen] = useState<Open>(null)
  const [name, setName] = useState('')
  const [interval, setIntervalValue] = useState('15')
  const [phases, setPhases] = useState<string[]>([])

  const { capture } = device
  if (!capture) {
    return (
      <p role="alert" className="text-sm text-muted-foreground">
        Server IoT tidak menjawab, jadi kontrol rekaman dimatikan. Muat ulang halaman.
      </p>
    )
  }

  function show(next: Exclude<Open, null>) {
    clearError()
    if (next === 'start') {
      setName('')
      setPhases(enabled.map((s) => s.phase))
    }
    setIntervalValue(String(capture?.interval ?? MIN_INTERVAL_S))
    setOpen(next)
  }

  async function submit(body: object) {
    if (await run('/api/control/capture', { ...body, deviceId: device.id })) setOpen(null)
  }

  return (
    <div className="flex flex-wrap gap-2">
      {capture.active ? (
        <>
          <Button variant="destructive" onClick={() => show('stop')}>
            Hentikan Rekaman
          </Button>
          <Button variant="outline" onClick={() => show('interval')}>
            Ubah Interval
          </Button>
        </>
      ) : (
        <Button onClick={() => show('start')} disabled={capture.finalizing || enabled.length === 0}>
          {capture.finalizing ? 'Menutup Rekaman' : 'Mulai Rekaman'}
        </Button>
      )}
      {enabled.length === 0 && (
        <p className="w-full text-sm text-muted-foreground">Aktifkan minimal satu sensor untuk mulai merekam.</p>
      )}

      {warning && (
        <p role="alert" className="w-full text-sm text-warning">
          {warning}
        </p>
      )}

      <Dialog open={open !== null} onOpenChange={(next) => !next && !pending && setOpen(null)}>
        <DialogContent>
          {open === 'start' && (
            <form
              className="flex flex-col gap-5"
              onSubmit={(e) => {
                e.preventDefault()
                submit({ action: 'start', sessionName: name, interval: Number(interval), phases })
              }}
            >
              <DialogHeader>
                <DialogTitle>Mulai rekaman {device.id}</DialogTitle>
                <DialogDescription>
                  Meter lama mengulang counter energinya dari 0 saat rekaman dimulai.
                </DialogDescription>
              </DialogHeader>
              <label className="flex flex-col gap-1.5">
                <span className="font-medium">Nama sesi</span>
                <Input
                  required
                  maxLength={MAX_NAME_LENGTH}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Nama sesi rekaman"
                  className="h-9"
                />
              </label>
              <IntervalField value={interval} onChange={setIntervalValue} />
              <fieldset className="flex flex-col gap-1">
                <legend className="mb-1 font-medium">Sensor</legend>
                {enabled.map((s) => (
                  <label key={s.phase} className="flex min-h-10 items-center gap-2">
                    <input
                      type="checkbox"
                      className="size-4 accent-primary"
                      checked={phases.includes(s.phase)}
                      onChange={(e) =>
                        setPhases((prev) => (e.target.checked ? [...prev, s.phase] : prev.filter((p) => p !== s.phase)))
                      }
                    />
                    {s.name}
                    {s.name !== s.phase && <span className="text-muted-foreground">({s.phase})</span>}
                  </label>
                ))}
              </fieldset>
              <CommandError message={error} />
              <DialogFooter>
                <DialogClose render={<Button type="button" variant="outline" disabled={pending} />}>Batal</DialogClose>
                <Button type="submit" disabled={pending || phases.length === 0}>
                  {pending ? 'Memulai' : 'Mulai Rekaman'}
                </Button>
              </DialogFooter>
            </form>
          )}

          {open === 'stop' && (
            <>
              <DialogHeader>
                <DialogTitle>Hentikan rekaman {device.id}?</DialogTitle>
                <DialogDescription>
                  Sesi &quot;{capture.sessionName ?? '-'}&quot; ditutup dan tidak bisa dilanjutkan. Datanya tetap tersimpan.
                </DialogDescription>
              </DialogHeader>
              <CommandError message={error} />
              <DialogFooter>
                <DialogClose render={<Button type="button" variant="outline" disabled={pending} />}>Batal</DialogClose>
                <Button variant="destructive" disabled={pending} onClick={() => submit({ action: 'stop' })}>
                  {pending ? 'Menghentikan' : 'Hentikan Rekaman'}
                </Button>
              </DialogFooter>
            </>
          )}

          {open === 'interval' && (
            <form
              className="flex flex-col gap-5"
              onSubmit={(e) => {
                e.preventDefault()
                submit({ action: 'interval', interval: Number(interval) })
              }}
            >
              <DialogHeader>
                <DialogTitle>Ubah interval {device.id}</DialogTitle>
                <DialogDescription>Berlaku untuk record berikutnya di sesi yang berjalan.</DialogDescription>
              </DialogHeader>
              <IntervalField value={interval} onChange={setIntervalValue} />
              <CommandError message={error} />
              <DialogFooter>
                <DialogClose render={<Button type="button" variant="outline" disabled={pending} />}>Batal</DialogClose>
                <Button type="submit" disabled={pending}>
                  {pending ? 'Menyimpan' : 'Simpan Interval'}
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
