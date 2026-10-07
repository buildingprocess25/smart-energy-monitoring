import Link from 'next/link'
import { ArrowRight, Zap, Building2, Clock, Cpu } from 'lucide-react'
import { Store } from '@/lib/types'
import { StatusBadge } from './status-badge'
import { cn } from '@/lib/utils'

interface StoreCardProps {
  store: Store
}

function formatRelativeTime(isoString: string) {
  if (!isoString) return 'Belum ada data'
  const date = new Date(isoString)
  if (isNaN(date.getTime())) {
    // If it's already a formatted string like "10:15:30", just return it
    return isoString
  }
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  if (diffMs < 0) return 'Baru saja'
  const diffMins = Math.floor(diffMs / 60000)

  if (diffMins < 1) return 'Baru saja'
  if (diffMins < 60) return `${diffMins} mnt lalu`
  if (diffMins < 1440) return `${Math.floor(diffMins / 60)} jam lalu`
  return `${Math.floor(diffMins / 1440)} hari lalu`
}

export function StoreCard({ store }: StoreCardProps) {
  const isUnassigned = store.status === 'unassigned'
  const href = !isUnassigned ? `/monitoring/${store.code || store.id}` : '#'

  return (
    <Link
      href={href}
      className={cn(
        'group relative flex flex-col overflow-hidden rounded-xl border bg-card text-card-foreground shadow-xs',
        'transition-all duration-300 ease-out',
        'hover:-translate-y-1 hover:border-emerald-500/40 hover:shadow-lg hover:shadow-emerald-500/5 dark:hover:border-emerald-500/50 dark:hover:shadow-emerald-950/30'
      )}
    >
      {/* Visual Header */}
      <div className="relative h-32 w-full overflow-hidden bg-muted/60 dark:bg-muted/30">
        {/* Ambient Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-slate-100 to-slate-200 dark:from-emerald-950/30 dark:via-slate-900 dark:to-slate-800 transition-transform duration-500 ease-out group-hover:scale-105" />

        {/* Decorative Grid Pattern */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-[0.06] [background-image:linear-gradient(to_right,currentColor_1px,transparent_1px),linear-gradient(to_bottom,currentColor_1px,transparent_1px)] [background-size:16px_16px]"
        />

        {/* Store Icon Illustration */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex size-12 items-center justify-center rounded-2xl border border-border/50 bg-background/85 shadow-xs backdrop-blur-sm transition-transform duration-300 group-hover:scale-110">
            <Building2 className="size-6 text-emerald-600 dark:text-emerald-400" />
          </div>
        </div>

        {/* Status Badge */}
        <StatusBadge
          status={store.status}
          isRecording={store.isRecording}
          recordingSessionName={store.recordingSessionName}
          className="absolute left-3 top-3 z-10 shadow-xs backdrop-blur-sm"
        />

        {/* Branch Badge */}
        <div className="absolute right-3 top-3 z-10 rounded-md border border-border/60 bg-background/85 px-2 py-0.5 text-[10px] font-semibold text-foreground backdrop-blur-sm">
          {store.branch}
        </div>
      </div>

      {/* Content Body */}
      <div className="flex flex-1 flex-col p-4">
        {/* Code & Name */}
        <div className="flex items-center gap-2">
          <span className="rounded bg-muted px-1.5 py-0.5 font-mono text-[10px] font-bold text-muted-foreground">
            {store.code}
          </span>
          <h3 className="line-clamp-1 font-semibold leading-snug tracking-tight text-foreground transition-colors duration-200 group-hover:text-emerald-600 dark:group-hover:text-emerald-400">
            {store.name}
          </h3>
        </div>

        {/* Branch Subtitle */}
        <p className="mt-1 text-xs text-muted-foreground">
          Cabang {store.branch}
        </p>

        {/* Telemetry Metrics Grid */}
        {!isUnassigned ? (
          <div className="mt-4 grid grid-cols-3 gap-2 border-t pt-3.5 text-center">
            {/* Total kWh */}
            <div className="flex flex-col items-center justify-center">
              <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
                <Zap className="size-3 text-emerald-600 dark:text-emerald-400" />
                kWh Total
              </span>
              <span className="mt-0.5 font-semibold text-sm text-foreground">
                {store.kwhTotal.toLocaleString('id-ID')}
              </span>
            </div>

            {/* Device Count */}
            <div className="flex flex-col items-center justify-center border-l">
              <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
                <Cpu className="size-3 text-blue-600 dark:text-blue-400" />
                Perangkat
              </span>
              <span className="mt-0.5 font-semibold text-sm text-foreground">
                {store.deviceCount}
              </span>
            </div>

            {/* Last Update */}
            <div className="flex flex-col items-center justify-center border-l">
              <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
                <Clock className="size-3 text-muted-foreground" />
                Update
              </span>
              <span
                suppressHydrationWarning
                className="mt-0.5 text-xs font-medium text-foreground"
              >
                {formatRelativeTime(store.lastUpdate)}
              </span>
            </div>
          </div>
        ) : (
          <div className="mt-auto pt-4 text-center">
            <p className="text-xs text-muted-foreground italic">
              Belum ada sesi audit terpasang
            </p>
          </div>
        )}
      </div>

      {/* Bottom Interactive Action Footer */}
      <div
        className={cn(
          'flex items-center justify-between border-t px-4 py-2.5 text-xs font-medium transition-colors duration-200',
          !isUnassigned
            ? 'bg-muted/20 text-muted-foreground group-hover:bg-emerald-500/8 group-hover:text-emerald-700 dark:group-hover:text-emerald-300'
            : 'bg-muted/10 text-muted-foreground'
        )}
      >
        <span>
          {!isUnassigned ? 'Lihat Detail Monitoring' : 'Belum Terhubung'}
        </span>
        <ArrowRight className="size-3.5 transition-transform duration-200 group-hover:translate-x-1" />
      </div>
    </Link>
  )
}
