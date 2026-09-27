import { expect, test } from "@playwright/test";
import { openPage } from "./helpers/site";

test.describe("home page reveal motion", () => {
  test("keeps section surfaces rendered while only their content fades in", async ({ page }) => {
    await page.setViewportSize({ height: 900, width: 1440 });
    await openPage(page);

    await expect(page.locator("#main-content")).toHaveCSS("background-color", "rgb(244, 248, 246)");

    const section = page.getByTestId("solutions-section");
    const sectionHeader = section.locator("header");

    await expect(section).toHaveAttribute("data-reveal-state", "hidden");
    await expect(section).toHaveCSS("opacity", "1");
    await expect(sectionHeader).toHaveCSS("opacity", "0");

    await section.scrollIntoViewIfNeeded();
    await expect(section).toHaveAttribute("data-reveal-state", "visible");
    await expect(sectionHeader).toHaveCSS("opacity", "1");
  });

  test("keeps Lenis available for the smooth scrolling experience", async ({ page }) => {
    await openPage(page);

    await expect(page.locator("html")).toHaveClass(/lenis/);
  });

  test("runs the intro contract again after client-side navigation", async ({ page }) => {
    await openPage(page);

    await expect(page.locator("[data-motion-intro]")).toHaveCount(1);
    await page.getByRole("link", { name: "Services" }).first().click();
    await expect(page).toHaveURL(/\/services$/);
    await expect(page.locator("[data-motion-intro]")).toHaveCount(1);
  });

  test("keeps a revealed section visible when it is revisited", async ({ page }) => {
    await page.setViewportSize({ height: 900, width: 1440 });
    await openPage(page);

    const section = page.getByTestId("solutions-section");
    const sectionHeader = section.locator("header");
    await section.scrollIntoViewIfNeeded();
    await expect(section).toHaveAttribute("data-reveal-state", "visible");

    await page.evaluate(() => window.scrollTo({ behavior: "auto", top: 0 }));
    await section.scrollIntoViewIfNeeded();
    await expect(section).toHaveAttribute("data-reveal-state", "visible");
    await expect(sectionHeader).toHaveCSS("opacity", "1");
  });

  test("renders motion targets immediately for reduced-motion users", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await openPage(page);

    const intro = page.locator("[data-motion-intro]").first();
    const section = page.getByTestId("solutions-section");

    await expect(intro).toHaveCSS("transform", "none");
    await expect(section).toHaveAttribute("data-reveal-state", "visible");
    await expect(section.locator("header")).toHaveCSS("transform", "none");
    await expect(section.locator("header")).toHaveCSS("opacity", "1");
  });
});
