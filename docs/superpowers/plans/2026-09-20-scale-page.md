# Scale Page Implementation Plan

> For agentic workers: use superpowers:subagent-driven-development or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox syntax.

**Goal:** Replace the placeholder /scale page with the Figma-matched Scale hero, preserving the shared marketing header/footer and adding the existing final CTA.

**Architecture:** Keep the route thin and place the new hero in src/features/scale. The hero uses the existing 12-column grid, retained background illustration, one positioned visual group containing two ellipses plus the supplied Scale artwork, and the existing ButtonLink and CallToActionSection. The marketing layout already supplies Header and Footer.

**Tech Stack:** Next.js App Router, React, TypeScript, CSS Modules, next/image, Vitest, Playwright.

**Spec:** Figma Scale hero node 40-116; supplied CSS reference at C:/Users/Hank Nixon/.codex/attachments/d1df5148-4b5c-4926-839f-905e77852473/Pasted text.txt; supplied screenshot and Scale illustration URL from the user request.

## Global Constraints

- Preserve existing Zypher tokens, typography, header, footer, CTA, motion conventions, and analytics behavior.
- Use /home/section-1/background-illustration.png as the faint hero background.
- Use https://media.zypher-solutions.com/scale-page/section-1/Hero%20Section%20Illustration.png for the main Scale illustration.
- Keep the desktop hero approximately 768px tall, aligned to a 12-column grid, with 30px bottom corner radii.
- Use a dark green outer section so the rounded mist-colored hero surface exposes dark green below its bottom corners.
- Desktop: centered eyebrow and two-line heading, left copy/CTA, right-centered illustration group.
- Mobile: eyebrow, heading, description, CTA, then illustration group.
- Respect prefers-reduced-motion and add no dependencies.

## Review Focus

- Two ellipses and illustration stay one centered group without drifting through the illustration at desktop, tablet, or phone widths.
- Rounded corners expose the dark green base without seams or horizontal overflow.
- Heading and description remain readable at 320, 390, 768, 1024, 1440, and 3840px widths.
- CTA remains a working /contact link with existing tracking.
- Shared CTA remains below the hero and Footer remains supplied by the marketing layout.

---

### Task 1: Add the Scale hero component and styles

**Files:**

- Create: src/features/scale/ScaleHeroSection.tsx
- Create: src/features/scale/ScaleHeroSection.module.css

**Interfaces:**

- Consumes ButtonLink, next/image, existing brand CSS variables, and the existing background illustration.
- Produces ScaleHeroSection(): ReactNode with test IDs scale-hero, scale-hero-copy, scale-hero-visual, and scale-hero-illustration.

- [ ] Step 1: Build semantic markup with the supplied copy:
  - WHO WE WORK FOR
  - Whatever the size.
  - Whatever the stage. Built to fit.
  - From a founder validating their first product to an operations team replacing a system that stopped scaling, if the problem is real, we're the right conversation.
  - Book A Discovery Call linked to /contact.
- [ ] Step 2: Add desktop CSS for the 12-column layout, 768px surface, rounded bottom corners, faint background, left copy, and a single visual group. The group contains a larger ellipse and an inset smaller ellipse behind the supplied illustration, using the supplied 574px/530px relationship as the desktop proportion.
- [ ] Step 3: Add tablet/mobile CSS that stacks the copy before the visual, fluidly scales heading and artwork, and prevents horizontal overflow.
- [ ] Step 4: Add one authored copy/visual entrance and disable it for prefers-reduced-motion.
- [ ] Step 5: Run the focused component test.

### Task 2: Replace the placeholder route and integrate CTA

**Files:**

- Modify: src/app/(marketing)/scale/page.tsx
- Test: tests/features/scale-hero.test.tsx

**Interfaces:**

- Consumes ScaleHeroSection and CallToActionSection.
- Produces main content in the order ScaleHeroSection, CallToActionSection. Header and Footer continue to come from src/app/(marketing)/layout.tsx.

- [ ] Step 1: Add assertions for heading, description, CTA destination, both image assets, two ellipse nodes, and CTA section.
- [ ] Step 2: Replace StaticPage with the two-section main composition while preserving Scale metadata.
- [ ] Step 3: Run npm.cmd test -- tests/features/scale-hero.test.tsx and require PASS.

### Task 3: Pin responsive behavior

**Files:**

- Create: tests/e2e/scale-page-responsive.spec.ts

- [ ] Step 1: At 1440x900 assert the 12-column grid, two-line heading, visible CTA, /contact link, and visual group inside the hero bounds.
- [ ] Step 2: At 1024x1366 assert copy and visual stay visible without horizontal overflow.
- [ ] Step 3: At 320x844 and 390x844 assert eyebrow, heading, description, CTA, illustration order; both ellipses exist; document scrollWidth does not exceed the viewport.
- [ ] Step 4: At 3840x2160 assert the hero remains viewport-height, heading does not clip, and the group remains centered.
- [ ] Step 5: Run npm.cmd run test:e2e -- tests/e2e/scale-page-responsive.spec.ts and require PASS.

### Task 4: Production verification

**Files:** verify the route, hero component/CSS, and both test files.

- [ ] Step 1: Run npm.cmd test.
- [ ] Step 2: Run npm.cmd run lint and npm.cmd run typecheck.
- [ ] Step 3: Run npm.cmd run build and confirm /scale is included.
- [ ] Step 4: Run the Impeccable detector once over the changed route/component/CSS targets and inspect any mechanical findings.
