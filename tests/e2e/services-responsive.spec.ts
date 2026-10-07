import { expect, test } from "@playwright/test";
import { openPage } from "./helpers/site";

test.describe("responsive Services hero", () => {
  test("should keep the desktop heading to three lines and reveal the full composition at common PC widths", async ({
    page,
  }) => {
    for (const viewport of [1440, 1920, 2560, 3840]) {
      await page.setViewportSize({ width: viewport, height: 900 });
      await openPage(page, "/services");

      const layout = await page.evaluate(() => {
        const title = document.querySelector<HTMLElement>('[data-testid="services-hero-title"]');
        const grid = document.querySelector<HTMLElement>('[data-testid="services-hero-grid"]');
        const illustration = document.querySelector<HTMLElement>(
          '[data-testid="services-hero-illustration"]',
        );
        const surface = document.querySelector<HTMLElement>(
          '[data-testid="services-hero-surface"]',
        );
        const eyebrow = document.querySelector<HTMLElement>(
          '[data-testid="services-hero-eyebrow"]',
        );
        const description = document.querySelector<HTMLElement>(
          '[data-testid="services-hero-description"]',
        );
        const actions = document.querySelector<HTMLElement>(
          '[data-testid="services-hero-actions"]',
        );

        if (!title || !grid || !illustration || !surface || !eyebrow || !description || !actions) {
          throw new Error("Missing Services hero geometry");
        }

        const titleLines = [...title.querySelectorAll<HTMLElement>(":scope > span")];

        return {
          titleLineRects: titleLines.map((line) => line.getClientRects().length),
          gridWidth: grid.getBoundingClientRect().width,
          illustrationDisplay: getComputedStyle(illustration).display,
          surfaceRadius: getComputedStyle(surface).borderBottomLeftRadius,
          animationNames: [eyebrow, ...titleLines, description, actions].map(
            (element) => getComputedStyle(element).animationName,
          ),
        };
      });

      expect(layout.titleLineRects).toEqual([1, 1, 1]);
      expect(layout.gridWidth).toBeGreaterThan(1000);
      expect(layout.gridWidth).toBeLessThan(1200);
      expect(layout.illustrationDisplay).not.toBe("none");
      expect(layout.surfaceRadius).not.toBe("0px");
      expect(layout.animationNames.every((name) => name.endsWith("services-hero-fade-in"))).toBe(
        true,
      );
    }
  });

  test("should retain the background illustration but hide the distracting artwork on mobile", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await openPage(page, "/services");

    await expect(page.getByTestId("services-hero-background")).toBeVisible();
    await expect(page.getByTestId("services-hero-illustration")).toBeHidden();
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  });

  test("should keep the mobile Services headline within three lines", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await openPage(page, "/services");

    const titleHeight = await page.getByTestId("services-hero-title").evaluate((title) => {
      const styles = getComputedStyle(title);
      return {
        height: title.getBoundingClientRect().height,
        lineHeight: Number.parseFloat(styles.lineHeight),
      };
    });

    expect(titleHeight.height / titleHeight.lineHeight).toBeLessThanOrEqual(3.1);
  });

  test("should preserve the main artwork on a roomy tablet viewport", async ({ page }) => {
    await page.setViewportSize({ width: 1024, height: 768 });
    await openPage(page, "/services");

    await expect(page.getByTestId("services-hero-illustration")).toBeVisible();
  });

  test("should keep the Services FAQ and shared CTA on the Services route", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await openPage(page, "/services");

    await expect(page.getByTestId("services-faq-section")).toBeVisible();
    await expect(page.getByTestId("cta-section")).toBeVisible();
    await expect(page.getByTestId("site-footer")).toBeVisible();
    await expect(
      page.getByTestId("site-header-nav-list").getByRole("link", { name: "Services" }),
    ).toHaveAttribute("aria-current", "page");
  });
  test("should keep a bounded footer viewport with a movable uncropped illustration", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 2560, height: 1440 });
    await openPage(page, "/services");

    const layers = await page.evaluate(async () => {
      const footer = document.querySelector<HTMLElement>('[data-testid="site-footer"]');
      const illustration = document.querySelector<HTMLElement>(
        '[data-testid="site-footer-illustration"]',
      );
      const image = illustration?.querySelector<HTMLImageElement>("img");
      const main = document.querySelector<HTMLElement>('[data-testid="site-footer-main"]');
      const meta = document.querySelector<HTMLElement>('[data-testid="site-footer-meta"]');

      if (!footer || !illustration || !image || !main || !meta) {
        throw new Error("Missing shared footer illustration layers");
      }

      const initialFooterRect = footer.getBoundingClientRect();
      const initialIllustrationRect = illustration.getBoundingClientRect();

      footer.style.setProperty("--site-footer-artwork-y", "2rem");
      await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));

      const shiftedFooterRect = footer.getBoundingClientRect();
      const shiftedIllustrationRect = illustration.getBoundingClientRect();
      footer.style.removeProperty("--site-footer-artwork-y");

      return {
        source: illustration.getAttribute("data-image-src"),
        imagePresent: Boolean(image),
        imageObjectFit: getComputedStyle(image).objectFit,
        imageObjectPosition: getComputedStyle(image).objectPosition,
        imageOpacity: getComputedStyle(image).opacity,
        illustrationPosition: getComputedStyle(illustration).position,
        illustrationOverflow: getComputedStyle(illustration).overflow,
        illustrationRatio: initialIllustrationRect.width / initialIllustrationRect.height,
        illustrationHeight: initialIllustrationRect.height,
        initialFooterHeight: initialFooterRect.height,
        shiftedFooterHeight: shiftedFooterRect.height,
        initialIllustrationTop: initialIllustrationRect.top,
        shiftedIllustrationTop: shiftedIllustrationRect.top,
        pointerEvents: getComputedStyle(illustration).pointerEvents,
        illustrationZIndex: getComputedStyle(illustration).zIndex,
        mainZIndex: getComputedStyle(main).zIndex,
        metaZIndex: getComputedStyle(meta).zIndex,
      };
    });

    expect(layers.source).toBe(
      "https://media.zypher-solutions.com/footer/Footer%20Illustration.webp",
    );
    expect(layers.imagePresent).toBe(true);
    expect(layers.imageObjectFit).toBe("contain");
    expect(layers.imageObjectPosition).toBe("50% 0%");
    expect(layers.imageOpacity).toBe("0.15");
    expect(layers.illustrationPosition).toBe("absolute");
    expect(layers.illustrationOverflow).toBe("visible");
    expect(layers.illustrationRatio).toBeCloseTo(1920 / 1088, 2);
    expect(layers.initialFooterHeight).toBeGreaterThan(600);
    expect(layers.initialFooterHeight).toBeLessThan(660);
    expect(layers.illustrationHeight).toBeGreaterThan(layers.initialFooterHeight);
    expect(layers.shiftedFooterHeight).toBeCloseTo(layers.initialFooterHeight, 1);
    const artworkOffset = layers.shiftedIllustrationTop - layers.initialIllustrationTop;
    expect(artworkOffset).toBeGreaterThan(0);
    expect(artworkOffset).toBeLessThan(320);
    expect(layers.pointerEvents).toBe("none");
    expect(layers.illustrationZIndex).toBe("0");
    expect(layers.mainZIndex).toBe("1");
    expect(layers.metaZIndex).toBe("1");
  });
});
