import { expect, test } from "@playwright/test";
import { openPage } from "./helpers/site";

const scaleDescription =
  "From a founder validating their first product to an operations team replacing a system that stopped scaling, if the problem is real, we’re the right conversation.";

test.describe("Scale page responsive hero", () => {
  test("should use the 12-column desktop layout and keep the CTA connected", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await openPage(page, "/scale");

    const hero = page.getByTestId("scale-hero");
    const grid = page.getByTestId("scale-hero-grid");
    const copy = page.getByTestId("scale-hero-copy");

    await expect(hero).toBeVisible();
    await expect(page.getByRole("heading", { level: 1 })).toHaveAccessibleName(
      "Whatever the size. Whatever the stage. Built to fit.",
    );
    await expect(page.getByText(scaleDescription)).toBeVisible();
    await expect(hero.getByRole("link", { name: "Book A Discovery Call" })).toHaveAttribute(
      "href",
      "/contact",
    );

    const gridStyle = await grid.evaluate((element) => {
      const styles = getComputedStyle(element);
      return {
        display: styles.display,
        columns: styles.gridTemplateColumns.split(/\s+/).length,
      };
    });

    expect(gridStyle.display).toBe("grid");
    expect(gridStyle.columns).toBe(12);

    const heroBox = await hero.boundingBox();
    const copyBox = await copy.boundingBox();
    const visualBox = await page.getByTestId("scale-hero-illustration").boundingBox();

    if (!heroBox || !copyBox || !visualBox) {
      throw new Error("Scale desktop geometry is unavailable");
    }

    expect(
      Math.abs(visualBox.x + visualBox.width / 2 - (heroBox.x + heroBox.width / 2)),
    ).toBeLessThanOrEqual(80);
    expect(copyBox.y + copyBox.height).toBeLessThanOrEqual(visualBox.y + 1);
  });

  test("should place the visual group toward the lower edge without growing the section", async ({
    page,
  }) => {
    for (const viewport of [
      { width: 1440, height: 900 },
      { width: 768, height: 1024 },
      { width: 3840, height: 2160 },
    ]) {
      await page.setViewportSize(viewport);
      await openPage(page, "/scale");

      const geometry = await page.evaluate(() => {
        const hero = document.querySelector<HTMLElement>('[data-testid="scale-hero"]');
        const visual = document.querySelector<HTMLElement>(
          '[data-testid="scale-hero-illustration"]',
        );

        if (!hero || !visual) {
          throw new Error("Scale visual placement geometry is unavailable");
        }

        const heroBox = hero.getBoundingClientRect();
        const visualBox = visual.getBoundingClientRect();

        return {
          heroBottom: heroBox.bottom,
          heroHeight: heroBox.height,
          visualBottom: visualBox.bottom,
          visualTop: visualBox.top,
        };
      });

      expect(geometry.heroHeight).toBeLessThanOrEqual(viewport.height + 1);
      expect(geometry.visualTop).toBeGreaterThanOrEqual(geometry.heroHeight * 0.55);
      expect(geometry.visualBottom).toBeGreaterThanOrEqual(geometry.heroBottom + 150);
    }
  });
  test("should compact larger mobile heroes and lift the visual group", async ({ page }) => {
    for (const viewport of [
      { width: 437, height: 932 },
      { width: 390, height: 844 },
    ]) {
      await page.setViewportSize(viewport);
      await openPage(page, "/scale");

      const hero = page.getByTestId("scale-hero");
      const heroBox = await hero.boundingBox();
      const visualBox = await page.getByTestId("scale-hero-illustration").boundingBox();
      const buttonBox = await hero
        .getByRole("link", { name: "Book A Discovery Call" })
        .boundingBox();

      if (!heroBox || !visualBox || !buttonBox) {
        throw new Error("Scale mobile geometry is unavailable");
      }

      expect(heroBox.height).toBeLessThanOrEqual(48 * 16 + 1);
      expect(visualBox.y).toBeLessThanOrEqual(680);
      expect(visualBox.y).toBeGreaterThan(buttonBox.y + buttonBox.height);
      expect(visualBox.y + visualBox.height).toBeLessThanOrEqual(heroBox.y + heroBox.height + 96);
    }
  });
  test("should keep copy and visual inside the hero on tablet", async ({ page }) => {
    await page.setViewportSize({ width: 1024, height: 1366 });
    await openPage(page, "/scale");

    const hero = page.getByTestId("scale-hero");
    const surface = hero.locator("div").first();
    const copyBox = await page.getByTestId("scale-hero-copy").boundingBox();
    const visualBox = await page.getByTestId("scale-hero-visual").boundingBox();
    const surfaceBox = await surface.boundingBox();

    if (!copyBox || !visualBox || !surfaceBox) {
      throw new Error("Scale tablet geometry is unavailable");
    }

    expect(copyBox.x + copyBox.width).toBeLessThanOrEqual(surfaceBox.x + surfaceBox.width + 1);
    expect(visualBox.x + visualBox.width).toBeLessThanOrEqual(surfaceBox.x + surfaceBox.width + 1);
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(
      1024,
    );
  });

  test("should stack the mobile content before the illustration without overflow", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await openPage(page, "/scale");

    const hero = page.getByTestId("scale-hero");
    const headingBox = await hero.getByRole("heading", { level: 1 }).boundingBox();
    const descriptionBox = await hero.getByText(scaleDescription).boundingBox();
    const buttonBox = await hero.getByRole("link", { name: "Book A Discovery Call" }).boundingBox();
    const visualBox = await page.getByTestId("scale-hero-visual").boundingBox();

    if (!headingBox || !descriptionBox || !buttonBox || !visualBox) {
      throw new Error("Scale mobile geometry is unavailable");
    }

    expect(headingBox.y).toBeLessThan(descriptionBox.y);
    expect(descriptionBox.y).toBeLessThan(buttonBox.y);
    expect(buttonBox.y).toBeLessThan(visualBox.y);
    await expect(hero.getByTestId("scale-hero-ellipse")).toHaveCount(1);
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(
      390,
    );
  });

  test("should keep the visual group centered and readable at 4K", async ({ page }) => {
    await page.setViewportSize({ width: 3840, height: 2160 });
    await openPage(page, "/scale");

    const geometry = await page.evaluate(() => {
      const hero = document.querySelector<HTMLElement>('[data-testid="scale-hero"]');
      const visual = document.querySelector<HTMLElement>('[data-testid="scale-hero-illustration"]');
      const title = document.querySelector<HTMLElement>("#scale-hero-title");

      if (!hero || !visual || !title) {
        throw new Error("Scale 4K geometry is unavailable");
      }

      const heroBox = hero.getBoundingClientRect();
      const visualBox = visual.getBoundingClientRect();
      const titleBox = title.getBoundingClientRect();

      return {
        heroHeight: heroBox.height,
        centerDelta: Math.abs(
          visualBox.left + visualBox.width / 2 - (heroBox.left + heroBox.width / 2),
        ),
        titleRight: titleBox.right,
        heroRight: heroBox.right,
      };
    });

    expect(geometry.heroHeight).toBeGreaterThanOrEqual(768);
    expect(geometry.centerDelta).toBeLessThanOrEqual(160);
    expect(geometry.titleRight).toBeLessThanOrEqual(geometry.heroRight);
  });
});
