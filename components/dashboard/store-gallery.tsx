'use client'

import { useState, useMemo } from 'react'
import { MOCK_STORES } from '@/lib/mock-data'
import { StoreStatus } from '@/lib/types'
import { DashboardKpiSummary } from './dashboard-kpi-summary'
import { GalleryToolbar } from './gallery-toolbar'
import { StoreCard } from './store-card'
import { StoreTable } from './store-table'

export function StoreGallery() {
  const [search, setSearch] = useState('')
  const [branchFilter, setBranchFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState<StoreStatus | 'all'>('all')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  // Extract unique branches dynamically
  const uniqueBranches = useMemo(() => {
    const branchSet = new Set<string>()
    MOCK_STORES.forEach((s) => {
      if (s.branch) branchSet.add(s.branch)
    })
    return Array.from(branchSet).sort()
  }, [])

  const filteredStores = useMemo(() => {
    return MOCK_STORES.filter((store) => {
      // Filter by branch
      if (branchFilter !== 'all' && store.branch !== branchFilter) {
        return false
      }

      // Filter by status
      if (statusFilter !== 'all' && store.status !== statusFilter) {
        return false
      }

      // Filter by search term (Code or Name or Branch)
      if (search.trim()) {
        const q = search.toLowerCase()
        const matchCode = store.code.toLowerCase().includes(q)
        const matchName = store.name.toLowerCase().includes(q)
        const matchBranch = store.branch.toLowerCase().includes(q)
        if (!matchCode && !matchName && !matchBranch) {
          return false
        }
      }

      return true
    })
  }, [search, branchFilter, statusFilter])

  return (
    <div className="flex flex-col gap-6">
      {/* Top Header */}
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Dashboard &amp; Monitoring Energi
          </h1>
          <p className="text-sm text-muted-foreground">
            Rekapan konsumsi energi telemetri dan status operasional seluruh cabang Alfamart.
          </p>
        </div>
      </div>

      {/* KPI Stats Summary Cards */}
      <DashboardKpiSummary stores={MOCK_STORES} />

      {/* Filter Toolbar */}
      <div className="flex flex-col gap-4 border-t pt-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-foreground">
            Daftar Toko ({filteredStores.length})
          </h2>
        </div>

        <GalleryToolbar
          search={search}
          onSearch={setSearch}
          branchFilter={branchFilter}
          onBranchFilter={setBranchFilter}
          branches={uniqueBranches}
          statusFilter={statusFilter}
          onStatusFilter={setStatusFilter}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
        />
      </div>

      {/* Store Grid / Table View */}
      {filteredStores.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed py-20 text-center">
          <p className="text-sm font-medium text-muted-foreground">
            Tidak ada toko yang cocok dengan filter atau pencarian Anda.
          </p>
          <button
            onClick={() => {
              setSearch('')
              setBranchFilter('all')
              setStatusFilter('all')
            }}
            className="mt-3 text-xs font-semibold text-emerald-600 hover:underline dark:text-emerald-400"
          >
            Reset Semua Filter
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {filteredStores.map((store) => (
            <StoreCard key={store.id} store={store} />
          ))}
        </div>
      ) : (
        <StoreTable stores={filteredStores} />
      )}
    </div>
  )
}
