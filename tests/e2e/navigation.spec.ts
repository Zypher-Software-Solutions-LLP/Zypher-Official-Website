import { expect, test, type Page } from "@playwright/test";

async function rejectOptionalCookies(page: Page): Promise<void> {
  const rejectButton = page.getByRole("button", { name: "Reject optional" });
  if (await rejectButton.isVisible().catch(() => false)) {
    await rejectButton.click();
  }
}

test("should navigate from the homepage to the work page", async ({ page }) => {
  await page.goto("/");
  await rejectOptionalCookies(page);
  await page.getByRole("link", { name: "See Our Work" }).click();
  await expect(page).toHaveURL(/\/work$/);
  await expect(
    page.getByRole("heading", { name: "Useful work has a reason behind it." }),
  ).toBeVisible();
});

test("should open and close the mobile navigation", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await rejectOptionalCookies(page);
  await page.getByRole("button", { name: "Open navigation menu" }).click();
  const mobileNavigation = page.locator("#mobile-navigation");
  await expect(mobileNavigation).toBeVisible();
  await expect(mobileNavigation).toHaveClass(/is-open/);
  await expect(mobileNavigation).toHaveAttribute("aria-hidden", "false");
  await expect(page.locator(".site-header__menu-icon")).toHaveClass(/is-open/);
  await page.getByRole("button", { name: "Close navigation menu" }).click();
  await expect(mobileNavigation).toHaveAttribute("aria-hidden", "true");
  await expect(mobileNavigation).toHaveClass(/is-closed/);
  await expect(page.locator(".site-header__menu-icon")).not.toHaveClass(/is-open/);
});
