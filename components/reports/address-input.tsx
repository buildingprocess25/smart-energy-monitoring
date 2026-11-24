'use client'

import { useId, useState } from 'react'
import { X } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { isAllowedRecipient } from '@/lib/workbook'

// Comma, space, semicolon, Enter or leaving the field adds what was typed.
export function AddressInput({
  label,
  addresses,
  domains,
  onChange,
}: {
  label: string
  addresses: string[]
  domains: string[]
  onChange: (addresses: string[]) => void
}) {
  const id = useId()
  const [text, setText] = useState('')

  function add(raw: string) {
    const typed = raw.split(/[\s,;]+/).filter(Boolean)
    if (typed.length > 0) onChange([...new Set([...addresses, ...typed])])
    setText('')
  }

  const refused = addresses.filter((a) => !isAllowedRecipient(a, domains))

  return (
    <div className="flex min-w-0 flex-col gap-2">
      <Label htmlFor={id}>{label}</Label>
      {addresses.length > 0 && (
        <ul aria-label={label} className="flex flex-wrap gap-1.5">
          {addresses.map((address) => (
            <li key={address} className="max-w-full">
              <Badge variant={refused.includes(address) ? 'destructive' : 'secondary'} className="h-8 max-w-full pr-0.5">
                <span className="truncate">{address}</span>
                <button
                  type="button"
                  aria-label={`Hapus ${address}`}
                  onClick={() => onChange(addresses.filter((a) => a !== address))}
                  className="flex size-7 shrink-0 items-center justify-center rounded-full outline-none hover:bg-foreground/10 focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <X aria-hidden="true" className="size-3.5" />
                </button>
              </Badge>
            </li>
          ))}
        </ul>
      )}
      <Input
        id={id}
        type="text"
        inputMode="email"
        autoComplete="off"
        spellCheck={false}
        value={text}
        aria-describedby={`${id}-help`}
        placeholder="nama@kantor.co.id"
        onChange={(e) => (/[\s,;]/.test(e.target.value) ? add(e.target.value) : setText(e.target.value))}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && text.trim()) {
            e.preventDefault()
            add(text)
          } else if (e.key === 'Backspace' && text === '' && addresses.length > 0) {
            onChange(addresses.slice(0, -1))
          }
        }}
        onBlur={() => add(text)}
      />
      <p id={`${id}-help`} className={refused.length > 0 ? 'text-xs text-destructive' : 'text-xs text-muted-foreground'}>
        {refused.length > 0
          ? `${refused.join(', ')} tidak valid atau domainnya belum diizinkan.`
          : domains.length > 0
            ? `Tekan Enter atau koma untuk menambah. Domain yang diizinkan: ${domains.join(', ')}.`
            : 'Isi domain penerima di Pengaturan Email dulu.'}
      </p>
    </div>
  )
}
