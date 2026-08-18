# Clean copy-assets dev and build scripts

## Scope

- Remove redundant `copy-assets` execution from `npm run dev` and `npm run build` in `package.json`.
- Remove unnecessary `ensureAssets()` filesystem operation from `app/layout.tsx`.

## Context and Sources

- `package.json`
- `scripts/copy-assets.mjs`
- `app/layout.tsx`
- `public/assets/`

## Changed Files

- `package.json`: Updated `"dev"` to `"next dev"` and `"build"` to `"next build"`.
- `app/layout.tsx`: Removed unused `fs`, `path`, and `ensureAssets()` runtime logic.

## Decisions

- Retained `copy:assets` script in `package.json` for manual on-demand syncing if needed, but eliminated automatic execution on every `dev` run since assets are already present in `public/assets/`.

## Verification

- Verified syntax of `package.json` and `app/layout.tsx`.

## Remaining Work and Risks

None
