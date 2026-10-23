import Link from 'next/link'
import { Cpu } from 'lucide-react'
import { SangatBorosListStatus, SangatBorosPriorityItem } from '@/lib/types'
import { Badge } from '@/components/ui/badge'
import { buttonVariants } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { cn } from '@/lib/utils'

interface SangatBorosPriorityProps {
  items: SangatBorosPriorityItem[]
  status: SangatBorosListStatus
}

function formatKwh(value: number) {
  return value.toLocaleString('id-ID', { maximumFractionDigits: 0 })
}

function formatDate(iso: string) {
  if (!iso) return '-'
  const d = new Date(iso)
  if (isNaN(d.getTime())) return '-'
  return d.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'Asia/Jakarta',
  })
}

export function SangatBorosPriority({ items, status }: SangatBorosPriorityProps) {
  const installedCount = items.filter((i) => i.isInstalled).length

  return (
    <section aria-labelledby="sangat-boros-heading" className="flex flex-col gap-3">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 id="sangat-boros-heading" className="text-base font-semibold text-foreground">
            Prioritas Pasang IoT
          </h2>
          <p className="max-w-2xl text-sm text-muted-foreground">
            Toko boros dengan selisih terbesar antara rata-rata tagihan PLN dan standar
            konsumsi energi, dari kalkulasi terbaru di SPARTA Energy.
          </p>
        </div>
        {status === 'ok' && items.length > 0 && (
          <p className="text-sm text-muted-foreground">
            <span className="font-semibold text-foreground">{installedCount}</span> dari{' '}
            {items.length} toko sudah terpasang alat
          </p>
        )}
      </div>

      {status !== 'ok' || items.length === 0 ? (
        <div className="rounded-xl border border-dashed px-4 py-8 text-center text-sm text-muted-foreground">
          {status === 'missing'
            ? 'Daftar prioritas dari SPARTA Energy belum tersedia.'
            : status === 'error'
              ? 'Daftar prioritas gagal dimuat. Coba muat ulang halaman.'
              : 'Belum ada toko berstatus boros di kalkulasi SPARTA Energy.'}
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12 text-center">#</TableHead>
              <TableHead>Toko</TableHead>
              <TableHead className="text-right">Selisih</TableHead>
              <TableHead className="text-right">Tagihan PLN / bln</TableHead>
              <TableHead className="text-right">Standar / bln</TableHead>
              <TableHead>Alat IoT</TableHead>
              <TableHead>Validasi</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item) => {
              const href = `/monitoring/${encodeURIComponent(item.storeCode)}`
              return (
                <TableRow key={item.auditId}>
                  <TableCell className="text-center font-semibold tabular-nums text-foreground">
                    {item.rank}
                  </TableCell>

                  <TableCell>
                    <div className="flex flex-col gap-0.5">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <Link
                          href={href}
                          className="font-semibold text-foreground transition-colors hover:text-emerald-600 dark:hover:text-emerald-400"
                        >
                          {item.storeName}
                        </Link>
                        {item.isDemo && (
                          <Badge
                            variant="outline"
                            className="border-amber-500/40 text-amber-700 dark:text-amber-400"
                          >
                            Uji coba
                          </Badge>
                        )}
                      </div>
                      <span className="text-xs text-muted-foreground">
                        <span className="font-mono">{item.storeCode}</span> · {item.branch}
                      </span>
                    </div>
                  </TableCell>

                  <TableCell className="text-right">
                    <span className="font-semibold tabular-nums text-rose-700 dark:text-rose-400">
                      +{item.gapPercent.toLocaleString('id-ID', { maximumFractionDigits: 1 })}%
                    </span>
                  </TableCell>

                  <TableCell className="text-right tabular-nums text-foreground">
                    {formatKwh(item.actualPlnKwhPerMonth)}{' '}
                    <span className="text-xs text-muted-foreground">kWh</span>
                  </TableCell>

                  <TableCell className="text-right tabular-nums text-foreground">
                    {formatKwh(item.standardKwhPerMonth)}{' '}
                    <span className="text-xs text-muted-foreground">kWh</span>
                  </TableCell>

                  <TableCell>
                    {item.isInstalled ? (
                      <span className="inline-flex items-center gap-1.5 text-sm font-medium text-emerald-700 dark:text-emerald-400">
                        <Cpu className="size-3.5" />
                        Terpasang ({item.deviceCount})
                      </span>
                    ) : (
                      <span className="text-sm text-muted-foreground">Belum terpasang</span>
                    )}
                  </TableCell>

                  <TableCell>
                    <div className="flex flex-col items-start gap-0.5">
                      {item.validationStatus === 'VALIDATED' ? (
                        <Badge
                          variant="outline"
                          className="border-emerald-500/40 text-emerald-700 dark:text-emerald-400"
                        >
                          Sudah divalidasi
                        </Badge>
                      ) : (
                        <Badge
                          variant="outline"
                          className="border-amber-500/40 text-amber-700 dark:text-amber-400"
                        >
                          Menunggu validasi
                        </Badge>
                      )}
                      <span className="text-xs text-muted-foreground">
                        {formatDate(item.calculatedAt)}
                      </span>
                    </div>
                  </TableCell>

                  <TableCell className="text-right">
                    <Link
                      href={href}
                      className={cn(
                        buttonVariants({ variant: 'outline', size: 'sm' }),
                        'h-11 text-xs font-medium sm:h-8'
                      )}
                    >
                      Detail
                    </Link>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      )}
    </section>
  )
}
