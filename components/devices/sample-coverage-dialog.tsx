"use client"

import { useEffect, useRef, useState } from "react"
import { ArrowLeft, ChevronLeft, ChevronRight, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  STICKY_HEADER_CLASS,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  addCounts,
  validPercent,
  type SampleCount,
  type SampleDay,
  type SampleHour,
} from "@/lib/sample-count"
import { cn } from "@/lib/utils"

export const formatCount = (value: number) => value.toLocaleString("id-ID")

export const formatCountPercent = (count: SampleCount) => {
  const percent = validPercent(count)
  return percent === null ? "-" : `${formatCount(percent)}%`
}

export const formatCountDate = (date: string) =>
  new Date(`${date}T00:00:00Z`).toLocaleDateString("id-ID", {
    timeZone: "UTC",
    day: "numeric",
    month: "short",
    year: "numeric",
  })

export interface SampleCoverageDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  deviceId: string
  phase: string
  name: string
  days: SampleDay[] // recorded days, newest first, never empty
}

export function SampleCoverageDialog({
  open,
  onOpenChange,
  ...detail
}: SampleCoverageDialogProps) {
  const total = addCounts(detail.days)
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="h-[calc(100dvh-2rem)] max-w-7xl gap-4 overflow-hidden p-4 sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <DialogHeader className="min-w-0">
            <DialogTitle className="truncate text-lg">
              {detail.name}, {detail.deviceId}
            </DialogTitle>
            <DialogDescription className="tabular-nums">
              {formatCount(total.valid)} dari {formatCount(total.expected)} data
              masuk ({formatCountPercent(total)}) dalam {detail.days.length}{" "}
              hari yang direkam
            </DialogDescription>
          </DialogHeader>
          <DialogClose
            render={
              <Button
                variant="ghost"
                className="size-11 shrink-0 px-0"
                aria-label="Tutup rincian"
              />
            }
          >
            <X aria-hidden="true" />
          </DialogClose>
        </div>
        <SampleDetail {...detail} />
        <ul className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
          {SEGMENTS.map(({ key, color, label, hint }) => (
            <li
              key={key}
              className={cn(
                "flex items-center gap-1.5",
                !hint && NARROW_HIDDEN
              )}
            >
              <span
                aria-hidden="true"
                className={cn("size-2.5 rounded-sm", NARROW_HIDDEN, color)}
              />
              {label}
              {hint && <span>({hint})</span>}
            </li>
          ))}
        </ul>
      </DialogContent>
    </Dialog>
  )
}

// The bars only fit at these widths.
const NARROW_HIDDEN = "max-sm:hidden lg:max-xl:hidden"

const SEGMENTS = [
  { key: "valid", color: "bg-primary", label: "Aktual", hint: "" },
  {
    key: "offline",
    color: "bg-warning",
    label: "Offline",
    hint: "baris tercatat, perangkat tidak mengirim data",
  },
  {
    key: "missing",
    color: "bg-destructive",
    label: "Tidak terekam",
    hint: "baris tidak ada di tengah sesi",
  },
] as const

function SampleDetail({
  deviceId,
  phase,
  name,
  days,
}: Omit<SampleCoverageDialogProps, "open" | "onOpenChange">) {
  const [date, setDate] = useState(days[0].date)
  // Below lg only one list fits, so a chosen date replaces the list of days.
  const [showHours, setShowHours] = useState(false)
  const backRef = useRef<HTMLButtonElement>(null)
  const dayRef = useRef<HTMLButtonElement>(null)
  // The hidden list takes the focused control with it; from lg up both stay visible.
  function switchList(toHours: boolean) {
    setShowHours(toHours)
    requestAnimationFrame(() => (toHours ? backRef : dayRef).current?.focus())
  }
  const index = days.findIndex((d) => d.date === date)
  const day = days[index] ?? days[0]
  const older = days[index + 1]
  const newer = days[index - 1]

  return (
    <div className="grid min-h-0 flex-1 grid-cols-1 gap-5 lg:grid-cols-2">
      <section
        className={cn(
          "flex min-h-0 min-w-0 flex-col gap-2",
          showHours && "max-lg:hidden"
        )}
      >
        <div className="flex min-h-11 items-center justify-between gap-3">
          <h3 className="font-semibold">Per hari</h3>
          <p className="text-xs text-muted-foreground">
            Pilih tanggal untuk melihat rincian per jam
          </p>
        </div>
        <CountTable
          label={`${name}, data per hari`}
          first="Tanggal"
          rows={days.map((d) => ({
            key: d.date,
            count: d,
            selected: d.date === date,
            heading: (
              // The pseudo-element makes the whole row the click target.
              <button
                ref={d.date === date ? dayRef : undefined}
                type="button"
                className="rounded-sm font-medium text-primary outline-none after:absolute after:inset-0 focus-visible:ring-2 focus-visible:ring-ring"
                aria-pressed={d.date === date}
                onClick={() => {
                  setDate(d.date)
                  switchList(true)
                }}
              >
                {formatCountDate(d.date)}
              </button>
            ),
          }))}
        />
      </section>
      <section
        className={cn(
          "flex min-h-0 min-w-0 flex-col gap-2",
          !showHours && "max-lg:hidden"
        )}
      >
        <div className="flex min-h-11 items-center gap-2">
          <Button
            variant="outline"
            className="size-11 px-0 lg:hidden"
            aria-label="Kembali ke daftar hari"
            ref={backRef}
            onClick={() => switchList(false)}
          >
            <ArrowLeft aria-hidden="true" />
          </Button>
          <h3 aria-live="polite" className="min-w-0 flex-1 font-semibold">
            {formatCountDate(day.date)} per jam (WIB){" "}
            <span className="font-normal whitespace-nowrap text-muted-foreground tabular-nums">
              {formatCount(day.valid)} dari {formatCount(day.expected)}
            </span>
          </h3>
          <Button
            variant="ghost"
            className="size-11 px-0"
            aria-label="Hari rekaman sebelumnya"
            disabled={!older}
            onClick={() => older && setDate(older.date)}
          >
            <ChevronLeft aria-hidden="true" />
          </Button>
          <Button
            variant="ghost"
            className="size-11 px-0"
            aria-label="Hari rekaman berikutnya"
            disabled={!newer}
            onClick={() => newer && setDate(newer.date)}
          >
            <ChevronRight aria-hidden="true" />
          </Button>
        </div>
        <HourTable
          key={date}
          deviceId={deviceId}
          phase={phase}
          name={name}
          date={date}
        />
      </section>
    </div>
  )
}

function HourTable({
  deviceId,
  phase,
  name,
  date,
}: {
  deviceId: string
  phase: string
  name: string
  date: string
}) {
  const [hours, setHours] = useState<SampleHour[] | null>(null)
  const [failed, setFailed] = useState(false)
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    const controller = new AbortController()
    const query = new URLSearchParams({ phase, date })
    fetch(`/api/devices/${encodeURIComponent(deviceId)}/samples?${query}`, {
      signal: controller.signal,
    })
      .then(async (res) => {
        if (!res.ok) throw new Error(String(res.status))
        const body = (await res.json()) as { hours: SampleHour[] }
        setHours(body.hours)
      })
      .catch(() => {
        if (!controller.signal.aborted) setFailed(true)
      })
    return () => controller.abort()
  }, [deviceId, phase, date, attempt])

  if (failed) {
    return (
      <div
        role="alert"
        className="flex flex-col items-start gap-2 text-sm text-muted-foreground"
      >
        Rincian per jam gagal dimuat.
        <Button
          variant="outline"
          onClick={() => {
            setFailed(false)
            setAttempt(attempt + 1)
          }}
        >
          Muat lagi
        </Button>
      </div>
    )
  }
  if (!hours)
    return (
      <p className="text-sm text-muted-foreground">Memuat rincian per jam...</p>
    )

  return (
    <CountTable
      label={`${name}, data per jam ${formatCountDate(date)}`}
      first="Jam"
      rows={hours.map((h) => ({
        key: String(h.hour),
        count: h,
        heading: `${String(h.hour).padStart(2, "0")}.00`,
      }))}
    />
  )
}

interface CountRow {
  key: string
  heading: React.ReactNode
  count: SampleCount
  selected?: boolean
}

const CELL = "px-2 py-1.5 text-right tabular-nums sm:px-3"
const HEAD = "h-9 px-2 text-right sm:px-3"

function CountTable({
  label,
  first,
  rows,
}: {
  label: string
  first: string
  rows: CountRow[]
}) {
  const hasInvalid = rows.some((r) => r.count.invalid > 0)
  const quiet = (value: number) =>
    cn(CELL, value === 0 && "text-muted-foreground")
  return (
    <Table
      scrollLabel={label}
      containerClassName="max-h-full min-h-0 overflow-y-auto overscroll-contain"
    >
      <TableHeader className={STICKY_HEADER_CLASS}>
        <TableRow className="hover:bg-transparent">
          <TableHead className={cn(HEAD, "text-left")}>{first}</TableHead>
          <TableHead className={cn(HEAD, "w-full text-left", NARROW_HIDDEN)}>
            Komposisi
          </TableHead>
          <TableHead className={HEAD}>Aktual</TableHead>
          <TableHead className={cn(HEAD, "max-sm:hidden")}>
            Ekspektasi
          </TableHead>
          <TableHead className={HEAD}>Lengkap</TableHead>
          <TableHead className={HEAD}>Offline</TableHead>
          <TableHead className={cn(HEAD, "max-sm:whitespace-normal")}>
            Tidak terekam
          </TableHead>
          {hasInvalid && <TableHead className={HEAD}>Tidak valid</TableHead>}
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map(({ key, heading, count, selected }) => (
          <TableRow
            key={key}
            className={cn(
              selected !== undefined && "relative",
              selected && "bg-primary/15 font-semibold hover:bg-primary/15"
            )}
          >
            <TableCell
              className={cn(
                CELL,
                "text-left",
                selected !== undefined && "max-lg:py-3"
              )}
            >
              {heading}
            </TableCell>
            {count.expected === 0 ? (
              <TableCell
                colSpan={7}
                className={cn(CELL, "text-muted-foreground")}
              >
                Tidak direkam
              </TableCell>
            ) : (
              <>
                <TableCell className={cn(CELL, NARROW_HIDDEN)}>
                  <div
                    aria-hidden="true"
                    className="flex h-2 min-w-12 overflow-hidden rounded-sm bg-border"
                  >
                    {SEGMENTS.map((s) => (
                      <span
                        key={s.key}
                        className={s.color}
                        style={{
                          width: `${(count[s.key] / count.expected) * 100}%`,
                        }}
                      />
                    ))}
                  </div>
                </TableCell>
                <TableCell className={cn(CELL, "font-medium")}>
                  {formatCount(count.valid)}
                  <span className="block text-xs font-normal text-muted-foreground sm:hidden">
                    dari {formatCount(count.expected)}
                  </span>
                </TableCell>
                <TableCell className={cn(CELL, "max-sm:hidden")}>
                  {formatCount(count.expected)}
                </TableCell>
                <TableCell className={CELL}>
                  {formatCountPercent(count)}
                </TableCell>
                <TableCell className={quiet(count.offline)}>
                  {formatCount(count.offline)}
                </TableCell>
                <TableCell className={quiet(count.missing)}>
                  {formatCount(count.missing)}
                </TableCell>
                {hasInvalid && (
                  <TableCell className={quiet(count.invalid)}>
                    {formatCount(count.invalid)}
                  </TableCell>
                )}
              </>
            )}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
