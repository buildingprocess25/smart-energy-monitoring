'use client'

import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export interface Choice {
  value: string
  label: string
}

export function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <Label className="min-w-0 flex-col items-stretch font-normal">
      <span className="font-medium">{label}</span>
      {children}
    </Label>
  )
}

export function SelectField({
  label,
  value,
  choices,
  onChange,
}: {
  label: string
  value: string
  choices: Choice[]
  onChange: (value: string) => void
}) {
  return (
    <div className="flex min-w-0 flex-col gap-2">
      <span aria-hidden="true" className="text-sm leading-none font-medium">
        {label}
      </span>
      <Select items={choices} value={value} onValueChange={(next) => next !== null && onChange(next)}>
        <SelectTrigger aria-label={label} className="w-full min-w-0">
          <SelectValue className="truncate" />
        </SelectTrigger>
        <SelectContent alignItemWithTrigger={false} align="start" className="w-auto max-w-[calc(100vw-2rem)] min-w-(--anchor-width)">
          <SelectGroup>
            {choices.map((c) => (
              <SelectItem key={c.value} value={c.value}>
                {c.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  )
}

export function Check({
  label,
  checked,
  disabled = false,
  onChange,
}: {
  label: React.ReactNode
  checked: boolean
  disabled?: boolean
  onChange: (checked: boolean) => void
}) {
  return (
    <Label className="min-h-10 leading-normal font-normal lg:min-h-8">
      <Checkbox checked={checked} disabled={disabled} onCheckedChange={onChange} />
      <span>{label}</span>
    </Label>
  )
}
