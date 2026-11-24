'use client'

import { useEffect, useState } from 'react'
import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { MyEcoBadge } from '@/components/monitoring/myeco-badge'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { MYECO_POLL_MS, type MeterState, type MyEcoHistory, type MyEcoLive } from '@/lib/myeco'
import { DEFAULT_PALETTE } from '@/lib/phase-keys'

const HISTORY_REFRESH_MS = 10 * 60_000
const HOUR_MS = 60 * 60_000
// A longer pause between samples is drawn as a gap.
const GAP_MS = 4 * MYECO_POLL_MS
const PRESSED = 'aria-pressed:border-primary aria-pressed:bg-primary aria-pressed:text-primary-foreground'

const STATE: Record<MeterState, { label: string; variant: 'secondary' | 'outline' | 'destructive' }> = {
  live: { label: 'Live', variant: 'secondary' },
  late: { label: 'Terlambat', variant: 'destructive' },
  offline: { label: 'Offline', variant: 'outline' },
}

const wib = (options: Intl.DateTimeFormatOptions) => {
  const format = new Intl.DateTimeFormat('id-ID', { timeZone: 'Asia/Jakarta', ...options })
  return (epoch: number) => format.format(epoch)
}
const clock = wib({ hour: '2-digit', minute: '2-digit', second: '2-digit' })
const hourMinute = wib({ hour: '2-digit', minute: '2-digit' })
const dayHour = wib({ day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })
const dayLabel = (date: string) =>
  new Date(`${date}T00:00:00Z`).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', timeZone: 'UTC' })

const num = (value: number | null, digits: number, unit: string) =>
  value === null ? '-' : `${value.toLocaleString('id-ID', { maximumFractionDigits: digits })} ${unit}`.trim()

function useMyEco<T>(src: string, intervalMs: number) {
  const [data, setData] = useState<T | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    let timer: ReturnType<typeof setTimeout> | undefined
    async function load() {
      if (!document.hidden) {
        try {
          const res = await fetch(src, { cache: 'no-store' })
          const body = await res.json()
          if (!res.ok) throw new Error(body?.error)
          if (!cancelled) {
            setData(body)
            setError(null)
          }
        } catch (e) {
          if (!cancelled) setError((e instanceof Error && e.message) || 'Data AC tidak bisa dimuat.')
        }
      }
      if (!cancelled) timer = setTimeout(load, intervalMs)
    }
    load()
    return () => {
      cancelled = true
      clearTimeout(timer)
    }
  }, [src, intervalMs])

  return { data, error }
}

function chartTooltip(title: (label: number | string) => string, unit: string) {
  return function ChartTooltip({
    active,
    payload,
    label,
  }: {
    active?: boolean
    payload?: readonly { name?: unknown; value?: unknown; color?: string }[]
    label?: number | string
  }) {
    const rows = payload?.filter((p) => typeof p.value === 'number') ?? []
    if (!active || rows.length === 0 || label === undefined) return null
    return (
      <div className="flex flex-col gap-0.5 rounded-lg border bg-popover p-3 text-xs text-popover-foreground shadow-md tabular-nums">
        <p className="font-semibold text-muted-foreground">{title(label)}</p>
        {rows.map((p) => (
          <p key={String(p.name)} className="flex items-center gap-2">
            <span aria-hidden="true" className="size-2 rounded-full" style={{ backgroundColor: p.color }} />
            {String(p.name)}: {num(p.value as number, 2, unit)}
          </p>
        ))}
      </div>
    )
  }
}

const AXIS = {
  tick: { fontSize: 12, fill: 'var(--muted-foreground)' },
  tickLine: false,
  axisLine: false,
} as const

function Grid() {
  return <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" className="text-border/40" />
}

function Legend({ meters }: { meters: { id: string; label: string }[] }) {
  return (
    <ul className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
      {meters.map((m, i) => (
        <li key={m.id} className="flex items-center gap-1.5">
          <span aria-hidden="true" className="size-2 rounded-full" style={{ backgroundColor: DEFAULT_PALETTE[i] }} />
          {m.label}
        </li>
      ))}
    </ul>
  )
}

function LiveChart({ live }: { live: MyEcoLive }) {
  const data = live.samples.flatMap((s, i) => {
    const row: Record<string, number | null> = { at: s.at, ...s.power }
    const previous = live.samples[i - 1]
    return previous && s.at - previous.at > GAP_MS ? [{ at: previous.at + 1 }, row] : [row]
  })
  if (live.samples.length < 2) {
    return <p className="text-sm text-muted-foreground">Grafik mulai terisi setelah dua pembacaan, sekitar 15 detik lagi.</p>
  }
  // Minutes alone repeat on the axis while the chart is still short.
  const span = live.samples[live.samples.length - 1].at - live.samples[0].at
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <Grid />
          <XAxis
            {...AXIS}
            dataKey="at"
            type="number"
            scale="time"
            domain={['dataMin', 'dataMax']}
            tickFormatter={span < 10 * 60_000 ? clock : hourMinute}
            minTickGap={48}
          />
          <YAxis {...AXIS} width={64} tickFormatter={(v: number) => num(v, 0, 'W')} />
          <Tooltip content={chartTooltip((at) => `${clock(Number(at))} WIB`, 'W')} />
          {live.meters.map((m, i) => (
            <Line
              key={m.id}
              dataKey={m.id}
              name={m.label}
              stroke={DEFAULT_PALETTE[i]}
              strokeWidth={2}
              dot={false}
              connectNulls={false}
              isAnimationActive={false}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

function HistoryChart({ history, view }: { history: MyEcoHistory; view: 'hour' | 'day' }) {
  const rows = new Map<string | number, Record<string, number | string | null>>()
  if (view === 'hour') {
    const latest = Math.max(...history.meters.map((m) => m.hours.at(-1)?.start ?? 0))
    if (latest > 0) {
      for (let h = latest - 23 * HOUR_MS; h <= latest; h += HOUR_MS) rows.set(h, { x: h })
    }
    for (const m of history.meters) {
      for (const hour of m.hours) {
        const row = rows.get(hour.start)
        if (row) row[m.id] = hour.kwh
      }
    }
  } else {
    const dates = [...new Set(history.meters.flatMap((m) => m.days.map((d) => d.date)))].sort()
    for (const date of dates) rows.set(date, { x: date })
    for (const m of history.meters) {
      for (const day of m.days) rows.get(day.date)![m.id] = day.kwh
    }
  }
  const data = [...rows.values()]
  if (data.length === 0) return <p className="text-sm text-muted-foreground">myECO belum punya riwayat untuk toko ini.</p>

  const label = (x: number | string) => (view === 'hour' ? hourMinute(Number(x)) : dayLabel(String(x)))
  const title = (x: number | string) => (view === 'hour' ? `Mulai ${dayHour(Number(x))} WIB` : dayLabel(String(x)))
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <Grid />
          <XAxis {...AXIS} dataKey="x" tickFormatter={label} minTickGap={24} />
          <YAxis {...AXIS} width={64} tickFormatter={(v: number) => num(v, 1, 'kWh')} />
          <Tooltip cursor={{ fill: 'var(--muted)', opacity: 0.5 }} content={chartTooltip(title, 'kWh')} />
          {history.meters.map((m, i) => (
            <Bar
              key={m.id}
              dataKey={m.id}
              name={m.label}
              stackId="ac"
              fill={DEFAULT_PALETTE[i]}
              maxBarSize={48}
              isAnimationActive={false}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

function Problem({ text }: { text: string }) {
  return (
    <p role="alert" className="text-sm text-destructive">
      {text}
    </p>
  )
}

export function MyEcoAcSection({ storeCode }: { storeCode: string }) {
  const src = `/api/stores/${encodeURIComponent(storeCode)}/myeco`
  const { data: live, error: liveError } = useMyEco<MyEcoLive>(src, MYECO_POLL_MS)
  const { data: history, error: historyError } = useMyEco<MyEcoHistory>(`${src}?view=history`, HISTORY_REFRESH_MS)
  const [view, setView] = useState<'hour' | 'day'>('hour')

  return (
    <section aria-labelledby="myeco-title" className="flex flex-col gap-5 rounded-2xl bg-card p-5 ring-1 ring-foreground/10">
      <div className="flex flex-col gap-1">
        <div className="flex flex-wrap items-center gap-2">
          <h2 id="myeco-title" className="text-lg font-semibold">
            AC
          </h2>
          <MyEcoBadge />
        </div>
        <p className="text-sm text-muted-foreground">
          Dibaca tiap 15 detik; alat myECO mengirim sekitar tiap 30 detik. AC adalah sub-meter dan tidak masuk total
          toko.
        </p>
      </div>

      {liveError && (
        <Problem
          text={live ? `${liveError} Yang tampil adalah data pukul ${clock(live.at)} WIB.` : liveError}
        />
      )}
      {!live && !liveError && <Skeleton className="h-48 w-full rounded-xl motion-reduce:animate-none" />}
      {live && (
        <>
          <Table scrollLabel="Data AC dari myECO">
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>AC</TableHead>
                <TableHead className="text-right">Daya</TableHead>
                <TableHead className="text-right">Hari ini</TableHead>
                <TableHead className="text-right max-md:hidden">Arus</TableHead>
                <TableHead className="text-right max-md:hidden">Tegangan</TableHead>
                <TableHead className="text-right max-md:hidden">Faktor daya</TableHead>
                <TableHead className="max-sm:hidden">Data terakhir (WIB)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {live.meters.map((m) => {
                // Old values are not shown as if they were current.
                const isLive = m.state === 'live'
                return (
                  <TableRow key={m.id}>
                    <TableCell className="py-3">
                      <span className="flex flex-wrap items-center gap-2">
                        <span className="font-medium">{m.label}</span>
                        <Badge variant={STATE[m.state].variant}>{STATE[m.state].label}</Badge>
                      </span>
                      <span className="block text-xs text-muted-foreground tabular-nums sm:hidden">
                        {m.updatedAt === null ? '-' : clock(m.updatedAt)}
                      </span>
                    </TableCell>
                    <TableCell className="py-3 text-right tabular-nums">{num(isLive ? m.power : null, 0, 'W')}</TableCell>
                    <TableCell className="py-3 text-right tabular-nums">{num(m.todayKwh, 2, 'kWh')}</TableCell>
                    <TableCell className="py-3 text-right tabular-nums max-md:hidden">
                      {num(isLive ? m.current : null, 2, 'A')}
                    </TableCell>
                    <TableCell className="py-3 text-right tabular-nums max-md:hidden">
                      {num(isLive ? m.voltage : null, 1, 'V')}
                    </TableCell>
                    <TableCell className="py-3 text-right tabular-nums max-md:hidden">
                      {num(isLive ? m.powerFactor : null, 2, '')}
                    </TableCell>
                    <TableCell className="py-3 tabular-nums max-sm:hidden">
                      {m.updatedAt === null ? '-' : isLive ? clock(m.updatedAt) : dayHour(m.updatedAt)}
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
          <div className="flex flex-col gap-2">
            <h3 className="text-sm font-semibold">Daya, sampai 1 jam terakhir</h3>
            <LiveChart live={live} />
            <Legend meters={live.meters} />
          </div>
        </>
      )}

      <div className="flex flex-col gap-2">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="text-sm font-semibold">
            Energi, {view === 'hour' ? '24 jam tercatat terakhir' : '30 hari terakhir'}
          </h3>
          <ToggleGroup
            aria-label="Rentang energi AC"
            variant="outline"
            spacing={0}
            value={[view]}
            onValueChange={(value) => value[0] && setView(value[0] as 'hour' | 'day')}
          >
            <ToggleGroupItem value="hour" className={PRESSED}>
              Per jam
            </ToggleGroupItem>
            <ToggleGroupItem value="day" className={PRESSED}>
              Per hari
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
        {historyError && <Problem text={historyError} />}
        {!history && !historyError && <Skeleton className="h-64 w-full rounded-xl motion-reduce:animate-none" />}
        {history && (
          <>
            <HistoryChart history={history} view={view} />
            <Legend meters={history.meters} />
          </>
        )}
      </div>
    </section>
  )
}
