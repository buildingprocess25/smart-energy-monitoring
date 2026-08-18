# Dual-Database Integration Architecture & Store Assignment

## Scope

- Document the 3-pillar ecosystem integration architecture across `sparta-energy`, `smart-energy-meter-vps`, and `smart-energy-monitoring`.
- Clarify the dual-database isolation model: `sparta_energy` (DB 1: Master Stores, Users, Audits) and `energy_meter` (DB 2: IoT Devices, Telemetry, History).
- Implement device-to-store assignment mechanism via searchable store combobox in `smart-energy-meter-vps` Settings tab.
- Document database schema extension: Added `store_id` (VARCHAR(50)/UUID) to `devices` and `history` tables in DB 2 (`energy_meter`).
- Implement `GET /api/stores` endpoint with 300ms debouncing, `LIMIT 25`, and Pinned Testing Head Office Demo Store.

## Context and Sources

- `d:\Coding\smart-energy-meter-vps\INTEGRATION_ARCHITECTURE.md`
- `d:\Coding\smart-energy-meter-vps\backend\app.py`
- `d:\Coding\smart-energy-meter-vps\frontend\app.js`
- `d:\Coding\smart-energy-meter-vps\frontend\style.css`
- `d:\Coding\smart-energy-monitoring\ARCHITECTURE_PLAN.md`
- `d:\Coding\sparta-energy\ARCHITECTURE_PLAN.md`

## Changed Files

- `d:\Coding\smart-energy-meter-vps\.env`: Configured `SPARTA_DATABASE_URL` pointing to `energy` DB.
- `d:\Coding\smart-energy-meter-vps\backend\app.py`:
  - Added `init_sparta_db()` and `get_sparta_db_cursor()`.
  - Added non-destructive `ALTER TABLE devices ADD COLUMN store_id` and `ALTER TABLE history ADD COLUMN store_id`.
  - Added `GET /api/stores` endpoint supporting fast debounced search with `LIMIT 25` and pinned testing store (`DEMO-HO`).
  - Updated `GET /api/devices` to include `storeId`.
  - Updated `POST /api/devices/<id>/rename` to persist `store_id`.
  - Updated `_do_capture_io` and `capture_start` to tag history records with `store_id`.
- `d:\Coding\smart-energy-meter-vps\frontend\app.js`:
  - Replaced inline text input in Manage Devices with debounced Searchable Store Combobox with autocomplete list.
  - Added quick select button for Head Office testing store (`🧪 Pakai Toko Testing (Head Office)`).
- `d:\Coding\smart-energy-meter-vps\frontend\style.css`:
  - Added styling for autocomplete dropdown panel, search input spinner, store badges, and quick demo button.

## Decisions

- **Dual Database Architecture:** Retain two distinct physical/logical databases (`sparta_energy` for transactional business data and `energy_meter` for high-volume raw IoT telemetry) to prevent database bloat and ensure service isolation.
- **Server-Side Debounced Search:** Avoid downloading 22,000+ stores to browser memory; use server-side `LIMIT 25` query with 300ms debounce.
- **Store Selection in IoT VPS:** Replace the plain text "Nama Lokasi / Toko..." input in `smart-energy-meter-vps` (Settings ➔ Manage Devices) with a searchable combobox populated from `sparta_energy.stores`.
- **Database Schema Decision (Option 1):** Add `store_id VARCHAR(50) DEFAULT NULL` column to `devices` and `history` tables in `energy_meter` database via safe `ALTER TABLE ... ADD COLUMN IF NOT EXISTS`.

## Verification

- Verified syntax and schema migration checks in `app.py`.
- Verified autocomplete event handling, outside click dismissal, and debouncing in `app.js`.
- Verified styling integration in `style.css`.
