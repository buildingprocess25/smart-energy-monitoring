'use client'

import { ArrowLeftRight, LogOut } from 'lucide-react'
import {
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'

export interface ShellViewer {
  name: string
  email: string
  role: string
  simulated: boolean
}

export interface SpartaLinks {
  signOut: string | null
  roleSwitch: string | null
}

const ROLE_LABELS: Record<string, string> = {
  ADMIN: 'Admin',
  AUDITOR: 'Auditor',
  GS: 'GS (General Service)',
}

const SIGN_OUT_TIMEOUT_MS = 4000

// Only the browser holds sparta's own login cookie, so it calls sparta first.
// no-cors: sparta sends no CORS headers, and the response is not read.
async function signOut(spartaSignOutUrl: string | null) {
  if (spartaSignOutUrl) {
    await fetch(spartaSignOutUrl, {
      method: 'POST',
      mode: 'no-cors',
      credentials: 'include',
      signal: AbortSignal.timeout(SIGN_OUT_TIMEOUT_MS),
    }).catch(() => undefined)
  }

  try {
    const res = await fetch('/api/auth/logout', { method: 'POST' })
    if (!res.ok) throw new Error(String(res.status))
    const { redirectTo } = (await res.json()) as { redirectTo: string }
    window.location.assign(redirectTo)
  } catch {
    window.location.assign('/api/auth/session-invalid')
  }
}

export function initialsOf(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  const letters = parts.length > 1 ? parts[0][0] + parts[1][0] : name.slice(0, 2)
  return letters.toUpperCase() || '?'
}

export function UserMenuContent({
  viewer,
  links,
  side,
  align,
}: {
  viewer: ShellViewer
  links: SpartaLinks
  side: 'top' | 'bottom'
  align: 'start' | 'end'
}) {
  const roleLabel = ROLE_LABELS[viewer.role] ?? viewer.role

  return (
    <DropdownMenuContent side={side} align={align} className="w-64">
      <DropdownMenuGroup>
        <DropdownMenuLabel>
          <span className="block truncate text-foreground">{viewer.name}</span>
          <span className="block truncate">{viewer.email}</span>
          <span className="block truncate">
            Masuk sebagai {roleLabel}
            {viewer.simulated ? ' (simulasi dev)' : ''}
          </span>
        </DropdownMenuLabel>
      </DropdownMenuGroup>
      <DropdownMenuSeparator />
      <DropdownMenuGroup>
        {links.roleSwitch && (
          <DropdownMenuItem render={<a href={links.roleSwitch} />}>
            <ArrowLeftRight />
            Ganti Peran
          </DropdownMenuItem>
        )}
        <DropdownMenuItem variant="destructive" onClick={() => signOut(links.signOut)}>
          <LogOut />
          Keluar
        </DropdownMenuItem>
      </DropdownMenuGroup>
    </DropdownMenuContent>
  )
}
