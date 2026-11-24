import { unstable_rethrow } from "next/navigation"
import { AlertList } from "@/components/alerts/alert-list"
import { SampleCoverageRow } from "@/components/devices/sample-coverage-row"
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { getDeviceHealth, HEALTH_DAYS } from "@/lib/services/health-service"
import {
  getSampleCoverage,
  sampleKey,
} from "@/lib/services/sample-count-service"

const formatTime = (epoch: number | null) =>
  epoch === null
    ? "-"
    : new Date(epoch).toLocaleString("id-ID", {
        timeZone: "Asia/Jakarta",
        dateStyle: "medium",
        timeStyle: "short",
      })

export async function DeviceHealthSection() {
  let health: Awaited<ReturnType<typeof getDeviceHealth>>
  try {
    health = await getDeviceHealth()
  } catch (error) {
    unstable_rethrow(error)
    console.error("Perangkat: gagal memuat kesehatan perangkat", error)
    return (
      <p role="alert" className="text-sm text-muted-foreground">
        Kesehatan perangkat belum bisa dimuat. Muat ulang halaman.
      </p>
    )
  }
  const { devices, alerts } = health
  if (devices.length === 0) return null
  const samples = await getSampleCoverage().catch((error) => {
    unstable_rethrow(error)
    console.error("Perangkat: gagal menghitung data", error)
    return null
  })

  return (
    <>
      <section aria-labelledby="alerts-title" className="flex flex-col gap-2">
        <h2 id="alerts-title" className="text-lg font-semibold">
          Peringatan
        </h2>
        {alerts.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Tidak ada masalah saat ini.
          </p>
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
            Data valid dibanding ekspektasi 240 per jam (1 data tiap 15 detik),
            hanya selama sesi rekaman. Buka Rincian untuk data per hari dan per jam.
            {samples && ` Dihitung ${formatTime(samples.readAt)} WIB.`}
          </p>
        </div>
        {samples === null ? (
          <p role="alert" className="text-sm text-muted-foreground">
            Jumlah data belum bisa dihitung. Muat ulang halaman.
          </p>
        ) : (
          <>
            <Table scrollLabel="Kelengkapan data tiap sensor">
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead>Sensor</TableHead>
                  <TableHead className="max-lg:hidden">
                    Per hari, terbaru di kanan
                  </TableHead>
                  <TableHead className="text-right">
                    Aktual dari ekspektasi
                  </TableHead>
                  <TableHead className="text-right max-sm:hidden">
                    Hari lengkap
                  </TableHead>
                  <TableHead className="max-sm:hidden">
                    Data terakhir (WIB)
                  </TableHead>
                  <TableHead>
                    <span className="sr-only">Rincian</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {devices.flatMap((device) =>
                  device.sensors.flatMap((s) => {
                    const counts = samples.sensors.get(
                      sampleKey(device.id, s.phase)
                    )
                    if (!counts) return []
                    return [
                      <SampleCoverageRow
                        key={`${device.id}-${s.phase}`}
                        deviceId={device.id}
                        phase={s.phase}
                        name={s.name}
                        enabled={s.enabled}
                        lastSample={formatTime(s.lastSampleAt)}
                        {...counts}
                      />,
                    ]
                  })
                )}
              </TableBody>
            </Table>
            <ul className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground max-lg:hidden">
              {[
                ["bg-primary", "Lengkap, 90% ke atas"],
                ["bg-warning", "Sebagian"],
                ["bg-destructive", "Direkam tanpa data valid"],
                ["bg-border", "Tidak direkam"],
              ].map(([color, label]) => (
                <li key={label} className="flex items-center gap-1.5">
                  <span
                    aria-hidden="true"
                    className={`h-3 w-1.5 rounded-sm ${color}`}
                  />
                  {label}
                </li>
              ))}
            </ul>
            <p className="text-xs text-muted-foreground">
              Offline: baris tercatat, tetapi perangkat tidak mengirim data.
              Tidak terekam: baris tidak ada di tengah sesi rekaman.
            </p>
          </>
        )}
      </section>
    </>
  )
}
