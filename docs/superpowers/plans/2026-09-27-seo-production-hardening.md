# SEO production hardening plan

Implement the remaining repository-controlled SEO and discoverability fixes from the production audit without changing the visual design.

Tasks:

1. Add explicit noindex/follow semantics for duplicate and secondary blog views, return 404 for empty category routes, and preserve preview noindex/nofollow behavior.
2. Make sitemap and `llms.txt` content refreshable through the Sanity webhook, with published article links in a standards-shaped `llms.txt` response.
3. Complete article metadata and structured data: final SEO title overrides, social image dimensions/alt text, stable organization identity, verified public profiles, square publisher logo, and optional author URLs.
4. Add the missing H1 to the UI/UX service route and update repository SEO documentation.
5. Run focused tests, full quality gates, and a final diff/security review.
