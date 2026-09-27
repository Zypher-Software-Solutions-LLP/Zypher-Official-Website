import { expect, test } from "@playwright/test";
import { openPage } from "./helpers/site";

test.describe("About team section", () => {
  test("should adapt its team grid across desktop, tablet, and mobile", async ({ page }) => {
    for (const viewport of [
      { width: 1440, height: 900 },
      { width: 768, height: 1024 },
      { width: 390, height: 844 },
    ]) {
      await page.setViewportSize(viewport);
      await openPage(page, "/about");

      const section = page.getByTestId("about-team");
      const grid = section.getByTestId("about-team-grid");
      const cards = section.getByTestId("about-team-card");

      await section.scrollIntoViewIfNeeded();
      await expect(section).toBeVisible();
      await expect(cards).toHaveCount(7);

      const columns = await grid.evaluate(
        (element) => getComputedStyle(element).gridTemplateColumns,
      );
      const columnCount = columns.split(" ").length;
      const cardBoxes = await cards.evaluateAll((elements) =>
        elements.map((element) => {
          const box = element.getBoundingClientRect();
          return { x: box.x, y: box.y, width: box.width };
        }),
      );

      if (viewport.width <= 479) {
        expect(columnCount).toBe(1);
        expect(cardBoxes[1]!.y).toBeGreaterThan(cardBoxes[0]!.y);
      } else if (viewport.width <= 1023) {
        expect(columnCount).toBe(2);
        expect(cardBoxes[0]!.y).toBeCloseTo(cardBoxes[1]!.y, 0);
        expect(cardBoxes[2]!.y).toBeGreaterThan(cardBoxes[1]!.y);
      } else {
        expect(columnCount).toBe(3);
        expect(cardBoxes[0]!.y).toBeCloseTo(cardBoxes[1]!.y, 0);
        expect(cardBoxes[1]!.y).toBeCloseTo(cardBoxes[2]!.y, 0);
      }

      expect(cardBoxes.every((box) => box.x >= 0 && box.x + box.width <= viewport.width)).toBe(
        true,
      );
    }
  });

  test("should align the duplicate portrait layers and preserve arcs", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await openPage(page, "/about");

    const firstCard = page.getByTestId("about-team-card").first();
    const frame = firstCard.getByTestId("about-team-frame");
    const mask = firstCard.getByTestId("about-team-portrait-inside-mask");
    const insideStage = firstCard.getByTestId("about-team-portrait-inside-stage");
    const popoutStage = firstCard.getByTestId("about-team-portrait-popout-stage");
    const [frameBox, maskBox, insideStageBox, popoutStageBox] = await Promise.all([
      frame.boundingBox(),
      mask.boundingBox(),
      insideStage.boundingBox(),
      popoutStage.boundingBox(),
    ]);

    expect(frameBox).not.toBeNull();
    expect(maskBox).not.toBeNull();
    expect(insideStageBox).not.toBeNull();
    expect(popoutStageBox).not.toBeNull();
    expect(maskBox!.x).toBeCloseTo(frameBox!.x, 1);
    expect(maskBox!.y).toBeCloseTo(frameBox!.y, 1);
    expect(maskBox!.width).toBeCloseTo(frameBox!.width, 1);
    expect(maskBox!.height).toBeCloseTo(frameBox!.height, 1);
    expect(insideStageBox!.x).toBeCloseTo(popoutStageBox!.x, 1);
    expect(insideStageBox!.y).toBeCloseTo(popoutStageBox!.y, 1);
    expect(insideStageBox!.width).toBeCloseTo(popoutStageBox!.width, 1);
    expect(insideStageBox!.height).toBeCloseTo(popoutStageBox!.height, 1);
    await expect(firstCard.getByTestId("about-team-portrait-popout-mask")).toHaveCSS(
      "clip-path",
      /inset/,
    );
    await expect(firstCard.getByTestId("about-team-arc-top")).toHaveCSS(
      "clip-path",
      "inset(0px 50% 50% 0px)",
    );
    await expect(firstCard.getByTestId("about-team-arc-bottom")).toHaveCSS(
      "clip-path",
      "inset(50% 0px 0px 50%)",
    );
    await expect(page.getByTestId("about-team-anonymous-arc")).toHaveCSS(
      "clip-path",
      "inset(0px 50% 50% 0px)",
    );
  });

  test("should preserve original portrait quality and keep the gradient frame transparent", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await openPage(page, "/about");

    const section = page.getByTestId("about-team");
    const portraitSources = await section
      .locator('[data-testid="about-team-image"], [data-testid="about-team-portrait-popout"]')
      .evaluateAll((images) => images.map((image) => (image as HTMLImageElement).currentSrc));

    expect(portraitSources).toHaveLength(12);
    expect(portraitSources.every((source) => !source.includes("/_next/image"))).toBe(true);
    await expect(section.getByTestId("about-team-frame").first()).toHaveCSS(
      "background-color",
      "rgba(0, 0, 0, 0)",
    );
  });

  test("should keep team heads visible above the card while balancing portrait scale", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await openPage(page, "/about");

    const cards = page.getByTestId("about-team-card");
    const portraitGeometry = await cards.evaluateAll((elements) =>
      elements.slice(0, 6).map((element) => {
        const stage = element.querySelector<HTMLElement>(
          '[data-testid="about-team-portrait-popout-stage"]',
        );
        const frame = element.querySelector<HTMLElement>('[data-testid="about-team-frame"]');

        if (!stage || !frame) {
          throw new Error("Missing team portrait geometry");
        }
        const stageBox = stage.getBoundingClientRect();
        return {
          stageHeight: stageBox.height,
          frameWidth: frame.getBoundingClientRect().width,
          objectFit: getComputedStyle(stage.querySelector("img")!).objectFit,
        };
      }),
    );
    expect(portraitGeometry[2]!.stageHeight / portraitGeometry[2]!.frameWidth).toBeLessThan(1.5);
    expect(portraitGeometry.every(({ objectFit }) => objectFit === "contain")).toBe(true);
  });
  test("should use a frame-edge popout mask for every team portrait", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await openPage(page, "/about");

    const cards = page
      .getByTestId("about-team-card")
      .filter({ has: page.getByTestId("about-team-image") });
    await expect(cards.getByTestId("about-team-portrait-popout-mask")).toHaveCount(6);

    for (let index = 0; index < 6; index += 1) {
      await expect(cards.nth(index).getByTestId("about-team-portrait-popout-mask")).toHaveCSS(
        "clip-path",
        /inset/,
      );
    }
  });
  test("should keep every team portrait naturally proportioned against Rehen", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await openPage(page, "/about");

    const visibleWidthRatios = await page
      .getByTestId("about-team-card")
      .filter({ has: page.getByTestId("about-team-image") })
      .evaluateAll((cards) => {
        const sources = {
          rehen: { width: 1218, left: 0, right: 1217 },
          sanjana: { width: 1800, left: 472, right: 1360 },
          keerthana: { width: 723, left: 26, right: 675 },
          hanna: { width: 1024, left: 208, right: 812 },
          vivek: { width: 899, left: 226, right: 898 },
          divin: { width: 1086, left: 494, right: 883 },
        } as const;

        return cards.map((card) => {
          const id = card.getAttribute("data-member") as keyof typeof sources;
          const source = sources[id];
          const stage = card.querySelector<HTMLElement>(
            '[data-testid="about-team-portrait-inside-stage"]',
          )!;
          const frame = card.querySelector<HTMLElement>('[data-testid="about-team-frame"]')!;
          const stageBox = stage.getBoundingClientRect();
          const frameBox = frame.getBoundingClientRect();
          return (
            ((source.right - source.left + 1) / source.width) * (stageBox.width / frameBox.width)
          );
        });
      });

    expect(Math.min(...visibleWidthRatios)).toBeGreaterThan(0.68);
    expect(Math.max(...visibleWidthRatios)).toBeLessThan(0.9);
  });

  test("should fade the resume-email underline in on hover", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await openPage(page, "/about");

    const link = page.getByTestId("about-team").getByRole("link", {
      name: "info@zypher-solutions.com",
    });
    const before = await link.evaluate((element) => {
      const styles = getComputedStyle(element, "::after");
      return { opacity: styles.opacity, transition: styles.transition };
    });

    expect(before.opacity).toBe("0");
    expect(before.transition).toContain("opacity");

    await link.hover();
    await expect
      .poll(() => link.evaluate((element) => getComputedStyle(element, "::after").opacity))
      .toBe("1");
  });
});
