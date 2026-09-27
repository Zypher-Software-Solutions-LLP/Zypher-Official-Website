# Resend contact-form setup

The contact form sends server-side through Resend. The API key is never exposed to the browser.

## 1. Verify the sending domain

In Resend, add 'zypher-solutions.com' under Domains and add the DNS records Resend provides at the domain DNS provider. The sender address must use that verified domain.

Recommended sender:

```text
website@zypher-solutions.com
```

## 2. Configure environment variables

Copy '.env.example' to '.env.local' for local development, then set:

```env
RESEND_API_KEY=re_...
CONTACT_FROM_EMAIL=website@zypher-solutions.com
CONTACT_TO_EMAIL=info@zypher-solutions.com
```

Use the same variables in the production hosting provider. Never commit '.env.local' or place 'RESEND_API_KEY' in a 'NEXT_PUBLIC_*' variable.

If Turnstile is enabled in production, also set:

```env
NEXT_PUBLIC_TURNSTILE_SITE_KEY=...
TURNSTILE_SECRET_KEY=...
```

## 3. Test the submission

Start the app, submit the Contact form, and verify:

- the UI shows the success message;
- the email appears in Resend Logs;
- the message arrives at 'CONTACT_TO_EMAIL';
- replying to the email goes to the visitor's submitted address.

The route returns a generic delivery error to visitors and logs only a request ID server-side.
