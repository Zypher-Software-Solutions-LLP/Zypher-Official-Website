# SEO, GEO, and AEO launch checklist

- [ ] Export and crawl the current production URL inventory.
- [ ] Map each legacy URL to one canonical destination or an intentional 404/410.
- [ ] Add the final redirect map to `next.config.ts`.
- [ ] Confirm one canonical domain, protocol, casing, and trailing-slash policy.
- [x] Give every indexable page a unique title, description, canonical, and social metadata.
- [ ] Create and publish one `Page SEO` document for every static route in Sanity.
- [x] Resolve published static-page SEO server-side so crawlers receive metadata in the public HTML.
- [x] Validate `sitemap.xml`, `robots.txt`, JSON-LD, and favicon/manifest files in the repository.
- [x] Keep published Sanity articles in the sitemap and `llms.txt`, with hourly fallback revalidation and signed-webhook invalidation.
- [x] Keep blog sort, pagination, preview, and empty category routes from becoming indexable thin pages.
- [ ] Verify Google Search Console and Bing Webmaster Tools.
- [ ] Submit the production sitemap to both consoles.
- [ ] Review service copy for direct answers, factual claims, sources, and internal links.
- [x] Publish a dynamic, standards-shaped `llms.txt` only from verified company facts and canonical URLs.
- [x] Keep previews, drafts, API, and Studio routes out of the index through robots and response headers.

Repository-controlled checks are marked complete above. The remaining items require
the production hostname, provider dashboards, a crawl, and owner/legal approval;
complete them in [Production readiness](production-readiness.md) before launch.
