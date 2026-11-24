import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getRequestAccess } from '@/lib/auth/access'
import { canControlDevices } from '@/lib/auth/access-rules'
import { getManagedDevices } from '@/lib/services/device-service'
import { CaptureControls } from '@/components/devices/capture-controls'
import { DeviceSettings } from '@/components/devices/device-settings'
import { CaptureFacts, DeviceBadges } from '@/components/devices/device-summary'
import { LiveTelemetryChart } from '@/components/monitoring/live-telemetry-chart'

export const dynamic = 'force-dynamic'
export const metadata: Metadata = { title: 'Detail Perangkat | Smart Energy Monitoring' }

export default async function DevicePage({ params }: { params: Promise<{ deviceId: string }> }) {
  const deviceId = decodeURIComponent((await params).deviceId)
  const [access, devices] = await Promise.all([getRequestAccess(), getManagedDevices()])
  const device = devices.find((d) => d.id === deviceId)
  if (!device) notFound()
  const canControl = access.status === 'ok' && canControlDevices(access.viewer?.role ?? null)

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">{device.id}</h1>
          <p className="text-sm text-muted-foreground">{device.name}</p>
        </div>
        <DeviceBadges device={device} />
        <div className="max-w-xl">
          <CaptureFacts device={device} />
        </div>
        {canControl && <CaptureControls device={device} />}
      </div>
      <LiveTelemetryChart key={device.id} src={`/api/devices/${encodeURIComponent(device.id)}/live`} showRelay={device.kind === 'Plug'} />
      {canControl && <DeviceSettings device={device} />}
    </div>
  )
}
