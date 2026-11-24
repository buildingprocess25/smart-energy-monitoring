'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import type { RecordingSessionSummary } from '@/lib/types'
import { comparePhase, isExcludedPhase, normalizePhaseKey } from '@/lib/phase-keys'
import { Input } from '@/components/ui/input'
import { formatDuration } from '@/lib/format-duration'
import {
  STICKY_HEADER_CLASS,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

const DATE_OPTIONS: Intl.DateTimeFormatOptions = {
  timeZone: 'Asia/Jakarta',
  dateStyle: 'medium',
  timeStyle: 'short',
}

function formatEpoch(epoch: number) {
  return new Date(epoch).toLocaleString('id-ID', DATE_OPTIONS)
}

function sensorList(phases: string[]) {
  const keys = new Set<string>()
  for (const phase of phases) {
    if (!isExcludedPhase(phase)) keys.add(normalizePhaseKey(phase))
  }
  return [...keys].sort(comparePhase).join(', ')
}

export function SessionTable({ sessions }: { sessions: RecordingSessionSummary[] }) {
  const [query, setQuery] = useState('')

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase()
    if (!needle) return sessions
    return sessions.filter((s) =>
      [s.name, s.storeCode, s.storeName, s.deviceName].some((v) => v?.toLowerCase().includes(needle))
    )
  }, [sessions, query])

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <Input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Cari sesi, toko, atau perangkat"
          aria-label="Cari sesi rekaman"
          className="h-9 sm:max-w-sm"
        />
        <p aria-live="polite" className="text-sm text-muted-foreground">
          {visible.length === sessions.length
            ? `${sessions.length} sesi`
            : `${visible.length} dari ${sessions.length} sesi`}
        </p>
      </div>

      <Table
        scrollLabel="Daftar sesi rekaman"
        containerClassName="max-h-[max(24rem,calc(100dvh-15rem))] overflow-y-auto"
      >
        <TableHeader className={STICKY_HEADER_CLASS}>
          <TableRow className="hover:bg-transparent">
            <TableHead>Sesi</TableHead>
            <TableHead className="max-sm:hidden">Toko</TableHead>
            <TableHead className="max-sm:hidden">Waktu rekam</TableHead>
            <TableHead className="text-right max-md:hidden">Record</TableHead>
            <TableHead className="max-lg:hidden">Sensor</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {visible.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="py-12 text-center whitespace-normal text-muted-foreground">
                {sessions.length === 0
                  ? 'Belum ada sesi rekaman dari perangkat yang boleh Anda lihat.'
                  : 'Tidak ada sesi yang cocok. Coba kata lain atau kosongkan pencarian.'}
              </TableCell>
            </TableRow>
          ) : (
            visible.map((s) => {
              const sensors = sensorList(s.phases) || '-'
              return (
                <TableRow key={`${s.deviceId}-${s.id}`}>
                  <TableCell className="max-w-64 py-3 max-sm:max-w-0 max-sm:w-full">
                    <span title={s.name} className="block truncate font-medium text-foreground">
                      {s.name}
                    </span>
                    <span className="block truncate text-xs text-muted-foreground max-sm:hidden">{s.deviceId}</span>
                    <span className="block truncate text-xs text-muted-foreground sm:hidden">
                      {s.storeId ? (
                        <Link
                          href={`/monitoring/${encodeURIComponent(s.storeCode ?? s.storeId)}`}
                          className="text-primary underline underline-offset-4"
                        >
                          {s.storeName}
                        </Link>
                      ) : (
                        (s.storeName ?? s.storeCode ?? 'Toko tidak tercatat')
                      )}
                      , {s.deviceId}
                    </span>
                    <span className="block truncate text-xs text-muted-foreground sm:hidden">
                      {formatEpoch(s.startEpoch)}, {formatDuration(s.endEpoch - s.startEpoch)}
                    </span>
                  </TableCell>
                  <TableCell className="max-w-56 py-3 max-sm:hidden">
                    {s.storeId ? (
                      <Link
                        href={`/monitoring/${encodeURIComponent(s.storeCode ?? s.storeId)}`}
                        className="block truncate rounded-sm underline-offset-4 outline-none hover:text-primary hover:underline focus-visible:ring-[3px] focus-visible:ring-ring/50"
                      >
                        {s.storeName}
                      </Link>
                    ) : (
                      <span className="block truncate">{s.storeName ?? s.storeCode ?? '-'}</span>
                    )}
                    <span className="block text-xs text-muted-foreground">
                      {s.storeCode ?? 'Toko tidak tercatat'}
                    </span>
                  </TableCell>
                  <TableCell className="py-3 max-sm:hidden">
                    <span className="block tabular-nums">{formatEpoch(s.startEpoch)}</span>
                    <span className="block text-xs text-muted-foreground">
                      {formatDuration(s.endEpoch - s.startEpoch)}, sampai {formatEpoch(s.endEpoch)}
                    </span>
                  </TableCell>
                  <TableCell className="py-3 text-right tabular-nums max-md:hidden">
                    {s.recordCount.toLocaleString('id-ID')}
                  </TableCell>
                  <TableCell className="max-w-48 py-3 max-lg:hidden">
                    <span title={sensors} className="block truncate text-muted-foreground">
                      {sensors}
                    </span>
                  </TableCell>
                </TableRow>
              )
            })
          )}
        </TableBody>
      </Table>
    </div>
  )
}
