import { expect, test } from "@playwright/test";
import { openPage } from "./helpers/site";

test.describe("responsive Services hero", () => {
  test("should keep the desktop heading to three lines and show the full hero composition", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await openPage(page, "/services");

    const layout = await page.evaluate(() => {
      const title = document.querySelector<HTMLElement>('[data-testid="services-hero-title"]');
      const grid = document.querySelector<HTMLElement>('[data-testid="services-hero-grid"]');
      const illustration = document.querySelector<HTMLElement>(
        '[data-testid="services-hero-illustration"]',
      );
      const surface = document.querySelector<HTMLElement>('[data-testid="services-hero-surface"]');

      if (!title || !grid || !illustration || !surface) {
        throw new Error("Missing Services hero geometry");
      }

      const titleLineRects = [...title.querySelectorAll<HTMLElement>(":scope > span")].map(
        (line) => line.getClientRects().length,
      );

      return {
        titleLineRects,
        gridWidth: grid.getBoundingClientRect().width,
        illustrationDisplay: getComputedStyle(illustration).display,
        surfaceRadius: getComputedStyle(surface).borderBottomLeftRadius,
      };
    });

    expect(layout.titleLineRects).toEqual([1, 1, 1]);
    expect(layout.gridWidth).toBeGreaterThan(1000);
    expect(layout.gridWidth).toBeLessThan(1200);
    expect(layout.illustrationDisplay).not.toBe("none");
    expect(layout.surfaceRadius).not.toBe("0px");
  });

  test("should retain the background illustration but hide the distracting artwork on mobile", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await openPage(page, "/services");

    await expect(page.getByTestId("services-hero-background")).toBeVisible();
    await expect(page.getByTestId("services-hero-illustration")).toBeHidden();
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  });

  test("should preserve the main artwork on a roomy tablet viewport", async ({ page }) => {
    await page.setViewportSize({ width: 1024, height: 768 });
    await openPage(page, "/services");

    await expect(page.getByTestId("services-hero-illustration")).toBeVisible();
  });

  test("should keep the service lines and shared CTA on the Services route", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await openPage(page, "/services");

    await expect(page.getByTestId("service-lines")).toBeVisible();
    await expect(page.getByTestId("cta-section")).toBeVisible();
    await expect(page.getByTestId("site-footer")).toBeVisible();
    await expect(
      page.getByTestId("site-header-nav-list").getByRole("link", { name: "Services" }),
    ).toHaveAttribute("aria-current", "page");
  });
});
