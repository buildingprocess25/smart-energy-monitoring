import { unstable_rethrow } from 'next/navigation'
import { AlertList } from '@/components/alerts/alert-list'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import type { CoverageDay } from '@/lib/coverage'
import { getDeviceHealth, HEALTH_DAYS } from '@/lib/services/health-service'

const formatTime = (epoch: number | null) =>
  epoch === null
    ? '-'
    : new Date(epoch).toLocaleString('id-ID', { timeZone: 'Asia/Jakarta', dateStyle: 'medium', timeStyle: 'short' })

const percentOf = (day: CoverageDay) => Math.round((day.recorded / day.expected) * 100)

function dayClass(day: CoverageDay): string {
  const percent = percentOf(day)
  if (percent >= 90) return 'bg-primary'
  return percent > 0 ? 'bg-warning' : 'bg-border'
}

export async function DeviceHealthSection() {
  let health: Awaited<ReturnType<typeof getDeviceHealth>>
  try {
    health = await getDeviceHealth()
  } catch (error) {
    unstable_rethrow(error)
    console.error('Perangkat: gagal memuat kesehatan perangkat', error)
    return (
      <p role="alert" className="text-sm text-muted-foreground">
        Kesehatan perangkat belum bisa dimuat. Muat ulang halaman.
      </p>
    )
  }
  const { devices, alerts } = health
  if (devices.length === 0) return null

  return (
    <>
      <section aria-labelledby="alerts-title" className="flex flex-col gap-2">
        <h2 id="alerts-title" className="text-lg font-semibold">
          Peringatan
        </h2>
        {alerts.length === 0 ? (
          <p className="text-sm text-muted-foreground">Tidak ada masalah saat ini.</p>
        ) : (
          <div className="rounded-2xl bg-card px-4 ring-1 ring-foreground/10">
            <AlertList alerts={alerts} />
          </div>
        )}
      </section>

      <section aria-labelledby="coverage-title" className="flex flex-col gap-3">
        <div>
          <h2 id="coverage-title" className="text-lg font-semibold">
            Kelengkapan data {HEALTH_DAYS} hari
          </h2>
          <p className="text-sm text-muted-foreground">
            Bagian waktu 15 menit yang punya data, dihitung sejak perangkat pertama mengirim.
          </p>
        </div>
        <Table scrollLabel="Kelengkapan data tiap sensor">
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead>Sensor</TableHead>
              <TableHead className="max-lg:hidden">Per hari, terbaru di kanan</TableHead>
              <TableHead className="text-right">Lengkap</TableHead>
              <TableHead className="text-right max-sm:hidden">Hari lengkap</TableHead>
              <TableHead className="max-sm:hidden">Data terakhir (WIB)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {devices.flatMap((device) =>
              device.sensors.map((s) => (
                <TableRow key={`${device.id}-${s.phase}`}>
                  <TableCell className="py-3 max-sm:w-full max-sm:max-w-0">
                    <span className="block truncate font-medium">
                      {s.name}
                      {!s.enabled && <span className="font-normal text-muted-foreground"> (tidak aktif)</span>}
                    </span>
                    <span className="block truncate text-xs text-muted-foreground">{device.id}</span>
                    <span className="block truncate text-xs text-muted-foreground sm:hidden">
                      {formatTime(s.lastSampleAt)}
                    </span>
                  </TableCell>
                  <TableCell className="py-3 max-lg:hidden">
                    <div aria-hidden="true" className="flex gap-0.5">
                      {s.days.map((day) => (
                        <span
                          key={day.date}
                          title={`${day.date}: ${percentOf(day)}%`}
                          className={`h-5 w-1.5 rounded-sm ${dayClass(day)}`}
                        />
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className="py-3 text-right tabular-nums">
                    {s.percent === null ? '-' : `${s.percent.toLocaleString('id-ID')}%`}
                  </TableCell>
                  <TableCell className="py-3 text-right tabular-nums max-sm:hidden">
                    {s.days.length === 0 ? '-' : `${s.completeDays} dari ${s.days.length}`}
                  </TableCell>
                  <TableCell className="py-3 tabular-nums max-sm:hidden">{formatTime(s.lastSampleAt)}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        <ul className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground max-lg:hidden">
          {[
            ['bg-primary', 'Lengkap, 90% ke atas'],
            ['bg-warning', 'Sebagian'],
            ['bg-border', 'Tidak ada data'],
          ].map(([color, label]) => (
            <li key={label} className="flex items-center gap-1.5">
              <span aria-hidden="true" className={`h-3 w-1.5 rounded-sm ${color}`} />
              {label}
            </li>
          ))}
        </ul>
      </section>
    </>
  )
}
