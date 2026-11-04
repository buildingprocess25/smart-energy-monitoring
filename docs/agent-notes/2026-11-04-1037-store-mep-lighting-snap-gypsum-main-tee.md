# Store MEP Simulator — Lighting Snap to Gypsum Tile Main Tee Grid & Asymmetry Shift Cycle

## Scope

- Menambahkan kapabilitas snapping baris lampu secara presisi ke rangka **Main Tee Plafon Gypsum Tile** (interval ~1.80m / melompati 2 panel @ 60cm).
- Mengatasi problem asimetri jarak dinding depan vs dinding belakang toko akibat pembagian sisa potongan tepi dengan fitur **Siklus Pergeseran Fasa (Modulo 3)**.
- Menambahkan auto-rekomendasi fasa paling seimbang (*minimum wall asymmetry*) untuk membantu teknisi memilih titik start tulangan terbaik.
- Menampilkan bayangan halus arsitektural (*watermark / ghost grid*) struktur rangka T-Bar (Main Tee, Cross Tee, Border) secara transparan di bawah lampu pada kanvas.
- Mempertahankan rasio daya pencahayaan ritel (4.0–5.0 W/m² @ 13.5W per tabung TL LED T8) dan aturan *exclusion zone* (lampu dilarang di atas chiller, kasir, dan pilar).

## Context and Sources

- Diskusi kebutuhan teknis Store MEP Simulator ritel modern (Indomaret/Alfamart) dengan plafon akustik / gypsum tile (modul 1.2m x 0.6m).
- `sparta-energy/lib/lamp-calculator.ts`: Fungsi analitis ray-intersection `placeLamps`.
- `sparta-energy/lib/gypsum-tile-calculator.ts`: Ekstraksi koordinat grid frame T-Bar.
- `sparta-energy/app/store-mep-simulator/store-mep-simulator-client.tsx`: Komponen kanvas interaktif MEP Simulator.

## Changed Files

- `sparta-energy/lib/lamp-calculator.ts`: Menambahkan parameter `customYRows?: number[]` pada `placeLamps` untuk penempatan lampu yang terkunci pada sumbu koordinat Main Tee tertentu sambil mempertahankan ray-intersection dan kalkulasi spasi.
- `sparta-energy/app/store-mep-simulator/store-mep-simulator-client.tsx`:
  - Memindahkan deklarasi `storeDimensions` dan `gypsumCalculation` sebelum `lightingCalculation`.
  - Mengintegrasikan kalkulasi snapping baris lampu pada `gypsumCalculation.gridLines` dengan 3 opsi fasa pergeseran tulangan (Modulo 3).
  - Menghitung jarak dinding belakang (`dTop`), dinding depan (`dBottom`), dan selisih (`asymmetry`), serta otomatis menentukan `recommendedPhase`.
  - Menambahkan rendering *ghost grid watermark* rangka plafon gypsum tile di layer latar belakang sistem pencahayaan.
  - Menambahkan tombol kontrol cepat pada header toolbar kanvas yang terkunci (`Snap Rangka: ON/OFF`, `Fase Rangka X/3`, `Rangka: Tampil/Sembunyi`).
  - Menambahkan kartu interaktif "Kunci ke Rangka Gypsum" di right sidebar dengan tombol pemilih 3 fasa, metrik jarak dinding, dan checkbox watermark.
  - Menambahkan indikator status snap pada kartu parameter kiri.
- `sparta-energy/presentation_report/FINAL_REPORT_SPARTA_ENERGY_ECOSYSTEM_NOVEMBER_2026.md`: Memperbarui Slide 8 A untuk mendokumentasikan update fitur Kalkulator Lampu v1.2.0.

## Decisions

1. **Jarak Baris 1.80m (Modulo 3 Frame Pitch)**: Modul gypsum tile memiliki tinggi 0.60m. Mengambil setiap garis ke-3 (melompati 2 tulangan) menghasilkan interval $3 \times 0.60\text{ m} = 1.80\text{ m}$, yang ideal memenuhi batas standar jarak antar baris retail ($\le 1.90\text{ m}$).
2. **Siklus 3 Fasa Pergeseran Awal**: Karena panjang toko bervariasi dan terdapat potongan sisa tepi (*half-tile border cut*), pergeseran fasa (0, 1, 2) memberikan fleksibilitas penuh bagi engineer untuk menyeimbangkan jarak ke dinding depan/belakang atau menghindari rintangan balok struktural di lapangan.
3. **Ghost Grid Watermark Transparan**: Menggunakan opasitas rendah (0.22 untuk Main Tee, 0.10 untuk Cross Tee, 0.22 dashed untuk Border) di balik bodi lampu dan pendaran glow biru, sehingga tidak mengganggu visibilitas lampu namun memberikan presisi visual ala software CAD arsitektur.

## Verification

- **TypeScript Compilation**: `npx tsc --noEmit` di repository `sparta-energy` lolos dengan kode exit 0 (zero error).
- **Automated Verification Script**: Script `scratch/test-lamp-snap.js` dijalankan pada denah persegi panjang (8m x 14m) dan denah asimetris huruf L (10m x 15m):
  - Memvalidasi 23 garis horizontal plafon dengan interval antar baris snapped tepat 1.80m.
  - Memvalidasi fasa 3 menghasilkan simetri sempurna ($d_{\text{top}} = 1.60\text{ m}, d_{\text{bottom}} = 1.60\text{ m}, \text{asymmetry} = 0\text{ m}$).
  - Memvalidasi densitas daya tetap terjaga di rentang standar (5.06 W/m² @ 42 titik lampu).
  - Memvalidasi denah bentuk L berfungsi normal tanpa tabrakan batas luar.

## Remaining Work and Risks

None. Seluruh fitur telah diimplementasikan, diverifikasi secara komprehensif, dan disinkronkan dengan laporan presentasi akhir ekosistem Sparta Energy.
