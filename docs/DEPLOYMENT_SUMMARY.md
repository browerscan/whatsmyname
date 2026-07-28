# Cloudflare Workers deployment summary

## Production route

- Canonical domain: `https://whatismyname.org`
- Worker: `whatsmyname`
- Build adapter: OpenNext for Cloudflare
- Runtime entry: `.open-next/worker.js`
- Static assets: `.open-next/assets`
- Deployment workflow: `.github/workflows/deploy.yml`

The production workflow runs on pushes to `main` and may also be started with
`workflow_dispatch`. It installs from `pnpm-lock.yaml`, runs lint, typecheck,
tests, builds the OpenNext Worker, and deploys through Wrangler.

## Required GitHub Actions secrets

- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`
- `WHATSMYNAME_API_KEY`
- `GOOGLE_CUSTOM_SEARCH_API_KEYS`
- `GOOGLE_CUSTOM_SEARCH_CX`
- `OPENROUTER_API_KEY`
- `OPENROUTER_MODEL`

Secret values must never be written to this repository, documentation, logs, or
deployment summaries. Store and rotate them only in the approved account or
GitHub Actions secret surfaces.

## Validation

Before deployment:

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
pnpm build:cloudflare
```

After deployment, verify the exact public domain in a browser. HTTP checks are
supporting evidence and should cover the homepage, `/api/health`, legal pages,
security headers, and any release-specific public asset such as `/ads.txt`.

## Manual fallback

The normal production route is GitHub Actions. A direct Wrangler deployment is
allowed only when the exact Cloudflare account, production environment, scoped
token source, and write intent have been verified without exposing credentials.
