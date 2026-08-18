'use client'

import { Search, Building2, LayoutGrid, List } from 'lucide-react'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { StoreStatus } from '@/lib/types'
import { cn } from '@/lib/utils'

interface GalleryToolbarProps {
  search: string
  onSearch: (value: string) => void
  branchFilter: string
  onBranchFilter: (value: string) => void
  branches: string[]
  statusFilter: StoreStatus | 'all'
  onStatusFilter: (value: StoreStatus | 'all') => void
  viewMode: 'grid' | 'list'
  onViewModeChange: (mode: 'grid' | 'list') => void
}

export function GalleryToolbar({
  search,
  onSearch,
  branchFilter,
  onBranchFilter,
  branches,
  statusFilter,
  onStatusFilter,
  viewMode,
  onViewModeChange,
}: GalleryToolbarProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      {/* Search Input */}
      <div className="relative max-w-sm flex-1">
        <Search className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Cari nama atau kode toko (cth: TK001, Pondok Kacang)..."
          className="h-9 pl-9 text-sm"
          value={search}
          onChange={(e) => onSearch(e.target.value)}
        />
      </div>

      {/* Filter Controls & View Switcher */}
      <div className="flex flex-wrap items-center gap-2.5">
        {/* Branch Filter */}
        <Select
          value={branchFilter}
          onValueChange={(val) => {
            if (val !== null) onBranchFilter(val)
          }}
        >
          <SelectTrigger className="h-9 w-full text-xs sm:w-[170px]">
            <Building2 className="mr-1.5 size-3.5 text-muted-foreground" />
            <SelectValue placeholder="Semua Cabang" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Cabang</SelectItem>
            {branches.map((branch) => (
              <SelectItem key={branch} value={branch}>
                {branch}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Status Filter */}
        <Select
          value={statusFilter}
          onValueChange={(val) => {
            if (val !== null) onStatusFilter(val as StoreStatus | 'all')
          }}
        >
          <SelectTrigger className="h-9 w-full text-xs sm:w-[160px]">
            <SelectValue placeholder="Semua Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Status</SelectItem>
            <SelectItem value="live">Live Monitoring</SelectItem>
            <SelectItem value="historical">Riwayat / Selesai</SelectItem>
            <SelectItem value="unassigned">Belum Terhubung</SelectItem>
          </SelectContent>
        </Select>

        {/* View Mode Switcher (Grid vs List) */}
        <div className="flex items-center rounded-lg border bg-muted/30 p-0.5">
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={() => onViewModeChange('grid')}
            title="Tampilan Grid / Card"
            className={cn(
              'size-7.5 rounded-md transition-all',
              viewMode === 'grid'
                ? 'bg-background text-foreground shadow-xs'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            <LayoutGrid className="size-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={() => onViewModeChange('list')}
            title="Tampilan List / Tabel"
            className={cn(
              'size-7.5 rounded-md transition-all',
              viewMode === 'list'
                ? 'bg-background text-foreground shadow-xs'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            <List className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
