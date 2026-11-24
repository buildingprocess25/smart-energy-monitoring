import { normalizePhaseKey } from '@/lib/phase-keys'
import { formatStoreKwh } from '@/lib/format-energy'
import { Building2 } from 'lucide-react'
import { Store } from '@/lib/types'
import { MyEcoBadge } from '@/components/monitoring/myeco-badge'
import { StatusBadge } from '@/components/dashboard/status-badge'

interface StoreHeroProps {
  store: Store
  myEcoOnly?: boolean
}

export function StoreHero({ store, myEcoOnly = false }: StoreHeroProps) {
  // R/S/T only when the store has a main panel, so sub-meters are not counted twice.
  const phases = store.phases ?? []
  const main = phases.filter((p) => ['R', 'S', 'T'].includes(normalizePhaseKey(p.phase)))
  const currentTotalW = (store.energyBasis === 'main' ? main : phases).reduce((sum, p) => sum + (p.power || 0), 0)

  return (
    <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
      <div className="flex min-w-0 flex-col gap-2">
        <h1 className="text-2xl font-bold tracking-tight text-balance sm:text-3xl">{store.name}</h1>
        <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
          {myEcoOnly ? (
            <MyEcoBadge />
          ) : (
            <StatusBadge
              status={store.status}
              isRecording={store.isRecording}
              recordingStalled={store.recordingStalled}
              recordingSessionName={store.recordingSessionName}
            />
          )}
          <span className="flex items-center gap-1.5">
            <Building2 aria-hidden="true" className="size-4 shrink-0" />
            {store.code}, Cabang {store.branch}
          </span>
        </div>
      </div>

      {!myEcoOnly && (
      <dl className="grid grid-cols-2 gap-x-8 gap-y-3 sm:flex sm:flex-wrap">
        <div>
          <dt className="text-xs text-muted-foreground">
            {store.energyBasis === 'sensor' ? 'Energi sensor' : 'Total energi'}
          </dt>
          <dd className="text-lg font-semibold tabular-nums">{formatStoreKwh(store)} kWh</dd>
        </div>
        {store.status === 'live' && currentTotalW > 0 && (
          <div>
            <dt className="text-xs text-muted-foreground">Beban terakhir</dt>
            <dd className="text-lg font-semibold tabular-nums">
              {Math.round(currentTotalW).toLocaleString('id-ID')} W
            </dd>
          </div>
        )}
        <div>
          <dt className="text-xs text-muted-foreground">Perangkat</dt>
          <dd className="text-lg font-semibold tabular-nums">{store.deviceCount}</dd>
        </div>
      </dl>
      )}
    </div>
  )
}
