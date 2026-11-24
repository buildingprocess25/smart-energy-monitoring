'use client'

import { useState } from 'react'
import type { ManagedDevice, ManagedSensor, StoreOption } from '@/lib/types'
import { deviceDisplayName, MAX_NAME_LENGTH } from '@/lib/control-commands'
import { sensorColor } from '@/lib/phase-keys'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { useCommand } from './use-command'

function Message({ error, saved }: { error: string | null; saved: boolean }) {
  return (
    <p aria-live="polite" className={error ? 'text-sm text-destructive' : 'text-sm text-muted-foreground'}>
      {error ?? (saved ? 'Tersimpan.' : '')}
    </p>
  )
}

function SensorRow({ device, sensor, index }: { device: ManagedDevice; sensor: ManagedSensor; index: number }) {
  const { run, pending, error } = useCommand()
  const [saved, setSaved] = useState(false)
  const [name, setName] = useState(sensor.name)
  const [color, setColor] = useState(sensor.color ?? sensorColor(sensor.phase, sensor.name, index))
  const path = `/api/control/devices/${encodeURIComponent(device.id)}`
  const changedName = name.trim() !== sensor.name
  const changedColor = color !== (sensor.color ?? sensorColor(sensor.phase, sensor.name, index))

  // One command after another: Flask rewrites the device's whole sensor list each time.
  async function save() {
    setSaved(false)
    if (changedName && !(await run(path, { action: 'sensorName', phase: sensor.phase, name }))) return
    if (changedColor && !(await run(path, { action: 'sensorColor', phase: sensor.phase, color }))) return
    setSaved(true)
  }

  return (
    <li className="flex flex-col gap-2 border-t py-4 first:border-t-0 first:pt-0">
      <form
        className="flex flex-wrap items-end gap-3"
        onSubmit={(e) => {
          e.preventDefault()
          save()
        }}
      >
        <label className="flex min-w-48 flex-1 flex-col gap-1.5">
          <span className="text-xs text-muted-foreground">Nama sensor {sensor.phase}</span>
          <Input required maxLength={MAX_NAME_LENGTH} value={name} onChange={(e) => setName(e.target.value)} className="h-9" />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="text-xs text-muted-foreground">Warna</span>
          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="h-9 w-14 cursor-pointer rounded-lg border border-input-border bg-transparent p-1"
          />
        </label>
        <Button type="submit" variant="outline" disabled={pending || (!changedName && !changedColor)}>
          {pending ? 'Menyimpan' : 'Simpan'}
        </Button>
        <Button
          type="button"
          variant="ghost"
          disabled={pending}
          onClick={async () => {
            setSaved(false)
            setSaved(await run(path, { action: 'sensorEnabled', phase: sensor.phase, enabled: !sensor.enabled }))
          }}
        >
          {sensor.enabled ? 'Matikan' : 'Aktifkan'}
        </Button>
      </form>
      <p className="text-xs text-muted-foreground">
        {sensor.enabled ? 'Aktif, ikut direkam.' : 'Tidak aktif, tidak ikut direkam.'}
      </p>
      <Message error={error} saved={saved} />
    </li>
  )
}

function StoreAssignment({ device }: { device: ManagedDevice }) {
  const { run, pending, error } = useCommand()
  const [saved, setSaved] = useState(false)
  const [query, setQuery] = useState('')
  const [stores, setStores] = useState<StoreOption[] | null>(null)
  const [searchError, setSearchError] = useState<string | null>(null)
  const [chosen, setChosen] = useState<StoreOption | null>(null)

  async function search() {
    setSearchError(null)
    setChosen(null)
    setSaved(false)
    try {
      const res = await fetch(`/api/control/stores?q=${encodeURIComponent(query.trim())}`)
      const data = (await res.json()) as { stores?: StoreOption[]; error?: string }
      if (!res.ok || !data.stores) throw new Error(data.error)
      setStores(data.stores)
    } catch (e) {
      setStores(null)
      setSearchError((e instanceof Error && e.message) || 'Daftar toko gagal dimuat.')
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <form
        className="flex flex-wrap items-end gap-3"
        onSubmit={(e) => {
          e.preventDefault()
          search()
        }}
      >
        <label className="flex min-w-48 flex-1 flex-col gap-1.5">
          <span className="text-xs text-muted-foreground">Cari kode atau nama toko</span>
          <Input required minLength={2} maxLength={60} value={query} onChange={(e) => setQuery(e.target.value)} className="h-9" />
        </label>
        <Button type="submit" variant="outline">
          Cari Toko
        </Button>
      </form>
      {searchError && (
        <p role="alert" className="text-sm text-destructive">
          {searchError}
        </p>
      )}
      {stores && (
        <fieldset className="flex max-h-64 flex-col overflow-y-auto rounded-xl border p-2">
          <legend className="sr-only">Pilih toko</legend>
          {stores.length === 0 && <p className="p-2 text-sm text-muted-foreground">Tidak ada toko yang cocok.</p>}
          {stores.map((s) => (
            <label key={s.id} className="flex min-h-10 items-center gap-3 rounded-lg px-2 hover:bg-muted/50">
              <input
                type="radio"
                name={`store-${device.id}`}
                className="size-4 accent-primary"
                checked={chosen?.id === s.id}
                onChange={() => setChosen(s)}
              />
              <span className="min-w-0">
                {s.name} <span className="text-muted-foreground">({s.code}{s.branch && `, ${s.branch}`})</span>
              </span>
            </label>
          ))}
        </fieldset>
      )}
      {chosen && (
        <div className="flex flex-col items-start gap-2">
          <p className="text-sm">
            Nama perangkat menjadi <span className="font-medium">{deviceDisplayName(chosen)}</span>.
            {device.capture?.active && ' Sesi yang sedang berjalan ikut pindah ke toko ini.'}
          </p>
          <Button
            disabled={pending}
            onClick={async () => {
              const ok = await run(`/api/control/devices/${encodeURIComponent(device.id)}`, { action: 'assign', storeId: chosen.id })
              setSaved(ok)
              if (ok) {
                setStores(null)
                setChosen(null)
                setQuery('')
              }
            }}
          >
            {pending ? 'Menyimpan' : 'Pindahkan Perangkat'}
          </Button>
        </div>
      )}
      <Message error={error} saved={saved} />
    </div>
  )
}

export function DeviceSettings({ device }: { device: ManagedDevice }) {
  return (
    <div className="grid grid-cols-1 items-start gap-6 *:min-w-0 xl:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Sensor</CardTitle>
          <CardDescription>Nama baru dipakai untuk sesi berikutnya, sesi lama tidak berubah.</CardDescription>
        </CardHeader>
        <CardContent>
          {device.sensors.length === 0 ? (
            <p className="text-sm text-muted-foreground">Belum ada sensor. Sensor muncul setelah perangkat mengirim data.</p>
          ) : (
            <ul>
              {device.sensors.map((s, i) => (
                <SensorRow key={`${s.phase}-${s.name}-${s.color}-${s.enabled}`} device={device} sensor={s} index={i} />
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Toko</CardTitle>
          <CardDescription>Sekarang: {device.name}</CardDescription>
        </CardHeader>
        <CardContent>
          <StoreAssignment device={device} />
        </CardContent>
      </Card>
    </div>
  )
}
