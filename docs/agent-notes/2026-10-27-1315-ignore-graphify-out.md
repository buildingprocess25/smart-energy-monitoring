# Ignore graphify-out

## Scope

Exclude the locally generated `graphify-out/` folder from git. No app code
changes.

## Context and Sources

`git status` showed `graphify-out/` as untracked. It holds graphify cache,
dated graph snapshots, and machine-specific config.

## Changed Files

- `.gitignore`: added `graphify-out/`.

## Decisions

The folder is kept on disk because the local graphify tooling uses it; it is
only ignored, not deleted.

## Verification

`git status --short` no longer lists `graphify-out/`.

## Remaining Work and Risks

None
