# Ignore Scratch Files and Update Gitignore

## Scope

Add scratch files pattern to `.gitignore` to prevent test scripts from being tracked by Git, and create a task note for staging.

## Context and Sources

- `.gitignore`
- Git pre-commit task note guard `scripts/check-agent-task-note.mjs`

## Changed Files

- `.gitignore`: Added `scratch*` pattern.

## Decisions

- Excluded all scratch files starting with `scratch` from Git tracking.

## Verification

- Verified `scripts/check-agent-task-note.mjs` requirement.

## Remaining Work and Risks

- None.
