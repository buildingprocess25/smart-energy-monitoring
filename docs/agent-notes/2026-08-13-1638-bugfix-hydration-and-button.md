# Bugfix: Next.js Hydration & Base UI Button Component

## Scope

Addressed console errors and hydration warnings reported during the Next.js development server run for Phase 1.

## Context and Sources

- User reported three distinct errors/warnings from Next.js server console.
- `next-themes` script hydration warning in React 19 / Next.js 15+ (Turbopack).
- Next.js Server vs Client string rendering hydration error.
- Base UI native button semantics warning.

## Changed Files

- `app/layout.tsx`: Added `suppressHydrationWarning` to `<body>` to suppress the known `next-themes` script injection mismatch in Next.js.
- `components/dashboard/store-card.tsx`:
  - Replaced `<Button asChild>` and `<Button render={...}>` with direct `next/link` usage using `buttonVariants` to fix Base UI's native button semantics expectation.
  - Hardcoded `'id-ID'` locale to `toLocaleString()` to ensure server and client renders identical localized string.
- `components/monitoring/store-hero.tsx`:
  - Hardcoded `'id-ID'` locale to `toLocaleString()` for `kwhTotal` and `currentTotalW`.

## Decisions

- Next.js SSR defaults to the server's locale (usually en-US) while CSR uses the browser's (often id-ID in this context). Specifying `'id-ID'` guarantees deterministic output.
- Reverting to `buttonVariants()` for `Link` wrapper is the recommended shadcn approach when Base UI's `<Button>` component enforces strict semantic `button` tags.

## Verification

- Ran `pnpm typecheck` successfully.
- Code changes directly address the stack trace locations provided by the user.

## Remaining Work and Risks

None.
