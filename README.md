# SPARTA Smart Energy Monitoring

Portal monitoring energi toko Alfamart dari alat IoT energy meter, bagian dari
ekosistem SPARTA Energy. Lihat `AI_CONTEXT.md` untuk konteks domain dan
`ARCHITECTURE_PLAN.md` untuk arsitektur 3 proyek dan dual database.

## Required setup

```powershell
pnpm install
pnpm setup:git-hooks
```

Read `AGENTS.md` (or `CLAUDE.md` for Claude Code) and `AI_RULES.md` before
changing the project. The knowledge graph in `graphify-out/` is the first stop
for codebase questions: `graphify query "<question>"`. Every
substantive change needs a dated note in `docs/agent-notes/`; never bypass this
guard with `git commit --no-verify`.

Built with Next.js 16 and shadcn/ui.

## Adding components

To add components to your app, run the following command:

```bash
npx shadcn@latest add button
```

This will place the ui components in the `components` directory.

## Using components

To use the components in your app, import them as follows:

```tsx
import { Button } from "@/components/ui/button";
```

## Prisma

Set `SPARTA_DATABASE_URL`, `TELEMETRY_DATABASE_URL`, and `DATABASE_URL` in
`.env` (see `.env.example`) only after confirming whether it targets
development or production. Use `pnpm prisma:validate` and
`pnpm prisma:generate`; this template prohibits `prisma db push`,
`prisma migrate dev`, and `prisma migrate deploy`.

## Dokploy deployment

GitHub Actions builds and pushes `ghcr.io/<owner>/<repository>` on each push to
`main` or `master`, then calls the `DOKPLOY_WEBHOOK_URL` repository secret.
Configure the Dokploy application to pull that image, grant Dokploy access to
the GHCR package when it is private, and set runtime environment variables
there. Dokploy owns domain routing, HTTPS, port mapping, and VPS CPU/RAM
limits; the image listens on port `3000` with `HOSTNAME=0.0.0.0`.
