import { expect, test } from "@playwright/test";
import { openPage } from "./helpers/site";

test.describe("responsive homepage Scale section", () => {
  test("should defer scale animations until the section enters the viewport", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await openPage(page);

    const initialState = await page.evaluate(() => {
      const section = document.querySelector<HTMLElement>('[data-testid="scale-section"]');
      const metric = document.querySelector<HTMLElement>('[data-testid="scale-metric-card"]');
      const logoTrack = document.querySelector<HTMLElement>('[data-testid="scale-logo-track"]');

      if (!section || !metric || !logoTrack) {
        throw new Error("Scale animation elements are unavailable");
      }

      return {
        sectionTop: section.getBoundingClientRect().top,
        sectionState: section.dataset.revealState,
        metricAnimationState: getComputedStyle(metric).animationPlayState,
        logoAnimationState: getComputedStyle(logoTrack).animationPlayState,
      };
    });

    expect(initialState.sectionTop).toBeGreaterThanOrEqual(900);
    expect(initialState.sectionState).toBe("hidden");
    expect(initialState.metricAnimationState).toBe("paused");
    expect(initialState.logoAnimationState).toBe("paused");

    await page.getByTestId("scale-section").scrollIntoViewIfNeeded();
    await expect
      .poll(() => page.getByTestId("scale-section").getAttribute("data-reveal-state"))
      .toBe("visible");

    await expect
      .poll(() =>
        page
          .getByTestId("scale-metric-card")
          .first()
          .evaluate((element) => getComputedStyle(element).animationPlayState),
      )
      .toBe("running");
    await expect
      .poll(() =>
        page
          .getByTestId("scale-section")
          .getByTestId("scale-logo-track")
          .evaluate((element) => getComputedStyle(element).animationPlayState),
      )
      .toBe("running");
  });

  test("should preserve all metrics, projects, logos, and CTA on desktop", async ({ page }) => {
    await openPage(page);

    const section = page.getByTestId("scale-section");
    await expect(section).toBeVisible();
    await expect(section.getByRole("heading", { level: 2 })).toHaveAccessibleName(
      "TRUSTED BY TEAMS AT EVERY SCALE",
    );
    await expect(section.getByTestId("scale-project-card")).toHaveCount(3);
    await expect(section.getByTestId("scale-client-logo")).toHaveCount(10);
    await expect(section.getByRole("link", { name: "View All Works" })).toHaveAttribute(
      "href",
      "/work",
    );
    await expect(section.getByRole("button", { name: "Previous projects" })).toBeDisabled();
    await expect(section.getByRole("button", { name: "Next projects" })).toBeDisabled();
  });

  test("should render device-independent SVG arrows for scale controls and cards", async ({
    page,
  }) => {
    await openPage(page);

    const section = page.getByTestId("scale-section");

    await expect(section.getByTestId("scale-project-arrow").first().locator("svg")).toHaveCount(1);
    await expect(section.getByRole("link", { name: "View All Works" }).locator("svg")).toHaveCount(
      1,
    );
    await expect(
      section.getByRole("button", { name: "Previous projects" }).locator("svg"),
    ).toHaveCount(1);
    await expect(section.getByRole("button", { name: "Next projects" }).locator("svg")).toHaveCount(
      1,
    );
    await expect(section.getByTestId("scale-project-arrow").first()).not.toContainText("�");
  });
  test("should align 368px project cards to the desktop content grid", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 1080 });
    await openPage(page);

    const geometry = await page.evaluate(() => {
      const inner = document.querySelector('[data-testid="scale-section-inner"]');
      const cards = Array.from(document.querySelectorAll('[data-testid="scale-project-card"]'));
      const previousButton = document.querySelector('button[aria-label="Previous projects"]');
      const nextButton = document.querySelector('button[aria-label="Next projects"]');

      if (!inner || cards.length !== 3 || !previousButton || !nextButton) {
        throw new Error("Scale project geometry is unavailable");
      }

      const innerBox = inner.getBoundingClientRect();
      const firstCardBox = cards[0].getBoundingClientRect();
      const lastCardBox = cards[2].getBoundingClientRect();
      const previousButtonBox = previousButton.getBoundingClientRect();
      const nextButtonBox = nextButton.getBoundingClientRect();

      return {
        firstCardLeft: firstCardBox.left,
        firstCardWidth: firstCardBox.width,
        innerLeft: innerBox.left,
        innerRight: innerBox.right,
        lastCardRight: lastCardBox.right,
        nextButtonLeft: nextButtonBox.left,
        previousButtonRight: previousButtonBox.right,
      };
    });

    expect(geometry.firstCardWidth).toBeGreaterThanOrEqual(367);
    expect(geometry.firstCardWidth).toBeLessThanOrEqual(369);
    expect(Math.abs(geometry.firstCardLeft - geometry.innerLeft)).toBeLessThanOrEqual(1);
    expect(Math.abs(geometry.lastCardRight - geometry.innerRight)).toBeLessThanOrEqual(1);
    expect(geometry.previousButtonRight).toBeLessThan(geometry.innerLeft);
    expect(geometry.nextButtonLeft).toBeGreaterThan(geometry.innerRight);
  });

  test("should overlap section 3 over section 2 at 4K to prevent a boundary seam", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 3840, height: 2160 });
    await openPage(page);

    const geometry = await page.evaluate(() => {
      const scaleSection = document.querySelector<HTMLElement>('[data-testid="scale-section"]');
      const executionGapSection = document.querySelector<HTMLElement>(
        '[data-testid="execution-gap-section"]',
      );

      if (!scaleSection || !executionGapSection) {
        throw new Error("Section boundary geometry is unavailable");
      }

      return {
        overlap:
          scaleSection.getBoundingClientRect().bottom -
          executionGapSection.getBoundingClientRect().top,
      };
    });

    expect(geometry.overlap).toBeGreaterThanOrEqual(1);
  });
  test("should hand off to section 3 without excessive empty space", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 1080 });
    await openPage(page);

    const gap = await page.evaluate(() => {
      const finalCard = document.querySelector('[data-testid="scale-project-card"]');
      const executionGapSection = document.querySelector('[data-testid="execution-gap-section"]');

      if (!finalCard || !executionGapSection) {
        throw new Error("Section handoff geometry is unavailable");
      }

      return (
        executionGapSection.getBoundingClientRect().top - finalCard.getBoundingClientRect().bottom
      );
    });

    expect(gap).toBeLessThanOrEqual(50);
  });

  test("should center the scale illustration on a phone viewport", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await openPage(page);

    const geometry = await page.getByTestId("scale-section").evaluate((section) => {
      const inner = section.querySelector<HTMLElement>('[data-testid="scale-section-inner"]');
      const illustration = section.querySelector<HTMLElement>('[data-testid="scale-illustration"]');

      if (!inner || !illustration) {
        throw new Error("Mobile scale illustration geometry is unavailable");
      }

      const innerBox = inner.getBoundingClientRect();
      const illustrationBox = illustration.getBoundingClientRect();

      return {
        innerCenter: innerBox.left + innerBox.width / 2,
        illustrationCenter: illustrationBox.left + illustrationBox.width / 2,
      };
    });

    expect(Math.abs(geometry.innerCenter - geometry.illustrationCenter)).toBeLessThanOrEqual(2);
  });

  test("should arrange tablet metrics as two cards and one centered card", async ({ page }) => {
    await page.setViewportSize({ width: 1024, height: 1366 });
    await openPage(page);

    const cards = page.getByTestId("scale-section").locator('[data-testid="scale-metric-card"]');
    const inner = page.getByTestId("scale-section").locator('[data-testid="scale-section-inner"]');
    const cardBoxes = await Promise.all([
      cards.nth(0).boundingBox(),
      cards.nth(1).boundingBox(),
      cards.nth(2).boundingBox(),
    ]);
    const innerBox = await inner.boundingBox();

    if (!cardBoxes[0] || !cardBoxes[1] || !cardBoxes[2] || !innerBox) {
      throw new Error("Tablet metric card geometry is unavailable");
    }

    expect(Math.abs(cardBoxes[0].y - cardBoxes[1].y)).toBeLessThanOrEqual(1);
    expect(cardBoxes[2].y).toBeGreaterThan(cardBoxes[0].y + cardBoxes[0].height);
    expect(
      Math.abs(cardBoxes[2].x + cardBoxes[2].width / 2 - (innerBox.x + innerBox.width / 2)),
    ).toBeLessThanOrEqual(2);
  });

  test("should use a swipe hint instead of carousel arrows on a phone", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await openPage(page);

    const section = page.getByTestId("scale-section");
    await expect(section.locator('[data-testid="scale-swipe-hint"]')).toBeVisible();
    await expect(section.getByRole("button", { name: "Previous projects" })).toBeHidden();
    await expect(section.getByRole("button", { name: "Next projects" })).toBeHidden();
  });

  test("should keep the desktop-style carousel arrows visible on a tablet", async ({ page }) => {
    await page.setViewportSize({ width: 1024, height: 1366 });
    await openPage(page);

    const section = page.getByTestId("scale-section");
    await expect(section.getByRole("button", { name: "Previous projects" })).toBeVisible();
    await expect(section.getByRole("button", { name: "Next projects" })).toBeVisible();
    await expect(section.locator('[data-testid="scale-swipe-hint"]')).toBeHidden();
  });
  test("should show one project card per view and support swipe guidance on mobile", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await openPage(page);

    const viewport = page.getByTestId("scale-projects-viewport");
    const cards = page.getByTestId("scale-project-card");
    const viewportBox = await viewport.boundingBox();
    const firstCardBox = await cards.nth(0).boundingBox();
    const secondCardBox = await cards.nth(1).boundingBox();

    if (!viewportBox || !firstCardBox || !secondCardBox) {
      throw new Error("Mobile project carousel geometry is unavailable");
    }

    expect(firstCardBox.width).toBeGreaterThanOrEqual(viewportBox.width - 2);
    expect(secondCardBox.x).toBeGreaterThan(firstCardBox.x + firstCardBox.width);
    await expect(page.getByRole("button", { name: "Previous projects" })).toBeHidden();
    await expect(page.getByRole("button", { name: "Next projects" })).toBeHidden();
    await expect(page.locator('[data-testid="scale-swipe-hint"]')).toBeVisible();

    await viewport.evaluate((element) =>
      element.scrollTo({ behavior: "auto", left: element.clientWidth }),
    );
    await expect.poll(() => viewport.evaluate((element) => element.scrollLeft)).toBeGreaterThan(0);
  });

  test("should show two project cards per view and support arrow navigation on tablets", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1024, height: 1366 });
    await openPage(page);

    const viewport = page.getByTestId("scale-projects-viewport");
    const cards = page.getByTestId("scale-project-card");
    const viewportBox = await viewport.boundingBox();
    const cardBoxes = await Promise.all([cards.nth(0).boundingBox(), cards.nth(1).boundingBox()]);
    const projectGap = await viewport
      .locator('[data-testid="scale-projects"]')
      .evaluate((element) => Number.parseFloat(getComputedStyle(element).columnGap));

    if (!viewportBox || !cardBoxes[0] || !cardBoxes[1] || !projectGap) {
      throw new Error("Tablet project carousel geometry is unavailable");
    }

    const expectedCardWidth = (viewportBox.width - projectGap) / 2;
    expect(cardBoxes[0].width).toBeGreaterThanOrEqual(expectedCardWidth - 2);
    expect(cardBoxes[0].width).toBeLessThanOrEqual(expectedCardWidth + 2);
    expect(cardBoxes[1].x).toBeGreaterThan(cardBoxes[0].x + cardBoxes[0].width);
    await expect(page.getByRole("button", { name: "Previous projects" })).toBeDisabled();
    await expect(page.getByRole("button", { name: "Next projects" })).toBeEnabled();
  });

  test("should order the project heading, CTA, and cards on a mobile viewport", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await openPage(page);

    const section = page.getByTestId("scale-section");
    const titleBox = await section.locator('[data-testid="scale-projects-title"]').boundingBox();
    const ctaBox = await section.getByRole("link", { name: "View All Works" }).boundingBox();
    const cardBox = await section.getByTestId("scale-project-card").first().boundingBox();

    if (!titleBox || !ctaBox || !cardBox) {
      throw new Error("Mobile project section order is unavailable");
    }

    expect(titleBox.y).toBeLessThan(ctaBox.y);
    expect(ctaBox.y).toBeLessThan(cardBox.y);
  });
  test("should scale the section up on a 4K viewport", async ({ page }) => {
    await page.setViewportSize({ width: 3840, height: 2160 });
    await openPage(page);

    const geometry = await page.evaluate(() => {
      const inner = document.querySelector('[data-testid="scale-section-inner"]');
      const title = document.querySelector('[data-testid="scale-section-title"]');
      const card = document.querySelector('[data-testid="scale-project-card"]');

      if (!inner || !title || !card) {
        throw new Error("Scale section geometry is unavailable");
      }

      return {
        innerWidth: inner.getBoundingClientRect().width,
        titleFontSize: Number.parseFloat(getComputedStyle(title).fontSize),
        cardWidth: card.getBoundingClientRect().width,
      };
    });

    expect(geometry.innerWidth).toBeGreaterThanOrEqual(1400);
    expect(geometry.titleFontSize).toBeGreaterThanOrEqual(56);
    expect(geometry.cardWidth).toBeGreaterThanOrEqual(440);
  });

  test("should remove the decorative section marker at the tablet boundary", async ({ page }) => {
    await page.setViewportSize({ width: 1024, height: 1366 });
    await openPage(page);

    const pseudoElement = await page.getByTestId("scale-section").evaluate((section) => {
      const styles = getComputedStyle(section, "::after");
      return { content: styles.content };
    });

    expect(pseudoElement.content).toBe("none");
  });

  test("should reveal project details on hover", async ({ page }) => {
    await openPage(page);

    const card = page.getByTestId("scale-project-card").nth(1);
    await card.focus();
    await expect(card.getByTestId("scale-project-description")).toHaveCSS("opacity", "1");
    await expect(card.getByTestId("scale-project-arrow")).toHaveCSS("opacity", "1");
  });

  test("should keep hero calls to action clickable when scrolled beneath the fixed header", async ({
    page,
  }) => {
    await openPage(page);

    const cta = page
      .getByTestId("hero-section")
      .getByRole("link", { name: "Book a Discovery Call" });
    const documentTop = await cta.evaluate(
      (element) => element.getBoundingClientRect().top + window.scrollY,
    );
    await page.evaluate((top) => window.scrollTo(0, top - 40), documentTop);
    await cta.click();

    await expect(page).toHaveURL(/\/contact$/);
  });

  test("should keep metric copy inside its cards on a tablet", async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await openPage(page);

    const metricCards = page.locator('[data-testid="scale-metric-card"]');
    await expect(metricCards).toHaveCount(3);

    const overflowStates = await metricCards.evaluateAll((cards) =>
      cards.map((card) => {
        const cardBottom = card.getBoundingClientRect().bottom;
        const descriptionBottom = card.querySelector("p")?.getBoundingClientRect().bottom ?? 0;
        return descriptionBottom <= cardBottom + 1;
      }),
    );

    expect(overflowStates).toEqual([true, true, true]);
  });

  test("should stack cards without horizontal overflow on a phone", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await openPage(page);

    await expect(page.getByTestId("scale-section")).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(
      390,
    );
    await expect(page.getByTestId("scale-project-card")).toHaveCount(3);
  });
});
