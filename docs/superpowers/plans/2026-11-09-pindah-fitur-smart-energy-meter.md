# Pindah Fitur Smart Energy Meter ke Portal: Tahap 1 (Fitur Baca)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Memindahkan fitur baca dari dashboard Flask `smart-energy-meter-vps` ke portal ini: grafik real-time di detail toko, halaman Sesi Rekaman, export sesi ke Excel/JSON, dan Buka File Rekaman. Flask tetap jalan dan tidak diubah.

**Architecture:** Flask tetap menjadi satu-satunya penerima data MQTT dan satu-satunya penulis ke DB 2. Portal membaca tabel `history` langsung dengan `SELECT` lewat pool yang sudah ada. Data live diambil dari `GET /api/live-buffer/<device_id>` di Flask oleh route server portal, jadi browser tidak pernah memanggil Flask langsung. Semua konversi data (normalisasi fase, parsing live buffer, susunan export, parsing file) ada di modul murni `lib/*.ts` tanpa import `@/`, supaya bisa dites dengan `node --test`.

**Tech Stack:** Next.js 16.2 App Router, React 19.2, TypeScript, `pg`, Recharts 3 (lewat `TelemetryChart` yang sudah ada), shadcn/ui di `@base-ui/react`, SheetJS `xlsx` 0.20.3 (dimuat dinamis hanya di browser), `node --test`.

## Global Constraints

- Portal tidak menulis ke DB 1 maupun DB 2 dan tidak mengubah skemanya. Semua query di plan ini hanya `SELECT` dengan parameter `$1`, `$2`.
- Flask `smart-energy-meter-vps` tidak diubah di Tahap 1.
- Jangan pernah menjalankan Flask `smart-energy-meter-vps` di lokal (`python backend/app.py`, `docker-compose up`, atau cara lain). Flask di VPS sedang merekam. Flask lokal akan ikut subscribe MQTT dan menulis ke database yang sama, sehingga ada dua perekaman sekaligus dan datanya dobel. Semua pengecekan memakai Flask di VPS lewat `TELEMETRY_API_URL`, dan hanya dengan request `GET`.
- `pnpm lint` di repo ini sudah gagal sebelum plan dimulai (error di file lama). Ukuran lulusnya: tidak ada error lint baru pada file dan baris yang diubah task itu.
- Normalisasi fase: `L12/L1/R` menjadi R, `L13/L2/S` menjadi S, `L14/L3/T` menjadi T. Fase `L6` dan fase yang mengandung `dummy` dibuang.
- Tanggal dan jam ditampilkan dalam `Asia/Jakarta`. Format angka memakai locale `id-ID`, delta energi dua desimal.
- Energi adalah delta counter `energy` per interval, bukan nilai counter mentah. Delta negatif atau di luar batas daya rata-rata dianggap reset, dan diganti dengan daya rata-rata × interval.
- Scope akses: setiap data perangkat lewat `getStoreById()` (sudah tersaring scope) atau dicek dengan `isDeviceAllowed(scope, deviceId)`. GS hanya melihat perangkatnya sendiri.
- Route API memanggil `requireApiAccess()` dan memvalidasi query/param lewat `lib/request-params.ts`; input salah dijawab 400.
- Modul murni di `lib/` (yang dites `node --test`) tidak boleh import `@/`. Import antar modul murni memakai path relatif dengan ekstensi `.ts`, dan import tipe memakai `import type`.
- Env baru `TELEMETRY_API_URL` khusus server (tanpa `NEXT_PUBLIC_`), fallback ke `NEXT_PUBLIC_TELEMETRY_API_URL`.
- UI: wajib memuat `impeccable`, `shadcn`, `antislop` + `antislop-ui`, dan `web-design-guidelines` sebelum mengerjakan task UI. Pakai primitif di `components/ui/`, tambah primitif baru dengan `npx shadcn@latest add <name>`, dan jangan menambah spacing manual pada komponen shadcn. Light mode dulu, warna emerald `#2c7a57`.
- Copy UI dalam Bahasa Indonesia. Istilah tetap: toko, cabang, perangkat, sesi rekaman, fase R/S/T, kWh.
- Jangan `git commit`. Perubahan dibiarkan di working tree untuk direview user.
- Verifikasi akhir: `pnpm typecheck`, `pnpm lint`, semua `pnpm test:*`, dan aplikasi yang berjalan (`next-dev-loop`).
- Semua pengaman di bagian **Jaminan untuk Alur IoT** wajib ada. Task yang melewatkan salah satunya dianggap belum selesai.

---

## Jaminan untuk Alur IoT

Alur yang harus tetap utuh: alat IoT → MQTT → Flask → `INSERT` ke `telemetry`/`history`/`devices`. Portal hanya boleh menjadi pembaca tambahan, dan bebannya harus dibatasi dengan angka yang jelas, bukan sekadar "seharusnya ringan".

Fakta Flask yang jadi dasar (dibaca 2026-11-09): Gunicorn **1 worker, 12 thread, gthread**. MQTT, worker capture, live buffer, dan API berjalan di proses yang sama. Pool DB Flask memakai `psycopg2 ThreadedConnectionPool`. Dashboard Flask sendiri memanggil `GET /api/live-buffer/<id>` penuh **tiap 3 detik untuk setiap user yang membukanya** (`frontend/app.js:3550`).

| Risiko | Pengaman di plan ini | Batas yang dijamin | Dibuktikan oleh |
| :--- | :--- | :--- | :--- |
| Portal menulis atau mengubah data IoT | Tidak ada kode `INSERT`/`UPDATE`/`DELETE`. Query sesi baru berjalan di transaksi `BEGIN READ ONLY`, jadi Postgres menolak penulisan apa pun | 0 penulisan | `tests/read-only.test.mjs` (Task 5), grep Task 9 |
| Flask sibuk karena banyak penonton grafik live | Cache bersama per perangkat dan penggabungan request yang datang bersamaan (`lib/shared-fetch.ts`) | Maksimal **1 panggilan per perangkat per 3 detik** per container portal, berapa pun jumlah tab yang terbuka | `tests/shared-fetch.test.mjs` (Task 3), uji 5 tab di Task 9 |
| Flask sedang lambat atau error, lalu portal terus memanggil | Timeout 3 detik. Setelah gagal, perangkat itu tidak dipanggil lagi selama 15 detik | Saat Flask bermasalah: maksimal 1 panggilan per perangkat per 15 detik | `tests/shared-fetch.test.mjs` (Task 3) |
| Halaman ditinggal terbuka seharian | Polling berhenti saat tab tidak dilihat. Interval 5 detik | 0 panggilan dari tab tersembunyi | Cek tab Network di Task 4 |
| Query export atau daftar sesi menahan DB lama | `SET LOCAL statement_timeout` 15 detik di setiap query sesi. Batas 200.000 record per export. Daftar sesi di-cache 30 detik per scope | Satu query sesi paling lama 15 detik. Daftar sesi maksimal 1 query per 30 detik per scope | `tests/read-only.test.mjs`, `tests/shared-fetch.test.mjs` |
| Koneksi Postgres habis sehingga Flask gagal menulis | Tidak ada pool baru. Semua query memakai `getTelemetryPool()` yang sudah ada (`max: 10`) | Koneksi portal ke DB 2 tetap maksimal 10, sama dengan sekarang | Cek `pg_stat_activity` di Task 9 |
| Query portal mengunci tabel | `SELECT` hanya mengambil `AccessShareLock`, yang tidak menghalangi `INSERT`. Pengecualian: saat Flask **restart**, `init_db()` menjalankan `ALTER TABLE ... ADD COLUMN IF NOT EXISTS`, yang harus menunggu query portal yang sedang berjalan selesai, dan `INSERT` yang datang setelahnya ikut antre. `init_db()` berjalan sebelum worker capture dan live buffer dimulai, dan tunggunya dibatasi timeout 15 detik | Saat Flask berjalan normal, `INSERT` tidak pernah menunggu portal. Saat Flask restart, start-up bisa tertunda paling lama 15 detik | Uji capture berjalan di Task 9 |

Yang tidak bisa dijamin oleh portal: kalau portal dijalankan di lebih dari satu container, batas "1 panggilan per perangkat per 3 detik" berlaku per container. Saat ini portal berjalan sebagai satu container di Dokploy.

Hasil akhirnya, beban grafik live dari portal ke Flask **lebih kecil** daripada beban dashboard Flask sendiri: dashboard Flask menambah 1 panggilan per 3 detik untuk setiap user, sedangkan portal tetap 1 panggilan per perangkat per 3 detik untuk semua user.

---

## Struktur File

| File | Status | Tanggung jawab |
| :--- | :--- | :--- |
| `tsconfig.json` | Ubah | Izinkan import `.ts` antar modul murni |
| `lib/phase-keys.ts` | Baru, murni | Normalisasi fase, filter fase, urutan, nama bawaan, warna sensor |
| `lib/live-buffer.ts` | Baru, murni | Ubah respons `live-buffer` Flask menjadi `TelemetryPoint[]` + `SensorMeta[]` |
| `lib/session-records.ts` | Baru, murni | Kelompokkan baris `history` per fase, hitung delta energi, ringkasan, data chart |
| `lib/session-files.ts` | Baru, murni | Susun dan baca file backup JSON dan workbook Excel (format sama dengan Flask) |
| `lib/shared-fetch.ts` | Baru, murni | Cache bersama dengan TTL, penggabungan request bersamaan, dan jeda setelah gagal |
| `lib/db/read-only.ts` | Baru, murni | `readOnlyQuery()`: transaksi `READ ONLY` + `statement_timeout` |
| `lib/request-params.ts` | Ubah | `parseSinceParam`, `parseSessionId` |
| `lib/types.ts` | Ubah | Tipe `LiveBufferResult`, `SessionRecord`, `SessionPhaseRecords`, `SessionRecordsResult`, `RecordingSessionSummary` |
| `lib/services/telemetry-api.ts` | Baru | `fetchTelemetryApi()` ke Flask dengan timeout |
| `lib/services/live-buffer-service.ts` | Baru | `getStoreLiveBuffer()` |
| `lib/services/session-service.ts` | Baru | `getRecordingSessions()`, `getSessionRecords()` |
| `lib/services/telemetry-service.ts` | Ubah | Pakai `sensorColor()` dari `lib/phase-keys.ts` |
| `app/api/stores/[storeId]/live/route.ts` | Baru | JSON live buffer per toko |
| `app/api/sessions/[sessionId]/records/route.ts` | Baru | JSON semua record satu sesi |
| `components/monitoring/live-telemetry-chart.tsx` | Baru | Grafik real-time dengan polling |
| `components/sessions/session-export-menu.tsx` | Baru | Tombol export Excel dan backup JSON |
| `components/sessions/session-table.tsx` | Baru | Tabel sesi dengan pencarian |
| `components/tools/session-file-viewer.tsx` | Baru | Unggah file, tampilkan grafik dan tabel |
| `app/(dashboard)/sesi-rekaman/page.tsx` | Baru | Halaman Sesi Rekaman |
| `app/(dashboard)/alat/buka-file/page.tsx` | Baru | Halaman Buka File Rekaman |
| `components/monitoring/store-monitoring-page.tsx` | Ubah | Tambah grafik live dan menu export |
| `components/layout/app-sidebar.tsx`, `components/layout/breadcrumb-nav.tsx` | Ubah | Menu dan label baru |
| `package.json` | Ubah | Dependensi `xlsx`, script `test:data` |
| `tests/phase-keys.test.mjs`, `tests/live-buffer.test.mjs`, `tests/shared-fetch.test.mjs`, `tests/read-only.test.mjs`, `tests/session-records.test.mjs`, `tests/session-files.test.mjs` | Baru | Tes modul murni |
| `.env.example`, `ARCHITECTURE_PLAN.md`, `CLAUDE.md`, `AI_CONTEXT.md` | Ubah | Dokumen dan env |
| `docs/agent-notes/2026-11-09-HHMM-pindah-fitur-smart-energy-meter-tahap-1.md` | Baru | Catatan task |

## Fakta dari Flask yang dipakai plan ini

Dibaca dari `C:\ALfa\smart-energy-meter-vps\backend\app.py` dan `frontend/app.js` pada 2026-11-09. Verifikasi ulang kalau Flask sudah berubah.

- `GET /api/live-buffer/<device_id>` mengembalikan array sampai 1.200 item, satu per detik (sekitar 20 menit): `{ "timestamp": <epoch ms>, "data": {...} }`. `data` berisi `{ "offline": true }` saat perangkat offline. Kalau online, `data` adalah objek datar: kunci fase (`R`, `L12`, `CT`, `AC_1`, dan sebagainya) berisi `{ "Voltage (V)", "Current (A)", "Power (W)", "Frequency (Hz)", "Active Energy (kWh)", "Power Factor", ... }`, ditambah kunci non-fase `Timestamp`, `status`, `meta`, `cmd`, `realtime`, `RealTime`.
- Kunci fase valid menurut Flask: bukan kunci non-fase dan cocok dengan `^[A-Za-z0-9_\-\s]{1,50}$`.
- Tabel `history`: `device_id`, `phase`, `timestamp` (teks `HH:MM:SS DD/MM/YYYY` WIB), `epoch` (ms), `voltage`, `current`, `power`, `frequency`, `energy`, `power_factor`, `offline`, `session_id` (maks 50 karakter), `session_name`, `phase_name`, `device_name`, `store_id`.
- Format backup JSON Flask: `{ schema: "smart-energy-meter-backup", version: "1.0", exportedAt, session: { id, name, deviceId, deviceName, startTime, endTime, recordCount, phaseNames }, records: { <fase>: [ { timestamp, epoch, offline, Voltage, Current, Power, Frequency, Energy, PowerFactor } ] } }`.
- Format Excel Flask: satu sheet per fase (nama sheet = nama sensor), kolom `Device Name`, `Timestamp`, `Status` (`online`/`OFFLINE`), `Voltage (V)`, `Current (A)`, `Power (W)`, `Frequency (Hz)`, `Active Energy (kWh)`, `Power Factor`, ditambah sheet `Summary`.

File yang dibuat portal memakai format yang sama, jadi file lama dari Flask bisa dibuka di portal dan sebaliknya.

---

### Task 1: Modul fase bersama

**Files:**
- Modify: `tsconfig.json`
- Create: `lib/phase-keys.ts`
- Modify: `lib/services/telemetry-service.ts:23-49`
- Modify: `package.json` (scripts)
- Test: `tests/phase-keys.test.mjs`

**Interfaces:**
- Produces:
  - `normalizePhaseKey(raw: string): string`
  - `isExcludedPhase(raw: string): boolean`
  - `isPhaseKey(key: string): boolean`
  - `comparePhase(a: string, b: string): number`
  - `defaultPhaseName(phase: string): string`
  - `sensorColor(phase: string, name: string, index: number): string`

- [ ] **Step 1: Izinkan import `.ts`**

Di `tsconfig.json`, tambahkan di `compilerOptions` (aman karena `noEmit: true` sudah ada):

```json
"allowImportingTsExtensions": true,
```

- [ ] **Step 2: Tulis tes yang gagal**

`tests/phase-keys.test.mjs`:

```js
import { test } from 'node:test'
import assert from 'node:assert/strict'
import {
  normalizePhaseKey,
  isExcludedPhase,
  isPhaseKey,
  comparePhase,
  defaultPhaseName,
  sensorColor,
} from '../lib/phase-keys.ts'

test('normalizePhaseKey maps old and new topics to R/S/T', () => {
  assert.equal(normalizePhaseKey('L12'), 'R')
  assert.equal(normalizePhaseKey('l1'), 'R')
  assert.equal(normalizePhaseKey('r'), 'R')
  assert.equal(normalizePhaseKey('L13'), 'S')
  assert.equal(normalizePhaseKey('L2'), 'S')
  assert.equal(normalizePhaseKey('L14'), 'T')
  assert.equal(normalizePhaseKey('L3'), 'T')
  assert.equal(normalizePhaseKey(' CT '), 'CT')
  assert.equal(normalizePhaseKey('AC_1'), 'AC_1')
})

test('isExcludedPhase drops L6 and dummy sensors', () => {
  assert.equal(isExcludedPhase('L6'), true)
  assert.equal(isExcludedPhase('l6'), true)
  assert.equal(isExcludedPhase('Dummy_1'), true)
  assert.equal(isExcludedPhase('sensor-dummy'), true)
  assert.equal(isExcludedPhase('R'), false)
})

test('isPhaseKey rejects Flask metadata keys', () => {
  for (const k of ['Timestamp', 'timestamp', 'meta', 'offline', 'status', 'cmd', 'realtime', 'RealTime']) {
    assert.equal(isPhaseKey(k), false, k)
  }
  assert.equal(isPhaseKey('L12'), true)
  assert.equal(isPhaseKey('AC_1'), true)
  assert.equal(isPhaseKey('a/b'), false)
  assert.equal(isPhaseKey(''), false)
})

test('comparePhase puts R, S, T first then sorts by name', () => {
  assert.deepEqual(['CT', 'T', 'AC_1', 'R', 'S'].sort(comparePhase), ['R', 'S', 'T', 'AC_1', 'CT'])
})

test('defaultPhaseName labels main phases', () => {
  assert.equal(defaultPhaseName('R'), 'Fase R')
  assert.equal(defaultPhaseName('CT'), 'CT')
})

test('sensorColor keeps the existing R/S/T colors', () => {
  assert.equal(sensorColor('R', '', 0), '#10b981')
  assert.equal(sensorColor('S', '', 0), '#3b82f6')
  assert.equal(sensorColor('T', '', 0), '#f59e0b')
  assert.equal(sensorColor('X1', 'Freezer Es Krim', 0), '#6366f1')
  assert.equal(sensorColor('X2', '', 1), '#3b82f6')
})
```

- [ ] **Step 3: Jalankan tes, pastikan gagal**

Run: `node --test tests/phase-keys.test.mjs`
Expected: FAIL, `Cannot find module '.../lib/phase-keys.ts'`

- [ ] **Step 4: Tulis implementasi**

`lib/phase-keys.ts`:

```ts
// Phase key rules shared by live data, sessions and exported files.
// No imports, so `node --test` can load this file directly.

const PHASE_ALIASES: Record<string, 'R' | 'S' | 'T'> = {
  L12: 'R', L1: 'R', R: 'R',
  L13: 'S', L2: 'S', S: 'S',
  L14: 'T', L3: 'T', T: 'T',
}

// Keys in a Flask live payload that are not sensors.
const NON_PHASE_KEYS = new Set(['Timestamp', 'timestamp', 'meta', 'offline', 'status', 'cmd', 'realtime', 'RealTime'])
const PHASE_KEY_PATTERN = /^[A-Za-z0-9_\-\s]{1,50}$/
const MAIN_ORDER: Record<string, number> = { R: 0, S: 1, T: 2 }

export function normalizePhaseKey(raw: string): string {
  const key = raw.trim()
  return PHASE_ALIASES[key.toUpperCase()] ?? key
}

export function isExcludedPhase(raw: string): boolean {
  const key = raw.trim().toUpperCase()
  return key === 'L6' || key.includes('DUMMY')
}

export function isPhaseKey(key: string): boolean {
  if (!key || NON_PHASE_KEYS.has(key)) return false
  return PHASE_KEY_PATTERN.test(key.trim()) && key.trim().length > 0
}

// Object.hasOwn so sensor keys like "constructor" are not read from Object.prototype.
const mainOrder = (phase: string): number => (Object.hasOwn(MAIN_ORDER, phase) ? MAIN_ORDER[phase] : 99)

export function comparePhase(a: string, b: string): number {
  const oa = mainOrder(a)
  const ob = mainOrder(b)
  if (oa !== ob) return oa - ob
  return a.localeCompare(b, 'id-ID', { numeric: true })
}

export function defaultPhaseName(phase: string): string {
  return Object.hasOwn(MAIN_ORDER, phase) ? `Fase ${phase}` : phase
}

const DEFAULT_PALETTE = [
  '#10b981', // emerald-500
  '#3b82f6', // blue-500
  '#f59e0b', // amber-500
  '#a855f7', // purple-500
  '#ec4899', // pink-500
  '#06b6d4', // cyan-500
  '#f97316', // orange-500
  '#64748b', // slate-500
]

export function sensorColor(phase: string, name: string, index: number): string {
  const p = phase.toUpperCase()
  const n = (name || '').toLowerCase()

  if (n.includes('fase r') || n.includes('phase r') || p === 'R') return '#10b981'
  if (n.includes('fase s') || n.includes('phase s') || p === 'S') return '#3b82f6'
  if (n.includes('fase t') || n.includes('phase t') || p === 'T') return '#f59e0b'
  if (n.includes('ac') || n.includes('air conditioner') || n.includes('hvac') || n.includes('cooler')) return '#06b6d4'
  if (n.includes('chiller') || n.includes('showcase') || n.includes('refrigerat')) return '#3b82f6'
  if (n.includes('freezer')) return '#6366f1'
  if (n.includes('lampu') || n.includes('light') || n.includes('penerangan')) return '#eab308'
  if (n.includes('heater') || n.includes('cooker') || n.includes('oven') || n.includes('microwave')) return '#f97316'
  if (n.includes('dummy') || p === 'L6') return '#94a3b8'

  return DEFAULT_PALETTE[index % DEFAULT_PALETTE.length]
}
```

- [ ] **Step 5: Pakai `sensorColor` di telemetry-service**

Di `lib/services/telemetry-service.ts`, hapus `DEFAULT_PALETTE` dan `getSensorColor` (baris 23-49), lalu tambahkan import:

```ts
import { sensorColor as getSensorColor } from '@/lib/phase-keys'
```

Pemanggil `getSensorColor(...)` yang lain tidak perlu diubah karena namanya tetap. Cek dulu dengan grep bahwa `DEFAULT_PALETTE` tidak dipakai di tempat lain di file itu. Kalau masih dipakai, ekspor `DEFAULT_PALETTE` dari `lib/phase-keys.ts` dan import juga.

- [ ] **Step 6: Tambah script tes**

Di `package.json` bagian `scripts`:

```json
"test:data": "node --test tests/phase-keys.test.mjs tests/live-buffer.test.mjs tests/shared-fetch.test.mjs tests/read-only.test.mjs tests/session-records.test.mjs tests/session-files.test.mjs"
```

Selama file tes lain belum ada, jalankan file ini saja.

- [ ] **Step 7: Jalankan tes dan typecheck**

Run: `node --test tests/phase-keys.test.mjs` → Expected: 6 tes PASS
Run: `pnpm typecheck` → Expected: tanpa error

---

### Task 2: Parser live buffer

**Files:**
- Modify: `lib/types.ts` (tambah di akhir file)
- Create: `lib/live-buffer.ts`
- Test: `tests/live-buffer.test.mjs`

**Interfaces:**
- Consumes: `normalizePhaseKey`, `isExcludedPhase`, `isPhaseKey`, `comparePhase`, `defaultPhaseName`, `sensorColor` (Task 1); `TelemetryPoint`, `SensorMeta` dari `lib/types.ts`
- Produces:
  - `interface LiveBufferResult { sensors: SensorMeta[]; points: TelemetryPoint[]; offline: boolean; lastEpoch: number | null }` di `lib/types.ts`
  - `parseLiveBuffer(raw: unknown, since: number | null): LiveBufferResult`
  - `formatJakartaTime(epochMs: number): string` (hasil `HH:MM:SS`)
  - Kunci titik: `${phase}_power`, `${phase}_voltage`, `${phase}_current`, `${phase}_powerFactor`, `${phase}_frequency`, `${phase}_energy`, dan `totalPower`, `epoch`

- [ ] **Step 1: Tambah tipe**

Di akhir `lib/types.ts`:

```ts
export interface LiveBufferResult {
  sensors: SensorMeta[]
  points: TelemetryPoint[]
  offline: boolean
  lastEpoch: number | null
}
```

- [ ] **Step 2: Tulis tes yang gagal**

`tests/live-buffer.test.mjs`:

```js
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { parseLiveBuffer, formatJakartaTime } from '../lib/live-buffer.ts'

const metrics = (w, v = 220) => ({
  'Voltage (V)': v,
  'Current (A)': w / v,
  'Power (W)': w,
  'Frequency (Hz)': 50,
  'Active Energy (kWh)': 12.5,
  'Power Factor': 0.9,
})

// 2026-11-09 10:00:00 WIB
const T0 = Date.UTC(2026, 10, 9, 3, 0, 0)

test('formatJakartaTime shows WIB clock time', () => {
  assert.equal(formatJakartaTime(T0), '10:00:00')
})

test('parseLiveBuffer normalizes phases and drops metadata and L6', () => {
  const raw = [
    {
      timestamp: T0,
      data: { L12: metrics(100), L13: metrics(200), L6: metrics(5), Timestamp: 'x', status: { relay: 'ON' } },
    },
  ]
  const r = parseLiveBuffer(raw, null)
  assert.deepEqual(r.sensors.map((s) => s.phase), ['R', 'S'])
  assert.equal(r.sensors[0].name, 'Fase R')
  assert.equal(r.points.length, 1)
  assert.equal(r.points[0].R_power, 100)
  assert.equal(r.points[0].S_voltage, 220)
  assert.equal(r.points[0].totalPower, 300)
  assert.equal(r.points[0].timestamp, '10:00:00')
  assert.equal(r.offline, false)
  assert.equal(r.lastEpoch, T0)
})

test('parseLiveBuffer keeps only points after since', () => {
  const raw = [
    { timestamp: T0, data: { R: metrics(100) } },
    { timestamp: T0 + 1000, data: { R: metrics(110) } },
  ]
  const r = parseLiveBuffer(raw, T0)
  assert.equal(r.points.length, 1)
  assert.equal(r.points[0].R_power, 110)
  assert.equal(r.lastEpoch, T0 + 1000)
})

test('parseLiveBuffer reports offline when the latest item is offline', () => {
  const raw = [
    { timestamp: T0, data: { R: metrics(100) } },
    { timestamp: T0 + 1000, data: { offline: true } },
  ]
  const r = parseLiveBuffer(raw, null)
  assert.equal(r.offline, true)
  assert.equal(r.points.length, 1)
  assert.equal(r.lastEpoch, T0 + 1000)
})

test('parseLiveBuffer tolerates bad input', () => {
  assert.deepEqual(parseLiveBuffer(null, null), { sensors: [], points: [], offline: true, lastEpoch: null })
  assert.deepEqual(parseLiveBuffer([{ nope: 1 }, 'x'], null).points, [])
})

test('parseLiveBuffer treats null and empty values as missing, not zero', () => {
  const raw = [
    { timestamp: null, data: { R: metrics(100) } },
    { timestamp: T0, data: { R: { 'Power (W)': null, 'Voltage (V)': '', 'Current (A)': true, 'Power Factor': '0.9' } } },
    { timestamp: T0 + 1000, data: { Timestamp: 'x', status: {} } },
  ]
  const r = parseLiveBuffer(raw, null)
  assert.equal(r.lastEpoch, T0 + 1000)
  assert.equal(r.points.length, 1)
  assert.equal('R_power' in r.points[0], false)
  assert.equal('R_voltage' in r.points[0], false)
  assert.equal('R_current' in r.points[0], false)
  assert.equal(r.points[0].R_powerFactor, 0.9)
  assert.equal(r.points[0].totalPower, 0)
})
```

- [ ] **Step 3: Jalankan tes, pastikan gagal**

Run: `node --test tests/live-buffer.test.mjs`
Expected: FAIL, module not found

- [ ] **Step 4: Tulis implementasi**

`lib/live-buffer.ts`:

```ts
// Turns the Flask /api/live-buffer/<device_id> response into chart points.
// No `@/` imports, so `node --test` can load this file directly.
import type { LiveBufferResult, SensorMeta, TelemetryPoint } from './types.ts'
import {
  comparePhase,
  defaultPhaseName,
  isExcludedPhase,
  isPhaseKey,
  normalizePhaseKey,
  sensorColor,
} from './phase-keys.ts'

const FIELD_MAP: Record<string, string> = {
  'Power (W)': 'power',
  'Voltage (V)': 'voltage',
  'Current (A)': 'current',
  'Power Factor': 'powerFactor',
  'Frequency (Hz)': 'frequency',
  'Active Energy (kWh)': 'energy',
}

const TIME_FORMAT = new Intl.DateTimeFormat('en-GB', {
  timeZone: 'Asia/Jakarta',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  hour12: false,
})

export function formatJakartaTime(epochMs: number): string {
  return TIME_FORMAT.format(new Date(epochMs))
}

// Only real numbers count. null, '', booleans and other values are "no reading",
// never 0, so a missing metric is not plotted as 0 W and a missing time is not 1970.
function toNumber(value: unknown): number | null {
  if (typeof value === 'number') return Number.isFinite(value) ? value : null
  if (typeof value === 'string' && value.trim() !== '') {
    const n = Number(value)
    return Number.isFinite(n) ? n : null
  }
  return null
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

export function parseLiveBuffer(raw: unknown, since: number | null): LiveBufferResult {
  if (!Array.isArray(raw)) return { sensors: [], points: [], offline: true, lastEpoch: null }

  const phases = new Set<string>()
  const points: TelemetryPoint[] = []
  let offline = true
  let lastEpoch: number | null = null

  for (const item of raw) {
    if (!isRecord(item)) continue
    const epoch = toNumber(item.timestamp)
    if (epoch === null || !isRecord(item.data)) continue

    lastEpoch = lastEpoch === null ? epoch : Math.max(lastEpoch, epoch)
    if (item.data.offline === true) {
      offline = true
      continue
    }
    offline = false
    if (since !== null && epoch <= since) continue

    const point: TelemetryPoint = {
      timestamp: formatJakartaTime(epoch),
      epoch,
      totalPower: 0,
    }
    let hasReading = false
    for (const [key, value] of Object.entries(item.data)) {
      if (!isPhaseKey(key) || isExcludedPhase(key) || !isRecord(value)) continue
      const phase = normalizePhaseKey(key)
      phases.add(phase)
      for (const [field, metric] of Object.entries(FIELD_MAP)) {
        const n = toNumber(value[field])
        if (n === null) continue
        point[`${phase}_${metric}`] = n
        if (metric === 'power') point.totalPower = (point.totalPower ?? 0) + n
        hasReading = true
      }
    }
    // A sample with no sensor reading would draw a false zero.
    if (hasReading) points.push(point)
  }

  const sensors: SensorMeta[] = [...phases].sort(comparePhase).map((phase, index) => {
    const name = defaultPhaseName(phase)
    return { phase, name, color: sensorColor(phase, name, index) }
  })

  return { sensors, points, offline, lastEpoch }
}
```

- [ ] **Step 5: Jalankan tes, pastikan lolos**

Run: `node --test tests/live-buffer.test.mjs` → Expected: 5 tes PASS
Run: `pnpm typecheck` → Expected: tanpa error

---

### Task 3: Route live per toko

**Files:**
- Create: `lib/shared-fetch.ts`, `tests/shared-fetch.test.mjs`
- Modify: `lib/request-params.ts`, `tests/request-params.test.mjs`
- Create: `lib/services/telemetry-api.ts`, `lib/services/live-buffer-service.ts`, `app/api/stores/[storeId]/live/route.ts`
- Modify: `.env.example`

**Interfaces:**
- Consumes: `parseLiveBuffer` (Task 2), `getStoreById` dari `lib/services/store-service.ts`, `requireApiAccess` dari `lib/auth/api-guard.ts`
- Produces:
  - `createSharedFetch<T>(load: (key: string) => Promise<T>, options: SharedFetchOptions): (key: string) => Promise<T>`, dengan `SharedFetchOptions = { ttlMs: number; failureBackoffMs: number; maxKeys?: number; now?: () => number }`
  - `class BackoffError extends Error`
  - `parseSinceParam(raw: string | null): ParseResult<number | null>`
  - `parseSessionId(raw: string): ParseResult<string>` (dipakai Task 5)
  - `class TelemetryApiError extends Error`
  - `fetchTelemetryApi(path: string, timeoutMs?: number): Promise<unknown>`
  - `getStoreLiveBuffer(storeId: string, since: number | null): Promise<LiveBufferResult | null>`
  - `GET /api/stores/[storeId]/live?since=<epoch ms>` → `200 LiveBufferResult`, `400`, `404`, `502`

- [ ] **Step 0a: Tulis tes cache bersama yang gagal**

`tests/shared-fetch.test.mjs`:

```js
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { createSharedFetch, BackoffError } from '../lib/shared-fetch.ts'

function clock(start = 0) {
  let t = start
  return { now: () => t, advance: (ms) => { t += ms } }
}

test('serves one load per key within the TTL', async () => {
  const c = clock()
  let calls = 0
  const get = createSharedFetch(async (k) => { calls++; return `${k}:${calls}` }, { ttlMs: 3000, failureBackoffMs: 15000, now: c.now })
  assert.equal(await get('EM-1'), 'EM-1:1')
  c.advance(2999)
  assert.equal(await get('EM-1'), 'EM-1:1')
  assert.equal(calls, 1)
  c.advance(1)
  assert.equal(await get('EM-1'), 'EM-1:2')
  assert.equal(calls, 2)
})

test('keys are cached separately', async () => {
  let calls = 0
  const get = createSharedFetch(async (k) => { calls++; return k }, { ttlMs: 3000, failureBackoffMs: 0 })
  await get('A')
  await get('B')
  assert.equal(calls, 2)
})

test('concurrent callers share one in-flight load', async () => {
  let calls = 0
  let release
  const gate = new Promise((r) => { release = r })
  const get = createSharedFetch(async () => { calls++; await gate; return 'ok' }, { ttlMs: 3000, failureBackoffMs: 0 })
  const all = Promise.all([get('A'), get('A'), get('A'), get('A'), get('A')])
  release()
  assert.deepEqual(await all, ['ok', 'ok', 'ok', 'ok', 'ok'])
  assert.equal(calls, 1)
})

test('after a failure the key is not loaded again during the backoff', async () => {
  const c = clock()
  let calls = 0
  const get = createSharedFetch(async () => { calls++; throw new Error('down') }, { ttlMs: 3000, failureBackoffMs: 15000, now: c.now })
  await assert.rejects(get('A'), /down/)
  c.advance(14999)
  await assert.rejects(get('A'), BackoffError)
  assert.equal(calls, 1)
  c.advance(1)
  await assert.rejects(get('A'), /down/)
  assert.equal(calls, 2)
})

test('a failure keeps no stale success and the next success is cached again', async () => {
  const c = clock()
  let fail = false
  let calls = 0
  const get = createSharedFetch(async () => { calls++; if (fail) throw new Error('x'); return calls }, { ttlMs: 1000, failureBackoffMs: 0, now: c.now })
  assert.equal(await get('A'), 1)
  c.advance(1000)
  fail = true
  await assert.rejects(get('A'))
  fail = false
  assert.equal(await get('A'), 3)
  assert.equal(await get('A'), 3)
})

test('the cache never holds more than maxKeys entries', async () => {
  let calls = 0
  const get = createSharedFetch(async (k) => { calls++; return k }, { ttlMs: 60000, failureBackoffMs: 0, maxKeys: 2 })
  await get('A')
  await get('B')
  await get('C')
  await get('A')
  assert.equal(calls, 4)
})
```

Run: `node --test tests/shared-fetch.test.mjs`
Expected: FAIL, module not found

- [ ] **Step 0b: Implementasi cache bersama**

`lib/shared-fetch.ts`:

```ts
// Shared cache that caps how often a slow upstream is called, whatever the number of viewers.
// No imports, so `node --test` can load this file directly.

export interface SharedFetchOptions {
  ttlMs: number
  // After a failed load, the key is not loaded again for this long.
  failureBackoffMs: number
  maxKeys?: number
  now?: () => number
}

export class BackoffError extends Error {}

type Entry<T> = { value?: T; at: number; failedAt?: number; inflight?: Promise<T> }

export function createSharedFetch<T>(
  load: (key: string) => Promise<T>,
  options: SharedFetchOptions
): (key: string) => Promise<T> {
  const entries = new Map<string, Entry<T>>()
  const now = options.now ?? Date.now
  const maxKeys = options.maxKeys ?? 500

  function remember(key: string, entry: Entry<T>) {
    entries.delete(key)
    entries.set(key, entry)
    while (entries.size > maxKeys) {
      const oldest = entries.keys().next().value as string
      entries.delete(oldest)
    }
  }

  return function get(key: string): Promise<T> {
    const entry = entries.get(key)
    const t = now()
    if (entry?.inflight) return entry.inflight
    if (entry && entry.failedAt === undefined && t - entry.at < options.ttlMs) {
      return Promise.resolve(entry.value as T)
    }
    if (entry?.failedAt !== undefined && t - entry.failedAt < options.failureBackoffMs) {
      return Promise.reject(new BackoffError('Sumber data sedang dijeda setelah gagal.'))
    }

    const inflight = load(key).then(
      (value) => {
        remember(key, { value, at: now() })
        return value
      },
      (error) => {
        remember(key, { at: 0, failedAt: now() })
        throw error
      }
    )
    remember(key, { at: 0, inflight })
    return inflight
  }
}
```

Run: `node --test tests/shared-fetch.test.mjs` → Expected: 6 tes PASS

- [ ] **Step 0c: Catat konstanta beban**

Nilai yang dipakai di Task 3 dan Task 5, jangan diubah tanpa memperbarui tabel **Jaminan untuk Alur IoT**:

| Pemakai | `ttlMs` | `failureBackoffMs` |
| :--- | :--- | :--- |
| Live buffer per perangkat | 3000 | 15000 |
| Daftar sesi per scope | 30000 | 30000 |

- [ ] **Step 1: Tulis tes parameter yang gagal**

Tambahkan di `tests/request-params.test.mjs` (perbarui baris import yang sudah ada):

```js
import { isIsoDate, parseDateParam, parseHistoryParams, parseSinceParam, parseSessionId } from '../lib/request-params.ts'

test('parseSinceParam accepts a missing value or a positive epoch in ms', () => {
  assert.deepEqual(parseSinceParam(null), { ok: true, value: null })
  assert.deepEqual(parseSinceParam(''), { ok: true, value: null })
  assert.deepEqual(parseSinceParam('1762657200000'), { ok: true, value: 1762657200000 })
  assert.equal(parseSinceParam('-1').ok, false)
  assert.equal(parseSinceParam('12abc').ok, false)
  assert.equal(parseSinceParam('1e20').ok, false)
})

test('parseSessionId accepts ids the history table can hold', () => {
  assert.deepEqual(parseSessionId('sess_1762657200'), { ok: true, value: 'sess_1762657200' })
  assert.equal(parseSessionId('').ok, false)
  assert.equal(parseSessionId('a'.repeat(51)).ok, false)
  assert.equal(parseSessionId("x' OR 1=1").ok, false)
})
```

- [ ] **Step 2: Jalankan, pastikan gagal**

Run: `pnpm test:params`
Expected: FAIL, `parseSinceParam is not a function`

- [ ] **Step 3: Implementasi parameter**

Tambahkan di `lib/request-params.ts`:

```ts
// Epoch in ms, no later than year 2100.
const MAX_EPOCH_MS = 4_102_444_800_000

export function parseSinceParam(raw: string | null): ParseResult<number | null> {
  if (raw === null || raw === '') return { ok: true, value: null }
  if (!/^\d{1,13}$/.test(raw)) return { ok: false, error: 'since harus epoch dalam milidetik.' }
  const value = Number(raw)
  if (value > MAX_EPOCH_MS) return { ok: false, error: 'since di luar rentang.' }
  return { ok: true, value }
}

// history.session_id is VARCHAR(50).
export function parseSessionId(raw: string): ParseResult<string> {
  if (!/^[A-Za-z0-9_\-:.]{1,50}$/.test(raw)) return { ok: false, error: 'ID sesi tidak valid.' }
  return { ok: true, value: raw }
}
```

Run: `pnpm test:params` → Expected: semua PASS

- [ ] **Step 4: Klien API Flask**

`lib/services/telemetry-api.ts`:

```ts
import 'server-only'

export class TelemetryApiError extends Error {}

// Server-only base URL of the smart-energy-meter-vps API (ends with /api).
function telemetryApiBase(): string | null {
  const url = process.env.TELEMETRY_API_URL || process.env.NEXT_PUBLIC_TELEMETRY_API_URL
  return url ? url.replace(/\/+$/, '') : null
}

export async function fetchTelemetryApi(path: string, timeoutMs = 3000): Promise<unknown> {
  const base = telemetryApiBase()
  if (!base) throw new TelemetryApiError('TELEMETRY_API_URL belum diisi.')

  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeoutMs)
  try {
    const res = await fetch(`${base}${path}`, { signal: controller.signal, cache: 'no-store' })
    if (!res.ok) throw new TelemetryApiError(`Server IoT menjawab ${res.status}.`)
    return await res.json()
  } catch (error) {
    if (error instanceof TelemetryApiError) throw error
    throw new TelemetryApiError('Server IoT tidak bisa dihubungi.')
  } finally {
    clearTimeout(timer)
  }
}
```

Cek dulu apakah paket `server-only` sudah ada (`pnpm why server-only`). Kalau belum, jalankan `pnpm add server-only`.

- [ ] **Step 5: Service live**

`lib/services/live-buffer-service.ts`:

```ts
import 'server-only'
import type { LiveBufferResult } from '@/lib/types'
import { parseLiveBuffer } from '@/lib/live-buffer'
import { createSharedFetch } from '@/lib/shared-fetch'
import { getStoreById } from '@/lib/services/store-service'
import { fetchTelemetryApi } from '@/lib/services/telemetry-api'

// Flask runs MQTT, capture and its API in one Gunicorn process, so the portal calls
// /live-buffer at most once per device every 3 s, however many viewers are open.
// After a failure the device is left alone for 15 s.
const loadLiveBuffer = createSharedFetch(
  (deviceId) => fetchTelemetryApi(`/live-buffer/${encodeURIComponent(deviceId)}`),
  { ttlMs: 3000, failureBackoffMs: 15000 }
)

// Returns null when the store is outside the caller's scope or has no device.
export async function getStoreLiveBuffer(
  storeId: string,
  since: number | null
): Promise<LiveBufferResult | null> {
  const store = await getStoreById(storeId)
  if (!store?.deviceId) return null
  const raw = await loadLiveBuffer(store.deviceId)
  return parseLiveBuffer(raw, since)
}
```

Scope dicek lewat `getStoreById()` sebelum cache dibaca, jadi cache yang dipakai bersama tidak membuka data perangkat ke user di luar scope. Parsing dan filter `since` berjalan di portal per request, bukan di Flask.

> **Koreksi dari review akhir (2026-11-09):** kode di atas memanggil `getStoreById()` di setiap polling. `cache()` React tidak berlaku di route handler, jadi setiap polling menjalankan seluruh pipeline `getStores()`: memanggil Flask `/capture/status` tanpa cache atau jeda, dan menjalankan query DB 2 per perangkat tanpa timeout. Ini melanggar tabel **Jaminan untuk Alur IoT**. Perbaikannya: hasil `storeId → deviceId` di-cache per (scope, storeId) selama 60 detik lewat `createSharedFetch`, dengan jeda 15 detik setelah gagal, dan `scopeKey()` dipindah ke `lib/auth/access-rules.ts` beserta tesnya. Pencabutan akses GS berlaku paling lambat 60 detik. Detailnya ada di `final-fix-brief.md` workspace SDD.

- [ ] **Step 6: Route**

`app/api/stores/[storeId]/live/route.ts`:

```ts
import { NextRequest, NextResponse } from 'next/server'
import { requireApiAccess } from '@/lib/auth/api-guard'
import { parseSinceParam } from '@/lib/request-params'
import { BackoffError } from '@/lib/shared-fetch'
import { getStoreLiveBuffer } from '@/lib/services/live-buffer-service'
import { TelemetryApiError } from '@/lib/services/telemetry-api'

export const dynamic = 'force-dynamic'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ storeId: string }> }
) {
  const denied = await requireApiAccess()
  if (denied) return denied

  const since = parseSinceParam(request.nextUrl.searchParams.get('since'))
  if (!since.ok) return NextResponse.json({ error: since.error }, { status: 400 })

  try {
    const { storeId } = await params
    const result = await getStoreLiveBuffer(storeId, since.value)
    if (!result) return NextResponse.json({ error: 'Toko tidak ditemukan.' }, { status: 404 })
    return NextResponse.json(result)
  } catch (error) {
    if (error instanceof TelemetryApiError || error instanceof BackoffError) {
      return NextResponse.json({ error: 'Data live tidak bisa diambil dari server IoT.' }, { status: 502 })
    }
    console.error('API /api/stores/[storeId]/live error:', error)
    return NextResponse.json({ error: 'Gagal mengambil data live.' }, { status: 500 })
  }
}
```

- [ ] **Step 7: Env contoh**

Di `.env.example`, bagian `# IoT Telemetry Engine`, tambahkan di atas `NEXT_PUBLIC_TELEMETRY_API_URL`:

```
# Server-only base URL of smart-energy-meter-vps (ends with /api). Falls back to NEXT_PUBLIC_TELEMETRY_API_URL.
# In Dokploy use the internal service name; locally use the public VPS address.
TELEMETRY_API_URL="http://HOST:5000/api"
```

- [ ] **Step 8: Verifikasi di aplikasi yang berjalan**

Restart `pnpm dev` setelah mengubah `.env`. Dengan cookie `dev_role=ADMIN`, buka `http://localhost:3000/api/stores/<storeId toko yang punya perangkat>/live`.
Expected: JSON dengan `sensors` tidak kosong dan `points` berisi titik dengan `timestamp` `HH:MM:SS`. Ulangi dengan `?since=<lastEpoch>` dan pastikan `points` jauh lebih sedikit. `?since=abc` harus menjawab 400.

Cek batas beban: tambahkan sementara `console.info('[live-buffer] fetch', deviceId)` di dalam fungsi `load` `loadLiveBuffer`, lalu refresh URL tadi 10 kali dalam 3 detik. Log harus muncul sekali saja. Hapus log itu setelah dicek.

Run: `pnpm typecheck` dan `pnpm lint` → Expected: tanpa error

---

### Task 4: Grafik real-time di detail toko

**Files:**
- Create: `components/monitoring/live-telemetry-chart.tsx`
- Modify: `components/monitoring/store-monitoring-page.tsx:355`

**Interfaces:**
- Consumes: `GET /api/stores/[storeId]/live` (Task 3), `TelemetryChart` dan `METRIC_CONFIG` dari `components/monitoring/telemetry-chart.tsx`, `LiveBufferResult`
- Produces: `LiveTelemetryChart({ storeId }: { storeId: string })`

Sebelum mulai: muat `impeccable`, `shadcn`, `antislop` + `antislop-ui`, `web-design-guidelines`. Baca juga props `TelemetryChart` di `components/monitoring/telemetry-chart.tsx` baris 1-27.

- [ ] **Step 1: Komponen polling**

`components/monitoring/live-telemetry-chart.tsx`:

```tsx
'use client'

import { useEffect, useRef, useState } from 'react'
import type { LiveBufferResult, MetricType, SensorMeta, TelemetryPoint } from '@/lib/types'
import { TelemetryChart, METRIC_CONFIG } from './telemetry-chart'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

// Same pace as the Flask chart (CHART_INTERVAL_MS 5000). The server caches per device anyway.
const POLL_MS = 5000
// Same window as the Flask RAM buffer: 1,200 one-second samples.
const MAX_POINTS = 1200
const LIVE_METRICS: MetricType[] = ['power', 'voltage', 'current', 'powerFactor', 'frequency']

type LiveState = 'loading' | 'live' | 'offline' | 'error'

export function LiveTelemetryChart({ storeId }: { storeId: string }) {
  const [points, setPoints] = useState<TelemetryPoint[]>([])
  const [sensors, setSensors] = useState<SensorMeta[]>([])
  const [state, setState] = useState<LiveState>('loading')
  const [metric, setMetric] = useState<MetricType>('power')
  const lastEpoch = useRef<number | null>(null)

  useEffect(() => {
    let cancelled = false
    let timer: ReturnType<typeof setTimeout> | undefined

    async function poll() {
      if (document.hidden) {
        timer = setTimeout(poll, POLL_MS)
        return
      }
      try {
        const qs = lastEpoch.current ? `?since=${lastEpoch.current}` : ''
        const res = await fetch(`/api/stores/${encodeURIComponent(storeId)}/live${qs}`, { cache: 'no-store' })
        if (!res.ok) throw new Error(String(res.status))
        const data = (await res.json()) as LiveBufferResult
        if (cancelled) return
        if (data.lastEpoch) lastEpoch.current = data.lastEpoch
        if (data.sensors.length) setSensors(data.sensors)
        if (data.points.length) setPoints((prev) => [...prev, ...data.points].slice(-MAX_POINTS))
        setState(data.offline ? 'offline' : 'live')
      } catch {
        if (!cancelled) setState('error')
      }
      if (!cancelled) timer = setTimeout(poll, POLL_MS)
    }

    poll()
    return () => {
      cancelled = true
      clearTimeout(timer)
    }
  }, [storeId])

  // Render: card title "Data Real-time", a Badge with the state
  // ("Live" / "Perangkat offline" / "Gagal memuat"), metric buttons from LIVE_METRICS
  // using METRIC_CONFIG[m].label, then
  // <TelemetryChart data={points} sensors={sensors} metric={metric} rangeType="day" />.
  // Empty state while loading or with no points: "Menunggu data dari perangkat".
  // Follow the card and button patterns already used in store-monitoring-page.tsx.
}
```

Bagian render ditulis saat eksekusi mengikuti pola kartu di `store-monitoring-page.tsx` dan hasil skill `impeccable`. Isinya wajib sesuai komentar di atas: judul, badge status, pilihan metrik, chart, dan empty state.

- [ ] **Step 2: Pasang di detail toko**

Di `components/monitoring/store-monitoring-page.tsx`, tepat setelah `<StoreHero store={store} />` (baris 355):

```tsx
{store.deviceId && store.status !== 'unassigned' && <LiveTelemetryChart storeId={store.id} />}
```

Tambah import `import { LiveTelemetryChart } from './live-telemetry-chart'`.

- [ ] **Step 3: Verifikasi di browser (`next-dev-loop`)**

Buka `/monitoring/<storeId>` untuk toko LIVE:
- Grafik muncul, bertambah tiap sekitar 5 detik, dan jam di sumbu X dalam WIB.
- Garis R/S/T memakai warna yang sama dengan grafik telemetri di bawahnya.
- Ganti metrik (Daya, Tegangan, Arus, Faktor Daya, Frekuensi) dan grafik ikut berganti.
- Pindah ke tab browser lain selama 10 detik. Di tab Network, polling harus berhenti.
- Toko HISTORICAL menampilkan "Perangkat offline". Toko UNASSIGNED tidak menampilkan kartu ini.
- Cek di lebar 375 px: tidak ada scroll horizontal.

Run: `pnpm typecheck` dan `pnpm lint` → Expected: tanpa error

---

### Task 5: Data record sesi dan route-nya

**Files:**
- Modify: `lib/types.ts`
- Create: `lib/db/read-only.ts`, `lib/session-records.ts`, `lib/services/session-service.ts`, `app/api/sessions/[sessionId]/records/route.ts`
- Test: `tests/read-only.test.mjs`, `tests/session-records.test.mjs`

**Interfaces:**
- Consumes: Task 1, `parseSessionId` dan `createSharedFetch` (Task 3), `getTelemetryPool` dari `lib/db/pools.ts`, `getRequestScope` dari `lib/auth/access.ts`, `isDeviceAllowed` dari `lib/auth/access-rules.ts`, `getStores` dari `lib/services/store-service.ts`
- Produces (di `lib/types.ts`):

```ts
export interface SessionRecord {
  timestamp: string // "HH:MM:SS DD/MM/YYYY" WIB, as stored by Flask
  epoch: number
  offline: boolean
  voltage: number
  current: number
  power: number
  frequency: number
  energy: number // cumulative counter, not a delta
  powerFactor: number
}

export interface SessionPhaseRecords {
  phase: string // raw key as stored, e.g. "L12", "CT"
  name: string
  records: SessionRecord[]
}

export interface SessionInfo {
  id: string
  name: string
  deviceId: string
  deviceName: string
  startTime: string
  endTime: string | null
  recordCount: number
}

export interface SessionRecordsResult {
  session: SessionInfo
  phases: SessionPhaseRecords[]
}

export interface RecordingSessionSummary {
  id: string
  name: string
  deviceId: string
  deviceName: string
  storeId: string | null
  storeCode: string | null
  storeName: string | null
  startEpoch: number
  endEpoch: number
  recordCount: number
  phases: string[]
}
```

- Produces (fungsi):
  - `readOnlyQuery<R>(pool: QueryPool, text: string, values: unknown[], timeoutMs?: number): Promise<{ rows: R[] }>`, dengan `QueryPool = { connect(): Promise<QueryClient> }` dan `QueryClient = { query(text: string, values?: unknown[]): Promise<{ rows: unknown[] }>; release(): void }`. `pg.Pool` cocok dengan bentuk ini
  - `SESSION_QUERY_TIMEOUT_MS = 15000`
  - `groupSessionRows(rows: HistoryRow[], names: Record<string, string>): SessionPhaseRecords[]`, dengan `HistoryRow = { phase: string; timestamp: string; epoch: string | number; voltage: unknown; current: unknown; power: unknown; frequency: unknown; energy: unknown; power_factor: unknown; offline: boolean | null }`
  - `energyDeltaKwh(records: SessionRecord[]): number`
  - `summarizeSession(phases: SessionPhaseRecords[]): SessionSummaryStats`, dengan `SessionSummaryStats = { totalRecords: number; onlineRecords: number; offlineRecords: number; avgVoltage: number; avgCurrent: number; avgPower: number; avgFrequency: number; avgPowerFactor: number; energyKwh: number }`
  - `toChartData(phases: SessionPhaseRecords[]): { sensors: SensorMeta[]; points: TelemetryPoint[] }`
  - `getRecordingSessions(): Promise<RecordingSessionSummary[]>`
  - `getSessionRecords(sessionId: string): Promise<SessionRecordsResult | null>`
  - `class SessionTooLargeError extends Error`
  - `GET /api/sessions/[sessionId]/records` → `200 SessionRecordsResult`, `400`, `404`, `413`

- [ ] **Step 0a: Tulis tes query read-only yang gagal**

`tests/read-only.test.mjs`:

```js
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readOnlyQuery, SESSION_QUERY_TIMEOUT_MS } from '../lib/db/read-only.ts'

function fakePool({ failOn } = {}) {
  const log = []
  const client = {
    released: false,
    async query(text, values) {
      log.push(values ? [text, values] : text)
      if (failOn && text.includes(failOn)) throw new Error('boom')
      return { rows: text.startsWith('SELECT') ? [{ id: 1 }] : [] }
    },
    release() { this.released = true },
  }
  return { log, client, pool: { connect: async () => client } }
}

test('runs the query inside a read-only transaction with a statement timeout', async () => {
  const { log, client, pool } = fakePool()
  const res = await readOnlyQuery(pool, 'SELECT 1 WHERE a = $1', ['x'])
  assert.deepEqual(res.rows, [{ id: 1 }])
  assert.deepEqual(log, [
    'BEGIN READ ONLY',
    `SET LOCAL statement_timeout = ${SESSION_QUERY_TIMEOUT_MS}`,
    ['SELECT 1 WHERE a = $1', ['x']],
    'COMMIT',
  ])
  assert.equal(client.released, true)
})

test('rolls back and releases the client when the query fails', async () => {
  const { log, client, pool } = fakePool({ failOn: 'SELECT' })
  await assert.rejects(readOnlyQuery(pool, 'SELECT 1', []), /boom/)
  assert.equal(log.at(-1), 'ROLLBACK')
  assert.equal(client.released, true)
})

test('rejects a timeout that is not a positive whole number', async () => {
  const { pool } = fakePool()
  await assert.rejects(readOnlyQuery(pool, 'SELECT 1', [], 0), /timeout/)
  await assert.rejects(readOnlyQuery(pool, 'SELECT 1', [], 1.5), /timeout/)
})
```

Run: `node --test tests/read-only.test.mjs`
Expected: FAIL, module not found

- [ ] **Step 0b: Implementasi**

`lib/db/read-only.ts`:

```ts
// Runs one SELECT so it cannot write and cannot hold the database for long.
// Postgres rejects any write inside READ ONLY, and statement_timeout ends a slow query.
// No imports, so `node --test` can load this file directly.

export const SESSION_QUERY_TIMEOUT_MS = 15_000

export interface QueryClient {
  query(text: string, values?: unknown[]): Promise<{ rows: unknown[] }>
  release(): void
}

export interface QueryPool {
  connect(): Promise<QueryClient>
}

export async function readOnlyQuery<R>(
  pool: QueryPool,
  text: string,
  values: unknown[],
  timeoutMs = SESSION_QUERY_TIMEOUT_MS
): Promise<{ rows: R[] }> {
  if (!Number.isInteger(timeoutMs) || timeoutMs <= 0) {
    throw new Error('timeout harus bilangan bulat positif.')
  }
  const client = await pool.connect()
  try {
    await client.query('BEGIN READ ONLY')
    // timeoutMs is a checked integer constant, never request input.
    await client.query(`SET LOCAL statement_timeout = ${timeoutMs}`)
    const res = await client.query(text, values)
    await client.query('COMMIT')
    return { rows: res.rows as R[] }
  } catch (error) {
    await client.query('ROLLBACK').catch(() => {})
    throw error
  } finally {
    client.release()
  }
}
```

`SET LOCAL` hanya berlaku di dalam transaksi ini, jadi koneksi yang dikembalikan ke pool tidak membawa timeout ke query lain. Kalau `pg.Pool` tidak cocok dengan `QueryPool` saat `pnpm typecheck`, sesuaikan tipe `QueryClient.query` sampai cocok, tanpa `any`.

Run: `node --test tests/read-only.test.mjs` → Expected: 3 tes PASS

- [ ] **Step 1: Tulis tes yang gagal**

`tests/session-records.test.mjs`:

```js
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { groupSessionRows, energyDeltaKwh, summarizeSession, toChartData } from '../lib/session-records.ts'

const T0 = Date.UTC(2026, 10, 9, 3, 0, 0)
const MIN = 60_000
const row = (phase, i, power, energy, offline = false) => ({
  phase,
  timestamp: `10:0${i}:00 09/11/2026`,
  epoch: String(T0 + i * MIN),
  voltage: 220,
  current: power / 220,
  power,
  frequency: 50,
  energy,
  power_factor: 0.9,
  offline,
})
const rec = (i, power, energy, offline = false) => ({
  timestamp: '', epoch: T0 + i * MIN, offline, voltage: 220, current: 0, power, frequency: 50, energy, powerFactor: 0.9,
})

test('groupSessionRows groups by phase, keeps raw keys and drops L6', () => {
  const g = groupSessionRows(
    [row('L13', 0, 100, 1), row('L12', 0, 100, 1), row('L12', 1, 100, 1.01), row('L6', 0, 1, 0)],
    { L12: 'Panel Utama R' }
  )
  assert.deepEqual(g.map((p) => p.phase), ['L12', 'L13'])
  assert.equal(g[0].name, 'Panel Utama R')
  assert.equal(g[1].name, 'Fase S')
  assert.equal(g[0].records.length, 2)
  assert.equal(g[0].records[1].epoch, T0 + MIN)
  assert.equal(typeof g[0].records[0].voltage, 'number')
})

test('energyDeltaKwh sums counter deltas', () => {
  assert.equal(energyDeltaKwh([rec(0, 600, 10), rec(1, 600, 10.01), rec(2, 600, 10.02)]).toFixed(2), '0.02')
})

test('energyDeltaKwh replaces a counter reset with average power x interval', () => {
  // 600 W for 1 minute = 0.01 kWh
  const kwh = energyDeltaKwh([rec(0, 600, 10), rec(1, 600, 0.001)])
  assert.equal(kwh.toFixed(4), '0.0100')
})

test('energyDeltaKwh replaces an impossible jump with average power x interval', () => {
  const kwh = energyDeltaKwh([rec(0, 600, 10), rec(1, 600, 500)])
  assert.equal(kwh.toFixed(4), '0.0100')
})

test('energyDeltaKwh skips steps that touch an offline record', () => {
  assert.equal(energyDeltaKwh([rec(0, 600, 10), rec(1, 0, 0, true), rec(2, 600, 10.01)]), 0)
})

test('summarizeSession averages online records only', () => {
  const s = summarizeSession([{ phase: 'R', name: 'Fase R', records: [rec(0, 600, 10), rec(1, 0, 0, true), rec(2, 300, 10.01)] }])
  assert.equal(s.totalRecords, 3)
  assert.equal(s.onlineRecords, 2)
  assert.equal(s.offlineRecords, 1)
  assert.equal(s.avgPower, 450)
})

test('toChartData merges phases by epoch with normalized keys', () => {
  const { sensors, points } = toChartData([
    { phase: 'L12', name: 'Fase R', records: [rec(0, 100, 1), rec(1, 110, 1)] },
    { phase: 'L13', name: 'Fase S', records: [rec(0, 200, 1)] },
  ])
  assert.deepEqual(sensors.map((s) => s.phase), ['R', 'S'])
  assert.equal(points.length, 2)
  assert.equal(points[0].R_power, 100)
  assert.equal(points[0].S_power, 200)
  assert.equal(points[0].totalPower, 300)
  assert.equal(points[1].S_power, undefined)
})
```

- [ ] **Step 2: Jalankan, pastikan gagal**

Run: `node --test tests/session-records.test.mjs`
Expected: FAIL, module not found

- [ ] **Step 3: Tambah tipe di `lib/types.ts`**

Salin blok tipe dari bagian **Interfaces** di atas ke akhir `lib/types.ts`, ditambah:

```ts
export interface SessionSummaryStats {
  totalRecords: number
  onlineRecords: number
  offlineRecords: number
  avgVoltage: number
  avgCurrent: number
  avgPower: number
  avgFrequency: number
  avgPowerFactor: number
  energyKwh: number
}
```

- [ ] **Step 4: Implementasi modul murni**

`lib/session-records.ts`:

```ts
// Grouping, energy and chart shaping for recording session records (history table).
// No `@/` imports, so `node --test` can load this file directly.
import type {
  SensorMeta,
  SessionPhaseRecords,
  SessionRecord,
  SessionSummaryStats,
  TelemetryPoint,
} from './types.ts'
import { comparePhase, defaultPhaseName, isExcludedPhase, normalizePhaseKey, sensorColor } from './phase-keys.ts'
import { formatJakartaTime } from './live-buffer.ts'

// A type alias, not an interface: pg's query<T> needs an implicit index signature.
export type HistoryRow = {
  phase: string
  timestamp: string
  epoch: string | number
  voltage: unknown
  current: unknown
  power: unknown
  frequency: unknown
  energy: unknown
  power_factor: unknown
  offline: boolean | null
}

const num = (v: unknown): number => {
  const n = typeof v === 'number' ? v : Number(v)
  return Number.isFinite(n) ? n : 0
}

export function groupSessionRows(rows: HistoryRow[], names: Record<string, string>): SessionPhaseRecords[] {
  const byPhase = new Map<string, SessionRecord[]>()
  for (const r of rows) {
    if (isExcludedPhase(r.phase)) continue
    const list = byPhase.get(r.phase) ?? []
    list.push({
      timestamp: r.timestamp,
      epoch: num(r.epoch),
      offline: Boolean(r.offline),
      voltage: num(r.voltage),
      current: num(r.current),
      power: num(r.power),
      frequency: num(r.frequency),
      energy: num(r.energy),
      powerFactor: num(r.power_factor),
    })
    byPhase.set(r.phase, list)
  }
  return [...byPhase.entries()]
    .map(([phase, records]) => ({
      phase,
      name: names[phase] || defaultPhaseName(normalizePhaseKey(phase)),
      records: records.sort((a, b) => a.epoch - b.epoch),
    }))
    .sort((a, b) => comparePhase(normalizePhaseKey(a.phase), normalizePhaseKey(b.phase)))
}

// A delta is trusted when it fits what the higher of the two power readings allows
// for the interval, with 50% headroom plus 0.01 kWh for counter rounding.
export function energyDeltaKwh(records: SessionRecord[]): number {
  let total = 0
  for (let i = 1; i < records.length; i++) {
    const a = records[i - 1]
    const b = records[i]
    if (a.offline || b.offline) continue
    const hours = (b.epoch - a.epoch) / 3_600_000
    if (hours <= 0) continue
    const delta = b.energy - a.energy
    const maxKwh = (Math.max(a.power, b.power) / 1000) * hours * 1.5 + 0.01
    total += delta >= 0 && delta <= maxKwh ? delta : ((a.power + b.power) / 2 / 1000) * hours
  }
  return total
}

export function summarizeSession(phases: SessionPhaseRecords[]): SessionSummaryStats {
  const all = phases.flatMap((p) => p.records)
  const online = all.filter((r) => !r.offline)
  const avg = (pick: (r: SessionRecord) => number) =>
    online.length ? online.reduce((s, r) => s + pick(r), 0) / online.length : 0
  return {
    totalRecords: all.length,
    onlineRecords: online.length,
    offlineRecords: all.length - online.length,
    avgVoltage: avg((r) => r.voltage),
    avgCurrent: avg((r) => r.current),
    avgPower: avg((r) => r.power),
    avgFrequency: avg((r) => r.frequency),
    avgPowerFactor: avg((r) => r.powerFactor),
    energyKwh: phases.reduce((s, p) => s + energyDeltaKwh(p.records), 0),
  }
}

export function toChartData(phases: SessionPhaseRecords[]): { sensors: SensorMeta[]; points: TelemetryPoint[] } {
  const byEpoch = new Map<number, TelemetryPoint>()
  const sensors: SensorMeta[] = []
  phases.forEach((p, index) => {
    const phase = normalizePhaseKey(p.phase)
    if (!sensors.some((s) => s.phase === phase)) {
      sensors.push({ phase, name: p.name, color: sensorColor(phase, p.name, index) })
    }
    for (const r of p.records) {
      if (r.offline) continue
      const point = byEpoch.get(r.epoch) ?? { timestamp: formatJakartaTime(r.epoch), epoch: r.epoch, totalPower: 0 }
      point[`${phase}_power`] = r.power
      point[`${phase}_voltage`] = r.voltage
      point[`${phase}_current`] = r.current
      point[`${phase}_powerFactor`] = r.powerFactor
      point[`${phase}_frequency`] = r.frequency
      point[`${phase}_energy`] = r.energy
      point.totalPower = (point.totalPower ?? 0) + r.power
      byEpoch.set(r.epoch, point)
    }
  })
  const points = [...byEpoch.values()].sort((a, b) => Number(a.epoch) - Number(b.epoch))
  return { sensors, points }
}
```

Untuk sesi yang lebih dari sehari, `timestamp` jam saja akan berulang. Kalau saat verifikasi sumbu X membingungkan, tambahkan `fullTime` berformat `DD/MM HH:MM` (pola sama dengan `TelemetryPoint.fullTime`) dan pakai itu di tooltip.

- [ ] **Step 5: Jalankan tes, pastikan lolos**

Run: `node --test tests/session-records.test.mjs` → Expected: 7 tes PASS

- [ ] **Step 6: Service sesi**

`lib/services/session-service.ts`:

```ts
import 'server-only'
import type { RecordingSessionSummary, SessionRecordsResult } from '@/lib/types'
import type { AccessScope } from '@/lib/auth/access-rules'
import { getTelemetryPool } from '@/lib/db/pools'
import { readOnlyQuery } from '@/lib/db/read-only'
import { getRequestScope } from '@/lib/auth/access'
import { isDeviceAllowed } from '@/lib/auth/access-rules'
import { createSharedFetch } from '@/lib/shared-fetch'
import { getStores } from '@/lib/services/store-service'
import { groupSessionRows, type HistoryRow } from '@/lib/session-records'

// Above this many rows the JSON response gets too large for the browser to export.
export const MAX_SESSION_RECORDS = 200_000

export class SessionTooLargeError extends Error {}

type SessionListRow = {
  device_id: string
  session_id: string
  session_name: string | null
  device_name: string | null
  start_epoch: string
  end_epoch: string
  total_rows: string
  phases: string[] | null
}

// Same scope, same key, whatever the order of the device ids.
function scopeKey(scope: AccessScope): string {
  return JSON.stringify(
    scope.kind === 'devices' ? { kind: 'devices', deviceIds: [...scope.deviceIds].sort() } : { kind: scope.kind }
  )
}

// Queries run one after another on a single connection at a time, inside READ ONLY
// transactions with a 15 s statement timeout, so Flask's INSERTs never wait on the portal.
async function loadRecordingSessions(scope: AccessScope): Promise<RecordingSessionSummary[]> {
  const filter = scope.kind === 'devices' ? 'WHERE device_id = ANY($1::text[])' : ''
  const params = scope.kind === 'devices' ? [scope.deviceIds] : []
  const pool = getTelemetryPool()

  const res = await readOnlyQuery<SessionListRow>(
    pool,
    `
    SELECT device_id, session_id, MAX(session_name) AS session_name, MAX(device_name) AS device_name,
           MIN(epoch) AS start_epoch, MAX(epoch) AS end_epoch, COUNT(*) AS total_rows,
           ARRAY_AGG(DISTINCT phase) AS phases
    FROM history
    ${filter}
    GROUP BY device_id, session_id
    ORDER BY MAX(epoch) DESC
    LIMIT 500
  `,
    params
  )
  const devRes = await readOnlyQuery<{ id: string; name: string | null }>(pool, `SELECT id, name FROM devices`, [])
  const stores = await getStores()

  const deviceNames = new Map<string, string>(
    devRes.rows.filter((d) => d.name).map((d) => [d.id, d.name as string])
  )
  const storeByDevice = new Map(stores.filter((s) => s.deviceId).map((s) => [s.deviceId as string, s]))

  return res.rows.map((r) => {
    const store = storeByDevice.get(r.device_id)
    return {
      id: r.session_id,
      name: r.session_name || 'Tanpa nama',
      deviceId: r.device_id,
      deviceName: r.device_name || deviceNames.get(r.device_id) || r.device_id,
      storeId: store?.id ?? null,
      storeCode: store?.code ?? null,
      storeName: store?.name ?? null,
      startEpoch: Number(r.start_epoch),
      endEpoch: Number(r.end_epoch),
      recordCount: Number(r.total_rows) || 0,
      phases: r.phases ?? [],
    }
  })
}

// The full-table GROUP BY runs at most once per 30 s per access scope.
// The key carries the scope, so a GS user never gets another scope's list.
const sharedSessions = createSharedFetch(
  (key) => loadRecordingSessions(JSON.parse(key) as AccessScope),
  { ttlMs: 30_000, failureBackoffMs: 30_000 }
)
export async function getRecordingSessions(): Promise<RecordingSessionSummary[]> {
  const scope = await getRequestScope()
  if (scope.kind === 'none') return []
  return sharedSessions(scopeKey(scope))
}

type SessionMetaRow = {
  device_id: string
  session_name: string | null
  device_name: string | null
  start_time: string | null
  end_time: string | null
  total_rows: string
}

export async function getSessionRecords(sessionId: string): Promise<SessionRecordsResult | null> {
  const scope = await getRequestScope()
  if (scope.kind === 'none') return null
  const pool = getTelemetryPool()

  const metaRes = await readOnlyQuery<SessionMetaRow>(
    pool,
    `
    SELECT device_id, MAX(session_name) AS session_name, MAX(device_name) AS device_name,
           to_char(to_timestamp(MIN(epoch) / 1000.0) AT TIME ZONE 'Asia/Jakarta', 'HH24:MI:SS DD/MM/YYYY') AS start_time,
           to_char(to_timestamp(MAX(epoch) / 1000.0) AT TIME ZONE 'Asia/Jakarta', 'HH24:MI:SS DD/MM/YYYY') AS end_time,
           COUNT(*) AS total_rows
    FROM history
    WHERE session_id = $1
    GROUP BY device_id
  `,
    [sessionId]
  )
  const meta = metaRes.rows.find((r) => isDeviceAllowed(scope, r.device_id))
  if (!meta) return null

  const total = Number(meta.total_rows) || 0
  if (total > MAX_SESSION_RECORDS) throw new SessionTooLargeError(String(total))

  // One after another, so an export uses a single connection at a time.
  const nameRes = await readOnlyQuery<{ phase: string; phase_name: string | null }>(
    pool,
    `SELECT phase, MAX(phase_name) AS phase_name FROM history WHERE session_id = $1 AND device_id = $2 GROUP BY phase`,
    [sessionId, meta.device_id]
  )
  const rowRes = await readOnlyQuery<HistoryRow>(
    pool,
    `
    SELECT phase, timestamp, epoch, voltage, current, power, frequency, energy, power_factor, offline
    FROM history
    WHERE session_id = $1 AND device_id = $2
    ORDER BY phase, epoch
  `,
    [sessionId, meta.device_id]
  )

  const names: Record<string, string> = {}
  for (const n of nameRes.rows) if (n.phase_name) names[n.phase] = n.phase_name

  return {
    session: {
      id: sessionId,
      name: meta.session_name || 'Tanpa nama',
      deviceId: meta.device_id,
      deviceName: meta.device_name || meta.device_id,
      startTime: meta.start_time || '---',
      endTime: meta.end_time || null,
      recordCount: total,
    },
    phases: groupSessionRows(rowRes.rows, names),
  }
}
```

Waktu mulai dan selesai dibentuk dari `epoch`, bukan `MIN(timestamp)`, karena kolom `timestamp` berupa teks `HH:MM:SS DD/MM/YYYY` yang kalau dibandingkan sebagai teks urutannya salah. Ini sama dengan query daftar sesi di Flask.

- [ ] **Step 7: Route record**

`app/api/sessions/[sessionId]/records/route.ts`:

```ts
import { NextRequest, NextResponse } from 'next/server'
import { requireApiAccess } from '@/lib/auth/api-guard'
import { parseSessionId } from '@/lib/request-params'
import { getSessionRecords, SessionTooLargeError } from '@/lib/services/session-service'

export const dynamic = 'force-dynamic'

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  const denied = await requireApiAccess()
  if (denied) return denied

  const parsed = parseSessionId((await params).sessionId)
  if (!parsed.ok) return NextResponse.json({ error: parsed.error }, { status: 400 })

  try {
    const result = await getSessionRecords(parsed.value)
    if (!result) return NextResponse.json({ error: 'Sesi tidak ditemukan.' }, { status: 404 })
    return NextResponse.json(result)
  } catch (error) {
    if (error instanceof SessionTooLargeError) {
      return NextResponse.json({ error: 'Sesi terlalu besar untuk diunduh sekaligus.' }, { status: 413 })
    }
    console.error('API /api/sessions/[sessionId]/records error:', error)
    return NextResponse.json({ error: 'Gagal mengambil data sesi.' }, { status: 500 })
  }
}
```

- [ ] **Step 8: Verifikasi**

Run: `pnpm typecheck` dan `pnpm lint` → Expected: tanpa error.
Di dev server dengan `dev_role=ADMIN`, ambil satu `session_id` dari pemilih sesi di detail toko, lalu buka `/api/sessions/<id>/records`. Expected: `session.recordCount` sama dengan jumlah semua `records`, fase L6 tidak ada. Dengan `dev_role=GS` dan `DEV_GS_DEVICE_IDS` tanpa perangkat sesi itu, jawabannya harus 404. `/api/sessions/x'%20OR%201=1/records` harus 400.

---

### Task 6: Export Excel dan backup JSON

> **DITUNDA (2026-11-09, permintaan user).** Jangan dikerjakan sampai user meminta. Dependensi `xlsx` tidak dipasang. Route `GET /api/sessions/[sessionId]/records` dari Task 5 tetap ada dan dipakai saat task ini dilanjutkan.

**Files:**
- Modify: `package.json` (dependensi `xlsx`)
- Create: `lib/session-files.ts` (fungsi build saja; parser ditambah di Task 8), `components/sessions/session-export-menu.tsx`
- Modify: `components/monitoring/store-monitoring-page.tsx` (dekat `<SessionSelector`, baris sekitar 446)
- Test: `tests/session-files.test.mjs`

**Interfaces:**
- Consumes: `SessionRecordsResult`, `summarizeSession` (Task 5), `GET /api/sessions/[sessionId]/records`
- Produces:
  - `BACKUP_SCHEMA = 'smart-energy-meter-backup'`, `BACKUP_VERSION = '1.0'`
  - `buildBackupPayload(result: SessionRecordsResult, exportedAt: Date): SessionBackupFile`
  - `buildWorkbookSheets(result: SessionRecordsResult, exportedAt: Date): WorkbookSheet[]`, dengan `WorkbookSheet = { name: string; rows?: Record<string, string | number>[]; aoa?: (string | number)[][] }`
  - `safeFileName(name: string): string`
  - `SessionExportMenu({ sessionId, sessionName }: { sessionId: string; sessionName: string })`

- [ ] **Step 1: Pasang SheetJS**

Run: `pnpm add https://cdn.sheetjs.com/xlsx-0.20.3/xlsx-0.20.3.tgz`

Alasannya: paket `xlsx` di registry npm berhenti di 0.18.5 yang punya celah keamanan yang sudah diketahui (prototype pollution dan ReDoS saat membaca file). File unggahan di Task 8 adalah input dari luar, jadi versi baru dari CDN resmi SheetJS ini diperlukan. Flask memakai SheetJS juga, sehingga format file tetap sama.

- [ ] **Step 2: Tulis tes yang gagal**

`tests/session-files.test.mjs`:

```js
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { buildBackupPayload, buildWorkbookSheets, safeFileName, BACKUP_SCHEMA } from '../lib/session-files.ts'

const T0 = Date.UTC(2026, 10, 9, 3, 0, 0)
const rec = (i, power, energy, offline = false) => ({
  timestamp: `10:0${i}:00 09/11/2026`, epoch: T0 + i * 60_000, offline,
  voltage: 220.123, current: 2.345, power, frequency: 50.04, energy, powerFactor: 0.91234,
})
export const SAMPLE = {
  session: {
    id: 'sess_1', name: 'Audit Toko A/B', deviceId: 'EM-0001', deviceName: 'Meter Toko A',
    startTime: '10:00:00 09/11/2026', endTime: '10:02:00 09/11/2026', recordCount: 4,
  },
  phases: [
    { phase: 'L12', name: 'Fase R', records: [rec(0, 600, 10), rec(1, 600, 10.01)] },
    { phase: 'CT', name: 'Freezer', records: [rec(0, 100, 1), rec(1, 0, 0, true)] },
  ],
}
const EXPORTED = new Date(T0)

test('buildBackupPayload matches the Flask backup schema', () => {
  const b = buildBackupPayload(SAMPLE, EXPORTED)
  assert.equal(b.schema, BACKUP_SCHEMA)
  assert.equal(b.version, '1.0')
  assert.equal(b.exportedAt, EXPORTED.toISOString())
  assert.deepEqual(b.session.phaseNames, { L12: 'Fase R', CT: 'Freezer' })
  assert.equal(b.session.recordCount, 4)
  assert.deepEqual(Object.keys(b.records), ['L12', 'CT'])
  assert.deepEqual(b.records.L12[1], {
    timestamp: '10:01:00 09/11/2026', epoch: T0 + 60_000, offline: false,
    Voltage: 220.123, Current: 2.345, Power: 600, Frequency: 50.04, Energy: 10.01, PowerFactor: 0.91234,
  })
})

test('buildWorkbookSheets writes one sheet per phase plus Summary', () => {
  const sheets = buildWorkbookSheets(SAMPLE, EXPORTED)
  assert.deepEqual(sheets.map((s) => s.name), ['Fase R', 'Freezer', 'Summary'])
  assert.deepEqual(sheets[0].rows[0], {
    'Device Name': 'Meter Toko A', Timestamp: '10:00:00 09/11/2026', Status: 'online',
    'Voltage (V)': 220.12, 'Current (A)': 2.35, 'Power (W)': 600, 'Frequency (Hz)': 50,
    'Active Energy (kWh)': 10, 'Power Factor': 0.9123,
  })
  assert.equal(sheets[1].rows[1].Status, 'OFFLINE')
  const summary = sheets[2].aoa
  assert.deepEqual(summary[2], ['Nama Sesi', 'Audit Toko A/B'])
  assert.ok(summary.some((r) => r[0] === 'Total Energi Aktif (delta)' && r[1] === '0,01'))
})

test('buildWorkbookSheets keeps sheet names unique and within 31 characters', () => {
  const long = 'Sensor dengan nama yang sangat panjang sekali'
  const s = buildWorkbookSheets(
    { ...SAMPLE, phases: [{ ...SAMPLE.phases[0], name: long }, { ...SAMPLE.phases[1], name: long }] },
    EXPORTED
  )
  assert.equal(s[0].name.length <= 31, true)
  assert.notEqual(s[0].name, s[1].name)
  assert.equal(/[\\/?*[\]:]/.test(s[0].name), false)
})

test('safeFileName removes characters Windows rejects', () => {
  assert.equal(safeFileName('Audit Toko A/B: "Nov"'), 'Audit Toko A_B_ _Nov_')
})
```

- [ ] **Step 3: Jalankan, pastikan gagal**

Run: `node --test tests/session-files.test.mjs`
Expected: FAIL, module not found

- [ ] **Step 4: Implementasi fungsi build**

`lib/session-files.ts`:

```ts
// Builds and reads session files in the same format as the Flask dashboard,
// so files from either app open in both. No `@/` imports, so `node --test` can load it.
import type { SessionRecordsResult } from './types.ts'
import { summarizeSession } from './session-records.ts'

export const BACKUP_SCHEMA = 'smart-energy-meter-backup'
export const BACKUP_VERSION = '1.0'
export const SUMMARY_SHEET = 'Summary'

export interface BackupRecord {
  timestamp: string
  epoch: number
  offline: boolean
  Voltage: number
  Current: number
  Power: number
  Frequency: number
  Energy: number
  PowerFactor: number
}

export interface SessionBackupFile {
  schema: typeof BACKUP_SCHEMA
  version: string
  exportedAt: string
  session: {
    id: string
    name: string
    deviceId: string
    deviceName: string
    startTime: string
    endTime: string
    recordCount: number
    phaseNames: Record<string, string>
  }
  records: Record<string, BackupRecord[]>
}

export interface WorkbookSheet {
  name: string
  rows?: Record<string, string | number>[]
  aoa?: (string | number)[][]
}

const round = (v: number, digits: number) => Number(v.toFixed(digits))
const idNumber = (v: number, digits: number) =>
  v.toLocaleString('id-ID', { minimumFractionDigits: digits, maximumFractionDigits: digits })

export function safeFileName(name: string): string {
  return name.replace(/[\\/:*?"<>|]/g, '_')
}

function sheetName(name: string, used: Set<string>): string {
  const base = name.replace(/[\\/?*[\]:]/g, '_').slice(0, 31) || 'Sensor'
  let candidate = base
  for (let i = 2; used.has(candidate); i++) {
    const suffix = ` (${i})`
    candidate = base.slice(0, 31 - suffix.length) + suffix
  }
  used.add(candidate)
  return candidate
}

export function buildBackupPayload(result: SessionRecordsResult, exportedAt: Date): SessionBackupFile {
  const records: Record<string, BackupRecord[]> = {}
  const phaseNames: Record<string, string> = {}
  for (const p of result.phases) {
    phaseNames[p.phase] = p.name
    records[p.phase] = p.records.map((r) => ({
      timestamp: r.timestamp,
      epoch: r.epoch,
      offline: r.offline,
      Voltage: r.voltage,
      Current: r.current,
      Power: r.power,
      Frequency: r.frequency,
      Energy: r.energy,
      PowerFactor: r.powerFactor,
    }))
  }
  return {
    schema: BACKUP_SCHEMA,
    version: BACKUP_VERSION,
    exportedAt: exportedAt.toISOString(),
    session: {
      id: result.session.id,
      name: result.session.name,
      deviceId: result.session.deviceId,
      deviceName: result.session.deviceName,
      startTime: result.session.startTime,
      endTime: result.session.endTime ?? '---',
      recordCount: result.session.recordCount,
      phaseNames,
    },
    records,
  }
}

export function buildWorkbookSheets(result: SessionRecordsResult, exportedAt: Date): WorkbookSheet[] {
  const used = new Set<string>([SUMMARY_SHEET])
  const { deviceName } = result.session
  const sheets: WorkbookSheet[] = result.phases.map((p) => ({
    name: sheetName(p.name, used),
    rows: p.records.map((r) => ({
      'Device Name': deviceName,
      Timestamp: r.timestamp,
      Status: r.offline ? 'OFFLINE' : 'online',
      'Voltage (V)': round(r.voltage, 2),
      'Current (A)': round(r.current, 2),
      'Power (W)': round(r.power, 2),
      'Frequency (Hz)': round(r.frequency, 1),
      'Active Energy (kWh)': round(r.energy, 4),
      'Power Factor': round(r.powerFactor, 4),
    })),
  }))

  const s = summarizeSession(result.phases)
  sheets.push({
    name: SUMMARY_SHEET,
    aoa: [
      ['Smart Energy Monitoring - Export Sesi'],
      [''],
      ['Nama Sesi', result.session.name],
      ['Tanggal Export', exportedAt.toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' })],
      ['Perangkat', deviceName],
      ['Sensor', result.phases.map((p) => p.name).join(', ')],
      ['Waktu Mulai', result.session.startTime],
      ['Waktu Selesai', result.session.endTime ?? '---'],
      ['Total Record', s.totalRecords],
      ['Record Online', s.onlineRecords],
      ['Record Offline', s.offlineRecords],
      [''],
      ['Parameter', 'Rata-rata', 'Satuan'],
      ['Tegangan', idNumber(s.avgVoltage, 2), 'V'],
      ['Arus', idNumber(s.avgCurrent, 2), 'A'],
      ['Daya', idNumber(s.avgPower, 2), 'W'],
      ['Frekuensi', idNumber(s.avgFrequency, 1), 'Hz'],
      ['Faktor Daya', idNumber(s.avgPowerFactor, 4), ''],
      ['Total Energi Aktif (delta)', idNumber(s.energyKwh, 2), 'kWh'],
    ],
  })
  return sheets
}
```

Bedanya dengan Flask: Flask menjumlahkan nilai counter `Energy` mentah sebagai "Total Active Energy", jadi angkanya salah. Portal memakai delta sesuai aturan domain.

- [ ] **Step 5: Jalankan tes, pastikan lolos**

Run: `node --test tests/session-files.test.mjs` → Expected: 4 tes PASS

- [ ] **Step 6: Menu export**

Sebelum mulai, muat skill UI (lihat Global Constraints).

`components/sessions/session-export-menu.tsx`:

```tsx
'use client'

import { useState } from 'react'
import type { SessionRecordsResult } from '@/lib/types'
import { buildBackupPayload, buildWorkbookSheets, safeFileName } from '@/lib/session-files'

type ExportKind = 'excel' | 'json'

async function loadRecords(sessionId: string): Promise<SessionRecordsResult> {
  const res = await fetch(`/api/sessions/${encodeURIComponent(sessionId)}/records`, { cache: 'no-store' })
  if (res.status === 413) throw new Error('Sesi ini terlalu besar untuk diunduh sekaligus.')
  if (!res.ok) throw new Error('Data sesi tidak bisa diambil.')
  return res.json()
}

function downloadBlob(blob: Blob, fileName: string) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = fileName
  a.click()
  URL.revokeObjectURL(url)
}

export async function exportSession(sessionId: string, sessionName: string, kind: ExportKind) {
  const result = await loadRecords(sessionId)
  if (result.session.recordCount === 0) throw new Error('Sesi ini belum punya record.')
  const now = new Date()
  const base = safeFileName(sessionName)

  if (kind === 'json') {
    const payload = buildBackupPayload(result, now)
    downloadBlob(new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' }), `${base}.json`)
    return
  }

  const XLSX = await import('xlsx')
  const wb = XLSX.utils.book_new()
  for (const sheet of buildWorkbookSheets(result, now)) {
    const ws = sheet.rows ? XLSX.utils.json_to_sheet(sheet.rows) : XLSX.utils.aoa_to_sheet(sheet.aoa ?? [])
    XLSX.utils.book_append_sheet(wb, ws, sheet.name)
  }
  XLSX.writeFile(wb, `${base}.xlsx`)
}

export function SessionExportMenu({ sessionId, sessionName }: { sessionId: string; sessionName: string }) {
  const [busy, setBusy] = useState<ExportKind | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function run(kind: ExportKind) {
    setBusy(kind)
    setError(null)
    try {
      await exportSession(sessionId, sessionName, kind)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Export gagal.')
    } finally {
      setBusy(null)
    }
  }

  // Render: a DropdownMenu (components/ui/dropdown-menu.tsx) with a trigger Button
  // labelled "Unduh", and items "Excel (.xlsx)" -> run('excel') and
  // "Backup JSON" -> run('json'). While busy, the trigger shows "Menyiapkan file..."
  // and is disabled. Show `error` below the trigger with role="alert".
}
```

- [ ] **Step 7: Pasang di detail toko**

Di `components/monitoring/store-monitoring-page.tsx`, di samping `<SessionSelector ... />` (sekitar baris 446), tampilkan menu untuk sesi aktif:

```tsx
{activeSession && <SessionExportMenu sessionId={activeSession.id} sessionName={activeSession.label} />}
```

Tambah import `import { SessionExportMenu } from '@/components/sessions/session-export-menu'`.

- [ ] **Step 8: Verifikasi di browser**

Di `/monitoring/<storeId>`, mode Sesi:
- Klik Unduh lalu Excel. File `.xlsx` terunduh, sheet per sensor ditambah `Summary`, kolomnya sama dengan export Flask.
- Klik Unduh lalu Backup JSON. File `.json` terunduh dengan `schema: "smart-energy-meter-backup"`.
- Buka file JSON tadi di tab Tools dashboard Flask **yang berjalan di VPS** (alamat dari `NEXT_PUBLIC_REALTIME_METER_URL`). Jangan menyalakan Flask di lokal. Tab Tools hanya membaca file di browser, jadi tidak mengubah rekaman. Flask harus bisa menampilkannya, karena ini bukti formatnya sama.
- Di tab Network, chunk `xlsx` baru diunduh saat export Excel pertama, bukan saat halaman dibuka.

Run: `pnpm typecheck` dan `pnpm lint` → Expected: tanpa error

---

### Task 7: Halaman Sesi Rekaman

**Files:**
- Create: `app/(dashboard)/sesi-rekaman/page.tsx`, `components/sessions/session-table.tsx`
- Modify: `components/layout/app-sidebar.tsx:52-66`, `components/layout/breadcrumb-nav.tsx:14-16`

**Interfaces:**
- Consumes: `getRecordingSessions()` (Task 5), `RecordingSessionSummary`. (Kolom unduh dari Task 6 ditunda; jangan import `SessionExportMenu`.)
- Produces: rute `/sesi-rekaman`, `SessionTable({ sessions }: { sessions: RecordingSessionSummary[] })`

Sebelum mulai, muat skill UI. Lihat juga `components/dashboard/store-table.tsx` sebagai pola tabel.

- [ ] **Step 1: Halaman server**

`app/(dashboard)/sesi-rekaman/page.tsx`:

```tsx
import type { Metadata } from 'next'
import { getRecordingSessions } from '@/lib/services/session-service'
import { SessionTable } from '@/components/sessions/session-table'

export const dynamic = 'force-dynamic'
export const metadata: Metadata = { title: 'Sesi Rekaman' }

export default async function SessionsPage() {
  const sessions = await getRecordingSessions()
  return <SessionTable sessions={sessions} />
}
```

Judul dan deskripsi halaman mengikuti pola header di `app/(dashboard)/monitoring/page.tsx`.

- [ ] **Step 2: Tabel**

`components/sessions/session-table.tsx` (`'use client'`), dibangun dari `components/ui/table.tsx` dan `components/ui/input.tsx`:

- Kolom: Nama sesi, Toko (kode dan nama, link ke `/monitoring/<storeId>`; kalau `storeId` null tampilkan "Belum terhubung ke toko"), Perangkat, Mulai, Selesai, Jumlah record (`toLocaleString('id-ID')`), Sensor (fase dinormalisasi lewat `normalizePhaseKey`, tanpa `isExcludedPhase`, tanpa duplikat). Belum ada kolom aksi/unduh, karena Task 6 ditunda.
- `getRecordingSessions()` bisa melempar `BackoffError` selama 30 detik setelah query gagal. Halaman menangkapnya dan menampilkan pesan "Daftar sesi belum bisa dimuat. Coba lagi sebentar lagi." alih-alih error 500.
- Mulai dan selesai diformat dari `startEpoch`/`endEpoch` dengan `toLocaleString('id-ID', { timeZone: 'Asia/Jakarta', dateStyle: 'medium', timeStyle: 'short' })`.
- Kotak cari (`Input`) yang memfilter nama sesi, kode toko, nama toko, dan nama perangkat, tanpa membedakan huruf besar/kecil.
- Empty state: "Belum ada sesi rekaman" kalau `sessions` kosong, atau "Tidak ada sesi yang cocok" kalau hasil pencarian kosong.
- Di layar sempit, tabel di-scroll di dalam wadahnya sendiri, bukan seluruh halaman.

- [ ] **Step 3: Menu dan breadcrumb**

Di `components/layout/app-sidebar.tsx`, tambahkan item ketiga di grup pertama `navGroups` (import `History` dari `lucide-react`):

```ts
{
  title: 'Sesi Rekaman',
  href: '/sesi-rekaman',
  icon: History,
  isActive: (pathname) => pathname.startsWith('/sesi-rekaman'),
},
```

Di `components/layout/breadcrumb-nav.tsx`, tambahkan ke `ROUTE_LABELS`:

```ts
'sesi-rekaman': 'Sesi Rekaman',
```

- [ ] **Step 4: Verifikasi di browser**

- `/sesi-rekaman` dengan `dev_role=ADMIN`: semua sesi tampil, terbaru di atas, dan jumlah record cocok dengan detail toko untuk sesi yang sama.
- Dengan `dev_role=GS` dan `DEV_GS_DEVICE_IDS=<satu device>`: hanya sesi perangkat itu yang tampil.
- Pencarian dan link toko berfungsi.
- Menu sidebar aktif di halaman ini, dan breadcrumb menampilkan "Sesi Rekaman".
- Lebar 375 px: halaman tidak scroll horizontal.

Run: `pnpm typecheck` dan `pnpm lint` → Expected: tanpa error

---

### Task 8: Buka File Rekaman

> **DITUNDA (2026-11-09, permintaan user)** bersama Task 6, karena memakai library Excel dan fungsi build/parse file yang sama. Jangan dikerjakan sampai user meminta.

**Files:**
- Modify: `lib/session-files.ts`, `tests/session-files.test.mjs`
- Create: `components/tools/session-file-viewer.tsx`, `app/(dashboard)/alat/buka-file/page.tsx`
- Modify: `components/layout/app-sidebar.tsx`, `components/layout/breadcrumb-nav.tsx`

**Interfaces:**
- Consumes: `buildBackupPayload`, `buildWorkbookSheets`, `SUMMARY_SHEET`, `BACKUP_SCHEMA` (Task 6), `toChartData`, `summarizeSession` (Task 5), `TelemetryChart`
- Produces:
  - `parseBackupJson(text: string): ParseFileResult`
  - `parseWorkbookSheets(fileName: string, sheets: { name: string; rows: Record<string, unknown>[] }[]): ParseFileResult`
  - `parseFlaskTimestamp(text: string): number | null`
  - `type ParseFileResult = { ok: true; value: SessionRecordsResult } | { ok: false; error: string }`
  - `MAX_FILE_BYTES = 50 * 1024 * 1024`
  - rute `/alat/buka-file`

- [ ] **Step 1: Tulis tes yang gagal**

Tambahkan di `tests/session-files.test.mjs` (perbarui import):

```js
import {
  buildBackupPayload, buildWorkbookSheets, safeFileName, BACKUP_SCHEMA,
  parseBackupJson, parseWorkbookSheets, parseFlaskTimestamp,
} from '../lib/session-files.ts'

test('parseFlaskTimestamp reads WIB "HH:MM:SS DD/MM/YYYY"', () => {
  assert.equal(parseFlaskTimestamp('10:00:00 09/11/2026'), T0)
  assert.equal(parseFlaskTimestamp('bukan tanggal'), null)
  assert.equal(parseFlaskTimestamp('25:00:00 09/11/2026'), null)
})

test('parseBackupJson round-trips a portal backup', () => {
  const text = JSON.stringify(buildBackupPayload(SAMPLE, EXPORTED))
  const r = parseBackupJson(text)
  assert.equal(r.ok, true)
  assert.equal(r.value.session.name, 'Audit Toko A/B')
  assert.deepEqual(r.value.phases.map((p) => [p.phase, p.name, p.records.length]), [['L12', 'Fase R', 2], ['CT', 'Freezer', 2]])
  assert.equal(r.value.phases[0].records[1].energy, 10.01)
})

test('parseBackupJson rejects other files', () => {
  assert.equal(parseBackupJson('{').ok, false)
  assert.equal(parseBackupJson(JSON.stringify({ schema: 'lain' })).ok, false)
  assert.equal(parseBackupJson(JSON.stringify({ schema: BACKUP_SCHEMA, records: [] })).ok, false)
})

test('parseBackupJson ignores prototype keys in records', () => {
  const r = parseBackupJson(
    '{"schema":"smart-energy-meter-backup","version":"1.0","session":{"name":"x"},"records":{"__proto__":[{"epoch":1}],"R":[]}}'
  )
  assert.equal(r.ok, true)
  assert.deepEqual(r.value.phases.map((p) => p.phase), ['R'])
  assert.equal({}.epoch, undefined)
})

test('parseWorkbookSheets reads a portal Excel export', () => {
  const sheets = buildWorkbookSheets(SAMPLE, EXPORTED).filter((s) => s.rows).map((s) => ({ name: s.name, rows: s.rows }))
  const r = parseWorkbookSheets('Audit Toko A_B.xlsx', sheets)
  assert.equal(r.ok, true)
  assert.equal(r.value.session.name, 'Audit Toko A_B')
  assert.equal(r.value.session.deviceName, 'Meter Toko A')
  assert.deepEqual(r.value.phases.map((p) => p.name), ['Fase R', 'Freezer'])
  assert.equal(r.value.phases[0].records[0].epoch, T0)
  assert.equal(r.value.phases[1].records[1].offline, true)
})

test('parseWorkbookSheets rejects a workbook without session sheets', () => {
  assert.equal(parseWorkbookSheets('a.xlsx', [{ name: 'Sheet1', rows: [{ a: 1 }] }]).ok, false)
})
```

- [ ] **Step 2: Jalankan, pastikan gagal**

Run: `node --test tests/session-files.test.mjs`
Expected: FAIL, `parseBackupJson is not a function`

- [ ] **Step 3: Implementasi parser**

Tambahkan di `lib/session-files.ts` (tambah `SessionPhaseRecords`, `SessionRecord` ke `import type`):

```ts
export const MAX_FILE_BYTES = 50 * 1024 * 1024

export type ParseFileResult = { ok: true; value: SessionRecordsResult } | { ok: false; error: string }

const FORBIDDEN_KEYS = new Set(['__proto__', 'constructor', 'prototype'])
const asNum = (v: unknown): number => {
  const n = typeof v === 'number' ? v : Number(v)
  return Number.isFinite(n) ? n : 0
}
const asText = (v: unknown, fallback: string): string => (typeof v === 'string' && v.trim() ? v : fallback)
const isObj = (v: unknown): v is Record<string, unknown> => typeof v === 'object' && v !== null && !Array.isArray(v)

// "HH:MM:SS DD/MM/YYYY" in WIB (UTC+7), as written by Flask.
export function parseFlaskTimestamp(text: string): number | null {
  const m = /^(\d{2}):(\d{2}):(\d{2}) (\d{2})\/(\d{2})\/(\d{4})$/.exec(text.trim())
  if (!m) return null
  const [h, mi, s, d, mo, y] = m.slice(1).map(Number)
  if (h > 23 || mi > 59 || s > 59 || mo < 1 || mo > 12 || d < 1 || d > 31) return null
  return Date.UTC(y, mo - 1, d, h - 7, mi, s)
}

function sessionFrom(phases: SessionPhaseRecords[], info: Partial<SessionRecordsResult['session']>): SessionRecordsResult {
  const all = phases.flatMap((p) => p.records).sort((a, b) => a.epoch - b.epoch)
  return {
    session: {
      id: info.id ?? 'file',
      name: info.name ?? 'Tanpa nama',
      deviceId: info.deviceId ?? '',
      deviceName: info.deviceName ?? '',
      startTime: info.startTime ?? all[0]?.timestamp ?? '---',
      endTime: info.endTime ?? all.at(-1)?.timestamp ?? null,
      recordCount: all.length,
    },
    phases,
  }
}

export function parseBackupJson(text: string): ParseFileResult {
  let data: unknown
  try {
    data = JSON.parse(text)
  } catch {
    return { ok: false, error: 'File JSON tidak bisa dibaca.' }
  }
  if (!isObj(data) || data.schema !== BACKUP_SCHEMA || !isObj(data.records)) {
    return { ok: false, error: 'File ini bukan backup sesi Smart Energy Meter.' }
  }
  const session = isObj(data.session) ? data.session : {}
  const names = isObj(session.phaseNames) ? session.phaseNames : {}

  const phases: SessionPhaseRecords[] = []
  for (const [phase, list] of Object.entries(data.records)) {
    if (FORBIDDEN_KEYS.has(phase) || !Array.isArray(list)) continue
    const records: SessionRecord[] = list.filter(isObj).map((r) => ({
      timestamp: asText(r.timestamp, ''),
      epoch: asNum(r.epoch),
      offline: r.offline === true,
      voltage: asNum(r.Voltage),
      current: asNum(r.Current),
      power: asNum(r.Power),
      frequency: asNum(r.Frequency),
      energy: asNum(r.Energy),
      powerFactor: asNum(r.PowerFactor),
    }))
    phases.push({ phase, name: asText(names[phase], phase), records: records.sort((a, b) => a.epoch - b.epoch) })
  }
  if (!phases.length) return { ok: false, error: 'Backup ini tidak berisi data sensor.' }

  return {
    ok: true,
    value: sessionFrom(phases, {
      id: asText(session.id, 'file'),
      name: asText(session.name, 'Tanpa nama'),
      deviceId: asText(session.deviceId, ''),
      deviceName: asText(session.deviceName, ''),
      startTime: asText(session.startTime, '---'),
      endTime: asText(session.endTime, '---'),
    }),
  }
}

const REQUIRED_COLUMNS = ['Timestamp', 'Power (W)']

export function parseWorkbookSheets(
  fileName: string,
  sheets: { name: string; rows: Record<string, unknown>[] }[]
): ParseFileResult {
  let deviceName = ''
  const phases: SessionPhaseRecords[] = []
  for (const sheet of sheets) {
    if (sheet.name === SUMMARY_SHEET || !sheet.rows.length) continue
    if (!REQUIRED_COLUMNS.every((c) => c in sheet.rows[0])) continue
    const records: SessionRecord[] = []
    for (const r of sheet.rows) {
      const timestamp = asText(r.Timestamp, '')
      const epoch = parseFlaskTimestamp(timestamp)
      if (epoch === null) continue
      deviceName ||= asText(r['Device Name'], '')
      records.push({
        timestamp,
        epoch,
        offline: String(r.Status).toUpperCase() === 'OFFLINE',
        voltage: asNum(r['Voltage (V)']),
        current: asNum(r['Current (A)']),
        power: asNum(r['Power (W)']),
        frequency: asNum(r['Frequency (Hz)']),
        energy: asNum(r['Active Energy (kWh)']),
        powerFactor: asNum(r['Power Factor']),
      })
    }
    if (records.length) phases.push({ phase: sheet.name, name: sheet.name, records: records.sort((a, b) => a.epoch - b.epoch) })
  }
  if (!phases.length) return { ok: false, error: 'Workbook ini tidak berisi sheet sesi rekaman.' }
  return { ok: true, value: sessionFrom(phases, { name: fileName.replace(/\.xlsx$/i, ''), deviceName }) }
}
```

Catatan untuk file Excel: nama sheet adalah nama sensor, bukan kunci fase. `toChartData` memanggil `normalizePhaseKey` pada nama itu, jadi "Fase R" tetap terbaca sebagai seri tersendiri. Warna R/S/T tetap benar karena `sensorColor` juga mengecek nama yang mengandung "fase r".

- [ ] **Step 4: Jalankan semua tes data**

Run: `pnpm test:data` → Expected: semua PASS (Task 1, 2, 5, 6, 8)

- [ ] **Step 5: Komponen viewer**

Muat skill UI dulu. `components/tools/session-file-viewer.tsx` (`'use client'`):

```tsx
'use client'

import { useMemo, useState } from 'react'
import type { MetricType, SessionRecordsResult } from '@/lib/types'
import { MAX_FILE_BYTES, parseBackupJson, parseWorkbookSheets, type ParseFileResult } from '@/lib/session-files'
import { summarizeSession, toChartData } from '@/lib/session-records'
import { TelemetryChart } from '@/components/monitoring/telemetry-chart'

async function readSessionFile(file: File): Promise<ParseFileResult> {
  if (file.size > MAX_FILE_BYTES) return { ok: false, error: 'File lebih besar dari 50 MB.' }
  const lower = file.name.toLowerCase()
  if (lower.endsWith('.json')) return parseBackupJson(await file.text())
  if (lower.endsWith('.xlsx')) {
    const XLSX = await import('xlsx')
    const wb = XLSX.read(await file.arrayBuffer(), { type: 'array', dense: true })
    const sheets = wb.SheetNames.map((name) => ({
      name,
      rows: XLSX.utils.sheet_to_json<Record<string, unknown>>(wb.Sheets[name]),
    }))
    return parseWorkbookSheets(file.name, sheets)
  }
  return { ok: false, error: 'Hanya file .xlsx atau .json yang bisa dibuka.' }
}

export function SessionFileViewer() {
  const [result, setResult] = useState<SessionRecordsResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [metric, setMetric] = useState<MetricType>('power')

  const chart = useMemo(() => (result ? toChartData(result.phases) : null), [result])
  const summary = useMemo(() => (result ? summarizeSession(result.phases) : null), [result])

  async function open(file: File) {
    setLoading(true)
    setError(null)
    try {
      const parsed = await readSessionFile(file)
      if (parsed.ok) setResult(parsed.value)
      else setError(parsed.error)
    } catch {
      setError('File tidak bisa dibaca.')
    } finally {
      setLoading(false)
    }
  }

  // Render:
  // 1. Drop zone: a <label> wrapping <input type="file" accept=".xlsx,.json" className="sr-only">,
  //    plus onDragOver/onDrop that call open(e.dataTransfer.files[0]). Copy:
  //    "Tarik file Excel (.xlsx) atau backup JSON ke sini, atau pilih file".
  //    Note under it: "File hanya dibaca di browser ini dan tidak diunggah ke server."
  // 2. error -> message with role="alert".
  // 3. result -> session name, device, start-end, total record, and summary
  //    (rata-rata daya, tegangan, total energi delta with 2 decimals, id-ID);
  //    metric buttons; <TelemetryChart data={chart.points} sensors={chart.sensors} metric={metric} rangeType="session" />;
  //    a "Tutup file" button that sets result to null.
  //    Use the Card and button patterns from store-monitoring-page.tsx.
}
```

Halaman ini tidak memanggil API apa pun. Semua pemrosesan terjadi di browser.

- [ ] **Step 6: Halaman, menu, breadcrumb**

`app/(dashboard)/alat/buka-file/page.tsx`:

```tsx
import type { Metadata } from 'next'
import { SessionFileViewer } from '@/components/tools/session-file-viewer'

export const metadata: Metadata = { title: 'Buka File Rekaman' }

export default function OpenFilePage() {
  return <SessionFileViewer />
}
```

Di `components/layout/app-sidebar.tsx`, tambahkan grup baru di antara grup pertama dan "Integrasi Ekosistem" (import `FolderOpen` dari `lucide-react`):

```ts
{
  label: 'Alat',
  items: [
    {
      title: 'Buka File Rekaman',
      href: '/alat/buka-file',
      icon: FolderOpen,
      isActive: (pathname) => pathname.startsWith('/alat/buka-file'),
    },
  ],
},
```

Di `components/layout/breadcrumb-nav.tsx`, `ROUTE_LABELS`:

```ts
alat: 'Alat',
'buka-file': 'Buka File Rekaman',
```

- [ ] **Step 7: Verifikasi di browser**

- Buka file `.xlsx` dan `.json` hasil Task 6. Grafik dan ringkasan harus sama dengan sesi aslinya.
- Buka satu file `.xlsx` dan satu `.json` lama yang diekspor dari dashboard Flask. Keduanya harus tampil.
- File `.txt`, file JSON lain, dan file lebih dari 50 MB harus memberi pesan yang jelas, tanpa halaman crash.
- Tab Network: tidak ada request ke server saat membuka file, selain chunk `xlsx` untuk file Excel.
- Keyboard: drop zone bisa difokus dengan Tab dan dibuka dengan Enter/Space.
- Lebar 375 px: tidak ada scroll horizontal.

Run: `pnpm typecheck` dan `pnpm lint` → Expected: tanpa error

---

### Task 9: Dokumen, catatan task, dan verifikasi akhir

**Files:**
- Modify: `ARCHITECTURE_PLAN.md`, `CLAUDE.md`, `AI_CONTEXT.md`
- Create: `docs/agent-notes/2026-11-09-HHMM-pindah-fitur-smart-energy-meter-tahap-1.md` (dari `docs/agent-notes/TEMPLATE.md`, jam Asia/Jakarta)

- [ ] **Step 1: ARCHITECTURE_PLAN.md**

Tambahkan bahwa portal kini mengambil data live dari `GET /api/live-buffer/<device_id>` Flask lewat route server, membaca `history` untuk sesi dan export, dan env `TELEMETRY_API_URL` khusus server. Tulis juga bahwa ingestion MQTT dan semua penulisan ke DB 2 tetap di Flask.

- [ ] **Step 2: CLAUDE.md dan AI_CONTEXT.md**

- Peta direktori: `app/(dashboard)/sesi-rekaman`, `app/(dashboard)/alat/buka-file`, `app/api/stores/[storeId]/live`, `app/api/sessions/[sessionId]/records`, `components/sessions`, `components/tools`, dan modul murni `lib/phase-keys.ts`, `lib/live-buffer.ts`, `lib/session-records.ts`, `lib/session-files.ts`.
- Services: `live-buffer-service.ts`, `session-service.ts`, `telemetry-api.ts`.
- Common Commands: `pnpm test:data`.
- Catatan: modul murni boleh saling import dengan path relatif `.ts` (`allowImportingTsExtensions`).
- Format file backup/Excel sama dengan Flask, dan "Total Energi Aktif" di Summary memakai delta.

- [ ] **Step 3: Catatan task**

Isi template tanpa secret, tanpa connection string, dan tanpa data produksi.

- [ ] **Step 4: Verifikasi akhir**

Muat `verification-before-completion`, lalu jalankan dan laporkan hasil aslinya:

```
pnpm test:data
pnpm test:params
pnpm test:access
pnpm typecheck
pnpm lint
pnpm build
```

Expected: semua lulus. Lalu ulangi pengecekan browser dari Task 4, 6, 7, dan 8 sekali lagi di `pnpm dev`.

- [ ] **Step 4b: Uji keamanan alur IoT**

Setiap poin di bawah harus lulus dan hasilnya dicatat di catatan task. Kalau satu saja gagal, Tahap 1 belum boleh di-deploy.

1. **Tidak ada penulisan.** Jalankan grep pada semua file baru dan file yang diubah di plan ini:
   ```
   rg -n -i "\b(insert|update|delete|alter|drop|truncate|create)\b" lib/services/session-service.ts lib/services/live-buffer-service.ts lib/services/telemetry-api.ts lib/db/read-only.ts app/api/sessions "app/api/stores/[storeId]/live"
   ```
   Expected: tidak ada kecocokan di dalam string SQL. Kecocokan pada nama variabel atau komentar dicek manual.
2. **Semua query sesi lewat `readOnlyQuery`.** `rg -n "pool\.query" lib/services/session-service.ts` harus kosong.
3. **Batas panggilan ke Flask.** Pasang lagi log sementara dari Task 3 Step 8, buka satu toko LIVE di 5 tab selama 2 menit, lalu hitung baris log.
   Expected: paling banyak 40 panggilan (120 detik / 3 detik). Tanpa cache, angkanya akan sekitar 120 (5 tab × 24 polling). Hapus log setelah dicek.
4. **Flask mati tidak membuat portal menyerang balik.** Di lokal, isi `TELEMETRY_API_URL` dengan port yang tidak dipakai (misalnya `http://127.0.0.1:5999/api`) lalu restart `pnpm dev`. Grafik live menampilkan "Gagal memuat", log menunjukkan paling banyak 1 percobaan per perangkat per 15 detik, dan Dashboard, Monitoring Toko, serta Sesi Rekaman tetap bisa dibuka. Kembalikan env setelahnya.
5. **Capture tetap jalan selama portal dipakai.** Pilih perangkat yang sedang merekam sesi. Selama uji 5 tab di poin 3, jalankan juga export Excel sesi itu dan buka `/sesi-rekaman` beberapa kali. Setelahnya, export sesi itu sekali lagi dan cek kolom `Timestamp` di rentang waktu uji: jarak antar record harus sama dengan interval capture, tanpa celah.
6. **Koneksi DB tidak bertambah.** Minta izin user dulu karena ini menyentuh database produksi, walaupun hanya membaca. Lalu jalankan:
   ```sql
   SELECT client_addr, state, count(*) FROM pg_stat_activity WHERE datname = 'energy-meter' GROUP BY 1, 2 ORDER BY 3 DESC;
   ```
   Expected: koneksi dari alamat portal paling banyak 10 selama uji poin 3 dan 5.

- [ ] **Step 4c: Rencana rollout**

Tulis di catatan task untuk user (deploy dilakukan user, bukan agent):
- Deploy di luar jam sibuk toko.
- Setelah deploy, pantau log Flask dan satu sesi rekaman aktif selama 30 menit dengan cek poin 5 di atas.
- Rollback: redeploy image portal sebelumnya. Flask tidak diubah, jadi rollback tidak menyentuh alur IoT sama sekali.

- [ ] **Step 5: Perbarui graph**

Run: `graphify update .`, lalu `/graphify . --update` karena dokumen ikut berubah.

---

## Tahap 2 (garis besar, dibuat sebagai plan terpisah)

Tahap ini menulis data, jadi direncanakan ulang setelah Tahap 1 dipakai dan dicek.

1. **Di `smart-energy-meter-vps` (dikerjakan di proyek itu):** semua endpoint `POST` dan `DELETE` Flask mewajibkan header token, misalnya `X-Portal-Token` yang dicocokkan dengan env `PORTAL_CONTROL_TOKEN`. Dashboard Flask lama juga perlu dikirimi token yang sama selama masa transisi, atau dashboard itu dibuat read-only.
2. **Guard ADMIN di portal:** `requireAdminApiAccess()` di `lib/auth/api-guard.ts`, aturan murni `canControlDevices(role)` di `lib/auth/access-rules.ts` (hanya `ADMIN`), dan tesnya di `pnpm test:access`.
3. **Route proxy portal**, semuanya `POST` dengan validasi body. Route meneruskan ke Flask dengan `TELEMETRY_API_TOKEN` dari server, tidak pernah dari browser:
   - capture: start, stop, interval, shift time
   - sesi: rename, rename sensor sesi, hapus satu sesi
   - perangkat: rename dan assign toko, init sensor, warna sensor, aktif/nonaktif sensor, hapus sensor
4. **Halaman `/pengaturan/perangkat`** dan detail perangkat, hanya ADMIN. Menu sidebar grup "Pengaturan" disembunyikan untuk role lain, dan halamannya sendiri tetap mengecek role (tidak cukup dengan menyembunyikan menu).
5. **Aksi berbahaya:** "Clear Records" tidak dipindah. Hapus sesi per perangkat memakai dialog konfirmasi yang meminta user mengetik nama sesi.
6. **Akhir transisi:** hapus link "Smart Energy Meter" di sidebar, lalu matikan atau batasi UI Flask (dikerjakan di proyek Flask).

Env tambahan Tahap 2: `TELEMETRY_API_TOKEN` di portal dan `PORTAL_CONTROL_TOKEN` di Flask, dengan nilai yang sama, khusus server.
