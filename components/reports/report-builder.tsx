'use client'

import { useState } from 'react'
import { REPORT_TYPES, toCsv, usesDates, type ReportTable, type ReportType } from '@/lib/reports'
import { buildXlsx } from '@/lib/xlsx'
import { downloadFile } from '@/lib/download'
import { Field, SelectField } from '@/components/form-controls'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  STICKY_HEADER_CLASS,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

interface StoreChoice {
  value: string
  label: string
}

interface Loaded {
  table: ReportTable
  store: string
  storeCode: string
  range: string
}

export function ReportBuilder({
  stores,
  canCompare,
  defaultFrom,
  today,
  initial,
}: {
  stores: StoreChoice[]
  canCompare: boolean
  defaultFrom: string
  today: string
  initial: ReportTable | null
}) {
  const [type, setType] = useState<ReportType>('daily')
  const [store, setStore] = useState('all')
  const [from, setFrom] = useState(defaultFrom)
  const [to, setTo] = useState(today)
  const [loaded, setLoaded] = useState<Loaded | null>(
    initial && { table: initial, store: 'Semua toko', storeCode: 'all', range: `${defaultFrom} sampai ${today}` }
  )
  const [pending, setPending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const types = (Object.keys(REPORT_TYPES) as ReportType[]).filter((t) => canCompare || t !== 'sangatBoros')

  async function load() {
    setPending(true)
    setError(null)
    try {
      const res = await fetch(`/api/reports?${new URLSearchParams({ type, store, from, to })}`, { cache: 'no-store' })
      const data = (await res.json().catch(() => null)) as (ReportTable & { error?: string }) | null
      if (!res.ok || !data) throw new Error(data?.error ?? 'Laporan gagal dibuat.')
      setLoaded({
        table: data,
        store: stores.find((s) => s.value === store)?.label ?? 'Semua toko',
        storeCode: store,
        range: usesDates(type) ? `${from} sampai ${to}` : `per ${today}`,
      })
    } catch (e) {
      setLoaded(null)
      setError(e instanceof TypeError ? 'Server tidak bisa dihubungi. Coba lagi.' : (e as Error).message)
    } finally {
      setPending(false)
    }
  }

  function fileName(extension: string) {
    const parts = [loaded?.table.title, loaded?.storeCode === 'all' ? 'semua toko' : loaded?.storeCode, loaded?.range]
    return `${parts.join(' ').toLowerCase().replace(/\s+/g, '-')}.${extension}`
  }

  function downloadExcel({ table, store: storeLabel, range }: Loaded) {
    const head = [[table.title], ['Toko', storeLabel], ['Tanggal', range], ...(table.note ? [[table.note]] : []), []]
    downloadFile(
      buildXlsx([{ name: table.title, rows: [...head, table.columns, ...table.rows] }]),
      fileName('xlsx')
    )
  }

  const table = loaded?.table

  return (
    <div className="flex flex-col gap-6">
      <form
        className="grid grid-cols-1 gap-3 rounded-2xl bg-card p-4 ring-1 ring-foreground/10 sm:grid-cols-2 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1.5fr)_minmax(0,1fr)_minmax(0,1fr)_auto] lg:items-end print:hidden"
        onSubmit={(e) => {
          e.preventDefault()
          load()
        }}
      >
        <SelectField
          label="Laporan"
          value={type}
          choices={types.map((t) => ({ value: t, label: REPORT_TYPES[t] }))}
          onChange={(value) => setType(value as ReportType)}
        />
        <SelectField label="Toko" value={store} choices={[{ value: 'all', label: 'Semua toko' }, ...stores]} onChange={setStore} />
        <Field label="Dari tanggal">
          <Input type="date" required max={to} disabled={!usesDates(type)} value={from} onChange={(e) => setFrom(e.target.value)} />
        </Field>
        <Field label="Sampai tanggal">
          <Input type="date" required min={from} max={today} disabled={!usesDates(type)} value={to} onChange={(e) => setTo(e.target.value)} />
        </Field>
        <Button type="submit" className="h-9" disabled={pending}>
          {pending ? 'Menyiapkan' : 'Tampilkan'}
        </Button>
      </form>

      {error && (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      )}

      {!loaded && !error && (
        <p className="rounded-2xl border border-dashed px-4 py-12 text-center text-sm text-muted-foreground print:hidden">
          Belum ada laporan. Atur pilihan di atas, lalu tekan Tampilkan.
        </p>
      )}

      {loaded && table && (
        <section aria-labelledby="report-title" className="flex min-w-0 flex-col gap-3">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div className="min-w-0">
              <h2 id="report-title" className="text-lg font-semibold">
                {table.title}
              </h2>
              <p aria-live="polite" className="text-sm text-muted-foreground">
                {loaded.store}, {loaded.range}, {table.rows.length.toLocaleString('id-ID')} baris
              </p>
            </div>
            {table.rows.length > 0 && (
              <div className="flex flex-wrap gap-2 print:hidden">
                <Button variant="outline" onClick={() => downloadExcel(loaded)}>
                  Unduh Excel
                </Button>
                <Button variant="outline" onClick={() => downloadFile(toCsv(table), fileName('csv'), 'text/csv;charset=utf-8')}>
                  Unduh CSV
                </Button>
                <Button variant="outline" onClick={() => window.print()}>
                  Cetak atau PDF
                </Button>
              </div>
            )}
          </div>
          <Table
            scrollLabel={table.title}
            containerClassName="max-h-[max(24rem,calc(100dvh-20rem))] overflow-y-auto print:max-h-none print:overflow-visible print:rounded-none print:ring-0"
            className="print:text-xs"
          >
            <TableHeader className={`${STICKY_HEADER_CLASS} print:static`}>
              <TableRow className="hover:bg-transparent">
                {table.columns.map((column, i) => (
                  <TableHead
                    key={column}
                    className={`print:h-auto print:px-1 print:py-1 print:whitespace-normal ${isNumeric(table, i) ? 'text-right' : ''}`}
                  >
                    {column}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {table.rows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={table.columns.length} className="py-12 text-center whitespace-normal text-muted-foreground">
                    Tidak ada data untuk pilihan ini. Coba tanggal atau toko lain.
                  </TableCell>
                </TableRow>
              ) : (
                table.rows.map((row, r) => (
                  <TableRow key={r} className="break-inside-avoid">
                    {row.map((cell, c) => (
                      <TableCell
                        key={c}
                        className={`py-2.5 tabular-nums print:px-1 print:py-1 print:text-xs print:whitespace-normal ${isNumeric(table, c) ? 'text-right' : ''}`}
                      >
                        {cell === null ? '-' : typeof cell === 'number' ? cell.toLocaleString('id-ID') : cell}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
          {table.note && <p className="text-xs text-muted-foreground">{table.note}</p>}
        </section>
      )}
    </div>
  )
}

function isNumeric(table: ReportTable, column: number): boolean {
  return table.rows.some((row) => typeof row[column] === 'number')
}
