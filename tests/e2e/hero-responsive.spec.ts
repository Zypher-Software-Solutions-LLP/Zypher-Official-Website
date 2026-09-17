import { expect, test } from "@playwright/test";

test.describe("responsive homepage hero", () => {
  test("should scale the hero composition for a 4K viewport", async ({ page }) => {
    await page.setViewportSize({ width: 3840, height: 2160 });
    await page.goto("/");
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

      const title = document.querySelector<HTMLElement>(".hero-title");
      const description = document.querySelector<HTMLElement>(".hero-description");
      const button = document.querySelector<HTMLElement>(".hero-actions .button-link");
      const logo = document.querySelector<HTMLElement>(".site-header__logo");
      if (!title || !description || !button || !logo) {
        throw new Error("Missing responsive hero element");
      }

      return {
        subject: read(".hero-subject"),
        titleFontSize: Number.parseFloat(getComputedStyle(title).fontSize),
        descriptionFontSize: Number.parseFloat(getComputedStyle(description).fontSize),
        buttonFontSize: Number.parseFloat(getComputedStyle(button).fontSize),
        logoWidth: logo.getBoundingClientRect().width,
        headerWidth: read(".site-header__inner").width,
      };
    });

    expect(layout.subject.width).toBeGreaterThan(1800);
    expect(layout.subject.width).toBeLessThan(1950);
    expect(layout.subject.height).toBeGreaterThan(1700);
    expect(layout.subject.bottom).toBeGreaterThan(2100);
    expect(layout.titleFontSize).toBeGreaterThan(56);
    expect(layout.descriptionFontSize).toBeGreaterThanOrEqual(16);
    expect(layout.buttonFontSize).toBeGreaterThan(14);
    expect(layout.logoWidth).toBeGreaterThan(112);
    expect(layout.headerWidth).toBeGreaterThan(700);
    expect(layout.headerWidth).toBeLessThan(1100);
  });

  test("should select the mobile hero artwork on a phone viewport", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");

    await expect(page.locator(".hero-subject picture source")).toHaveAttribute(
      "srcset",
      /Hero%20section%20-%20Mobile\.png/,
    );
  });
  test("should preserve the subject aspect ratio on a phone viewport", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");
    await page.waitForTimeout(1300);

    const layout = await page.evaluate(() => {
      const subject = document.querySelector<HTMLElement>(".hero-subject");
      const crop = document.querySelector<HTMLElement>(".hero-subject-image-crop");
      const image = document.querySelector<HTMLElement>(".hero-subject-image");
      if (!subject || !crop || !image) {
        throw new Error("Missing subject illustration element");
      }

      const subjectRect = subject.getBoundingClientRect();
      const cropRect = crop.getBoundingClientRect();
      return {
        subjectRatio: subjectRect.width / subjectRect.height,
        cropRatio: cropRect.width / cropRect.height,
        objectFit: getComputedStyle(image).objectFit,
      };
    });

    expect(layout.subjectRatio).toBeCloseTo(390 / 844, 2);
    expect(layout.cropRatio).toBeCloseTo(390 / 844, 2);
    expect(layout.objectFit).toBe("contain");
  });

  test("should preserve two heading lines and two description lines across desktop sizes", async ({
    page,
  }) => {
    for (const viewport of [
      { width: 1440, height: 890 },
      { width: 3840, height: 2160 },
    ]) {
      await page.setViewportSize(viewport);
      await page.goto("/");

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
        const accent = document.querySelector<HTMLElement>(".hero-title-accent");
        const nav = document.querySelector<HTMLElement>(".site-header__nav-list");
        const navContainer = document.querySelector<HTMLElement>(".site-header__nav");
        const activeLink = document.querySelector<HTMLElement>(".site-header__link.is-active");
        const logo = document.querySelector<HTMLElement>(".site-header__logo");
        const header = document.querySelector<HTMLElement>(".site-header__inner");
        const headerRoot = document.querySelector<HTMLElement>(".site-header");
        if (!accent || !nav || !navContainer || !activeLink || !logo || !header || !headerRoot) {
          throw new Error("Missing title or navigation element");
        }

        const navStyle = getComputedStyle(nav);
        return {
          gradientDirection: getComputedStyle(accent)
            .getPropertyValue("--hero-title-gradient-direction")
            .trim(),
          accentLines: lineCount(".hero-title-accent"),
          mainLines: lineCount(".hero-title-main"),
          descriptionLines: lineCount(".hero-description"),
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
      expect(layout.mainLines).toBe(1);
      expect(layout.descriptionLines).toBe(2);

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
