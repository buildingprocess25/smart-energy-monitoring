# Tombol "Kembali ke SPARTA" di header portal

## Latar belakang

Card Smart Energy Meter di sparta `/admin-entry` sekarang membuka portal monitoring di tab yang sama. Admin butuh jalan kembali ke sparta selain tombol Back di browser.

## Desain

- **URL:** `lib/sparta-url.ts` membentuk `SPARTA_ENTRY_URL` dari `NEXT_PUBLIC_SPARTA_AUDIT_URL` + `/admin-entry`. Nilainya `null` kalau env kosong. Sidebar dan header sama-sama memakai modul ini.
- **Siapa yang melihat:** `canReturnToSparta(role)` bernilai benar kalau URL ada dan role bukan GS. AREA dan USER sudah dialihkan ke sparta sebelum sampai ke portal, jadi praktisnya tombol ini terlihat untuk ADMIN dan AUDITOR.
- **Header:** di sisi kanan, sebelum tombol tema. Bentuknya `<a href>` di tab yang sama, dengan gaya `buttonVariants({ variant: 'outline' })`, ikon `ArrowLeft`, dan teks "Kembali ke SPARTA". Di bawah breakpoint `sm` teksnya menjadi `sr-only`, jadi nama aksesibelnya tetap ada. Pseudo-element `after:-inset-1.5` membuat area sentuh 44px tanpa mengubah ukuran tombol.
- **Sidebar:** "SPARTA Energy" dibuka di tab yang sama, dan ikon tab baru dihapus. Smart Energy Meter tetap dibuka di tab baru (flag `newTab`). Kalau env kosong, link SPARTA disembunyikan, bukan mengarah ke `#`.

## Di luar cakupan

- Tombol "Portal Monitoring IoT" di sparta `app/admin/stores/[id]/page.tsx` yang masih membuka tab baru.
- Fallback `'#'` pada `NEXT_PUBLIC_REALTIME_METER_URL`.
