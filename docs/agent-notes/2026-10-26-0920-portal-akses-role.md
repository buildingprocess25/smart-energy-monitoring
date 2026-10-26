# Portal Akses Role (Admin, Auditor, GS)

## Scope

Portal membaca sesi login sparta-energy, menolak role USER dan AREA, membatasi
user GS ke alat yang di-assign, dan menyediakan daftar alat untuk checklist GS
di halaman User & Akses sparta. Tidak ada penulisan ke database dan tidak ada
migrasi.

## Context and Sources

- Konsep: repo sparta-energy, `docs/akses-role-admin-auditor-gs-area.md`
  (bagian 5 "smart-energy-monitoring" dan bagian 11).
- Kontrak sparta: `lib/role-access.ts` (role, `dev_role`, `resolveRole`,
  `getHomeUrl`), `app/api/dev-login/route.ts`, `lib/iot-status.ts`.
- Rencana: `docs/superpowers/plans/2026-10-26-portal-akses-role.md`.
- Next 16: `node_modules/next/dist/docs/01-app/01-getting-started/16-proxy.md`.

## Changed Files

- `lib/auth/access-rules.ts`, `tests/access-rules.test.mjs`, `package.json`
  (`test:access`): aturan role dan lingkup, 6 test.
- `lib/auth/access.ts`: `getRequestAccess()` dan `getRequestScope()`.
- `lib/auth/api-guard.ts`: `requireApiAccess()` dan `requireInternalAccess()`.
- `proxy.ts`: halaman tanpa `sso_session` ke login sparta; memasang header path.
- `lib/services/store-service.ts`: penyaringan di `getIotDeviceDataList()`;
  `getStoreById()` tidak mencari toko di luar lingkup.
- `lib/services/telemetry-service.ts`: filter device di
  `getDailyConsumptionTrend()` dan `getMonthlyCostSummary()`; cache biaya
  bulanan per lingkup.
- Lima route `app/api/stores/...`: `requireApiAccess()`.
- `app/api/internal/devices/route.ts`: daftar alat untuk sparta (butuh token).
- `app/(dashboard)/layout.tsx`, `components/layout/admin-shell.tsx`,
  `components/layout/app-sidebar.tsx`: cek role di server, sidebar memakai user
  yang login, link SPARTA ke `/admin-entry` (disembunyikan untuk GS).
- `app/(dashboard)/page.tsx`, `app/(dashboard)/monitoring/page.tsx`: GS tanpa
  alat melihat pesan; Prioritas Pasang IoT hanya untuk ADMIN dan AUDITOR.
- `components/layout/no-assigned-devices.tsx`,
  `components/layout/access-check-failed.tsx`, `app/akses-ditolak/page.tsx`.
- `.env.example`, `CLAUDE.md`, `AGENTS.md`, `AI_CONTEXT.md`: dokumentasi akses.
- `app/api/auth/logout/route.ts` dan menu "Keluar" di sidebar: tombol keluar
  memanggil `POST /api/auth/sign-out` sparta (sparta menghapus baris sesi dan
  cookie-nya), lalu route portal menghapus cookie yang terlihat dari portal dan
  mengarahkan ke login sparta.
- `.env` lokal: `DEV_GS_DEVICE_IDS="EM-0010"` untuk testing GS (tidak dilacak
  git).

## Decisions

- Pemeriksaan izin dilakukan di server (layout, service, route), sedangkan
  `proxy.ts` hanya memeriksa ada atau tidaknya cookie, sesuai panduan Next 16.
- Toko di luar lingkup GS mendapat 404 seperti toko yang tidak ada, supaya
  keberadaannya tidak bocor.
- Kompatibilitas sparta: selama `MONITORING_INTERNAL_TOKEN` kosong,
  `GET /api/stores` tetap terbuka. Path dibaca dari header yang selalu ditimpa
  `proxy.ts`, jadi header palsu dari klien tidak berpengaruh.
- Gagal membaca DB 1 berarti akses ditolak (503 atau pesan), tidak pernah
  "lihat semua".

## Verification

- `pnpm typecheck` lulus. `npx eslint` pada file yang diubah lulus.
  `node --test tests/access-rules.test.mjs`: 6 lulus.
- Dev server tanpa sesi: `/`, `/monitoring`, dan `/monitoring/2JC2` diarahkan
  307 ke `http://localhost:3000/login`; `/akses-ditolak` 200; `GET /api/stores`
  200 (kompatibilitas); API toko 401; `/api/internal/devices` 401.
- Cookie sesi palsu (dengan atau tanpa `dev_role`), header path palsu, dan token
  internal salah: semuanya ditolak.
- `GET /api/auth/logout`: 307 ke `http://localhost:3000/login` dengan
  `sso_session` dan `dev_role` dihapus (`Max-Age=0`). Panggilan ke sign-out sparta
  dari browser belum diuji.
- Role ADMIN, AUDITOR, GS, USER, dan AREA belum diuji dengan sesi sungguhan,
  karena sesi hanya bisa dibuat lewat tombol Masuk Cepat sparta, yang menulis
  baris ke tabel `session` di DB live.

## Remaining Work and Risks

- Uji manual per role lewat tombol Masuk Cepat sparta (dilakukan user).
- `.env` sparta belum punya `ENERGY_MONITORING_URL=http://localhost:3001`, jadi
  tombol GS akan mengarah ke portal production sampai env itu diisi.
- Migrasi role dan tabel `user_device_access` di sparta belum dijalankan.
- `MONITORING_INTERNAL_TOKEN` perlu diisi di kedua repo sebelum production.
