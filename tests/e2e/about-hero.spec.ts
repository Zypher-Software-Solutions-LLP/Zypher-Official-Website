import { expect, test } from "@playwright/test";
import { openPage } from "./helpers/site";

test.describe("About hero section", () => {
  test("should keep the desktop About hero within the shared grid and crop the enlarged artwork", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await openPage(page, "/about");
    await expect(page.getByTestId("about-hero-illustration")).toHaveCSS("opacity", "1");

    const layout = await page.evaluate(() => {
      const hero = document.querySelector<HTMLElement>('[data-testid="about-hero"]');
      const grid = document.querySelector<HTMLElement>('[data-testid="about-hero-grid"]');
      const illustration = document.querySelector<HTMLElement>(
        '[data-testid="about-hero-illustration"]',
      );
      const image = illustration?.querySelector<HTMLImageElement>("img");
      const background = document.querySelector<HTMLElement>(
        '[data-testid="about-hero-background"]',
      );

      if (
        !hero ||
        !grid ||
        !illustration ||
        !image ||
        !background ||
        !hero.querySelector<HTMLAnchorElement>('a[href="/contact"]')
      ) {
        throw new Error("Missing About hero geometry");
      }

      const imageRect = image.getBoundingClientRect();
      const heroRect = hero.getBoundingClientRect();
      const illustrationRect = illustration.getBoundingClientRect();

      return {
        gridWidth: grid.getBoundingClientRect().width,
        illustrationDisplay: getComputedStyle(illustration).display,
        illustrationOpacity: getComputedStyle(illustration).opacity,
        imageWidth: imageRect.width,
        imageTop: imageRect.top,
        imageBottom: imageRect.bottom,
        illustrationBottom: illustrationRect.bottom,
        heroBottom: heroRect.bottom,
        heroBackground: getComputedStyle(hero).backgroundColor,
        backgroundSource: background.getAttribute("data-image-src"),
        primaryButtonBackground: getComputedStyle(
          hero.querySelector<HTMLAnchorElement>('a[href="/contact"]')!,
        ).backgroundColor,
        primaryButtonColor: getComputedStyle(
          hero.querySelector<HTMLAnchorElement>('a[href="/contact"]')!,
        ).color,
        primaryButtonOpacity: getComputedStyle(
          hero.querySelector<HTMLAnchorElement>('a[href="/contact"]')!,
        ).opacity,
      };
    });

    expect(layout.gridWidth).toBeGreaterThan(1000);
    expect(layout.gridWidth).toBeLessThan(1200);
    expect(layout.illustrationDisplay).not.toBe("none");
    expect(Number(layout.illustrationOpacity)).toBeGreaterThan(0.95);
    expect(layout.imageWidth).toBeGreaterThan(600);
    expect(layout.imageTop).toBeLessThan(132);
    expect(Math.abs(layout.illustrationBottom - layout.heroBottom)).toBeLessThanOrEqual(1);
    expect(layout.heroBackground).toBe("rgb(244, 248, 246)");
    expect(layout.backgroundSource).toBe("/home/section-1/background-illustration.png");
    expect(layout.primaryButtonBackground).toBe("rgb(21, 193, 150)");
    expect(layout.primaryButtonColor).toBe("rgb(16, 23, 21)");
    expect(layout.primaryButtonOpacity).toBe("1");
  });

  test("should center the tablet copy over a readable low-opacity illustration", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await openPage(page, "/about");

    const layout = await page.evaluate(() => {
      const copy = document.querySelector<HTMLElement>('[class*="aboutHeroCopy"]');
      const illustration = document.querySelector<HTMLElement>(
        '[data-testid="about-hero-illustration"]',
      );
      const hero = document.querySelector<HTMLElement>('[data-testid="about-hero"]');

      if (!copy || !illustration || !hero) {
        throw new Error("Missing tablet About hero geometry");
      }

      return {
        copyAlignment: getComputedStyle(copy).textAlign,
        illustrationPosition: getComputedStyle(illustration).position,
        illustrationOpacity: getComputedStyle(illustration).opacity,
        illustrationTop: illustration.getBoundingClientRect().top,
        illustrationBottom: illustration.getBoundingClientRect().bottom,
        imageBottom: illustration.querySelector<HTMLImageElement>("img")!.getBoundingClientRect()
          .bottom,
        heroBottom: hero.getBoundingClientRect().bottom,
      };
    });

    expect(layout.copyAlignment).toBe("center");
    expect(layout.illustrationPosition).toBe("absolute");
    expect(Number(layout.illustrationOpacity)).toBeCloseTo(0.3, 1);
    expect(layout.illustrationTop).toBeGreaterThan(120);
    expect(layout.illustrationBottom).toBeGreaterThan(layout.heroBottom + 112);
    expect(layout.imageBottom).toBeGreaterThan(layout.heroBottom + 112);
  });

  test("should center the mobile copy and close the hero artwork at the next section", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await openPage(page, "/about");

    const layout = await page.evaluate(() => {
      const hero = document.querySelector<HTMLElement>('[data-testid="about-hero"]');
      const copy = document.querySelector<HTMLElement>('[class*="aboutHeroCopy"]');
      const illustration = document.querySelector<HTMLElement>(
        '[data-testid="about-hero-illustration"]',
      );
      const story = document.querySelector<HTMLElement>('[data-testid="about-story"]');

      if (!hero || !copy || !illustration || !story) {
        throw new Error("Missing mobile About hero geometry");
      }

      return {
        copyAlignment: getComputedStyle(copy).textAlign,
        illustrationWidth: illustration.getBoundingClientRect().width,
        illustrationTop: illustration.getBoundingClientRect().top,
        illustrationBottom: illustration.getBoundingClientRect().bottom,
        imageBottom: illustration.querySelector<HTMLImageElement>("img")!.getBoundingClientRect()
          .bottom,
        heroBottom: hero.getBoundingClientRect().bottom,
        storyTop: story.getBoundingClientRect().top,
        primaryButtonBackground: getComputedStyle(
          hero.querySelector<HTMLAnchorElement>('a[href="/contact"]')!,
        ).backgroundColor,
        primaryButtonOpacity: getComputedStyle(
          hero.querySelector<HTMLAnchorElement>('a[href="/contact"]')!,
        ).opacity,
      };
    });

    expect(layout.copyAlignment).toBe("center");
    expect(layout.illustrationWidth).toBeLessThan(360);
    expect(layout.illustrationTop).toBeGreaterThan(190);
    expect(layout.illustrationBottom).toBeGreaterThan(layout.heroBottom + 92);
    expect(layout.imageBottom).toBeGreaterThan(layout.heroBottom + 92);
    expect(Math.abs(layout.storyTop - layout.heroBottom)).toBeLessThanOrEqual(1);
    expect(layout.primaryButtonBackground).toBe("rgb(21, 193, 150)");
    expect(layout.primaryButtonOpacity).toBe("1");
  });
});
