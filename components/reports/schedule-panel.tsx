'use client'

import Link from 'next/link'
import { FileSpreadsheet } from 'lucide-react'
import { Check, Field, SelectField, type Choice } from '@/components/form-controls'
import { buttonVariants } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import type { RecipientGroup, Subscriber } from '@/lib/mail-settings'
import { exportFileName } from '@/lib/session-export'
import { scheduleText, type DateRange, type TemplateSpec } from '@/lib/workbook'
import { AddressInput } from './address-input'
import { PRESSED } from './sheet-inspector'

const FREQUENCIES: Choice[] = [
  { value: 'daily', label: 'Setiap hari' },
  { value: 'weekly', label: 'Setiap minggu' },
  { value: 'monthly', label: 'Setiap bulan' },
]
const DAYS = [
  [1, 'Sen', 'Senin'],
  [2, 'Sel', 'Selasa'],
  [3, 'Rab', 'Rabu'],
  [4, 'Kam', 'Kamis'],
  [5, 'Jum', 'Jumat'],
  [6, 'Sab', 'Sabtu'],
  [0, 'Min', 'Minggu'],
] as const

const toggled = (list: string[], value: string, on: boolean) => (on ? [...list, value] : list.filter((v) => v !== value))

export function SchedulePanel({
  draft,
  onChange,
  subscribers,
  groups,
  domains,
  mailProblem,
  targets,
  range,
}: {
  draft: TemplateSpec
  onChange: (draft: TemplateSpec) => void
  subscribers: Subscriber[]
  groups: RecipientGroup[]
  domains: string[]
  mailProblem: string | null
  targets: number
  range: DateRange
}) {
  const { schedule } = draft
  const set = (change: Partial<TemplateSpec>) => onChange({ ...draft, ...change })
  const setSchedule = (change: Partial<TemplateSpec['schedule']>) => set({ schedule: { ...schedule, ...change } })
  const period = `${range.from} sampai ${range.to}`

  return (
    <div className="grid min-w-0 grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,26rem)]">
      <div className="flex min-w-0 flex-col gap-8">
        {mailProblem && (
          <div role="status" className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-warning/50 px-4 py-3 text-sm">
            <p className="text-warning">{mailProblem}</p>
            <Link href="/laporan/email" className={buttonVariants({ variant: 'outline', size: 'sm' })}>
              Atur Email
            </Link>
          </div>
        )}

        <section aria-labelledby="when-title" className="flex flex-col gap-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 id="when-title" className="text-base font-semibold">
                Waktu kirim
              </h2>
              <p className="text-sm text-muted-foreground">
                {schedule.enabled
                  ? schedule.frequency === 'weekly' && schedule.weekdays.length === 0
                    ? 'Pilih minimal satu hari.'
                    : `${scheduleText(schedule)}.`
                  : 'Jadwal mati. File hanya dikirim saat Anda menekan Kirim Sekarang.'}
              </p>
            </div>
            <Label className="min-h-10 shrink-0">
              <span className="sr-only">Kirim otomatis sesuai jadwal</span>
              <Switch checked={schedule.enabled} onCheckedChange={(enabled) => setSchedule({ enabled })} />
            </Label>
          </div>
          {schedule.enabled && (
            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <SelectField
                  label="Frekuensi"
                  value={schedule.frequency}
                  choices={FREQUENCIES}
                  onChange={(value) => setSchedule({ frequency: value as TemplateSpec['schedule']['frequency'] })}
                />
                {schedule.frequency === 'monthly' && (
                  <Field label="Tanggal (1 sampai 28)">
                    <Input
                      type="number"
                      min={1}
                      max={28}
                      required
                      value={schedule.monthDay || ''}
                      onChange={(e) => setSchedule({ monthDay: Number(e.target.value) })}
                    />
                  </Field>
                )}
                <Field label="Jam (WIB)">
                  <Input type="time" required value={schedule.time} onChange={(e) => setSchedule({ time: e.target.value })} />
                </Field>
              </div>
              {schedule.frequency === 'weekly' && (
                <ToggleGroup
                  aria-label="Hari kirim"
                  variant="outline"
                  multiple
                  className="flex-wrap"
                  value={schedule.weekdays.map(String)}
                  onValueChange={(value) => setSchedule({ weekdays: value.map(Number).sort() })}
                >
                  {DAYS.map(([day, short, name]) => (
                    <ToggleGroupItem key={day} value={String(day)} aria-label={name} className={`${PRESSED} min-w-12`}>
                      {short}
                    </ToggleGroupItem>
                  ))}
                </ToggleGroup>
              )}
            </div>
          )}
        </section>

        <section aria-labelledby="who-title" className="flex flex-col gap-4 border-t pt-6">
          <div>
            <h2 id="who-title" className="text-base font-semibold">
              Penerima
            </h2>
            <p className="text-sm text-muted-foreground">
              {targets === 0 ? 'Belum ada penerima.' : `${targets} alamat. Penerima tidak saling melihat.`}
            </p>
          </div>
          {subscribers.length + groups.length > 0 && (
            <div className="flex flex-col">
              {subscribers.length > 0 && (
                <Check
                  label={`Semua pelanggan (${subscribers.length})`}
                  checked={draft.allSubscribers}
                  onChange={(allSubscribers) => set({ allSubscribers })}
                />
              )}
              {groups.map((g) => (
                <Check
                  key={g.id}
                  label={`Grup ${g.name}`}
                  checked={draft.groupIds.includes(g.id)}
                  onChange={(on) => set({ groupIds: toggled(draft.groupIds, g.id, on) })}
                />
              ))}
              {!draft.allSubscribers &&
                subscribers.map((u) => (
                  <Check
                    key={u.id}
                    label={`${u.name}, ${u.email}`}
                    checked={draft.userIds.includes(u.id)}
                    onChange={(on) => set({ userIds: toggled(draft.userIds, u.id, on) })}
                  />
                ))}
            </div>
          )}
          {subscribers.length === 0 && (
            <p className="text-sm text-muted-foreground">
              Belum ada pelanggan. Admin dan Auditor bisa menyalakan Langganan email di halaman Laporan.
            </p>
          )}
          <AddressInput label="Alamat lain" addresses={draft.recipients} domains={domains} onChange={(recipients) => set({ recipients })} />
        </section>

        <section aria-labelledby="text-title" className="flex flex-col gap-4 border-t pt-6">
          <div>
            <h2 id="text-title" className="text-base font-semibold">
              Isi email
            </h2>
            <p className="text-sm text-muted-foreground">{'{periode}'} diganti dengan tanggal laporan.</p>
          </div>
          <Field label="Subjek">
            <Input required maxLength={150} value={draft.subject} onChange={(e) => set({ subject: e.target.value })} />
          </Field>
          <Field label="Pesan">
            <Textarea rows={4} maxLength={2000} value={draft.message} onChange={(e) => set({ message: e.target.value })} />
          </Field>
        </section>
      </div>

      <section aria-labelledby="mail-preview" className="flex min-w-0 flex-col gap-3 lg:sticky lg:top-20 lg:self-start">
        <h2 id="mail-preview" className="text-base font-semibold">
          Yang diterima
        </h2>
        <div className="flex min-w-0 flex-col rounded-xl bg-card text-sm ring-1 ring-foreground/10">
          <div className="flex flex-col gap-0.5 border-b p-4">
            <p className="font-semibold break-words">{draft.subject.replaceAll('{periode}', period) || '-'}</p>
            <p className="text-muted-foreground">Smart Energy Monitoring</p>
          </div>
          <div className="flex flex-col gap-3 p-4">
            {draft.message.trim() && <p className="break-words whitespace-pre-line">{draft.message.replaceAll('{periode}', period)}</p>}
            <div>
              <p>Periode: {period}</p>
              <p>Isi file:</p>
              <ul className="list-disc pl-5">
                {draft.workbook.sheets.map((s, i) => (
                  <li key={i}>{s.name || `Sheet ${i + 1}`}</li>
                ))}
              </ul>
            </div>
            <p className="text-muted-foreground">Email otomatis dari Smart Energy Monitoring.</p>
          </div>
          <div className="flex min-w-0 items-center gap-2 border-t px-4 py-3">
            <FileSpreadsheet aria-hidden="true" className="size-5 shrink-0 text-primary" />
            <span className="truncate">{exportFileName(`${draft.workbook.name} ${range.from} ${range.to}`)}</span>
          </div>
        </div>
      </section>
    </div>
  )
}
