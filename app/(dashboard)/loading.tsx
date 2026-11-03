import { Skeleton } from '@/components/ui/skeleton'

// Shown inside AdminShell while a dashboard page reads its data; the role check in layout.tsx runs first.
export default function DashboardLoading() {
  return (
    <div role="status" aria-live="polite" className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Skeleton className="h-6 w-48 motion-reduce:animate-none" />
        <p className="text-sm text-muted-foreground">Mengambil data toko dan perangkat IoT</p>
      </div>
      <Skeleton className="h-28 w-full rounded-xl motion-reduce:animate-none" />
      <Skeleton className="h-72 w-full rounded-xl motion-reduce:animate-none" />
    </div>
  )
}
