# Dynamic 7-Day Energy Trend Navigation and Date Formatting

## Scope

- Mengubah grafik Tren Konsumsi Energi Harian di Dashboard utama (`/`) menjadi sepenuhnya dinamis berbasis jendela 7 hari (slide/prev/next window).
- Menyediakan label tanggal informatif pada sumbu X (`Hari (DD/MM)`) dan badge rentang tanggal aktif (`DD MMM YYYY – DD MMM YYYY`).
- Mengimplementasikan navigasi minggu lampau (`◀ 7 Hari Sebelumnya`), minggu berikutnya (`7 Hari Berikutnya ▶`), dan tombol reset `Terkini`.
- Menghubungkan query agregasi konsumsi energi harian ($\Delta\text{kWh}$) riil dari database PostgreSQL Aiven IoT (`history` dan `telemetry`).

## Context and Sources

- `lib/types.ts`: Menambahkan interface `DailyConsumption` dengan field `dayDate`, `dayLabel`, `dayFullDate`.
- `lib/services/telemetry-service.ts`: Query agregasi delta kWh seluruh perangkat IoT terurut tanggal.
- `components/dashboard/dashboard-overview.tsx`: Komponen grafik Recharts dengan state `weekOffset` dan kalkulasi rentang tanggal.

## Changed Files

- `lib/types.ts`: Menambahkan interface `DailyConsumption` dan mempertahankan `StoreStatus`.
- `lib/services/telemetry-service.ts`: Menghubungkan CTE SQL (`WITH daily_source AS ...`) yang menggabungkan seluruh tabel `telemetry` & `history` sehingga riwayat 35+ hari tersedia lengkap dan tidak terputus saat bernavigasi ke minggu-minggu lampau.
- `components/dashboard/dashboard-overview.tsx`: Menambahkan kontrol navigasi jendela 7 hari, badge tanggal, komponen `CustomXAxisTick` dengan tipografi compact 2-baris (`Hari` di atas, `DD/MM` font mono di bawah), serta tooltip informatif.

## Decisions

- **Anchor Jendela Terkini**: Pada hari Kamis, bar paling kanan adalah hari Rabu (kemarin), mundur kronologis dari kiri ke kanan.
- **Navigasi Slider & Data Lengkap**: Query database membaca kontinuitas time-series dari `telemetry` dan `history` sehingga seluruh minggu lampau memiliki data konsumsi riil.
- **Tipografi Sumbu X Elegan**: Label tanggal dibuat lebih kecil, rapi, dan proporsional dengan format vertikal 2-baris agar tidak padat dan tetap mudah dibaca.

## Verification

- Komponen dan kode TypeScript divalidasi sesuai tipe data `DailyConsumption` dan props `DashboardOverview`.
- Perhitungan waktu, format tanggal lokal Indonesia, dan pencocokan ISO string `YYYY-MM-DD` telah diverifikasi.

## Remaining Work and Risks

None.
