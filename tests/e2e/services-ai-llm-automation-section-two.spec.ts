import { expect, test } from "@playwright/test";
import { openPage } from "./helpers/site";

test.describe("AI and LLM automation Section 2", () => {
  test("should preserve the section composition across desktop, tablet, and mobile", async ({
    page,
  }) => {
    for (const viewport of [
      { width: 1440, height: 900 },
      { width: 1024, height: 900 },
      { width: 390, height: 844 },
    ]) {
      await page.setViewportSize(viewport);
      await openPage(page, "/services/ai-llm-automation");

      await expect(page.getByTestId("ai-llm-section-two")).toBeVisible();
      await expect(page.getByTestId("ai-llm-section-two-illustration")).toBeVisible();
      await expect(page.getByTestId("ai-llm-section-two-description")).toContainText(
        'The gap between "we added AI" and "AI is running our operations"',
      );

      const layout = await page.evaluate(() => {
        const section = document.querySelector<HTMLElement>('[data-testid="ai-llm-section-two"]');
        const illustration = document.querySelector<HTMLElement>(
          '[data-testid="ai-llm-section-two-illustration"]',
        );

        if (!section || !illustration) {
          throw new Error("Missing AI automation Section 2 geometry");
        }

        return {
          sectionWidth: section.getBoundingClientRect().width,
          illustrationWidth: illustration.getBoundingClientRect().width,
          documentWidth: document.documentElement.scrollWidth,
          viewportWidth: window.innerWidth,
        };
      });

      expect(layout.sectionWidth).toBe(layout.viewportWidth);
      expect(layout.documentWidth).toBe(layout.viewportWidth);
      expect(layout.illustrationWidth).toBeGreaterThan(0);
    }
  });
});
