import { expect, test } from "@playwright/test";
import { openPage } from "./helpers/site";

test.describe("AI & LLM Automation capabilities section", () => {
  test("should render full-width wave boundaries around its dark surface on desktop and mobile", async ({
    page,
  }) => {
    for (const viewport of [
      { width: 1440, height: 900 },
      { width: 2048, height: 1152 },
      { width: 820, height: 1180 },
      { width: 390, height: 844 },
      { width: 320, height: 720 },
    ]) {
      await page.setViewportSize(viewport);
      await openPage(page, "/services/ai-llm-automation");

      const section = page.getByTestId("ai-llm-section-three");
      const waveLayout = await section.evaluate((element) => {
        const topBoundary = element.querySelector<SVGSVGElement>(
          "[data-testid='ai-llm-section-three-boundary-top']",
        );
        const bottomBoundary = element.querySelector<SVGSVGElement>(
          "[data-testid='ai-llm-section-three-boundary-bottom']",
        );
        const surface = element.querySelector<HTMLElement>(
          "[data-testid='ai-llm-section-three-surface']",
        );

        if (!topBoundary || !bottomBoundary || !surface) {
          throw new Error("Section 3 is missing its wave boundaries or center surface");
        }

        const sectionRect = element.getBoundingClientRect();
        const topRect = topBoundary.getBoundingClientRect();
        const bottomRect = bottomBoundary.getBoundingClientRect();
        const surfaceRect = surface.getBoundingClientRect();
        const topPath = topBoundary.querySelector("path");
        const bottomPath = bottomBoundary.querySelector("path");

        return {
          sectionWidth: sectionRect.width,
          topWidth: topRect.width,
          bottomWidth: bottomRect.width,
          topPosition: topRect.top - sectionRect.top,
          bottomPosition: sectionRect.bottom - bottomRect.bottom,
          boundaryHeight: topRect.height,
          surfaceHeight: surfaceRect.height,
          surfaceColor: getComputedStyle(surface).backgroundColor,
          topWaveColor: topPath ? getComputedStyle(topPath).fill : "",
          bottomWaveColor: bottomPath ? getComputedStyle(bottomPath).fill : "",
          sectionColor: getComputedStyle(element).backgroundColor,
          documentWidth: document.documentElement.scrollWidth,
          viewportWidth: document.documentElement.clientWidth,
        };
      });

      expect(waveLayout.topWidth).toBe(waveLayout.sectionWidth);
      expect(waveLayout.bottomWidth).toBe(waveLayout.sectionWidth);
      expect(waveLayout.topPosition).toBe(0);
      expect(waveLayout.bottomPosition).toBe(0);
      expect(waveLayout.boundaryHeight).toBeGreaterThan(0);
      expect(waveLayout.surfaceHeight).toBeGreaterThan(0);
      expect(waveLayout.topWaveColor).toBe(waveLayout.surfaceColor);
      expect(waveLayout.bottomWaveColor).toBe(waveLayout.surfaceColor);
      expect(waveLayout.sectionColor).not.toBe(waveLayout.surfaceColor);
      expect(waveLayout.documentWidth).toBeLessThanOrEqual(waveLayout.viewportWidth);
    }
  });

  test("should provide more space above and below the section content at each size", async ({
    page,
  }) => {
    const viewports = [
      { width: 1440, height: 900, minTop: 84, minBottom: 144, minSectionHeight: 1024 },
      { width: 820, height: 1180, minTop: 64, minBottom: 96, minSectionHeight: 0 },
      { width: 390, height: 844, minTop: 68, minBottom: 84, minSectionHeight: 0 },
      { width: 320, height: 720, minTop: 68, minBottom: 84, minSectionHeight: 0 },
    ];

    for (const viewport of viewports) {
      await page.setViewportSize(viewport);
      await openPage(page, "/services/ai-llm-automation");

      const section = page.getByTestId("ai-llm-section-three");
      const spacing = await section.evaluate((element) => {
        const shell = element.querySelector<HTMLElement>("[class*='shell']");

        if (!shell) {
          throw new Error("Section 3 is missing its content shell");
        }

        const sectionRect = element.getBoundingClientRect();
        const shellStyle = getComputedStyle(shell);

        return {
          sectionHeight: sectionRect.height,
          topPadding: Number.parseFloat(shellStyle.paddingTop),
          bottomPadding: Number.parseFloat(shellStyle.paddingBottom),
        };
      });

      expect(spacing.topPadding).toBeGreaterThanOrEqual(viewport.minTop);
      expect(spacing.bottomPadding).toBeGreaterThanOrEqual(viewport.minBottom);
      expect(spacing.sectionHeight).toBeGreaterThanOrEqual(viewport.minSectionHeight);
    }
  });

  test("should give the capability cards more height across device sizes", async ({ page }) => {
    const viewports = [
      { width: 1440, height: 900, minCardHeight: 280 },
      { width: 820, height: 1180, minCardHeight: 280 },
      { width: 390, height: 844, minCardHeight: 300 },
      { width: 320, height: 720, minCardHeight: 280 },
    ];

    for (const viewport of viewports) {
      await page.setViewportSize(viewport);
      await openPage(page, "/services/ai-llm-automation");

      const section = page.getByTestId("ai-llm-section-three");
      const cardHeights = await section
        .getByTestId("ai-llm-section-three-cards")
        .locator(":scope > article")
        .evaluateAll((cards) => cards.map((card) => card.getBoundingClientRect().height));

      expect(cardHeights).toHaveLength(6);
      expect(Math.min(...cardHeights)).toBeGreaterThanOrEqual(viewport.minCardHeight);
    }
  });

  test("should use a compact, single-line Get in touch CTA sized to its label", async ({
    page,
  }) => {
    for (const viewport of [
      { width: 1440, height: 900 },
      { width: 390, height: 844 },
      { width: 320, height: 720 },
    ]) {
      await page.setViewportSize(viewport);
      await openPage(page, "/services/ai-llm-automation");

      const section = page.getByTestId("ai-llm-section-three");
      const cta = section.getByRole("link").last();
      expect(await cta.innerText()).toBe("Get in touch");

      const ctaLayout = await cta.evaluate((element) => {
        if (!(element instanceof HTMLElement)) {
          throw new Error("The CTA element is not an HTML link");
        }

        const cardBody = element.parentElement;

        if (!cardBody) {
          throw new Error("The CTA is missing its card body");
        }

        return {
          fontSize: Number.parseFloat(getComputedStyle(element).fontSize),
          height: element.getBoundingClientRect().height,
          width: element.getBoundingClientRect().width,
          cardBodyWidth: cardBody.clientWidth,
        };
      });

      expect(ctaLayout.fontSize).toBeLessThanOrEqual(12);
      expect(ctaLayout.height).toBeGreaterThanOrEqual(40);
      expect(ctaLayout.height).toBeLessThanOrEqual(44);
      expect(ctaLayout.width).toBeLessThanOrEqual(112);
      expect(ctaLayout.width).toBeLessThanOrEqual(ctaLayout.cardBodyWidth);
    }
  });
});
