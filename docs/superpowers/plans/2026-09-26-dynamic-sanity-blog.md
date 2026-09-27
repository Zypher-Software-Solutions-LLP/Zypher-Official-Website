# Dynamic Sanity Blog and SEO Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement a fully dynamic, server-rendered Sanity blog with the newest published post as the hero, immediate signed-webhook revalidation, repaired Studio routing, and complete article SEO.

**Architecture:** Keep Sanity access in the existing integration layer and expose typed server query functions to the App Router blog pages. Use clean server-rendered listing/category/page routes, tagged Next.js data caching, and a signed `/api/revalidate/sanity` route handler that expires affected tags immediately. Preserve the existing visual components while replacing placeholders with Sanity-backed data.

**Tech Stack:** Next.js 16 App Router, React Server Components, TypeScript strict mode, `next-sanity` 13, Sanity 6, GROQ, Next metadata/sitemap APIs, Vitest, Playwright.

**Spec:** `docs/superpowers/specs/2026-09-26-dynamic-sanity-blog-design.md`

## Global Constraints

- Preserve unrelated dirty worktree changes.
- Do not create or publish CMS content.
- Use `basePath: "/studio"` for the embedded Studio.
- Use `BLOG_PAGE_SIZE = 8` and exclude the current hero post before pagination totals are calculated.
- Public queries filter to `defined(publishedAt)`, `publishedAt <= now()`, and valid slugs; drafts are preview-only.
- Use `revalidateTag(tag, { expire: 0 })` in the external webhook route.
- No new dependency unless the installed packages cannot satisfy the requirement.
- No secrets in source, logs, responses, HTML, or client bundles.

## Review Focus

- A slug change must invalidate both old and new article cache tags; webhook tests cover this in Task 4.
- A future-dated or malformed Sanity document must not become the hero or a listing item; query tests cover this in Task 2.
- Empty Sanity data and a Sanity query failure must produce distinguishable controlled states; page tests cover this in Task 3.
- Metadata and sitemap generation must not accidentally expose drafts or sort variants; SEO tests cover this in Task 5.
- A webhook must not revalidate on invalid signatures or unsupported methods; API tests cover this in Task 4.

### Task 1: Studio and Environment Foundations

**Files:**

- Modify: `sanity.config.ts`
- Modify: `src/lib/env.ts`
- Modify: `.env.example`
- Test: `tests/e2e/studio.spec.ts`

**Interfaces:**

- Produces Studio `basePath: "/studio"` and server-only `SANITY_REVALIDATE_SECRET` configuration for later tasks.

- [ ] **Step 1: Write the failing Studio/config tests**
  - Assert the exported Sanity config has `basePath === "/studio"`.
  - Assert environment parsing exposes `SANITY_REVALIDATE_SECRET` without a `NEXT_PUBLIC_` name.
  - Add an authenticated/route-level browser assertion that the Studio page does not render `Tool not found: studio` when the Studio shell is available.
- [ ] **Step 2: Run the focused tests to verify the expected failures**
  - Run: `npx vitest run tests/lib/env.test.ts` if the environment test file exists, plus `npx playwright test tests/e2e/studio.spec.ts --project=chromium` when the browser fixture is available.
  - Expected: the config assertion fails because `basePath` is absent; the browser assertion reproduces the current Studio route issue in the authenticated fixture or is skipped only when authentication is unavailable.
- [ ] **Step 3: Implement the minimal configuration changes**
  - Add `basePath: "/studio"` to `sanity.config.ts`.
  - Add `SANITY_REVALIDATE_SECRET` to the server-only environment schema and `.env.example` with no real value.
  - Do not change existing public environment names or preview behavior.
- [ ] **Step 4: Run focused verification**
  - Run the config/environment unit tests and the Studio browser test.
  - Expected: all focused assertions pass; no tool-name error appears in the Studio route.
- [ ] **Step 5: Record the task result**
  - Record the test commands and result in the SDD ledger. Keep changes uncommitted because the checkout contains broad pre-existing user changes unless staging can be proven to include only this task.

### Task 2: Typed Sanity Client, Tags, Schemas, and Queries

**Files:**

- Modify: `src/integrations/cms/sanity/client.ts`
- Modify: `src/integrations/cms/sanity/queries.ts`
- Modify: `src/integrations/cms/sanity/types.ts`
- Modify: `sanity/schemaTypes/blogPost.ts`
- Modify: `sanity/schemaTypes/author.ts`
- Modify: `sanity/schemaTypes/category.ts`
- Modify: `sanity/schemaTypes/siteSettings.ts` only when publisher fields are missing
- Create: `src/integrations/cms/sanity/cache-tags.ts`
- Test: `tests/integrations/sanity-queries.test.ts`

**Interfaces:**

- Produces `getLatestPublishedPost(): Promise<BlogQueryResult<BlogPostSummary | null>>`.
- Produces `getPaginatedBlogPosts(input: BlogPostsQuery): Promise<BlogQueryResult<PaginatedBlogPosts>>`.
- Produces `getBlogCategories(): Promise<BlogQueryResult<BlogCategory[]>>`.
- Produces `getBlogPost(slug: string, options?: SanityQueryOptions): Promise<BlogQueryResult<BlogPostDetail | null>>`.
- Produces `getBlogPostSlugs()` and `getBlogSitemapEntries()` with typed results.
- Produces centralized tags for global blog, list, categories, settings, and slug-specific article data.

- [ ] **Step 1: Write failing query/type tests**
  - Use the repository's existing Sanity client mock boundary.
  - Assert latest-post GROQ/query options use published perspective, exclude future dates, order by `publishedAt desc` and `_createdAt desc`, and return typed data.
  - Assert malformed documents are excluded and the hero id is removed before pagination counts/slices.
  - Assert category filtering and `sort: "oldest"` behavior.
  - Assert missing client/configuration, query failure, and valid empty data have distinct result states.
  - Assert every public query supplies its expected cache tags.
- [ ] **Step 2: Run the query tests to verify they fail**
  - Run: `npx vitest run tests/integrations/sanity-queries.test.ts`.
  - Expected: missing exports/types/options and absent cache-tag behavior cause failures.
- [ ] **Step 3: Implement typed data access**
  - Migrate the Sanity client construction to the installed `next-sanity` client export and pass Next tag options through the supported fetch options.
  - Add typed image URL/dimension data and typed Portable Text-compatible body data without `any`.
  - Add explicit query result/error states while retaining sanitized structured server logging.
  - Define `BLOG_PAGE_SIZE = 8`, centralize tag names, and implement all required queries.
  - Apply all published/future/slug filters in GROQ and exclude the supplied hero id before counting listing pages.
- [ ] **Step 4: Strengthen Sanity authoring validation**
  - Make title, unique slug, excerpt, author, category, featured image/alt, publication date, and body required for publishable blog posts.
  - Require author name and category title/slug.
  - Add only the minimum site-settings publisher fields needed by structured data if absent.
- [ ] **Step 5: Run focused verification**
  - Run: `npx vitest run tests/integrations/sanity-queries.test.ts`.
  - Expected: all query, tag, result-state, ordering, filtering, and schema assertions pass.

### Task 3: Server-rendered Blog Routes and Components

**Files:**

- Modify: `src/app/(marketing)/blog/page.tsx`
- Create: `src/app/(marketing)/blog/page/[page]/page.tsx`
- Create: `src/app/(marketing)/blog/category/[category]/page.tsx`
- Create: `src/app/(marketing)/blog/category/[category]/page/[page]/page.tsx`
- Modify: `src/app/(marketing)/blog/[slug]/page.tsx`
- Modify: `src/features/blog/BlogHeroSection.tsx`
- Modify: `src/features/blog/BlogList.tsx`
- Create: focused Portable Text/image components under `src/features/blog/` when required
- Test: `tests/features/blog-hero.test.tsx`
- Test: `tests/features/blog-list.test.tsx`
- Test: new route/component tests under `tests/features/`

**Interfaces:**

- Consumes the typed query contracts from Task 2.
- Produces server-rendered semantic blog HTML, clean route normalization, accessible pagination, Sanity images, and Portable Text.

- [ ] **Step 1: Write failing component/route tests**
  - Assert the hero renders the newest title, image alt text, metadata, and `/blog/<slug>` link.
  - Assert empty data and query failure render different controlled states.
  - Assert cards render semantic `<article>`, real image data, `<time>`, categories, and links.
  - Assert category and page routes use server-rendered article links and return 404 for unknown/out-of-range inputs.
  - Assert `/blog/page/*` and `/blog/category/*` are not treated as article slugs.
  - Assert article detail renders Portable Text blocks and exactly one page H1.
- [ ] **Step 2: Run focused tests to verify the failures**
  - Run: `npx vitest run tests/features/blog-hero.test.tsx tests/features/blog-list.test.tsx` and the new route tests.
  - Expected: placeholders, absent routes, and unimplemented Portable Text produce failures.
- [ ] **Step 3: Implement server-rendered route composition**
  - Keep page components as Server Components and resolve params/search parameters before rendering.
  - Implement canonical route normalization and `notFound()` behavior from the spec.
  - Use `BLOG_PAGE_SIZE = 8` and server-generated semantic links for categories and pagination.
  - Exclude the current hero post from all listing totals and pages.
- [ ] **Step 4: Replace placeholders with Sanity-backed UI**
  - Update hero/list components to consume typed data, render `next/image`, dates, categories, and real links.
  - Render Portable Text with explicit supported block/list/link/image mappings and no raw HTML.
  - Preserve existing visual styling and responsive layout; do not redesign unrelated marketing sections.
- [ ] **Step 5: Run focused verification**
  - Run the focused blog feature/route tests.
  - Expected: all initial-HTML, semantic, responsive markup, empty/error, and 404 assertions pass.

### Task 4: Signed Webhook and Immediate Cache Invalidation

**Files:**

- Create: `src/app/api/revalidate/sanity/route.ts`
- Test: `tests/api/sanity-revalidate-route.test.ts`

**Interfaces:**

- Consumes centralized tags from Task 2 and `SANITY_REVALIDATE_SECRET` from Task 1.
- Produces `POST /api/revalidate/sanity` with 200/400/401 behavior and no-op behavior for unsupported methods.

- [ ] **Step 1: Write failing webhook tests**
  - Assert a valid signed blog-post payload invalidates global/list/category tags and the current slug tag with `{ expire: 0 }`.
  - Assert old and new slug tags are both invalidated on slug change.
  - Assert author/category/site-settings payloads invalidate the correct global tags.
  - Assert missing/invalid signatures return 401 and call no invalidation.
  - Assert malformed/unsupported payloads return 400; GET does not invalidate.
  - Assert response and structured logs do not include the secret/signature/body.
- [ ] **Step 2: Run webhook tests to verify they fail**
  - Run: `npx vitest run tests/api/sanity-revalidate-route.test.ts`.
  - Expected: route module is missing and all behavior assertions fail.
- [ ] **Step 3: Implement the route handler**
  - Use `parseBody` from `next-sanity/webhook` and the server-only secret.
  - Validate document type and payload fields before revalidation.
  - Call `revalidateTag(tag, { expire: 0 })` for each required affected tag.
  - Return minimal generic JSON and structured sanitized logs.
- [ ] **Step 4: Run focused verification**
  - Run: `npx vitest run tests/api/sanity-revalidate-route.test.ts`.
  - Expected: all valid, invalid, malformed, method, invalidation, and secret-redaction tests pass.

### Task 5: SEO, Structured Data, Sitemap, and Environment Documentation

**Files:**

- Modify: `src/lib/seo.ts`
- Modify: `src/lib/schema.tsx`
- Modify: `src/app/(marketing)/blog/page.tsx`
- Modify: `src/app/(marketing)/blog/[slug]/page.tsx`
- Modify: `src/app/sitemap.ts`
- Modify: `src/app/robots.ts` only if required to preserve the Studio disallow rule
- Modify: `.env.example`
- Create/modify: deployment documentation for Sanity webhook configuration
- Test: `tests/lib/seo.test.ts`
- Test: new sitemap/schema tests under `tests/lib/`

**Interfaces:**

- Consumes article/category/sitemap query contracts from Task 2 and route data from Task 3.
- Produces canonical metadata, article social metadata, safe BlogPosting/Breadcrumb JSON-LD, and published-only sitemap entries.

- [ ] **Step 1: Write failing SEO tests**
  - Assert title/description override fallbacks, absolute canonical URLs, article Open Graph type, social image dimensions/alt, author, and publication/modification dates.
  - Assert category/page metadata is unique and sort variants are `noindex,follow` with clean canonical URLs.
  - Assert draft preview metadata is `noindex,nofollow`.
  - Assert BlogPosting and Breadcrumb JSON-LD include article image, dates, author, publisher, canonical URL, and safe serialization.
  - Assert sitemap excludes drafts/sort variants and includes effective `lastModified` and image data.
- [ ] **Step 2: Run SEO tests to verify they fail**
  - Run: `npx vitest run tests/lib/seo.test.ts tests/lib/schema.test.ts tests/lib/sitemap.test.ts`.
  - Expected: current generic metadata/schema/sitemap behavior fails the new assertions.
- [ ] **Step 3: Implement SEO behavior**
  - Generate article/list/category metadata from Sanity data with the specified fallbacks and robots directives.
  - Use `article` Open Graph metadata and complete Twitter image metadata.
  - Extend BlogPosting/Breadcrumb JSON-LD through the existing safe helper.
  - Return published article sitemap entries with effective modification dates and image metadata supported by Next 16.
- [ ] **Step 4: Document deployment setup**
  - Document the server-only secret, Sanity webhook URL, signed request configuration, allowed document types, and projection.
  - Keep preview and webhook secrets distinct.
- [ ] **Step 5: Run focused verification**
  - Run: `npx vitest run tests/lib/seo.test.ts tests/lib/schema.test.ts tests/lib/sitemap.test.ts`.
  - Expected: all SEO, schema, sitemap, canonical, and robots assertions pass.

### Task 6: Full Verification and Final Review

**Files:**

- Modify only files required by failing verification.
- Test: focused blog/Studio/webhook tests and repository suites.

- [ ] **Step 1: Run formatting/lint/type/test/build verification**
  - Run: `npm.cmd run lint`, `npm.cmd run typecheck`, `npm.cmd test`, and `npm.cmd run build`.
  - Expected: exit code 0 for each command.
- [ ] **Step 2: Run responsive browser verification**
  - Run the focused Studio/blog Playwright specs and inspect desktop/tablet/mobile initial HTML behavior.
  - Expected: no route capture errors, horizontal overflow, missing article links, or Studio tool error.
- [ ] **Step 3: Perform a fresh diff review**
  - Review only the implementation diff against the pre-task status; verify no unrelated user changes were staged or overwritten and no secrets/debug logs exist.
- [ ] **Step 4: Fix only verified Critical/Important findings**
  - For each finding, add a failing regression test first, run it red, implement the smallest fix, and rerun the focused and full relevant suites.
- [ ] **Step 5: Record final verification evidence**
  - Add the commands and actual results to the SDD ledger. Report any pre-existing unrelated failures separately.
