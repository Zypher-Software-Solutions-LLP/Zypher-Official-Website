import { expect, test } from "@playwright/test";
import { openPage } from "./helpers/site";

test.describe("About values section", () => {
  test("should render the three-column values grid and expand icons from the left", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await openPage(page, "/about");

    const section = page.getByTestId("about-values");
    const grid = page.getByTestId("about-values-grid");
    const icon = page.getByTestId("about-value-icon").first();

    await section.scrollIntoViewIfNeeded();
    await expect(section).toBeVisible();
    await expect(page.getByTestId("about-value-card")).toHaveCount(5);
    await expect(page.getByTestId("about-value-guide")).toHaveCount(1);

    const columns = await grid.evaluate((element) => getComputedStyle(element).gridTemplateColumns);
    expect(columns.split(" ")).toHaveLength(3);

    const before = await icon.evaluate((element) => getComputedStyle(element).transform);
    await icon.hover();
    const after = await icon.evaluate((element) => getComputedStyle(element).transform);

    expect(before).toBe("none");
    expect(after).not.toBe("none");
  });

  test("should stack the values content on mobile", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await openPage(page, "/about");

    const grid = page.getByTestId("about-values-grid");
    const columns = await grid.evaluate((element) => getComputedStyle(element).gridTemplateColumns);

    await expect(page.getByTestId("about-value-card")).toHaveCount(5);
    expect(columns.split(" ")).toHaveLength(1);
  });
});
