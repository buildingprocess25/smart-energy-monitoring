# 🎨 Spesifikasi UI/UX & Panduan Desain `smart-energy-monitoring`

Dokumen ini mencatat seluruh hasil diskusi, keputusan desain, dan spesifikasi visual untuk portal **Smart Energy & Utility Monitoring System**.

---

## 🏛️ 1. Filosofi & Konsep Visual Direction

* **Visual Evolution (Beyond myECO):** Mengambil inspirasi dari tata letak dasar myECO, namun **ditingkatkan secara signifikan** agar tampil lebih modern, bersih, intuitif, dan sesuai dengan standar visual premium **SPARTA Energy**.
* **Visual Tone & Theme:**
  * **Default Phase:** **Clean Light Mode** (Latar belakang serba terang/putih, kartu toko dengan *subtle shadow*, serta aksen warna hijau energi `#2c7a57`, *emerald*, dan *cyan*).
  * **Extensibility:** Menggunakan skema variabel CSS yang mendukung **Dark Mode** (*slate-900 / dark green*) di masa mendatang.
* **Identitas & Branding:**
  * Menggunakan logo resmi **SPARTA Energy** dan **Alfamart** yang diambil dari `sparta-energy/public/assets/`.

---

## 🌐 2. Layout & Ekosistem Navigasi (Identik SPARTA AdminShell)

Aplikasi **smart-energy-monitoring** menggunakan **AdminShell Layout (Collapsible Sidebar)** yang identik dengan **SPARTA Energy Admin Dashboard** (`sparta-energy`), sehingga kedua aplikasi terasa sebagai **satu sistem terintegrasi yang utuh**.

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│ [≡] Breadcrumbs  (🟢 Live) [⚡ Realtime Meter ↗] [📋 Sparta Audit ↗] (🌓 Theme) (👤 Profile)│
├───────────────┬────────────────────────────────────────────────────────────────────────┤
│ ⚡ SPARTA     │                                                                        │
│   Monitoring  │                                                                        │
│               │  MAIN CONTENT AREA                                                     │
│ 📊 Overview   │  (Store Gallery, Telemetry Gauges, Analytics, Device Management)      │
│               │                                                                        │
│ MONITORING    │                                                                        │
│ 🏬 Monitoring │                                                                        │
│ ⚡ Sesi Audit │                                                                        │
│ 📈 Analitik   │                                                                        │
│               │                                                                        │
│ HARDWARE &    │                                                                        │
│ INTEGRATION   │                                                                        │
│ ⚡ Realtime   │                                                                        │
│    Meter ↗    │  --> (https://energy-meter.sparta-alfamart.web.id/ - Setting & Capture)│
│ 📟 Perangkat  │                                                                        │
│ 📍 Lokasi     │                                                                        │
│               │                                                                        │
│ EKOSISTEM     │                                                                        │
│ 📋 SPARTA     │                                                                        │
│    Audit ↗    │  --> Portal Audit Manual & AI Recommendations                           │
│               │                                                                        │
│ [👤 Profile]  │                                                                        │
└───────────────┴────────────────────────────────────────────────────────────────────────┘
```

### 🧩 Komponen Utama Layout & Sidebar:
1. **Sidebar Navigation (`SidebarProvider` & `AdminShell`):**
   * **Header Sidebar:** Logo SPARTA Energy + Alfamart branding (`/assets/Building-Logo.png`).
   * **Menu Items Grouping:**
     * **Top Link:** 📊 **Overview Toko** (`/` atau `/dashboard`)
     * **Kelompok Monitoring:**
       * 🏬 **Monitoring Toko** (`/stores`)
       * ⚡ **Sesi Audit IoT** (`/sessions`)
       * 📈 **Analitik Telemetri** (`/analytics`)
     * **Kelompok Hardware & Perangkat:**
       * ⚡ **Realtime Smart Energy Meter ↗** (`https://energy-meter.sparta-alfamart.web.id/`) — *Link Eksternal Permanen untuk setting & capture perangkat hardware ESP32 di lokasi toko.*
       * 📟 **Perangkat IoT (ESP32 / Meter)** (`/devices`) — *Daftar & status perangkat terdaftar.*
       * 📍 **Pemetaan Lokasi** (`/locations`) — *Peta penyebaran toko & penugasan IoT.*
     * **Kelompok Ekosistem SPARTA:**
       * 📋 **SPARTA Energy Audit Platform ↗** — *Link Eksternal ke Portal Audit Manual & Strategic AI (`sparta-energy`).*
   * **Footer Sidebar:** Profil pengguna aktif (Admin / Auditor) + Logout Dropdown.
   * **Behavior:** Responsive & Collapsible (bisa di-collapse menjadi ikon saja dengan `SidebarRail` & keyboard shortcut `Ctrl+B`).

2. **Top Header Inset Bar:**
   * **Sidebar Toggle Trigger (`SidebarTrigger`):** Tombol hamburger untuk collapse/expand sidebar.
   * **Breadcrumb Dynamic:** Menampilkan posisi halaman secara fleksibel (misal: `Dashboard / Monitoring Toko / Alfamart Pondok Kacang 3`).
   * **Realtime Meter Quick Button:** Tombol pintas dengan highlight khusus **"⚡ Realtime Meter Setup ↗"** yang membuka portal `https://energy-meter.sparta-alfamart.web.id/` secara langsung di tab baru (digunakan oleh teknisi/auditor saat meng-capture & mensetting alat di lapangan).
   * **Sparta Audit Switcher Badge:** Tombol pintas cepat **"📋 Sparta Audit ↗"** yang membuka portal audit `sparta-energy`.
   * **Status Server Live Badge:** Indikator koneksi telemetri real-time (*Server Live / WebSocket Status*).
   * **Theme Toggle (`ThemeModeToggle`):** Pilihan switch mode Terang (Light), Gelap (Dark), atau Sistem.
   * **Profile Dropdown Menu:** Akses pengeluaran akun, opsi profil, dan peran pengguna.

---

## 🖼️ 3. Halaman Utama: Overview Gallery Toko (`/`)

### 🎛️ Toolbar Control Panel
* **Search Bar:** Input pencarian berbasis nama toko atau lokasi cabang (*"Search store by name or building..."*).
* **Audit Status Filter:** Dropdown penyaringan status (*All Stores / Live Audit / Historical Log / Unassigned*).
* **Time Range Filter:** Dropdown periode waktu (*This Month / Last Month / Custom Date*).
* **Sort & View Control:** Tombol pengurutan (*Sort by kWh / Name*) dan toggle tampilan (*Gallery View vs Zone Map View*).

### 🃏 Card Toko Alfamart (3-Column Grid Layout)
Setiap card toko dirancang informatif dan interaktif:
* **Foto Toko (Height `180px`):** Memiliki *soft gradient overlay* dengan **Badge Status IoT Audit** yang jelas:
  * 🟢 **`LIVE AUDIT IN PROGRESS`**: Sesi audit IoT sedang aktif dipasang di toko.
  * 🔵 **`HISTORICAL AUDIT LOG`**: Data telemetri dari sesi audit lampau.
  * ⚪ **`UNASSIGNED`**: Toko belum pernah/sedang tidak di-audit (dilengkapi tombol *"Assign Devices"*).
* **Metrik Permukaan Card:**
  * **Total Energy ($kWh$):** Konsumsi energi selama masa audit dengan indikator persentase efisiensi energi.
  * **Device Count:** Jumlah sensor ESP32 yang terhubung.
  * **Timestamp Update:** Waktu terakhir data telemetri diterima.
* **Hover Action:** Efek *hover scaling* dengan tombol melayang *"View Monitoring Details"*.

---

## ⚡ 4. Halaman Detail Toko: Monitoring Real-Time & Historis (`/monitoring/[storeId]`)

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│  Alfamart Pondok Kacang 3                          [ IoT Session: 10-17 Aug 2026 ▾ ]   │
│  [ ⚡ Listrik (Active) ]  [ 💧 Air (Future) ]  [ 🌡️ Lingkungan (Future) ]               │
├────────────────────────────────────────────────────────────────────────────────────────┤
│  LIVE TELEMETRY GAUGES (3-PHASE L1 / L2 / L3)                                          │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐  │
│  │   VOLTAGE (V)   │  │   CURRENT (A)   │  │    POWER (W)    │  │ POWER FACTOR(PF)│  │
│  │   220.4 V       │  │   12.5 A        │  │   2750 W        │  │    0.95 PF      │  │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘  └─────────────────┘  │
├────────────────────────────────────────────────────────────────────────────────────────┤
│  TELEMETRY TREND CHART & LOAD PROFILE (RECHARTS)                                       │
│  [ Grafik Fluktuasi Beban Listrik + Peak Hour Indicator ]                              │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

1. **Sub-Tab Navigation:**
   * **Sub-Tab 1: ⚡ Telemetri Multi-Fasa & Sesi:** Visualisasi detail parameter listrik (Daya, Tegangan, Arus, Power Factor, Energi, Frekuensi), KPI per fasa/sensor dengan **Multi-Select Phase Filtering** & kartu **Total Daya Beban**, grafik multi-line/area dengan 4 mode waktu (**Harian** 24 jam, **Bulanan** 30 hari, **Tahunan** 12 bulan perbandingan, dan **Sesi Audit** 15 menit), serta tooltip yang memposisikan Total Daya Beban selalu di urutan paling atas.
   * **Sub-Tab 2: 📊 Analitik Energi (Per Hari / Per Minggu / Per Bulan):** Widget komprehensif profil beban 24 jam dengan `TelemetryDatePicker`, grafik konsumsi harian 7 hari dengan sliding window navigation, dan riwayat bulanan riil dengan analisis MoM (% kenaikan/penurunan).
2. **IoT Session & Date Navigator:**
   * Memungkinkan pengguna memilih rentang waktu sesi audit IoT, tanggal harian dengan kalender popover, atau menggeser window mingguan/bulanan secara interaktif.
3. **Optimasi Kueri & Caching:**
   * Pengambilan data `getAuditSessions`, `getTelemetryHistory`, dan `getStoreAnalyticsData` dijalankan secara paralel (`Promise.all`) dengan in-memory cache untuk performa responsif instan.

---

## 🔮 5. Roadmap Fitur Masa Depan (Recorded Intent)

1. **Unified Multi-Utility Monitoring:** Penambahan sensor meter air dan sensor kualitas lingkungan/chiller tanpa merombak ulang struktur UI.
2. **AI Analytics & Cost Prediction:**
   * Estimasi tagihan listrik bulanan (PLN).
   * Deteksi anomali/kebocoran energi di luar jam operasional toko.
   * Integrasi dengan Google Gemini API.
