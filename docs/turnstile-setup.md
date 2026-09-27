# Turnstile setup

The contact inquiry form uses a Cloudflare Turnstile site key supplied through the deployment environment. Do not store the key in this repository.

The widget is rendered explicitly with the `contact` action and `execute` appearance. Because the Cloudflare widget itself is configured as Invisible, it has no visible form footprint.

## Environment

Set these values in local or production secrets:

```env
NEXT_PUBLIC_TURNSTILE_SITE_KEY=<site-key-from-cloudflare>
TURNSTILE_SECRET_KEY=...
TURNSTILE_HOSTNAMES=zypher-solutions.com,www.zypher-solutions.com
```

For local development, use:

```env
TURNSTILE_HOSTNAMES=localhost,127.0.0.1
```

Do not put the secret in a 'NEXT_PUBLIC_*' variable or commit it.

## Server verification

The existing '/api/contact' route sends the submitted token to Cloudflare's canonical Siteverify endpoint before any email delivery happens. A request is accepted only when Cloudflare returns:

- 'success: true';
- action 'contact';
- a hostname listed in 'TURNSTILE_HOSTNAMES'.

The frontend resets the widget after every submission attempt because Turnstile tokens are single-use.

If the public site key is missing in production, the form shows a temporary-unavailable message and keeps submission disabled. Local development may continue to use the documented development token path; that path is never accepted in production.
