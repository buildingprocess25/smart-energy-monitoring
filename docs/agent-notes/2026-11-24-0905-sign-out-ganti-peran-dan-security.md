# Sign-out, Ganti Peran, dan security

## Scope

- Urutan 1 dari rencana performa, security, SSO, dan UI yang disetujui user pada 2026-11-24: Keluar, link sidebar, Ganti Peran, upgrade Next.js, batas waktu query.
- Di luar cakupan: angka energi yang salah, tampilan mengikuti Energy, detail toko bertahap, cache, query perangkat, migrasi fitur dashboard lama, dan filter `u.is_active`.

## Context and Sources

- Header produksi 2026-11-24: CSP `connect-src 'self'` tanpa origin sparta, dan `/api/auth/session-invalid` mengalihkan ke `http://0.0.0.0:3000/akses-ditolak?alasan=sesi`.
- Screenshot user: menu "SPARTA Energy" hilang dan "Smart Energy Meter" membuka web yang sama, karena image dibangun tanpa `NEXT_PUBLIC_*`.
- sparta-energy: `proxy.ts`, `lib/auth/sso-cookie.ts`, `lib/auth/role-access.ts`, `components/admin/admin-shell.tsx`.
- Skill: `test-driven-development`, `verification-before-completion`, `impeccable`, `antislop-ui`, `antislop-copywriting`, `antislop-code`.

## Changed Files

- `lib/sparta-url.ts`, `app/(dashboard)/layout.tsx`: URL sparta dibaca di server dan dikirim sebagai props.
- `lib/security-headers.ts`, `proxy.ts`, `next.config.ts`: CSP dibuat per request; file aset punya CSP sendiri; `X-Powered-By` dimatikan.
- `lib/auth/session-cookie.ts`, `lib/auth/sparta-sign-out.ts`, `app/api/auth/logout/route.ts`: logout menjadi `POST`, mengakhiri sesi di sparta dari server, dan menghapus cookie di host serta domain bersama.
- `lib/relative-redirect.ts`, `app/api/auth/session-invalid/route.ts`: redirect relatif.
- `components/layout/user-menu.tsx` (baru), `app-sidebar.tsx`, `app-header.tsx`, `admin-shell.tsx`: menu profil di sidebar dan header berisi Ganti Peran dan Keluar; "Kembali ke SPARTA", "Smart Energy Meter", dan "SPARTA Energy" dihapus.
- `lib/db/pools.ts`: `statement_timeout` 30 detik untuk kedua pool.
- `package.json`, `pnpm-lock.yaml`: `next` dan `eslint-config-next` 16.4.6; `shadcn` pindah ke devDependencies (naik 4.16 ke 4.23).
- `tests/sign-out.test.mjs`, `tests/pools.test.mjs`: baru.
- `CLAUDE.md`, `AGENTS.md`, `ARCHITECTURE_PLAN.md`, `.env.example`: aturan baru dan env yang tidak dipakai lagi dihapus.
- `docs/superpowers/plans/2026-11-24-migrasi-fitur-dashboard-meter.md`: usulan migrasi fitur, belum disetujui.

## Decisions

- URL sparta tidak dijadikan build arg. Nilai runtime cukup, jadi GitHub Actions dan Dockerfile tidak berubah.
- Browser memanggil sparta lebih dulu karena hanya browser yang memegang cookie better-auth. Server portal menjadi cadangan kalau panggilan itu gagal.
- Kalau sparta tidak bisa dihubungi, cookie portal tetap dihapus dan kegagalan ditulis ke log; baris sesi bisa hidup sampai kedaluwarsa.
- Batas 30 detik memberi ruang untuk query biaya bulanan (sekitar 12 detik).
- Menu Smart Energy Meter dihapus atas keputusan user. Kontrol rekaman masih ada di dashboard lama sampai migrasi selesai.

## Verification

- Tes ditulis dan gagal lebih dulu. `test:access` 16/16, `test:data` 38/38, `test:params` 6/6. `pnpm typecheck` dan `pnpm build` lulus.
- ESLint seluruh repo: 25 error (sama seperti sebelumnya) dan 21 warning (sebelumnya 20). Yang baru: `window.location.assign` ke route API, disengaja karena butuh navigasi penuh.
- `pnpm audit --prod`: 112 temuan (6 kritis) menjadi 17 (0 kritis).
- Salinan proyek tanpa `.env`, build standalone, sparta tiruan, Edge: link, CSP, cookie, dan redirect sesuai; Keluar memanggil sparta dari browser dan server lalu membuka `/login`; GS tidak melihat Ganti Peran; tanpa overflow di 360 px; tanpa error console.
- Belum: login asli, DB asli, dan sparta asli.

## Remaining Work and Risks

- Setelah deploy: cek Keluar dengan akun asli, token lama harus ditolak. Pastikan `NEXT_PUBLIC_SPARTA_AUDIT_URL` dan `SSO_COOKIE_DOMAIN` terisi di env runtime Dokploy.
- `statement_timeout` dikirim sebagai parameter koneksi; PgBouncer bisa menolaknya. Koneksi sekarang langsung ke PostgreSQL port 5432 menurut dokumen env.
- `shadcn/tailwind.css` ikut naik versi; cek tampilan komponen setelah deploy.
- 17 temuan audit tersisa; jalur yang diperiksa berasal dari alat Prisma, ditambah `nanoid` dan `source-map-js` yang jalurnya belum diperiksa.
