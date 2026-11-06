# 📐 Rencana Arsitektur Sistem Monitoring & Audit Energi (3-Pilar)

Dokumen ini mencatat keputusan arsitektur dan spesifikasi integrasi untuk ekosistem **Smart Energy & Audit System**.

---

## 🏗️ 1. Struktur Ekosistem (3 Proyek Terpisah)

Sistem terdiri dari 3 repositori/proyek independen dengan peran dan domain fungsi yang terpisah namun saling terintegrasi:

### 📌 Proyek 1: `sparta-energy` (Portal Audit & Strategi Energi)
* **Fungsi Utama:** Audit manual peralatan toko, manajemen master toko/cabang, koordinat GPS, perbandingan standar PLN, laporan manajemen, dan AI Strategic Recommendations.
* **Tech Stack:** Next.js 16 (App Router), React 19, Tailwind CSS 4, Prisma ORM, PostgreSQL, better-auth, Recharts, Google Gemini API.
* **Database Utama:** **DB 1 (`energy`)** — Master Toko, User, Audits. Migrasi DB 1 hanya dijalankan dari repo ini.
* **Target User:** Auditor, Management, Exec, Admin Operasional.

### ⚙️ Proyek 2: `smart-energy-meter-vps` (IoT Telemetry History & Ingestion Engine)
* **Fungsi Utama:** Layanan backend 24/7 untuk menerima data telemetri dari hardware sensor portabel (ESP32) via MQTT broker, menyimpan log telemetri, manajemen penugasan toko per device, dan rekaman sesi (*Capture*).
* **Tech Stack & Infra:** Python Flask, PostgreSQL, Paho MQTT, Docker, **Biznet VPS**.
* **Database Utama:** **DB 2 (`energy_meter`)** — Devices, Telemetry, History (+ Read-only ke DB 1 untuk pencarian master toko).
* **Target User:** Backend Ingestion Engine & Tool Operasional Teknisi IoT.

### ⚡ Proyek 3: `smart-energy-monitoring` (Portal Monitoring & Visualisasi Telemetri Energi)
* **Fungsi Utama:** Dashboard terpadu untuk visualisasi data telemetri energi cabang toko:
  - **Peta Interaktif (Map View):** Menampilkan sebaran toko Alfamart dengan status IoT:
    - 🟢 **LIVE AUDIT IN PROGRESS** (Alat IoT sedang aktif terpasang dan merekam).
    - 🔵 **HISTORICAL AUDIT LOG** (Toko pernah diaudit IoT pada sesi lampau).
    - ⚪ **UNASSIGNED** (Toko belum pernah dipasang IoT).
  - **Mode Real-Time (Live Gauge):** Gauge 3-fase L1/L2/L3 (V, A, W, PF) saat alat sedang aktif.
  - **Mode Riwayat (Telemetry Chart):** Grafik tren daya, tegangan, peak-hour load, dan profil konsumsi kWh per periode audit.
* **Tech Stack:** Next.js 16 (App Router), React 19, Tailwind CSS 4, shadcn/ui, Lucide Icons, Recharts, Leaflet Map, `pg` (raw SQL, read-only ke DB 1 dan DB 2).
* **Target User:** Manajer Operasional Toko, Teknisi Lapangan, Supervisor Energi, Auditor.

---

## 🔗 2. Strategi Dual Database (Isolasi & Sinkronisasi)

Database dipisahkan menjadi 2 database logikal di server PostgreSQL VPS untuk mengisolasi volume jutaan data telemetri mentah dari data transaksional bisnis:

```
┌──────────────────────────────────────────────┐       ┌──────────────────────────────────────────────┐
│        🏢 DATABASE 1: `energy`               │       │        ⚡ DATABASE 2: `energy_meter`         │
│  - Tabel `stores`                            │       │  - Tabel `devices`                           │
│    (id, code, name, branch,                  │       │    (id, name, online, last_seen,             │
│     latitude, longitude, daya_va, area)      │       │     store_id, store_code, lat, lng)          │
│  - Tabel `users`, `accounts`, `sessions`     │       │  - Tabel `telemetry` (snapshot 15 menit)     │
│  - Tabel `audits`, `audit_items`             │       │  - Tabel `history` (rekaman sesi capture)    │
└──────────────────────┬───────────────────────┘       └──────────────────────┬───────────────────────┘
                       │                                                      │
         (1) Master Toko & Koordinat GPS                         (2) Telemetry & Log Audit IoT
                       │                                                      │
                       ▼                                                      ▼
              ┌────────────────────────────────────────────────────────────────────────┐
              │             ⚡ Proyek 3: `smart-energy-monitoring`                     │
              │  - Menggabungkan Master Toko (DB 1) & Sesi IoT (DB 2)                  │
              │  - Tampilan Peta Interaktif (Pin Toko Hijau/Biru/Abu-abu)              │
              │  - Dashboard Live Gauge & Grafik Analisis Energi Per Toko              │
              └────────────────────────────────────────────────────────────────────────┘
```

---

## ⚙️ 3. Alur Penugasan Toko & Sesi Rekaman IoT

1. **Penugasan Toko pada Device (`smart-energy-meter-vps`):**
   - Pada tab **Settings ➔ Manage Devices**, saat mengedit nama device (misal `MC 2`):
   - Input teks bebas `"Nama Lokasi / Toko..."` diganti dengan **Searchable Dropdown / Combobox Toko** yang menarik data dari tabel `stores` di **DB 1 (`energy`)**.
   - Device otomatis terikat dengan `store_id`, `store_name`, `store_code`, `latitude`, dan `longitude`.

2. **Mulai Perekaman (Start Capture):**
   - Saat rekaman dimulai, sesi rekaman di tabel `history` pada **DB 2 (`energy_meter`)** otomatis membawa identitas `store_id` dan koordinat toko tersebut.

3. **Tampilan di `smart-energy-monitoring`:**
   - Membaca daftar toko dari DB 1 dan mengecek status di DB 2:
     - Jika device toko sedang `online` dan merekam ➔ Status **LIVE** (Pin Hijau).
     - Jika ada data di tabel `history` ➔ Status **HISTORICAL** (Pin Biru).
     - Jika belum ada data ➔ Status **UNASSIGNED** (Pin Abu-abu).
   - Klik pin toko di peta ➔ Membuka halaman monitoring detail toko tersebut (`/monitoring/[storeId]`).

---

## 🔑 4. Spesifikasi Environment Variables (`.env`)

Nama variabel di bawah ini mengikuti kode di `lib/db/pools.ts` dan
`lib/services/store-service.ts`. Nilai asli hanya ada di `.env` lokal dan di
Dokploy, tidak pernah di repo.

| Variable Name | Deskripsi & Kegunaan | Sumber / Database Target |
| :--- | :--- | :--- |
| `SPARTA_DATABASE_URL` | Koneksi PostgreSQL ke master toko (`stores`). Dibaca oleh `getSpartaPool()`. | **DB 1 (`energy`)** |
| `TELEMETRY_DATABASE_URL` | Koneksi PostgreSQL ke `devices`, `telemetry`, `history`. Dibaca oleh `getTelemetryPool()`. | **DB 2 (`energy_meter`)** |
| `DATABASE_URL` | Fallback untuk `getTelemetryPool()` jika `TELEMETRY_DATABASE_URL` kosong. | **DB 2** |
| `AIVEN_DATABASE_URL_LEGACY` | Referensi DB Aiven lama, hanya untuk skrip migrasi data. Tidak dibaca aplikasi. | Aiven (legacy) |
| `NEXT_PUBLIC_TELEMETRY_API_URL` | API `smart-energy-meter-vps`, dipakai untuk `/capture/status` (status rekaman device). | `smart-energy-meter-vps` |
| `NEXT_PUBLIC_TELEMETRY_WS_URL` | WebSocket `smart-energy-meter-vps` untuk data live. | `smart-energy-meter-vps` |
| `NEXT_PUBLIC_REALTIME_METER_URL` | URL portal IoT hardware (`https://energy-meter.sparta-alfamart.web.id/`). | External Quick Switcher |
| `NEXT_PUBLIC_SPARTA_AUDIT_URL` | URL portal audit manual (`sparta-energy`). | External Quick Switcher |
| `BETTER_AUTH_SECRET` | Secret SSO bersama `sparta-energy` (rencana, belum dipakai kode). | Shared Secret |
| `BETTER_AUTH_URL` | Base URL portal monitoring untuk SSO (rencana). | Auth App URL |

> Host database harus bisa di-resolve dari tempat aplikasi berjalan. Nama
> service Docker internal Dokploy hanya berlaku di dalam jaringan Dokploy;
> untuk development lokal gunakan host publik VPS atau tunnel.

---

## 🧩 5. Lapisan Akses Data di `smart-energy-monitoring`

```
app/(dashboard)/*/page.tsx  ──┐
                              ├──▶ lib/services/store-service.ts ──────┐
app/api/stores/**/route.ts  ──┘    lib/services/telemetry-service.ts ──┤
                                                                       ▼
                                        lib/db/pools.ts
                                        ├─ getSpartaPool()     ──▶ DB 1 `energy`  
                                        └─ getTelemetryPool()  ──▶ DB 2 `energy_meter`
```

* Page server memanggil service secara langsung; API route hanya dipakai
  komponen client untuk berganti toko, tanggal, atau rentang waktu.
* Semua query memakai `pg` dengan parameter (`$1`, `$2`), read-only.
* Pool di-cache di `globalThis` saat development. Setelah `.env` berubah,
  dev server harus di-restart.
* Prisma 7 sudah terpasang (`prisma.config.ts`) tetapi belum punya model;
  skema kedua database dimiliki proyek lain.

---

## 🚚 6. Riwayat Keputusan Infrastruktur

* **Oktober 2026 — Migrasi DB 2 dari Aiven ke Biznet VPS.** Abstraksi pool
  diganti nama menjadi `getTelemetryPool()`; `getAivenPool` tetap ada sebagai
  alias. Connection string Aiven disimpan sebagai
  `AIVEN_DATABASE_URL_LEGACY` hanya untuk migrasi data.
* **Deploy:** GitHub Actions membangun image Docker ke GHCR (nama repo
  di-lowercase), lalu memicu webhook Dokploy. Dokploy mengatur domain, HTTPS,
  port, dan environment variables runtime.
* **23 Oktober 2026 — Integrasi "12 Toko Sangat Boros".** `sparta-energy`
  membuat view read-only `v_toko_sangat_boros` di DB 1 (lihat bagian 7).
  Portal monitoring membacanya untuk daftar "Prioritas Pasang IoT" dan garis
  standar konsumsi energi di grafik kWh.

---

## 📜 7. Kontrak View Antar-Repo (DB 1)

Nama database DB 1 adalah `energy`. View di bawah dibuat dan dimiliki oleh
`sparta-energy` lewat migrasinya. `smart-energy-monitoring` hanya membaca.
Mengubah atau menghapus kolom harus dikoordinasikan dengan kedua repo;
menambah kolom aman.

### `v_toko_sangat_boros`

12 toko boros dengan gap terbesar (kalkulasi `COMPLETED` terbaru tiap toko,
tanpa cabang Head Office). Urut `gap_percent DESC`, lalu `audit_id`.

| Kolom | Tipe | Isi |
| :--- | :--- | :--- |
| `peringkat` | int | 1 sampai 12 |
| `store_code`, `store_name`, `branch` | text | Identitas toko (`store_code` = `stores.code`) |
| `latitude`, `longitude` | double | Koordinat toko (boleh kosong) |
| `audit_id`, `tanggal_kalkulasi` | uuid, timestamp | Kalkulasi terbaru |
| `gap_percent` | numeric | (aktual PLN − standar) ÷ standar × 100 |
| `aktual_pln_kwh_per_bulan` | numeric | Rata-rata tagihan PLN 6 bulan |
| `standar_konsumsi_kwh_per_bulan` | numeric | Standar konsumsi energi dari daftar alat |
| `standar_konsumsi_kwh_per_hari` | numeric | Kolom sebelumnya ÷ 30 |
| `status_validasi` | text | `PENDING` atau `VALIDATED` |
| `is_demo` | boolean | `true` untuk cabang DEMO (uji coba; dikecualikan sebelum production) |

Dipakai di `lib/services/sangat-boros-service.ts`. Kalau view belum ada
(`42P01`), halaman tetap jalan dan menampilkan pesan bahwa view belum dibuat.
Di lokal kedua repo memakai user DB yang sama, jadi tidak perlu `GRANT`; di
production, pastikan user `SPARTA_DATABASE_URL` punya `SELECT` pada view ini.
