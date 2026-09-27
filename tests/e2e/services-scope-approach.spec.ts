import { expect, test } from "@playwright/test";
import { openPage } from "./helpers/site";

test.describe("Services scope approach", () => {
  test("should render the curved desktop composition and supplied illustration", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await openPage(page, "/services");

    const section = page.getByTestId("scope-approach-section");
    await section.scrollIntoViewIfNeeded();

    await expect(
      section.getByRole("heading", {
        name: "The same problem often has two right answers.",
      }),
    ).toBeVisible();
    await expect(section.getByRole("link", { name: "See Who We Work With" })).toHaveAttribute(
      "href",
      "/scale",
    );

    const layout = await section.evaluate((element) => {
      const topBoundary = element.querySelector<SVGElement>(
        "[data-testid='scope-approach-boundary-top']",
      );
      const bottomBoundary = element.querySelector<SVGElement>(
        "[data-testid='scope-approach-boundary-bottom']",
      );
      const media = element.querySelector<HTMLElement>("[data-testid='scope-approach-media']");
      const image = media?.querySelector("img");
      const surface = element.querySelector<HTMLElement>("[data-testid='scope-approach-surface']");

      if (!topBoundary || !bottomBoundary || !media || !image || !surface) {
        throw new Error("Missing scope approach geometry");
      }

      const mediaRect = media.getBoundingClientRect();

      return {
        topViewBox: topBoundary.getAttribute("viewBox"),
        bottomViewBox: bottomBoundary.getAttribute("viewBox"),
        topPath: topBoundary.querySelector("path")?.getAttribute("d"),
        bottomPath: bottomBoundary.querySelector("path")?.getAttribute("d"),
        mediaWidth: mediaRect.width,
        mediaHeight: mediaRect.height,
        imageSource: image.getAttribute("src"),
        surfaceBackground: getComputedStyle(surface).backgroundColor,
        documentWidth: document.documentElement.scrollWidth,
        viewportWidth: window.innerWidth,
      };
    });

    expect(layout.topViewBox).toBe("0 0 1440 140");
    expect(layout.bottomViewBox).toBe("0 0 1440 140");
    expect(layout.topPath).toContain("M0 28 C220 8 430 8 690 48");
    expect(layout.bottomPath).toContain("M0 86 C220 66 430 66 690 106");
    expect(layout.mediaWidth).toBeGreaterThan(300);
    expect(layout.mediaHeight).toBeGreaterThan(layout.mediaWidth);
    expect(layout.imageSource).toContain("Illustration.png");
    expect(layout.surfaceBackground).toBe("rgb(15, 71, 67)");
    expect(layout.documentWidth).toBeLessThanOrEqual(layout.viewportWidth);
  });

  test("should stack the image below the copy on mobile without overflow", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await openPage(page, "/services");

    const section = page.getByTestId("scope-approach-section");
    await section.scrollIntoViewIfNeeded();

    const mobileLayout = await section.evaluate((element) => {
      const copy = element.querySelector<HTMLElement>("[class*='copy']");
      const media = element.querySelector<HTMLElement>("[data-testid='scope-approach-media']");

      if (!copy || !media) {
        throw new Error("Missing mobile scope approach layout");
      }

      return {
        copyBottom: copy.getBoundingClientRect().bottom,
        mediaTop: media.getBoundingClientRect().top,
        mediaWidth: media.getBoundingClientRect().width,
        viewportWidth: window.innerWidth,
        documentWidth: document.documentElement.scrollWidth,
        contentDisplay: getComputedStyle(element.querySelector("[class*='content']")!).display,
      };
    });

    expect(mobileLayout.contentDisplay).toBe("flex");
    expect(mobileLayout.mediaTop).toBeGreaterThanOrEqual(mobileLayout.copyBottom);
    expect(mobileLayout.mediaWidth).toBeLessThanOrEqual(mobileLayout.viewportWidth - 32);
    expect(mobileLayout.documentWidth).toBeLessThanOrEqual(mobileLayout.viewportWidth);
  });

  test("should keep the illustration and text side by side on tablet", async ({ page }) => {
    await page.setViewportSize({ width: 820, height: 1180 });
    await openPage(page, "/services");

    const section = page.getByTestId("scope-approach-section");
    await section.scrollIntoViewIfNeeded();

    const tabletColumns = await section.evaluate((element) => {
      const content = element.querySelector<HTMLElement>("[class*='content']");

      if (!content) {
        throw new Error("Missing tablet scope approach content");
      }

      return getComputedStyle(content).gridTemplateColumns.split(" ").length;
    });

    expect(tabletColumns).toBe(2);
  });
});
