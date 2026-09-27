# Dynamic Sanity Blog and SEO Design

**Date:** 2026-09-26  
**Status:** Approved architecture; ready for implementation planning  
**Owner:** Zypher Software Solutions  
**Implementation target:** Luna

## 1. Objective

Make the Zypher blog fully managed by Sanity, render the newest published post in the blog hero, publish updates to the website immediately through a signed webhook, and provide crawlable, article-quality SEO without changing the existing visual direction.

The implementation must also repair the embedded Sanity Studio route currently displaying `Tool not found: studio` for authenticated users.

## 2. Confirmed Current State

### 2.1 Studio routing defect

`src/app/studio/[[...tool]]/page.tsx` correctly mounts `NextStudio`, but `sanity.config.ts` does not declare `basePath: "/studio"`. Sanity therefore interprets the URL segment `studio` as a tool name and displays `Tool not found: studio` after authentication.

Required correction:

```ts
export default defineConfig({
  basePath: "/studio",
  // existing configuration
});
```

Keep the catch-all route. Do not add a tool named `studio` and do not introduce a redirect workaround.

### 2.2 Dataset state

The configured production dataset currently contains no `blogPost` documents: zero drafts and zero published posts. The website's empty state is therefore valid until content is authored and published. Implementation must not seed, invent, or publish content.

### 2.3 Incomplete public blog behavior

- `BlogHeroSection.tsx` uses placeholder content instead of the newest published Sanity post.
- `BlogList.tsx` renders image placeholders rather than Sanity images.
- Categories are hardcoded in the client.
- Pagination is client-only, so later article links are absent from server HTML.
- `src/app/(marketing)/blog/[slug]/page.tsx` does not render Portable Text.
- Query failures are logged but collapsed into the same UI result as an empty dataset.
- Article metadata and structured data omit important image, publisher, and publication information.
- The sitemap contains article slugs but not article modification dates or image metadata.

## 3. Scope

### Included

- Repair embedded Studio routing.
- Strengthen Sanity publishing validation.
- Fetch and render all blog content from Sanity.
- Use the newest published post as the hero feature.
- Render Sanity images and Portable Text safely.
- Add server-rendered category and pagination routes.
- Add signed webhook-driven cache invalidation.
- Add article metadata, social previews, canonical URLs, structured data, and sitemap details.
- Preserve draft-preview behavior already supported by the query layer.
- Add unit, integration, and responsive browser coverage.
- Document deployment environment variables and Sanity webhook setup.

### Excluded

- Writing or publishing blog content.
- Redesigning the blog page.
- Adding search, comments, accounts, recommendations, or analytics beyond the existing view tracker.
- Migrating to another CMS.
- Installing a new dependency when `next-sanity`, `sanity`, Next.js, and the existing Portable Text exports already cover the requirement.
- Enabling Next.js Cache Components as part of this change.

## 4. Content Model

Keep the existing document types: `blogPost`, `author`, `category`, and `siteSettings`. Add or enforce the following validation.

### `blogPost`

| Field             | Requirement                                   | Public use                                |
| ----------------- | --------------------------------------------- | ----------------------------------------- |
| `title`           | Required; sensible maximum length             | H1, cards, metadata fallback              |
| `slug.current`    | Required and unique                           | Canonical route                           |
| `excerpt`         | Required; target 120–180 characters           | Cards and metadata fallback               |
| `author`          | Required reference                            | Byline and schema                         |
| `categories`      | At least one valid reference                  | Filtering and article labels              |
| `image`           | Required                                      | Hero/card/social image                    |
| `image.alt`       | Required non-blank text                       | Accessibility and image SEO               |
| `publishedAt`     | Required before publication                   | Ordering and schema                       |
| `updatedAt`       | Optional explicit editorial date              | `dateModified`; fall back to `_updatedAt` |
| `body`            | Required and non-empty                        | Article content                           |
| `seo.title`       | Optional; length guidance near 60 characters  | Metadata override                         |
| `seo.description` | Optional; length guidance near 155 characters | Metadata override                         |

The GROQ projection must include `_createdAt`, `_updatedAt`, image asset metadata/URL, image dimensions where available, category titles and slugs, and the author fields required by the UI and schema.

### `author`

Require `name`. Keep `role`, `bio`, and `image` optional. If author image exists, require its alt text or intentionally treat it as decorative in the UI.

### `category`

Require `title` and a unique `slug.current`. Keep `description` optional and use it for category-page metadata when supplied.

### `siteSettings`

Use existing organization data when available. The Article publisher must resolve to Zypher's organization name, canonical site URL, and logo. If those values are not currently represented in `siteSettings`, add the minimum explicit fields rather than hardcoding repeated values throughout components.

## 5. Data Contracts and Query Layer

Keep all Sanity access under `src/integrations/cms/sanity/`. UI components must consume typed view models and must not issue GROQ queries directly.

### Required types

- `BlogPostSummary`: id, title, slug, excerpt, author summary, category summaries, published date, modified date, and resolved image data.
- `BlogPostDetail`: all summary fields plus Portable Text body and SEO overrides.
- `BlogCategory`: title, slug, and optional description.
- `PaginatedBlogPosts`: `items`, `page`, `pageSize`, `totalItems`, and `totalPages`.
- `BlogQueryResult<T>` or an equivalent explicit result/error boundary that distinguishes missing CMS configuration, query failure, and a valid empty result.

Do not use `any`. Narrow Portable Text values to the library's supported block types.

### Required server queries

1. `getLatestPublishedPost()`
   - Filters to published `blogPost` documents with `defined(publishedAt)`, `publishedAt <= now()`, and a valid slug.
   - Orders by `publishedAt desc`, then `_createdAt desc` for deterministic ties.
   - Returns one `BlogPostSummary` or `null`.

2. `getPaginatedBlogPosts({ page, pageSize, categorySlug, sort })`
   - Performs server-side filtering, sorting, counting, and slicing.
   - Excludes malformed documents without a slug or publication date.
   - Excludes the current hero post by id from every listing page so it is not duplicated while featured. When a newer post is published, the former hero naturally returns to the listing.
   - Returns a typed pagination result.

3. `getBlogCategories()`
   - Returns categories referenced by at least one published post, with published post counts if the UI needs them.
   - Orders predictably by title unless the schema later adds editorial ordering.

4. `getBlogPost(slug)`
   - Returns one complete published article.
   - Uses preview perspective only when draft mode is enabled.

5. `getBlogPostSlugs()` and `getBlogSitemapEntries()`
   - The first supports static generation.
   - The second returns slug, `publishedAt`, effective modified date, and image data for sitemap generation.

### Failure behavior

- Invalid or absent Sanity configuration must be logged once with a structured event and surfaced as a controlled service-unavailable state, not misrepresented as “no posts yet.”
- Query failures must retain operation name and a sanitized error message in server logs.
- Public responses must not expose tokens, project internals, stack traces, or raw Sanity errors.
- A successful query returning zero records must render the editorial empty state.

## 6. URL and Rendering Model

All public content must be server-rendered. Client components may enhance controls, but the article links, category links, pagination links, headings, and article body must exist in initial HTML.

### Canonical routes

- `/blog` — newest-first listing, page 1.
- `/blog/page/[page]` — listing pages 2 and above.
- `/blog/category/[category]` — category page 1.
- `/blog/category/[category]/page/[page]` — later category pages.
- `/blog/[slug]` — article detail.

Static route segments take precedence over `[slug]`; retain tests proving `page` and `category` are not interpreted as article slugs.

### Route normalization

- Page 1 must canonicalize and redirect to the route without `/page/1`.
- Non-integer, zero, negative, or out-of-range page values return `notFound()`.
- Unknown category slugs return `notFound()`.
- Preserve sorting with a single optional `sort=oldest` query value; absence means newest-first. Reject other values. The `oldest` variant is `noindex,follow` and canonicalizes to the equivalent clean newest-first route because it duplicates the same post set.

### Pagination

Set and centralize `BLOG_PAGE_SIZE = 8`, matching the current listing behavior. Pagination controls must be semantic links, include accessible labels, expose previous/next relationships, and remain keyboard usable.

## 7. Page Behavior

### Blog hero

- Always feature `getLatestPublishedPost()` from the published perspective.
- Display the post title, excerpt, image, category, publication date, and a real link to `/blog/[slug]` using the current design hierarchy.
- Exclude the current hero post from the paginated listing on every page. Apply the exclusion before calculating total items and total pages.
- While the dataset is empty, render a composed empty hero state without a dead CTA.

### Blog listing

- Render real Sanity images through `next/image` using the existing `cdn.sanity.io` allowance.
- Use stored image dimensions or a stable aspect ratio to avoid layout shift.
- Render category controls from Sanity.
- Use `<article>`, meaningful heading order, `<time dateTime>`, and descriptive links.
- Do not make the entire card an inaccessible nested-link structure.

### Article detail

- Render the post title as the only page H1.
- Show author, publication date, effective modification date when different, categories, and featured image.
- Render Portable Text with an explicit component map for headings, paragraphs, lists, links, block quotes, and inline images used by the schema.
- Sanitize/validate external links. Add `rel="noopener noreferrer"` when opening a new browsing context. Do not permit arbitrary raw HTML from Sanity.
- Unknown or unpublished slugs return `notFound()` outside draft preview.

## 8. Caching and Instant Webhook Revalidation

Use tagged Next.js server data caching; do not rely only on a time-based ISR interval.

### Cache tags

Centralize tag construction to prevent mismatches:

- `sanity:blog`
- `sanity:blog:list`
- `sanity:blog:categories`
- `sanity:blog:post:<slug>`
- `sanity:site-settings`

All list, latest-post, category, article, metadata, and sitemap queries must carry the relevant tags. Draft-preview queries must bypass the public cache.

Create the Next-aware client with `createClient` from the installed `next-sanity` package and pass `next: { tags }` through its supported fetch options. Do not add a second cache layer around a query.

### Webhook endpoint

Create `POST /api/revalidate/sanity` as a Node.js route handler.

Requirements:

1. Read `SANITY_REVALIDATE_SECRET` from server-only validated environment configuration.
2. Validate Sanity's signed request with `parseBody` from `next-sanity/webhook`.
3. Reject a missing/invalid signature with `401` and a generic JSON error.
4. Reject malformed or unsupported payloads with `400`.
5. Allow only relevant types: `blogPost`, `author`, `category`, and `siteSettings`.
6. Invalidate tags with `revalidateTag(tag, { expire: 0 })`. Next.js 16 requires the second argument, and `{ expire: 0 }` is the appropriate immediate-expiration mode for an external webhook.
7. For a `blogPost`, invalidate the global blog/list/category tags and both the current and previous slug-specific tags when supplied. This prevents stale old-slug pages after a slug change.
8. For `author` or `category`, invalidate the global blog tags because referenced content can change on multiple cards/articles.
9. For `siteSettings`, invalidate its tag plus blog/article tags used by metadata and structured data.
10. Return a minimal success body containing `revalidated: true` and the accepted document type; do not echo secrets or the full document.
11. Emit structured logs for accepted, rejected, and failed events without logging the signature or request body.
12. Permit `POST` only. Do not accept a secret in query parameters.

Recommended Sanity webhook projection:

```groq
{
  "documentId": _id,
  "documentType": _type,
  "slug": slug.current,
  "previousSlug": before().slug.current
}
```

Configure the webhook to fire on create, update, and delete for the relevant document types. Enable signed requests with the same value deployed as `SANITY_REVALIDATE_SECRET`.

“Instant” means the first request after a successfully accepted webhook blocks for fresh tagged data instead of receiving stale content. It does not mean the webhook proactively renders every route.

## 9. SEO Requirements

### Listing and category metadata

- `/blog` has a unique title, description, and canonical URL.
- Category routes include the category name and optional description in metadata.
- Page 2+ metadata includes the page number and self-canonical URL.
- Sort variants use `robots: { index: false, follow: true }` and canonicalize to their clean route.
- Draft preview pages must be `noindex,nofollow`.

### Article metadata

Generate metadata from the article query and use these fallbacks:

- Title: `seo.title` then article title.
- Description: `seo.description` then excerpt.
- Canonical: absolute `/blog/<slug>` URL.
- Open Graph type: `article`.
- Open Graph/Twitter image: featured image URL, dimensions, and alt text.
- Article publication and modification times: `publishedAt` and effective modified date.
- Author name included where supported.

Avoid separate metadata and page queries producing duplicate Sanity requests; use React request memoization or a shared cached query boundary consistent with the installed Next.js version.

### Structured data

Render one `BlogPosting` JSON-LD object on article pages with:

- `headline`
- `description`
- `image`
- `datePublished`
- `dateModified`
- canonical `url` and `mainEntityOfPage`
- author Person name
- publisher Organization name, URL, and logo
- applicable article section/category values

Retain Breadcrumb structured data. Serialize through the project's safe JSON-LD helper and prevent `<` from creating a script-closing injection sequence.

### Sitemap and robots

- Keep `/studio/` disallowed in `robots.txt`.
- Include each published article with canonical URL, effective `lastModified`, and image metadata when supported by the current Next sitemap type.
- Do not include drafts, unknown category variants, sort variants, or webhook/API routes.

## 10. Environment and Security

Document these variables in the repository's environment example without real values:

- `NEXT_PUBLIC_SANITY_PROJECT_ID`
- `NEXT_PUBLIC_SANITY_DATASET`
- `SANITY_API_READ_TOKEN` only if private datasets or preview require it
- `SANITY_STUDIO_PREVIEW_ORIGIN`
- `SANITY_PREVIEW_SECRET`
- `SANITY_REVALIDATE_SECRET`

`SANITY_REVALIDATE_SECRET` must be server-only, independently generated, and different from the preview secret and API token. Never expose it through `NEXT_PUBLIC_*`, logs, HTML, or client bundles.

The public published-content client should use the CDN where compatible with tagged invalidation. Preview must use the draft perspective and authenticated non-CDN requests.

## 11. Expected File Impact

Implementation should remain close to the existing structure. Expected files include:

- `sanity.config.ts`
- `sanity/schemaTypes/blogPost.ts`
- `sanity/schemaTypes/author.ts`
- `sanity/schemaTypes/category.ts`
- `sanity/schemaTypes/siteSettings.ts` only if publisher data is missing
- `src/integrations/cms/sanity/client.ts`
- `src/integrations/cms/sanity/queries.ts`
- `src/integrations/cms/sanity/types.ts`
- a small centralized Sanity cache-tag module
- `src/app/api/revalidate/sanity/route.ts`
- `src/app/(marketing)/blog/page.tsx`
- new category and page route files under `src/app/(marketing)/blog/`
- `src/app/(marketing)/blog/[slug]/page.tsx`
- `src/features/blog/BlogHeroSection.tsx`
- `src/features/blog/BlogList.tsx`
- focused new components for Portable Text and images if needed
- `src/lib/seo.ts`
- `src/lib/schema.tsx`
- `src/app/sitemap.ts`
- environment example and deployment documentation
- focused tests under `tests/features`, `tests/api`, `tests/lib`, and `tests/e2e`

Do not restructure unrelated marketing pages or refactor shared components unless a failing requirement proves it necessary.

## 12. Test Strategy

Follow the repository's configured Vitest/Jest and Playwright conventions. Add tests before or alongside implementation.

### Unit and component tests

- Studio config contains `basePath: "/studio"`.
- Latest-post query uses deterministic newest-first ordering and published perspective.
- Pagination calculates slices and totals correctly at boundaries.
- Category filtering uses the category slug and rejects unknown categories.
- Empty dataset renders the intended empty state.
- CMS query failure renders a controlled failure state distinct from empty content.
- Hero links to and displays the newest published article.
- Cards render image alt text, semantic dates, categories, and article links.
- Portable Text renders every supported block and refuses unsupported raw HTML.
- Article metadata follows override/fallback rules and emits `article` Open Graph data.
- BlogPosting and Breadcrumb JSON-LD contain canonical, image, dates, author, and publisher.
- Sitemap excludes drafts and includes modification dates.

### Webhook integration tests

- Valid signed `blogPost` payload returns 200 and invalidates global plus slug tags with `{ expire: 0 }`.
- Slug change invalidates both old and new slug tags.
- Valid `author`, `category`, and `siteSettings` payloads invalidate their required global tags.
- Missing or invalid signature returns 401 and performs no invalidation.
- Malformed body, missing required fields, and unsupported document type return 400.
- GET and other unsupported methods do not trigger invalidation.
- Logs and response bodies never expose the secret or signature.

### Browser tests

- Authenticated Studio navigation resolves `/studio` without `Tool not found: studio`.
- `/blog` renders article links in initial HTML at desktop, tablet, and mobile widths.
- Category and pagination links navigate without horizontal overflow or lost focus.
- Static `/blog/page/*` and `/blog/category/*` routes are not captured by the article route.
- Article pages render title, image, metadata-visible content, and Portable Text responsively.
- Unknown/unpublished article, category, and pagination URLs return 404.

### Required verification commands

Use the package manager selected by the lockfile (`npm`). Run the repository's configured equivalents of:

```powershell
npm.cmd run lint
npm.cmd run typecheck
npm.cmd test
npm.cmd run build
```

Run the focused Playwright specs as well as any broader suite required by repository scripts. Do not report completion if a required command fails; report pre-existing unrelated failures separately with evidence.

## 13. Deployment and Rollout

1. Deploy the code and environment validation with `SANITY_REVALIDATE_SECRET` set in every production instance.
2. Configure the signed Sanity webhook against the production URL `/api/revalidate/sanity` using the documented projection and filters.
3. Send a signed test delivery and verify a 200 response and structured acceptance log.
4. Open authenticated `/studio` and verify Structure/Vision tools load.
5. Create a draft post and verify it is absent publicly but visible through the existing preview path.
6. Publish the post and verify the next public request shows it in the hero, listing, article route, metadata, structured data, and sitemap.
7. Update the post, change its slug, and unpublish/delete it to verify all relevant routes refresh and obsolete URLs no longer serve stale content.
8. Validate representative pages with browser dev tools and Google's Rich Results Test after deployment.

## 14. Acceptance Criteria

The work is accepted only when all of the following are true:

1. Authenticated `/studio` loads the configured Studio tools without the route error.
2. Publishing a Sanity post makes the newest published post the blog hero after the signed webhook is accepted.
3. Blog cards, categories, pagination, article body, author, dates, and images are sourced from Sanity and server-rendered.
4. Article, category, pagination, canonical, and 404 behavior matches this specification.
5. Webhook requests are signature-validated and immediately expire all affected cache tags.
6. Drafts never leak to public pages, metadata, structured data, or sitemap.
7. Article metadata, Open Graph/Twitter data, BlogPosting schema, Breadcrumb schema, and sitemap fields are complete and validated.
8. Empty data and CMS failures produce different controlled states.
9. No secret appears in source, logs, responses, HTML, or client bundles.
10. Relevant tests, lint, type checks, build, and responsive browser checks pass.
11. No unrelated files or existing user changes are overwritten.

## 15. Implementation Constraints for Luna

- Inspect the current dirty worktree before editing and preserve unrelated changes.
- Read the installed Next.js 16 documentation under `node_modules/next/dist/docs/` before implementing route, metadata, caching, sitemap, or revalidation APIs.
- Prefer Server Components and server data fetching; introduce client state only for genuine interaction.
- Do not change the approved architecture silently. If a repository constraint makes a requirement impractical, stop and report the exact conflict with a recommended adjustment.
- Do not create or publish CMS content as part of the code change.
- Do not add dependencies unless an existing installed package demonstrably cannot satisfy a requirement; document any approved addition.
