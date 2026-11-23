'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import type { RecordingSessionSummary } from '@/lib/types'
import { comparePhase, isExcludedPhase, normalizePhaseKey } from '@/lib/phase-keys'
import { Input } from '@/components/ui/input'
import {
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
      <Input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Cari sesi, kode toko, nama toko, atau perangkat"
        aria-label="Cari sesi rekaman"
        className="sm:max-w-sm"
      />
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nama sesi</TableHead>
            <TableHead>Toko</TableHead>
            <TableHead>Perangkat</TableHead>
            <TableHead>Mulai</TableHead>
            <TableHead>Selesai</TableHead>
            <TableHead className="text-right">Jumlah record</TableHead>
            <TableHead>Sensor</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {visible.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center text-muted-foreground">
                {sessions.length === 0 ? 'Belum ada sesi rekaman' : 'Tidak ada sesi yang cocok'}
              </TableCell>
            </TableRow>
          ) : (
            visible.map((s) => (
              <TableRow key={s.id}>
                <TableCell className="font-medium text-foreground">{s.name}</TableCell>
                <TableCell>
                  {s.storeId ? (
                    <Link
                      href={`/monitoring/${encodeURIComponent(s.storeId)}`}
                      className="transition-colors hover:text-emerald-600 dark:hover:text-emerald-400"
                    >
                      <span className="font-mono text-xs">{s.storeCode}</span> {s.storeName}
                    </Link>
                  ) : (
                    <span className="text-muted-foreground">Belum terhubung ke toko</span>
                  )}
                </TableCell>
                <TableCell>{s.deviceName}</TableCell>
                <TableCell>{formatEpoch(s.startEpoch)}</TableCell>
                <TableCell>{formatEpoch(s.endEpoch)}</TableCell>
                <TableCell className="text-right tabular-nums">
                  {s.recordCount.toLocaleString('id-ID')}
                </TableCell>
                <TableCell>{sensorList(s.phases)}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
