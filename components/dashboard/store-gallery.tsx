'use client'

import { useState, useMemo } from 'react'
import { MOCK_STORES } from '@/lib/mock-data'
import { StoreStatus } from '@/lib/types'
import { GalleryToolbar } from './gallery-toolbar'
import { StoreCard } from './store-card'

export function StoreGallery() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<StoreStatus | 'all'>('all')

  const filteredStores = useMemo(() => {
    return MOCK_STORES.filter((store) => {
      // Filter by status
      if (statusFilter !== 'all' && store.status !== statusFilter) {
        return false
      }

      // Filter by search term
      if (search.trim()) {
        const q = search.toLowerCase()
        const matchId = store.id.toLowerCase().includes(q)
        const matchName = store.name.toLowerCase().includes(q)
        const matchAddress = store.address.toLowerCase().includes(q)
        if (!matchId && !matchName && !matchAddress) {
          return false
        }
      }

      return true
    })
  }, [search, statusFilter])

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Overview Toko</h1>
        <p className="text-muted-foreground">
          Pantau status audit dan konsumsi energi seluruh titik secara terpusat.
        </p>
      </div>

      <GalleryToolbar
        search={search}
        onSearch={setSearch}
        statusFilter={statusFilter}
        onStatusFilter={setStatusFilter}
      />

      {filteredStores.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed py-24 text-center">
          <p className="text-muted-foreground">
            Tidak ada toko yang cocok dengan pencarian Anda.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {filteredStores.map((store) => (
            <StoreCard key={store.id} store={store} />
          ))}
        </div>
      )}
    </div>
  )
}
