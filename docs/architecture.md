# Frontend architecture

## Purpose

This repository is a Next.js marketing site. The cleanup keeps the existing routes, content, responsive geometry, analytics events, and API contracts intact while making ownership boundaries explicit.

## Audit baseline

The architecture audit captured these baseline facts before the cleanup:

- The route, shared UI, feature, integration, validation, and test layers were already present, so a rewrite was unnecessary.
- src/styles/globals.css was 3,453 lines and owned nearly every visual module.
- Production build, strict TypeScript, formatting, 33 unit tests, and dependency audit passed.
- Lint failed in ScaleSection.tsx; homepage accessibility checks reported FAQ contrast and heading-order issues.
- Playwright specs duplicated desktop/mobile projects, relied on CSS classes, and were sensitive to parallel navigation.
- The CSS payload was 73.3 KB raw and 14.1 KB gzip.
- There were no repository commits or CI workflow.

The initial cleanup baseline is commit 7c32a63 (chore(repo): establish website baseline).

## Ownership rules

- src/app/ contains route composition and route handlers only.
- src/components/layout/ owns shared Header and Footer markup plus their CSS Modules.
- src/components/ui/ owns reusable controls such as ButtonLink plus their CSS Modules.
- src/features/home/ owns homepage sections. Each section directory owns its component, data, interaction logic, and CSS Module.
- src/integrations/ contains only real external-provider seams.
- src/lib/ contains shared pure utilities, validation, SEO, consent, and schema helpers.
- src/styles/globals.css contains Tailwind import, theme tokens, reset/accessibility defaults, global layout utilities, and reduced-motion behavior only.
- CSS Module class names are private. Browser tests use roles, ARIA state, and explicit data-testid/data-state attributes.

## Stable browser interface

The stable test interface is semantic:

- Navigation uses accessible roles and labels.
- Active/open/visible states use aria-current, aria-expanded, aria-hidden, or data-state.
- Geometry-sensitive regions expose explicit data-testid attributes.
- One Chromium Playwright project runs serially. Responsive checks set their own viewports, covering 390, 768, 1024, 1440, and 3840 pixels where applicable.
- Cookie consent is handled by tests/e2e/helpers/site.ts.

## Styling and responsive invariants

- Tailwind remains available for simple page-level utilities.
- Custom styling uses colocated CSS Modules with camelCase class names.
- No Sass, CSS-in-JS, class-name library, or styling dependency is required.
- next/font/local owns the local General Sans faces, with regular 400, medium 500, semibold 600, and bold 700 weights.
- Supported remote images use Next Image optimization through the configured media host patterns.
- Section geometry and approved responsive layouts remain authoritative at 390, 768, 1024, 1440, and 3840 pixels.

## Production seams

- Sanity query failures return the existing safe empty/null fallbacks and emit structured sanity_query_failed records.
- Turnstile verification has a bounded 10-second upstream timeout.
- Contact delivery errors return the existing generic response and are covered for invalid JSON, oversized payloads, validation errors, failed verification, successful delivery, and provider failure.
- CSP remains report-only during development. Enforce and validate the CSP before production cutover.
- Contact rate limiting remains a deployment concern and must be configured and verified with the Vercel WAF during launch preparation.

## Quality gates

CI runs with Node 22.13+ and npm ci:

- formatting
- lint
- strict TypeScript
- unit tests
- production build
- serial Chromium E2E
- accessibility
- npm audit --audit-level=high

globals.css must remain below 250 lines and must not contain Header, Footer, ButtonLink, or homepage-section selectors.
