# 📐 Rencana Arsitektur Sistem Monitoring & Audit Energi (3-Pilar)

Dokumen ini mencatat keputusan arsitektur dan spesifikasi integrasi untuk ekosistem **Smart Energy & Audit System**.

---

## 🏗️ 1. Struktur Ekosistem (3 Proyek Terpisah)

Sistem terdiri dari 3 repositori/proyek independen dengan peran dan domain fungsi yang terpisah namun saling terintegrasi:

### 📌 Proyek 1: `sparta-energy` (Portal Audit & Strategi Energi)
* **Fungsi Utama:** Audit manual peralatan toko, manajemen master toko/cabang, koordinat GPS, perbandingan standar PLN, laporan manajemen, dan AI Strategic Recommendations.
* **Tech Stack:** Next.js 16 (App Router), React 19, Tailwind CSS 4, Prisma ORM, PostgreSQL, better-auth, Recharts, Google Gemini API.
* **Database Utama:** **DB 1 (`sparta_energy`)** — Master Toko, User, Audits.
* **Target User:** Auditor, Management, Exec, Admin Operasional.

### ⚙️ Proyek 2: `smart-energy-meter-vps` (IoT Telemetry History & Ingestion Engine)
* **Fungsi Utama:** Layanan backend 24/7 untuk menerima data telemetri dari hardware sensor portabel (ESP32) via MQTT broker, menyimpan log telemetri, manajemen penugasan toko per device, dan rekaman sesi (*Capture*).
* **Tech Stack & Infra:** Python Flask, PostgreSQL, Paho MQTT, Docker, **Biznet VPS (`103.127.99.241`)**.
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
* **Tech Stack:** Next.js 16 (App Router), React 19, Tailwind CSS 4, Lucide Icons, Recharts, Leaflet Map.
* **Target User:** Manajer Operasional Toko, Teknisi Lapangan, Supervisor Energi, Auditor.

---

## 🔗 2. Strategi Dual Database (Isolasi & Sinkronisasi)

Database dipisahkan menjadi 2 database logikal di server PostgreSQL VPS untuk mengisolasi volume jutaan data telemetri mentah dari data transaksional bisnis:

```
┌──────────────────────────────────────────────┐       ┌──────────────────────────────────────────────┐
│        🏢 DATABASE 1: `sparta_energy`        │       │        ⚡ DATABASE 2: `energy_meter`         │
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
   - Input teks bebas `"Nama Lokasi / Toko..."` diganti dengan **Searchable Dropdown / Combobox Toko** yang menarik data dari tabel `stores` di **DB 1 (`sparta_energy`)**.
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

| Variable Name | Deskripsi & Kegunaan | Sumber / Database Target |
| :--- | :--- | :--- |
| `DATABASE_URL` | String koneksi PostgreSQL DB 1 (Master Toko, User, SSO) | **DB 1 (`sparta_energy`)** |
| `TELEMETRY_DATABASE_URL` | String koneksi PostgreSQL DB 2 (Log Telemetri & Sesi Rekaman IoT) | **DB 2 (`energy_meter`)** |
| `NEXT_PUBLIC_REALTIME_METER_URL` | Direct URL portal IoT hardware (`https://energy-meter.sparta-alfamart.web.id/`) | External Quick Switcher |
| `NEXT_PUBLIC_SPARTA_AUDIT_URL` | Direct URL portal audit manual (`sparta-energy`) | External Quick Switcher |
| `BETTER_AUTH_SECRET` | Secret key untuk SSO / Authentication | Shared Secret dengan `sparta-energy` |
| `BETTER_AUTH_URL` | Base URL portal monitoring | Auth App URL |
