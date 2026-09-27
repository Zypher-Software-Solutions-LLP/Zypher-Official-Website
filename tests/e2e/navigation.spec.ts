import { expect, test } from "@playwright/test";
import { openPage } from "./helpers/site";

test("should navigate from the homepage to the work page", async ({ page }) => {
  await openPage(page);
  await page.getByTestId("hero-section").getByRole("link", { name: "See Our Work" }).click();
  await expect(page).toHaveURL(/\/work$/);
  await expect(
    page.getByRole("heading", {
      name: "Every Project below started as a problem, No one had solved yet.",
    }),
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

for (const viewport of [
  { name: "mobile", width: 390, height: 844 },
  { name: "tablet", width: 768, height: 900 },
]) {
  test(`should toggle the Services accordion on ${viewport.name}`, async ({ page }) => {
    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    await openPage(page);
    await page.getByRole("button", { name: "Open navigation menu" }).click();

    const mobileNavigation = page.locator("#mobile-navigation");
    const servicesToggle = mobileNavigation.getByRole("button", { name: "Services" });
    const servicesSubmenu = page.getByTestId("site-header-mobile-services-submenu");

    await expect(servicesToggle).toHaveAttribute("aria-expanded", "false");
    await expect(servicesSubmenu).toHaveAttribute("aria-hidden", "true");

    await servicesToggle.press("Enter");
    await expect(servicesToggle).toHaveAttribute("aria-expanded", "true");
    await expect(servicesSubmenu).toHaveAttribute("aria-hidden", "false");
    await expect(servicesSubmenu.getByRole("link")).toHaveCount(6);
    await expect(servicesSubmenu.getByRole("link", { name: "All Services" })).toHaveAttribute(
      "href",
      "/services",
    );

    await servicesToggle.press("Space");
    await expect(servicesToggle).toHaveAttribute("aria-expanded", "false");
  });
}
