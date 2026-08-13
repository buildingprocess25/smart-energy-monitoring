# 📐 Rencana Arsitektur Sistem Monitoring & Audit Energi (3-Pilar)

Dokumen ini mencatat hasil diskusi dan keputusan arsitektur untuk pengembangan ekosistem **Smart Energy & Audit System**.

---

## 🏗️ 1. Struktur Ekosistem (3 Proyek Terpisah)

Sistem akan terdiri dari 3 repositori/proyek independen dengan peran dan domain fungsi yang terpisah:

### 📌 Proyek 1: `sparta-energy` (Portal Audit & Strategi Energi)
* **Fungsi Utama:** Audit manual peralatan toko, manajemen cabang/toko, perbandingan standar PLN, laporan manajemen, dan AI Strategic Recommendations.
* **Tech Stack:** Next.js 16 (App Router), React 19, Tailwind CSS 4, Prisma ORM, PostgreSQL, better-auth, Recharts, Google Gemini API.
* **Target User:** Auditor, Management, Exec, Admin Operasional.

### ⚙️ Proyek 2: `Smart-Energy-Meter-Vps` (IoT Telemetry History & Ingestion Engine)
* **Fungsi Utama:** Layanan backend 24/7 untuk menerima dan menyimpan data telemetri dari hardware sensor portabel (ESP32) via MQTT broker. **Perangkat IoT bersifat temporer** (hanya dipasang pada toko tertentu dalam periode audit tertentu), sehingga VPS ini bertindak sebagai lumbung data **riwayat/historis audit IoT** per sesi audit.
* **Tech Stack & Infra:** Python Flask, PostgreSQL, Paho MQTT, Docker, **Biznet VPS (`103.127.99.241`)**.
* **Target User:** Backend Data Service (Machine-to-Machine) & Audit History Provider.

### ⚡ Proyek 3: `smart-energy-monitoring` *(Akan Di-build)* (Portal Monitoring & Visualisasi Telemetri Energi)
* **Fungsi Utama:** Dashboard operasional untuk visualisasi data telemetri energi cabang toko, baik **Mode Real-Time (jika sedang ada audit aktif)** maupun **Mode Riwayat/Historis Audit IoT (periode audit yang lalu)**.
* **Tech Stack (Rencana):** Next.js 16 / Vite React, Tailwind CSS, Lucide Icons, Recharts.
* **Target User:** Manajer Operasional Toko, Teknisi Lapangan, Supervisor Energi, Auditor.

#### 🎨 Konsep Layout & Referensi UI/UX (MyEco Inspired):
1. **Halaman Utama (Gallery / Zones Card View):**
   - **Toolbar:** Search Input (*Search zone/building...*), Grouping Filter, Selection Periode Audit (*Current Session / Past Audit Sessions*), Filter & Sort.
   - **Grid Card Per Toko Alfamart:**
     - Foto & Nama Cabang Toko (misal: *Alfamart Pondok Kacang 3*, *Alfamart Exit Tol Jelupang*).
     - Badge Status Audit IoT: **LIVE AUDIT IN PROGRESS** (alat terpasang) / **HISTORICAL AUDIT LOG** (sesi lampau) / **UNASSIGNED** (belum di-audit).
     - Metrik Utama: Total **Energy (kWh) selama periode audit** & Indikator Status Sensor.
     - Tombol **Edit Foto** & **View Details** (Hover action).
2. **Halaman Detail Per Toko (Live & Historical Telemetry View):**
   - **Session Selector Dropdown:** Memilih tanggal/periode audit IoT yang pernah dilakukan di toko tersebut.
   - **Live Gauge Dashboard (Mode Live):** Menampilkan angka real-time untuk **Voltage (V)**, **Current (A)**, **Power (W)**, dan **Power Factor (PF)** per Fase L1/L2/L3 jika alat sedang aktif terpasang.
   - **Chart Telemetri Historis (Mode History & Live):** Grafik tren beban daya, grafik tegangan, peak-hour load, dan profil konsumsi energi harian dari riwayat audit VPS engine.

---

## 🔗 2. Strategi Keterkaitan Database & Hybrid SSO

Proyek 3 (`smart-energy-monitoring`) dirancang sebagai **Stateless Presentation Layer (Web Portal UI)** yang **tidak memiliki database tersendiri**. Portal ini mengonsumsi data dari 2 engine backend utama:

```
                  ┌────────────────────────────────────────────────────────┐
                  │ ⚡ Proyek 3: `smart-energy-monitoring` (Pure UI Portal) │
                  └───────────┬──────────────────────────────┬─────────────┘
                              │                              │
           (1) Telemetry Data │                              │ (2) Auth & Metadata Toko
           (Realtime & History│                              │ via DB / Prisma API
           per Audit Session) │                              │
                              ▼                              ▼
            ┌───────────────────────────┐          ┌───────────────────────────┐
            │ ⚙️ Proyek 2:               │          │ 📊 Proyek 1:              │
            │ `Smart-Energy-Meter-Vps`  │          │ `sparta-energy`           │
            │ (IoT Ingestion & History) │          │ (Management & Auth DB)    │
            └─────────────┬─────────────┘          └─────────────┬─────────────┘
                          │                                      │
                          ▼                                      ▼
                 ┌──────────────────────────────────────────────────┐
                 │       🗄️ Shared Database (PostgreSQL)          │
                 │ - Data Telemetri & Log Audit IoT                 │
                 │ - User & Auth (SSO)                              │
                 │ - Data Toko, Cabang & Sesi Penugasan IoT         │
                 └──────────────────────────────────────────────────┘
```

1. **Mapping Identitas & Sesi Penugasan Perangkat (`device_id` + `store_id` + `time_range`):**
   - Perangkat IoT ESP32 dapat dipindah antar-toko. Oleh karena itu, relasi tidak bersifat permanen 1:1, melainkan berdasar **Sesi Audit (IoT Audit Session Window)** dengan `start_date` dan `end_date`.
2. **Hybrid Single Sign-On (SSO):**
   - **Tabel User Terpusat:** Proyek 3 menggunakan tabel `User`, `Session`, dan `Account` dari database `sparta-energy` (Single Source of Truth).
   - **Seamless Switcher:** Pengguna yang sudah login di `sparta-energy` dapat langsung melompat ke `smart-energy-monitoring` tanpa re-login (*Cookie / Token sharing*).
   - **Form Login Sendiri:** Pengguna yang mengakses URL Proyek 3 secara langsung tetap dapat login via UI bawaan yang memverifikasi kredensial ke DB / Auth Service terpusat.
3. **Dual-Source Data Consumption:**
   - **Data Telemetri IoT & Log Historis:** Diambil dari Proyek 2 (`Smart-Energy-Meter-Vps`) via REST API / WebSocket (Live Gauge saat audit berlangsung, grafik historis riwayat audit, status sensor, alert).
   - **Data User & Metadata Toko:** Diambil dari Proyek 1 (`sparta-energy`) (Hak akses user, nama toko/cabang, target kuota energi, riwayat audit manual).

---

## 📋 3. Rencana Langkah Pengembangan (Tahapan / Phased Roadmap)

Pengembangan **smart-energy-monitoring** dibagi menjadi 3 tahap teratur (*incremental phases*) agar progres dapat terverifikasi secara berkala:

### 🔹 Tahap 1: UI Shell & Dashboard Presentation (Fokus Utama Awal)
1. **Inisialisasi Proyek:** Next.js 16 (App Router), React 19, Tailwind CSS 4, shadcn/ui, Lucide Icons, `@tabler/icons-react`, Recharts.
2. **AdminShell Collapsible Sidebar:** Layout navigasi yang identik dengan `sparta-energy` lengkap dengan Header Inset Bar, Dynamic Breadcrumb, dan Quick Switcher ke `https://energy-meter.sparta-alfamart.web.id/` & `sparta-energy`.
3. **Overview Gallery Toko (`/`):** 3-Column responsive grid card per toko dengan Badge Status IoT Audit (🟢 LIVE / 🔵 HISTORICAL / ⚪ UNASSIGNED), Toolbar Search & Filter.
4. **Detail Toko Monitoring (`/monitoring/[storeId]`):** Circular Gauges 3-Fase L1/L2/L3 (V, A, W, PF) & Grafik Beban Listrik (Recharts) dengan data demo/mockup.

### 🔹 Tahap 2: Integrasi Backend Telemetri & Shared Database
1. **Integrasi Telemetri VPS Biznet (`103.127.99.241`):** Konsumsi REST API (`/api`) untuk log historis & WebSocket (`/ws`) untuk streaming gauge 3-fase live.
2. **Prisma Client Database Integration:** Pemetaan skema toko (`Store`) dan penugasan sesi audit (`AuditSession`) dari database PostgreSQL terpusat.

### 🔹 Tahap 3: Single Sign-On (SSO) & Layer Autentikasi
1. **Better Auth SSO Integration:** Pembagian cookie/session antara `sparta-energy` dan `smart-energy-monitoring` untuk login tanpa hambatan.
2. **Halaman Login & Role Management:** UI Login mandiri untuk pengguna yang mengakses URL monitoring secara langsung.

---

## 🔮 4. Rencana Ekstensibilitas Masa Depan (Unified Multi-Utility Portal)

Portal `smart-energy-monitoring` dirancang secara **modular** agar di masa depan tidak terbatas hanya pada energi listrik, tetapi menjadi **Portal Utilitas & Fasilitas Terpadu (Smart Facility Management Portal)**:

1. **Abstraksi Tipe Utilitas (`utility_type`):**
   - **⚡ Electricity (Listrik):** Voltage ($V$), Current ($A$), Power ($W$), Energy ($kWh$), Power Factor ($PF$).
   - **💧 Water (Air):** Flow Rate ($L/min$), Accumulated Volume ($m^3$), Water Pressure ($bar$), Leakage Alerts.
   - **🌡️ Environment & HVAC:** Temperature ($\text{}^\circ\text{C}$), Humidity ($\%RH$), Indoor Air Quality ($CO_2$).

2. **Komponen UI Modular & Tabbed Dashboard:**
   - **Store Detail View** akan memiliki Tab Navigasi Utilitas (*Listrik | Air | Lingkungan*).
   - Card Widget telemetry mengadopsi struktur universal yang otomatis berubah sesuai tipe sensor/device yang terhubung ke toko tersebut.

3. **🤖 Analisis Prediktif & Deteksi Pola Beban (AI Analytics Roadmap):**
   - **Estimasi & Prediksi Biaya PLN:** Prediksi tagihan listrik bulanan berbasis grafik tren konsumsi harian.
   - **Deteksi Pola Jam Puncak (Peak Hour Pattern Analysis):** Menentukan jam/hari di mana lonjakan daya tertinggi terjadi di toko (misal: beban pendingin/chiller naik tajam jam 12:00-14:00).
   - **Anomaly & Leakage Detection:** Notifikasi otomatis jika ada konsumsi abnormal di luar jam operasional toko.

---

## 🔑 5. Spesifikasi Environment Variables (`.env`)

Tabel Environment Variables yang dibutuhkan oleh `smart-energy-monitoring`:

| Variable Name | Deskripsi & Kegunaan | Kategori / Shared Source |
| :--- | :--- | :--- |
| `DATABASE_URL` | String koneksi PostgreSQL terpusat | Shared DB dengan `sparta-energy` |
| `BETTER_AUTH_SECRET` | Secret key untuk SSO / Authentication | Shared Secret dengan `sparta-energy` |
| `BETTER_AUTH_URL` | Base URL lokal/prod portal monitoring (`http://localhost:3001`) | Auth App URL |
| `NEXT_PUBLIC_REALTIME_METER_URL` | Direct URL web tool setting & capture hardware (`https://energy-meter.sparta-alfamart.web.id/`) | External Quick Switcher |
| `NEXT_PUBLIC_SPARTA_AUDIT_URL` | Direct URL portal audit manual (`sparta-energy`, misal `http://localhost:3000`) | External Quick Switcher |
| `NEXT_PUBLIC_TELEMETRY_API_URL` | REST API URL backend telemetri VPS (`Smart-Energy-Meter-Vps`) | Telemetry Ingestion Engine |
| `NEXT_PUBLIC_TELEMETRY_WS_URL` | WebSocket URL streaming live telemetry gauges (3-Phase L1/L2/L3) | Telemetry Ingestion Engine |
| `GOOGLE_GENAI_API_KEY` | Key API Google Gemini untuk analisis & rekomendasi AI (Opsional) | AI Engine |
