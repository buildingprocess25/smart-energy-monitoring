'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Download, MoreHorizontal } from 'lucide-react'
import { Field, SelectField, type Choice } from '@/components/form-controls'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { downloadFile } from '@/lib/download'
import { resolveRecipients, type RecipientGroup, type Subscriber } from '@/lib/mail-settings'
import { REPORT_TYPES, type ReportType } from '@/lib/reports'
import { exportFileName } from '@/lib/session-export'
import { PERIODS, resolvePeriod, type Period, type SheetSpec, type TemplateSpec, type WorkbookSpec } from '@/lib/workbook'
import { SchedulePanel } from './schedule-panel'
import { newSheet, SheetInspector } from './sheet-inspector'
import { SheetSurface } from './sheet-surface'

export interface TemplateView extends TemplateSpec {
  id: string
  next: string | null
  lastRun: string | null
}

const PATH = '/api/reports/templates'
const NEW = 'baru'
const CONFIRM_TITLE = { send: 'Kirim email sekarang?', test: 'Kirim email uji', delete: 'Hapus template ini?', leave: 'Buang perubahan?' }

function emptyTemplate(): TemplateSpec {
  return {
    workbook: { name: 'Laporan energi', period: 'lastWeek', from: null, to: null, sheets: [newSheet('summary')] },
    schedule: { enabled: false, frequency: 'weekly', weekdays: [1], monthDay: 1, time: '07:00' },
    allSubscribers: false,
    userIds: [],
    groupIds: [],
    recipients: [],
    subject: 'Laporan energi {periode}',
    message: '',
  }
}

function toSpec(t: TemplateSpec): TemplateSpec {
  const { workbook, schedule, allSubscribers, userIds, groupIds, recipients, subject, message } = t
  return { workbook, schedule, allSubscribers, userIds, groupIds, recipients, subject, message }
}

async function readError(res: Response): Promise<string> {
  const data = (await res.json().catch(() => null)) as { error?: string } | null
  return data?.error ?? 'Perintah gagal dijalankan.'
}

export function WorkbookBuilder({
  templates,
  stores,
  canCompare,
  canSchedule,
  mailProblem,
  domains,
  subscribers,
  groups,
  viewerEmail,
}: {
  templates: TemplateView[]
  stores: Choice[]
  canCompare: boolean
  canSchedule: boolean
  mailProblem: string | null
  domains: string[]
  subscribers: Subscriber[]
  groups: RecipientGroup[]
  viewerEmail: string
}) {
  const router = useRouter()
  const [now] = useState(() => Date.now())
  const [id, setId] = useState<string | null>(null)
  const [draft, setDraft] = useState<TemplateSpec>(emptyTemplate)
  const [saved, setSaved] = useState(() => JSON.stringify(emptyTemplate()))
  const [active, setActive] = useState(0)
  const [pending, setPending] = useState<string | null>(null)
  const [message, setMessage] = useState<{ text: string; error: boolean } | null>(null)
  const [confirm, setConfirm] = useState<keyof typeof CONFIRM_TITLE | null>(null)
  const [goTo, setGoTo] = useState<string>(NEW)
  const [testTo, setTestTo] = useState(viewerEmail)

  const { workbook } = draft
  const types = (Object.keys(REPORT_TYPES) as ReportType[]).filter((t) => canCompare || t !== 'sangatBoros')
  const current = templates.find((t) => t.id === id)
  const dirty = JSON.stringify(toSpec(draft)) !== saved
  const busy = pending !== null
  const targets = resolveRecipients(draft, subscribers, groups, domains).length
  const index = Math.min(active, workbook.sheets.length - 1)

  const setWorkbook = (change: Partial<WorkbookSpec>) => setDraft({ ...draft, workbook: { ...workbook, ...change } })
  const setSheet = (next: SheetSpec) => setWorkbook({ sheets: workbook.sheets.map((s, i) => (i === index ? next : s)) })

  function open(value: string) {
    const template = templates.find((t) => t.id === value)
    const next = template ? toSpec(template) : emptyTemplate()
    setId(template?.id ?? null)
    setDraft(next)
    setSaved(JSON.stringify(next))
    setActive(0)
    setMessage(null)
    setConfirm(null)
  }

  async function act(name: string, run: () => Promise<string>) {
    setPending(name)
    setMessage(null)
    try {
      setMessage({ text: await run(), error: false })
    } catch (e) {
      setMessage({ text: e instanceof TypeError || !(e instanceof Error) ? 'Server tidak bisa dihubungi. Coba lagi.' : e.message, error: true })
    } finally {
      setPending(null)
    }
  }

  async function post(body: object): Promise<{ id?: string }> {
    const res = await fetch(PATH, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
    if (!res.ok) throw new Error(await readError(res))
    return res.json()
  }

  const download = () =>
    act('download', async () => {
      const res = await fetch('/api/reports/workbook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(workbook),
      })
      if (!res.ok) throw new Error(await readError(res))
      downloadFile(await res.blob(), exportFileName(workbook.name))
      return 'File Excel sudah diunduh.'
    })

  const save = () =>
    act('save', async () => {
      const spec = toSpec(draft)
      const result = await post({ action: 'save', id, template: spec })
      setId(result.id ?? null)
      setSaved(JSON.stringify(spec))
      router.refresh()
      return spec.schedule.enabled ? 'Template tersimpan dan jadwalnya aktif.' : 'Template tersimpan.'
    })

  const send = (action: 'send' | 'test') =>
    act(action, async () => {
      setConfirm(null)
      try {
        await post({ action, id, to: testTo })
      } finally {
        router.refresh()
      }
      return action === 'test' ? `Email uji dikirim ke ${testTo}.` : 'Email dikirim ke semua penerima.'
    })

  const remove = () =>
    act('delete', async () => {
      await post({ action: 'delete', id })
      open(NEW)
      router.refresh()
      return 'Template dihapus.'
    })

  const canSend = id !== null && !dirty && mailProblem === null
  const status = message
    ? message.text
    : dirty && id
      ? 'Ada perubahan yang belum disimpan.'
      : current
        ? [current.next && `Kirim berikutnya ${current.next}`, current.lastRun].filter(Boolean).join('. ')
        : ''

  const fileTab = (
    <div className="grid min-w-0 grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_17.5rem]">
      <SheetSurface
        workbook={workbook}
        active={index}
        onActive={setActive}
        onChange={setSheet}
        onAdd={() => {
          const used = workbook.sheets.map((s) => s.type)
          setWorkbook({ sheets: [...workbook.sheets, newSheet(types.find((t) => !used.includes(t)) ?? 'daily')] })
          setActive(workbook.sheets.length)
        }}
      />
      <SheetInspector
        sheet={workbook.sheets[index]}
        index={index}
        count={workbook.sheets.length}
        types={types}
        stores={stores}
        onChange={setSheet}
        onMove={(to) => {
          const sheets = [...workbook.sheets]
          sheets.splice(to, 0, ...sheets.splice(index, 1))
          setWorkbook({ sheets })
          setActive(to)
        }}
        onRemove={() => {
          setWorkbook({ sheets: workbook.sheets.filter((_, i) => i !== index) })
          setActive(Math.max(0, index - 1))
        }}
      />
    </div>
  )

  return (
    <form
      className="flex min-w-0 flex-col gap-5"
      onSubmit={(e) => {
        e.preventDefault()
        const submitter = (e.nativeEvent as SubmitEvent).submitter as HTMLButtonElement | null
        if (submitter?.value === 'save') save()
        else download()
      }}
    >
      <div className="flex flex-col gap-3 xl:flex-row xl:items-end xl:justify-between">
        <div className="grid min-w-0 flex-1 grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,18rem)]">
          {canSchedule && (
            <SelectField
              label="Template"
              value={id ?? NEW}
              choices={[{ value: NEW, label: 'Template baru' }, ...templates.map((t) => ({ value: t.id, label: t.workbook.name }))]}
              onChange={(value) => {
                if (value === (id ?? NEW)) return
                if (!dirty) return open(value)
                setGoTo(value)
                setConfirm('leave')
              }}
            />
          )}
          <Field label="Nama file">
            <Input required maxLength={80} value={workbook.name} onChange={(e) => setWorkbook({ name: e.target.value })} />
          </Field>
          <SelectField
            label="Periode"
            value={workbook.period}
            choices={(Object.keys(PERIODS) as Period[]).map((p) => ({ value: p, label: PERIODS[p] }))}
            onChange={(value) => {
              const range = resolvePeriod(workbook, now)
              setWorkbook({ period: value as Period, ...(value === 'custom' ? range : { from: null, to: null }) })
            }}
          />
          {workbook.period === 'custom' && (
            <div className="grid grid-cols-2 gap-2 sm:col-span-2 lg:col-span-1 lg:col-start-3">
              <Field label="Dari">
                <Input type="date" required max={workbook.to ?? undefined} value={workbook.from ?? ''} onChange={(e) => setWorkbook({ from: e.target.value })} />
              </Field>
              <Field label="Sampai">
                <Input type="date" required min={workbook.from ?? undefined} value={workbook.to ?? ''} onChange={(e) => setWorkbook({ to: e.target.value })} />
              </Field>
            </div>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button type="submit" value="download" disabled={busy}>
            <Download data-icon="inline-start" aria-hidden="true" />
            {pending === 'download' ? 'Menyiapkan' : 'Unduh Excel'}
          </Button>
          {canSchedule && (
            <>
              <Button type="submit" value="save" variant="outline" disabled={busy || (id !== null && !dirty)}>
                {pending === 'save' ? 'Menyimpan' : 'Simpan Template'}
              </Button>
              {id && (
                <DropdownMenu>
                  <DropdownMenuTrigger render={<Button type="button" variant="outline" size="icon" aria-label="Aksi template" disabled={busy} />}>
                    <MoreHorizontal aria-hidden="true" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-52">
                    <DropdownMenuGroup>
                      <DropdownMenuItem disabled={!canSend} onClick={() => setConfirm('test')}>
                        Kirim Uji
                      </DropdownMenuItem>
                      <DropdownMenuItem disabled={!canSend || targets === 0} onClick={() => setConfirm('send')}>
                        Kirim Sekarang
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                      <DropdownMenuItem variant="destructive" onClick={() => setConfirm('delete')}>
                        Hapus Template
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </>
          )}
        </div>
      </div>

      <p aria-live="polite" className={message?.error ? 'text-sm text-destructive empty:hidden' : 'text-sm text-muted-foreground empty:hidden'}>
        {status}
      </p>

      {canSchedule ? (
        <Tabs defaultValue="file" className="min-w-0 gap-5">
          <TabsList className="group-data-horizontal/tabs:h-10">
            <TabsTrigger value="file" className="px-4">
              Isi file
            </TabsTrigger>
            <TabsTrigger value="email" className="px-4">
              Email
            </TabsTrigger>
          </TabsList>
          <TabsContent value="file" className="min-w-0">
            {fileTab}
          </TabsContent>
          <TabsContent value="email" className="min-w-0">
            <SchedulePanel
              draft={draft}
              onChange={setDraft}
              subscribers={subscribers}
              groups={groups}
              domains={domains}
              mailProblem={mailProblem}
              targets={targets}
              range={resolvePeriod(workbook, now)}
            />
          </TabsContent>
        </Tabs>
      ) : (
        fileTab
      )}

      <Dialog open={confirm !== null} onOpenChange={(next) => !next && !busy && setConfirm(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{confirm ? CONFIRM_TITLE[confirm] : ''}</DialogTitle>
            <DialogDescription>
              {confirm === 'send' && `${workbook.name} dikirim ke ${targets} alamat.`}
              {confirm === 'test' && 'Hanya dikirim ke satu alamat, dengan tanda [Uji] di subjek.'}
              {confirm === 'delete' && `${current?.workbook.name ?? workbook.name} dan jadwalnya dihapus permanen.`}
              {confirm === 'leave' && 'Perubahan yang belum disimpan akan hilang.'}
            </DialogDescription>
          </DialogHeader>
          {confirm === 'test' && (
            <Field label="Kirim ke">
              <Input type="email" value={testTo} onChange={(e) => setTestTo(e.target.value)} />
            </Field>
          )}
          <DialogFooter>
            <DialogClose render={<Button type="button" variant="outline" disabled={busy} />}>Batal</DialogClose>
            {confirm === 'delete' && (
              <Button type="button" variant="destructive" disabled={busy} onClick={remove}>
                Hapus Template
              </Button>
            )}
            {confirm === 'leave' && (
              <Button type="button" variant="destructive" onClick={() => open(goTo)}>
                Buang Perubahan
              </Button>
            )}
            {(confirm === 'send' || confirm === 'test') && (
              <Button type="button" disabled={busy} onClick={() => send(confirm)}>
                Kirim Email
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </form>
  )
}
