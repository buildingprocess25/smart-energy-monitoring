# Integrasi Peta Geografis Asli (Leaflet & OpenStreetMap) pada Smart Energy Monitoring

## Scope

- Mengintegrasikan sistem pemetaan geografis nyata menggunakan Leaflet dan OpenStreetMap / CartoDB tiles ke dalam `smart-energy-monitoring`.
- Menggantikan visualisasi kanvas skematik grid SVG dengan `NetworkMapLeaflet` interaktif yang mendukung zooming, panning, dark/light tile layers, dynamic auto-fit bounds, custom pulsing pins, dan popup telemetry toko.
- Pengaturan rendering dynamic `ssr: false` untuk memastikan kompatibilitas Next.js SSR / React 19.

## Context and Sources

- `components/dashboard/network-map-widget.tsx`: Komponen wrapper peta di dashboard utama.
- `package.json`: Menambahkan dependensi `leaflet`, `react-leaflet`, dan `@types/leaflet`.
- `DESIGN.md` & `PRODUCT.md`: Spesifikasi UI/UX untuk integrasi ekosistem monitoring SPARTA.

## Changed Files

- `components/dashboard/network-map-leaflet.tsx`: Menggunakan tile layer natural CartoDB Voyager, pin bundar mengambang tanpa kotak bingkai, dan popup bersih.
- `components/dashboard/network-map-widget.tsx`: Memindahkan info watermark ke pojok kanan atas agar tidak menabrak kontrol zoom in/out, serta memperbarui diksi judul.
- `app/globals.css`: Reset style border Leaflet div icon dan styling popup clean card.

## Decisions

- **Tile Layer Natural Standard:** Menggunakan tema peta terang alami (CartoDB Voyager) untuk tampilan visual yang konsisten dan mudah dikenali layaknya peta pada umumnya.
- **Floating Pin Tanpa Kotak:** Menghapus label kotak tebal di bawah pin sehingga hanya marker titik bersih dengan efek radar pulse yang tampak di atas peta.
- **Relokasi Info Badge ke Kanan Atas:** Menghilangkan tumpang tindih dengan tombol kontrol zoom bawaan Leaflet (+/-) di kiri atas.
- **Penyelarasan Warna Tombol Popup:** Tombol "Buka Telemetri Toko" menggunakan nuansa slate gelap yang rapi dan kontras nyaman.


## Verification

- `pnpm run typecheck`: Berhasil tanpa error (`tsc --noEmit` exit 0).
- Kompatibilitas Leaflet dan React-Leaflet terverifikasi.

## Remaining Work and Risks

None.
