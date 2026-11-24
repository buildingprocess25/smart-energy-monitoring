# Migrasi fitur dashboard meter lama ke portal

Status: usulan, menunggu persetujuan user. Menggantikan garis besar Tahap 2 di `2026-11-09-pindah-fitur-smart-energy-meter.md`.

Sumber: jawaban sesi `smart-energy-meter-vps` (baca kode di HEAD `5f32d8a`, 2026-11-24). Yang dicek ulang dari sesi portal: perilaku stop, relay, penyimpanan state capture, daftar index, dan tidak adanya pemeriksaan login. Firewall, skema DB produksi, dan izin broker belum diperiksa.

## Aturan tetap

- Flask tetap pemilik MQTT, capture, dan semua penulisan DB 2. Portal hanya meneruskan perintah dari server, khusus ADMIN.
- Flask tidak dijalankan di lokal dan hanya boleh satu proses.
- Perintah kontrol selalu membawa `deviceId`, tidak diulang otomatis, dan dicek lewat status sebelum serta sesudahnya.
- Teks error 500 dari Flask tidak diteruskan ke browser. Daftar kosong tidak diartikan sebagai tidak ada perangkat.
- Deploy Flask membuat celah rekaman. Perubahan digabung dalam satu deploy terjadwal, stop-first, setelah user setuju di sesi Flask.

## Keputusan fitur

| Fitur | Usulan |
| :--- | :--- |
| Mulai, berhenti, dan interval rekaman | Pindah |
| Ubah nama sesi dan sensor sesi | Pindah |
| Hapus sesi | Pindah: ketik nama sesi, tolak sesi aktif |
| Nama perangkat dan toko | Pindah: ID harus sudah ada, koordinat lama ikut dikirim |
| Nama, warna, aktif/nonaktif sensor | Pindah: berurutan per perangkat |
| Ekspor Excel sesi | Pindah: record dibaca dari route portal yang ada |
| Status CT dan Plug | Baru, hanya baca |
| Hapus perangkat, hapus sensor, buka file JSON | Tunda |
| Relay plug | Tunda; UI lama juga tidak punya |
| Hapus semua rekaman, geser waktu, hourly capture, capture log, sensor init, grafik Week lama | Tidak dipindah |

## Tahap

### M0. Keamanan Flask (project Flask, sebelum kontrol apa pun)

1. Token pada semua `POST` dan `DELETE`, gagal tertutup, hanya dari server portal.
2. Dashboard lama dibatasi jaringan atau login pada deploy yang sama. Tanpa ini, UI lama rusak begitu token aktif.
3. `stop` wajib `deviceId`, beserta dua pemanggilnya di UI lama.
4. Tolak hapus untuk sesi aktif.
5. Simpan state setelah ganti interval atau nama, dan simpan per perangkat.
6. Lepas MQTT dari browser, lalu ganti kredensial broker. Cek dulu apakah firmware memakai akun yang sama.

### M1. Baca-saja (project portal, tidak menunggu M0)

1. Tipe perangkat dari prefix ID, sinyal, uptime, dan status relay ("tidak diketahui" bila kosong).
2. Fase bebas nama: kunci berisi `/` (contoh `1P/Lampu`) saat ini dibuang `PHASE_KEY_PATTERN`.
3. Total live hanya menjumlah R/S/T bila panel utama ada. Saat ini semua sensor dijumlah.
4. Ekspor Excel sesi.

### M2. Kontrol rekaman dan sesi (setelah M0)

1. `canControlDevices(role)` dan `requireAdminApiAccess()`, dengan tes lebih dulu.
2. Route proxy `POST` dengan validasi body dan pemeriksaan Origin.
3. UI di detail toko dan Sesi Rekaman. Mulai rekaman memberi tahu bahwa counter alat lama ikut direset.
4. Uji `stop` dengan dua rekaman aktif: hanya perangkat yang dituju yang berhenti.

### M3. Pengaturan perangkat dan sensor

Halaman `/pengaturan/perangkat`, hanya ADMIN, role dicek di server.

### M4. Pensiun dashboard lama

Setelah semua fitur yang masih dipakai lolos uji dan dipakai minimal dua minggu. UI ditutup; proses Flask tetap jalan.

### M5. Relay (hanya kalau user memutuskan perlu)

Butuh daftar beban yang boleh dimatikan, izin broker, konfirmasi, log audit, dan perbaikan relay di Flask.

## Perlu dicek di DB 2 (hanya baca, dengan izin user)

- Constraint unique `telemetry (device_id, phase, timestamp)`. Tanpa itu insert telemetry bisa gagal tanpa terlihat.
- Baris `history` ganda untuk perangkat, fase, dan epoch yang sama.
- Baris energi 0 saat offline: bukan reset counter. Ini memengaruhi perbaikan total energi.

## Index

`history (device_id, epoch)` dibuat `CONCURRENTLY` di luar transaksi, bukan lewat `init_db`. Cek ukuran tabel dan ruang disk dulu. Ini perubahan skema milik project Flask dan butuh izin user.
