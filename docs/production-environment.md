# Production environment

The application validates the production deployment configuration when either of these deployment signals is present:

- `VERCEL_ENV=production`
- `VALIDATE_PRODUCTION_ENV=true`

Local development and ordinary CI builds do not require production credentials. To validate a deployment configuration locally, copy the values from the deployment provider into a protected environment and set `VALIDATE_PRODUCTION_ENV=true`.

## Required production variables

```text
NEXT_PUBLIC_SITE_URL=https://zypher-solutions.com
NEXT_PUBLIC_SANITY_PROJECT_ID=<sanity-project-id>
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_PREVIEW_SECRET=<at-least-32-character-random-secret>
SANITY_REVALIDATE_SECRET=<different-at-least-32-character-random-secret>
NEXT_PUBLIC_TURNSTILE_SITE_KEY=<live-turnstile-site-key>
TURNSTILE_SECRET_KEY=<live-turnstile-secret-key>
TURNSTILE_HOSTNAMES=zypher-solutions.com,www.zypher-solutions.com
RESEND_API_KEY=<resend-api-key>
CONTACT_TO_EMAIL=info@zypher-solutions.com
CONTACT_FROM_EMAIL=website@zypher-solutions.com
```

Production validation rejects localhost URLs, non-HTTPS site URLs, malformed hostnames/emails, missing credentials, short Sanity secrets, and Cloudflare Turnstile test credentials. The allowed Turnstile hostnames must be the actual public hostnames configured in the Turnstile widget.

## Optional variables

```text
NEXT_PUBLIC_GTM_ID=<google-tag-manager-id>
NEXT_PUBLIC_R2_MEDIA_HOSTNAME=<public-r2-image-hostname>
SANITY_API_READ_TOKEN=<only-for-private-sanity-datasets>
```

`NEXT_PUBLIC_R2_MEDIA_HOSTNAME` is used to allow that exact image host in Next Image and the Content Security Policy. `NEXT_PUBLIC_R2_MEDIA_BASE_URL` is not used by the application and should not be configured. `SANITY_STUDIO_PREVIEW_ORIGIN` is also not read by the application; Studio preview uses the signed draft-mode route instead.

Never prefix server secrets with `NEXT_PUBLIC_`. Do not commit `.env`, deployment exports, API keys, webhook secrets, or Turnstile secrets.
