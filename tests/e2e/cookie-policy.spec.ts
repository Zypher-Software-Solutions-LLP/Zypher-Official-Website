import { expect, test } from "@playwright/test";
import { openPage } from "./helpers/site";

test.describe("Cookie Policy page", () => {
  test("renders the legal reader responsively", async ({ page }) => {
    for (const viewport of [
      { width: 1440, height: 900 },
      { width: 390, height: 844 },
    ]) {
      await page.setViewportSize(viewport);
      await openPage(page, "/cookie-policy");

      await expect(page.getByTestId("cookie-policy-hero")).toBeVisible();
      await expect(
        page.getByTestId("cookie-policy-hero").getByRole("heading", { name: "Cookie Policy" }),
      ).toBeVisible();
      await expect(
        page.getByTestId("cookie-policy-reader").getByRole("heading", { level: 2 }),
      ).toHaveCount(11);
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(
        viewport.width,
      );

      const index = page.getByTestId("cookie-policy-index");
      if (viewport.width < 768) {
        await expect(index).toBeHidden();
      } else {
        await expect(index).toBeVisible();
        await expect(page.getByTestId("cookie-policy-body")).toHaveCSS("overflow-y", "visible");
      }
    }
  });

  test("uses the shared smooth section navigation", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await openPage(page, "/cookie-policy");

    const target = page
      .getByTestId("cookie-policy-index")
      .getByRole("link", { name: /11 Contact Us/ });
    await target.click();

    await expect.poll(async () => page.evaluate(() => window.scrollY)).toBeGreaterThan(0);
    await expect(page.locator("#contact-us")).toBeVisible();
    await expect(target).toHaveAttribute("data-active", "true");
  });
});
