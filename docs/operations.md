# Operations

## Environments

Local, Preview, and Production each use separate credentials. Secrets remain in the deployment
provider and local `.env.local`; they are never committed.

## Contact endpoint

Configure a Vercel WAF fixed-window rate limit on `POST /api/contact`. Cloudflare Turnstile is
validated server-side. Resend requests use an idempotency key.

## CSP

The initial policy is report-only while GTM, Sanity, R2, Turnstile, and Resend origins are verified.
It must be enforced before the production domain cutover.

## Dependency hygiene

The root package manifest pins scoped npm overrides for the vulnerable transitive `js-yaml`,
`smol-toml`, `adm-zip`, and `uuid` packages used by the Sanity CLI toolchain. Keep these overrides
until the upstream dependency ranges resolve to patched releases, and run `npm audit` before every
production release.
