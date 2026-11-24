'use client'

import { ArrowLeft, ArrowRight, Trash2 } from 'lucide-react'
import { Check, Field, SelectField, type Choice } from '@/components/form-controls'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { REPORT_COLUMNS, REPORT_TYPES, usesDates, type ReportType } from '@/lib/reports'
import { PERIODS, type Period, type SheetSpec } from '@/lib/workbook'

export function newSheet(type: ReportType): SheetSpec {
  return {
    name: REPORT_TYPES[type],
    type,
    stores: [],
    columns: REPORT_COLUMNS[type],
    source: 'all',
    sortBy: null,
    sortDesc: false,
    total: false,
    period: null,
  }
}

const FOLLOW = 'ikut'
const PERIOD_CHOICES: Choice[] = [
  { value: FOLLOW, label: 'Ikut periode file' },
  ...(Object.keys(PERIODS) as Period[]).filter((p) => p !== 'custom').map((p) => ({ value: p, label: PERIODS[p] })),
]

export const PRESSED = 'h-9 aria-pressed:border-primary aria-pressed:bg-primary aria-pressed:text-primary-foreground'

export function SheetInspector({
  sheet,
  index,
  count,
  types,
  stores,
  onChange,
  onMove,
  onRemove,
}: {
  sheet: SheetSpec
  index: number
  count: number
  types: ReportType[]
  stores: Choice[]
  onChange: (sheet: SheetSpec) => void
  onMove: (to: number) => void
  onRemove: () => void
}) {
  const all = REPORT_COLUMNS[sheet.type]
  const set = (change: Partial<SheetSpec>) => onChange({ ...sheet, ...change })
  const canTotal = all.some((c) => c === 'Energi (kWh)' || c === 'Biaya (Rp)' || c === 'Record')

  return (
    <aside aria-label="Pengaturan sheet" className="flex min-w-0 flex-col gap-5">
      <div className="flex flex-col gap-3">
        <Field label="Nama sheet">
          <Input required maxLength={31} value={sheet.name} onChange={(e) => set({ name: e.target.value })} />
        </Field>
        <SelectField
          label="Isi"
          value={sheet.type}
          choices={types.map((t) => ({ value: t, label: REPORT_TYPES[t] }))}
          onChange={(value) => {
            const type = value as ReportType
            const renamed = sheet.name !== REPORT_TYPES[sheet.type]
            onChange({
              ...newSheet(type),
              stores: sheet.stores,
              period: usesDates(type) ? sheet.period : null,
              name: renamed ? sheet.name : REPORT_TYPES[type],
            })
          }}
        />
        {usesDates(sheet.type) && (
          <SelectField
            label="Periode"
            value={sheet.period ?? FOLLOW}
            choices={PERIOD_CHOICES}
            onChange={(value) => set({ period: value === FOLLOW ? null : (value as SheetSpec['period']) })}
          />
        )}
      </div>

      {all.includes('Sumber') && (
        <div className="flex flex-col gap-2 border-t pt-5">
          <p className="text-sm leading-none font-medium">Sumber</p>
          <ToggleGroup
            aria-label="Sumber"
            variant="outline"
            spacing={0}
            value={[sheet.source]}
            onValueChange={(value) => value[0] && set({ source: value[0] as SheetSpec['source'] })}
          >
            <ToggleGroupItem value="all" className={PRESSED}>
              Semua
            </ToggleGroupItem>
            <ToggleGroupItem value="main" className={PRESSED}>
              Panel utama
            </ToggleGroupItem>
            <ToggleGroupItem value="sensor" className={PRESSED}>
              Sensor
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
      )}

      <fieldset className="flex min-w-0 flex-col border-t pt-4">
        <legend className="sr-only">Toko</legend>
        <p aria-hidden="true" className="text-sm font-medium">
          Toko
        </p>
        <div className="flex max-h-48 flex-col overflow-y-auto">
          <Check label="Semua toko" checked={sheet.stores.length === 0} onChange={() => set({ stores: [] })} />
          {stores.map((s) => (
            <Check
              key={s.value}
              label={s.label}
              checked={sheet.stores.includes(s.value)}
              onChange={(on) => set({ stores: on ? [...sheet.stores, s.value] : sheet.stores.filter((v) => v !== s.value) })}
            />
          ))}
        </div>
      </fieldset>

      <fieldset className="flex min-w-0 flex-col border-t pt-4">
        <legend className="sr-only">Kolom</legend>
        <p aria-hidden="true" className="text-sm font-medium">
          Kolom
        </p>
        <p className="text-xs text-muted-foreground">Klik judul kolom di lembar untuk menggeser atau mengurutkan.</p>
        <div className="flex max-h-64 flex-col overflow-y-auto">
          {all.map((column) => {
            const on = sheet.columns.includes(column)
            return (
              <Check
                key={column}
                label={column}
                checked={on}
                disabled={on && sheet.columns.length === 1}
                onChange={(next) => set({ columns: next ? [...sheet.columns, column] : sheet.columns.filter((c) => c !== column) })}
              />
            )
          })}
        </div>
        {canTotal && (
          <Label className="mt-3 min-h-10 justify-between border-t pt-3">
            Baris total
            <Switch checked={sheet.total} onCheckedChange={(total) => set({ total })} />
          </Label>
        )}
      </fieldset>

      <div className="flex items-center justify-between gap-2 border-t pt-4">
        <div className="flex gap-2">
          <Button type="button" variant="outline" size="icon-sm" aria-label="Geser sheet ke kiri" disabled={index === 0} onClick={() => onMove(index - 1)}>
            <ArrowLeft aria-hidden="true" />
          </Button>
          <Button type="button" variant="outline" size="icon-sm" aria-label="Geser sheet ke kanan" disabled={index === count - 1} onClick={() => onMove(index + 1)}>
            <ArrowRight aria-hidden="true" />
          </Button>
        </div>
        <Button type="button" variant="ghost" size="sm" disabled={count === 1} onClick={onRemove}>
          <Trash2 data-icon="inline-start" aria-hidden="true" />
          Hapus Sheet
        </Button>
      </div>
    </aside>
  )
}
