import { Suspense } from 'react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { getRequestAccess } from '@/lib/auth/access'
import { canControlDevices } from '@/lib/auth/access-rules'
import { defaultPhaseName } from '@/lib/phase-keys'
import { getManagedDevices } from '@/lib/services/device-service'
import { CaptureControls } from '@/components/devices/capture-controls'
import { CaptureFacts, DeviceBadges } from '@/components/devices/device-summary'
import { DeviceHealthSection } from '@/components/devices/device-health'
import { DeviceTree } from '@/components/devices/device-tree'
import { Skeleton } from '@/components/ui/skeleton'
import { buttonVariants } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'

// Factory names say nothing about the device; the id is already the card title.
const FACTORY_NAME = /^(sparta ct|sparta plug|tasmota)$/i

export const dynamic = 'force-dynamic'
export const metadata: Metadata = { title: 'Perangkat | Smart Energy Monitoring' }

export default async function DevicesPage() {
  const [access, devices] = await Promise.all([getRequestAccess(), getManagedDevices()])
  const canControl = access.status === 'ok' && canControlDevices(access.viewer?.role ?? null)

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">Perangkat</h1>
        <p className="text-sm text-muted-foreground">
          {canControl
            ? 'Mulai dan hentikan rekaman, lalu atur toko dan sensor tiap perangkat.'
            : 'Status perangkat yang boleh Anda lihat.'}
        </p>
      </div>
      {devices.length === 0 ? (
        <p className="rounded-2xl border border-dashed px-4 py-12 text-center text-sm text-muted-foreground">
          Belum ada perangkat yang boleh Anda lihat.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {devices.map((device) => (
            <Card key={device.id}>
              <CardHeader>
                <CardTitle>{device.id}</CardTitle>
                {!FACTORY_NAME.test(device.name.trim()) && <CardDescription>{device.name}</CardDescription>}
                {device.location && (
                  <p className="text-xs text-muted-foreground">
                    {device.location.storeCode} · {defaultPhaseName(device.location.phase)}
                  </p>
                )}
              </CardHeader>
              <CardContent className="flex flex-1 flex-col gap-4">
                <DeviceBadges device={device} />
                <p className="text-xs text-muted-foreground">
                  Jam perangkat {device.lastSeen ?? '-'}, {device.sensors.length} sensor
                </p>
                <CaptureFacts device={device} />
                {canControl && <CaptureControls device={device} />}
              </CardContent>
              <CardFooter>
                <Link
                  href={`/perangkat/${encodeURIComponent(device.id)}`}
                  className={buttonVariants({ variant: 'outline', size: 'sm' })}
                >
                  {canControl ? 'Detail dan Pengaturan' : 'Detail'}
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
      {devices.length > 0 && (
        <Suspense fallback={<Skeleton className="h-40 w-full rounded-2xl" />}>
          <DeviceTree />
        </Suspense>
      )}
      <Suspense fallback={<Skeleton className="h-64 w-full rounded-2xl" />}>
        <DeviceHealthSection />
      </Suspense>
    </div>
  )
}
