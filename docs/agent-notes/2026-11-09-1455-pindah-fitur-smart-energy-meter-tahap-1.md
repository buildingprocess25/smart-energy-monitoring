# Pindah fitur Smart Energy Meter ke portal: Tahap 1

## Scope

- Grafik live per toko, daftar Sesi Rekaman, dan dokumen yang menjelaskan keduanya. Portal hanya membaca. Flask `smart-energy-meter-vps` tidak diubah.
- Di luar cakupan karena ditunda user pada 2026-11-09: export Excel/JSON sesi (Task 6) dan Buka File Rekaman (Task 8). Kode, dependensi `xlsx`, dan `lib/session-files.ts` untuk keduanya tidak ada.
- Di luar cakupan: semua penulisan (kontrol capture, rename, hapus). Itu Tahap 2 dan akan direncanakan ulang setelah Tahap 1 dipakai.

## Context and Sources

- Plan: `docs/superpowers/plans/2026-11-09-pindah-fitur-smart-energy-meter.md`.
- Fakta Flask yang dibaca 2026-11-09: Gunicorn 1 worker dengan 12 thread, MQTT, capture, live buffer, dan API dalam satu proses. Dashboard Flask sendiri memanggil `GET /api/live-buffer/<id>` tiap 3 detik per user.
- `ARCHITECTURE_PLAN.md`, `AI_CONTEXT.md`, `AI_RULES.md`, dan catatan `2026-11-03-0803-cache-per-request-dan-loading.md`.

## Changed Files

- `lib/phase-keys.ts`, `lib/live-buffer.ts`, `lib/shared-fetch.ts`, `lib/session-records.ts`, `lib/db/read-only.ts`: modul murni tanpa `@/`.
- `lib/services/telemetry-api.ts`, `lib/services/live-buffer-service.ts`, `lib/services/session-service.ts`: fetch ke Flask dan query `history`.
- `app/api/stores/[storeId]/live/route.ts`, `app/api/sessions/[sessionId]/records/route.ts`: route baca-saja dengan `requireApiAccess()` dan validasi param.
- `components/monitoring/live-telemetry-chart.tsx` (dipasang di `store-monitoring-page.tsx`), `app/(dashboard)/sesi-rekaman/page.tsx`, `components/sessions/session-table.tsx`, item sidebar dan label breadcrumb "Sesi Rekaman".
- `lib/request-params.ts`, `lib/types.ts`, `lib/services/telemetry-service.ts`: tambahan untuk fase dan parameter baru.
- `tests/phase-keys.test.mjs`, `tests/live-buffer.test.mjs`, `tests/shared-fetch.test.mjs`, `tests/read-only.test.mjs`, `tests/session-records.test.mjs`, tambahan di `tests/request-params.test.mjs`.
- `package.json`: skrip `test:data`. Entri `tests/session-files.test.mjs` dihapus karena file itu milik Task 6 yang ditunda.
- `.env.example`: `TELEMETRY_API_URL` (khusus server, fallback ke `NEXT_PUBLIC_TELEMETRY_API_URL`).
- Review akhir: `lib/auth/access-rules.ts` (`scopeKey`), `tests/access-rules.test.mjs`, `tests/read-only.test.mjs`, dan `lib/db/read-only.ts`, `lib/services/live-buffer-service.ts`, `lib/services/session-service.ts`, `lib/services/telemetry-api.ts`, `.env.example`, `CLAUDE.md` diubah lagi untuk temuan F1 sampai F4.
- `ARCHITECTURE_PLAN.md`: env baru dan bagian "Pengaman alur IoT". `AI_CONTEXT.md` dan `CLAUDE.md`: peta route, komponen, service, `pnpm test:data`, catatan `allowImportingTsExtensions`, dan larangan menjalankan Flask di lokal.

## Decisions

- Tidak ada `git commit`. Perubahan tetap di working tree untuk direview user.
- Tugas 6 dan 8 ditunda atas permintaan user. Dokumen tidak menyebut export atau Buka File sebagai fitur yang sudah ada.
- Flask tidak pernah dijalankan di lokal. Flask lokal ikut subscribe MQTT dan menulis ke database yang sama, jadi data terekam dua kali. Pengecekan memakai Flask di VPS lewat `TELEMETRY_API_URL`, hanya `GET`.
- Batas beban ke Flask: 1 panggilan per perangkat per 3 detik per container portal (`lib/shared-fetch.ts`), timeout 3 detik, jeda 15 detik setelah gagal. Polling grafik berhenti saat tab tersembunyi.
- Perbaikan review akhir: route `live` dulu memanggil `getStoreById()` di setiap poll. Itu menjalankan seluruh `getStores()`: panggilan Flask `/capture/status` tanpa cache dan tanpa jeda, query DB 1, dan query DB 2 per perangkat tanpa `statement_timeout`. Bebannya naik sesuai jumlah tab. Sekarang `lib/services/live-buffer-service.ts` menyimpan hasil toko ke perangkat per (scope akses, toko) selama 60 detik lewat `createSharedFetch`, dengan penggabungan request bersamaan dan jeda 15 detik setelah gagal. Kunci memuat `scopeKey(scope)` (dipindah ke `lib/auth/access-rules.ts`), jadi dua scope berbeda tidak pernah berbagi entri. Akibatnya akses GS yang dicabut baru berlaku di route ini paling lama 60 detik kemudian, dan itu diterima.
- `TELEMETRY_API_URL` wajib di environment runtime Dokploy. `NEXT_PUBLIC_TELEMETRY_API_URL` ditanam saat build dan image dibangun tanpa variabel itu, jadi fallback hanya berlaku di `pnpm dev`. `telemetry-api.ts` menulis `console.error` sekali per proses kalau keduanya kosong.
- `readOnlyQuery` menghancurkan client (`release(true)`) kalau `ROLLBACK` gagal, supaya client yang masih di dalam transaksi tidak kembali ke pool.
- Query sesi berjalan di `BEGIN READ ONLY` dengan `statement_timeout` 15 detik, maksimal 200.000 record, daftar sesi di-cache 30 detik per scope. Tidak ada pool baru: tetap `getTelemetryPool()` dengan `max: 10`.
- Lint sudah gagal sebelum Tahap 1 (sekitar 18 file lama, termasuk `telemetry-service.ts`, `store-monitoring-page.tsx`, `types.ts`). Ukuran lulus: tidak ada error lint baru di baris yang diubah.
- Memasang paket dengan pnpm saat Task 3 merusak dev server user di port 300 sampai di-restart. Jangan jalankan `pnpm add` atau `pnpm install` selagi dev server menyala.
- `num()` di `lib/session-records.ts` memetakan NULL ke 0. Kolom `history` punya default 0.0 dan Flask sendiri mengalikan nilainya, jadi NULL tidak muncul dalam praktik.

## Verification

- `pnpm test:data`: 29 tes lulus, 0 gagal.
- `pnpm typecheck` per task diverifikasi controller. Hasil akhir dijalankan controller.
- `pnpm check:agent-note`: dijalankan untuk catatan ini (hasil ada di laporan task).
- Belum dijalankan, dikerjakan controller bersama user setelah dev server di-restart:
  - Langkah 4: `pnpm test:params`, `pnpm test:access`, `pnpm typecheck`, `pnpm lint`, `pnpm build`, dan pengecekan browser Task 3, 4, 5, dan 7 di `pnpm dev`. `pnpm build` tidak dijalankan di sini karena bentrok dengan `.next` milik dev server user.
  - Langkah 4b, uji keamanan alur IoT: (1) grep tidak ada `insert|update|delete|alter|drop|truncate|create` di dalam SQL pada `session-service.ts`, `live-buffer-service.ts`, `telemetry-api.ts`, `read-only.ts`, `app/api/sessions`, dan route `live`; (2) `pool.query` kosong di `session-service.ts`; (3) satu toko LIVE di 5 tab selama 2 menit, paling banyak 40 panggilan ke Flask; (4) `TELEMETRY_API_URL` diarahkan ke port mati, grafik menampilkan "Gagal memuat", paling banyak 1 percobaan per perangkat per 15 detik, halaman lain tetap terbuka; (5) rekaman perangkat yang sedang aktif tidak punya celah timestamp selama uji; (6) koneksi dari alamat portal di `pg_stat_activity` paling banyak 10, dengan izin user karena menyentuh database produksi. Satu poin gagal berarti Tahap 1 belum boleh di-deploy.
  - Langkah 4c, rencana rollout (lihat bagian bawah).
- Pembaruan graph: `graphify update .` dijalankan (AST saja). Re-ekstraksi dokumen lewat `/graphify . --update` belum dijalankan dan diserahkan ke controller.

## Remaining Work and Risks

- Rencana rollout (deploy dilakukan user): deploy di luar jam sibuk toko. Setelah deploy, pantau log Flask dan satu sesi rekaman aktif selama 30 menit, lalu cek poin 5 di atas. Rollback: redeploy image portal sebelumnya. Flask tidak diubah, jadi rollback tidak menyentuh alur IoT.
- Task 6 (export Excel/JSON) dan Task 8 (Buka File Rekaman): ditunda. Saat dikerjakan, `xlsx` belum terpasang dan `tests/session-files.test.mjs` perlu ditambahkan kembali ke `test:data`.
- Tahap 2 (penulisan): token di semua `POST`/`DELETE` Flask, guard ADMIN di portal, route proxy, halaman `/pengaturan/perangkat`. Direncanakan terpisah.
- Verifikasi Langkah 4, 4b, 4c masih menunggu, dan pengecekan browser Task 3, 4, 5, 7 belum pernah jalan karena dev server rusak sampai restart.
- Temuan minor yang ditunda (dari ledger review):
  - Task 1: `DEFAULT_PALETTE` diekspor tanpa pemakai; tidak ada tes untuk kunci berisi spasi saja di `isPhaseKey`; `sensorColor` memakai `includes('ac')` yang ikut mengenai "Backup" dan "Space" (logika lama).
  - Task 2: flag offline mengikuti urutan array sementara `lastEpoch` berbasis nilai maksimum; sampel dengan `L12` dan `R` sekaligus menghitung `totalPower` dua kali; tidak ada tes untuk fase dummy dan pemulihan offline ke online; sampel yang hanya berisi metrik non-daya menampilkan total 0 W.
  - Task 3: eviction di `shared-fetch` bisa membuang entri yang sedang berjalan sehingga ada panggilan ganda ke Flask (relevan untuk batas 1 per 3 detik, perlu diputuskan di review akhir); tes eviction hanya menegaskan jumlah panggilan; format `storeId` tidak dicek di route `live`; respons 502 saat backoff tanpa `Retry-After`, dan 404 dari Flask ikut memicu jeda 15 detik; `pnpm-lock.yaml` berubah karena penulisan ulang kunci `supports-color` (versi tetap).
  - Task 4: titik lama tetap tampil saat error atau offline dan celah polling tidak ditandai; tidak ada fetch langsung saat tab kembali terlihat; `aria-label` berulang dengan judul; error 502 dan 404 memakai teks sama; reset ref di effect hanya sebagian (`lastEpoch`) dan bergantung pada `key` dari parent; label metrik panjang di tombol pada lebar 375px.
  - Task 5: (sudah diperbaiki di review akhir: `release(true)` saat `ROLLBACK` gagal, dan tes `scopeKey` di `tests/access-rules.test.mjs`); query nama perangkat tidak difilter scope (hanya di server, tidak bocor ke klien).
  - Task 7: sel Sensor kosong bila hanya ada fase yang dikecualikan; tanggal dan tautan bisa terpotong baris di layar sempit; tautan tanpa `focus-visible` (sama dengan `store-table`); jumlah hasil tidak diumumkan lewat `aria-live`.
