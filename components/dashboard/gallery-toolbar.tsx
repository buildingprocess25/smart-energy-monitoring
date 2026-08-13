import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { StoreStatus } from '@/lib/types'

interface GalleryToolbarProps {
  search: string
  onSearch: (value: string) => void
  statusFilter: StoreStatus | 'all'
  onStatusFilter: (value: StoreStatus | 'all') => void
}

export function GalleryToolbar({
  search,
  onSearch,
  statusFilter,
  onStatusFilter,
}: GalleryToolbarProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="relative max-w-sm flex-1">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Cari toko (ID, Nama, Alamat)..."
          className="pl-9"
          value={search}
          onChange={(e) => onSearch(e.target.value)}
        />
      </div>

      <Select
        value={statusFilter}
        onValueChange={(val) => onStatusFilter(val as StoreStatus | 'all')}
      >
        <SelectTrigger className="w-full sm:w-[200px]">
          <SelectValue placeholder="Semua Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Semua Status</SelectItem>
          <SelectItem value="live">Live Audit</SelectItem>
          <SelectItem value="historical">Historical</SelectItem>
          <SelectItem value="unassigned">Unassigned</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}
