# Operations

## Environments

Local, Preview, and Production each use separate credentials. Secrets remain in the deployment
provider and local `.env.local`; they are never committed.

## Contact endpoint

Configure a Vercel WAF fixed-window rate limit on `POST /api/contact`. Cloudflare Turnstile is
validated server-side. Resend requests use an idempotency key.

## CSP

The application emits an enforced, static-compatible Content Security Policy. It
allows only the provider origins currently required by GTM, Sanity, R2, Turnstile,
Google Maps, and Cal.com; an unconfigured R2 host is never widened to a wildcard.
The policy retains narrowly scoped inline script/style allowances required by the
current static Next.js/provider integration. Review the policy after any provider
or analytics change.

## Dependency hygiene

The root package manifest pins scoped npm overrides for the vulnerable transitive `js-yaml`,
`smol-toml`, `adm-zip`, and `uuid` packages used by the Sanity CLI toolchain. Keep these overrides
until the upstream dependency ranges resolve to patched releases, and run `npm audit` before every
production release.
