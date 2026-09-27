import { expect, test } from "@playwright/test";
import { openPage } from "./helpers/site";

test.describe("Scale industries section", () => {
  test("should use the Figma desktop grid and animate cards on hover", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 1080 });
    await openPage(page, "/scale");

    const section = page.getByTestId("scale-industries-section");
    await section.scrollIntoViewIfNeeded();
    await expect(section).toBeVisible();
    await expect(section.getByRole("heading", { level: 2 })).toHaveAccessibleName(
      "Built Across industries. Fluent in the problems behind them.",
    );

    const gridGeometry = await section.getByTestId("scale-industries-grid").evaluate((element) => {
      const styles = getComputedStyle(element);
      const cards = element.querySelectorAll<HTMLElement>('[data-testid="scale-industry-card"]');
      const firstCard = cards[0]?.getBoundingClientRect();
      const secondCard = cards[1]?.getBoundingClientRect();

      if (!firstCard || !secondCard) {
        throw new Error("Scale industries card geometry is unavailable");
      }

      return {
        columns: styles.gridTemplateColumns.startsWith("repeat(4")
          ? 4
          : styles.gridTemplateColumns.split(/\s+/).length,
        firstCardHeight: firstCard.height,
        firstCardLeft: firstCard.left,
        firstCardWidth: firstCard.width,
        horizontalGap: secondCard.left - firstCard.right,
      };
    });

    expect(gridGeometry.columns).toBe(4);
    expect(gridGeometry.firstCardLeft).toBeGreaterThanOrEqual(140);
    expect(gridGeometry.firstCardWidth).toBeGreaterThanOrEqual(268);
    expect(gridGeometry.firstCardWidth).toBeLessThanOrEqual(272);
    expect(gridGeometry.firstCardHeight).toBeGreaterThanOrEqual(178);
    expect(gridGeometry.firstCardHeight).toBeLessThanOrEqual(182);
    expect(gridGeometry.horizontalGap).toBeGreaterThanOrEqual(23);
    expect(gridGeometry.horizontalGap).toBeLessThanOrEqual(25);

    const card = section.getByTestId("scale-industry-card").first();
    const image = card.getByTestId("scale-industry-image-fintech");
    const title = card.getByRole("heading", { level: 3 });
    await card.focus();
    await card.hover();

    await expect
      .poll(() => image.evaluate((element) => getComputedStyle(element).filter))
      .toContain("blur");
    await expect
      .poll(() => image.evaluate((element) => getComputedStyle(element).transform))
      .not.toBe("none");
    await expect
      .poll(() => title.evaluate((element) => getComputedStyle(element).color))
      .toBe("rgb(21, 193, 150)");
  });

  test("should use three columns on tablet and two on mobile without overflow", async ({
    page,
  }) => {
    for (const viewport of [
      { width: 1024, height: 1366, columns: 3 },
      { width: 390, height: 844, columns: 2 },
    ]) {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await openPage(page, "/scale");

      const section = page.getByTestId("scale-industries-section");
      await section.scrollIntoViewIfNeeded();
      const gridColumns = await section.getByTestId("scale-industries-grid").evaluate((element) => {
        const columns = getComputedStyle(element).gridTemplateColumns;
        return columns.startsWith("repeat(3")
          ? 3
          : columns.startsWith("repeat(2")
            ? 2
            : columns.split(/\s+/).length;
      });

      expect(gridColumns).toBe(viewport.columns);
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(
        viewport.width,
      );
    }
  });

  test.describe("touch interaction", () => {
    test.use({ hasTouch: true });

    test("should keep industry cards visually static when tapped", async ({ page }) => {
      await page.setViewportSize({ width: 768, height: 1024 });
      await openPage(page, "/scale");

      const section = page.getByTestId("scale-industries-section");
      await section.scrollIntoViewIfNeeded();
      const card = section.getByTestId("scale-industry-card").first();
      const image = card.getByTestId("scale-industry-image-fintech");
      const title = card.getByRole("heading", { level: 3 });

      await card.tap();

      expect(await card.evaluate((element) => document.activeElement === element)).toBe(false);
      await expect
        .poll(() => image.evaluate((element) => getComputedStyle(element).filter))
        .toBe("blur(0px)");
      await expect
        .poll(() => image.evaluate((element) => getComputedStyle(element).transform))
        .toBe("matrix(1, 0, 0, 1, 0, 0)");
      await expect
        .poll(() => title.evaluate((element) => getComputedStyle(element).color))
        .not.toBe("rgb(21, 193, 150)");
    });
  });
});
