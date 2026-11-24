'use client'

import { Search, Building2, LayoutGrid, List } from 'lucide-react'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { StoreStatus } from '@/lib/types'
import { cn } from '@/lib/utils'

const STATUS_LABELS: Record<string, string> = {
  all: 'Semua Status',
  live: 'Online',
  historical: 'Offline, ada riwayat',
  unassigned: 'Belum ada perangkat',
}

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
    <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
      {/* Search Input */}
      <div className="relative w-full lg:max-w-sm">
        <Search className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
        <Input
          type="search"
          aria-label="Cari toko"
          placeholder="Cari nama atau kode toko"
          className="h-9 pl-9 text-sm"
          value={search}
          onChange={(e) => onSearch(e.target.value)}
        />
      </div>

      {/* Filter Controls & View Switcher */}
      <div className="flex min-w-0 flex-col gap-2 sm:flex-row sm:items-center lg:shrink-0">
        {/* Branch Filter */}
        <Select
          value={branchFilter}
          onValueChange={(val) => {
            if (val !== null) onBranchFilter(val)
          }}
        >
          <SelectTrigger className="w-full min-w-0 sm:flex-1 lg:w-44 lg:flex-none">
            <Building2 className="mr-1.5 size-3.5 text-muted-foreground" />
            <SelectValue>{(value: string) => (value === 'all' ? 'Semua Cabang' : value)}</SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="all">Semua Cabang</SelectItem>
              {branches.map((branch) => (
                <SelectItem key={branch} value={branch}>
                  {branch}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>

        {/* Status Filter */}
        <Select
          value={statusFilter}
          onValueChange={(val) => {
            if (val !== null) onStatusFilter(val as StoreStatus | 'all')
          }}
        >
          <SelectTrigger className="w-full min-w-0 sm:flex-1 lg:w-52 lg:flex-none">
            <SelectValue>{(value: string) => STATUS_LABELS[value] ?? value}</SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {Object.entries(STATUS_LABELS).map(([value, label]) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>

        {/* View Mode Switcher (Grid vs List) */}
        <div role="group" aria-label="Tampilan daftar" className="flex shrink-0 items-center self-start rounded-full border p-0.5 sm:self-auto">
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={() => onViewModeChange('grid')}
            title="Tampilan kartu"
            aria-label="Tampilan kartu"
            aria-pressed={viewMode === 'grid'}
            className={cn(
              'size-8',
              viewMode === 'grid'
                ? 'bg-secondary text-secondary-foreground'
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
            title="Tampilan tabel"
            aria-label="Tampilan tabel"
            aria-pressed={viewMode === 'list'}
            className={cn(
              'size-8',
              viewMode === 'list'
                ? 'bg-secondary text-secondary-foreground'
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
