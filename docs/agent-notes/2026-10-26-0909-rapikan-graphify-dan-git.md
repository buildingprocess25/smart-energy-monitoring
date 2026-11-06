# Rapikan File Graphify dan Isi Repo

## Scope

Membersihkan perubahan yang tidak perlu masuk git, supaya repo ini hanya berisi
konteks portal smart-energy-monitoring. Tidak ada perubahan kode aplikasi.

## Context and Sources

- Commit `edd25e6` di `dev-lens` ikut membawa cache graphify, backup harian, dan
  file berisi path mesin lokal (`.graphify_python`, `.graphify_root`).
- Hook graphify memperbarui file-file itu setiap kali ada edit, sehingga daftar
  perubahan di git selalu penuh.
- Konsep akses role (ADMIN, AUDITOR, GS, AREA, USER) sebagian besar berisi
  pekerjaan sparta-energy, dan salinannya sudah ada di repo sparta.

## Changed Files

- `.gitignore`: mengabaikan `graphify-out/cache/`, backup harian
  `graphify-out/20*/`, `.graphify_python`, `.graphify_root`,
  `.graphify_labels.pending.json`, `.graphify_labels.json.sig`, dan marker
  hook `.claude_needs_update`.
- `graphify-out/...`: file-file di atas dilepas dari pelacakan git dengan
  `git rm --cached`. Filenya tetap ada di mesin lokal, jadi hook graphify tetap
  jalan.
- Dihapus dari repo ini (belum pernah di-commit):
  `docs/superpowers/specs/2026-10-26-akses-role-gs-area-design.md` dan task note
  konsepnya. Dokumen utamanya sekarang ada di repo sparta-energy:
  `docs/akses-role-admin-auditor-gs-area.md`.

## Decisions

- Yang tetap dilacak: `graph.json`, `graph.html`, `GRAPH_REPORT.md`,
  `manifest.json`, `.graphify_build.json`, dan `.graphify_labels.json`, supaya
  tim dan agent lain langsung punya graph.
- Pekerjaan sisi portal untuk konsep akses role akan dicatat di repo ini saat
  dikerjakan, dengan merujuk dokumen di repo sparta-energy.

## Verification

- `git status` setelah perubahan: hanya `.gitignore`, empat file graph utama,
  dan file graphify yang dilepas dari pelacakan.
- `graphify-out/.graphify_python` dan `graphify-out/cache/` masih ada di disk.

## Remaining Work and Risks

- Perubahan ini belum di-commit; user yang melakukan commit.
- Implementasi sisi portal untuk konsep akses role menunggu sisi sparta-energy.
