# AI Coding Rules

These rules are mandatory for every AI agent and developer working in this
repository. `AGENTS.md` and `CLAUDE.md` describe the project; this file lists
what must and must not be done.

## Skills and Product Context

- Read `skills-lock.json` before starting and use every installed skill that
  matches the task. The task-to-skill table is in `AGENTS.md` and `CLAUDE.md`
  under **Skills**. Do not invoke unrelated or mutually exclusive skills just
  to satisfy this rule.
- `impeccable` and the `antislop` family are installed outside
  `skills-lock.json` (`.agents/skills/`, `.claude/skills/`, and the other agent
  folders). They are still mandatory where they apply.
- If either `PRODUCT.md` or `DESIGN.md` is missing, run `/impeccable init`
  before continuing.
- Every UI creation, revision, redesign, or visual polish must use the
  Impeccable skill and follow its current project context, together with
  `shadcn` and `antislop-ui`.
- Bugs and failing checks go through `systematic-debugging` before any fix is
  proposed.
- Use `verification-before-completion` before saying a task is done, and
  report the commands you ran and their results.

## Knowledge Graph (graphify)

- When `graphify-out/graph.json` exists, run `graphify query "<question>"`
  before the first grep, search, or broad file read for a codebase question.
  Use `graphify path` and `graphify explain` for relationships and single
  concepts. Read raw files only for lines the graph already located.
- Put this rule in every subagent prompt that explores code.
- After code changes, run `graphify update .`. After doc or agent-note
  changes, run `/graphify . --update`.
- Refresh the graph after every change, whatever its size. In Claude Code the
  hooks in `.claude/settings.json` run `graphify update .` automatically at the
  end of each turn that edited files; other agents run it themselves.
- When a new agent or skill folder appears (like `.codex/`), add it to the
  excludes in `graphify-out/.graphify_build.json` so skill copies do not
  flood the graph.
- Never copy secrets, connection strings, or production data into the graph.

## Next.js

- This project runs Next.js 16.2. Read the relevant guide in
  `node_modules/next/dist/docs/` before writing Next.js code, and follow its
  deprecation notices over older habits.
- Confirm runtime behavior in the running app with `next-dev-loop`, not only
  with a successful build or typecheck.

## UI Components

### 1. Prioritize shadcn/ui

- Always use shadcn/ui components before writing custom markup.
- Before creating, revising, or redesigning UI, check the shadcn registry:

  ```powershell
  npx shadcn@latest list '@shadcn'
  npx shadcn@latest search '@shadcn' -q "<component-need>"
  ```

- In PowerShell, quote `'@shadcn'` so it is not interpreted as syntax.
- When a user supplies a UI reference, analyze its structure first, then find
  an equivalent with `npx shadcn@latest search` or `npx shadcn@latest docs`.
- If shadcn provides the component, import and use it; do not rebuild it from
  scratch. Custom components are allowed only when no suitable shadcn
  component exists.

### 2. Custom Components Must Be Reusable

- Custom components must accept props and must not hardcode one screen's data.
- Put them in the appropriate `@/components/` path with a descriptive name.
- Do not create one-off components that cannot be reused.

### 3. Do Not Add Manual Spacing to shadcn Components

- Do not add padding, gap, margin, or other spacing styles inside or between
  shadcn/ui components such as `Card`, `CardHeader`, `CardContent`,
  `CardFooter`, `Button`, `Input`, `Dialog`, or `Sheet`.
- Use a layout wrapper, for example `flex flex-col gap-4`, when sibling
  elements need separation. Do not override calibrated component spacing.

## Data Access

- Read data through `lib/services/` and the pools in `lib/db/pools.ts`. Do not
  open new `pg` clients or pools elsewhere.
- Both databases belong to other projects (`sparta-energy` owns DB 1,
  `smart-energy-meter-vps` owns DB 2). This app only reads them. Do not run
  `INSERT`, `UPDATE`, `DELETE`, or DDL against them.
- Use parameterized queries (`$1`, `$2`). Never interpolate request input
  into SQL.
- Keep the telemetry rules in `AI_CONTEXT.md` (Asia/Jakarta grouping, R/S/T
  phase normalization, energy delta with the rollover guard, latest recorded
  date as default). Do not hardcode dates, store codes, or branches as
  fallbacks.

## Prisma and Database Safety

- Use Prisma ORM for persistence; do not introduce a second ORM.
- Before any database-affecting Prisma command, ask whether the current
  connection is development or production and identify the target environment.
- Never run `prisma db push`, `prisma migrate dev`, or `prisma migrate deploy`.
- `prisma validate` and `prisma generate` are permitted because they do not
  mutate the configured database.

## Secrets

- Never commit `.env` or any file with credentials. Only `.env.example` with
  placeholders is tracked.
- Never put connection strings, passwords, tokens, or server IPs with
  credentials into docs, agent notes, commit messages, or the graph.

## Git Safety

- Never run `git commit --no-verify`. It bypasses the mandatory pre-commit
  task-note guard and is strictly prohibited.
- Do not bypass or disable Git hooks. Fix the missing task note instead.
