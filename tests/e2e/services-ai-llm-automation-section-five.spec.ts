import { expect, test } from "@playwright/test";
import { openPage } from "./helpers/site";

test.describe("AI & LLM Automation deliverables section", () => {
  test("should reflow all six deliverables across desktop, tablet, and phone widths", async ({
    page,
  }) => {
    const viewports = [
      { width: 1440, height: 900, columns: 3 },
      { width: 1024, height: 768, columns: 3 },
      { width: 820, height: 1180, columns: 2 },
      { width: 768, height: 1024, columns: 2 },
      { width: 390, height: 844, columns: 1 },
      { width: 320, height: 720, columns: 1 },
    ];

    await page.setViewportSize(viewports[0]);
    await openPage(page, "/services/ai-llm-automation");
    const section = page.getByTestId("ai-llm-section-five");
    await section.scrollIntoViewIfNeeded();
    await expect
      .poll(
        () =>
          section
            .locator("img")
            .evaluateAll((images) =>
              images.every(
                (image) =>
                  image instanceof HTMLImageElement && image.complete && image.naturalWidth > 0,
              ),
            ),
        { message: "All six deliverable illustrations should load successfully" },
      )
      .toBe(true);

    for (const viewport of viewports) {
      await page.setViewportSize(viewport);
      const layout = await section.evaluate((element) => {
        const grid = element.querySelector<HTMLElement>("[data-testid='ai-llm-section-five-grid']");
        const cards = grid ? Array.from(grid.querySelectorAll<HTMLElement>("li")) : [];
        const leftPositions = new Set(
          cards.map((card) => Math.round(card.getBoundingClientRect().left)),
        );

        return {
          cardCount: cards.length,
          columnCount: leftPositions.size,
          cardsFitContent: cards.every((card) => card.scrollHeight <= card.clientHeight + 1),
          documentWidth: document.documentElement.scrollWidth,
          viewportWidth: document.documentElement.clientWidth,
        };
      });

      expect(layout.cardCount).toBe(6);
      expect(layout.columnCount).toBe(viewport.columns);
      expect(layout.cardsFitContent).toBe(true);
      expect(layout.documentWidth).toBeLessThanOrEqual(layout.viewportWidth);
    }
  });

  test("should keep the rounded teal frame on the light brand surface", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await openPage(page, "/services/ai-llm-automation");

    const section = page.getByTestId("ai-llm-section-five");
    const frame = page.getByTestId("ai-llm-section-five-surface");
    const colors = await section.evaluate((element) => {
      const surface = element.querySelector<HTMLElement>(
        "[data-testid='ai-llm-section-five-surface']",
      );

      if (!surface) {
        throw new Error("Section 5 is missing its teal surface");
      }

      return {
        sectionBackground: getComputedStyle(element).backgroundColor,
        surfaceBackground: getComputedStyle(surface).backgroundColor,
        topLeftRadius: Number.parseFloat(getComputedStyle(surface).borderTopLeftRadius),
      };
    });

    await expect(frame).toBeVisible();
    expect(colors.sectionBackground).toBe("rgb(244, 248, 246)");
    expect(colors.surfaceBackground).toBe("rgb(15, 71, 67)");
    expect(colors.topLeftRadius).toBeGreaterThanOrEqual(30);
  });

  test("should zoom each deliverable illustration slightly without escaping its frame", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await openPage(page, "/services/ai-llm-automation");

    const card = page.getByTestId("ai-llm-section-five-grid").locator("li").first();
    const image = card.getByRole("img");
    const artwork = image.locator("xpath=..");

    await card.hover();
    await expect
      .poll(() =>
        image.evaluate((element) => {
          const transform = getComputedStyle(element).transform;
          return transform === "none" ? 1 : new DOMMatrixReadOnly(transform).a;
        }),
      )
      .toBeGreaterThan(1);

    await expect
      .poll(() => artwork.evaluate((element) => getComputedStyle(element).overflow))
      .toBe("hidden");
  });
});
