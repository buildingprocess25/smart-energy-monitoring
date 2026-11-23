# Backlog

Pekerjaan yang sudah disepakati tapi belum dijadwalkan. Hapus item setelah selesai dan catat di `docs/agent-notes/`.

## Query energi tanpa membaca seluruh `history`

- **Project:** `smart-energy-meter-vps` (pemilik skema DB 2). Portal ini hanya membaca, jadi perubahan skema tidak dikerjakan di sini.
- **Masalah:** `getMonthlyCostSummary()` membaca seluruh `history` dan `telemetry` lalu mengelompokkan per bulan dengan `TO_CHAR` di setiap baris. Pada 2026-11-23 `history` berisi sekitar 2,1 juta baris (870 MB) dan query itu butuh sekitar 12 detik. Query delta harian dan bulanan di `getStoreAnalyticsData()` butuh sekitar 1,5 detik per perangkat. Waktunya naik terus selama rekaman sesi menambah baris.
- **Pilihan:**
  - Index `history (device_id, epoch)`. `history` saat ini hanya punya index yang diawali `session_id` atau `(device_id, session_id, ...)`.
  - Tabel ringkasan energi harian per perangkat dan fase (delta kWh, daya rata-rata, jumlah sampel) yang diisi Flask. Portal lalu membaca tabel kecil itu, bukan `history`.
- **Syarat:** dibahas dan direncanakan di project Flask. Migrasi tidak boleh mengunci `history` selagi capture berjalan, misalnya dengan `CREATE INDEX CONCURRENTLY`. Kalau memilih tabel ringkasan, kolomnya menjadi kontrak antar repo dan dicatat di `ARCHITECTURE_PLAN.md`.
- **Sementara di portal:** Dashboard memuat kartu biaya bulanan dan analitik toko lewat `<Suspense>`, dan cache biaya bulanan menyajikan data lama sambil memperbarui di belakang. Halaman tidak lagi menunggu query itu, tapi beban query di database tetap ada.
