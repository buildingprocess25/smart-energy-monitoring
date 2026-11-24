'use client'

import { useEffect, useState } from 'react'
import { Bell } from 'lucide-react'
import type { Alert } from '@/lib/alerts'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { AlertList } from './alert-list'

const REFRESH_MS = 120_000

export function AlertBell() {
  const [open, setOpen] = useState(false)
  const [alerts, setAlerts] = useState<Alert[] | null>(null)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    let cancelled = false
    let loadedAt = 0

    async function load() {
      if (document.hidden) return
      loadedAt = Date.now()
      try {
        const res = await fetch('/api/alerts', { cache: 'no-store' })
        if (!res.ok) throw new Error(String(res.status))
        const data = (await res.json()) as { alerts: Alert[] }
        if (cancelled) return
        setAlerts(data.alerts)
        setFailed(false)
      } catch {
        if (!cancelled) setFailed(true)
      }
    }

    function onVisible() {
      if (Date.now() - loadedAt > REFRESH_MS) load()
    }

    load()
    const timer = setInterval(load, REFRESH_MS)
    document.addEventListener('visibilitychange', onVisible)
    return () => {
      cancelled = true
      clearInterval(timer)
      document.removeEventListener('visibilitychange', onVisible)
    }
  }, [])

  const count = alerts?.length ?? 0
  const description = failed
    ? 'Peringatan gagal dimuat. Dicoba lagi tiap 2 menit.'
    : alerts === null
      ? 'Memuat peringatan.'
      : count === 0
        ? 'Tidak ada masalah pada perangkat yang boleh Anda lihat.'
        : `${count} masalah pada perangkat yang boleh Anda lihat.`

  return (
    <>
      <Button
        type="button"
        variant="outline"
        size="icon-sm"
        aria-label={count > 0 ? `Peringatan, ${count} masalah` : 'Peringatan'}
        className="relative after:absolute after:-inset-1.5"
        onClick={() => setOpen(true)}
      >
        <Bell aria-hidden="true" />
        {count > 0 && (
          <span
            aria-hidden="true"
            className="absolute -top-2 -right-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-status-boros px-1 text-xs font-medium text-status-boros-foreground tabular-nums"
          >
            {count > 99 ? '99+' : count}
          </span>
        )}
      </Button>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent className="overflow-y-auto">
          <SheetHeader className="pr-12">
            <SheetTitle>Peringatan</SheetTitle>
            <SheetDescription>{description}</SheetDescription>
          </SheetHeader>
          {alerts && count > 0 && (
            <div className="px-4 pb-4">
              <AlertList alerts={alerts} onNavigate={() => setOpen(false)} />
            </div>
          )}
        </SheetContent>
      </Sheet>
    </>
  )
}
