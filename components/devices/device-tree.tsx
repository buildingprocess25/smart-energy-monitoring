import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { unstable_rethrow } from 'next/navigation'
import type { TreeSensor } from '@/lib/device-tree'
import { getDeviceTree } from '@/lib/services/device-tree-service'

const formatKwh = (kwh: number | null) =>
  kwh === null ? '-' : `${kwh.toLocaleString('id-ID', { maximumFractionDigits: 1 })} kWh`

const SUMMARY =
  'flex min-h-11 cursor-pointer list-none items-center gap-2 rounded-md px-3 py-2 hover:bg-muted focus-visible:outline-2 focus-visible:outline-ring [&::-webkit-details-marker]:hidden'

function SensorList({ title, note, sensors }: { title: string; note?: string; sensors: TreeSensor[] }) {
  if (sensors.length === 0) return null
  return (
    <div className="flex flex-col gap-1">
      <p className="text-xs text-muted-foreground">
        <span className="font-medium text-foreground">{title}</span>
        {note && `, ${note}`}
      </p>
      <ul className="flex flex-col divide-y">
        {sensors.map((s) => (
          <li key={`${s.deviceId}-${s.phase}`} className="flex items-baseline justify-between gap-4 py-1.5 text-sm">
            <span className="min-w-0">
              <span className="break-words">{s.name}</span>{' '}
              <span className="text-xs break-words text-muted-foreground">{s.deviceId}</span>
            </span>
            <span className="shrink-0 tabular-nums">{formatKwh(s.kwh)}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export async function DeviceTree() {
  let tree: Awaited<ReturnType<typeof getDeviceTree>>
  try {
    tree = await getDeviceTree()
  } catch (error) {
    unstable_rethrow(error)
    console.error('Perangkat: gagal memuat pohon perangkat', error)
    return (
      <p role="alert" className="text-sm text-muted-foreground">
        Pohon perangkat belum bisa dimuat. Muat ulang halaman.
      </p>
    )
  }

  const monthLabel = new Date(`${tree.month}-01T00:00:00Z`).toLocaleDateString('id-ID', {
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  })

  return (
    <section aria-labelledby="tree-title" className="flex flex-col gap-3">
      <div>
        <h2 id="tree-title" className="text-lg font-semibold">
          Energi per cabang, {monthLabel}
        </h2>
        <p className="text-sm text-muted-foreground">
          Total toko dan cabang hanya dari panel utama (R/S/T). Sub-meter mengukur sebagian beban itu, jadi tidak
          dijumlahkan.
        </p>
      </div>
      <div className="flex flex-col gap-2 rounded-2xl bg-card p-2 ring-1 ring-foreground/10">
        {tree.branches.map((branch) => (
          <details key={branch.name} open className="group/branch">
            <summary className={SUMMARY}>
              <ChevronRight aria-hidden="true" className="size-4 shrink-0 group-open/branch:rotate-90" />
              <span className="min-w-0 flex-1 font-semibold break-words">
                {branch.name}{' '}
                <span className="text-sm font-normal text-muted-foreground">{branch.stores.length} lokasi</span>
              </span>
              <span className="shrink-0 text-sm font-semibold tabular-nums">{formatKwh(branch.mainKwh)}</span>
            </summary>
            <div className="flex flex-col gap-1 pl-3 sm:pl-6">
              {branch.stores.map((store) => (
                <details key={store.key} className="group/store">
                  <summary className={SUMMARY}>
                    <ChevronRight aria-hidden="true" className="size-4 shrink-0 group-open/store:rotate-90" />
                    <span className="min-w-0 flex-1 text-sm">
                      <span className="block font-medium break-words">
                        {store.name}
                        {store.code && ` (${store.code})`}
                      </span>
                      <span className="block text-xs text-muted-foreground">
                        {store.onlineCount} dari {store.deviceCount} perangkat online
                      </span>
                    </span>
                    <span className="shrink-0 text-sm tabular-nums">{formatKwh(store.mainKwh)}</span>
                  </summary>
                  <div className="flex flex-col gap-3 py-2 pr-3 pl-9">
                    <SensorList title="Panel utama" sensors={store.main} />
                    <SensorList title="Sub-meter" note="di luar total" sensors={store.sub} />
                    {store.main.length + store.sub.length === 0 && (
                      <p className="text-sm text-muted-foreground">Belum ada sensor aktif.</p>
                    )}
                    {store.hasStore && store.code && (
                      <Link
                        href={`/monitoring/${encodeURIComponent(store.code)}`}
                        className="w-fit text-sm font-medium text-primary hover:underline"
                      >
                        Buka detail toko
                      </Link>
                    )}
                  </div>
                </details>
              ))}
            </div>
          </details>
        ))}
      </div>
    </section>
  )
}
