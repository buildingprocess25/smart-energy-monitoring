# Dynamic Sensor Naming and Session Scoping

## Scope

- Menghapus hardcode mapping fase (`L12 -> L1`, `L13 -> L2`, dsb) di seluruh backend dan frontend.
- Membaca metadata sensor dinamis dari `devices.sensors` dan `history.phase_name` di database Aiven IoT.
- Membatasi (scope) sensor yang ditampilkan hanya pada sensor yang benar-benar aktif/terekam pada sesi audit atau rentang tanggal yang sedang dibuka.
- Membuat komponen `PhaseGaugeGrid` fleksibel untuk merender jumlah dan nama sensor apa pun secara dinamis tanpa batas kaku 3 fasa.

## Context and Sources

- Aiven PostgreSQL IoT DB: `devices` table (`sensors` JSONB column), `telemetry` table, and `history` table (`phase`, `phase_name`).
- `lib/types.ts`: Menambahkan `phaseName?: string` ke interface `PhaseData`.
- `lib/services/store-service.ts`: Query dinamis telemetri fasa dan mapping nama sensor.
- `lib/services/telemetry-service.ts`: Query sensor scoped per `session_id` / tanggal aktif.
- `components/monitoring/phase-gauge-grid.tsx`: Dynamic circular gauge rendering dengan tag channel dan indikator cadangan/dummy.
- `components/dashboard/network-map-widget.tsx`: Preview beban fasa dinamis di panel samping peta.

## Changed Files

- `lib/types.ts`: Menambahkan `phaseName?: string` pada `PhaseData`.
- `lib/services/store-service.ts`: Menghapus hardcode fase, membaca sensor config dinamis dari `dev.sensors`.
- `lib/services/telemetry-service.ts`: Membatasi sensor query sesuai sesi/tanggal aktif, menambahkan In-Memory LRU Cache, dan optimasi agregasi integer untuk sesi audit 325k baris.
- `components/monitoring/phase-gauge-grid.tsx`: Menampilkan nama sensor asli (`Fase R`, `Fase S`, `Fase T`, dsb) dan badge nomor channel.
- `components/dashboard/network-map-widget.tsx`: Menampilkan nama fasa asli pada preview beban fasa dan menggunakan link kode toko (`/monitoring/[storeCode]`).
- `components/dashboard/store-card.tsx` & `store-table.tsx` & `dashboard-overview.tsx` & `network-map-leaflet.tsx`: Menggunakan kode toko (`2JC2`) sebagai slug URL yang bersih dan ramah dibaca manusia.

## Decisions

- **Dynamic Sensor Mapping**: Nama sensor 100% mengikuti database (`Fase R`, `Fase S`, `Fase T`, `AC`, `Chiller`, dsb).
- **Session Scoping**: Sensor `L6 (Dummy)` hanya muncul pada sesi yang memang merekam sensor tersebut, dan tidak mengotori sesi audit murni 3-fasa.
- **Dynamic Gauge UI**: Siap menerima perangkat audit baru dengan konfigurasi 1 fasa, 3 fasa, maupun multi-channel (6+ channel) secara otomatis.

## Verification

- `tsc --noEmit`: Berhasil 0 error typecheck.
- `pnpm run check:agent-note`: Berhasil valid.

## Remaining Work and Risks

None.
