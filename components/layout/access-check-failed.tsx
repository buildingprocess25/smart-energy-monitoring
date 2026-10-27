export function AccessCheckFailed() {
  return (
    <main className="flex min-h-svh items-center justify-center bg-background p-4">
      <div className="max-w-md rounded-xl border bg-card p-6 text-center shadow-xs">
        <h1 className="text-lg font-semibold text-foreground">Akses tidak bisa diperiksa</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Portal tidak bisa terhubung ke database SPARTA untuk memeriksa akun Anda. Coba muat ulang
          halaman beberapa saat lagi.
        </p>
      </div>
    </main>
  )
}
