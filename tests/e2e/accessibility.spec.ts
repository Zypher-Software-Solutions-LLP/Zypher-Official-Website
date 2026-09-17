import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { openPage } from "./helpers/site";

for (const viewport of [
  { name: "desktop", width: 1440, height: 1080 },
  { name: "mobile", width: 390, height: 844 },
]) {
  test(
    "should have no detectable accessibility violations on the " + viewport.name + " homepage",
    async ({ page }) => {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await openPage(page);
      await page.waitForTimeout(1_000);
      const results = await new AxeBuilder({ page }).analyze();
      expect(results.violations).toEqual([]);
    },
  );
}
