import { expect, test } from "@playwright/test";
import { openPage } from "./helpers/site";

test.describe("About story section", () => {
  test("should separate the desktop timeline copy from the lower illustration", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await openPage(page, "/about");

    const layout = await page.evaluate(() => {
      const story = document.querySelector<HTMLElement>('[data-testid="about-story"]');
      const image = document.querySelector<HTMLElement>('[data-testid="about-story-illustration"]');
      const copyOne = document.querySelector<HTMLElement>('[data-testid="about-story-copy-1"]');
      const copyTwo = document.querySelector<HTMLElement>('[data-testid="about-story-copy-2"]');
      const copyThree = document.querySelector<HTMLElement>('[data-testid="about-story-copy-3"]');
      const content = document.querySelector<HTMLElement>('[class*="aboutStoryContent"]');
      const divider = document.querySelector<HTMLElement>('[data-testid="about-story-divider"]');
      const numbers = [
        ...document.querySelectorAll<HTMLElement>('[data-testid="about-story-number"]'),
      ];

      if (
        !story ||
        !image ||
        !copyOne ||
        !copyTwo ||
        !copyThree ||
        !content ||
        !divider ||
        numbers.length !== 3
      ) {
        throw new Error("Missing About story geometry");
      }

      const storyRect = story.getBoundingClientRect();
      const dividerRect = divider.getBoundingClientRect();
      const numberRects = numbers.map((number) => number.getBoundingClientRect());
      const relativeTop = (element: HTMLElement): number =>
        element.getBoundingClientRect().top - storyRect.top;

      return {
        storyHeight: storyRect.height,
        imageTop: relativeTop(image),
        copyOneBottom: copyOne.getBoundingClientRect().bottom - storyRect.top,
        copyTwoTop: relativeTop(copyTwo),
        copyTwoBottom: copyTwo.getBoundingClientRect().bottom - storyRect.top,
        copyThreeTop: relativeTop(copyThree),
        copyThreeBottom: copyThree.getBoundingClientRect().bottom - storyRect.top,
        numberOneTop: relativeTop(numbers[0]!),
        numberTwoTop: relativeTop(numbers[1]!),
        numberThreeTop: relativeTop(numbers[2]!),
        numberOneLeft: numbers[0]!.getBoundingClientRect().left - storyRect.left,
        numberThreeLeft: numbers[2]!.getBoundingClientRect().left - storyRect.left,
        copyTwoLeft: copyTwo.getBoundingClientRect().left - storyRect.left,
        numberOneGap: numberRects[0]!.left - dividerRect.right,
        numberTwoGap: dividerRect.left - numberRects[1]!.right,
        numberThreeGap: numberRects[2]!.left - dividerRect.right,
      };
    });

    expect(layout.storyHeight).toBeLessThan(1000);
    expect(layout.imageTop).toBeGreaterThan(480);
    expect(layout.imageTop).toBeLessThan(520);
    expect(Math.abs(layout.numberOneTop - 98)).toBeLessThan(8);
    expect(Math.abs(layout.numberTwoTop - 224)).toBeLessThan(8);
    expect(Math.abs(layout.numberThreeTop - 380)).toBeLessThan(8);
    expect(Math.abs(layout.numberOneLeft - layout.copyTwoLeft)).toBeLessThan(8);
    expect(Math.abs(layout.numberThreeLeft - layout.copyTwoLeft)).toBeLessThan(8);
    expect(Math.abs(layout.numberOneGap - layout.numberTwoGap)).toBeLessThanOrEqual(1);
    expect(Math.abs(layout.numberThreeGap - layout.numberTwoGap)).toBeLessThanOrEqual(1);
    expect(layout.numberOneTop).toBeLessThanOrEqual(layout.copyTwoTop + 8);
    expect(layout.numberTwoTop).toBeGreaterThan(layout.copyOneBottom - 24);
    expect(layout.numberTwoTop).toBeLessThan(layout.copyThreeTop);
    expect(layout.numberThreeTop).toBeGreaterThan(layout.copyTwoBottom - 24);
  });

  test("should keep the tablet Story content close to its illustration", async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await openPage(page, "/about");

    const layout = await page.evaluate(() => {
      const story = document.querySelector<HTMLElement>('[data-testid="about-story"]');
      const image = document.querySelector<HTMLElement>('[data-testid="about-story-illustration"]');
      const copyOne = document.querySelector<HTMLElement>('[data-testid="about-story-copy-1"]');
      const copyThree = document.querySelector<HTMLElement>('[data-testid="about-story-copy-3"]');
      const content = document.querySelector<HTMLElement>('[class*="aboutStoryContent"]');
      const copyTwo = document.querySelector<HTMLElement>('[data-testid="about-story-copy-2"]');
      const divider = document.querySelector<HTMLElement>('[data-testid="about-story-divider"]');
      const numbers = [
        ...document.querySelectorAll<HTMLElement>('[data-testid="about-story-number"]'),
      ];

      if (
        !story ||
        !image ||
        !copyOne ||
        !copyThree ||
        !content ||
        !copyTwo ||
        !divider ||
        numbers.length !== 3
      ) {
        throw new Error("Missing tablet About story geometry");
      }

      const storyRect = story.getBoundingClientRect();
      const copyOneRect = copyOne.getBoundingClientRect();
      const copyTwoRect = copyTwo.getBoundingClientRect();
      const dividerRect = divider.getBoundingClientRect();
      const numberRects = numbers.map((number) => number.getBoundingClientRect());
      const relativeTop = (element: HTMLElement): number =>
        element.getBoundingClientRect().top - storyRect.top;

      return {
        storyHeight: storyRect.height,
        imageTop: relativeTop(image),
        copyThreeBottom: copyThree.getBoundingClientRect().bottom - storyRect.top,
        copyOneRight: copyOneRect.right,
        copyTwoAbsoluteLeft: copyTwoRect.left,
        dividerLeft: dividerRect.left,
        dividerRight: dividerRect.right,
        numberOneLeft: numbers[0]!.getBoundingClientRect().left - storyRect.left,
        numberThreeLeft: numbers[2]!.getBoundingClientRect().left - storyRect.left,
        copyTwoLeft: copyTwoRect.left - storyRect.left,
        numberOneGap: numberRects[0]!.left - dividerRect.right,
        numberTwoGap: dividerRect.left - numberRects[1]!.right,
        numberThreeGap: numberRects[2]!.left - dividerRect.right,
      };
    });

    expect(layout.storyHeight).toBeLessThan(960);
    expect(layout.imageTop).toBeGreaterThan(layout.copyThreeBottom);
    expect(layout.imageTop).toBeLessThan(600);
    expect(layout.copyOneRight).toBeLessThanOrEqual(layout.dividerLeft - 24);
    expect(layout.copyTwoAbsoluteLeft).toBeGreaterThanOrEqual(layout.dividerRight + 24);
    expect(Math.abs(layout.numberOneLeft - layout.copyTwoLeft)).toBeLessThan(8);
    expect(Math.abs(layout.numberThreeLeft - layout.copyTwoLeft)).toBeLessThan(8);
    expect(Math.abs(layout.numberOneGap - layout.numberTwoGap)).toBeLessThanOrEqual(1);
    expect(Math.abs(layout.numberThreeGap - layout.numberTwoGap)).toBeLessThanOrEqual(1);
  });

  test("should place and center the Story composition at common PC resolutions", async ({
    page,
  }) => {
    const viewports = [
      {
        width: 1366,
        height: 768,
        maxStoryHeight: 1000,
        minImageTop: 500,
        maxImageTop: 550,
      },
      {
        width: 1920,
        height: 1080,
        maxStoryHeight: 1050,
        minImageTop: 470,
        maxImageTop: 520,
      },
      {
        width: 2560,
        height: 1440,
        maxStoryHeight: 1120,
        minImageTop: 420,
        maxImageTop: 480,
      },
      {
        width: 3840,
        height: 2160,
        maxStoryHeight: 1120,
        minImageTop: 195,
        maxImageTop: 250,
      },
    ];

    for (const viewport of viewports) {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await openPage(page, "/about");

      const layout = await page.evaluate(() => {
        const story = document.querySelector<HTMLElement>('[data-testid="about-story"]');
        const image = document.querySelector<HTMLElement>(
          '[data-testid="about-story-illustration"]',
        );
        const copyOne = document.querySelector<HTMLElement>('[data-testid="about-story-copy-1"]');
        const copyTwo = document.querySelector<HTMLElement>('[data-testid="about-story-copy-2"]');
        const copyThree = document.querySelector<HTMLElement>('[data-testid="about-story-copy-3"]');
        const content = document.querySelector<HTMLElement>('[class*="aboutStoryContent"]');
        const divider = document.querySelector<HTMLElement>('[data-testid="about-story-divider"]');
        const numbers = [
          ...document.querySelectorAll<HTMLElement>('[data-testid="about-story-number"]'),
        ];

        if (
          !story ||
          !image ||
          !copyOne ||
          !copyTwo ||
          !copyThree ||
          !content ||
          !divider ||
          numbers.length !== 3
        ) {
          throw new Error("Missing desktop About story depth geometry");
        }

        const storyRect = story.getBoundingClientRect();
        const imageRect = image.getBoundingClientRect();
        const contentRect = content.getBoundingClientRect();
        const copyOneRect = copyOne.getBoundingClientRect();
        const copyTwoRect = copyTwo.getBoundingClientRect();
        const dividerRect = divider.getBoundingClientRect();
        const numberRects = numbers.map((number) => number.getBoundingClientRect());

        return {
          storyHeight: storyRect.height,
          imageTop: imageRect.top - storyRect.top,
          imageBottom: imageRect.bottom - storyRect.top,
          copyThreeBottom: copyThree.getBoundingClientRect().bottom - storyRect.top,
          leftGutter: contentRect.left - storyRect.left,
          rightGutter: storyRect.right - contentRect.right,
          leftInnerGap: dividerRect.left - copyOneRect.right,
          rightInnerGap: copyTwoRect.left - dividerRect.right,
          numberOneGap: numberRects[0]!.left - dividerRect.right,
          numberTwoGap: dividerRect.left - numberRects[1]!.right,
          numberThreeGap: numberRects[2]!.left - dividerRect.right,
        };
      });

      expect(layout.storyHeight).toBeLessThan(viewport.maxStoryHeight);
      expect(layout.imageTop).toBeGreaterThan(viewport.minImageTop);
      expect(layout.imageTop).toBeLessThan(viewport.maxImageTop);
      expect(layout.imageBottom).toBeGreaterThan(layout.storyHeight);
      expect(Math.abs(layout.leftGutter - layout.rightGutter)).toBeLessThanOrEqual(1);
      expect(Math.abs(layout.leftInnerGap - layout.rightInnerGap)).toBeLessThanOrEqual(1);
      expect(Math.abs(layout.numberOneGap - layout.numberTwoGap)).toBeLessThanOrEqual(1);
      expect(Math.abs(layout.numberThreeGap - layout.numberTwoGap)).toBeLessThanOrEqual(1);
    }
  });
  test("should highlight a desktop milestone on hover", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await openPage(page, "/about");

    const story = page.getByTestId("about-story");
    const illustration = page.getByTestId("about-story-illustration");
    const divider = page.getByTestId("about-story-divider");
    const number = page.getByTestId("about-story-number").first();

    await expect(story).toBeVisible();
    await expect(illustration).toBeVisible();
    await expect(illustration).toHaveAttribute(
      "data-image-src",
      "https://media.zypher-solutions.com/about-page/section-2/Section%202%20Illustration.png",
    );
    await expect(divider).toHaveCSS("display", "block");

    await number.hover();
    await expect(number).toHaveCSS("color", "rgb(244, 248, 246)");
  });

  test("should end the mobile Story section immediately after its illustration", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await openPage(page, "/about");

    const layout = await page.evaluate(() => {
      const story = document.querySelector<HTMLElement>('[data-testid="about-story"]');
      const image = document.querySelector<HTMLElement>('[data-testid="about-story-illustration"]');

      if (!story || !image) {
        throw new Error("Missing mobile About story geometry");
      }

      return {
        bottomGap: story.getBoundingClientRect().bottom - image.getBoundingClientRect().bottom,
        dividerDisplay: getComputedStyle(
          document.querySelector<HTMLElement>('[data-testid="about-story-divider"]')!,
        ).display,
        copyAlignments: [
          ...document.querySelectorAll<HTMLElement>('[data-testid^="about-story-copy-"]'),
        ].map((copy) => getComputedStyle(copy).textAlign),
      };
    });

    expect(layout.bottomGap).toBeLessThanOrEqual(1);
    expect(layout.dividerDisplay).toBe("none");
    expect(layout.copyAlignments).toEqual(["justify", "justify", "justify"]);
  });

  test("should load the original Story illustration without optimizer compression", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await openPage(page, "/about");

    const image = page.getByTestId("about-story-illustration").locator("img");
    const source = await image.evaluate((element) => (element as HTMLImageElement).currentSrc);

    expect(source).not.toContain("/_next/image");
  });
});
