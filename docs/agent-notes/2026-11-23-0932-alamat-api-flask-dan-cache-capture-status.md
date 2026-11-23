# Alamat API Flask dan cache status capture

## Scope

- Penyebab halaman monitoring lambat dan grafik live tidak mendapat data: portal memanggil Flask lewat `http://<IP VPS>:5000/api`, port yang ditolak dari luar (`ECONNREFUSED`).
- `getIotDeviceDataList()` sekarang memanggil `/capture/status` lewat `fetchTelemetryApi()` (`TELEMETRY_API_URL`) dengan cache bersama, bukan `fetch` ke IP yang ditulis di kode.
- Di luar cakupan: mengubah Flask atau service `dashboard` di Dokploy, dan mematikan dashboard lama (menunggu Tahap 2: kontrol capture, rename, hapus).

## Context and Sources

- Pengukuran dari laptop 2026-11-23: DB 1 dan DB 2 `SELECT 1` sekitar 7 ms; Flask lewat IP:5000 gagal 3 dari 3 kali setelah sekitar 2,1 detik; lewat domain dashboard lama `/capture/status` 0,2 sampai 0,5 detik dan `/live-buffer/<id>` (377 KB) 0,35 sampai 1 detik.
- Dokploy project `IoT-EnergyMeter / production`: Flask adalah service `dashboard` (image `smart-energy-meter-vps`). Dari terminal container `smart-energy-monitoring`, `wget http://<App Name dashboard>:5000/api/capture/status` menjawab JSON, jadi jaringan internal berfungsi.
- Env Dokploy portal yang diperlihatkan user: `TELEMETRY_API_URL` kosong, `NEXT_PUBLIC_TELEMETRY_API_URL` berisi IP:5000.
- Catatan `2026-11-09-1455-pindah-fitur-smart-energy-meter-tahap-1.md`.

## Changed Files

- `lib/services/store-service.ts`: `loadCaptureStatus` memakai `createSharedFetch` (TTL 5 detik, jeda 15 detik setelah gagal) di atas `fetchTelemetryApi('/capture/status', 1500)`; tipe respons dibuat eksplisit, satu `any` hilang.
- `.env` lokal (tidak di-commit): `TELEMETRY_API_URL` diganti ke domain dashboard lama.
- `.env.example`, `ARCHITECTURE_PLAN.md`, `CLAUDE.md`, `AGENTS.md`: cara mengisi `TELEMETRY_API_URL` di Dokploy (App Name service Flask) dan di lokal (domain), serta sumber status capture.

## Decisions

- Respons `/capture/status` sama untuk semua viewer; filter scope tetap dijalankan sesudahnya, jadi aman dibagi antar request dan antar user.
- Kalau Flask gagal, halaman tidak lagi menunggu timeout di setiap request: selama 15 detik langsung jatuh ke `capture_states` di DB. Status LIVE bisa terlambat paling lama 5 detik.
- Di Dokploy dipakai alamat internal, bukan domain: lebih cepat dan API Flask tidak perlu terbuka ke publik. `/api/capture/status` di domain saat ini bisa dibuka tanpa login.
- File tidak diformat ulang dengan Prettier: versi di HEAD sudah tidak sesuai Prettier, format ulang akan membuat diff seluruh file.

## Verification

- `pnpm typecheck`: lulus.
- `pnpm test:data`: 31 lulus, 0 gagal.
- ESLint `store-service.ts`: 4 error lama (`no-explicit-any`), sebelumnya 5; tidak ada yang baru.
- `pnpm test:access` 8/8, `pnpm test:params` 6/6, `pnpm test:agent-note` lulus.
- ESLint seluruh working tree: file baru bersih; file lama yang diubah tidak bertambah error/warning dibanding HEAD.
- `next build` produksi di salinan proyek tanpa `.env` (seperti GitHub Actions): lulus, semua route termasuk `/sesi-rekaman`, `/api/stores/[storeId]/live`, `/api/sessions/[sessionId]/records` terbentuk. Peringatan NFT dari `app/api/assets/[filename]/route.ts` sudah ada sebelumnya.
- Hasil build dijalankan di port 3100 tanpa login: kelima route API menjawab 401, halaman menjawab 307.
- Uji 4b poin 1 dan 2: tidak ada SQL tulis di file baru maupun `store-service.ts`, tidak ada `pool.query` di `session-service.ts`, semua panggilan ke Flask hanya GET.
- Port 3000 di laptop ternyata dev server `sparta-energy`, bukan portal ini. Pengukuran `/api/stores` di awal sesi mengenai sparta dan tidak dipakai; diagnosis Flask diukur langsung, jadi tetap berlaku.
- Belum: cek di browser dengan sesi SSO asli, dan uji 4b poin 3 sampai 6 (beban Flask, port mati, celah rekaman, koneksi DB) di produksi.

## Remaining Work and Risks

- User mengisi `TELEMETRY_API_URL=http://<App Name dashboard>:5000/api` di env Dokploy service `smart-energy-monitoring`. Efeknya baru ada setelah kode Tahap 1 dan perubahan ini di-deploy; kode yang jalan di produksi sekarang belum membaca variabel itu.
- Restart `pnpm dev` supaya `.env` baru terbaca pasti.
- Verifikasi Tahap 1 (build, browser, uji alur IoT Langkah 4b) masih harus dijalankan sebelum push ke `main`.
