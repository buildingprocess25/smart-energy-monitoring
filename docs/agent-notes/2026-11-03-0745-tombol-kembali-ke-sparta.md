# Tombol "Kembali ke SPARTA" di header portal

## Scope

Menambah tombol "Kembali ke SPARTA" di header portal, dan membuka link sidebar "SPARTA Energy" di tab yang sama. Tombol "Portal Monitoring IoT" di sparta tidak termasuk.

## Context and Sources

- Permintaan dari sesi sparta-energy: card Smart Energy Meter di `/admin-entry` sekarang membuka portal di tab yang sama.
- Spesifikasi: `docs/superpowers/specs/2026-11-03-tombol-kembali-ke-sparta-design.md`.
- Kode yang dibaca: `components/layout/app-header.tsx`, `app-sidebar.tsx`, `admin-shell.tsx`, `components/ui/button.tsx`, `lib/auth/access-rules.ts`.

## Changed Files

- `lib/sparta-url.ts`: baru. Berisi `SPARTA_AUDIT_URL`, `SPARTA_ENTRY_URL` (`null` kalau env kosong), dan `canReturnToSparta(role)`.
- `components/layout/app-header.tsx`: menerima prop `spartaHref` dan menampilkan tombol kembali.
- `components/layout/admin-shell.tsx`: meneruskan `spartaHref` sesuai role viewer.
- `components/layout/app-sidebar.tsx`: memakai `lib/sparta-url.ts`, menambah flag `newTab` dan `spartaEntry`, membuka SPARTA di tab yang sama, dan menyembunyikan link itu kalau env kosong.

## Decisions

- Tidak perlu env baru. `NEXT_PUBLIC_SPARTA_AUDIT_URL` sudah ada.
- Tombol ditaruh di sisi kanan, karena sisi kiri berisi tombol sidebar dan breadcrumb (posisi di dalam portal), sedangkan tombol ini berarti pindah aplikasi.
- Teksnya "Kembali ke SPARTA", sama dengan penulisan merek di sidebar ("SPARTA Energy").
- Ikon lucide `ArrowLeft`, karena proyek ini memakai lucide, bukan Tabler.
- Link sidebar SPARTA dibuka di tab yang sama, atas pilihan user.

## Verification

- `pnpm typecheck`: lulus.
- eslint pada file yang diubah: lulus. `pnpm lint` penuh gagal karena error lama di file lain (misalnya `scripts/copy-assets.js`, `hooks/use-mobile.ts`).
- Kontras (rumus WCAG dari token `globals.css`): teks tombol 18,4:1 (terang) dan 14,2:1 (gelap). Border fokus `--ring` 4,1:1 dan 3,8:1.
- Belum dicek di app yang berjalan. `next-dev-loop` butuh Next.js 16.3+ (proyek memakai 16.2.6) dan `agent-browser` (belum terpasang).

## Remaining Work and Risks

- Uji manual: sebagai ADMIN, buka portal dari card sparta, klik tombol, harus mendarat di `/admin-entry` dengan sesi masih aktif. Dengan `dev_role=GS`, tombol dan link sidebar tidak tampil. Cek juga di lebar HP (360px) bahwa header tidak overflow.
- Di sparta, tombol "Portal Monitoring IoT" di `app/admin/stores/[id]/page.tsx` masih membuka tab baru. Menunggu keputusan user.
