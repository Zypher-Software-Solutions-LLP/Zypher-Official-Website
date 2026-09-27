# Production Readiness and Security Hardening Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to implement this plan. Apply `superpowers:test-driven-development` to every code change and `superpowers:verification-before-completion` before reporting completion.

**Goal:** Bring the Zypher website to a verifiable production baseline: all repository quality gates pass, public input boundaries fail safely, browser security controls are enforced, content and configuration are consistent, and deployment-only controls are documented and verified.

**Architecture:** Preserve the current Next.js App Router, feature-module structure, Sanity integration, Resend delivery, Cloudflare Turnstile, and Vercel deployment model. Harden existing boundaries instead of adding a parallel framework or new runtime dependency. Keep static rendering for the marketing site; do not force nonce-based dynamic rendering across the application.

**Tech Stack:** Next.js 16.3.5, React 19, strict TypeScript, CSS Modules, Zod, Vitest/Testing Library, Playwright/Axe, Sanity, Resend, Cloudflare Turnstile, Vercel.

**Spec:** Repository `AGENTS.md`, the repository audit performed on 2026-09-26, and current official provider documentation linked under References.

## Global Constraints

- Preserve the dirty working tree. Before each task, inspect the target file's current diff and merge narrowly; never replace unrelated user work.
- Do not add dependencies unless an existing platform/library cannot implement the requirement.
- Write a failing test first for each behavior change, then make the smallest production change that passes it.
- Do not weaken assertions or skip failing browser tests to obtain a green build.
- Keep secrets server-only and out of logs, error responses, source control, and public environment variables.
- Treat client-side validation as UX only; every public endpoint must enforce its own server-side schema and limits.
- Preserve static generation/ISR for public marketing pages. A strict nonce CSP would force dynamic rendering in Next.js, so this plan uses an enforced static-compatible CSP with a narrowly documented inline-script allowance.
- Do not claim production readiness until both code gates and the deployment checklist are complete.
- Do not commit unless the user explicitly asks. Keep each task commit-ready using the commit message shown.

## Review Focus

1. Confirm the canonical phone number before Task 6. The repository currently contains both `+91 80757 25045` and `+91 90757 25045`; the former is used in most locations and is the proposed canonical value.
2. Confirm whether Facebook should be removed until a real URL is provided. Current `href="#"` links are not acceptable in production.
3. Confirm Vercel is the production host. The WAF steps assume Vercel because the repository and documentation already target it.
4. Legal policy text must receive counsel/owner approval; code review cannot certify legal compliance.

---

## Audit Baseline

### Repository and tests

- The repository contains 63 Vitest unit/integration test files and 43 Playwright spec files, with approximately 357 declared tests.
- CI exists at `.github/workflows/ci.yml` and runs formatting, linting, type checking, unit tests, a production build, browser tests, accessibility tests, and `npm audit`.
- Latest verified unit baseline: 163/163 tests passed.
- Latest verified type-check baseline: passed.
- Latest verified lint baseline: passed.
- Latest verified production build baseline: passed.
- Latest verified dependency audit: 0 known npm vulnerabilities.
- Full Playwright baseline: 206 passed, 9 failed in 11 minutes. A targeted rerun left 8 deterministic failures and identified the Work filter failure as transient.
- `npm run format` currently fails on 10 tracked/untracked files. CI is therefore not green even before security changes.

### Deterministic browser blockers

1. Cookie consent intercepts pointer input in `tests/e2e/about-founders.spec.ts`.
2. Cookie consent lifecycle is unstable in `tests/e2e/services-ai-llm-automation-section-four.spec.ts`.
3. The homepage primary CTA has a serious WCAG 2 AA contrast failure on desktop and mobile: `#f4f8f6` over `#15c196` is 2.15:1, below 4.5:1 for 14px normal text.
4. The final homepage CTA test cannot obtain all mobile control geometry.
5. The AI capabilities CTA is 38px high while the tested touch target contract requires 40–44px.
6. The Solutions heading is incorrectly positioned at tablet widths.
7. The Solutions heading overflows the shared grid on smaller tablets.

### Security and operational findings

- Security headers exist, but CSP is report-only and omits required Cal.com sources.
- The unconfigured R2 CSP fallback allows broad `*.r2.dev` image hosts.
- The Sanity webhook does not enforce content type or an actual streamed body-size limit and uses a permissive custom payload guard.
- Draft-mode secrets are sent in query strings by design, but responses lack explicit no-store handling and equality is not constant-time.
- Production-critical environment variables are optional at build time, so a deployment can succeed with a non-functional contact form or CMS integration.
- The Turnstile client silently submits a local-development token when the public key is missing; in production the server rejects it, leaving a confusing user failure.
- Rate limiting is not enforceable from this repository alone. A deployment WAF rule is required for `/api/contact` and should be monitored before blocking.
- No route-level/global application error boundary was found.
- The web manifest references missing 192px and 512px icons.
- Contact phone numbers disagree across components; two Facebook links are placeholders.
- Cookie policy copy contains an unresolved editorial placeholder.
- `src/features/contact/ContactForm.tsx` appears unused and duplicates the live contact implementation.
- The embedded Studio is authenticated by Sanity, but its production exposure, indexing headers, and CSP behavior need an explicit policy.
- SEO/deployment tasks in `docs/seo.md` remain manual and incomplete: canonical-domain verification, legacy redirects, search-console submission, and production crawl checks.

---

## Task 1: Restore a Trustworthy Release Baseline

**Files:**

- Modify only the 10 files reported by `npm run format`.
- Modify `tests/e2e/about-founders.spec.ts`.
- Modify `tests/e2e/services-ai-llm-automation-section-four.spec.ts`.
- Modify the shared Playwright helper/fixture file discovered during implementation; if none exists, create `tests/e2e/support/consent.ts`.
- Modify the source/test files implicated by the remaining deterministic Playwright failures only after reproducing each one.

**Step 1: Capture the dirty-tree boundary**

Run:

```powershell
git status --short
git diff --name-only
git ls-files --others --exclude-standard
```

Record target-file diffs before editing. Do not stage, reset, or reformat unrelated files.

**Step 2: Fix formatting drift mechanically**

Run Prettier only over the ten reported paths, then run:

```powershell
npm.cmd run format
```

Expected: exit 0 without reformatting the entire dirty tree.

**Step 3: Stabilize consent setup in Playwright**

Create one helper that establishes a valid consent cookie before navigation or reliably dismisses the dialog after animations settle. Replace repeated ad hoc consent clicks in the two failing specs. Do not use `force: true`, arbitrary long sleeps, or hide the banner with test-only CSS.

Add/adjust a focused consent browser test proving:

- the banner appears for a new visitor;
- the selected consent persists after reload;
- the banner no longer intercepts unrelated controls after a choice.

**Step 4: Reproduce and fix each UI contract**

Work in this order:

1. `tests/e2e/accessibility.spec.ts` and the shared primary button CSS.
2. `tests/e2e/cta-responsive.spec.ts` and the final CTA component/CSS.
3. `tests/e2e/services-ai-llm-automation-section-three.spec.ts` and the corresponding CTA CSS.
4. `tests/e2e/solutions.spec.ts` and `src/features/home/solutions/SolutionsSection.module.css`.

For color contrast, choose a brand-approved foreground/background pair meeting WCAG AA in the default and hover states. Add a component-level assertion for the intended token/class and retain Axe as the browser-level proof.

**Step 5: Verify baseline**

Run:

```powershell
npm.cmd run format
npm.cmd run lint
npm.cmd run typecheck
npm.cmd test
npx.cmd playwright test tests/e2e/about-founders.spec.ts tests/e2e/accessibility.spec.ts tests/e2e/cta-responsive.spec.ts tests/e2e/services-ai-llm-automation-section-three.spec.ts tests/e2e/services-ai-llm-automation-section-four.spec.ts tests/e2e/solutions.spec.ts --project=chromium
```

Expected: all pass. If Work filtering fails again, investigate its state transition rather than adding retries.

**Commit-ready message:** `fix(ui): restore deterministic production test baseline`

---

## Task 2: Enforce Security Headers Without Breaking Static Rendering

**Files:**

- Create `src/lib/security/content-security-policy.ts`.
- Modify `next.config.ts`.
- Create `tests/config/security-headers.test.ts`.
- Create `tests/e2e/security-headers.spec.ts`.
- Modify `.env.example` only if a currently unused media hostname variable is removed or clarified.

**Step 1: Write failing policy tests**

Test a pure CSP builder for the following invariants:

- public routes receive `Content-Security-Policy`, not report-only;
- `default-src 'self'`, `object-src 'none'`, `base-uri 'self'`, `form-action 'self'`, and `frame-ancestors 'none'` exist;
- production adds `upgrade-insecure-requests`;
- Google analytics/tag-manager, Sanity, Cloudflare Turnstile, Google Maps, and Cal.com are present only in the directives they require;
- no wildcard `*.r2.dev` is emitted when R2 is unconfigured;
- a configured R2 hostname is normalized and added to `img-src` only;
- Studio receives a separately tested compatible policy or explicit scoped exception;
- API, draft-mode, and Studio responses receive `X-Robots-Tag: noindex, nofollow` where applicable.

**Step 2: Implement a centralized policy builder**

Export typed helpers used by `next.config.ts`. Keep `script-src 'unsafe-inline'` only because Next's static output and current provider scripts require it; document this trade-off beside the directive. Keep `style-src 'unsafe-inline'` for current CSS/provider behavior. Do not add `'unsafe-eval'` in production.

Do not implement per-request nonces: current Next.js guidance says nonce-based CSP forces dynamic rendering and disables static optimization/ISR for affected pages.

**Step 3: Add browser verification**

In `tests/e2e/security-headers.spec.ts`:

- request `/`, `/contact`, `/blog`, `/studio`, and one API route;
- assert header presence and route-specific directives;
- visit `/contact` and fail on CSP violation console messages;
- verify the Cal.com booking UI and Google Maps iframe are not blocked by policy.

**Step 4: Verify**

Run:

```powershell
npm.cmd test -- tests/config/security-headers.test.ts
npx.cmd playwright test tests/e2e/security-headers.spec.ts --project=chromium
npm.cmd run build
```

Expected: enforced CSP, no required provider breakage, and static routes remain statically generated where they are today.

**Commit-ready message:** `feat(security): enforce route-aware browser security policy`

---

## Task 3: Harden Public Request Boundaries

**Files:**

- Create `src/lib/http/read-bounded-body.ts`.
- Modify `src/app/api/contact/route.ts`.
- Modify `src/app/api/revalidate/sanity/route.ts`.
- Modify `tests/api/contact-route.test.ts`.
- Modify `tests/api/sanity-revalidate-route.test.ts`.

**Step 1: Test a bounded request-body reader**

Cover:

- accepted UTF-8 JSON under the limit;
- rejection based on an oversized `Content-Length` hint;
- rejection when a chunked/streamed body crosses the actual byte limit;
- malformed UTF-8/JSON handling;
- aborted/read errors mapped to a generic client-safe response.

**Step 2: Reuse it in the contact route**

Retain the existing strict Zod validation, Turnstile verification, generic error shape, and Resend service call. The refactor must preserve all current contact route tests.

**Step 3: Define a strict Sanity webhook schema**

Use Zod for the signed payload. Bound document type, IDs, slugs, and optional fields. Reject unknown/unsupported document types. Require JSON-compatible content type and a small explicit byte limit before signature/payload processing.

The webhook must:

- return a generic 400/401/413/415 response as appropriate;
- never log the signature, request body, author data, or content body;
- log only operation name, validated document type, and a correlation/request identifier;
- continue using Sanity's signature verification;
- revalidate only known tags/paths derived from validated values.

**Step 4: Add abuse-case tests**

Add tests for missing/wrong content type, oversized declared and streamed bodies, malformed JSON, malformed slug, unexpected keys, invalid signature, and a valid category/post/site-settings webhook.

**Step 5: Verify**

Run:

```powershell
npm.cmd test -- tests/api/contact-route.test.ts tests/api/sanity-revalidate-route.test.ts
npm.cmd run typecheck
npm.cmd run lint
```

**Commit-ready message:** `feat(security): bound and validate public request payloads`

---

## Task 4: Harden Draft Mode and Secret Comparisons

**Files:**

- Create `src/lib/security/secret-comparison.ts`.
- Modify `src/app/api/draft-mode/enable/route.ts`.
- Modify `src/app/api/draft-mode/disable/route.ts`.
- Create `tests/api/draft-mode-routes.test.ts`.

**Step 1: Write secret-comparison tests**

Cover equal values, unequal same-length values, unequal different-length values, empty values, and Unicode input. The helper must not throw or expose values.

**Step 2: Implement constant-time comparison**

Use the Node standard library (`crypto.timingSafeEqual`) with safe length handling. Do not add a dependency.

**Step 3: Harden route responses**

- require the configured secret;
- use the shared comparison helper;
- retain the local-path-only redirect validation;
- emit `Cache-Control: no-store, private` and `X-Robots-Tag: noindex, nofollow`;
- return generic unauthorized responses;
- avoid logging the query string.

**Step 4: Add route tests**

Test missing configuration, missing/invalid/valid secret, safe relative redirect, external/protocol-relative redirect rejection, draft cookie behavior, and cache/index headers.

**Step 5: Verify**

```powershell
npm.cmd test -- tests/api/draft-mode-routes.test.ts
npm.cmd run typecheck
```

**Commit-ready message:** `feat(security): harden draft-mode authorization`

---

## Task 5: Make Production Configuration Fail Safely

**Files:**

- Modify `src/lib/env.ts`.
- Modify `tests/lib/env.test.ts`.
- Modify `next.config.ts`.
- Modify `.env.example`.
- Modify `src/features/contact/TurnstileField.tsx`.
- Modify `src/features/contact/ContactInquirySection.tsx`.
- Modify `tests/features/contact-page.test.tsx`.
- Modify `docs/sanity-blog-webhook.md` and the production environment documentation discovered during implementation.

**Step 1: Add production-readiness validation tests**

Create a pure validator that reports all missing/unsafe production settings in one result. In production it must reject:

- localhost/non-HTTPS `NEXT_PUBLIC_SITE_URL`;
- missing Sanity project/dataset required by published blog routes;
- missing `SANITY_REVALIDATE_SECRET` and `SANITY_PREVIEW_SECRET`;
- missing Turnstile public/secret keys or allowed production hostnames;
- missing Resend API key or contact from/to addresses;
- malformed email/URL/hostname values;
- use of reserved Cloudflare test credentials in production.

Keep optional integrations explicitly optional only when the UI also degrades safely.

**Step 2: Wire deployment-time validation**

Invoke the validator from `next.config.ts` only for a production deployment signal such as `VERCEL_ENV === "production"` or an explicit `VALIDATE_PRODUCTION_ENV=true`. Keep local builds and CI deterministic by supplying documented test values when the validation flag is enabled.

Do not expose server secrets through `NEXT_PUBLIC_*` variables.

**Step 3: Fix missing Turnstile configuration UX**

In production, do not submit `local-development-token`. Render a clear temporary-unavailable message and disable submission until the widget is configured/ready. Preserve documented local development behavior.

**Step 4: Remove or wire dead variables**

Verify usage of `NEXT_PUBLIC_R2_MEDIA_BASE_URL`, `NEXT_PUBLIC_R2_MEDIA_HOSTNAME`, and `SANITY_STUDIO_PREVIEW_ORIGIN`. Remove unused entries from schema/example/docs or implement their intended use once, centrally. Do not keep misleading configuration.

**Step 5: Verify**

```powershell
npm.cmd test -- tests/lib/env.test.ts tests/features/contact-page.test.tsx
npm.cmd run typecheck
npm.cmd run build
```

Also run one build with production validation enabled and complete dummy non-secret values, plus one expected-failure build missing a required value. The failure must name variable keys, never values.

**Commit-ready message:** `feat(config): validate production integration settings`

---

## Task 6: Centralize Public Business Data and Remove Placeholders

**Files:**

- Create `src/lib/site-config.ts`.
- Modify `src/components/layout/Footer.tsx`.
- Modify `src/features/contact/ContactHeroSection.tsx`.
- Modify `src/features/contact/ContactInquirySection.tsx`.
- Modify every source file found by searching for the old phone variants, contact email, WhatsApp URL, and `href="#"` social links.
- Modify the cookie policy page/component found by searching for `[using our cookie settings`.
- Modify `tests/features/contact-phone.test.ts`.
- Add/modify footer and legal-copy tests.

**Step 1: Write consistency tests**

Test that all rendered phone links, WhatsApp links, and email links derive from one typed config object. Assert that no production social link is `#` or empty.

**Step 2: Confirm canonical values**

Before editing, obtain owner confirmation for the phone number and Facebook URL. Proposed fallback:

- canonical phone/WhatsApp: `+91 80757 25045` / `+918075725045`;
- remove Facebook entirely until a real profile URL is supplied.

**Step 3: Implement shared config**

Export display and URI-safe forms from one server/client-safe module. Do not read secret environment variables there.

**Step 4: Resolve policy placeholder**

Replace the literal editorial placeholder with the actual user action already present in the footer: use the “Cookie Settings” control to reopen consent preferences.

**Step 5: Remove duplicate dead contact form**

Prove `src/features/contact/ContactForm.tsx` has no imports with `rg`. Delete it only after tests cover the live form and the production build passes.

**Step 6: Verify**

```powershell
rg -n '90757|80757|href="#"|\[using our cookie settings' src
npm.cmd test -- tests/features/contact-phone.test.ts tests/features/contact-page.test.tsx
npm.cmd run build
```

Expected: no unapproved placeholders or inconsistent contact values.

**Commit-ready message:** `fix(content): centralize verified public business details`

---

## Task 7: Repair Metadata, Icons, Indexing, and Error Recovery

**Files:**

- Replace or modify `src/app/manifest.json` using a typed Next metadata route if appropriate for Next.js 16.
- Add valid 192px and 512px manifest icons under `public/`, or point the manifest to verified existing assets with correct dimensions and MIME types.
- Create `src/app/error.tsx`.
- Create `src/app/global-error.tsx` if required for root-layout failures.
- Create `tests/app/manifest.test.ts`.
- Create `tests/app/error-boundaries.test.tsx`.
- Modify `src/app/robots.ts` if route audit reveals inconsistent exclusions.

**Step 1: Write failing manifest tests**

Resolve each icon URL from the manifest to a real file. Verify declared dimensions, MIME types, app name, theme color, background color, start URL, and display mode.

**Step 2: Add safe error boundaries**

Error UI must:

- avoid exposing stack traces or internal messages;
- offer a retry action where supported and a link home;
- preserve accessible heading/focus behavior;
- log only a sanitized error identifier/message to the configured server/client observability path.

Do not introduce an observability vendor during this task. Document the integration point for deployment monitoring.

**Step 3: Test recovery UI**

Unit-test reset behavior and generic messaging. Add a small test-only fault route only if Playwright cannot verify the boundary without shipping public debug behavior; otherwise keep this at component/integration level.

**Step 4: Verify**

```powershell
npm.cmd test -- tests/app/manifest.test.ts tests/app/error-boundaries.test.tsx
npm.cmd run build
```

**Commit-ready message:** `fix(platform): add valid app metadata and safe error recovery`

---

## Task 8: Expand Security, Accessibility, and Integration Coverage

**Files:**

- Modify `tests/e2e/accessibility.spec.ts`.
- Modify `tests/e2e/contact-page.spec.ts`.
- Modify `playwright.config.ts`.
- Modify `.github/workflows/ci.yml`.
- Add deterministic provider mocks/helpers under `tests/e2e/support/`.

**Step 1: Expand accessibility route coverage**

Run Axe on representative desktop and mobile states for:

- `/`;
- `/services` and one nested service route;
- `/contact` before and after validation errors;
- `/blog` and one published article fixture/fallback;
- `/privacy-policy` and `/terms-of-use`;
- navigation and cookie dialogs when open.

Test keyboard navigation and visible focus for menu, consent, blog filters, article table of contents, and contact form controls.

**Step 2: Make external integrations deterministic**

Mock Cal.com and maps/provider network behavior in normal CI browser tests while verifying the application's script/iframe contract. Keep an optional, separately named live-provider smoke test that is not required for every PR and has explicit timeouts/failure reporting.

Never intercept or fake the application's own API behavior in the end-to-end contact submission test; test the route separately with controlled Turnstile/Resend service mocks and retain one deployment smoke test.

**Step 3: Improve CI signal**

- add workflow concurrency with cancellation for superseded branch runs;
- avoid running the same accessibility cases twice if full E2E already includes them;
- retain `npm ci`, format, lint, typecheck, unit, build, browser, accessibility, and audit gates;
- upload Playwright reports/traces only on failure, with short retention;
- keep workflow permissions minimal (`contents: read`).

Do not add blanket Playwright retries locally. At most use one CI retry after deterministic failures are fixed, with traces retained for the retry.

**Step 4: Verify**

```powershell
npm.cmd run test:e2e -- --project=chromium
npm.cmd run test:accessibility
```

Expected: all cases pass twice consecutively to establish stability.

**Commit-ready message:** `test(release): expand deterministic production quality gates`

---

## Task 9: Production Deployment Controls and Runbook

**Files:**

- Create `docs/production-readiness.md`.
- Update `docs/seo.md`.
- Update `docs/sanity-blog-webhook.md`.
- Update `README.md` if it is the canonical deployment entry point.
- Optionally add `.github/dependabot.yml` after confirming update cadence with the owner.

**Step 1: Document the environment matrix**

For local, preview, and production, list variable names, purpose, whether public/server-only, and owning provider. Never include real values.

Include rotation procedures for:

- Resend API key;
- Turnstile secret;
- Sanity read token, preview secret, and webhook secret;
- any Vercel deployment tokens outside this repository.

**Step 2: Configure and verify WAF rate limiting**

In Vercel Firewall, create a rule matching `POST /api/contact`. Start with Log mode, inspect legitimate traffic, then enforce a fixed-window rate limit using IP and JA4 where available. A reasonable initial candidate is 5 successful attempts per 10 minutes per source, but production traffic must determine the final threshold.

Document:

- exact path/method conditions;
- counting key and window;
- 429 action;
- alert owner;
- rollback procedure;
- evidence screenshot/export and verification date.

Also monitor/rate-limit the Sanity webhook only if its signed delivery pattern and provider source behavior permit it without dropping legitimate retries.

**Step 3: Complete provider controls**

- Turnstile: restrict widget hostnames and verify server-side `action` and `hostname` checks.
- Resend: verify the sending domain, SPF, DKIM, and DMARC; confirm the From address is authorized.
- Sanity: configure the signed webhook, least-privilege token, preview origin, and secret rotation.
- Vercel: enable production deployment protection appropriate to the plan, WAF monitoring, and alerting/log drains if available.
- DNS/TLS: verify HTTPS redirect, certificate coverage, HSTS behavior, and canonical host.

**Step 4: Complete SEO and legal operations**

- define and test legacy URL redirects;
- verify canonical URLs, robots, sitemap, Open Graph, and structured data on the deployed domain;
- submit sitemap to Google Search Console and Bing Webmaster Tools;
- run a production crawl for broken links and accidental noindex;
- obtain owner/legal approval for privacy, cookie, and terms copy, including Cal.com, analytics, Sanity, Resend, and Turnstile disclosures.

**Step 5: Define operations and rollback**

Document health checks, contact-delivery alerting, Sanity webhook failure monitoring, log retention/PII rules, backup/export ownership, incident contacts, deployment rollback, and a quarterly dependency/secret review.

**Commit-ready message:** `docs(ops): add production security and release runbook`

---

## Task 10: Final Release Verification

**Files:** No planned source changes. Any failure reopens its owning task.

**Step 1: Inspect the final diff**

```powershell
git status --short
git diff --check
git diff --stat
```

Confirm no unrelated files, secrets, debug logs, skipped tests, `.only`, generated build artifacts, or placeholder values were introduced.

**Step 2: Run all code gates from a clean process**

```powershell
npm.cmd run format
npm.cmd run lint
npm.cmd run typecheck
npm.cmd test
npm.cmd run build
npm.cmd run test:e2e -- --project=chromium
npm.cmd run test:accessibility
npm.cmd audit --audit-level=high
```

Expected:

- formatting, lint, and typecheck: exit 0;
- all Vitest and Playwright tests: pass;
- production build: pass with expected route rendering modes;
- audit: no high/critical vulnerabilities (the current baseline is zero vulnerabilities).

**Step 3: Verify deployed behavior**

Against the production candidate URL:

- inspect response headers for public, Studio, API, and draft routes;
- submit one valid and several invalid contact requests without exposing provider errors;
- verify WAF 429 behavior using an approved test source;
- publish/update a Sanity test post and confirm signed webhook revalidation;
- verify preview enable/disable behavior;
- run Lighthouse/Axe and a link crawl;
- verify analytics consent behavior and cookie preference reopening;
- verify email delivery, Reply-To, SPF/DKIM/DMARC alignment, and no PII in logs.

**Step 4: Sign off**

Record:

- commit/deployment SHA;
- verification date and verifier;
- test counts and reports;
- unresolved risks with owner and deadline;
- WAF/provider/legal/SEO checklist status.

Only mark the site production-ready when every code gate passes and every deployment control is either verified or explicitly accepted as a documented risk by the owner.

**Commit-ready message:** `chore(release): verify production readiness baseline`

---

## References

- Next.js CSP guidance: <https://nextjs.org/docs/app/guides/content-security-policy>
- Cloudflare Turnstile server validation: <https://developers.cloudflare.com/turnstile/get-started/server-side-validation/>
- Cloudflare Turnstile hostname management: <https://developers.cloudflare.com/turnstile/additional-configuration/hostname-management/>
- Vercel WAF rate limiting: <https://vercel.com/docs/vercel-firewall/vercel-waf/rate-limiting>
- Vercel Firewall overview: <https://vercel.com/docs/vercel-firewall>
