'use client'

import { useEffect, useRef, useState } from 'react'
import type { LiveBufferResult, MetricType, SensorMeta, TelemetryPoint } from '@/lib/types'
import { TelemetryChart, METRIC_CONFIG } from './telemetry-chart'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

// Same pace as the Flask chart (CHART_INTERVAL_MS 5000). The server caches per device anyway.
const POLL_MS = 5000
// Same window as the Flask RAM buffer: 1,200 one-second samples.
const MAX_POINTS = 1200
const LIVE_METRICS: MetricType[] = ['power', 'voltage', 'current', 'powerFactor', 'frequency']

type LiveState = 'loading' | 'live' | 'offline' | 'error'

const STATE_BADGE: Record<
  LiveState,
  { label: string; variant: 'secondary' | 'outline' | 'destructive' }
> = {
  loading: { label: 'Memuat', variant: 'outline' },
  live: { label: 'Live', variant: 'secondary' },
  offline: { label: 'Perangkat offline', variant: 'outline' },
  error: { label: 'Gagal memuat', variant: 'destructive' },
}

function emptyMessage(state: LiveState): string {
  if (state === 'error') return 'Data real-time tidak bisa dimuat. Mencoba lagi setiap 5 detik.'
  if (state === 'offline') return 'Perangkat offline. Grafik tampil lagi saat perangkat mengirim data.'
  return 'Menunggu data dari perangkat'
}

export function LiveTelemetryChart({ storeId }: { storeId: string }) {
  const [points, setPoints] = useState<TelemetryPoint[]>([])
  const [sensors, setSensors] = useState<SensorMeta[]>([])
  const [state, setState] = useState<LiveState>('loading')
  const [metric, setMetric] = useState<MetricType>('power')
  const lastEpoch = useRef<number | null>(null)

  useEffect(() => {
    let cancelled = false
    let timer: ReturnType<typeof setTimeout> | undefined

    // points/sensors/state reset by the parent's key={store.id} remount; only the ref needs clearing here.
    lastEpoch.current = null

    async function poll() {
      if (document.hidden) {
        timer = setTimeout(poll, POLL_MS)
        return
      }
      try {
        const qs = lastEpoch.current ? `?since=${lastEpoch.current}` : ''
        const res = await fetch(`/api/stores/${encodeURIComponent(storeId)}/live${qs}`, { cache: 'no-store' })
        if (!res.ok) throw new Error(String(res.status))
        const data = (await res.json()) as LiveBufferResult
        if (cancelled) return
        if (data.lastEpoch) lastEpoch.current = data.lastEpoch
        if (data.sensors.length) setSensors(data.sensors)
        if (data.points.length) setPoints((prev) => [...prev, ...data.points].slice(-MAX_POINTS))
        setState(data.offline ? 'offline' : 'live')
      } catch {
        if (!cancelled) setState('error')
      }
      if (!cancelled) timer = setTimeout(poll, POLL_MS)
    }

    poll()
    return () => {
      cancelled = true
      clearTimeout(timer)
    }
  }, [storeId])

  const badge = STATE_BADGE[state]

  return (
    <section
      aria-label="Data Real-time"
      className="flex min-w-0 flex-col gap-4 rounded-2xl bg-card ring-1 ring-foreground/10 p-4"
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-base font-semibold">Data Real-time</h2>
        <Badge variant={badge.variant} role="status">
          {state === 'live' && (
            <span aria-hidden="true" className="size-1.5 rounded-full bg-primary" />
          )}
          {badge.label}
        </Badge>
      </div>

      <div className="flex flex-wrap gap-1.5" role="group" aria-label="Parameter grafik real-time">
        {LIVE_METRICS.map((m) => (
          <Button
            key={m}
            type="button"
            size="sm"
            variant={metric === m ? 'default' : 'outline'}
            aria-pressed={metric === m}
            onClick={() => setMetric(m)}
          >
            {METRIC_CONFIG[m].label}
          </Button>
        ))}
      </div>

      {points.length === 0 ? (
        <div className="flex h-[320px] w-full items-center justify-center rounded-xl border border-dashed px-4 text-center text-sm text-muted-foreground">
          {emptyMessage(state)}
        </div>
      ) : (
        <div className="min-w-0 overflow-hidden">
          <TelemetryChart
            data={points}
            sensors={sensors}
            metric={metric}
            rangeType="day"
            className="h-[320px] w-full"
          />
        </div>
      )}
    </section>
  )
}
