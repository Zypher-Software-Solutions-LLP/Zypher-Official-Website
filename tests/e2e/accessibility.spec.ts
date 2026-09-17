import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("should have no detectable accessibility violations on the homepage", async ({ page }) => {
  await page.goto("/");
  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations).toEqual([]);
});
