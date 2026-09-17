# Homepage Scale Section Design

## Goal

Add the second homepage section from Figma node `13:25`, preserving the approved Zypher visual language while making metrics, client logos, and project cards responsive and future-proof.

## Design contract

- Desktop reference is the supplied Figma node at 1440px width.
- The section uses the brand mist background, brand dark text, brand neon accents, and the existing General Sans and Hanken Grotesk font tokens.
- The section contains the heading “TRUSTED BY TEAMS AT / EVERY SCALE”, three metric cards, a clipped client-logo marquee, three project cards, disabled carousel controls, and a working “View All Works →” link.
- Metric cards enter with opacity and upward translation.
- Client logos loop continuously in a clipped track with soft horizontal edge fades.
- Project images have a readable dark overlay. Hovering a card moves its title upward and reveals the description and circular arrow.
- Project carousel arrows are visible but disabled until additional projects exist.
- Mobile reflows content vertically and preserves every metric, logo track, project card, and CTA.
- Motion uses transform and opacity, and reduced-motion users receive static content.

## Data boundary

Section data stays in a typed feature-owned module. Project and logo records use stable ids, alt text, and source URLs. The rendering component does not know provider-specific CMS or storage details, so the data can later be replaced by Sanity query results without changing the layout.

## Accessibility and performance

- Use semantic section headings, lists, links, and buttons.
- Decorative illustrations and arrows are hidden from assistive technology.
- Project image alt text remains meaningful; logo alt text identifies each client.
- Disabled carousel controls use `disabled` and an accessible label.
- The marquee is paused for reduced motion and does not receive keyboard focus.
- Avoid layout shifts with explicit media dimensions and aspect ratios.
