# AI Context - SPARTA Smart Energy Monitoring

## Project Overview

`smart-energy-monitoring` adalah portal visualisasi untuk memantau konsumsi
listrik toko Alfamart dari alat IoT energy meter (ESP32) yang dipasang di toko.

Tujuan utama:

- Menunjukkan toko mana yang sedang direkam alat IoT, pernah direkam, atau
  belum pernah dipasang alat.
- Menampilkan data listrik 3 fase (tegangan, arus, daya, power factor,
  energi) secara live dan historis.
- Menghitung konsumsi kWh dan estimasi biaya PLN per toko, per hari, minggu,
  bulan, dan tahun.

Aplikasi ini hanya membaca dan menampilkan data. Input audit manual ada di
`sparta-energy`, sedangkan penerimaan data MQTT dan perekaman sesi ada di
`smart-energy-meter-vps`. Lihat `ARCHITECTURE_PLAN.md`.

## Target Users

- **Auditor energi**: melihat hasil rekaman IoT sebagai pembanding audit
  manual di `sparta-energy`.
- **Teknisi lapangan**: memastikan alat di toko online dan sedang merekam.
- **Manajer operasional / supervisor energi**: membandingkan konsumsi dan biaya
  antar toko dan cabang.

Belum ada login. Rencananya autentikasi memakai SSO better-auth bersama
`sparta-energy` (tabel `users`, `sessions`, `accounts` di DB 1).

## Alur Pengguna

1. **Overview (`/`)**
   - Ringkasan KPI, kartu biaya PLN bulanan (default bulan terbaru, ada opsi
     "Semua Periode (Total)" dan riwayat dalam Sheet).
   - Peta jaringan toko (Leaflet) dengan pin sesuai status.
   - Widget analitik toko: pilih toko dan tanggal, lihat tren energi dan
     profil beban tanpa pindah halaman.
   - Galeri dan tabel toko dengan filter status.
2. **Daftar monitoring (`/monitoring`)**
   - **Prioritas Pasang IoT**: 12 toko Sangat Boros dari SPARTA Energy, dengan
     status alat Terpasang atau Belum terpasang (lihat bagian Toko Sangat Boros).
   - **Daftar Toko**: hanya toko yang sudah punya device IoT, beserta statusnya.
3. **Detail toko (`/monitoring/[storeId]`)**
   - Hero toko, gauge fase R/S/T live, pemilih sesi rekaman.
   - Grafik telemetri dengan rentang hari, minggu, bulan, tahun, atau sesi;
     navigasi `<` / `>` per periode dan pintasan "Data Terbaru".
   - Kartu sensor per equipment (sub-metering) dengan nama yang sudah
     dibersihkan.

## Status Toko

| Status | Arti di kode (`lib/services/store-service.ts`) | Warna pin |
| :--- | :--- | :--- |
| `live` | Device toko sedang merekam **atau** online | Hijau |
| `historical` | Device tertaut ke toko, punya data, tetapi offline | Biru |
| `unassigned` | Belum ada device yang tertaut ke toko | Abu-abu |

Beberapa device dengan kode toko yang sama (misal `EM-0005` dan `EM-0006`
untuk toko `TI90`) digabung menjadi satu toko. Sesi aktif di salah satu device
menaikkan status toko, tidak tertutup oleh device lain yang idle.

## Aturan Perhitungan Telemetri

Semua aturan ini ada di `lib/services/telemetry-service.ts`.

### Zona waktu dan tanggal

- Pengelompokan per jam, hari, bulan, dan tahun memakai `Asia/Jakarta` di SQL:
  `TO_TIMESTAMP(epoch / 1000.0) AT TIME ZONE 'Asia/Jakarta'`.
- Tampilan analitik dibuka pada **tanggal terakhir yang punya data** untuk
  toko itu, bukan hari ini dan bukan tanggal yang di-hardcode.

### Normalisasi fase

- Topik MQTT berganti pada 28 Agustus 2026. Supaya data lama dan baru
  menyambung:
  - `L12`, `L1`, `R` → **R**
  - `L13`, `L2`, `S` → **S**
  - `L14`, `L3`, `T` → **T**
- Fase `L6` dan fase yang namanya mengandung `dummy` diabaikan.
- Nama equipment untuk sub-metering diambil dari `devices.sensors` dan
  `history.phase_name`.

### Energi (kWh)

- Kolom `energy` adalah counter kumulatif. Konsumsi per interval adalah
  **selisih** counter (`MAX - MIN`) dalam interval itu, bukan nilai mentahnya.
- **Rollover guard**: jika selisih melebihi yang mungkin secara fisik dari daya
  rata-rata di interval itu, counter dianggap reset, dan konsumsi dihitung
  ulang sebagai daya rata-rata × durasi interval.
- Data dari tabel `telemetry` (snapshot 15 menit) dan `history` (rekaman
  sesi) digabung (union) supaya tidak ada celah.
- Riwayat telemetri dipaginasi 96 titik per hari (interval 15 menit).

### Biaya PLN

- Tarif: **Rp 1.444,7 per kWh** (`PLN_TARIFF`).
- Biaya = `Math.round(kWh × PLN_TARIFF)`.

### Format angka

- Locale `id-ID` (misal `0,08 kWh`). Delta energi memakai 2 desimal.

## Toko Sangat Boros

- Sumber: view read-only `v_toko_sangat_boros` di DB 1 (database `energy`),
  dibuat dan dimiliki `sparta-energy`. Isinya 12 toko boros dengan selisih
  terbesar antara rata-rata tagihan PLN dan standar konsumsi energi.
- Status alat: **Terpasang** kalau `store_code` cocok dengan kode toko dari nama
  device (`extractStoreCode()`, huruf besar). Selain itu **Belum terpasang**.
- Baris `is_demo = true` (cabang DEMO) diberi label **Uji coba**.
- Garis **Standar konsumsi energi** muncul di grafik kWh harian (7 hari, pakai
  `standar_konsumsi_kwh_per_hari`) dan bulanan (pakai
  `standar_konsumsi_kwh_per_bulan`), hanya untuk toko yang ada di view.
- **Total toko = fase panel utama R/S/T saja** (`L1/L12/R`, `L2/L13/S`,
  `L3/L14/T`). Sensor sub-metering per equipment tidak dihitung, supaya tidak
  dobel. Nilainya ada di `mainPanelKwh` per hari dan per bulan.
- **Persentase penurunan dihitung per hari** pada bulan dari tanggal data
  terakhir: rata-rata harian panel utama = total kWh R/S/T ÷ jumlah hari yang
  punya data R/S/T. Penurunan terhadap PLN = (aktual PLN ÷ 30 − rata-rata
  harian) ÷ (aktual PLN ÷ 30) × 100. Terhadap standar = (rata-rata harian −
  standar per hari) ÷ standar per hari × 100. Kalau belum ada data R/S/T,
  tampil pesan, bukan angka.

## Codebase Map

Routes (App Router):

- `/` → `app/(dashboard)/page.tsx` (memanggil `getStores`,
  `getStoreAnalyticsData`, `getMonthlyCostSummary`)
- `/monitoring` → `app/(dashboard)/monitoring/page.tsx`
- `/monitoring/[storeId]` → `app/(dashboard)/monitoring/[storeId]/page.tsx`
- Layout dashboard → `app/(dashboard)/layout.tsx` (AdminShell)

API routes (read-only JSON):

- `GET /api/stores` → `getStores`
- `GET /api/stores/[storeId]` → `getStoreById`, `getAuditSessions`,
  `getLiveTelemetry`
- `GET /api/stores/[storeId]/history` → `getTelemetryHistory`
- `GET /api/stores/[storeId]/telemetry` → `getLiveTelemetry`
- `GET /api/stores/[storeId]/overview-analytics` → `getStoreAnalyticsData`
- `GET /api/assets/[filename]` → aset logo

Komponen:

- Shell → `components/layout/admin-shell.tsx`, `app-sidebar.tsx`,
  `app-header.tsx`, `breadcrumb-nav.tsx`, `theme-toggle.tsx`
- Overview → `components/dashboard/dashboard-overview.tsx`,
  `dashboard-kpi-summary.tsx`, `monthly-cost-kpi-card.tsx`,
  `network-map-widget.tsx`, `network-map-leaflet.tsx`,
  `store-analytics-widget.tsx`, `store-gallery.tsx`, `store-card.tsx`,
  `store-table.tsx`, `gallery-toolbar.tsx`, `status-badge.tsx`
- Prioritas Pasang IoT → `components/monitoring/sangat-boros-priority.tsx`
- Detail toko → `components/monitoring/store-monitoring-page.tsx`,
  `store-hero.tsx`, `store-detail-analytics.tsx`, `phase-gauge-grid.tsx`,
  `circular-gauge.tsx`, `telemetry-chart.tsx`, `telemetry-date-picker.tsx`,
  `session-selector.tsx`
- UI primitives (shadcn) → `components/ui/*`

Data dan infrastruktur:

- Pool database → `lib/db/pools.ts` (`getSpartaPool`, `getTelemetryPool`,
  alias `getAivenPool`)
- Toko dan device → `lib/services/store-service.ts`
- Telemetri, analitik, biaya → `lib/services/telemetry-service.ts`
- Toko Sangat Boros (view DB 1) → `lib/services/sangat-boros-service.ts`
- Tipe data → `lib/types.ts`
- Data mock lama (tidak dipakai lagi) → `lib/mock-data.ts`
- Utilitas → `lib/utils.ts`, `hooks/use-mobile.ts`

## Product UX Direction

- Tampilan identik dengan AdminShell `sparta-energy` supaya kedua aplikasi
  terasa satu sistem.
- Light mode utama dengan aksen emerald `#2c7a57`, dark mode didukung.
- Data padat tetapi rapi. Prioritas: angka jelas, status alat langsung
  terlihat, perpindahan toko dan tanggal cepat.
- Detail visual ada di `DESIGN.md` dan `PRODUCT.md`.

## Notes for AI Handoff

- Gunakan istilah domain: toko, cabang, perangkat/device, sesi rekaman, fase
  R/S/T, kWh, PLN.
- Angka energi dan biaya harus benar sebelum tampilan dipercantik. Jika grafik
  aneh (lonjakan, celah, beda antar rentang), periksa normalisasi fase, union
  `telemetry`/`history`, dan rollover guard terlebih dulu.
- Aturan coding wajib ada di `AI_RULES.md`. Panduan agent lengkap ada di
  `AGENTS.md` dan `CLAUDE.md`.
- Sebelum membaca banyak file, tanya knowledge graph dulu:
  `graphify query "<pertanyaan>"`.
