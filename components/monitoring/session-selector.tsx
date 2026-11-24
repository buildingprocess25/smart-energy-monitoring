'use client'

import { AuditSession } from '@/lib/types'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Calendar } from 'lucide-react'

interface SessionSelectorProps {
  sessions: AuditSession[]
  activeSessionId: string
  onSessionChange: (id: string) => void
}

export function SessionSelector({
  sessions,
  activeSessionId,
  onSessionChange,
}: SessionSelectorProps) {
  if (!sessions || sessions.length === 0) {
    return (
      <div className="flex h-10 items-center gap-2 rounded-md border px-3 text-sm text-muted-foreground">
        <Calendar className="size-4" />
        Tidak ada sesi audit
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2">
      <div className="hidden sm:flex h-10 items-center gap-2 rounded-l-md border border-r-0 bg-muted/50 px-3 text-sm text-muted-foreground">
        <Calendar className="size-4" />
        Sesi:
      </div>
      <Select 
        value={activeSessionId} 
        onValueChange={(val) => {
          if (val !== null) onSessionChange(val)
        }}
      >
        <SelectTrigger className="w-[240px] sm:rounded-l-none">
          <SelectValue>
            {(value: string | null) =>
              sessions.find((s) => s.id === value)?.label ?? 'Pilih sesi rekaman'
            }
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {sessions.map((session) => (
              <SelectItem key={session.id} value={session.id}>
                {session.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  )
}
