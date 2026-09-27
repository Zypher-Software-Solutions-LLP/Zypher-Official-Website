# Production readiness runbook

This runbook is the release gate for the Zypher marketing site. It complements
the repository checks; it does not replace provider dashboards, DNS verification,
or owner/legal approval.

## Release gates

Before a production deployment, the release owner must confirm:

- `npm ci`, formatting, linting, type checking, unit tests, production build,
  Chromium browser tests, accessibility tests, and `npm audit --audit-level=high`
  pass in CI.
- The production environment validation is enabled with `VERCEL_ENV=production`
  or `VALIDATE_PRODUCTION_ENV=true`.
- The deployed public site, Studio, API, and draft-mode routes return the
  expected security and indexing headers.
- Vercel WAF protection is enabled for the contact endpoint and its test evidence
  is attached to the release record.
- Turnstile, Resend, Sanity, DNS/TLS, analytics consent, and legal/SEO checks
  below are complete or explicitly accepted as risks by the owner.

## Environment matrix

Use separate values for local development, preview, and production. Store values
in the deployment provider or a protected local `.env.local`; never commit them.

| Variable                         | Purpose                                   | Exposure    | Local                        | Preview                | Production owner          |
| -------------------------------- | ----------------------------------------- | ----------- | ---------------------------- | ---------------------- | ------------------------- |
| `NEXT_PUBLIC_SITE_URL`           | Canonical absolute URL                    | Public      | `http://localhost:3000`      | Preview URL            | Deployment owner          |
| `NEXT_PUBLIC_SANITY_PROJECT_ID`  | Sanity project                            | Public      | Project ID                   | Same project           | CMS owner                 |
| `NEXT_PUBLIC_SANITY_DATASET`     | Published dataset                         | Public      | `production` or test dataset | Preview policy         | CMS owner                 |
| `SANITY_API_READ_TOKEN`          | Private dataset reads, only when required | Server-only | Optional                     | As required            | CMS owner                 |
| `SANITY_PREVIEW_SECRET`          | Draft-mode authorization                  | Server-only | Long random value            | Unique value           | CMS owner                 |
| `SANITY_REVALIDATE_SECRET`       | Signed Sanity webhook                     | Server-only | Long random value            | Unique value           | CMS owner                 |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | Browser Turnstile widget                  | Public      | Optional local fallback      | Preview widget key     | Security/deployment owner |
| `TURNSTILE_SECRET_KEY`           | Turnstile server verification             | Server-only | Optional local fallback      | Preview secret         | Security/deployment owner |
| `TURNSTILE_HOSTNAMES`            | Allowed Turnstile hostnames               | Server-only | `localhost,127.0.0.1`        | Preview hostnames      | Security/deployment owner |
| `RESEND_API_KEY`                 | Contact email delivery                    | Server-only | Protected local key          | Preview key            | Email owner               |
| `CONTACT_TO_EMAIL`               | Contact inbox                             | Server-only | Test/real inbox              | Preview inbox          | Business owner            |
| `CONTACT_FROM_EMAIL`             | Verified sender                           | Server-only | Verified sender              | Verified sender        | Email owner               |
| `NEXT_PUBLIC_GTM_ID`             | Optional analytics container              | Public      | Optional                     | Optional               | Marketing owner           |
| `NEXT_PUBLIC_R2_MEDIA_HOSTNAME`  | Optional exact image host allowlist       | Public      | Optional                     | Optional               | Infrastructure owner      |
| `VALIDATE_PRODUCTION_ENV`        | Explicit production validation switch     | Server-only | `false`                      | `false` unless testing | Deployment owner          |

`NEXT_PUBLIC_R2_MEDIA_BASE_URL` and `SANITY_STUDIO_PREVIEW_ORIGIN` are not read
by the application and should not be configured. Do not place server secrets in
`NEXT_PUBLIC_*` variables.

## Secret rotation

Rotate one provider at a time, verify the replacement, then revoke the previous
credential. Record the date, owner, and deployment SHA without recording secret
values.

### Resend

1. Create a replacement API key with the minimum required sending scope.
2. Update `RESEND_API_KEY` in the deployment provider and redeploy.
3. Submit a controlled contact request and verify delivery in Resend Logs.
4. Revoke the old key after the new deployment is verified.

### Cloudflare Turnstile

1. Create or rotate the server secret in the Turnstile dashboard.
2. Confirm the widget hostname list contains only the production and approved
   preview hostnames.
3. Update `TURNSTILE_SECRET_KEY` and redeploy.
4. Submit one valid form and one invalid-token request; verify the invalid request
   is rejected before email delivery.

### Sanity

1. Create a new `SANITY_API_READ_TOKEN` only when a private dataset requires it,
   with the least privilege needed for published reads.
2. Generate new independent values for `SANITY_PREVIEW_SECRET` and
   `SANITY_REVALIDATE_SECRET` when rotating preview or webhook authorization.
3. Update the application deployment first, then update the Sanity webhook secret
   for revalidation.
4. Verify draft mode and a signed publish/update webhook before revoking old
   values. See [Sanity webhook setup](sanity-blog-webhook.md).

### Vercel tokens

Vercel deployment, CLI, and integration tokens are provider-owned credentials.
Rotate them in Vercel, update the CI/deployment secret store, test one deployment,
then revoke the old token. They must never appear in this repository or build logs.

## Vercel WAF controls

The application cannot enforce an IP rate limit by itself because instances are
distributed. Configure this in Vercel Firewall/WAF:

1. Match `POST` requests to `/api/contact`.
2. Start in Log mode and inspect legitimate traffic and false positives.
3. Use a fixed window and count by source IP; add JA4 when it is available in the
   selected Vercel plan and traffic model.
4. Begin with a candidate of 5 successful attempts per 10 minutes per source.
   The release owner must tune this using observed traffic before enforcing it.
5. Enforce with a `429` response and alert on spikes, repeated blocks, and delivery
   failures.
6. Record the rule export or screenshot, threshold, date, alert owner, and rollback
   procedure in the release record.

To roll back, disable enforcement or return the rule to Log mode, investigate the
source and delivery logs, and preserve the application-side Turnstile and Zod
validation. Apply the same review to the Sanity webhook only if signed provider
retries and source behavior are understood.

## Provider and platform checks

- **Turnstile:** production hostname restrictions are configured; the server checks
  `success`, action `contact`, and an allowed hostname.
- **Resend:** the sending domain is verified and SPF, DKIM, and DMARC are aligned;
  `CONTACT_FROM_EMAIL` is on that domain.
- **Sanity:** the signed webhook targets `/api/revalidate/sanity`, uses the payload
  documented in [Sanity webhook setup](sanity-blog-webhook.md), and the Studio is
  protected by Sanity authentication and noindex headers.
- **Vercel:** production deployment protection, WAF logs, alerts, and any log drain
  are enabled according to the plan and owner policy.
- **DNS/TLS:** the canonical host redirects to HTTPS, the certificate covers every
  approved hostname, and HSTS is present on production responses.
- **Error monitoring:** the error boundaries emit only sanitized event identifiers
  and digest values. Connect those events to the approved observability system
  during deployment; no vendor is bundled into this repository.

## SEO, legal, and analytics checks

- Verify canonical URLs, sitemap, robots rules, Open Graph metadata, JSON-LD, and
  structured data against the production hostname.
- Submit the production sitemap to Google Search Console and Bing Webmaster Tools.
- Crawl the deployed site for broken links and accidental `noindex` responses.
- Confirm analytics and marketing cookies are blocked until consent and that the
  Cookie Settings control reopens preferences.
- Obtain owner/legal approval for privacy, cookie, and terms copy, including the
  Sanity, Resend, Turnstile, Cal.com, maps, and analytics disclosures.

## Incident response and rollback

- Contact delivery failure: inspect the request ID and Resend delivery logs without
  logging form contents; roll back the last deployment if the failure is code-related.
- Sanity freshness failure: inspect signed webhook status and Next.js revalidation
  responses; use a manual redeploy only as a temporary recovery.
- Abuse spike: move the WAF rule to enforcement or tighten it after confirming the
  source pattern; never disable server-side validation.
- Security incident: rotate affected provider secrets, preserve provider audit logs,
  notify the owner, and deploy the smallest reviewed fix.

Retain only the operational data needed for debugging. Do not retain contact form
contents, tokens, signatures, or secrets in application logs.

## Release record

Record the following with each production release:

- deployment SHA, date, and verifier;
- CI run and Playwright/accessibility report links;
- WAF rule evidence and current threshold;
- provider verification results;
- unresolved risks, owner, and deadline;
- rollback decision and last known good deployment.
