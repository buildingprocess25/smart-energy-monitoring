import { getStores } from '@/lib/services/store-service'
import { StoreGallery } from '@/components/dashboard/store-gallery'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Monitoring Toko | Smart Energy Monitoring',
  description: 'Daftar dan pemantauan telemetri energi seluruh cabang toko Alfamart.',
}

export default async function MonitoringPage() {
  const stores = await getStores()
  return <StoreGallery initialStores={stores} />
}
