'use client'

import { useState } from 'react'
import { useCommand } from '@/components/devices/use-command'
import { Field, SelectField } from '@/components/form-controls'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { MAIL_PROVIDERS, type MailProvider, type MailSettings } from '@/lib/mail-settings'
import { SettingsSection } from './settings-section'
import { PRESSED } from './sheet-inspector'

const PATH = '/api/reports/mail'
const LINK = 'text-primary underline underline-offset-4'

function PasswordHelp({ provider }: { provider: MailProvider }) {
  if (provider === 'microsoft') return <p>SMTP AUTH untuk akun ini harus diaktifkan dulu oleh admin Microsoft 365.</p>
  if (provider === 'other') return <p>Minta server, port, username, dan password SMTP ke tim IT.</p>
  return (
    <ol className="flex list-decimal flex-col gap-1 pl-5">
      <li>
        Aktifkan Verifikasi 2 Langkah di{' '}
        <a href="https://myaccount.google.com/security" target="_blank" rel="noreferrer" className={LINK}>
          keamanan akun Google
        </a>
        .
      </li>
      <li>
        Buat{' '}
        <a href="https://myaccount.google.com/apppasswords" target="_blank" rel="noreferrer" className={LINK}>
          App Password
        </a>{' '}
        baru, lalu salin 16 hurufnya.
      </li>
      <li>Tempel di kolom App Password. Jangan pakai password login Gmail.</li>
    </ol>
  )
}

export function MailSettingsForm({
  settings,
  problem,
  viewerEmail,
}: {
  settings: MailSettings | null
  problem: string | null
  viewerEmail: string
}) {
  const { run, pending, error, clearError } = useCommand()
  const [editing, setEditing] = useState(false)
  const [provider, setProvider] = useState<MailProvider>(settings?.provider ?? 'gmail')
  const [host, setHost] = useState(settings?.provider === 'other' ? settings.host : '')
  const [port, setPort] = useState(String(settings?.port ?? 587))
  const [user, setUser] = useState(settings?.provider === 'other' ? settings.user : '')
  const [from, setFrom] = useState(settings?.from ?? '')
  const [password, setPassword] = useState('')
  const [domains, setDomains] = useState(settings?.domains.join(', ') ?? '')
  const [testTo, setTestTo] = useState(viewerEmail)
  const [done, setDone] = useState<string | null>(null)

  async function send(body: object, text: string): Promise<boolean> {
    setDone(null)
    const ok = await run(PATH, body)
    if (ok) setDone(text)
    return ok
  }

  function reset() {
    clearError()
    setDone(null)
  }

  const ready = settings !== null && problem === null
  const form = !ready || editing
  const keeps =
    ready &&
    settings.provider === provider &&
    settings.from === from &&
    (provider !== 'other' || (settings.host === host && String(settings.port) === port && settings.user === user))

  return (
    <>
      <SettingsSection
        id="sender"
        title="Akun pengirim"
        description="Satu akun dipakai untuk semua laporan. Pakai akun khusus laporan, jangan email pribadi."
      >
        {settings && problem && (
          <p role="alert" className="text-sm text-warning">
            {problem}
          </p>
        )}
        {form ? (
          <form
            className="flex flex-col gap-5"
            onChange={reset}
            onSubmit={async (e) => {
              e.preventDefault()
              const body = { provider, host, port: Number(port), user, from, password, domains }
              if (await send({ action: 'save', settings: body }, 'Pengaturan tersimpan. Tes koneksinya sebelum dipakai.')) {
                setPassword('')
                setEditing(false)
              }
            }}
          >
            <ToggleGroup
              aria-label="Layanan email"
              variant="outline"
              className="flex-wrap"
              value={[provider]}
              onValueChange={(value) => {
                if (!value[0]) return
                reset()
                setProvider(value[0] as MailProvider)
              }}
            >
              {(Object.keys(MAIL_PROVIDERS) as MailProvider[]).map((p) => (
                <ToggleGroupItem key={p} value={p} className={`${PRESSED} px-4`}>
                  {MAIL_PROVIDERS[p].label}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
            <div className="text-sm text-muted-foreground">
              <PasswordHelp provider={provider} />
            </div>
            {provider === 'other' && (
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-[minmax(0,1fr)_10rem]">
                <Field label="Server SMTP">
                  <Input required value={host} onChange={(e) => setHost(e.target.value)} autoComplete="off" spellCheck={false} placeholder="mail.kantor.co.id" />
                </Field>
                <SelectField
                  label="Port"
                  value={port}
                  choices={[
                    { value: '587', label: '587 (STARTTLS)' },
                    { value: '465', label: '465 (TLS)' },
                  ]}
                  onChange={setPort}
                />
                <Field label="Username">
                  <Input required value={user} onChange={(e) => setUser(e.target.value)} autoComplete="off" spellCheck={false} />
                </Field>
              </div>
            )}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Field label="Alamat pengirim">
                <Input type="email" required value={from} onChange={(e) => setFrom(e.target.value)} autoComplete="off" spellCheck={false} placeholder="laporan.energi@gmail.com" />
              </Field>
              <Field label={provider === 'gmail' ? 'App Password' : 'Password'}>
                <Input
                  type="password"
                  required={!keeps}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="new-password"
                  placeholder={keeps ? 'Kosongkan jika tetap' : undefined}
                />
              </Field>
            </div>
            <div className="flex flex-col gap-1.5">
              <Field label="Domain yang boleh menerima">
                <Input required value={domains} onChange={(e) => setDomains(e.target.value)} spellCheck={false} placeholder="kantor.co.id, gmail.com" />
              </Field>
              <p className="text-xs text-muted-foreground">
                Bagian setelah @ dari email penerima, pisahkan dengan koma. Alamat di luar daftar ini selalu ditolak.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Button type="submit" disabled={pending}>
                {pending ? 'Menyimpan' : 'Simpan Pengaturan'}
              </Button>
              {editing && (
                <Button type="button" variant="ghost" disabled={pending} onClick={() => setEditing(false)}>
                  Batal
                </Button>
              )}
              <p className="text-xs text-muted-foreground">Password disimpan terenkripsi dan tidak ditampilkan lagi.</p>
            </div>
          </form>
        ) : (
          <div className="flex flex-col gap-5">
            <dl className="grid grid-cols-1 gap-4 text-sm sm:grid-cols-3">
              <div className="min-w-0">
                <dt className="text-muted-foreground">Pengirim</dt>
                <dd className="font-medium break-words">{settings.from}</dd>
              </div>
              <div className="min-w-0">
                <dt className="text-muted-foreground">Layanan</dt>
                <dd className="font-medium break-words">
                  {settings.provider === 'other' ? `${settings.host}:${settings.port}` : MAIL_PROVIDERS[settings.provider].label}
                </dd>
              </div>
              <div className="min-w-0">
                <dt className="text-muted-foreground">Domain penerima</dt>
                <dd className="flex flex-wrap gap-1.5 pt-0.5">
                  {settings.domains.map((d) => (
                    <Badge key={d} variant="secondary">
                      {d}
                    </Badge>
                  ))}
                </dd>
              </div>
            </dl>
            <div className="flex flex-wrap gap-2">
              <Button type="button" variant="outline" disabled={pending} onClick={() => { reset(); setEditing(true) }}>
                Ubah Akun
              </Button>
              <Button type="button" variant="outline" disabled={pending} onClick={() => send({ action: 'check' }, 'Koneksi dan login berhasil.')}>
                {pending ? 'Memeriksa' : 'Tes Koneksi'}
              </Button>
            </div>
          </div>
        )}
        <p aria-live="polite" className={error ? 'text-sm text-destructive empty:hidden' : 'text-sm text-muted-foreground empty:hidden'}>
          {error ?? done}
        </p>
      </SettingsSection>

      {ready && !editing && (
        <SettingsSection id="test" title="Email uji" description="Kirim satu email singkat untuk memastikan sampai ke kotak masuk.">
          <form
            className="flex flex-wrap items-end gap-2"
            onSubmit={(e) => {
              e.preventDefault()
              send({ action: 'test', to: testTo }, `Email uji dikirim ke ${testTo}.`)
            }}
          >
            <div className="w-full sm:w-80">
              <Field label="Kirim ke">
                <Input type="email" required value={testTo} onChange={(e) => { reset(); setTestTo(e.target.value) }} spellCheck={false} />
              </Field>
            </div>
            <Button type="submit" variant="outline" disabled={pending}>
              Kirim Uji
            </Button>
          </form>
        </SettingsSection>
      )}
    </>
  )
}
