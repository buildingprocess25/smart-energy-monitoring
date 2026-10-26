import Link from 'next/link'
import { buttonVariants } from '@/components/ui/button'
import { spartaUrl } from '@/lib/auth/access'

export const metadata = {
  title: 'Akses Ditolak | Smart Energy Monitoring',
}

export default function AccessDeniedPage() {
  return (
    <main className="flex min-h-svh items-center justify-center bg-background p-4">
      <div className="flex max-w-md flex-col items-center gap-4 rounded-xl border bg-card p-6 text-center shadow-xs">
        <div>
          <h1 className="text-lg font-semibold text-foreground">
            Akun Anda tidak punya akses ke portal ini
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Portal monitoring IoT hanya untuk Admin, Auditor, dan GS. Kalau menurut Anda ini keliru,
            minta admin SPARTA memeriksa role akun Anda.
          </p>
        </div>
        <Link href={spartaUrl('/login')} className={buttonVariants({ variant: 'outline' })}>
          Kembali ke SPARTA Energy
        </Link>
      </div>
    </main>
  )
}
