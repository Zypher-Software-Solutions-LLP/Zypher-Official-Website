import { expect, test } from "@playwright/test";
import { openPage } from "./helpers/site";

test.describe("homepage final CTA", () => {
  test("should render the approved CTA and full-width background on desktop", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await openPage(page);

    await expect(page).toHaveTitle("Your Vision, Our Code | Zypher Software Solutions");

    const section = page.getByTestId("cta-section");
    await section.scrollIntoViewIfNeeded();

    const geometry = await section.evaluate((element) => {
      const title = element.querySelector("h2");
      const titleLines = title ? Array.from(title.children) : [];
      const sectionBox = element.getBoundingClientRect();
      const titleBox = title?.getBoundingClientRect();

      if (!title || !titleBox) {
        throw new Error("CTA geometry is unavailable");
      }

      return {
        sectionWidth: sectionBox.width,
        titleCenter: titleBox.x + titleBox.width / 2,
        viewportCenter: window.innerWidth / 2,
        titleLines: titleLines.length,
        imageSource: element.querySelector<HTMLImageElement>("[data-image-src]")?.dataset.imageSrc,
      };
    });

    expect(geometry.sectionWidth).toBeCloseTo(1440, 0);
    expect(geometry.titleCenter).toBeCloseTo(geometry.viewportCenter, 0);
    expect(geometry.titleLines).toBe(2);
    expect(geometry.imageSource).toContain("section-7/Background%20Image.png");
    await expect(section.getByRole("link", { name: "WhatsApp Us" })).toHaveAttribute(
      "href",
      "https://wa.me/918075725045?text=Hi%20Zypher%2C%20I%27d%20like%20to%20discuss%20a%20project.",
    );
  });

  test("should keep the CTA bounded and centered on a 4K viewport", async ({ page }) => {
    await page.setViewportSize({ width: 3840, height: 2160 });
    await openPage(page);

    await expect(page).toHaveTitle("Your Vision, Our Code | Zypher Software Solutions");

    const section = page.getByTestId("cta-section");
    const geometry = await section.evaluate((element) => {
      const sectionBox = element.getBoundingClientRect();
      const content = element.firstElementChild?.nextElementSibling?.nextElementSibling;
      const contentBox = content?.getBoundingClientRect();

      if (!contentBox) {
        throw new Error("4K CTA content geometry is unavailable");
      }

      return {
        sectionWidth: sectionBox.width,
        contentWidth: contentBox.width,
        contentCenter: contentBox.x + contentBox.width / 2,
        viewportCenter: window.innerWidth / 2,
      };
    });

    expect(geometry.sectionWidth).toBeCloseTo(3840, 0);
    expect(geometry.contentWidth).toBeLessThanOrEqual(672);
    expect(geometry.contentCenter).toBeCloseTo(geometry.viewportCenter, 0);
  });

  test("should stack CTA actions without phone overflow", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await openPage(page);

    await expect(page).toHaveTitle("Your Vision, Our Code | Zypher Software Solutions");

    const section = page.getByTestId("cta-section");
    const buttons = await section.getByRole("button").all();
    const whatsapp = section.getByRole("link", { name: "WhatsApp Us" });
    const boxes = await Promise.all([...buttons, whatsapp].map((control) => control.boundingBox()));

    const [first, second, third] = boxes;

    if (!first || !second || !third) {
      throw new Error("Mobile CTA control geometry is unavailable");
    }

    expect(second.y).toBeGreaterThan(first.y);
    expect(third.y).toBeGreaterThan(second.y);
    expect(second.x).toBeCloseTo(first.x, 0);
    expect(third.x).toBeCloseTo(first.x, 0);
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(
      390,
    );
  });
});
