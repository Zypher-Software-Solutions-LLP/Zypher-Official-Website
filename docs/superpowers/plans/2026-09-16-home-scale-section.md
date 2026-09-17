# Homepage Scale Section Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement the approved homepage Scale section from Figma node `13:25` with responsive metrics, client logos, project cards, motion, and tests.

**Architecture:** Keep the section inside `src/features/home` with typed feature data and a focused React component. Reuse the existing `ButtonLink`, brand tokens, image handling, and global motion conventions; keep provider-specific CMS/storage code out of the page component.

**Tech Stack:** Next.js App Router, React Server Components, strict TypeScript, Tailwind CSS v4 tokens, CSS transitions/keyframes, Vitest, Testing Library, and Playwright.

**Spec:** `docs/superpowers/specs/2026-09-16-home-scale-section-design.md`

## Global Constraints

- Preserve all meaningful content at every viewport; mobile may stack but may not remove content.
- Use General Sans for headings and Hanken Grotesk for supporting text and controls.
- Use supplied Cloudflare R2 URLs for the section images and client logos.
- Use transform and opacity for animation wherever possible.
- Support `prefers-reduced-motion` without hiding content.
- Keep the existing hero and navbar behavior unchanged.
- Do not add dependencies.

---

### Task 1: Define typed Scale section data

**Files:**

- Create: `src/features/home/scale-data.ts`
- Test: `tests/features/scale-data.test.ts`

**Interfaces:**

- Produces `ScaleMetric`, `ScaleProject`, `ScaleClientLogo`, and exported `scaleMetrics`, `scaleProjects`, `scaleClientLogos` constants.

- [ ] **Step 1: Write the failing test**

```ts
import { describe, expect, it } from "vitest";
import { scaleClientLogos, scaleMetrics, scaleProjects } from "@/features/home/scale-data";

describe("scale section data", () => {
  it("should expose the three approved metrics and projects", () => {
    expect(scaleMetrics).toHaveLength(3);
    expect(scaleProjects).toHaveLength(3);
    expect(scaleProjects.map((project) => project.title)).toEqual([
      "Custom CRM",
      "VMS - Platform",
      "Rental System",
    ]);
  });

  it("should provide a meaningful alt text and source for every client logo", () => {
    expect(scaleClientLogos.length).toBeGreaterThanOrEqual(10);
    for (const logo of scaleClientLogos) {
      expect(logo.src).toMatch(/^https:\/\//);
      expect(logo.alt.trim()).not.toBe("");
    }
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm.cmd test -- tests/features/scale-data.test.ts`
Expected: FAIL because `@/features/home/scale-data` does not exist.

- [ ] **Step 3: Write minimal implementation**

Define the three metrics, three project records with image source, labels, descriptions, and alt text, and the ten supplied client logo records. Keep the records immutable and use stable ids.

- [ ] **Step 4: Run test to verify it passes**

Run: `npm.cmd test -- tests/features/scale-data.test.ts`
Expected: PASS.

### Task 2: Build the semantic Scale section

**Files:**

- Create: `src/features/home/ScaleSection.tsx`
- Modify: `src/features/home/HomePage.tsx`
- Test: `tests/features/home.test.tsx`

**Interfaces:**

- Consumes `scaleMetrics`, `scaleProjects`, and `scaleClientLogos`.
- Produces a `ScaleSection` server component with `data-testid` hooks for behavior and visual tests.

- [ ] **Step 1: Write the failing test**

```tsx
it("should render the scale section content and future project controls", () => {
  render(<HomePage />);

  expect(
    screen.getByRole("heading", { level: 2, name: /trusted by teams at/i }),
  ).toBeInTheDocument();
  expect(screen.getByText("25+ Projects Delivered")).toBeInTheDocument();
  expect(screen.getByText("20+ Clients Served")).toBeInTheDocument();
  expect(screen.getByText("Across 10+ Countries")).toBeInTheDocument();
  expect(screen.getByRole("link", { name: "View All Works" })).toHaveAttribute("href", "/work");
  expect(screen.getAllByRole("button", { name: /project/i })).toHaveLength(2);
  expect(
    screen
      .getAllByRole("button", { name: /project/i })
      .every((button) => (button as HTMLButtonElement).disabled),
  ).toBe(true);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm.cmd test -- tests/features/home.test.tsx`
Expected: FAIL because the Scale section is not rendered.

- [ ] **Step 3: Write minimal implementation**

Render a labelled section with an `h2`, metric list, logo list, project card list, disabled previous/next buttons, and a `ButtonLink` to `/work`. Use `Image` with explicit dimensions or fill containers and use `aria-hidden` only for decorative visual layers.

- [ ] **Step 4: Run test to verify it passes**

Run: `npm.cmd test -- tests/features/home.test.tsx`
Expected: PASS.

### Task 3: Match the Figma layout and motion responsively

**Files:**

- Modify: `src/styles/globals.css`
- Test: `tests/e2e/scale-responsive.spec.ts`

**Interfaces:**

- Consumes the Scale section class names and test ids from Task 2.
- Produces responsive layout and motion states at desktop, tablet, and phone widths.

- [ ] **Step 1: Write the failing browser tests**

```ts
import { expect, test } from "@playwright/test";

test.describe("responsive homepage Scale section", () => {
  test("should preserve all metrics, projects, and CTA on desktop", async ({ page }) => {
    await page.goto("/");
    const section = page.getByTestId("scale-section");
    await expect(section).toBeVisible();
    await expect(section.getByTestId("scale-project-card")).toHaveCount(3);
    await expect(section.getByTestId("scale-client-logo")).not.toHaveCount(0);
    await expect(section.getByRole("link", { name: "View All Works" })).toHaveAttribute(
      "href",
      "/work",
    );
  });

  test("should stack cards without horizontal overflow on a phone", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");
    await expect(page.getByTestId("scale-section")).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(
      390,
    );
    await expect(page.getByTestId("scale-project-card")).toHaveCount(3);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm.cmd run test:e2e -- tests/e2e/scale-responsive.spec.ts`
Expected: FAIL because the section and responsive hooks do not exist.

- [ ] **Step 3: Write minimal implementation**

Add section-scoped CSS matching the desktop positions and proportions, then use fluid containers, CSS grid, aspect-ratio, `clamp()`, and mobile stacking. Add the fade-up card entrance, marquee track, dark image overlay, and project hover reveal. Add reduced-motion overrides that show all content statically.

- [ ] **Step 4: Run test to verify it passes**

Run: `npm.cmd run test:e2e -- tests/e2e/scale-responsive.spec.ts`
Expected: PASS at desktop and phone viewports.

### Task 4: Verify the complete application

**Files:**

- Modify: `tests/e2e/accessibility.spec.ts` only if the new section requires an explicit regression assertion.

- [ ] **Step 1: Run focused unit and browser tests**

Run: `npm.cmd test -- tests/features/scale-data.test.ts tests/features/home.test.tsx` and `npm.cmd run test:e2e -- tests/e2e/scale-responsive.spec.ts tests/e2e/accessibility.spec.ts`
Expected: all focused tests pass.

- [ ] **Step 2: Run project quality gates**

Run: `npm.cmd run format`, `npm.cmd run typecheck`, `npm.cmd run lint`, `npm.cmd test`, `npm.cmd run test:e2e`, `npm.cmd audit --audit-level=high`, and `npm.cmd run build`.
Expected: every command exits with status 0, the full test suite passes, the production build completes, and the audit reports no high-severity vulnerabilities.
