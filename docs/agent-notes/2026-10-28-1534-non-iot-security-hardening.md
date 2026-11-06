# Non-IoT security hardening

## Scope

Five fixes that do not touch IoT queries, pools or the IoT data flow: asset route
path traversal, production lock of `GET /api/stores`, exact store-code match,
query param validation on two store API routes, and security headers. IoT query
performance work (epoch ranges, single store lookup, cache limits) is deferred.

## Context and Sources

Security review in this session. Confirmed with the sparta-energy session that
both sparta callers (`lib/iot-status.ts`, `lib/monitoring-devices.ts`) send
`x-internal-token` and that production env has the same token on both apps.

## Changed Files

- `app/api/assets/[filename]/route.ts`: bare image names only, contained in the
  asset folder; dropped the hardcoded `d:/` path and the runtime copy into `public/assets`.
- `lib/auth/access.ts`: tokenless `/api/stores` stays open in development only.
- `lib/services/store-service.ts`: `code ILIKE $1` → `UPPER(code) = UPPER($1)`.
- `lib/request-params.ts`: new parser for `rangeType`, `date`, `sessionId`, `page`, `pageSize`.
- `app/api/stores/[storeId]/history/route.ts`, `.../overview-analytics/route.ts`: 400 on bad params.
- `next.config.ts`: CSP, X-Frame-Options, nosniff, Referrer-Policy, Permissions-Policy, HSTS (non-dev).
- `tests/request-params.test.mjs`, `package.json` (`test:params`).
- `AGENTS.md`, `CLAUDE.md`, `AI_CONTEXT.md`: documented the above.

## Decisions

The asset route is kept because `components/logo.tsx` and the sidebar use it.
CSP keeps `'unsafe-inline'` for scripts because Next.js inline scripts carry no
nonce here; `connect-src` adds the sparta origin for the sidebar sign-out.

## Verification

- Unit tests: `node --test` on both test files, 11/11 pass. `tsc --noEmit` exit 0.
- eslint on changed files: only pre-existing `no-explicit-any` in `store-service.ts`.
- `pnpm build` succeeded. On `next start -p 3100`: all headers present; `/api/stores`
  without session or token 401, with token 200; `/api/internal/devices` with token 200;
  `/proc/self/environ` traversal 404; logo 200.
- On the dev server: traversal variants 404, logos 200; history and analytics return 400
  for bad params and 200 for what the monitoring page sends.
- SPARTA DB: the old `ILIKE` matched a random store for `%` and `_%`; the new match
  returns none and still finds `1A01` / `1a01`.
- Client bundles reference no external fetch origin besides the API and sparta sign-out.

## Remaining Work and Risks

- Logged-in pages (map, sign-out) were not opened in a browser under the new CSP;
  check the map tiles and "Keluar" after deploy.
- If production was exposed before this fix, rotate DB passwords and
  `MONITORING_INTERNAL_TOKEN` and check Traefik logs for `%2F` under `/api/assets/`.
- Confirm in Dokploy that `MONITORING_INTERNAL_TOKEN` is identical on both apps.
- Deferred: IoT query work, TLS verification for DB pools (needs the CA file).
