import { expect, test } from "@playwright/test";

const viewports = [
  { name: "desktop", width: 1440, height: 900 },
  { name: "mobile", width: 390, height: 844 },
] as const;

for (const viewport of viewports) {
  test(`should fill the ${viewport.name} viewport without 404 copy collisions`, async ({
    page,
  }) => {
    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    await page.goto("/random");

    await expect(page.getByRole("link", { name: "Go Back Home" })).toBeVisible();

    const metrics = await page.evaluate(() => {
      const hero = document.querySelector<HTMLElement>('[data-testid="not-found-page"]');
      const grid = document.querySelector<HTMLElement>('[data-testid="not-found-grid"]');
      const image = document.querySelector<HTMLElement>(
        '[data-testid="not-found-background-illustration"] img',
      );
      const imageLayer = document.querySelector<HTMLElement>(
        '[data-testid="not-found-background-illustration"]',
      );
      const overlay = document.querySelector<HTMLElement>(
        '[data-testid="not-found-image-overlay"]',
      );
      const number = document.querySelector<HTMLElement>('[data-testid="not-found-number"]');
      const content = document.querySelector<HTMLElement>('[data-testid="not-found-content"]');

      if (!hero || !grid || !image || !imageLayer || !overlay || !number || !content) {
        throw new Error("Missing 404 responsive layers");
      }

      const heroRect = hero.getBoundingClientRect();
      const numberRect = number.getBoundingClientRect();
      const contentRect = content.getBoundingClientRect();
      const gridStyle = getComputedStyle(grid);
      const imageStyle = getComputedStyle(image);
      const imageLayerStyle = getComputedStyle(imageLayer);
      const overlayStyle = getComputedStyle(overlay);

      return {
        heroWidth: heroRect.width,
        heroHeight: heroRect.height,
        gridColumnCount: gridStyle.gridTemplateColumns.split(/\s+/).length,
        viewportWidth: window.innerWidth,
        viewportHeight: window.innerHeight,
        numberTop: numberRect.top,
        numberBottom: numberRect.bottom,
        numberLeft: numberRect.left,
        numberRight: numberRect.right,
        contentTop: contentRect.top,
        objectFit: imageStyle.objectFit,
        imageOpacity: imageLayerStyle.opacity,
        overlayColor: overlayStyle.backgroundColor,
      };
    });

    expect(metrics.gridColumnCount).toBe(12);
    expect(metrics.heroWidth).toBeCloseTo(metrics.viewportWidth, 0);
    expect(metrics.heroHeight).toBeCloseTo(metrics.viewportHeight, 0);
    expect(metrics.objectFit).toBe("cover");
    expect(metrics.imageOpacity).toBe("0.3");
    expect(metrics.overlayColor).toBe("rgba(0, 0, 0, 0.3)");
    expect(metrics.numberTop).toBeLessThan(metrics.viewportHeight * 0.5);
    expect(metrics.numberLeft).toBeGreaterThanOrEqual(0);
    expect(metrics.numberRight).toBeLessThanOrEqual(metrics.viewportWidth);
    expect(metrics.contentTop).toBeGreaterThanOrEqual(metrics.numberBottom - 1);
  });
}
