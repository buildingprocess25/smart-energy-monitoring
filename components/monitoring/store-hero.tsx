import { MapPin, Zap, Hash, Activity } from 'lucide-react'
import { Store } from '@/lib/types'
import { StatusBadge } from '@/components/dashboard/status-badge'

interface StoreHeroProps {
  store: Store
}

export function StoreHero({ store }: StoreHeroProps) {
  // Hitung total W saat ini (jika ada fase)
  const currentTotalW = store.phases.reduce((acc, p) => acc + p.power, 0)

  return (
    <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
      {/* Kiri: Info Toko */}
      <div className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <StatusBadge status={store.status} className="h-6 px-2 text-[10px]" />
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            {store.name}
          </h1>
        </div>
        <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <MapPin className="size-4 shrink-0" />
          {store.address}
        </p>
      </div>

      {/* Kanan: Metrics Cepat */}
      <div className="flex flex-wrap gap-4 md:justify-end">
        <div className="flex items-center gap-3 rounded-lg border bg-card px-4 py-2 shadow-sm">
          <div className="flex size-8 items-center justify-center rounded-md bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
            <Zap className="size-4" />
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground">Total Energi</span>
            <span className="font-bold leading-none tracking-tight">
              {store.kwhTotal.toLocaleString()} <span className="text-xs font-normal text-muted-foreground">kWh</span>
            </span>
          </div>
        </div>

        {store.status === 'live' && currentTotalW > 0 && (
          <div className="flex items-center gap-3 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-2 shadow-sm dark:border-emerald-900/50 dark:bg-emerald-950/20">
            <div className="flex size-8 items-center justify-center rounded-md bg-emerald-100 text-emerald-600 dark:bg-emerald-900/50 dark:text-emerald-400">
              <Activity className="size-4" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-medium text-emerald-700 dark:text-emerald-400">
                Beban Saat Ini
              </span>
              <span className="font-bold leading-none tracking-tight text-emerald-700 dark:text-emerald-400">
                {currentTotalW.toLocaleString()} <span className="text-xs font-normal">W</span>
              </span>
            </div>
          </div>
        )}

        <div className="flex items-center gap-3 rounded-lg border bg-card px-4 py-2 shadow-sm">
          <div className="flex size-8 items-center justify-center rounded-md bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400">
            <Hash className="size-4" />
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground">Perangkat IoT</span>
            <span className="font-bold leading-none tracking-tight">
              {store.deviceCount}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
