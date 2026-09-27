import { expect, test } from "@playwright/test";
import { openPage } from "./helpers/site";

test.describe("Terms of Use page", () => {
  test("renders the legal reader responsively", async ({ page }) => {
    for (const viewport of [
      { width: 1440, height: 900 },
      { width: 390, height: 844 },
    ]) {
      await page.setViewportSize(viewport);
      await openPage(page, "/terms-of-service");

      await expect(page.getByTestId("terms-of-use-hero")).toBeVisible();
      await expect(page.getByRole("heading", { name: "Terms of Use" })).toBeVisible();
      await expect(
        page.getByTestId("terms-of-use-reader").getByRole("heading", { level: 2 }),
      ).toHaveCount(19);
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(
        viewport.width,
      );

      const index = page.getByTestId("terms-of-use-index");
      if (viewport.width < 768) {
        await expect(index).toBeHidden();
      } else {
        await expect(index).toBeVisible();
        await expect(page.getByTestId("terms-of-use-body")).toHaveCSS("overflow-y", "visible");
      }
    }
  });

  test("uses the shared smooth section navigation", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await openPage(page, "/terms-of-service");

    const target = page
      .getByTestId("terms-of-use-index")
      .getByRole("link", { name: /19 Contact Us/ });
    await target.click();

    await expect.poll(async () => page.evaluate(() => window.scrollY)).toBeGreaterThan(0);
    await expect(page.locator("#contact-us")).toBeVisible();
    await expect(target).toHaveAttribute("data-active", "true");
  });
});
