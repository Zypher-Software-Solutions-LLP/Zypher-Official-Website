import { expect, test } from "@playwright/test";
import { openPage } from "./helpers/site";

test.describe("AI and LLM automation hero", () => {
  test("should render the route-specific hero and preserve the shared shell", async ({ page }) => {
    for (const viewport of [1440, 1024, 768, 390]) {
      await page.setViewportSize({ width: viewport, height: 900 });
      await openPage(page, "/services/ai-llm-automation");

      await expect(page.getByTestId("ai-llm-hero")).toBeVisible();
      await expect(
        page.getByRole("heading", {
          level: 1,
          name: "AI that works inside your business. Not Alongside it.",
        }),
      ).toBeVisible();
      await expect(page.getByTestId("ai-llm-hero-illustration")).toBeVisible();

      if (viewport >= 900) {
        await expect(
          page.getByTestId("site-header-nav-list").getByRole("link", { name: "Services" }),
        ).toHaveAttribute("aria-current", "page");
      }

      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth > window.innerWidth,
      );
      expect(overflow).toBe(false);
    }
  });

  test("should preserve the 1440P composition across common PC resolutions", async ({ page }) => {
    for (const viewport of [
      { width: 1366, height: 768 },
      { width: 1920, height: 1080 },
      { width: 2560, height: 1440 },
      { width: 3840, height: 2160 },
    ]) {
      await page.setViewportSize(viewport);
      await openPage(page, "/services/ai-llm-automation");

      const composition = await page.evaluate(() => {
        const hero = document.querySelector<HTMLElement>('[data-testid="ai-llm-hero"]');
        const title = document.querySelector<HTMLElement>('[data-testid="ai-llm-hero-title"]');
        const illustration = document.querySelector<HTMLElement>(
          '[data-testid="ai-llm-hero-illustration"]',
        );

        if (!hero || !title || !illustration) {
          throw new Error("Missing AI and LLM hero geometry");
        }

        const heroRect = hero.getBoundingClientRect();
        const titleRect = title.getBoundingClientRect();
        const illustrationRect = illustration.getBoundingClientRect();

        return {
          heroHeight: heroRect.height,
          titleTopRatio: (titleRect.top - heroRect.top) / heroRect.height,
          illustrationHeightRatio: illustrationRect.height / heroRect.height,
          illustrationTopRatio: (illustrationRect.top - heroRect.top) / heroRect.height,
        };
      });

      const expectedHeroHeight = Math.max(672, viewport.height * (2 / 3));

      expect(composition.heroHeight).toBeCloseTo(expectedHeroHeight, 0);
      expect(composition.titleTopRatio).toBeGreaterThan(0.2);
      expect(composition.titleTopRatio).toBeLessThan(0.28);
      expect(composition.illustrationHeightRatio).toBeGreaterThan(0.87);
      expect(composition.illustrationHeightRatio).toBeLessThan(0.91);
      expect(composition.illustrationTopRatio).toBeGreaterThan(0.39);
      expect(composition.illustrationTopRatio).toBeLessThan(0.43);
    }
  });

  test("should keep the mobile hero compact with a smaller city illustration", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await openPage(page, "/services/ai-llm-automation");

    const composition = await page.evaluate(() => {
      const hero = document.querySelector<HTMLElement>('[data-testid="ai-llm-hero"]');
      const illustration = document.querySelector<HTMLElement>(
        '[data-testid="ai-llm-hero-illustration"]',
      );

      if (!hero || !illustration) {
        throw new Error("Missing mobile AI and LLM hero geometry");
      }

      return {
        heroHeight: hero.getBoundingClientRect().height,
        illustrationWidth: illustration.getBoundingClientRect().width,
      };
    });

    expect(composition.heroHeight).toBeLessThan(760);
    expect(composition.illustrationWidth).toBeLessThan(600);
  });

  test("should keep the shared footer after the hero", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await openPage(page, "/services/ai-llm-automation");

    await expect(page.getByTestId("site-footer")).toBeVisible();
  });
});
