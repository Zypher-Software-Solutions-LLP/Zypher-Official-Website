import { expect, test } from "@playwright/test";
import { openPage } from "./helpers/site";

test.describe("responsive homepage hero", () => {
  test("should cover the desktop illustration and keep the copy within the grid at 4K", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 3840, height: 2160 });
    await openPage(page);
    await page.waitForTimeout(1300);

    const layout = await page.evaluate(() => {
      const read = (selector: string): { width: number; height: number; bottom: number } => {
        const element = document.querySelector<HTMLElement>(selector);
        if (!element) {
          throw new Error(`Missing element: ${selector}`);
        }
        const rect = element.getBoundingClientRect();
        return { width: rect.width, height: rect.height, bottom: rect.bottom };
      };

      const title = document.querySelector<HTMLElement>('[data-testid="hero-title"]');
      const description = document.querySelector<HTMLElement>('[data-testid="hero-description"]');
      const button = document.querySelector<HTMLElement>('[data-testid="hero-actions"] a');
      const logo = document.querySelector<HTMLElement>('[data-testid="site-header-logo"]');
      if (!title || !description || !button || !logo) {
        throw new Error("Missing responsive hero element");
      }

      return {
        background: read('[data-testid="hero-background"]'),
        titleFontSize: Number.parseFloat(getComputedStyle(title).fontSize),
        descriptionFontSize: Number.parseFloat(getComputedStyle(description).fontSize),
        buttonFontSize: Number.parseFloat(getComputedStyle(button).fontSize),
        logoWidth: logo.getBoundingClientRect().width,
        headerWidth: read('[data-testid="site-header-inner"]').width,
      };
    });

    expect(layout.background.width).toBeCloseTo(3840, 0);
    expect(layout.background.height).toBeCloseTo(2160, 0);
    expect(layout.titleFontSize).toBeGreaterThan(56);
    expect(layout.descriptionFontSize).toBeGreaterThanOrEqual(16);
    expect(layout.buttonFontSize).toBeGreaterThan(14);
    expect(layout.logoWidth).toBeGreaterThan(112);
    expect(layout.headerWidth).toBeGreaterThan(700);
    expect(layout.headerWidth).toBeLessThan(1100);
  });

  test("should select the mobile hero artwork on phone and portrait-tablet viewports", async ({
    page,
  }) => {
    for (const viewport of [
      { width: 390, height: 844 },
      { width: 768, height: 1024 },
      { width: 1024, height: 1366 },
    ]) {
      await page.setViewportSize(viewport);
      await openPage(page);

      await expect(page.getByTestId("hero-background-picture").locator("source")).toHaveAttribute(
        "srcset",
        /Background%20Mobile%20Image\.png/,
      );
      await expect
        .poll(() =>
          page.getByTestId("hero-background-image").evaluate((image) => {
            if (!(image instanceof HTMLImageElement)) {
              throw new Error("Hero background is not an image element");
            }

            return image.currentSrc;
          }),
        )
        .toContain("Background%20Mobile%20Image.png");
    }
  });

  test("should center the copy inside the artwork quiet zone across supported viewports", async ({
    page,
  }) => {
    for (const viewport of [
      { width: 375, height: 667 },
      { width: 390, height: 844 },
      { width: 768, height: 1024 },
      { width: 1024, height: 1366 },
      { width: 1440, height: 900 },
    ]) {
      await page.setViewportSize(viewport);
      await openPage(page);

      const centerOffsetRatio = await page.evaluate(() => {
        const hero = document.querySelector<HTMLElement>('[data-testid="hero-section"]');
        const title = document.querySelector<HTMLElement>('[data-testid="hero-title"]');
        const copy = title?.parentElement;
        if (!hero || !copy) {
          throw new Error("Missing hero copy elements");
        }

        const heroRect = hero.getBoundingClientRect();
        const copyRect = copy.getBoundingClientRect();
        const heroCenter = heroRect.top + heroRect.height / 2;
        const copyCenter = copyRect.top + copyRect.height / 2;

        return Math.abs(copyCenter - heroCenter) / heroRect.height;
      });

      expect(centerOffsetRatio).toBeLessThan(0.04);
    }
  });

  test("should overscan and lower the artwork without exposing its edges", async ({ page }) => {
    for (const viewport of [
      { width: 390, height: 844 },
      { width: 1440, height: 900 },
    ]) {
      await page.setViewportSize(viewport);
      await openPage(page);

      const layout = await page.evaluate(() => {
        const hero = document.querySelector<HTMLElement>('[data-testid="hero-section"]');
        const picture = document.querySelector<HTMLElement>(
          '[data-testid="hero-background-picture"]',
        );
        if (!hero || !picture) {
          throw new Error("Missing hero artwork elements");
        }

        const heroRect = hero.getBoundingClientRect();
        const pictureRect = picture.getBoundingClientRect();

        return {
          backgroundColor: getComputedStyle(hero).backgroundColor,
          bottomCoverage: pictureRect.bottom - heroRect.bottom,
          centerOffsetRatio:
            (pictureRect.top + pictureRect.height / 2 - (heroRect.top + heroRect.height / 2)) /
            heroRect.height,
          topCoverage: heroRect.top - pictureRect.top,
          widthRatio: pictureRect.width / heroRect.width,
        };
      });

      expect(layout.widthRatio).toBeGreaterThan(1.025);
      expect(layout.bottomCoverage).toBeGreaterThan(0);

      if (viewport.width < 900) {
        expect(layout.backgroundColor).toBe("rgb(255, 255, 255)");
        expect(layout.centerOffsetRatio).toBeGreaterThan(viewport.width < 480 ? 0.13 : 0.06);
      } else {
        expect(layout.centerOffsetRatio).toBeGreaterThan(0.005);
        expect(layout.topCoverage).toBeGreaterThanOrEqual(0);
      }
    }
  });

  test("should fade the artwork into the following section", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await openPage(page);

    const fade = await page.getByTestId("hero-background").evaluate((background) => {
      const style = getComputedStyle(background, "::after");
      return {
        backgroundImage: style.backgroundImage,
        bottom: style.bottom,
        height: Number.parseFloat(style.height),
      };
    });

    expect(fade.backgroundImage).toContain("linear-gradient");
    expect(fade.bottom).toBe("0px");
    expect(fade.height).toBeGreaterThanOrEqual(64);
  });

  test("should keep short-phone copy compact with sufficient bottom clearance", async ({
    page,
  }) => {
    const viewport = { width: 375, height: 667 };
    await page.setViewportSize(viewport);
    await openPage(page);

    const layout = await page.evaluate(() => {
      const title = document.querySelector<HTMLElement>('[data-testid="hero-title"]');
      const actions = document.querySelector<HTMLElement>('[data-testid="hero-actions"]');
      const hero = document.querySelector<HTMLElement>('[data-testid="hero-section"]');
      if (!title || !actions || !hero) {
        throw new Error("Missing compact hero elements");
      }

      return {
        bottomClearanceRatio:
          (hero.getBoundingClientRect().bottom - actions.getBoundingClientRect().bottom) /
          hero.getBoundingClientRect().height,
        titleFontSize: Number.parseFloat(getComputedStyle(title).fontSize),
      };
    });

    expect(layout.titleFontSize).toBeLessThanOrEqual(28);
    expect(layout.bottomClearanceRatio).toBeGreaterThan(0.2);
  });
  test("should fill the phone viewport with the mobile illustration", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await openPage(page);
    await page.waitForTimeout(1300);

    const layout = await page.evaluate(() => {
      const background = document.querySelector<HTMLElement>('[data-testid="hero-background"]');
      const image = document.querySelector<HTMLElement>('[data-testid="hero-background-image"]');
      if (!background || !image) {
        throw new Error("Missing responsive background illustration element");
      }

      const backgroundRect = background.getBoundingClientRect();
      return {
        backgroundRatio: backgroundRect.width / backgroundRect.height,
        backgroundColor: getComputedStyle(
          document.querySelector<HTMLElement>('[data-testid="hero-section"]')!,
        ).backgroundColor,
        objectFit: getComputedStyle(image).objectFit,
      };
    });

    expect(layout.backgroundRatio).toBeCloseTo(390 / 844, 2);
    expect(layout.backgroundColor).toBe("rgb(255, 255, 255)");
    expect(layout.objectFit).toBe("cover");
  });

  test("should preserve the headline and supporting-copy rhythm across desktop sizes", async ({
    page,
  }) => {
    for (const viewport of [
      { width: 1440, height: 890 },
      { width: 3840, height: 2160 },
    ]) {
      await page.setViewportSize(viewport);
      await openPage(page);

      const layout = await page.evaluate(() => {
        const lineCount = (selector: string): number => {
          const element = document.querySelector<HTMLElement>(selector);
          if (!element) {
            throw new Error(`Missing text element: ${selector}`);
          }
          const range = document.createRange();
          range.selectNodeContents(element);
          return new Set([...range.getClientRects()].map((rect) => Math.round(rect.top))).size;
        };
        const accent = document.querySelector<HTMLElement>('[data-testid="hero-title-accent"]');
        const mainLineElements = document.querySelectorAll<HTMLElement>(
          '[data-testid="hero-title-main"] > span',
        );
        const nav = document.querySelector<HTMLElement>('[data-testid="site-header-nav-list"]');
        const navContainer = document.querySelector<HTMLElement>('[data-testid="site-header-nav"]');
        const activeLink = document.querySelector<HTMLElement>('[aria-current="page"]');
        const logo = document.querySelector<HTMLElement>('[data-testid="site-header-logo"]');
        const header = document.querySelector<HTMLElement>('[data-testid="site-header-inner"]');
        const headerRoot = document.querySelector<HTMLElement>('[data-testid="site-header"]');
        if (
          !accent ||
          mainLineElements.length !== 2 ||
          !nav ||
          !navContainer ||
          !activeLink ||
          !logo ||
          !header ||
          !headerRoot
        ) {
          throw new Error("Missing title or navigation element");
        }

        const navStyle = getComputedStyle(nav);
        return {
          gradientDirection: getComputedStyle(accent)
            .getPropertyValue("--hero-title-gradient-direction")
            .trim(),
          accentLines: lineCount('[data-testid="hero-title-accent"]'),
          mainLineCounts: [...mainLineElements].map((element) => {
            const range = document.createRange();
            range.selectNodeContents(element);
            return new Set([...range.getClientRects()].map((rect) => Math.round(rect.top))).size;
          }),
          descriptionLines: lineCount('[data-testid="hero-description"]'),
          navJustification: navStyle.justifyContent,
          navGap: navStyle.columnGap,
          navWidth: navContainer.getBoundingClientRect().width,
          navX: navContainer.getBoundingClientRect().x,
          activeX: activeLink.getBoundingClientRect().x,
          activeWidth: activeLink.getBoundingClientRect().width,
          activeHeight: activeLink.getBoundingClientRect().height,
          headerHeight: header.getBoundingClientRect().height,
          logoWidth: logo.getBoundingClientRect().width,
          headerWidth: header.getBoundingClientRect().width,
          headerTop: headerRoot.getBoundingClientRect().top,
        };
      });

      expect(layout.gradientDirection).toBe("180deg");
      expect(layout.accentLines).toBe(1);
      expect(layout.mainLineCounts).toEqual([1, 1]);
      expect(layout.descriptionLines).toBe(3);

      if (viewport.width === 1440) {
        expect(layout.navJustification).toBe("flex-start");
        expect(Number.parseFloat(layout.navGap)).toBe(0);
        expect(layout.logoWidth).toBeCloseTo(110, 0);
        expect(layout.headerWidth).toBeGreaterThan(720);
        expect(layout.headerWidth).toBeLessThan(760);
        expect(layout.navWidth).toBeCloseTo(480, 0);
        expect(layout.activeX).toBeCloseTo(layout.navX, 0);
        expect(layout.activeWidth).toBeCloseTo(80, 0);
        expect(layout.activeHeight).toBeCloseTo(30, 0);
        expect(layout.headerHeight).toBeCloseTo(50, 0);
        expect(layout.headerTop).toBeGreaterThan(16);
      }
    }
  });
});
