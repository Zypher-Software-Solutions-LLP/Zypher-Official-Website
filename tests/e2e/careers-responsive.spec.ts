import { expect, test } from "@playwright/test";
import { openPage } from "./helpers/site";

const viewports = [
  { name: "desktop", width: 1440, height: 900 },
  { name: "tablet", width: 768, height: 1024 },
  { name: "mobile", width: 390, height: 844 },
] as const;

for (const viewport of viewports) {
  test("should keep the careers hero responsive on " + viewport.name, async ({ page }) => {
    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    await openPage(page, "/careers");

    await expect(page.getByRole("link", { name: "Send Your Application" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Join us?" })).toBeVisible();

    const metrics = await page.evaluate(() => {
      const hero = document.querySelector<HTMLElement>('[data-testid="careers-hero"]');
      const grid = document.querySelector<HTMLElement>('[data-testid="careers-hero-grid"]');
      const copy = document.querySelector<HTMLElement>('[data-testid="careers-hero-copy"]');
      const visual = document.querySelector<HTMLElement>('[data-testid="careers-hero-visual"]');

      if (!hero || !grid || !copy || !visual) {
        throw new Error("Missing careers hero geometry");
      }

      const heroRect = hero.getBoundingClientRect();
      const copyRect = copy.getBoundingClientRect();
      const visualRect = visual.getBoundingClientRect();
      const gridStyle = getComputedStyle(grid);

      return {
        heroWidth: heroRect.width,
        heroHeight: heroRect.height,
        viewportWidth: window.innerWidth,
        viewportHeight: window.innerHeight,
        gridDisplay: gridStyle.display,
        gridColumnCount:
          gridStyle.display === "grid" ? gridStyle.gridTemplateColumns.split(/\s+/).length : 0,
        copyLeft: copyRect.left,
        copyRight: copyRect.right,
        visualLeft: visualRect.left,
        visualRight: visualRect.right,
      };
    });

    expect(metrics.heroWidth).toBeCloseTo(metrics.viewportWidth, 0);
    expect(metrics.heroHeight).toBeGreaterThanOrEqual(metrics.viewportHeight);
    if (viewport.width >= 900) {
      expect(metrics.gridDisplay).toBe("grid");
      expect(metrics.gridColumnCount).toBe(12);
    } else {
      expect(metrics.gridDisplay).toBe("block");
    }
    expect(metrics.copyLeft).toBeGreaterThanOrEqual(0);
    expect(metrics.copyRight).toBeLessThanOrEqual(metrics.viewportWidth);
    expect(metrics.visualLeft).toBeGreaterThanOrEqual(0);
    expect(metrics.visualRight).toBeLessThanOrEqual(metrics.viewportWidth);
  });
}
