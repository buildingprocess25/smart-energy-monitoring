'use client'

import { useSyncExternalStore } from 'react'
import { Check, Monitor, Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

const THEME_OPTIONS = [
  { value: 'light', label: 'Terang', icon: Sun },
  { value: 'dark', label: 'Gelap', icon: Moon },
  { value: 'system', label: 'Sistem', icon: Monitor },
] as const

const noSubscription = () => () => {}

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  // The stored theme is unknown on the server, so the first render shows Sistem.
  const mounted = useSyncExternalStore(noSubscription, () => true, () => false)
  const active = mounted ? (theme ?? 'system') : 'system'
  const ActiveIcon = (THEME_OPTIONS.find((o) => o.value === active) ?? THEME_OPTIONS[2]).icon

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            type="button"
            variant="outline"
            size="icon-sm"
            aria-label="Pilih tema"
            className="relative after:absolute after:-inset-1.5"
          />
        }
      >
        <ActiveIcon aria-hidden="true" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        <DropdownMenuGroup>
          {THEME_OPTIONS.map(({ value, label, icon: Icon }) => (
            <DropdownMenuItem key={value} onClick={() => setTheme(value)}>
              <Icon aria-hidden="true" />
              {label}
              {active === value && <Check aria-label="dipilih" className="ml-auto" />}
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
