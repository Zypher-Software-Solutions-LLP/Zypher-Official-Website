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
      const panel = element.querySelector<HTMLElement>('[data-testid="core-expertise-panel"]');
      const cards = element.querySelector<HTMLElement>('[data-testid="core-expertise-cards"]');
      const deliverables = element.querySelector<HTMLElement>(
        '[data-testid="core-expertise-deliverables"]',
      );
      const tabs = element.querySelector<HTMLElement>('[data-testid="core-expertise-tabs"]');
      const title = element.querySelector<HTMLElement>("h2");
      const eyebrow = element.querySelector<HTMLElement>("[class*='eyebrow']");
      const image = element.querySelector<HTMLImageElement>("img");

      if (!panel || !cards || !deliverables || !tabs || !title || !eyebrow || !image) {
        throw new Error("Missing core expertise geometry");
      }

      const panelRect = panel.getBoundingClientRect();
      const tabsRect = tabs.getBoundingClientRect();
      const titleRect = title.getBoundingClientRect();
      const eyebrowRect = eyebrow.getBoundingClientRect();

      return {
        cardColumns: getComputedStyle(cards).gridTemplateColumns.split(" ").length,
        deliverableColumns: getComputedStyle(deliverables).gridTemplateColumns.split(" ").length,
        imageSource: image.src,
        panelBottom: panelRect.bottom,
        panelBorderBottomLeftRadius: getComputedStyle(panel).borderBottomLeftRadius,
        tabsAfterPanel: Boolean(
          panel.compareDocumentPosition(tabs) & Node.DOCUMENT_POSITION_FOLLOWING,
        ),
        tabsTop: tabsRect.top,
        titleTop: titleRect.top,
        eyebrowTop: eyebrowRect.top,
      };
    });

    expect(layout.cardColumns).toBe(4);
    expect(layout.deliverableColumns).toBe(3);
    expect(layout.imageSource).toContain("Custom%2520Web%2520Applications.png");
    expect(layout.tabsAfterPanel).toBe(true);
    expect(Math.abs(layout.tabsTop - layout.panelBottom)).toBeLessThanOrEqual(1);
    expect(layout.panelBorderBottomLeftRadius).not.toBe("0px");
    expect(Math.abs(layout.eyebrowTop - layout.titleTop)).toBeLessThan(8);
    expect(await page.locator("main").innerText()).not.toContain("—");
  });

  test("should keep the card hover transition stable while the reveal animation is starting", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await openPage(page, "/services");

    const section = page.getByTestId("core-expertise-section");
    await section.scrollIntoViewIfNeeded();
    const card = section.getByTestId("core-expertise-card").first();
    await card.hover();
    await page.waitForTimeout(40);

    const hoverState = await card.evaluate((element) => {
      const image = element.querySelector("img");
      const overlay = element.querySelector("[class*='cardOverlay']");

      if (!image || !overlay) {
        throw new Error("Missing card hover layers");
      }

      return {
        cardFilter: getComputedStyle(element).filter,
        imageFilter: getComputedStyle(image).filter,
        overlayTransition: getComputedStyle(overlay).transition,
      };
    });

    expect(hoverState.cardFilter).toBe("none");
    expect(hoverState.imageFilter).toContain("blur");
    expect(hoverState.overlayTransition).toContain("background");
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
