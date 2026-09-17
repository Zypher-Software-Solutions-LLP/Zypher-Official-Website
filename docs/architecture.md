# Architecture

The public site is a Next.js App Router application. Route modules compose feature modules; they do
not call Sanity, Resend, R2, Turnstile, or analytics providers directly.

Content is rendered on the server where possible. Client-side code is limited to interaction seams:
navigation, consent, contact submission, and motion enhancement.

## Content ownership

- Code owns route structure, layout composition, design tokens, animations, and stable marketing-page
  composition.
- Sanity owns blog posts, authors, categories, featured content, selected global content, and SEO
  overrides.
- Repository assets own logos, icons, fonts, and small immutable files.
- R2 owns large marketing media; Sanity owns editorial media.

## Future seams

Case-study detail routes, CRM storage, new analytics destinations, and localized content can be added
without changing the public page modules.
