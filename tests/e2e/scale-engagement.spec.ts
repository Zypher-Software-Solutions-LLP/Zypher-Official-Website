import { expect, test } from "@playwright/test";
import { openPage } from "./helpers/site";

const engagementDescription =
  "We've built internal tools for two-person teams and custom platforms for operations running across three countries.";

test.describe("Scale engagement section", () => {
  test("should use the Figma-style twelve-column desktop composition", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 1080 });
    await openPage(page, "/scale");

    const section = page.getByTestId("scale-engagement-section");
    await section.scrollIntoViewIfNeeded();
    await expect(section).toBeVisible();
    await expect(section.getByRole("heading", { level: 2 })).toHaveAccessibleName(
      "The problem determines the engagement. Not the size of your company.",
    );
    await expect(section.getByText(engagementDescription)).toBeVisible();
    await expect(section.getByTestId("scale-engagement-title-lines")).toHaveCount(3);

    const geometry = await section.evaluate((element) => {
      const grid = element.querySelector<HTMLElement>('[data-testid="scale-engagement-grid"]');
      const media = element.querySelector<HTMLElement>('[data-testid="scale-engagement-media"]');
      const sectionBox = element.getBoundingClientRect();
      const mediaBox = media?.getBoundingClientRect();
      const gridTemplateColumns = grid ? getComputedStyle(grid).gridTemplateColumns : "";

      if (!grid || !mediaBox) {
        throw new Error("Scale engagement desktop geometry is unavailable");
      }

      return {
        columns: gridTemplateColumns.startsWith("repeat(12")
          ? 12
          : gridTemplateColumns.split(/\s+/).length,
        mediaBottom: mediaBox.bottom,
        sectionHeight: sectionBox.height,
        mediaHeight: mediaBox.height,
        mediaLeft: mediaBox.left,
        mediaWidth: mediaBox.width,
        sectionBottom: sectionBox.bottom,
        sectionTop: sectionBox.top,
      };
    });

    expect(geometry.columns).toBe(12);
    expect(geometry.sectionHeight).toBeGreaterThanOrEqual(832);
    expect(geometry.mediaLeft).toBeGreaterThanOrEqual(820);
    expect(geometry.mediaWidth).toBeGreaterThanOrEqual(460);
    expect(geometry.mediaWidth).toBeLessThanOrEqual(470);
    expect(geometry.mediaHeight).toBeGreaterThanOrEqual(615);
    expect(geometry.mediaBottom).toBeLessThanOrEqual(geometry.sectionBottom);
    await expect(section.getByTestId("scale-engagement-boundary-bottom")).toBeVisible();
  });

  test("should stack the copy before the portrait without mobile overflow", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await openPage(page, "/scale");

    const section = page.getByTestId("scale-engagement-section");
    await section.scrollIntoViewIfNeeded();
    const copyBox = await section.getByTestId("scale-engagement-copy").boundingBox();
    const mediaBox = await section.getByTestId("scale-engagement-media").boundingBox();

    if (!copyBox || !mediaBox) {
      throw new Error("Scale engagement mobile geometry is unavailable");
    }

    expect(copyBox.y).toBeLessThan(mediaBox.y);
    expect(mediaBox.width).toBeLessThanOrEqual(358);
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(
      390,
    );
  });

  test("should keep the portrait and curve inside the tablet section", async ({ page }) => {
    await page.setViewportSize({ width: 1024, height: 1366 });
    await openPage(page, "/scale");

    const section = page.getByTestId("scale-engagement-section");
    await section.scrollIntoViewIfNeeded();
    const sectionBox = await section.boundingBox();
    const mediaBox = await section.getByTestId("scale-engagement-media").boundingBox();

    if (!sectionBox || !mediaBox) {
      throw new Error("Scale engagement tablet geometry is unavailable");
    }

    expect(mediaBox.x).toBeGreaterThanOrEqual(sectionBox.x);
    expect(mediaBox.x + mediaBox.width).toBeLessThanOrEqual(sectionBox.x + sectionBox.width);
    await expect(section.getByTestId("scale-engagement-boundary-bottom")).toBeVisible();
  });
});
