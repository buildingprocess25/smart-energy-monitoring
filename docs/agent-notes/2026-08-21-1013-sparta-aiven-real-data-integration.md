# Integrasi Real Data SPARTA Energy dan Aiven IoT Telemetry

## Scope

Mengintegrasikan data riil dari SPARTA Energy Database (master store metadata & koordinat GPS) dan Aiven IoT Database (devices, telemetry 3-phase, dan audit history), serta menggantikan seluruh mock data statis di dashboard overview, gallery toko, network map, dan halaman detail monitoring.

## Context and Sources

- SPARTA Energy PostgreSQL database (`stores` and `audits` table).
- Aiven Cloud IoT PostgreSQL / TimescaleDB (`devices`, `telemetry`, and `history` tables).
- `ARCHITECTURE_PLAN.md` and `PRODUCT.md`.
- `lib/types.ts` and `lib/mock-data.ts`.

## Changed Files

- `lib/db/pools.ts`: Connection pool manager untuk SPARTA DB dan Aiven DB dengan safe SSL configuration.
- `lib/services/store-service.ts`: Query master data toko dari SPARTA DB dan pencocokan kode toko dengan IoT devices Aiven (`2JC2` -> DC CIANJUR).
- `lib/services/telemetry-service.ts`: Service pengambilan data sesi audit riil, agregasi time-bucket grafik beban daya, dan polling live telemetry 3 fasa.
- `lib/types.ts`: Menambahkan field pendukung real data (deviceId, plnPowerVa, salesAreaM2, dataPointCount).
- `app/api/stores/route.ts`: API endpoint GET list toko aktif & historis.
- `app/api/stores/[storeId]/route.ts`: API endpoint GET detail toko & daftar sesi audit.
- `app/api/stores/[storeId]/telemetry/route.ts`: API endpoint GET live phase metrics.
- `app/api/stores/[storeId]/history/route.ts`: API endpoint GET interval telemetry points per session.
- `app/(dashboard)/page.tsx`: Server component fetch real stores dan render executive dashboard overview.
- `app/(dashboard)/monitoring/page.tsx`: Server component fetch real stores dan render store gallery.
- `app/(dashboard)/monitoring/[storeId]/page.tsx`: Server component fetch detail toko, sesi audit, dan render live monitoring.
- `components/dashboard/dashboard-overview.tsx`: Menggunakan data toko asli untuk KPI summary, top consuming stores, dan branch distribution.
- `components/dashboard/network-map-widget.tsx`: Menghitung dynamic GPS bounding box dan merender pin toko aktif & historis.
- `components/dashboard/store-gallery.tsx`: Menerima initialStores riil dan memfilter toko live/historical.
- `components/monitoring/store-monitoring-page.tsx`: Live polling telemetri fasa dan asynchronous session switching untuk grafik beban.
- `components/monitoring/store-hero.tsx`: Perlindungan safe reducer pada perhitungan total beban saat ini.
- `.env`: Menambahkan connection string `SPARTA_DATABASE_URL` dan `AIVEN_DATABASE_URL`.

## Decisions

- **Agregasi Interval Waktu Berjenjang**:
  - **Harian (Day)**: Diagregasikan per **1 jam** rata-rata (menghasilkan 24 titik data bersih sepanjang 24 jam). Default langsung memilih **tanggal paling terbaru** di database (`18 Agu 2026`).
  - **Mingguan (Week)**: Diagregasikan per **1 hari** rata-rata (menghasilkan 7 titik data harian).
  - **Sesi Audit (Session)**: Menampilkan data detail (interval 15 menit) dilengkapi **Pagination & Windowing (Previous / Next Page)** agar navigasi sesi ratusan ribu data tetap instan dan tidak berat.
- **Default Visualisasi Terbaru**: Tanggal, minggu, dan sesi audit selalu otomatis dimulai dari data yang paling terbaru (DESC).
- **Dynamic Sensor & Phase Naming**: Nama dan kode sensor 100% dinamis mengikuti database (`L12 (Fase R)`, `L13 (Fase S)`, `L14 (Fase T)`, `L6 (Dummy)`).
- **Metric Parameter Selector**: Selector parameter kelistrikan (Daya W, Tegangan V, Arus A, Power Factor, Energi kWh, Frekuensi Hz).

## Verification

- `tsc --noEmit`: Berhasil 0 error typecheck.
- `next build`: Berhasil mengompilasi seluruh route dinamis dan API routes tanpa error.
- Query test langsung ke SPARTA DB dan Aiven DB memverifikasi data DC CIANJUR (`2JC2`), 4 sesi audit historis (>550k titik), dan telemetry 3-phase live.

## Remaining Work and Risks

None.
