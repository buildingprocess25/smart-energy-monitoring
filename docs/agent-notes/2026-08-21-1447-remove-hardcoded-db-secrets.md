# Remove Hardcoded Database Secrets and Fix GitHub Push Protection

## Scope

- Remove hardcoded database passwords and fallback connection strings in `lib/db/pools.ts`.
- Strictly enforce environment variables (`SPARTA_DATABASE_URL` and `AIVEN_DATABASE_URL`).
- Resolve GitHub Push Protection secret scanning violation.

## Context and Sources

- `lib/db/pools.ts`: Database pool singleton.
- `.env`: Environment variables configuration for Sparta and Aiven DBs.

## Changed Files

- `lib/db/pools.ts`: Removed fallback connection strings containing passwords; strictly throw errors if env vars are missing.
- `docs/agent-notes/2026-08-21-1447-remove-hardcoded-db-secrets.md`: Task note.

## Decisions

- **Environment Variable Strictness**: Do not provide hardcoded connection strings with credentials as fallbacks. All database connections must originate from `.env` or deployment environment variables.

## Verification

- `pnpm typecheck`: Clean (0 errors).
- `git status` / `git log`: Verified secret removal from commit history.

## Remaining Work and Risks

None.
