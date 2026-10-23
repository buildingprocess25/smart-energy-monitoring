import { getStores } from '@/lib/services/store-service'
import { getSangatBorosStores, withInstallStatus } from '@/lib/services/sangat-boros-service'
import { StoreGallery } from '@/components/dashboard/store-gallery'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Monitoring Toko | Smart Energy Monitoring',
  description: 'Daftar dan pemantauan telemetri energi seluruh cabang toko Alfamart.',
}

export default async function MonitoringPage() {
  const [stores, sangatBoros] = await Promise.all([getStores(), getSangatBorosStores()])
  return (
    <StoreGallery
      initialStores={stores}
      sangatBoros={{
        status: sangatBoros.status,
        items: withInstallStatus(sangatBoros.stores, stores),
      }}
    />
  )
}
