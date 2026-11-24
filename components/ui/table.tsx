import * as React from 'react'
import { cn } from '@/lib/utils'

// scrollLabel names the table's own scroll area and makes it reachable by keyboard.
function Table({
  className,
  containerClassName,
  scrollLabel,
  ...props
}: React.ComponentProps<'table'> & { containerClassName?: string; scrollLabel?: string }) {
  return (
    <div
      data-slot="table-container"
      {...(scrollLabel ? { role: 'region', 'aria-label': scrollLabel, tabIndex: 0 } : {})}
      className={cn(
        'relative w-full overflow-x-auto rounded-2xl bg-card ring-1 ring-foreground/10 outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50',
        containerClassName
      )}
    >
      <table
        data-slot="table"
        className={cn('w-full caption-bottom text-sm', className)}
        {...props}
      />
    </div>
  )
}

// Borders of a sticky row scroll away with the rows, so the line is a shadow.
export const STICKY_HEADER_CLASS = 'sticky top-0 z-10 border-0 bg-muted shadow-[0_1px_0_var(--border)]'

function TableHeader({ className, ...props }: React.ComponentProps<'thead'>) {
  return (
    <thead
      data-slot="table-header"
      className={cn('border-b bg-muted/40 font-medium [&_tr]:border-b', className)}
      {...props}
    />
  )
}

function TableBody({ className, ...props }: React.ComponentProps<'tbody'>) {
  return (
    <tbody
      data-slot="table-body"
      className={cn('[&_tr:last-child]:border-0', className)}
      {...props}
    />
  )
}

function TableRow({ className, ...props }: React.ComponentProps<'tr'>) {
  return (
    <tr
      data-slot="table-row"
      className={cn(
        'border-b transition-colors hover:bg-muted/50',
        className
      )}
      {...props}
    />
  )
}

function TableHead({ className, ...props }: React.ComponentProps<'th'>) {
  return (
    <th
      data-slot="table-head"
      className={cn(
        'h-11 px-4 text-left align-middle text-xs font-medium text-muted-foreground whitespace-nowrap',
        className
      )}
      {...props}
    />
  )
}

function TableCell({ className, ...props }: React.ComponentProps<'td'>) {
  return (
    <td
      data-slot="table-cell"
      className={cn('p-4 align-middle text-sm whitespace-nowrap', className)}
      {...props}
    />
  )
}

export { Table, TableHeader, TableBody, TableRow, TableHead, TableCell }
