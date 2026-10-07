import { expect, test } from "@playwright/test";
import { openPage } from "./helpers/site";

test.describe("Scale testimonials section", () => {
  test("should loop continuously and pause the rail while it is hovered", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await openPage(page, "/scale");

    const section = page.getByTestId("scale-testimonials-section");
    await section.scrollIntoViewIfNeeded();
    await expect(section).toBeVisible();
    await expect(section.getByRole("heading", { level: 2 })).toHaveAccessibleName(
      "Heard it from us. Now hear it from them.",
    );
    await expect(section.getByTestId("scale-testimonials-title-accent")).toHaveText("from them.");
    await expect(section.locator('[class*="scaleTestimonialsTopCurve"]')).toHaveCount(0);

    const primaryTrack = page.getByTestId("scale-testimonials-primary-track");
    const duplicateTrack = page.getByTestId("scale-testimonials-duplicate-track");
    await expect(primaryTrack.getByTestId("scale-testimonial-card")).toHaveCount(7);
    await expect(duplicateTrack.getByTestId("scale-testimonial-card")).toHaveCount(7);
    await expect(primaryTrack).toContainText("Kenzy Attia");
    await expect(primaryTrack).not.toContainText("Kenzi Attia");

    const animationPauseStyle = await page.addStyleTag({
      content: ".scaleTestimonialsTrack { animation-play-state: paused !important; }",
    });
    const primaryCards = primaryTrack.getByTestId("scale-testimonial-card");
    const firstCardBox = await primaryCards.first().boundingBox();
    const secondCardBox = await primaryCards.nth(1).boundingBox();
    const lastCardBox = await primaryCards.last().boundingBox();
    const duplicateFirstCardBox = await duplicateTrack
      .getByTestId("scale-testimonial-card")
      .first()
      .boundingBox();
    if (!firstCardBox || !secondCardBox || !lastCardBox || !duplicateFirstCardBox) {
      throw new Error("Scale testimonial spacing geometry is unavailable");
    }
    const regularGap = secondCardBox.x - (firstCardBox.x + firstCardBox.width);
    const loopGap = duplicateFirstCardBox.x - (lastCardBox.x + lastCardBox.width);
    expect(Math.abs(loopGap - regularGap)).toBeLessThanOrEqual(2);
    await animationPauseStyle.evaluate((style) => style.parentNode?.removeChild(style));

    const firstCard = primaryTrack.getByTestId("scale-testimonial-card").first();
    const cardBox = await firstCard.boundingBox();
    const viewportBox = await page.getByTestId("scale-testimonials-viewport").boundingBox();
    if (!cardBox || !viewportBox) {
      throw new Error("Scale testimonial card geometry is unavailable");
    }
    expect(cardBox.width).toBeLessThanOrEqual(250);
    expect(cardBox.height).toBeLessThanOrEqual(250);
    expect(viewportBox.height).toBeGreaterThan(cardBox.height);

    const quote = firstCard.getByTestId("scale-testimonial-quote");
    const quoteBox = await quote.boundingBox();
    if (!quoteBox) {
      throw new Error("Scale testimonial quote geometry is unavailable");
    }
    expect(quoteBox.y + quoteBox.height).toBeLessThanOrEqual(cardBox.y + cardBox.height * 0.55);
    expect(
      await quote.evaluate((element) => Number.parseFloat(getComputedStyle(element).fontSize)),
    ).toBeLessThanOrEqual(15);

    const quoteGeometry = await primaryTrack
      .getByTestId("scale-testimonial-card")
      .evaluateAll((cards) =>
        cards.map((card) => {
          const cardRect = card.getBoundingClientRect();
          const quoteRect = card
            .querySelector('[data-testid="scale-testimonial-quote"]')
            ?.getBoundingClientRect();
          const quoteElement = card.querySelector('[data-testid="scale-testimonial-quote"]');
          return {
            quoteBottom: quoteRect?.bottom ?? Number.POSITIVE_INFINITY,
            cardMidpoint: cardRect.top + cardRect.height * 0.55,
            fontSize: quoteElement
              ? Number.parseFloat(getComputedStyle(quoteElement).fontSize)
              : Number.POSITIVE_INFINITY,
          };
        }),
      );
    for (const geometry of quoteGeometry) {
      expect(geometry.quoteBottom).toBeLessThanOrEqual(geometry.cardMidpoint);
      expect(geometry.fontSize).toBeLessThanOrEqual(15);
    }

    await expect(section.locator('img[data-image-src*="Umair%20Moideen"]').first()).toHaveAttribute(
      "data-image-src",
      "https://media.zypher-solutions.com/scale-page/section-5/Umair%20Moideen.webp",
    );

    const baseAnimation = await primaryTrack.evaluate((element) => {
      const styles = getComputedStyle(element);
      return { name: styles.animationName, duration: styles.animationDuration };
    });

    expect(baseAnimation.name).toContain("scale-testimonial-marquee");
    expect(baseAnimation.duration).toBe("42s");

    const railViewport = page.getByTestId("scale-testimonials-viewport");
    await railViewport.hover();
    const pausedAnimation = await primaryTrack.evaluate((element) => {
      const styles = getComputedStyle(element);
      return {
        duration: styles.animationDuration,
        playState: styles.animationPlayState,
        transform: styles.transform,
      };
    });
    expect(pausedAnimation.duration).toBe("42s");
    expect(pausedAnimation.playState).toBe("paused");
    await page.waitForTimeout(100);
    await expect
      .poll(() => primaryTrack.evaluate((element) => getComputedStyle(element).transform))
      .toBe(pausedAnimation.transform);
  });

  test("should remain inside the viewport on desktop, tablet, and mobile", async ({ page }) => {
    for (const viewport of [
      { width: 1440, height: 900 },
      { width: 1024, height: 1366 },
      { width: 390, height: 844 },
    ]) {
      await page.setViewportSize(viewport);
      await openPage(page, "/scale");

      const section = page.getByTestId("scale-testimonials-section");
      await section.scrollIntoViewIfNeeded();
      const sectionBox = await section.boundingBox();
      const headingBox = await section.getByRole("heading", { level: 2 }).boundingBox();
      const trackBox = await page.getByTestId("scale-testimonials-viewport").boundingBox();

      if (!sectionBox || !headingBox || !trackBox) {
        throw new Error("Scale testimonials responsive geometry is unavailable");
      }

      expect(headingBox.x).toBeGreaterThanOrEqual(sectionBox.x);
      expect(headingBox.x + headingBox.width).toBeLessThanOrEqual(sectionBox.x + sectionBox.width);
      expect(trackBox.x).toBeGreaterThanOrEqual(sectionBox.x);
      expect(trackBox.x + trackBox.width).toBeLessThanOrEqual(sectionBox.x + sectionBox.width);
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(
        viewport.width,
      );
    }
  });

  test.describe("touch controls", () => {
    test.use({ hasTouch: true });

    test("should pause while held, swipe the infinite rail, and resume on phone and tablet", async ({
      page,
    }) => {
      for (const viewportSize of [
        { width: 390, height: 844 },
        { width: 768, height: 1024 },
      ]) {
        await page.setViewportSize(viewportSize);
        await openPage(page, "/scale");

        const section = page.getByTestId("scale-testimonials-section");
        await section.scrollIntoViewIfNeeded();
        const viewport = section.getByTestId("scale-testimonials-viewport");
        const dragLayer = section.getByTestId("scale-testimonials-drag-layer");
        const primaryTrack = section.getByTestId("scale-testimonials-primary-track");

        expect(await viewport.evaluate((element) => getComputedStyle(element).touchAction)).toBe(
          "pan-y",
        );

        await viewport.dispatchEvent("pointerdown", {
          bubbles: true,
          clientX: 300,
          clientY: 120,
          pointerId: 1,
          pointerType: "touch",
        });
        await expect
          .poll(() =>
            primaryTrack.evaluate((element) => getComputedStyle(element).animationPlayState),
          )
          .toBe("paused");

        const transformBeforeSwipe = await dragLayer.evaluate(
          (element) => getComputedStyle(element).transform,
        );
        await viewport.dispatchEvent("pointermove", {
          bubbles: true,
          clientX: 190,
          clientY: 123,
          pointerId: 1,
          pointerType: "touch",
        });
        await expect
          .poll(() => dragLayer.evaluate((element) => getComputedStyle(element).transform))
          .not.toBe(transformBeforeSwipe);

        await viewport.dispatchEvent("pointerup", {
          bubbles: true,
          clientX: 190,
          clientY: 123,
          pointerId: 1,
          pointerType: "touch",
        });
        await expect
          .poll(() =>
            primaryTrack.evaluate((element) => getComputedStyle(element).animationPlayState),
          )
          .toBe("running");
        const duplicateTrack = section.getByTestId("scale-testimonials-duplicate-track");
        await expect(duplicateTrack).toBeVisible();

        const transformBeforeRightSwipe = await dragLayer.evaluate(
          (element) => getComputedStyle(element).transform,
        );
        await viewport.dispatchEvent("pointerdown", {
          bubbles: true,
          clientX: 190,
          clientY: 123,
          pointerId: 2,
          pointerType: "touch",
        });
        await viewport.dispatchEvent("pointermove", {
          bubbles: true,
          clientX: 300,
          clientY: 120,
          pointerId: 2,
          pointerType: "touch",
        });
        await viewport.dispatchEvent("pointerup", {
          bubbles: true,
          clientX: 300,
          clientY: 120,
          pointerId: 2,
          pointerType: "touch",
        });
        await expect
          .poll(() => dragLayer.evaluate((element) => getComputedStyle(element).transform))
          .not.toBe(transformBeforeRightSwipe);

        for (let swipeIndex = 0; swipeIndex < 20; swipeIndex += 1) {
          const pointerId = swipeIndex + 3;
          await viewport.dispatchEvent("pointerdown", {
            bubbles: true,
            clientX: 300,
            clientY: 120,
            pointerId,
            pointerType: "touch",
          });
          await viewport.dispatchEvent("pointermove", {
            bubbles: true,
            clientX: 190,
            clientY: 123,
            pointerId,
            pointerType: "touch",
          });
          await viewport.dispatchEvent("pointerup", {
            bubbles: true,
            clientX: 190,
            clientY: 123,
            pointerId,
            pointerType: "touch",
          });
        }

        const loopGeometry = await viewport.evaluate((element) => {
          const dragLayer = element.querySelector<HTMLElement>(
            '[data-testid="scale-testimonials-drag-layer"]',
          );
          const primaryTrack = element.querySelector<HTMLElement>(
            '[data-testid="scale-testimonials-primary-track"]',
          );
          const duplicateTrack = element.querySelector<HTMLElement>(
            '[data-testid="scale-testimonials-duplicate-track"]',
          );
          if (!dragLayer || !primaryTrack || !duplicateTrack) {
            throw new Error("Scale testimonial loop geometry is unavailable");
          }

          return {
            cycleDistance: Math.abs(
              duplicateTrack.getBoundingClientRect().x - primaryTrack.getBoundingClientRect().x,
            ),
            dragOffset: Math.abs(new DOMMatrixReadOnly(getComputedStyle(dragLayer).transform).m41),
          };
        });
        expect(loopGeometry.dragOffset).toBeLessThan(loopGeometry.cycleDistance);
      }
    });
  });
});
