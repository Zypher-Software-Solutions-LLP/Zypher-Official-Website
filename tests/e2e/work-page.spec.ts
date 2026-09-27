import { expect, test } from "@playwright/test";
import { openPage } from "./helpers/site";

test.describe("Work page", () => {
  test("should keep the selected-work section responsive and filterable", async ({ page }) => {
    for (const viewport of [
      { width: 1440, height: 900 },
      { width: 1024, height: 768 },
      { width: 390, height: 844 },
    ]) {
      await page.setViewportSize(viewport);
      await openPage(page, "/work");
      const section = page.getByTestId("work-projects-section");
      await expect(section).toBeVisible();
      await expect(section.getByTestId("work-project-card")).toHaveCount(8);
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(
        viewport.width,
      );
      await section.getByRole("button", { name: "AI Automation" }).click();
      await expect(section.getByTestId("work-project-card")).toHaveCount(2);
      await expect(section.getByRole("button", { name: "AI Automation" })).toHaveAttribute(
        "aria-pressed",
        "true",
      );
      await section.getByRole("button", { name: "All" }).click();
      await expect(section.getByTestId("work-project-card")).toHaveCount(8);
    }
  });

  test("should stage the hero entrance and keep the inner copy inside the illustration", async ({
    page,
  }) => {
    for (const viewport of [
      { width: 390, height: 844 },
      { width: 414, height: 896 },
      { width: 768, height: 1024 },
      { width: 1366, height: 768 },
    ]) {
      await page.setViewportSize(viewport);
      await openPage(page, "/work");

      const hero = page.getByTestId("work-hero-section");
      const visual = page.getByTestId("work-hero-visual");
      const copy = page.getByTestId("work-hero-screen-copy");

      const eyebrow = hero.locator("p").first();
      const title = page.getByRole("heading", { name: /Every Project below/i });

      const metrics = await page.evaluate(() => {
        const visualElement = document.querySelector("[data-testid=work-hero-visual]");
        const copyElement = document.querySelector("[data-testid=work-hero-screen-copy]");
        const heroElement = document.querySelector("[data-testid=work-hero-section]");
        const projectsElement = document.querySelector("[data-testid=work-projects-section]");
        const eyebrowElement = document.querySelector("[data-testid=work-hero-section] p");
        const titleElement = document.querySelector("#work-hero-title");
        const descriptionElement = copyElement?.querySelector("p");
        if (
          !visualElement ||
          !copyElement ||
          !heroElement ||
          !projectsElement ||
          !eyebrowElement ||
          !titleElement ||
          !descriptionElement
        ) {
          throw new Error("Work hero geometry is unavailable");
        }

        const visualBox = visualElement.getBoundingClientRect();
        const copyBox = copyElement.getBoundingClientRect();
        const heroBox = heroElement.getBoundingClientRect();
        const projectsBox = projectsElement.getBoundingClientRect();
        const titleBox = titleElement.getBoundingClientRect();
        const descriptionBox = descriptionElement.getBoundingClientRect();
        const titleStyle = getComputedStyle(titleElement);
        const descriptionStyle = getComputedStyle(descriptionElement);
        const visualStyle = getComputedStyle(visualElement);
        const copyStyle = getComputedStyle(copyElement);
        const eyebrowStyle = getComputedStyle(eyebrowElement);
        const buttonElement = document.querySelector("[data-testid=work-hero-section] a");
        if (!buttonElement) throw new Error("Work hero button is unavailable");

        return {
          visualTop: visualBox.top,
          visualBottom: visualBox.bottom,
          copyTop: copyBox.top,
          copyBottom: copyBox.bottom,
          heroBottom: heroBox.bottom,
          projectsTop: projectsBox.top,
          visualWidth: visualBox.width,
          titleWidth: titleBox.width,
          titleFontSize: parseFloat(titleStyle.fontSize),
          buttonHeight: buttonElement.getBoundingClientRect().height,
          titleLines: Math.round(titleBox.height / parseFloat(titleStyle.lineHeight)),
          descriptionLines: Math.round(
            descriptionBox.height / parseFloat(descriptionStyle.lineHeight),
          ),
          visualAnimation: visualStyle.animationName,
          visualAnimationDuration: parseFloat(visualStyle.animationDuration),
          copyAnimation: copyStyle.animationName,
          copyAnimationDelay: parseFloat(copyStyle.animationDelay),
          eyebrowAnimation: eyebrowStyle.animationName,
          eyebrowAnimationDelay: parseFloat(eyebrowStyle.animationDelay),
        };
      });

      await expect(hero).toBeVisible();
      await expect(visual).toBeVisible();
      await expect(copy).toBeVisible();
      await expect(eyebrow).toBeVisible();
      await expect(title).toBeVisible();
      await expect(copy.locator("p")).toBeVisible();
      expect(metrics.copyTop).toBeGreaterThan(metrics.visualTop);
      expect(metrics.copyBottom).toBeLessThan(metrics.visualBottom);
      expect(metrics.titleLines).toBe(3);
      expect(metrics.visualAnimation).toContain("work-hero-visual-in");
      expect(metrics.copyAnimation).toContain("work-hero-screen-copy-in");
      expect(metrics.copyAnimationDelay).toBeLessThanOrEqual(0.2);
      expect(metrics.visualAnimationDuration).toBeGreaterThan(0.6);
      expect(metrics.eyebrowAnimation).toContain("work-hero-eyebrow-in");
      expect(metrics.eyebrowAnimationDelay).toBeLessThanOrEqual(0.2);
      if (viewport.width < 768) {
        expect(metrics.descriptionLines).toBe(3);
      }
      if (viewport.width === 390) {
        expect(metrics.titleFontSize).toBeLessThanOrEqual(26);
        expect(metrics.buttonHeight).toBeLessThanOrEqual(32);
        expect(metrics.titleWidth).toBeLessThanOrEqual(viewport.width * 0.7 + 1);
      }
      if (viewport.width === 768) {
        expect(metrics.visualWidth).toBeGreaterThan(640);
        expect(metrics.copyTop).toBeGreaterThan(190);
        expect(metrics.projectsTop).toBeLessThan(metrics.heroBottom);
      }
    }
  });
  test("should load General Sans for the Work hero heading", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await openPage(page, "/work");

    const fontState = await page
      .getByRole("heading", { name: /Every Project below/i })
      .evaluate(async (title) => {
        await document.fonts.ready;

        return {
          family: getComputedStyle(title).fontFamily,
          isLoaded:
            document.fonts.check("700 32px generalSans") ||
            document.fonts.check('700 32px "General Sans"'),
        };
      });

    expect(fontState.family).toMatch(/general\s*sans/i);
    expect(fontState.isLoaded).toBe(true);
  });

  test("should show the top of the first five images inside rounded shadowed media tiles", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await openPage(page, "/work");

    const section = page.getByTestId("work-projects-section");
    const sectionBox = await section.boundingBox();
    const boundary = section.getByTestId("work-projects-boundary-top");
    const boundaryBox = await boundary.boundingBox();
    if (!sectionBox || !boundaryBox) throw new Error("Work curve geometry is unavailable");

    expect(boundaryBox.y).toBeLessThanOrEqual(sectionBox.y);
    expect(boundaryBox.y + boundaryBox.height).toBeGreaterThan(sectionBox.y);
    await expect(section.getByTestId("work-projects-surface")).toHaveCSS(
      "background-color",
      "rgb(15, 71, 67)",
    );
    const cards = section.getByTestId("work-project-card");
    for (let index = 0; index < 8; index += 1) {
      const card = cards.nth(index);
      const image = card.locator("img");
      await expect(image).toHaveAttribute("data-image-quality", "100");
      await expect(image).toHaveAttribute("data-image-position", index < 6 ? "top" : "center");
    }

    const media = cards.first().locator("[class*='workProjectMedia']");
    await expect(media).toHaveCSS("border-radius", "30px");
    await expect(media).toHaveCSS("box-shadow", /-2px 5px 7px/);
  });

  test("should smoothly zoom a project image without blurring and highlight its title on hover", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await openPage(page, "/work");
    const card = page.getByTestId("work-project-card").first();
    await card.hover();
    await expect
      .poll(async () =>
        card.evaluate((element) => {
          const image = element.querySelector("img");
          const title = element.querySelector("h3");
          if (!image || !title) throw new Error("Work card internals are unavailable");
          const imageStyle = getComputedStyle(image);
          return {
            imageFilter: imageStyle.filter,
            imageTransform: imageStyle.transform,
            titleColor: getComputedStyle(title).color,
          };
        }),
      )
      .toEqual({
        imageFilter: "none",
        imageTransform: "matrix(1.045, 0, 0, 1.045, 0, 0)",
        titleColor: "rgb(21, 193, 150)",
      });
  });

  test("should fade cards in on first load and when a filter is changed", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await openPage(page, "/work");

    const section = page.getByTestId("work-projects-section");
    const initialAnimation = await section
      .getByTestId("work-project-card")
      .first()
      .evaluate((element) => getComputedStyle(element).animationName);
    expect(initialAnimation).toContain("work-project-card-in");

    await section.getByRole("button", { name: "AI Automation" }).click();
    const filteredAnimation = await section
      .getByTestId("work-project-card")
      .first()
      .evaluate((element) => getComputedStyle(element).animationName);
    expect(filteredAnimation).toContain("work-project-card-in");
  });
});
