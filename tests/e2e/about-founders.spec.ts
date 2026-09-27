import { expect, test } from "@playwright/test";
import { openPage } from "./helpers/site";

test.describe("About founders section", () => {
  test("should keep founder cards usable across desktop, tablet, and mobile", async ({ page }) => {
    for (const viewport of [
      { width: 1440, height: 900 },
      { width: 768, height: 1024 },
      { width: 390, height: 844 },
    ]) {
      await page.setViewportSize(viewport);
      await openPage(page, "/about");

      const section = page.getByTestId("about-founders");
      const cards = section.getByTestId("about-founder-card");

      await expect(cards).toHaveCount(3);
      await expect(section).toBeVisible();

      const sectionBox = await section.boundingBox();
      expect(sectionBox).not.toBeNull();
      expect(sectionBox!.x + sectionBox!.width).toBeLessThanOrEqual(viewport.width + 1);

      const cardBoxes = await cards.evaluateAll((elements) =>
        elements.map((element) => {
          const box = element.getBoundingClientRect();
          return { x: box.x, y: box.y, width: box.width, height: box.height };
        }),
      );

      if (viewport.width <= 767) {
        expect(cardBoxes[1]!.y).toBeGreaterThan(cardBoxes[0]!.y);
        expect(cardBoxes[2]!.y).toBeGreaterThan(cardBoxes[1]!.y);

        const socialRailGaps = await cards.evaluateAll((elements) =>
          elements.map((card) => {
            const description = card.querySelectorAll<HTMLParagraphElement>("p")[1];
            const rail = card.querySelector<HTMLElement>('[data-testid="about-founder-socials"]');
            return rail && description
              ? rail.getBoundingClientRect().top - description.getBoundingClientRect().bottom
              : Number.NaN;
          }),
        );

        expect(Math.min(...socialRailGaps)).toBeGreaterThanOrEqual(24);
      } else if (viewport.width <= 1023) {
        expect(cardBoxes[0]!.y).toBeCloseTo(cardBoxes[1]!.y, 0);
        expect(cardBoxes[2]!.y).toBeGreaterThan(cardBoxes[1]!.y);
      } else {
        expect(cardBoxes[0]!.y).toBeCloseTo(cardBoxes[1]!.y, 0);
        expect(cardBoxes[1]!.y).toBeCloseTo(cardBoxes[2]!.y, 0);

        const socialRailTops = await cards.evaluateAll((elements) =>
          elements.map((card) => {
            const rail = card.querySelector<HTMLElement>('[data-testid="about-founder-socials"]');
            return rail?.getBoundingClientRect().top ?? Number.NaN;
          }),
        );

        expect(Math.max(...socialRailTops) - Math.min(...socialRailTops)).toBeLessThanOrEqual(1);
      }
    }
  });
  test("should render the Figma card geometry and social icon states", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await openPage(page, "/about");

    const firstCard = page.getByTestId("about-founder-card").first();
    const frame = firstCard.getByTestId("about-founder-frame");
    const geometry = await frame.evaluate((element) => {
      const styles = getComputedStyle(element);
      const box = element.getBoundingClientRect();

      return {
        clipPath: styles.clipPath,
        width: box.width,
        height: box.height,
      };
    });

    expect(geometry.clipPath).toMatch(/^path/);
    expect(geometry.width).toBeGreaterThan(260);
    expect(geometry.height).toBeGreaterThan(360);

    const socialRail = firstCard.getByTestId("about-founder-socials");
    const linkedInLink = firstCard.getByRole("link", { name: "Muhammed Hasheem on LinkedIn" });
    const linkedInIcon = firstCard.getByTestId("about-founder-linkedin-icon");
    const portfolioLink = firstCard.getByRole("link", { name: "Muhammed Hasheem portfolio" });
    const portfolioIcon = firstCard.getByTestId("about-founder-portfolio-icon");

    await expect(socialRail).toHaveCSS("width", "128px");
    await expect(linkedInIcon).toHaveCSS("background-color", "rgb(21, 193, 150)");
    await expect(portfolioIcon).toHaveCSS("background-color", "rgb(21, 193, 150)");

    await linkedInLink.hover();
    await expect(linkedInIcon).toHaveCSS("background-color", "rgb(16, 23, 21)");
    await portfolioLink.hover();
    await expect(portfolioIcon).toHaveCSS("background-color", "rgb(16, 23, 21)");
  });
  test("should clip portrait legs to the card edge and preserve the corner arcs", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await openPage(page, "/about");

    const cards = page.getByTestId("about-founder-card");

    for (const cardIndex of [0, 1]) {
      await expect(
        cards.nth(cardIndex).getByTestId("about-founder-portrait-inside-mask"),
      ).toHaveCSS("clip-path", /path/);
    }

    const topArc = cards.first().getByTestId("about-founder-arc-top");
    const bottomArc = cards.first().getByTestId("about-founder-arc-bottom");
    await expect(topArc).toHaveCSS("clip-path", "inset(0px 50% 50% 0px)");
    await expect(bottomArc).toHaveCSS("clip-path", "inset(50% 0px 0px 50%)");

    const hankCard = cards.nth(2);
    const hankVisual = hankCard.getByTestId("about-founder-visual");
    const hankStage = hankCard.getByTestId("about-founder-portrait-popout-stage");
    const [visualBox, stageBox] = await Promise.all([
      hankVisual.boundingBox(),
      hankStage.boundingBox(),
    ]);

    expect(visualBox).not.toBeNull();
    expect(stageBox).not.toBeNull();
    expect(visualBox!.y - stageBox!.y).toBeGreaterThan(100);
  });

  test("should align the exact masked portrait duplicates across responsive breakpoints", async ({
    page,
  }) => {
    for (const viewport of [
      { width: 1440, height: 900 },
      { width: 768, height: 1024 },
      { width: 390, height: 844 },
    ]) {
      await page.setViewportSize(viewport);
      await page.goto("/about");

      const cards = page.getByTestId("about-founder-card");

      for (let cardIndex = 0; cardIndex < 3; cardIndex += 1) {
        const card = cards.nth(cardIndex);
        const frame = card.getByTestId("about-founder-frame");
        const insideMask = card.getByTestId("about-founder-portrait-inside-mask");
        const insideStage = card.getByTestId("about-founder-portrait-inside-stage");
        const popoutStage = card.getByTestId("about-founder-portrait-popout-stage");
        const insideImage = card.getByTestId("about-founder-image");
        const popoutImage = card.getByTestId("about-founder-portrait-popout");
        const portraitVisual = card.getByTestId("about-founder-visual");

        const [
          visualBox,
          frameBox,
          maskBox,
          insideStageBox,
          popoutStageBox,
          insideImageBox,
          popoutImageBox,
          insideSource,
          popoutSource,
          frameClip,
          maskClip,
        ] = await Promise.all([
          portraitVisual.boundingBox(),
          frame.boundingBox(),
          insideMask.boundingBox(),
          insideStage.boundingBox(),
          popoutStage.boundingBox(),
          insideImage.boundingBox(),
          popoutImage.boundingBox(),
          insideImage.getAttribute("src"),
          popoutImage.getAttribute("src"),
          frame.evaluate((element) => getComputedStyle(element).clipPath),
          insideMask.evaluate((element) => getComputedStyle(element).clipPath),
        ]);

        expect(visualBox).not.toBeNull();
        expect(frameBox).not.toBeNull();
        expect(maskBox).not.toBeNull();
        expect(insideStageBox).not.toBeNull();
        expect(popoutStageBox).not.toBeNull();
        expect(insideImageBox).not.toBeNull();
        expect(popoutImageBox).not.toBeNull();

        expect(maskBox!.x).toBeCloseTo(frameBox!.x, 1);
        expect(maskBox!.y).toBeCloseTo(frameBox!.y, 1);
        expect(maskBox!.width).toBeCloseTo(frameBox!.width, 1);
        expect(maskBox!.height).toBeCloseTo(frameBox!.height, 1);
        expect(maskClip).toBe(frameClip);
        expect(maskClip).toMatch(/^path/);

        expect(insideStageBox!.x).toBeCloseTo(popoutStageBox!.x, 1);
        expect(insideStageBox!.y).toBeCloseTo(popoutStageBox!.y, 1);
        expect(insideStageBox!.width).toBeCloseTo(popoutStageBox!.width, 1);
        expect(insideStageBox!.height).toBeCloseTo(popoutStageBox!.height, 1);
        expect(insideImageBox!.x).toBeCloseTo(popoutImageBox!.x, 1);
        expect(insideImageBox!.y).toBeCloseTo(popoutImageBox!.y, 1);
        expect(insideImageBox!.width).toBeCloseTo(popoutImageBox!.width, 1);
        expect(insideImageBox!.height).toBeCloseTo(popoutImageBox!.height, 1);
        expect(popoutSource).toBe(insideSource);

        await expect(card.getByTestId("about-founder-portrait-popout-mask")).toHaveCSS(
          "clip-path",
          /inset/,
        );
      }
    }
  });

  test("should load the original founder portraits and preserve their transparent bounds", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/about");

    const cards = page.getByTestId("about-founder-card");
    const portraitSources = await cards
      .locator('[data-testid="about-founder-image"], [data-testid="about-founder-portrait-popout"]')
      .evaluateAll((images) => images.map((image) => (image as HTMLImageElement).currentSrc));

    expect(portraitSources).toHaveLength(6);
    expect(portraitSources.every((source) => !source.includes("/_next/image"))).toBe(true);
    await expect(cards.nth(1).getByTestId("about-founder-image")).toHaveCSS(
      "object-fit",
      "contain",
    );
    await expect(cards.nth(2).getByTestId("about-founder-image")).toHaveCSS(
      "object-fit",
      "contain",
    );
  });
  test("should use a frame-edge popout mask for every founder portrait", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/about");

    const cards = page.getByTestId("about-founder-card");
    await expect(cards.getByTestId("about-founder-portrait-popout-mask")).toHaveCount(3);

    for (let index = 0; index < 3; index += 1) {
      await expect(cards.nth(index).getByTestId("about-founder-portrait-popout-mask")).toHaveCSS(
        "clip-path",
        /inset/,
      );
    }
  });
  test("should give every founder comparable visible body width", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/about");

    const visibleWidthRatios = await page.getByTestId("about-founder-card").evaluateAll((cards) => {
      const sources = {
        hasheem: { width: 1023, left: 157, right: 912 },
        ziyan: { width: 820, left: 72, right: 752 },
        hank: { width: 941, left: 110, right: 752 },
      } as const;

      return cards.map((card) => {
        const id = card.getAttribute("data-founder") as keyof typeof sources;
        const source = sources[id];
        const stage = card.querySelector<HTMLElement>(
          '[data-testid="about-founder-portrait-inside-stage"]',
        )!;
        const frame = card.querySelector<HTMLElement>('[data-testid="about-founder-frame"]')!;
        const stageBox = stage.getBoundingClientRect();
        const frameBox = frame.getBoundingClientRect();
        return (
          ((source.right - source.left + 1) / source.width) * (stageBox.width / frameBox.width)
        );
      });
    });

    expect(visibleWidthRatios[1]).toBeGreaterThan(0.87);
    expect(Math.max(...visibleWidthRatios) - Math.min(...visibleWidthRatios)).toBeLessThan(0.13);
  });
});
