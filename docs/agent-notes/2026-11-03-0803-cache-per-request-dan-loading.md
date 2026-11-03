# Cache per request untuk data toko dan halaman loading

## Scope

- `getIotDeviceDataList`, `getStores`, dan `getStoreById` dibungkus `cache()` dari React, supaya satu request tidak membaca daftar perangkat berulang kali.
- Menambah `app/(dashboard)/loading.tsx` agar ada umpan balik langsung saat pindah halaman.
- Di luar cakupan, atas permintaan user supaya data live IoT tidak terganggu: hasil capture status tidak di-cache antar-request, dan timeout-nya tidak diubah. Loop query N+1 per perangkat dan batas rentang waktu query analitik juga belum diubah.

## Context and Sources

- Review performa (sudut pandang QA): sebelumnya `getIotDeviceDataList` dipanggil 3 kali di overview dan 4 kali di detail toko. Setiap pemanggilan menjalankan query perangkat, satu panggilan `capture/status` (timeout 1,5 detik), dan 1–3 query per perangkat.
- `NEXT_PUBLIC_TELEMETRY_API_URL/capture/status` tidak bisa dijangkau dari mesin lokal (gagal setelah 2,1 detik), jadi setiap pemanggilan menunggu timeout.
- `node_modules/next/dist/docs/01-app/01-getting-started/06-fetching-data.md`: `React.cache` hanya berlaku untuk request yang sedang berjalan, tanpa berbagi antar-request.
- `node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/loading.md`.

## Changed Files

- `lib/services/store-service.ts`: tiga fungsi diekspor sebagai `cache(load...)`. Isi fungsinya tidak berubah.
- `app/(dashboard)/loading.tsx`: baru. Skeleton dengan teks "Mengambil data toko dan perangkat IoT", `role="status"`, dan animasi mati kalau pengguna memilih reduced motion.

## Decisions

- Cache hanya per request. Setiap buka atau refresh halaman tetap membaca DB dan API capture lagi, jadi data live tidak tertinggal. Route API tidak di-memoize, jadi tidak terpengaruh.
- Hasil yang di-cache dipakai bersama oleh pemanggil di request yang sama. Saya cek bahwa tidak ada pemanggil yang mengubah array atau objek itu (hanya `find`, `filter`, `map`).
- Satu `loading.tsx` di `(dashboard)` mencakup `/`, `/monitoring`, dan detail toko. Pemeriksaan role tetap di `layout.tsx`, di luar boundary loading.

## Verification

- `pnpm typecheck`: lulus.
- eslint `loading.tsx`: bersih. `store-service.ts`: 5 error `no-explicit-any` yang sudah ada di `HEAD`. Diff memastikan perubahan ini tidak menambah `any`.
- Kontras teks loading (`--muted-foreground` di atas `--background`): 5,13:1 (terang), 5,47:1 (gelap).
- Belum diukur di app yang berjalan. Halaman butuh sesi SSO, dan `next-dev-loop` butuh Next.js 16.3+ dan `agent-browser`.

## Remaining Work and Risks

- Uji manual: buka detail toko, refresh dua kali, dan pastikan gauge dan "terakhir diperbarui" ikut berubah. Pindah halaman harus langsung menampilkan skeleton.
- Masih ada di daftar QA: loop N+1 per perangkat, query analitik tanpa batas rentang waktu, dan timeout `capture/status`. Semua belum dikerjakan.
