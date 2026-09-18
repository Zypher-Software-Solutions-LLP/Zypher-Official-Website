import { expect, test } from "@playwright/test";
import { openPage } from "./helpers/site";

test.describe("Services core expertise", () => {
  test("should render four image cards, aligned deliverables, and the active CTA", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await openPage(page, "/services");

    const section = page.getByTestId("core-expertise-section");
    await section.scrollIntoViewIfNeeded();

    await expect(
      section.getByRole("heading", { level: 2, name: "Software Development" }),
    ).toBeVisible();
    await expect(section.getByTestId("core-expertise-card")).toHaveCount(4);
    await expect(section.getByTestId("core-expertise-deliverables").locator("li")).toHaveCount(3);
    await expect(
      section.getByRole("link", { name: "Explore Custom Software Builds →" }),
    ).toHaveAttribute("href", "/services/software-development");

    const layout = await section.evaluate((element) => {
      const cards = element.querySelector<HTMLElement>('[data-testid="core-expertise-cards"]');
      const deliverables = element.querySelector<HTMLElement>(
        '[data-testid="core-expertise-deliverables"]',
      );
      const image = element.querySelector<HTMLImageElement>("img");

      if (!cards || !deliverables || !image) {
        throw new Error("Missing core expertise geometry");
      }

      return {
        cardColumns: getComputedStyle(cards).gridTemplateColumns.split(" ").length,
        deliverableColumns: getComputedStyle(deliverables).gridTemplateColumns.split(" ").length,
        imageSource: image.src,
      };
    });

    expect(layout.cardColumns).toBe(4);
    expect(layout.deliverableColumns).toBe(3);
    expect(layout.imageSource).toContain("Custom%2520Web%2520Applications.png");
  });

  test("should switch categories in one click and use a compact two-column mobile layout", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await openPage(page, "/services");

    const section = page.getByTestId("core-expertise-section");
    await section.scrollIntoViewIfNeeded();

    await page.getByRole("button", { name: "Mobile App Development" }).click();
    await expect(
      section.getByRole("heading", { level: 2, name: "Mobile App Development" }),
    ).toBeVisible();
    await expect(section.getByRole("link", { name: "See our mobile app work →" })).toHaveAttribute(
      "href",
      "/services/mobile-app-development",
    );
    await expect(page.getByRole("button", { name: "Mobile App Development" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );

    const cardColumns = await section
      .getByTestId("core-expertise-cards")
      .evaluate((element) => getComputedStyle(element).gridTemplateColumns.split(" ").length);

    expect(cardColumns).toBe(2);
  });
});
