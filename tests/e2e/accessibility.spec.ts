import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { openPage } from "./helpers/site";
import { mockExternalProviders } from "./support/providers";

async function stabilizeMotionForAccessibility(
  page: Parameters<typeof openPage>[0],
): Promise<void> {
  await page.addStyleTag({
    content: `
      [data-motion-section],
      [data-motion-section] *,
      [data-motion-intro] {
        animation: none !important;
        opacity: 1 !important;
        transform: none !important;
        transition: none !important;
      }
    `,
  });
}

const routes = [
  "/",
  "/services",
  "/services/software-development",
  "/contact",
  "/blog",
  "/privacy-policy",
  "/terms-of-service",
];

for (const route of routes) {
  for (const viewport of [
    { name: "desktop", width: 1440, height: 1080 },
    { name: "mobile", width: 390, height: 844 },
  ]) {
    test(`should have no detectable accessibility violations on ${route} at ${viewport.name}`, async ({
      page,
    }) => {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      if (route === "/contact") await mockExternalProviders(page);
      await openPage(page, route);
      await stabilizeMotionForAccessibility(page);
      const results = await new AxeBuilder({ page }).analyze();
      expect(results.violations).toEqual([]);
    });
  }
}

test("should keep the mobile navigation keyboard and accessibility state valid", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await openPage(page);

  const menuButton = page.getByRole("button", { name: "Open navigation menu" });
  await menuButton.focus();
  await expect(menuButton).toBeFocused();
  await menuButton.press("Enter");
  await expect(page.getByRole("button", { name: "Close navigation menu" })).toBeVisible();

  const results = await new AxeBuilder({ page }).include("header").analyze();
  expect(results.violations).toEqual([]);
});

test("should keep the cookie consent dialog accessible before a choice", async ({ page }) => {
  await page.goto("/");
  const dialog = page.getByRole("dialog", { name: "Cookie consent" });
  await expect(dialog).toBeVisible();

  const results = await new AxeBuilder({ page }).include('[role="dialog"]').analyze();
  expect(results.violations).toEqual([]);
});
