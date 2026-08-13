import Image from 'next/image'
import Link from 'next/link'
import { MapPin, Zap, Activity } from 'lucide-react'
import { Store } from '@/lib/types'
import { StatusBadge } from './status-badge'
import { Button } from '@/components/ui/button'

interface StoreCardProps {
  store: Store
}

function formatRelativeTime(isoString: string) {
  if (!isoString) return 'Belum ada data'
  const date = new Date(isoString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  
  if (diffMins < 1) return 'Baru saja'
  if (diffMins < 60) return `${diffMins} menit lalu`
  if (diffMins < 1440) return `${Math.floor(diffMins / 60)} jam lalu`
  return `${Math.floor(diffMins / 1440)} hari lalu`
}

export function StoreCard({ store }: StoreCardProps) {
  const isUnassigned = store.status === 'unassigned'

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-xl border bg-card text-card-foreground shadow-sm transition-all hover:shadow-md">
      {/* Image Header */}
      <div className="relative h-44 w-full overflow-hidden bg-muted">
        <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        
        {/* We use a placeholder div instead of actual next/image for mock to avoid missing image errors */}
        <div className="absolute inset-0 bg-slate-200 dark:bg-slate-800 flex items-center justify-center transition-transform duration-500 group-hover:scale-105">
           <span className="text-slate-400 font-medium">Store Photo</span>
        </div>
        
        <StatusBadge status={store.status} className="absolute bottom-3 left-3 z-20" />
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-4">
        <h3 className="line-clamp-1 font-semibold leading-none tracking-tight">
          {store.name}
        </h3>
        <p className="mt-1.5 flex items-start gap-1.5 text-xs text-muted-foreground">
          <MapPin className="mt-0.5 size-3.5 shrink-0" />
          <span className="line-clamp-2">{store.address}</span>
        </p>

        {!isUnassigned ? (
          <div className="mt-4 grid grid-cols-3 gap-2 border-t pt-4 text-center">
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground">kWh Total</span>
              <span className="mt-0.5 font-semibold text-foreground">
                {store.kwhTotal.toLocaleString()}
              </span>
            </div>
            <div className="flex flex-col border-l">
              <span className="text-xs text-muted-foreground">Perangkat</span>
              <span className="mt-0.5 font-semibold text-foreground">
                {store.deviceCount}
              </span>
            </div>
            <div className="flex flex-col border-l">
              <span className="text-xs text-muted-foreground">Update</span>
              <span className="mt-0.5 text-xs font-medium text-foreground">
                {formatRelativeTime(store.lastUpdate)}
              </span>
            </div>
          </div>
        ) : (
          <div className="mt-auto pt-4">
            <Button
              variant="outline"
              className="w-full"
              render={<Link href="#">Assign Devices</Link>}
            />
          </div>
        )}
      </div>

      {/* Hover Overlay */}
      {!isUnassigned && (
        <div className="absolute inset-0 z-30 flex items-center justify-center bg-background/60 opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100">
          <Button
            variant="default"
            className="bg-emerald-600 hover:bg-emerald-700 text-white"
            render={
              <Link href={`/monitoring/${store.id}`}>
                <Activity className="mr-2 size-4" />
                View Monitoring
              </Link>
            }
          />
        </div>
      )}
    </div>
  )
}
