# Static page SEO in Sanity

Static-page SEO is managed through the **Page SEO** document type in the
embedded Sanity Studio at `/studio`.

Create one published document for every page path:

- `/`
- `/services`
- `/services/software-development`
- `/services/mobile-app-development`
- `/services/ai-llm-automation`
- `/services/design-creative`
- `/services/crm-erp-solutions`
- `/work`
- `/scale`
- `/about`
- `/blog`
- `/contact`
- `/careers`
- `/cookie-policy`
- `/privacy-policy`
- `/terms-of-use`

Each document contains the complete SEO title, SEO description, optional social
sharing image, and optional indexing controls. The page path is the canonical
technical URL and is not editable as a free-form canonical URL.

The application fetches these documents on the server and emits normal HTML
metadata through Next.js `generateMetadata`. Google therefore reads the final
title, description, canonical, robots, Open Graph, and Twitter metadata from the
public website; Google never needs access to Sanity or the Sanity read token.

Publish the Page SEO document after editing it. The signed Sanity webhook clears
the matching page's Next.js cache immediately.
