export function NoAssignedDevices() {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed px-4 py-20 text-center">
      <p className="text-base font-semibold text-foreground">
        Belum ada alat yang di-assign ke akun Anda
      </p>
      <p className="mt-1 max-w-md text-sm text-muted-foreground">
        Admin SPARTA mengatur alat yang bisa Anda pantau di halaman User &amp; Akses. Hubungi admin
        untuk meminta akses.
      </p>
    </div>
  )
}
