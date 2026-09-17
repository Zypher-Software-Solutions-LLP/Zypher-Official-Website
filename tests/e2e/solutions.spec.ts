import { expect, test } from "@playwright/test";
import { openPage } from "./helpers/site";

test.describe("homepage solutions section", () => {
  test("should use the shared desktop grid with alternating brand surfaces", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 1080 });
    await openPage(page);

    const section = page.getByTestId("solutions-section");
    await section.scrollIntoViewIfNeeded();

    const layout = await section.evaluate((element) => {
      const inner = element.querySelector<HTMLElement>('[data-testid="solutions-inner"]');
      const grid = element.querySelector<HTMLElement>('[data-testid="solutions-grid"]');
      const cards = Array.from(
        element.querySelectorAll<HTMLElement>('[data-testid="solution-card"]'),
      );
      const titleSpans = Array.from(
        element.querySelectorAll<HTMLElement>('[data-testid="solutions-title"] > span'),
      );

      if (!inner || !grid || cards.length !== 4 || titleSpans.length !== 2) {
        throw new Error("Solutions section geometry is unavailable");
      }

      const cardBoxes = cards.map((card) => {
        const box = card.getBoundingClientRect();

        return { left: box.left, right: box.right, width: box.width };
      });

      const titleLineCounts = titleSpans.map((span) => {
        const range = document.createRange();
        range.selectNodeContents(span);
        return range.getClientRects().length;
      });

      const titleTextRight = Math.max(
        ...titleSpans.flatMap((span) => {
          const range = document.createRange();
          range.selectNodeContents(span);
          return Array.from(range.getClientRects()).map((rect) => rect.right);
        }),
      );

      return {
        innerWidth: inner.getBoundingClientRect().width,
        innerRight: inner.getBoundingClientRect().right,
        titleTextRight,
        columns: getComputedStyle(grid).gridTemplateColumns.trim().split(/\s+/).length,
        cardBoxes,
        backgrounds: cards.map((card) => getComputedStyle(card).backgroundColor),
        titleColors: titleSpans.map((span) => getComputedStyle(span).color),
        titleLineCounts,
      };
    });
    expect(layout.titleTextRight).toBeLessThanOrEqual(layout.innerRight + 1);
    expect(layout.columns).toBe(2);
    expect(layout.cardBoxes[0].width).toBeCloseTo(layout.cardBoxes[1].width, 0);
    expect(layout.cardBoxes[1].left - layout.cardBoxes[0].right).toBeCloseTo(24, 0);
    expect(layout.backgrounds).toEqual([
      "rgb(244, 248, 246)",
      "rgb(16, 23, 21)",
      "rgb(15, 71, 67)",
      "rgb(244, 248, 246)",
    ]);
    expect(layout.titleColors).toEqual(["rgb(15, 71, 67)", "rgb(16, 23, 21)"]);
    expect(layout.titleLineCounts).toEqual([1, 1]);
  });

  test("should stack the cards inside the grid without phone overflow", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await openPage(page);

    const section = page.getByTestId("solutions-section");
    const layout = await section.evaluate((element) => {
      const grid = element.querySelector<HTMLElement>('[data-testid="solutions-grid"]');
      const cards = Array.from(
        element.querySelectorAll<HTMLElement>('[data-testid="solution-card"]'),
      );

      if (!grid || cards.length !== 4) {
        throw new Error("Mobile solutions section geometry is unavailable");
      }

      return {
        columns: getComputedStyle(grid).gridTemplateColumns.trim().split(/\s+/).length,
        cardWidths: cards.map((card) => Math.round(card.getBoundingClientRect().width)),
        sectionRight: element.getBoundingClientRect().right,
        viewportWidth: window.innerWidth,
      };
    });

    expect(layout.columns).toBe(1);
    expect(layout.cardWidths.every((width) => width <= 358)).toBe(true);
    expect(layout.sectionRight).toBeLessThanOrEqual(layout.viewportWidth);
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(
      390,
    );
    await expect(section.getByRole("link", { name: /About Zypher/ })).toHaveAttribute(
      "href",
      "/about",
    );
  });

  test("should preserve a bounded two-column frame at 4K", async ({ page }) => {
    await page.setViewportSize({ width: 3840, height: 2160 });
    await openPage(page);

    const geometry = await page.getByTestId("solutions-section").evaluate((element) => {
      const inner = element.querySelector<HTMLElement>('[data-testid="solutions-inner"]');
      const cards = Array.from(
        element.querySelectorAll<HTMLElement>('[data-testid="solution-card"]'),
      );
      const titleSpans = Array.from(
        element.querySelectorAll<HTMLElement>('[data-testid="solutions-title"] > span'),
      );

      if (!inner || cards.length !== 4 || titleSpans.length !== 2) {
        throw new Error("4K solutions section geometry is unavailable");
      }

      const titleLineCounts = titleSpans.map((span) => {
        const range = document.createRange();
        range.selectNodeContents(span);
        return range.getClientRects().length;
      });

      const titleTextRight = Math.max(
        ...titleSpans.flatMap((span) => {
          const range = document.createRange();
          range.selectNodeContents(span);
          return Array.from(range.getClientRects()).map((rect) => rect.right);
        }),
      );

      return {
        innerWidth: inner.getBoundingClientRect().width,
        innerRight: inner.getBoundingClientRect().right,
        titleTextRight,
        cardWidths: cards.map((card) => card.getBoundingClientRect().width),
        titleLineCounts,
      };
    });

    expect(geometry.innerWidth).toBeCloseTo(1440, 0);
    expect(geometry.titleTextRight).toBeLessThanOrEqual(geometry.innerRight + 1);
    expect(geometry.cardWidths[0]).toBeCloseTo(geometry.cardWidths[1], 0);
    expect(geometry.titleLineCounts).toEqual([1, 1]);
  });
  test("should center only the heading on tablet", async ({ page }) => {
    await page.setViewportSize({ width: 1024, height: 768 });
    await openPage(page);

    const section = page.getByTestId("solutions-section");
    const innerBox = await section.locator('[data-testid="solutions-inner"]').boundingBox();
    const titleBox = await section.locator('[data-testid="solutions-title"]').boundingBox();
    if (!innerBox || !titleBox) {
      throw new Error("Tablet heading geometry is unavailable");
    }

    expect(titleBox.x + titleBox.width / 2).toBeCloseTo(innerBox.x + innerBox.width / 2, 0);
    await expect(section.locator('[data-testid="solutions-title"]')).toHaveCSS(
      "text-align",
      "center",
    );
    await expect(section.locator('[data-testid="solutions-subtitle"]')).toHaveCSS(
      "text-align",
      "right",
    );
  });
  test("should keep the heading inside the grid on smaller tablets", async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await openPage(page);

    const bounds = await page.getByTestId("solutions-section").evaluate((element) => {
      const inner = element.querySelector<HTMLElement>('[data-testid="solutions-inner"]');
      const title = element.querySelector<HTMLElement>('[data-testid="solutions-title"]');
      if (!inner || !title) {
        throw new Error("Tablet heading bounds are unavailable");
      }

      const titleRects = Array.from(title.querySelectorAll<HTMLElement>("span")).flatMap((span) => {
        const range = document.createRange();
        range.selectNodeContents(span);
        return Array.from(range.getClientRects());
      });
      const innerBox = inner.getBoundingClientRect();
      return {
        innerLeft: innerBox.left,
        innerRight: innerBox.right,
        titleLeft: Math.min(...titleRects.map((rect) => rect.left)),
        titleRight: Math.max(...titleRects.map((rect) => rect.right)),
      };
    });

    expect(bounds.titleLeft).toBeGreaterThanOrEqual(bounds.innerLeft - 1);
    expect(bounds.titleRight).toBeLessThanOrEqual(bounds.innerRight + 1);
  });
});
