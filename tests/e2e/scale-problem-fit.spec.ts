import { expect, test } from "@playwright/test";
import { openPage } from "./helpers/site";

test.describe("Scale problem fit section", () => {
  test("should use a twelve-column desktop composition and switch content", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 1080 });
    await openPage(page, "/scale");

    const section = page.getByTestId("scale-problem-fit-section");
    await section.scrollIntoViewIfNeeded();
    await expect(section).toBeVisible();
    await expect(section.getByRole("heading", { level: 2 })).toHaveAccessibleName(
      "You don’t need to have the answer. You need to know the problem.",
    );

    const geometry = await section.evaluate((element) => {
      const grid = element.querySelector<HTMLElement>('[data-testid="scale-problem-fit-grid"]');
      const image = element.querySelector<HTMLElement>('[data-testid="scale-problem-fit-image"]');
      const sectionBox = element.getBoundingClientRect();
      const imageBox = image?.getBoundingClientRect();
      const columns = grid ? getComputedStyle(grid).gridTemplateColumns : "";

      if (!grid || !imageBox) {
        throw new Error("Scale problem fit desktop geometry is unavailable");
      }

      return {
        columns: columns.startsWith("repeat(12") ? 12 : columns.split(/\s+/).length,
        imageLeft: imageBox.left,
        imageWidth: imageBox.width,
        imageHeight: imageBox.height,
        sectionHeight: sectionBox.height,
        sectionRight: sectionBox.right,
        imageRight: imageBox.right,
      };
    });

    expect(geometry.columns).toBe(12);
    expect(geometry.imageLeft).toBeGreaterThanOrEqual(820);
    expect(geometry.imageWidth).toBeGreaterThanOrEqual(360);
    expect(geometry.imageWidth).toBeLessThanOrEqual(376);
    expect(geometry.imageHeight).toBeGreaterThanOrEqual(440);
    expect(geometry.imageRight).toBeLessThanOrEqual(geometry.sectionRight);
    expect(geometry.sectionHeight).toBeGreaterThanOrEqual(912);

    await section.getByRole("button", { name: "Openness to Process" }).click();
    await expect(section.getByTestId("scale-problem-fit-image")).toHaveAttribute(
      "data-image-src",
      "https://media.zypher-solutions.com/scale-page/section-4/Openness%20to%20Process.png",
    );
  });

  test("should stack the responsive layout without horizontal overflow", async ({ page }) => {
    for (const viewport of [
      { width: 1024, height: 1366 },
      { width: 390, height: 844 },
    ]) {
      await page.setViewportSize(viewport);
      await openPage(page, "/scale");

      const section = page.getByTestId("scale-problem-fit-section");
      await section.scrollIntoViewIfNeeded();
      const gridBox = await section.getByTestId("scale-problem-fit-grid").boundingBox();
      const copyBox = await section.getByTestId("scale-problem-fit-copy").boundingBox();
      const imageBox = await section
        .getByTestId(
          viewport.width <= 767 ? "scale-problem-fit-mobile-media" : "scale-problem-fit-media",
        )
        .boundingBox();

      if (!gridBox || !copyBox || !imageBox) {
        throw new Error("Scale problem fit responsive geometry is unavailable");
      }

      expect(copyBox.y).toBeLessThan(imageBox.y);
      expect(imageBox.x).toBeGreaterThanOrEqual(0);
      expect(imageBox.x + imageBox.width).toBeLessThanOrEqual(viewport.width);
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(
        viewport.width,
      );

      if (viewport.width === 1024) {
        const choices = section.getByTestId("scale-problem-fit-choices");
        const description = section.getByTestId("scale-problem-fit-description");
        const choicesBox = await choices.boundingBox();
        const descriptionBox = await description.boundingBox();
        if (!choicesBox || !descriptionBox) {
          throw new Error("Scale problem fit tablet content geometry is unavailable");
        }

        const gridCenter = gridBox.x + gridBox.width / 2;
        expect(Math.abs(choicesBox.x + choicesBox.width / 2 - gridCenter)).toBeLessThanOrEqual(1);
        expect(
          Math.abs(descriptionBox.x + descriptionBox.width / 2 - gridCenter),
        ).toBeLessThanOrEqual(1);
        expect(Math.abs(imageBox.x + imageBox.width / 2 - gridCenter)).toBeLessThanOrEqual(1);
        await expect
          .poll(() =>
            choices
              .getByRole("button")
              .first()
              .evaluate((element) => getComputedStyle(element).textAlign),
          )
          .toBe("center");
        await expect
          .poll(() => description.evaluate((element) => getComputedStyle(element).textAlign))
          .toBe("center");
      } else {
        expect(imageBox.width / imageBox.height).toBeGreaterThan(1.65);
      }
    }
  });

  test.describe("mobile carousel", () => {
    test.use({ hasTouch: true });

    test("should keep the introduction fixed while arrows and swipes cycle the dynamic panel", async ({
      page,
    }) => {
      await page.setViewportSize({ width: 390, height: 844 });
      await openPage(page, "/scale");

      const section = page.getByTestId("scale-problem-fit-section");
      await section.scrollIntoViewIfNeeded();
      const mainTitle = section.getByRole("heading", { level: 2 });
      const intro = section.locator('[class*="scaleProblemFitIntro"]');
      const carousel = section.getByTestId("scale-problem-fit-mobile-carousel");
      const activeTitle = section.getByTestId("scale-problem-fit-mobile-title");
      const activeDescription = section.getByTestId("scale-problem-fit-mobile-description");

      await expect(carousel).toBeVisible();
      await expect(section.getByTestId("scale-problem-fit-choices")).toBeHidden();
      await expect(activeTitle).toHaveText("Problem Clarity");
      expect(await carousel.evaluate((element) => getComputedStyle(element).touchAction)).toBe(
        "pan-y",
      );
      expect(
        await mainTitle.evaluate((element) => element.closest('[data-swipe-area="true"]')),
      ).toBe(null);
      expect(await intro.evaluate((element) => element.closest('[data-swipe-area="true"]'))).toBe(
        null,
      );

      await section.getByRole("button", { name: "Show next fit criterion" }).click();
      await expect(activeTitle).toHaveText("Openness to Process");

      await section.getByRole("button", { name: "Show previous fit criterion" }).click();
      await expect(activeTitle).toHaveText("Problem Clarity");
      await section.getByRole("button", { name: "Show previous fit criterion" }).click();
      await expect(activeTitle).toHaveText("Direct Communication");

      await carousel.dispatchEvent("pointerdown", {
        bubbles: true,
        clientX: 300,
        clientY: 300,
        pointerId: 1,
        pointerType: "touch",
      });
      await carousel.dispatchEvent("pointerup", {
        bubbles: true,
        clientX: 130,
        clientY: 305,
        pointerId: 1,
        pointerType: "touch",
      });
      await expect(activeTitle).toHaveText("Problem Clarity");
      await expect(activeDescription).toContainText(
        "You've identified something costing you time, money, customers, or growth.",
      );

      await carousel.dispatchEvent("pointerdown", {
        bubbles: true,
        clientX: 130,
        clientY: 300,
        pointerId: 2,
        pointerType: "touch",
      });
      await carousel.dispatchEvent("pointerup", {
        bubbles: true,
        clientX: 300,
        clientY: 304,
        pointerId: 2,
        pointerType: "touch",
      });
      await expect(activeTitle).toHaveText("Direct Communication");

      await carousel.dispatchEvent("pointerdown", {
        bubbles: true,
        clientX: 200,
        clientY: 250,
        pointerId: 3,
        pointerType: "touch",
      });
      await carousel.dispatchEvent("pointerup", {
        bubbles: true,
        clientX: 204,
        clientY: 380,
        pointerId: 3,
        pointerType: "touch",
      });
      await expect(activeTitle).toHaveText("Direct Communication");
    });

    test("should keep the existing choice layout on tablet", async ({ page }) => {
      await page.setViewportSize({ width: 768, height: 1024 });
      await openPage(page, "/scale");

      const section = page.getByTestId("scale-problem-fit-section");
      await section.scrollIntoViewIfNeeded();

      await expect(section.getByTestId("scale-problem-fit-mobile-carousel")).toBeHidden();
      await expect(section.getByTestId("scale-problem-fit-choices")).toBeVisible();
      await expect(section.getByTestId("scale-problem-fit-trigger")).toHaveCount(4);
    });
  });
});
