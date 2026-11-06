# Portal Akses Role Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Portal smart-energy-monitoring membaca sesi login sparta, menolak role USER dan AREA, membatasi user GS ke alat yang di-assign, dan menyediakan daftar alat untuk halaman User & Akses sparta.

**Architecture:** Aturan role dan lingkup akses ada di satu modul murni (`lib/auth/access-rules.ts`) yang diuji dengan `node --test`. Satu helper per request (`getRequestAccess`, dibungkus `React.cache`) membaca cookie `sso_session` dan `dev_role`, lalu tabel `session`, `users`, dan `user_device_access` di DB 1 (SELECT saja). Service menyaring device di `getIotDeviceDataList()` dan di dua query agregat, sehingga halaman dan API ikut terlindungi. `proxy.ts` hanya melakukan pemeriksaan ringan dan menandai path request.

**Tech Stack:** Next.js 16.2 (App Router, `proxy.ts`), React 19 `cache`, `pg`, Node 22 `node --test` (TypeScript berjalan langsung).

**Dokumen konsep:** repo sparta-energy, `docs/akses-role-admin-auditor-gs-area.md` (bagian 5 "smart-energy-monitoring" dan bagian 11).

## Global Constraints

- Portal tidak menulis ke DB 1 maupun DB 2. Tidak ada migrasi.
- Tidak ada commit; user yang commit.
- Nilai kontrak dengan sparta (dari `lib/role-access.ts` sparta): role `ADMIN`, `AUDITOR`, `GS`, `AREA`, `USER`; cookie sesi `sso_session`; cookie simulasi `dev_role`, hanya berlaku saat `NODE_ENV=development`; header `x-internal-token` berisi `MONITORING_INTERNAL_TOKEN`.
- Selama `MONITORING_INTERNAL_TOKEN` belum diisi di portal, `GET /api/stores` tetap terbuka seperti sekarang.
- Tabel `user_device_access` belum ada sampai migrasi sparta dijalankan. Error `42P01` berarti GS tanpa alat.
- GS simulasi memakai env `DEV_GS_DEVICE_IDS` (daftar `devices.id` dipisah koma).
- Redirect ke sparta memakai `NEXT_PUBLIC_SPARTA_AUDIT_URL`: tanpa sesi ke `/login`, USER ke `/dashboard`, AREA ke `/admin/dashboard`, link kembali ADMIN/AUDITOR ke `/admin-entry`.
- Teks UI dalam Bahasa Indonesia, tanpa em dash (antislop).

---

### Task 1: Aturan role dan lingkup (modul murni, TDD)

**Files:**
- Create: `lib/auth/access-rules.ts`
- Create: `tests/access-rules.test.mjs`
- Modify: `package.json` (script `test:access`)

**Interfaces:**
- Produces: `ROLES`, `type Role`, `SESSION_COOKIE`, `DEV_ROLE_COOKIE`, `INTERNAL_TOKEN_HEADER`, `PATHNAME_HEADER`, `isRole(v)`, `resolveRole(dbRole, devRole, isDev): Role | null`, `portalDecision(role): PortalDecision`, `type AccessScope`, `scopeFor(role, deviceIds): AccessScope`, `parseDeviceIds(raw): string[]`, `isDeviceAllowed(scope, id): boolean`, `isValidInternalToken(received, expected): boolean`.

- [ ] Tulis test: `resolveRole` memakai `dev_role` hanya saat dev dan nilainya role yang dikenal; `portalDecision` (ADMIN/AUDITOR/GS boleh; USER ke kalkulator; AREA ke dashboard admin; null/tak dikenal ditolak); `scopeFor` (ADMIN/AUDITOR semua, GS daftar alat unik, lainnya kosong); `parseDeviceIds` (spasi, koma ganda, uppercase dipertahankan); `isDeviceAllowed`; `isValidInternalToken` (env kosong selalu false, beda panjang false).
- [ ] Jalankan `node --test tests/access-rules.test.mjs`: harus gagal karena modul belum ada.
- [ ] Tulis modul tanpa import (supaya bisa diuji dengan Node langsung).
- [ ] Jalankan lagi: semua lulus.

### Task 2: Akses per request

**Files:**
- Create: `lib/auth/access.ts`

**Interfaces:**
- Consumes: Task 1, `getSpartaPool()`.
- Produces: `interface Viewer { userId: string; email: string; name: string; role: Role; simulated: boolean }`, `type RequestAccess = { status: 'anonymous' } | { status: 'error' } | { status: 'ok'; viewer: Viewer | null; scope: AccessScope; internal: boolean }`, `getRequestAccess(): Promise<RequestAccess>` (di-cache per request), `getRequestScope(): Promise<AccessScope>`, `spartaUrl(path): string`.

- [ ] Header `x-internal-token` valid: `ok`, scope semua, `internal: true`.
- [ ] Tanpa token env dan path `/api/stores` (dari header `PATHNAME_HEADER` yang dipasang proxy): scope semua (kompatibilitas sparta).
- [ ] Tanpa `sso_session`: `anonymous`.
- [ ] SELECT `users` lewat `session.token` dengan `expires_at > NOW()`. Gagal query: `error`.
- [ ] GS: alat dari `DEV_GS_DEVICE_IDS` kalau role disimulasikan, selain itu SELECT `user_device_access` (`42P01` menjadi daftar kosong).

### Task 3: Penyaringan di service

**Files:**
- Modify: `lib/services/store-service.ts` (`getIotDeviceDataList`, `getStoreById`)
- Modify: `lib/services/telemetry-service.ts` (`getDailyConsumptionTrend`, `getMonthlyCostSummary` dan cache-nya)

- [ ] `getIotDeviceDataList`: lingkup kosong mengembalikan `[]`; lingkup alat menyaring `dev.id`.
- [ ] `getStoreById`: kalau lingkup bukan "semua", jangan jatuh ke pencarian DB 1 untuk toko di luar lingkup.
- [ ] Dua query agregat: filter `device_id = ANY($1::text[])` untuk lingkup alat; cache biaya bulanan per lingkup.

### Task 4: Proxy dan route API

**Files:**
- Create: `proxy.ts`
- Create: `lib/auth/api-guard.ts`
- Modify: lima route di `app/api/stores/...`
- Create: `app/api/internal/devices/route.ts`

- [ ] `proxy.ts` selalu memasang header `PATHNAME_HEADER`. Halaman tanpa `sso_session` diarahkan ke login sparta.
- [ ] `requireApiAccess()`: 401 untuk `anonymous`, 503 untuk `error`.
- [ ] `/api/internal/devices`: hanya untuk akses `internal`. Isinya id, nama, kode toko, nama toko, dan sensor.

### Task 5: Halaman dan tampilan

**Files:**
- Modify: `app/(dashboard)/layout.tsx`, `components/layout/admin-shell.tsx`, `components/layout/app-sidebar.tsx`
- Modify: `app/(dashboard)/page.tsx`, `app/(dashboard)/monitoring/page.tsx`
- Create: `components/layout/no-assigned-devices.tsx`, `components/layout/access-check-failed.tsx`, `app/akses-ditolak/page.tsx`

- [ ] Layout: tanpa sesi ke login sparta; USER/AREA ke sparta; role tak dikenal ke `/akses-ditolak`; gagal cek akses tampil pesan.
- [ ] Sidebar: nama, email, dan label role dari sesi; link SPARTA Energy untuk ADMIN/AUDITOR ke `/admin-entry`, disembunyikan untuk GS.
- [ ] GS: Prioritas Pasang IoT disembunyikan; tanpa alat tampil pesan "Belum ada alat yang di-assign ke akun Anda".

### Task 6: Verifikasi dan dokumen

- [ ] `pnpm typecheck`, `npx eslint` pada file baru, `node --test`.
- [ ] Dev server: cek halaman dan API untuk tanpa sesi, ADMIN, GS (simulasi), USER, AREA.
- [ ] `.env.example`, `CLAUDE.md`, `AGENTS.md`, `AI_CONTEXT.md`, task note.
- [ ] Kirim file:line ke sesi sparta-energy.
