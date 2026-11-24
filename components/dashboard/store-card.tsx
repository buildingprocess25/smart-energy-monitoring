import Link from 'next/link'
import { formatStoreKwh } from '@/lib/format-energy'
import { Building2 } from 'lucide-react'
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

  const body = (
    <>
      <div className="flex flex-col items-start gap-2">
        <div className="w-full min-w-0">
          <h3 className="truncate font-semibold text-foreground">{store.name}</h3>
          <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Building2 aria-hidden="true" className="size-3.5 shrink-0" />
            <span className="truncate">
              {store.code}, Cabang {store.branch}
            </span>
          </p>
        </div>
        <StatusBadge
          status={store.status}
          isRecording={store.isRecording}
          recordingStalled={store.recordingStalled}
          recordingSessionName={store.recordingSessionName}
        />
      </div>

      {isUnassigned ? (
        <p className="text-sm text-muted-foreground">Pasang perangkat untuk mulai memantau toko ini.</p>
      ) : (
        <dl className="grid grid-cols-3 gap-3 text-sm">
          <div>
            <dt className="text-xs text-muted-foreground">
              {store.energyBasis === 'sensor' ? 'kWh sensor' : 'kWh total'}
            </dt>
            <dd className="font-semibold tabular-nums">{formatStoreKwh(store)}</dd>
          </div>
          <div>
            <dt className="text-xs text-muted-foreground">Perangkat</dt>
            <dd className="font-semibold tabular-nums">{store.deviceCount}</dd>
          </div>
          <div>
            <dt className="text-xs text-muted-foreground">Diperbarui</dt>
            <dd suppressHydrationWarning className="font-semibold">
              {formatRelativeTime(store.lastUpdate)}
            </dd>
          </div>
        </dl>
      )}
    </>
  )
  const cardClassName =
    'flex flex-col gap-5 rounded-2xl bg-card p-5 text-card-foreground ring-1 ring-foreground/10'

  if (isUnassigned) return <div className={cardClassName}>{body}</div>

  return (
    <Link
      href={`/monitoring/${store.code || store.id}`}
      className={cn(
        cardClassName,
        'transition-colors outline-none hover:bg-muted/30 hover:ring-primary/50 focus-visible:ring-[3px] focus-visible:ring-ring/50'
      )}
    >
      {body}
    </Link>
  )
}
