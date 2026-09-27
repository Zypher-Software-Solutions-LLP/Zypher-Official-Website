import { expect, test } from "@playwright/test";

test.describe("Design & Creative mobile headings", () => {
  test("should break the hero title into intentional phrases on mobile", async ({ page }) => {
    await page.setViewportSize({ width: 430, height: 932 });
    await page.goto("/services/design-creative");

    const heroTitle = page.locator("main h1");
    await expect(heroTitle).toBeVisible();

    const visibleBreakCount = await heroTitle
      .locator("br")
      .evaluateAll(
        (breaks) =>
          breaks.filter((element) => getComputedStyle(element).display === "block").length,
      );

    expect(visibleBreakCount).toBe(2);
  });

  test("should fit the heading into three centered mobile lines", async ({ page }) => {
    await page.setViewportSize({ width: 430, height: 932 });
    await page.goto("/services/design-creative");

    const heroTitle = page.getByTestId("design-creative-hero-title");
    await expect(heroTitle).toBeVisible();

    const lineTops = await heroTitle.evaluate((heading) => {
      const findLineTop = (phrase: string): number => {
        const walker = document.createTreeWalker(heading, NodeFilter.SHOW_TEXT);
        let node = walker.nextNode();

        while (node) {
          const text = node.textContent ?? "";
          const phraseStart = text.indexOf(phrase);

          if (phraseStart !== -1) {
            const range = document.createRange();
            range.setStart(node, phraseStart);
            range.setEnd(node, phraseStart + phrase.length);
            const firstRect = Array.from(range.getClientRects()).find((rect) => rect.width > 0);

            if (firstRect) {
              return Math.round(firstRect.top);
            }
          }

          node = walker.nextNode();
        }

        throw new Error("Could not find visible title phrase: " + phrase);
      };

      return {
        firstLine: findLineTop("Designed for how people"),
        secondLineAccent: findLineTop("actually use it."),
        secondLineSuffix: findLineTop("Not how"),
        thirdLine: findLineTop("it looks in"),
        fourthLine: findLineTop("a presentation."),
      };
    });

    expect(lineTops.secondLineAccent).toBeGreaterThan(lineTops.firstLine);
    expect(lineTops.secondLineSuffix).toBe(lineTops.secondLineAccent);
    expect(lineTops.thirdLine).toBeGreaterThan(lineTops.secondLineSuffix);
    expect(lineTops.fourthLine).toBe(lineTops.thirdLine);
  });

  test("should separate the section-two sentences on desktop as well", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.goto("/services/design-creative");

    const sectionTitle = page.locator("#design-creative-section-two-title");
    await expect(sectionTitle).toBeVisible();

    const layout = await sectionTitle.evaluate((element) => {
      const [firstSentence, secondSentence] = element.querySelectorAll(":scope > span");

      if (!firstSentence || !secondSentence) {
        throw new Error("Expected both Design & Creative section heading sentences.");
      }

      const countLines = (sentence: Element): DOMRect[] => {
        const range = document.createRange();
        range.selectNodeContents(sentence);
        return Array.from(range.getClientRects()).filter((rect) => rect.width > 0);
      };
      const firstSentenceRects = countLines(firstSentence);
      const secondSentenceRects = countLines(secondSentence);

      return {
        firstSentenceLineCount: new Set(firstSentenceRects.map((rect) => Math.round(rect.top)))
          .size,
        secondSentenceLineCount: new Set(secondSentenceRects.map((rect) => Math.round(rect.top)))
          .size,
        firstSentenceTop: firstSentenceRects[0]?.top ?? Number.NaN,
        secondSentenceTop: secondSentenceRects[0]?.top ?? Number.NaN,
        overflowsHorizontally: element.scrollWidth > element.clientWidth,
      };
    });

    expect(layout.firstSentenceLineCount).toBe(1);
    expect(layout.secondSentenceLineCount).toBe(1);
    expect(layout.secondSentenceTop).toBeGreaterThan(layout.firstSentenceTop);
    expect(layout.overflowsHorizontally).toBe(false);
  });

  test("should keep each section-two sentence on its own single line on phones", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 430, height: 932 });
    await page.goto("/services/design-creative");

    const sectionTitle = page.locator("#design-creative-section-two-title");
    await expect(sectionTitle).toBeVisible();

    for (const width of [320, 375, 430]) {
      await page.setViewportSize({ width, height: 932 });

      const layout = await sectionTitle.evaluate((element) => {
        const [firstSentence, secondSentence] = element.querySelectorAll(":scope > span");

        if (!firstSentence || !secondSentence) {
          throw new Error("Expected both Design & Creative section heading sentences.");
        }

        const range = document.createRange();
        range.selectNodeContents(firstSentence);
        const firstSentenceRects = Array.from(range.getClientRects()).filter(
          (rect) => rect.width > 0,
        );
        range.selectNodeContents(secondSentence);
        const secondSentenceRects = Array.from(range.getClientRects()).filter(
          (rect) => rect.width > 0,
        );

        return {
          firstSentenceLineCount: new Set(firstSentenceRects.map((rect) => Math.round(rect.top)))
            .size,
          secondSentenceLineCount: new Set(secondSentenceRects.map((rect) => Math.round(rect.top)))
            .size,
          firstSentenceTop: firstSentenceRects[0]?.top ?? Number.NaN,
          secondSentenceTop: secondSentenceRects[0]?.top ?? Number.NaN,
          overflowsHorizontally: element.scrollWidth > element.clientWidth,
        };
      });

      expect(layout.firstSentenceLineCount, `first sentence wraps at ${width}px`).toBe(1);
      expect(
        layout.secondSentenceTop,
        `second sentence does not start below at ${width}px`,
      ).toBeGreaterThan(layout.firstSentenceTop);
      expect(layout.secondSentenceLineCount, `second sentence wraps at ${width}px`).toBe(1);
      expect(layout.overflowsHorizontally, `heading overflows at ${width}px`).toBe(false);
    }
  });
});
