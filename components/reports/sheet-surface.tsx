'use client'

import { useEffect, useState } from 'react'
import { ArrowDownAZ, ArrowDownZA, ArrowLeft, ArrowRight, ChevronDown, EyeOff, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import { MAX_SHEETS, type PreviewRow, type SheetSpec, type WorkbookSpec } from '@/lib/workbook'
import { columnName, type CellValue } from '@/lib/xlsx'

interface Preview {
  rows: PreviewRow[]
  hidden: number
}

const PREVIEW_DELAY_MS = 350

// The preview of one sheet, reloaded after the settings settle. The last one stays while the next loads.
function usePreview(workbook: WorkbookSpec, sheet: SheetSpec) {
  const { period, from, to } = workbook
  const body = JSON.stringify({ name: 'Pratinjau', period, from, to, sheets: [{ ...sheet, name: sheet.name.trim() || 'Sheet' }] })
  const [result, setResult] = useState<{ body: string; preview: Preview | null; error: string | null } | null>(null)

  useEffect(() => {
    const controller = new AbortController()
    const timer = setTimeout(async () => {
      try {
        const res = await fetch('/api/reports/preview', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body,
          signal: controller.signal,
        })
        const data = (await res.json().catch(() => null)) as (Preview & { error?: string }) | null
        if (!res.ok || !data) setResult({ body, preview: null, error: data?.error ?? 'Pratinjau gagal dimuat.' })
        else setResult({ body, preview: data, error: null })
      } catch {
        if (!controller.signal.aborted) setResult({ body, preview: null, error: 'Server tidak bisa dihubungi.' })
      }
    }, PREVIEW_DELAY_MS)
    return () => {
      clearTimeout(timer)
      controller.abort()
    }
  }, [body])

  return { preview: result?.preview ?? null, error: result?.error ?? null, loading: result?.body !== body }
}

function cellText(value: CellValue | undefined): string {
  if (value === null || value === undefined) return ''
  return typeof value === 'number' ? value.toLocaleString('id-ID') : value
}

function ColumnMenu({ sheet, column, onChange }: { sheet: SheetSpec; column: string; onChange: (sheet: SheetSpec) => void }) {
  const index = sheet.columns.indexOf(column)
  const sorted = sheet.sortBy === column

  function shift(by: number) {
    const columns = [...sheet.columns]
    columns.splice(index + by, 0, ...columns.splice(index, 1))
    onChange({ ...sheet, columns })
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <button
            type="button"
            className="flex min-h-9 w-full items-center justify-between gap-2 px-2.5 text-left font-semibold whitespace-nowrap outline-none underline-offset-4 hover:underline focus-visible:ring-2 focus-visible:ring-primary-foreground focus-visible:ring-inset"
          />
        }
      >
        {column}
        {sorted ? (
          sheet.sortDesc ? (
            <ArrowDownZA aria-label="diurutkan besar ke kecil" className="size-3.5 shrink-0" />
          ) : (
            <ArrowDownAZ aria-label="diurutkan kecil ke besar" className="size-3.5 shrink-0" />
          )
        ) : (
          <ChevronDown aria-hidden="true" className="size-3.5 shrink-0" />
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-52">
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => onChange({ ...sheet, sortBy: column, sortDesc: false })}>
            <ArrowDownAZ aria-hidden="true" />
            Kecil ke besar
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onChange({ ...sheet, sortBy: column, sortDesc: true })}>
            <ArrowDownZA aria-hidden="true" />
            Besar ke kecil
          </DropdownMenuItem>
          {sorted && (
            <DropdownMenuItem onClick={() => onChange({ ...sheet, sortBy: null, sortDesc: false })}>Hapus urutan</DropdownMenuItem>
          )}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem disabled={index === 0} onClick={() => shift(-1)}>
            <ArrowLeft aria-hidden="true" />
            Geser ke kiri
          </DropdownMenuItem>
          <DropdownMenuItem disabled={index === sheet.columns.length - 1} onClick={() => shift(1)}>
            <ArrowRight aria-hidden="true" />
            Geser ke kanan
          </DropdownMenuItem>
          <DropdownMenuItem
            disabled={sheet.columns.length === 1}
            onClick={() => onChange({ ...sheet, columns: sheet.columns.filter((c) => c !== column) })}
          >
            <EyeOff aria-hidden="true" />
            Sembunyikan kolom
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

const GUTTER = 'sticky left-0 z-10 w-10 min-w-10 border-r bg-muted px-1 text-center font-normal text-muted-foreground tabular-nums'

function SheetGrid({ sheet, preview, onChange }: { sheet: SheetSpec; preview: Preview; onChange: (sheet: SheetSpec) => void }) {
  const { columns } = sheet
  // The preview may still show the previous columns until the next one arrives.
  const shown = (preview.rows.find((r) => r.kind === 'header')?.cells ?? []).map(String)
  const at = columns.map((c) => shown.indexOf(c))
  const numeric = at.map((i) => i >= 0 && preview.rows.some((r) => r.kind === 'body' && typeof r.cells[i] === 'number'))
  const empty = !preview.rows.some((r) => r.kind === 'body')

  return (
    <table className="w-full border-collapse text-sm">
      <thead>
        <tr aria-hidden="true" className="h-6 border-b bg-muted text-xs text-muted-foreground">
          <td className={GUTTER} />
          {columns.map((c, i) => (
            <td key={c} className="border-r text-center">
              {columnName(i)}
            </td>
          ))}
          <td className="w-full" />
        </tr>
      </thead>
      <tbody>
        {preview.rows.map((row) => {
          const gutter = (
            <td aria-hidden="true" className={cn(GUTTER, 'text-xs')}>
              {row.number}
            </td>
          )
          if (row.kind === 'title' || row.kind === 'meta') {
            return (
              <tr key={row.number} className="border-b">
                {gutter}
                <td
                  colSpan={columns.length + 1}
                  className={cn('px-2.5 py-1.5', row.kind === 'title' ? 'text-base font-semibold text-foreground' : 'text-muted-foreground')}
                >
                  <span className="line-clamp-2 max-w-[75ch]">{row.kind === 'title' ? sheet.name : cellText(row.cells[0]) || '\u00a0'}</span>
                </td>
              </tr>
            )
          }
          if (row.kind === 'header') {
            return (
              <tr key={row.number} className="border-b bg-primary text-primary-foreground">
                {gutter}
                {columns.map((c) => (
                  <th key={c} scope="col" className="border-r border-primary-foreground/25 p-0">
                    <ColumnMenu sheet={sheet} column={c} onChange={onChange} />
                  </th>
                ))}
                <td />
              </tr>
            )
          }
          const total = row.kind === 'total'
          return (
            <tr key={row.number} className={cn('border-b', total && 'bg-muted font-semibold')}>
              {gutter}
              {columns.map((c, i) => (
                <td key={c} className={cn('border-r px-2.5 py-1.5 whitespace-nowrap', numeric[i] && 'text-right tabular-nums')}>
                  {cellText(row.cells[at[i]])}
                </td>
              ))}
              <td />
            </tr>
          )
        })}
        {(empty || preview.hidden > 0) && (
          <tr>
            <td aria-hidden="true" className={GUTTER} />
            <td colSpan={columns.length + 1} className="px-2.5 py-2.5 text-muted-foreground">
              {empty
                ? 'Tidak ada data untuk periode dan toko ini.'
                : `${preview.hidden.toLocaleString('id-ID')} baris lagi di file lengkap`}
            </td>
          </tr>
        )}
      </tbody>
    </table>
  )
}

export function SheetSurface({
  workbook,
  active,
  onActive,
  onChange,
  onAdd,
}: {
  workbook: WorkbookSpec
  active: number
  onActive: (index: number) => void
  onChange: (sheet: SheetSpec) => void
  onAdd: () => void
}) {
  const sheet = workbook.sheets[active]
  const { preview, error, loading } = usePreview(workbook, sheet)

  return (
    <section aria-label="Lembar kerja" className="flex min-w-0 flex-col overflow-hidden rounded-xl bg-card ring-1 ring-foreground/10 lg:sticky lg:top-20 lg:self-start">
      <div
        role="region"
        aria-label={`Pratinjau ${sheet.name}`}
        aria-busy={loading}
        tabIndex={0}
        className="h-[26rem] overflow-auto outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:ring-inset lg:h-[max(28rem,calc(100dvh-9.5rem))]"
      >
        {error && !loading ? (
          <p role="alert" className="p-4 text-sm text-destructive">
            {error}
          </p>
        ) : preview ? (
          <SheetGrid sheet={sheet} preview={preview} onChange={onChange} />
        ) : (
          <div className="flex flex-col gap-2 p-4">
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-8 w-full" />
            ))}
          </div>
        )}
      </div>
      <div className="flex min-w-0 items-center gap-1 border-t bg-muted px-2">
        <div role="tablist" aria-label="Sheet" className="flex min-w-0 overflow-x-auto">
          {workbook.sheets.map((s, i) => (
            <button
              key={i}
              type="button"
              role="tab"
              aria-selected={i === active}
              tabIndex={i === active ? 0 : -1}
              onClick={() => onActive(i)}
              onKeyDown={(e) => {
                const next = e.key === 'ArrowRight' ? i + 1 : e.key === 'ArrowLeft' ? i - 1 : -1
                if (next < 0 || next >= workbook.sheets.length) return
                onActive(next)
                ;(e.currentTarget.parentElement?.children[next] as HTMLElement | undefined)?.focus()
              }}
              className={cn(
                'h-11 max-w-44 shrink-0 truncate border-x px-3.5 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset',
                i === active
                  ? 'border-border bg-card font-semibold text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              )}
            >
              {s.name || `Sheet ${i + 1}`}
            </button>
          ))}
        </div>
        <Button type="button" variant="ghost" size="icon-sm" aria-label="Tambah sheet" disabled={workbook.sheets.length >= MAX_SHEETS} onClick={onAdd}>
          <Plus aria-hidden="true" />
        </Button>
        <span aria-live="polite" className="ml-auto shrink-0 pl-2 text-xs text-muted-foreground max-sm:sr-only">
          {loading ? 'Memuat data' : 'Data terbaru'}
        </span>
      </div>
    </section>
  )
}
