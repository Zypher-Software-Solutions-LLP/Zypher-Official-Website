import { expect, test } from "@playwright/test";
import { openPage } from "./helpers/site";

test.describe("homepage execution gap section", () => {
  test("should expose an accessible exclusive accordion with a matching image", async ({
    page,
  }) => {
    await openPage(page);

    const section = page.getByTestId("execution-gap-section");
    await section.scrollIntoViewIfNeeded();
    await expect(section).toHaveAttribute("data-reveal-state", "visible");
    const buttons = section.getByRole("button");

    await expect(buttons).toHaveCount(4);
    await expect(buttons.nth(0)).toHaveAttribute("aria-expanded", "true");
    await expect(buttons.nth(1)).toHaveAttribute("aria-expanded", "false");
    await expect(section.getByTestId("execution-gap-image")).toHaveAttribute(
      "data-image-src",
      /Problem%20-%201\.png/,
    );

    await buttons.nth(1).click();

    await expect(buttons.nth(0)).toHaveAttribute("aria-expanded", "false");
    await expect(buttons.nth(1)).toHaveAttribute("aria-expanded", "true");
    await expect(section.getByTestId("execution-gap-image")).toHaveAttribute(
      "data-image-src",
      /Problem%20-%202\.png/,
    );
    await expect(section.getByText(/Scope and price are fixed before work starts/)).toBeVisible();
  });

  test("should reveal the section as it approaches the viewport", async ({ page }) => {
    await openPage(page);

    const section = page.getByTestId("execution-gap-section");
    await section.scrollIntoViewIfNeeded();
    await expect(section).toHaveAttribute("data-reveal-state", "visible");
  });

  test("should preserve the section without horizontal overflow on a phone", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await openPage(page);

    await expect(page.getByTestId("execution-gap-section")).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(
      390,
    );
  });

  test("should use landscape mobile images and a consistent container on small screens", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await openPage(page);

    const section = page.getByTestId("execution-gap-section");
    await section.scrollIntoViewIfNeeded();

    await expect(section.getByTestId("execution-gap-illustration")).toBeHidden();
    await expect(section.locator("picture source")).toHaveAttribute(
      "srcset",
      /Problem%20-%201%20Mobile\.png/,
    );

    const firstBox = await section.getByTestId("execution-gap-media").boundingBox();
    const buttons = section.getByRole("button");
    await buttons.nth(3).click();
    const fourthBox = await section.getByTestId("execution-gap-media").boundingBox();

    if (!firstBox || !fourthBox) {
      throw new Error("Small-screen execution-gap media geometry is unavailable");
    }

    expect(fourthBox.width).toBeCloseTo(firstBox.width, 0);
    expect(fourthBox.height).toBeCloseTo(firstBox.height, 0);
    expect(fourthBox.width / fourthBox.height).toBeGreaterThan(1.3);
  });
  test("should keep the media frame independent from accordion content", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 1080 });
    await openPage(page);

    const section = page.getByTestId("execution-gap-section");
    await section.scrollIntoViewIfNeeded();
    await page.waitForTimeout(1_300);

    const media = section.getByTestId("execution-gap-media");
    const before = await media.boundingBox();
    const layout = await media.evaluate((element) => ({
      alignSelf: getComputedStyle(element).alignSelf,
      aspectRatio: getComputedStyle(element).aspectRatio,
    }));

    await section
      .getByRole("button")
      .nth(1)
      .evaluate((button) => (button as HTMLButtonElement).click());
    await expect(section.getByTestId("execution-gap-image")).toHaveAttribute(
      "data-image-src",
      /Problem%20-%202\.png/,
    );
    await page.waitForTimeout(600);

    const after = await media.boundingBox();

    if (!before || !after) {
      throw new Error("Execution-gap media geometry is unavailable");
    }

    expect(layout.alignSelf).toBe("start");
    expect(layout.aspectRatio).toBe("466 / 620");
    expect(after.x).toBeCloseTo(before.x, 0);
    expect(after.y).toBeCloseTo(before.y, 0);
    expect(after.width).toBeCloseTo(before.width, 0);
    expect(after.height).toBeCloseTo(before.height, 0);
  });

  test("should keep Learn More at the top of the desktop details column", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 1080 });
    await openPage(page);

    const section = page.getByTestId("execution-gap-section");
    await section.scrollIntoViewIfNeeded();

    const geometry = await section.evaluate((element) => {
      const details = element.querySelector<HTMLElement>('[data-testid="execution-gap-details"]');
      const learnMore = element.querySelector<HTMLElement>('a[href="/contact"]');

      if (!details || !learnMore) {
        throw new Error("Execution-gap Learn More geometry is unavailable");
      }

      const detailsBox = details.getBoundingClientRect();
      const learnMoreBox = learnMore.getBoundingClientRect();

      return {
        detailsRight: detailsBox.right,
        detailsTop: detailsBox.top,
        learnMorePosition: getComputedStyle(learnMore).position,
        learnMoreRight: learnMoreBox.right,
        learnMoreTop: learnMoreBox.top,
      };
    });

    expect(geometry.learnMorePosition).toBe("absolute");
    expect(geometry.learnMoreTop).toBeLessThanOrEqual(geometry.detailsTop + 48);
    expect(geometry.learnMoreRight).toBeCloseTo(geometry.detailsRight, 0);
  });

  test("should keep the image frame stable while changing accordion items on a laptop", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 1080 });
    await openPage(page);

    const section = page.getByTestId("execution-gap-section");
    await section.scrollIntoViewIfNeeded();
    await page.waitForTimeout(1_300);
    const media = section.getByTestId("execution-gap-media");
    const firstBox = await media.boundingBox();

    await section
      .getByRole("button")
      .nth(1)
      .evaluate((button) => (button as HTMLButtonElement).click());
    await expect(section.getByTestId("execution-gap-image")).toHaveAttribute(
      "data-image-src",
      /Problem%20-%202\.png/,
    );
    await page.waitForTimeout(600);
    const secondBox = await media.boundingBox();

    if (!firstBox || !secondBox) {
      throw new Error("Laptop execution-gap media geometry is unavailable");
    }

    expect(secondBox.x).toBeCloseTo(firstBox.x, 0);
    expect(secondBox.y).toBeCloseTo(firstBox.y, 0);
    expect(secondBox.width).toBeCloseTo(firstBox.width, 0);
    expect(secondBox.height).toBeCloseTo(firstBox.height, 0);
  });

  test("should overlap boundary artwork to prevent visible transition seams", async ({ page }) => {
    await page.setViewportSize({ width: 3840, height: 2160 });
    await openPage(page);

    const geometry = await page.getByTestId("execution-gap-section").evaluate((section) => {
      const topBoundary = section.querySelector<HTMLElement>(
        '[data-testid="execution-gap-boundary-top"]',
      );
      const bottomBoundary = section.querySelector<HTMLElement>(
        '[data-testid="execution-gap-boundary-bottom"]',
      );
      const surface = section.querySelector<HTMLElement>('[data-testid="execution-gap-surface"]');

      if (!topBoundary || !bottomBoundary || !surface) {
        throw new Error("Execution-gap boundary geometry is unavailable");
      }

      const topBoundaryBox = topBoundary.getBoundingClientRect();
      const bottomBoundaryBox = bottomBoundary.getBoundingClientRect();
      const surfaceBox = surface.getBoundingClientRect();

      return {
        surfaceTop: surfaceBox.top,
        topBoundaryBottom: topBoundaryBox.bottom,
        surfaceBottom: surfaceBox.bottom,
        bottomBoundaryTop: bottomBoundaryBox.top,
      };
    });

    expect(geometry.surfaceTop).toBeLessThan(geometry.topBoundaryBottom);
    expect(geometry.surfaceBottom).toBeGreaterThan(geometry.bottomBoundaryTop);
  });

  test("should stack section 3 and hide its boundary markers on an iPad-sized viewport", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1024, height: 1366 });
    await openPage(page);

    const section = page.getByTestId("execution-gap-section");
    await section.scrollIntoViewIfNeeded();

    const layout = await section.evaluate((element) => {
      const content = element.querySelector<HTMLElement>('[data-testid="execution-gap-content"]');
      const media = element.querySelector<HTMLElement>('[data-testid="execution-gap-media"]');
      const details = element.querySelector<HTMLElement>('[data-testid="execution-gap-details"]');
      const boundary = element.querySelector<HTMLElement>(
        '[data-testid^="execution-gap-boundary-"]',
      );

      if (!content || !media || !details || !boundary) {
        throw new Error("Tablet execution-gap layout is unavailable");
      }

      const mediaBox = media.getBoundingClientRect();
      const detailsBox = details.getBoundingClientRect();

      return {
        contentColumns: getComputedStyle(content).gridTemplateColumns.trim().split(/\s+/).length,
        detailsTop: detailsBox.top,
        mediaBottom: mediaBox.bottom,
        boundaryDisplay: getComputedStyle(boundary).display,
      };
    });

    expect(layout.contentColumns).toBe(1);
    expect(layout.detailsTop).toBeGreaterThanOrEqual(layout.mediaBottom - 1);
    expect(layout.boundaryDisplay).toBe("none");
  });
  test("should render shallow parallel section boundaries", async ({ page }) => {
    await openPage(page);

    const section = page.getByTestId("execution-gap-section");
    const boundaries = section.locator('[data-testid^="execution-gap-boundary-"]');

    await expect(boundaries).toHaveCount(2);

    const geometry = await boundaries.evaluateAll((elements) =>
      elements.map((element) => ({
        path: element.querySelector("path")?.getAttribute("d") ?? "",
        viewBox: element.getAttribute("viewBox"),
      })),
    );

    expect(geometry).toEqual([
      {
        path: "M0 28 C220 8 430 8 690 48 C920 82 1220 74 1440 32 L1440 140 L0 140 Z",
        viewBox: "0 0 1440 140",
      },
      {
        path: "M0 86 C220 66 430 66 690 106 C920 140 1220 132 1440 90 L1440 0 L0 0 Z",
        viewBox: "0 0 1440 140",
      },
    ]);
  });

  test("should preserve breathing room above and below the section content", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 1080 });
    await openPage(page);

    const spacing = await page.getByTestId("execution-gap-section").evaluate((section) => {
      const styles = getComputedStyle(section);

      return {
        paddingBottom: Number.parseFloat(styles.paddingBottom),
        paddingTop: Number.parseFloat(styles.paddingTop),
      };
    });

    expect(spacing.paddingTop).toBeGreaterThanOrEqual(88);
    expect(spacing.paddingBottom).toBeGreaterThanOrEqual(136);
  });

  test("should keep the media frame independent from the final accordion row", async ({ page }) => {
    await openPage(page);

    const section = page.getByTestId("execution-gap-section");
    await section.scrollIntoViewIfNeeded();

    await expect(section.locator('[data-testid="execution-gap-flow-line"]')).toHaveCount(0);

    const alignment = await section.evaluate((element) => {
      const media = element.querySelector<HTMLElement>('[data-testid="execution-gap-media"]');
      const details = element.querySelector<HTMLElement>('[data-testid="execution-gap-details"]');

      if (!media || !details) {
        throw new Error("Execution-gap frame alignment is unavailable");
      }

      const mediaBox = media.getBoundingClientRect();
      const detailsBox = details.getBoundingClientRect();

      return {
        mediaBottom: mediaBox.bottom,
        detailsBottom: detailsBox.bottom,
        mediaHeight: mediaBox.height,
        mediaWidth: mediaBox.width,
      };
    });

    expect(alignment.mediaWidth / alignment.mediaHeight).toBeCloseTo(466 / 620, 2);
    expect(alignment.mediaBottom).toBeLessThan(alignment.detailsBottom);
  });

  test("should not render em dashes in the execution-gap copy", async ({ page }) => {
    await openPage(page);

    const sectionText = await page.getByTestId("execution-gap-section").textContent();
    expect(sectionText).not.toContain("\u2014");
  });
});
