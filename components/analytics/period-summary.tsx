import {
  PLN_TARIFF_PER_KWH,
  type PeriodSummary as Summary,
} from "@/lib/usage-insights"
import { formatRupiah } from "@/components/analytics/energy-chart"
import { cn } from "@/lib/utils"

const kwhText = (kwh: number) =>
  `${kwh.toLocaleString("id-ID", { maximumFractionDigits: 1 })} kWh`

export function PeriodSummary({
  title,
  summary,
  expectedHours,
  hasMainPanel,
  compareLabel,
}: {
  title: string
  summary: Summary
  expectedHours: number
  hasMainPanel: boolean
  compareLabel?: string
}) {
  const { diffPct } = summary
  const recorded = summary.days > 0
  const facts: {
    label: string
    value: string
    note?: string
    tone?: string
  }[] = [
    {
      label: "Energi",
      value: recorded ? kwhText(summary.kwh) : "-",
      note: `${Math.round(summary.hours).toLocaleString("id-ID")} dari ${expectedHours} jam terekam`,
    },
    {
      label: "Biaya PLN",
      value:
        recorded && hasMainPanel
          ? formatRupiah(summary.mainKwh * PLN_TARIFF_PER_KWH)
          : "-",
      note: hasMainPanel
        ? "Panel utama R/S/T"
        : "Toko ini belum punya panel utama",
    },
    ...(expectedHours > 24
      ? [
          {
            label: "Rata-rata per hari",
            value:
              summary.avgPerDay === null ? "-" : kwhText(summary.avgPerDay),
            note: `${summary.days} hari terekam`,
          },
        ]
      : []),
  ]
  if (compareLabel) {
    facts.push({
      label: "Perbandingan",
      value:
        diffPct === null
          ? "-"
          : diffPct === 0
            ? "Sama"
            : `${Math.abs(diffPct).toLocaleString("id-ID")}% lebih ${diffPct > 0 ? "tinggi" : "rendah"}`,
      note:
        diffPct === null
          ? "Data pembanding belum cukup"
          : `${compareLabel}, per jam terekam`,
      tone:
        diffPct === null || diffPct === 0
          ? undefined
          : diffPct > 0
            ? "text-warning"
            : "text-primary",
    })
  }

  return (
    <div className="mt-4 flex flex-col gap-2 border-b pb-4">
      <h3 className="text-sm font-semibold text-foreground">
        Ringkasan {title}
      </h3>
      <dl
        className={cn(
          "grid grid-cols-2 gap-x-4 gap-y-3",
          facts.length === 4 ? "lg:grid-cols-4" : "lg:grid-cols-3"
        )}
      >
        {facts.map((fact) => (
          <div key={fact.label} className="min-w-0">
            <dt className="text-xs text-muted-foreground">{fact.label}</dt>
            <dd
              className={cn(
                "text-sm font-semibold break-words text-foreground tabular-nums",
                fact.tone
              )}
            >
              {fact.value}
            </dd>
            {fact.note && (
              <dd className="text-xs text-muted-foreground tabular-nums">
                {fact.note}
              </dd>
            )}
          </div>
        ))}
      </dl>
    </div>
  )
}
