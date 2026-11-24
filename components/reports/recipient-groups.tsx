'use client'

import { useState } from 'react'
import { useCommand } from '@/components/devices/use-command'
import { Check, Field } from '@/components/form-controls'
import { Badge } from '@/components/ui/badge'
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
import { Input } from '@/components/ui/input'
import type { RecipientGroup, Subscriber } from '@/lib/mail-settings'
import { AddressInput } from './address-input'
import { SettingsSection } from './settings-section'

const PATH = '/api/reports/mail'

export function RecipientGroups({
  groups,
  subscribers,
  domains,
}: {
  groups: RecipientGroup[]
  subscribers: Subscriber[]
  domains: string[]
}) {
  const { run, pending, error, clearError } = useCommand()
  const [open, setOpen] = useState<'edit' | 'delete' | null>(null)
  const [id, setId] = useState<string | null>(null)
  const [name, setName] = useState('')
  const [userIds, setUserIds] = useState<string[]>([])
  const [addresses, setAddresses] = useState<string[]>([])

  function show(next: 'edit' | 'delete', group: RecipientGroup | null) {
    clearError()
    setId(group?.id ?? null)
    setName(group?.name ?? '')
    // People who unsubscribed leave the group on the next save.
    setUserIds(group?.userIds.filter((u) => subscribers.some((s) => s.id === u)) ?? [])
    setAddresses(group?.addresses ?? [])
    setOpen(next)
  }

  const active = (group: RecipientGroup) => group.userIds.filter((u) => subscribers.some((s) => s.id === u)).length + group.addresses.length
  const alert = error && (
    <p role="alert" className="text-sm text-destructive">
      {error}
    </p>
  )

  const ready = domains.length > 0

  return (
    <>
      <SettingsSection
        id="subscribers"
        title="Pelanggan"
        description="Admin dan Auditor yang menyalakan Langganan email. Hanya mereka yang bisa dipilih sebagai penerima."
      >
        {subscribers.length === 0 ? (
          <p className="text-sm text-muted-foreground">Belum ada pelanggan. Sakelarnya ada di kanan atas halaman Laporan.</p>
        ) : (
          <ul className="flex flex-col divide-y border-y">
            {subscribers.map((s) => (
              <li key={s.id} className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 py-3 text-sm">
                <div className="min-w-0">
                  <p className="font-medium break-words">{s.name}</p>
                  <p className="break-words text-muted-foreground">{s.email}</p>
                </div>
                {domains.includes(s.email.split('@').pop()?.toLowerCase() ?? '') ? (
                  <Badge variant="outline">{s.role === 'ADMIN' ? 'Admin' : 'Auditor'}</Badge>
                ) : (
                  <span className="text-warning">Domain belum diizinkan</span>
                )}
              </li>
            ))}
          </ul>
        )}
      </SettingsSection>

      <SettingsSection
        id="groups"
        title="Grup penerima"
        description="Kumpulan alamat yang bisa dipakai di banyak template, misalnya Tim Energi."
      >
        {groups.length > 0 && (
          <ul className="flex flex-col divide-y border-y">
            {groups.map((g) => (
              <li key={g.id} className="flex flex-wrap items-center justify-between gap-3 py-3">
                <div className="min-w-0 text-sm">
                  <p className="font-medium break-words">{g.name}</p>
                  <p className="text-muted-foreground">{active(g)} penerima</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" aria-label={`Ubah grup ${g.name}`} onClick={() => show('edit', g)}>
                    Ubah
                  </Button>
                  <Button variant="ghost" size="sm" aria-label={`Hapus grup ${g.name}`} onClick={() => show('delete', g)}>
                    Hapus
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
        <div className="flex flex-wrap items-center gap-3">
          <Button variant="outline" disabled={!ready} onClick={() => show('edit', null)}>
            Tambah Grup
          </Button>
          {!ready && <p className="text-sm text-muted-foreground">Simpan akun pengirim dulu.</p>}
        </div>
      </SettingsSection>

      <Dialog open={open !== null} onOpenChange={(next) => !next && !pending && setOpen(null)}>
        <DialogContent>
          {open === 'edit' && (
            <form
              className="flex flex-col gap-5"
              onSubmit={async (e) => {
                e.preventDefault()
                if (await run(PATH, { action: 'saveGroup', id, group: { name, userIds, addresses } })) setOpen(null)
              }}
            >
              <DialogHeader>
                <DialogTitle>{id ? 'Ubah grup' : 'Tambah grup'}</DialogTitle>
                <DialogDescription>Pilih pelanggan, tulis alamat, atau keduanya.</DialogDescription>
              </DialogHeader>
              <Field label="Nama grup">
                <Input required maxLength={60} value={name} onChange={(e) => setName(e.target.value)} />
              </Field>
              {subscribers.length > 0 && (
                <fieldset className="flex flex-col">
                  <legend className="mb-1 text-sm font-medium">Pelanggan</legend>
                  {subscribers.map((s) => (
                    <Check
                      key={s.id}
                      label={`${s.name}, ${s.email}`}
                      checked={userIds.includes(s.id)}
                      onChange={(on) => setUserIds((prev) => (on ? [...prev, s.id] : prev.filter((u) => u !== s.id)))}
                    />
                  ))}
                </fieldset>
              )}
              <AddressInput
                label="Alamat email"
                addresses={addresses}
                domains={domains}
                onChange={(next) => {
                  clearError()
                  setAddresses(next)
                }}
              />
              {alert}
              <DialogFooter>
                <DialogClose render={<Button type="button" variant="outline" disabled={pending} />}>Batal</DialogClose>
                <Button type="submit" disabled={pending || userIds.length + addresses.length === 0}>
                  {pending ? 'Menyimpan' : 'Simpan Grup'}
                </Button>
              </DialogFooter>
            </form>
          )}
          {open === 'delete' && (
            <>
              <DialogHeader>
                <DialogTitle>Hapus grup {name}?</DialogTitle>
                <DialogDescription>Template yang memakai grup ini tidak lagi mengirim ke anggotanya.</DialogDescription>
              </DialogHeader>
              {alert}
              <DialogFooter>
                <DialogClose render={<Button type="button" variant="outline" disabled={pending} />}>Batal</DialogClose>
                <Button
                  variant="destructive"
                  disabled={pending}
                  onClick={async () => {
                    if (await run(PATH, { action: 'deleteGroup', id })) setOpen(null)
                  }}
                >
                  Hapus Grup
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
