import Link from 'next/link'
import { unstable_rethrow } from 'next/navigation'
import { MyEcoBadge } from '@/components/monitoring/myeco-badge'
import { buttonVariants } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { getMyEcoList, type MyEcoListItem } from '@/lib/services/myeco-service'

export async function MyEcoStoreList() {
  let stores: MyEcoListItem[]
  try {
    stores = await getMyEcoList()
  } catch (error) {
    unstable_rethrow(error)
    console.error('Monitoring: gagal memuat toko myECO', error)
    return (
      <p role="alert" className="text-sm text-muted-foreground">
        Daftar toko myECO belum bisa dimuat. Muat ulang halaman.
      </p>
    )
  }
  if (stores.length === 0) return null

  return (
    <section aria-labelledby="myeco-list-title" className="flex flex-col gap-4">
      <div>
        <h2 id="myeco-list-title" className="text-base font-semibold">
          Toko dengan data AC ({stores.length})
        </h2>
        <p className="text-sm text-muted-foreground">
          Hanya AC yang diukur, jadi toko ini tidak masuk total energi dan biaya.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {stores.map((store) => (
          <Card key={store.code}>
            <CardHeader>
              <CardTitle className="flex flex-wrap items-center gap-2">
                {store.name}
                <MyEcoBadge />
              </CardTitle>
              <CardDescription>
                {store.code}, Cabang {store.branch}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <dl className="grid grid-cols-2 gap-3 text-sm tabular-nums">
                <div>
                  <dt className="text-xs text-muted-foreground">AC mengirim data</dt>
                  <dd className="font-medium">
                    {store.onlineCount ?? '-'} dari {store.meterCount}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs text-muted-foreground">Daya AC</dt>
                  <dd className="font-medium">
                    {store.powerWatts === null ? '-' : `${Math.round(store.powerWatts).toLocaleString('id-ID')} W`}
                  </dd>
                </div>
              </dl>
            </CardContent>
            <CardFooter>
              <Link
                href={`/monitoring/${encodeURIComponent(store.code)}`}
                className={buttonVariants({ variant: 'outline', size: 'sm' })}
              >
                Lihat AC
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </section>
  )
}
