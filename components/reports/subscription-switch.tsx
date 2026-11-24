'use client'

import { useCommand } from '@/components/devices/use-command'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'

export function SubscriptionSwitch({ subscribed, email }: { subscribed: boolean; email: string }) {
  const { run, pending, error } = useCommand()

  return (
    <div className="flex flex-col print:hidden">
      <Label className="min-h-10 font-normal">
        <Switch
          checked={subscribed}
          disabled={pending}
          onCheckedChange={(next) => run('/api/reports/subscription', { subscribed: next })}
        />
        <span>
          Langganan email
          <span className="text-muted-foreground max-sm:hidden"> ke {email}</span>
        </span>
      </Label>
      {error && (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      )}
    </div>
  )
}
