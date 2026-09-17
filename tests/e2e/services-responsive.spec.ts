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

  test("should preserve the main artwork on a roomy tablet viewport", async ({ page }) => {
    await page.setViewportSize({ width: 1024, height: 768 });
    await openPage(page, "/services");

    await expect(page.getByTestId("services-hero-illustration")).toBeVisible();
  });

  test("should keep the service lines and shared CTA on the Services route", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await openPage(page, "/services");

    await expect(page.getByTestId("service-lines")).toBeVisible();
    await expect(page.getByTestId("cta-section")).toBeVisible();
    await expect(page.getByTestId("site-footer")).toBeVisible();
    await expect(
      page.getByTestId("site-header-nav-list").getByRole("link", { name: "Services" }),
    ).toHaveAttribute("aria-current", "page");
  });
  test("should keep the shared footer video behind footer content", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await openPage(page, "/services");

    const layers = await page.evaluate(() => {
      const footer = document.querySelector<HTMLElement>('[data-testid="site-footer"]');
      const video = document.querySelector<HTMLVideoElement>('[data-testid="footer-video"]');
      const illustration = document.querySelector<HTMLElement>(
        '[data-testid="site-footer-illustration"]',
      );
      const main = document.querySelector<HTMLElement>('[data-testid="site-footer-main"]');
      const meta = document.querySelector<HTMLElement>('[data-testid="site-footer-meta"]');

      if (!footer || !video || !illustration || !main || !meta) {
        throw new Error("Missing shared footer video layers");
      }

      return {
        source: video.getAttribute("src"),
        autoplay: video.autoplay,
        loop: video.loop,
        muted: video.muted,
        playsInline: video.playsInline,
        pointerEvents: getComputedStyle(video).pointerEvents,
        illustrationZIndex: getComputedStyle(illustration).zIndex,
        mainZIndex: getComputedStyle(main).zIndex,
        metaZIndex: getComputedStyle(meta).zIndex,
      };
    });

    expect(layers.source).toBe("https://media.zypher-solutions.com/footer/footer.mp4");
    expect(layers.autoplay).toBe(true);
    expect(layers.loop).toBe(true);
    expect(layers.muted).toBe(true);
    expect(layers.playsInline).toBe(true);
    expect(layers.pointerEvents).toBe("none");
    expect(layers.illustrationZIndex).toBe("0");
    expect(layers.mainZIndex).toBe("1");
    expect(layers.metaZIndex).toBe("1");
  });
});
