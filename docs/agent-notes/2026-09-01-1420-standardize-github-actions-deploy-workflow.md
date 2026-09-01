# Standardize GitHub Actions Deploy Workflow

## Scope

Standardize the Dokploy CI/CD GitHub Actions workflow for `smart-energy-monitoring` to align with the ecosystem conventions (`sparta-energy` and `Smart-Energy-Meter-Vps`).

## Context and Sources

- `.github/workflows/deploy.yml`
- Workflow patterns from `sparta-energy` and `Smart-Energy-Meter-Vps`
- GitHub Container Registry (GHCR) lowercase naming constraints

## Changed Files

- `.github/workflows/deploy.yml`: Updated workflow to lowercase repository names, support both `main` and `master` branches, add Buildx setup, dual tag (`:latest` and `:${{ github.sha }}`), and trigger `${{ secrets.DOKPLOY_WEBHOOK }}`.

## Decisions

- Renamed the webhook secret reference from `DOKPLOY_WEBHOOK_URL` to `DOKPLOY_WEBHOOK` for consistency across all three projects in the ecosystem.
- Added lowercase transformation (`${GITHUB_REPOSITORY,,}`) to prevent GHCR image push failures if repository names contain uppercase characters.

## Verification

- Validated YAML syntax against GitHub Actions schema.
- Confirmed secrets naming alignment with Dokploy deployment pattern.

## Remaining Work and Risks

- None. Ensure `DOKPLOY_WEBHOOK` repository secret is configured in the GitHub repository settings.
