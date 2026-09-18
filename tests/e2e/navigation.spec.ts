import { expect, test } from "@playwright/test";
import { openPage } from "./helpers/site";

test("should navigate from the homepage to the work page", async ({ page }) => {
  await openPage(page);
  await page.getByRole("link", { name: "See Our Work" }).click();
  await expect(page).toHaveURL(/\/work$/);
  await expect(
    page.getByRole("heading", { name: "Useful work has a reason behind it." }),
  ).toBeVisible();
});

test("should start the next route at the top after navigating while scrolled", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await openPage(page);

  await page.evaluate(() => window.scrollTo({ behavior: "auto", top: document.body.scrollHeight }));
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(100);

  await page.getByRole("link", { name: "Services", exact: true }).click();

  await expect(page).toHaveURL(/\/services$/);
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeLessThan(2);
  await expect(page.getByTestId("services-hero")).toBeVisible();
});

test("should open and close the mobile navigation", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await openPage(page);
  await page.getByRole("button", { name: "Open navigation menu" }).click();
  const mobileNavigation = page.locator("#mobile-navigation");
  await expect(mobileNavigation).toBeVisible();
  await expect(mobileNavigation).toHaveAttribute("aria-hidden", "false");
  await expect(mobileNavigation).toHaveAttribute("data-state", "open");
  await expect(page.getByTestId("site-header-menu-icon")).toHaveAttribute("data-state", "open");
  await page.getByRole("button", { name: "Close navigation menu" }).click();
  await expect(mobileNavigation).toHaveAttribute("aria-hidden", "true");
  await expect(mobileNavigation).toHaveAttribute("data-state", "closed");
  await expect(page.getByTestId("site-header-menu-icon")).toHaveAttribute("data-state", "closed");
});
