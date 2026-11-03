# Sembunyikan toko DEMO dari Prioritas Pasang IoT di production

## Scope

Di production, `getSangatBorosStores()` sekarang membuang baris `is_demo` dari `v_toko_sangat_boros` dan menomori ulang peringkat mulai dari 1. Development tetap menampilkan toko demo dengan label "Uji coba". View di sparta-energy tidak diubah.

## Context and Sources

- Laporan: "Alfamart Demo 1" tidak tampil di halaman validasi sparta live, tetapi masih tampil di `/monitoring`.
- `sparta-energy/prisma/migrations/20261023010000_add_view_toko_sangat_boros/migration.sql`: view menyimpan baris DEMO untuk pengujian dan pembacanya wajib membuangnya di production.
- `sparta-energy/lib/audit-validation-queries.ts` (`activeStoreSql`) dan `lib/admin-sangat-boros.ts`: sparta membuang branch `demo` di production.

## Changed Files

- `lib/services/sangat-boros-service.ts`: membuang baris demo saat `NODE_ENV === 'production'` dan menomori ulang `rank`.

## Decisions

- Aturannya mengikuti sparta: demo disembunyikan hanya di production, supaya alur uji coba di development tetap jalan.
- Peringkat dinomori ulang supaya nomornya urut (1..N) dan sama dengan penomoran sparta. Halaman detail toko memakai `rank` dari fungsi yang sama, jadi ikut konsisten.
- Teks "X dari N toko" di UI sudah membaca jumlah baris, jadi tidak ada yang diubah di sana.

## Verification

- `pnpm typecheck`: lulus.
- `eslint lib/services/sangat-boros-service.ts`: lulus.
- `pnpm test:access`: 7 lulus, 0 gagal.
- Belum dicek di build production yang berjalan.

## Lanjutan di sparta-energy

- `sparta-energy/prisma/migrations/20261103000000_rank_sangat_boros_without_demo/migration.sql`: `CREATE OR REPLACE VIEW` dengan `ROW_NUMBER() OVER (PARTITION BY is_demo ...)`, supaya DEMO tidak memakai slot 12 toko asli. Kolom tidak berubah, dan tidak ada data tabel yang disentuh.
- `sparta-energy/docs/integrasi-sangat-boros-monitoring.md` dan `sparta-energy/AGENTS.md`: aturan peringkat DEMO diperbarui.
- `lib/services/sangat-boros-service.ts`: urutan query diganti menjadi `ORDER BY is_demo DESC, peringkat`, supaya di development DEMO tampil di atas dan tidak bercampur dengan peringkat toko asli.
- Verifikasi: `prisma validate` dan `tsc --noEmit` di sparta lulus, `pnpm typecheck` dan eslint di monitoring lulus.

## Remaining Work and Risks

- Migrasi belum diterapkan. Jalankan `npx prisma migrate deploy` dari sparta-energy ke database yang dituju. Jangan pakai `migrate dev`, karena perintah itu bisa menawarkan reset database.
- SQL view belum diuji ke database. Sampai migrasi diterapkan, production tetap menampilkan 11 toko asli.
