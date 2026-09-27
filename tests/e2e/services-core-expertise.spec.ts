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
        panelClientHeight: panel.clientHeight,
        panelScrollHeight: panel.scrollHeight,
        panelBorderBottomLeftRadius: getComputedStyle(panel).borderBottomLeftRadius,
        panelBorderBottomRightRadius: getComputedStyle(panel).borderBottomRightRadius,
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
    expect(layout.panelBorderBottomLeftRadius).toBe("0px");
    expect(layout.panelBorderBottomRightRadius).toBe("0px");
    expect(layout.panelScrollHeight).toBeLessThanOrEqual(layout.panelClientHeight);
    expect(Math.abs(layout.eyebrowTop - layout.titleTop)).toBeLessThan(8);
    expect(await page.locator("main").innerText()).not.toContain("—");

    const panelLocator = section.getByTestId("core-expertise-panel");
    const categoryLabels = [
      "Software Development",
      "Mobile App Development",
      "Design & Creative",
      "CRM/ERP Solutions",
    ];
    const panelHeights: number[] = [];

    for (const categoryLabel of categoryLabels) {
      await section
        .getByTestId("core-expertise-tabs")
        .getByRole("button", { name: categoryLabel })
        .click();
      await expect(section.getByRole("heading", { level: 2, name: categoryLabel })).toBeVisible();
      panelHeights.push(
        await panelLocator.evaluate((element) =>
          Math.round(element.getBoundingClientRect().height),
        ),
      );
    }

    expect(new Set(panelHeights).size).toBe(1);
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

    const mobileOrder = await section.evaluate((element) => {
      const panel = element.querySelector<HTMLElement>('[data-testid="core-expertise-panel"]');
      const tabs = element.querySelector<HTMLElement>('[data-testid="core-expertise-tabs"]');
      const firstTab = tabs?.querySelector("button");

      if (!panel || !tabs || !firstTab) {
        throw new Error("Missing mobile Core Expertise layout");
      }

      return {
        panelTop: panel.getBoundingClientRect().top,
        tabsBottom: tabs.getBoundingClientRect().bottom,
        tabBorderTopLeftRadius: getComputedStyle(firstTab).borderTopLeftRadius,
      };
    });

    expect(mobileOrder.tabsBottom).toBeLessThanOrEqual(mobileOrder.panelTop);
    expect(mobileOrder.tabBorderTopLeftRadius).not.toBe("0px");
  });

  test("should move the controls above a compact card grid on tablet", async ({ page }) => {
    await page.setViewportSize({ width: 820, height: 1180 });
    await openPage(page, "/services");

    const section = page.getByTestId("core-expertise-section");
    await section.scrollIntoViewIfNeeded();

    const tabletLayout = await section.evaluate((element) => {
      const panel = element.querySelector<HTMLElement>('[data-testid="core-expertise-panel"]');
      const tabs = element.querySelector<HTMLElement>('[data-testid="core-expertise-tabs"]');
      const cards = element.querySelector<HTMLElement>('[data-testid="core-expertise-cards"]');
      const card = element.querySelector<HTMLElement>('[data-testid="core-expertise-card"]');

      if (!panel || !tabs || !cards || !card) {
        throw new Error("Missing tablet Core Expertise layout");
      }

      return {
        panelTop: panel.getBoundingClientRect().top,
        tabsBottom: tabs.getBoundingClientRect().bottom,
        cardsWidth: cards.getBoundingClientRect().width,
        cardWidth: card.getBoundingClientRect().width,
        cardHeight: card.getBoundingClientRect().height,
      };
    });

    expect(tabletLayout.tabsBottom).toBeLessThanOrEqual(tabletLayout.panelTop);
    expect(tabletLayout.cardsWidth).toBeLessThanOrEqual(544);
    expect(tabletLayout.cardWidth).toBeLessThan(300);
    expect(tabletLayout.cardHeight).toBeLessThan(tabletLayout.cardWidth);
  });
});
