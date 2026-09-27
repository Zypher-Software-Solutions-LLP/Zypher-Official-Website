import { expect, test } from "@playwright/test";
import { openPage } from "./helpers/site";

test.describe("Privacy Policy page", () => {
  test("keeps the legal reader aligned and responsive across desktop, tablet, and mobile", async ({
    page,
  }) => {
    for (const viewport of [
      { width: 1440, height: 900 },
      { width: 1024, height: 768 },
      { width: 390, height: 844 },
    ]) {
      await page.setViewportSize(viewport);
      await openPage(page, "/privacy-policy");

      await expect(page.getByTestId("privacy-policy-hero")).toBeVisible();
      await expect(page.getByRole("heading", { name: "Privacy Policy" })).toBeVisible();
      await expect(
        page.getByTestId("privacy-policy-reader").getByRole("heading", { level: 2 }),
      ).toHaveCount(14);
      await expect(page.getByRole("heading", { name: "Information We Collect" })).toHaveCSS(
        "white-space",
        "nowrap",
      );
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(
        viewport.width,
      );

      const index = page.getByTestId("privacy-policy-index");
      const body = page.getByTestId("privacy-policy-body");
      if (viewport.width < 768) {
        await expect(index).toBeHidden();
        await expect(body).toHaveCSS("overflow-y", "visible");
      } else {
        await expect(index).toBeVisible();
        await expect(body).toHaveCSS("overflow-y", "visible");
        await expect(body).toHaveCSS("max-height", "none");
        await expect(body).toHaveAttribute("tabindex", "0");
      }
    }
  });

  test("allows the section index to move the normal document reader", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await openPage(page, "/privacy-policy");
    await page
      .getByTestId("privacy-policy-index")
      .getByRole("link", { name: /14 Contact and Grievance Officer/ })
      .click();
    await expect.poll(async () => page.evaluate(() => window.scrollY)).toBeGreaterThan(0);
    await expect(page.locator("#contact-and-grievance-officer")).toBeVisible();
    await expect(
      page
        .getByTestId("privacy-policy-index")
        .getByRole("link", { name: /14 Contact and Grievance Officer/ }),
    ).toHaveAttribute("data-active", "true");
  });

  test("updates the active index while the normal document scroll moves", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await openPage(page, "/privacy-policy");

    const target = page
      .getByTestId("privacy-policy-index")
      .getByRole("link", { name: /04 Service Providers/ });
    await page.evaluate(() => window.scrollTo({ behavior: "auto", top: 2600 }));

    await expect(target).toHaveAttribute("data-active", "true");
  });
});
