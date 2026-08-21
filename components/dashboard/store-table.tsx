import Link from 'next/link'
import { ArrowRight, Zap, Clock, Cpu } from 'lucide-react'
import { Store } from '@/lib/types'
import { StatusBadge } from './status-badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface StoreTableProps {
  stores: Store[]
}

function formatRelativeTime(isoString: string) {
  if (!isoString) return '-'
  const date = new Date(isoString)
  if (isNaN(date.getTime())) {
    return isoString
  }
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  if (diffMs < 0) return 'Baru saja'
  const diffMins = Math.floor(diffMs / 60000)

  if (diffMins < 1) return 'Baru saja'
  if (diffMins < 60) return `${diffMins} mnt lalu`
  if (diffMins < 1440) return `${Math.floor(diffMins / 60)} jam lalu`
  return `${Math.floor(diffMins / 1440)} hari lalu`
}

export function StoreTable({ stores }: StoreTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Kode</TableHead>
          <TableHead>Nama Toko</TableHead>
          <TableHead>Cabang</TableHead>
          <TableHead>Status IoT</TableHead>
          <TableHead className="text-right">Total Energi</TableHead>
          <TableHead className="text-center">Perangkat</TableHead>
          <TableHead>Update Terakhir</TableHead>
          <TableHead className="text-right">Aksi</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {stores.map((store) => {
          const isUnassigned = store.status === 'unassigned'
          const href = !isUnassigned ? `/monitoring/${store.id}` : '#'

          return (
            <TableRow key={store.id} className="group">
              {/* Kode Toko */}
              <TableCell>
                <span className="rounded bg-muted px-2 py-1 font-mono text-xs font-bold text-muted-foreground">
                  {store.code}
                </span>
              </TableCell>

              {/* Nama Toko */}
              <TableCell className="font-semibold text-foreground">
                <Link
                  href={href}
                  className="transition-colors hover:text-emerald-600 dark:hover:text-emerald-400"
                >
                  {store.name}
                </Link>
              </TableCell>

              {/* Cabang */}
              <TableCell>
                <span className="rounded-md border border-border/60 bg-muted/40 px-2 py-0.5 text-xs text-muted-foreground">
                  {store.branch}
                </span>
              </TableCell>

              {/* Status */}
              <TableCell>
                <StatusBadge status={store.status} />
              </TableCell>

              {/* Total Energi */}
              <TableCell className="text-right font-medium">
                {!isUnassigned ? (
                  <span className="flex items-center justify-end gap-1 font-semibold text-foreground">
                    <Zap className="size-3.5 text-emerald-600 dark:text-emerald-400" />
                    {store.kwhTotal.toLocaleString('id-ID')}
                    <span className="text-xs font-normal text-muted-foreground">
                      kWh
                    </span>
                  </span>
                ) : (
                  <span className="text-xs text-muted-foreground">-</span>
                )}
              </TableCell>

              {/* Perangkat */}
              <TableCell className="text-center">
                {!isUnassigned ? (
                  <span className="inline-flex items-center gap-1 font-semibold text-foreground">
                    <Cpu className="size-3.5 text-blue-600 dark:text-blue-400" />
                    {store.deviceCount}
                  </span>
                ) : (
                  <span className="text-xs text-muted-foreground">-</span>
                )}
              </TableCell>

              {/* Update Terakhir */}
              <TableCell>
                <span
                  suppressHydrationWarning
                  className="flex items-center gap-1 text-xs text-muted-foreground"
                >
                  <Clock className="size-3 text-muted-foreground/70" />
                  {formatRelativeTime(store.lastUpdate)}
                </span>
              </TableCell>

              {/* Aksi */}
              <TableCell className="text-right">
                {!isUnassigned ? (
                  <Link
                    href={href}
                    className={cn(
                      buttonVariants({ variant: 'outline', size: 'sm' }),
                      'h-8 gap-1.5 text-xs font-medium border-emerald-500/30 hover:bg-emerald-500/10 hover:text-emerald-700 dark:hover:text-emerald-300'
                    )}
                  >
                    Detail
                    <ArrowRight className="size-3 transition-transform group-hover:translate-x-0.5" />
                  </Link>
                ) : (
                  <span className="text-xs italic text-muted-foreground">
                    Belum Terhubung
                  </span>
                )}
              </TableCell>
            </TableRow>
          )
        })}
      </TableBody>
    </Table>
  )
}
