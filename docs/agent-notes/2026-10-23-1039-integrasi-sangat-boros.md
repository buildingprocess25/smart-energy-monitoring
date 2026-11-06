# Integrasi 12 Toko Sangat Boros

## Scope

Portal monitoring sekarang membaca view `v_toko_sangat_boros` milik
sparta-energy. Hasilnya: bagian "Prioritas Pasang IoT" di `/monitoring`, garis
standar konsumsi energi di grafik kWh harian dan bulanan, dan persentase
penurunan per hari yang hanya memakai fase panel utama R/S/T.

Di luar scope: perbaikan total bulanan yang tidak wajar (lihat Remaining Work),
halaman Rekomendasi Audit (tahap berikutnya di dokumen rancangan), dan
peringatan lint yang sudah ada sebelumnya di `telemetry-service.ts` dan
`store-detail-analytics.tsx`.

## Context and Sources

- Rancangan bersama: `C:\ALfa\sparta-energy\docs\integrasi-sangat-boros-monitoring.md`,
  bagian 4 nomor 1 sampai 7, disusun bersama sesi sparta-energy.
- Kontrak view final, termasuk `is_demo`. View dibuat oleh migrasi sparta-energy
  `20261023010000_add_view_toko_sangat_boros`.
- Graph: `getStoreAnalyticsData`, `store-detail-analytics.tsx`, `getStores`.
- Probe data read-only: fase per device di DB 2 dan isi view di DB 1.

## Changed Files

- `lib/types.ts`: `mainPanelKwh` di `DailyConsumption` dan
  `RealMonthlyConsumption`; tipe baru `SangatBorosStore`,
  `SangatBorosPriorityItem`, `SangatBorosListStatus`, `SangatBorosComparison`;
  `sangatBoros` di `StoreAnalyticsResult`.
- `lib/services/sangat-boros-service.ts` (baru): `getSangatBorosStores()`
  (error `42P01` menjadi status `missing`), `getSangatBorosByCode()`,
  `withInstallStatus()`, `compareWithSangatBoros()`.
- `lib/services/telemetry-service.ts`: query harian dan bulanan mengembalikan
  `main_kwh` (`SUM ... FILTER (WHERE phase IN ('R','S','T'))`) dalam query yang
  sama; `getStoreAnalyticsData()` menyertakan perbandingan Sangat Boros.
- `app/(dashboard)/monitoring/page.tsx`: mengambil view bersamaan dengan
  `getStores()`.
- `components/monitoring/sangat-boros-priority.tsx` (baru): tabel prioritas
  dengan label "Uji coba" dan status alat, plus state kosong, view belum ada,
  dan error.
- `components/dashboard/store-gallery.tsx`: menampilkan bagian prioritas di atas
  Daftar Toko.
- `components/monitoring/store-detail-analytics.tsx`: baris pembanding,
  `ReferenceLine` "Standar konsumsi energi" di grafik 7 hari dan bulanan,
  tooltip menampilkan kWh panel utama.
- `ARCHITECTURE_PLAN.md`: DB 1 bernama `energy`; bagian 7 berisi kontrak view.
- `AI_CONTEXT.md`, `CLAUDE.md`, `AGENTS.md`: aturan Sangat Boros, total toko
  R/S/T, service baru, dan isi halaman `/monitoring` yang benar.

## Decisions

- Status alat dihitung dari kode toko di `getStores()`. Kode itu berasal dari
  `extractStoreCode()` pada nama device, jadi tidak perlu query device kedua.
- Penurunan dihitung untuk bulan dari tanggal data terakhir (anchor), dibagi
  jumlah hari yang punya data R/S/T. Kalau belum ada data R/S/T, yang tampil
  pesan, bukan angka.
- Batang grafik tetap menampilkan total semua sensor seperti sebelumnya. Nilai
  panel utama muncul di tooltip dan menjadi dasar persentase.
- Garis baseline memakai warna amber, karena standar adalah acuan, bukan status
  baik atau buruk.
- Koreksi dari review sesi sparta-energy, semua diterapkan:
  - Tombol Detail setinggi 44px di layar kecil.
  - Pesan kosong dan error tanpa istilah teknis; detail teknisnya tetap ada di
    log server.
  - Label validasi disamakan dengan sparta ("Menunggu validasi" amber, "Sudah
    divalidasi" emerald).
  - Perbandingan Sangat Boros dihitung ulang setiap kali cache analytics
    (15 menit) terpakai, supaya kalkulasi baru di sparta langsung terlihat.

## Verification

- `npx tsc --noEmit`: lulus. `npx eslint` pada file baru: lulus.
- Dev server (port 3001), `/monitoring`: 12 toko tampil sesuai urutan view,
  1 label "Uji coba" (DEM1), 12 "Belum terpasang" (belum ada device di
  toko-toko ini).
- `/api/stores/1SIL/overview-analytics`: `sangatBoros` terisi (peringkat 2,
  standar 160,16 kWh/hari) dengan statistik `null` karena belum ada data.
  2JC2: `sangatBoros` null, `mainPanelKwh` = `kwh` (semua R/S/T). TI90:
  `mainPanelKwh` 0 (semua sub-metering).
- Tampilan baseline belum dilihat di browser, karena belum ada toko Sangat
  Boros yang punya data IoT.

## Remaining Work and Risks

- Total bulanan dari query bulanan yang sudah ada tidak wajar: 2JC2 Oktober
  2026 = 9.764.340 kWh, padahal per hari sekitar 170 kWh. Ini terjadi sebelum
  perubahan ini, tapi membuat garis baseline bulanan tidak berguna sampai
  diperbaiki.
- Garis baseline baru terlihat setelah alat dipasang di salah satu dari 12 toko.
- DEMO harus dikecualikan lewat migrasi sparta sebelum production.
- `GRANT SELECT` di production (Dokploy) belum dicek.
- Bagian Rekomendasi Audit (rancangan bagian 5) belum dikerjakan.
