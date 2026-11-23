# Dashboard streaming dan cache biaya bulanan

## Scope

- Dashboard (`/`) lambat setelah deploy alamat Flask. Penyebabnya `getMonthlyCostSummary()`: sekitar 12 detik, dan halaman menunggunya lewat `Promise.all`.
- Langkah 1: kartu biaya bulanan dan widget analitik toko di-stream lewat `<Suspense>`, sehingga daftar toko, KPI lain, peta, dan tabel tampil tanpa menunggu.
- Langkah 2: cache biaya bulanan menyajikan data lama sambil memperbarui di belakang.
- Di luar cakupan: mempercepat query itu sendiri (index atau tabel ringkasan di DB 2). Dicatat di `docs/backlog.md` untuk `smart-energy-meter-vps`.

## Context and Sources

- Pengukuran 2026-11-23 dari laptop ke DB 2 (hanya baca, `BEGIN READ ONLY`): `history` sekitar 2,1 juta baris (870 MB), `telemetry` sekitar 55 ribu. Query biaya bulanan semua perangkat 11,9 detik. Query tanggal dan delta harian analitik EM-0010 sekitar 1,1 dan 1,5 detik. Tiga query per perangkat di `getStores()` sekitar 0,85 detik total untuk 3 perangkat.
- Index `history` hanya diawali `id`, `session_id`, atau `(device_id, session_id, ...)`.
- Next.js `node_modules/next/dist/docs/01-app/02-guides/streaming.md`, skill `vercel-react-best-practices` (`async-suspense-boundaries`), `nextjs-app-router-patterns`, `impeccable` (mode Operate, refinement), `antislop-code`.

## Changed Files

- `lib/stale-cache.ts`: `createStaleCache()`, modul murni. Entri segar langsung dikembalikan; entri kedaluwarsa dikembalikan sambil satu refresh berjalan; refresh gagal mempertahankan nilai lama; load pertama yang gagal dilempar ulang dan tidak disimpan.
- `tests/stale-cache.test.mjs`: 6 tes, ditulis dan gagal sebelum modulnya ada. Didaftarkan di `test:data` (`package.json`).
- `lib/services/telemetry-service.ts`: query dipindah ke `loadMonthlyCostSummary(deviceFilter)` yang melempar error; `getMonthlyCostSummary()` memakai `createStaleCache` dengan kunci scope yang sama seperti sebelumnya. Isi SQL dan perhitungan tidak berubah.
- `app/(dashboard)/page.tsx`: hanya `getRequestScope()` dan `getStores()` yang ditunggu; dua promise lain diteruskan ke klien.
- `components/dashboard/dashboard-overview.tsx`: `MonthlyCostSection` dan `StoreAnalyticsSection` membaca promise dengan `use()` di dalam `<Suspense>`; fallback memakai `Skeleton`, `role="status"`, dan `motion-reduce` seperti `app/(dashboard)/loading.tsx`.
- `lib/services/store-service.ts`: komentar `loadCaptureStatus` dipadatkan, kode tidak berubah.
- `docs/backlog.md`: baru, berisi perbaikan permanen query energi di project Flask.
- `CLAUDE.md`, `AGENTS.md`: `stale-cache` di daftar modul murni dan catatan `getMonthlyCostSummary()`.

## Decisions

- Refresh latar belakang dimulai di request yang memicunya dan bisa selesai setelah respons terkirim, jadi `deviceFilter` dihitung sebelum loader dipanggil dan loader tidak membaca cookie. Satu-satunya pengecualian adalah cabang tanpa data sama sekali, yang memanggil `getStores()`; kalau itu gagal di latar belakang, nilai lama dipertahankan.
- Setelah refresh gagal, request berikutnya mencoba lagi (paling banyak satu refresh berjalan per kunci). Tidak ada jeda tambahan; kalau DB bermasalah, beban tetap satu query per kunci per percobaan.
- Request pertama setelah container start tetap menjalankan query 12 detik, tapi hanya kartu biaya yang menunggu, bukan halaman.
- `getStoreAnalyticsData()` tidak diberi cache baru: sudah punya cache 15 menit dan sekarang tidak menahan halaman.

## Verification

- `pnpm typecheck`: lulus.
- `pnpm test:data` 37/37 (6 baru), `pnpm test:access` 8/8, `pnpm test:params` 6/6.
- ESLint file yang diubah: tidak ada error atau warning baru dibanding HEAD.
- `pnpm build`: lulus.
- Detektor `impeccable detect` pada `dashboard-overview.tsx` dan `page.tsx`: tidak ada temuan.
- Belum: melihat halaman di browser. Halaman butuh sesi SSO asli; cek setelah deploy bahwa KPI, peta, dan tabel tampil sekitar 1 detik dan dua kartu menyusul.

## Remaining Work and Risks

- Query biaya bulanan tetap berjalan di database setiap 5 menit per scope dan makin berat seiring `history` bertambah. Perbaikan permanen ada di `docs/backlog.md`.
- Cache di memori hilang setiap deploy atau restart container.
