import { expect, test } from "@playwright/test";
import { dismissConsent } from "./helpers/site";

test("should serve the embedded Sanity Studio route", async ({ page }) => {
  const response = await page.goto("/studio");
  await dismissConsent(page);

  expect(response?.status()).toBeLessThan(400);
  await expect(page).not.toHaveTitle(/not found/i);
});
