# Store Analytics Widget with 24-Hour Load Profile and Per-Store Consumption

## Scope

- Menggantikan widget tren statis di Dashboard utama (`/`) dengan `StoreAnalyticsWidget` yang interaktif dan adaptif.
- Menggabungkan Opsi 1 (Profil Beban Daya 24 Jam) dan Opsi 2 (Tren Konsumsi 7 Hari per Toko Terpilih) dengan selector dropdown toko.
- Mengimplementasikan *Dynamic Store-Specific Anchor*: Untuk toko yang selesai diaudit di masa lampau (status *Historical*), data otomatis langsung ter-anchor pada tanggal rekaman audit terakhir toko tersebut (`latestRecordedDate`) sehingga grafik 100% selalu terisi data riil.
- Menyediakan endpoint API `/api/stores/[storeId]/overview-analytics` untuk transisi pemuatan data toko secara cepat di client side.

## Context and Sources

- `lib/types.ts`: Interface `StoreAnalyticsResult`, `LoadProfilePoint`, `DailyConsumption`.
- `lib/services/telemetry-service.ts`: Fungsi `getStoreAnalyticsData()` dengan agregasi kurva beban per jam dan delta kWh time-series terpadu.
- `app/api/stores/[storeId]/overview-analytics/route.ts`: API route endpoint analitik per toko.
- `components/dashboard/store-analytics-widget.tsx`: Komponen widget Bento Grid Col 8 lengkap dengan quick metrics, AreaChart 24 jam, dan BarChart 7 hari navigasi slide.
- `components/dashboard/dashboard-overview.tsx` & `app/(dashboard)/page.tsx`: Integrasi widget ke dalam overview dashboard.

## Changed Files

- `lib/types.ts`: Menambahkan definisi `StoreAnalyticsResult` dan `LoadProfilePoint`.
- `lib/services/telemetry-service.ts`: Menambahkan fungsi `getStoreAnalyticsData()`.
- `app/api/stores/[storeId]/overview-analytics/route.ts`: Endpoint API analitik overview per toko.
- `components/dashboard/store-analytics-widget.tsx`: Komponen StoreAnalyticsWidget dengan dropdown toko dan tab toggle.
- `components/dashboard/dashboard-overview.tsx`: Menyematkan StoreAnalyticsWidget menggantikan chart lama.
- `app/(dashboard)/page.tsx`: Mengambil `initialStoreAnalytics` secara server-side saat initial load.

## Decisions

- **Store-Specific Anchor**: Menghilangkan tampilan kosong saat melihat toko yang masa auditnya selesai di masa lampau dengan membaca tanggal rekaman terbaru di database khusus untuk toko tersebut.
- **Dual Tab Mode**: Pengguna dapat berpindah instan antara melihat fluktuasi beban harian (*Peak vs Base Load* 24 jam) atau total energi (*kWh 7 hari*).
- **Client-Side Swapping**: Menggunakan API endpoint ringan agar pergantian toko di dropdown berlangsung instan dan mulus tanpa reload seluruh halaman.

## Verification

- `tsc --noEmit`: 0 error type check.
- `node scripts/check-agent-task-note.mjs`: Lolos validasi pre-commit guard.

## Remaining Work and Risks

None.
