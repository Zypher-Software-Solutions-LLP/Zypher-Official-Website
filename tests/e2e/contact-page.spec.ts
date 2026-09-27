import { expect, test } from "@playwright/test";
import { openPage } from "./helpers/site";
import { mockExternalProviders } from "./support/providers";

test.describe("Contact page", () => {
  test.beforeEach(async ({ page }) => {
    await mockExternalProviders(page);
  });

  test("should keep the hero inside the viewport and preserve the illustration rotation", async ({
    page,
  }) => {
    for (const viewport of [
      { width: 1440, height: 900 },
      { width: 1024, height: 768 },
      { width: 390, height: 844 },
    ]) {
      await page.setViewportSize(viewport);
      await openPage(page, "/contact");

      const hero = page.getByTestId("contact-hero");
      const heroBox = await hero.boundingBox();
      const grid = page.getByTestId("contact-hero-grid");
      const illustration = page.getByTestId("contact-hero-illustration");
      const illustrationBox = await illustration.boundingBox();

      if (!heroBox || !illustrationBox) {
        throw new Error("Contact hero geometry is unavailable");
      }

      expect(heroBox.width).toBeLessThanOrEqual(viewport.width);
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(
        viewport.width,
      );
      await expect(grid).toBeVisible();
      await expect(illustration).toHaveAttribute("data-rotation", "-8.17deg");
      const calWidget = page.getByTestId("contact-hero-cal-widget");
      await expect(calWidget).toBeVisible();
      await expect(calWidget).toHaveCSS("overflow", "hidden");
      const calScrollMetrics = await calWidget.evaluate((element) => ({
        clientHeight: element.clientHeight,
        clientWidth: element.clientWidth,
        scrollHeight: element.scrollHeight,
        scrollWidth: element.scrollWidth,
      }));
      expect(calScrollMetrics.scrollWidth).toBeLessThanOrEqual(calScrollMetrics.clientWidth + 1);
      expect(calScrollMetrics.scrollHeight).toBeLessThanOrEqual(calScrollMetrics.clientHeight + 1);
      await expect(page.getByTestId("contact-hero").locator("p").first()).toHaveCSS(
        "text-align",
        "justify",
      );

      const transform = await illustration.evaluate(
        (element) => getComputedStyle(element).transform,
      );
      expect(transform).not.toBe("none");

      const titleGradient = await page
        .getByTestId("contact-hero-title")
        .evaluate((element) => getComputedStyle(element).backgroundImage);
      expect(titleGradient).toContain("linear-gradient");
      expect(titleGradient).not.toContain("90deg");
      if (viewport.width >= 1200) {
        expect(illustrationBox.width).toBeGreaterThan(200);
      }
    }
  });

  test("should expose the contact destinations without a CTA or form", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await openPage(page, "/contact");

    const hero = page.getByTestId("contact-hero");
    await expect(hero.getByRole("link", { name: "info@zypher-solutions.com" })).toHaveAttribute(
      "href",
      "mailto:info@zypher-solutions.com",
    );
    await expect(hero.getByRole("link", { name: "+91 80757 25045" })).toHaveAttribute(
      "href",
      "tel:+918075725045",
    );
    await expect(hero.getByRole("link", { name: /Contact Us/ })).toHaveCount(0);
    await expect(hero.locator("form")).toHaveCount(0);
  });

  test("should keep the inquiry form responsive and validate its selectable fields", async ({
    page,
  }) => {
    for (const viewport of [
      { width: 1440, height: 900 },
      { width: 1024, height: 768 },
      { width: 390, height: 844 },
    ]) {
      await page.setViewportSize(viewport);
      await openPage(page, "/contact");

      const section = page.getByTestId("contact-inquiry-section");
      const sectionBox = await section.boundingBox();
      const panel = section.locator("[class*='contactInquiryPanel']");
      const panelBox = await panel.boundingBox();

      if (!sectionBox || !panelBox) {
        throw new Error("Contact inquiry geometry is unavailable");
      }

      expect(panelBox.width).toBeLessThanOrEqual(viewport.width);
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(
        viewport.width,
      );
      await expect(
        section.getByRole("heading", { name: "What are you trying to build or fix?" }),
      ).toBeVisible();
      await expect(section.getByRole("option", { name: "Cloud & Infrastructure" })).toHaveCount(1);
      await expect(section.getByRole("option", { name: "5,00,000 and above" })).toHaveCount(1);

      const countrySelector = section.getByRole("combobox", { name: "Phone country" });
      const phone = section.getByRole("textbox", { name: "Phone number" });
      await countrySelector.selectOption("india");
      await expect(countrySelector).toHaveValue("india");
      await expect(section.getByTestId("phone-country-flag")).toBeVisible();
      await phone.fill("8075725045");
      await expect(phone).toHaveValue("80757 25045");

      const prefixBox = await section.getByTestId("phone-country-prefix").boundingBox();
      const phoneBox = await phone.boundingBox();
      if (!prefixBox || !phoneBox) throw new Error("Phone field geometry is unavailable");
      expect(prefixBox.width).toBeLessThan(76);
      expect(phoneBox.width).toBeGreaterThan(prefixBox.width);

      await expect(section.getByTestId("budget-control")).toContainText("₹");
      expect(
        await section
          .getByRole("textbox", { name: "Name" })
          .evaluate((element) => getComputedStyle(element).backgroundColor),
      ).toBe("rgb(255, 255, 255)");

      const submitButton = section.getByRole("button", { name: "Submit Form" });
      await expect(submitButton).toBeVisible();
      await expect(submitButton).toHaveCSS("color", "rgb(16, 23, 21)");

      for (const select of await section.getByRole("combobox").all()) {
        await expect(select).toHaveCSS("appearance", "none");
      }
      await expect(section.getByTestId("phone-country-prefix")).toBeVisible();
      await expect(section.getByTestId("budget-control")).toBeVisible();
      await expect(section.getByRole("checkbox")).toHaveCount(0);

      if (viewport.width >= 768) {
        expect(panelBox.height).toBeGreaterThan(500);
        expect(sectionBox.height - panelBox.height).toBeGreaterThan(280);
      }
    }
  });

  test("should show a branded service menu when opened on desktop", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await openPage(page, "/contact");

    const section = page.getByTestId("contact-inquiry-section");
    await section.getByTestId("service-select-trigger").click();

    const menu = section.getByTestId("service-select-dropdown-menu");
    await expect(menu).toBeVisible();
    await expect(menu.getByRole("option", { name: "Software Development" })).toBeVisible();
  });
  test("should keep wheel scrolling inside the open service menu", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await openPage(page, "/contact");

    const section = page.getByTestId("contact-inquiry-section");
    await section.getByTestId("service-select-trigger").click();

    const menu = section.getByTestId("service-select-dropdown-menu");
    await expect(menu).toBeVisible();
    await expect(menu).toHaveCSS("overscroll-behavior-y", "contain");
    await expect(menu).toHaveAttribute("data-lenis-prevent", "true");

    const scrollMetrics = await menu.evaluate((element) => ({
      clientHeight: element.clientHeight,
      scrollHeight: element.scrollHeight,
    }));
    expect(scrollMetrics.scrollHeight).toBeGreaterThan(scrollMetrics.clientHeight);

    const pageScrollBefore = await page.evaluate(() => window.scrollY);
    const menuBox = await menu.boundingBox();
    if (!menuBox) {
      throw new Error("The open service menu did not have a visible bounding box.");
    }

    await page.mouse.move(menuBox.x + menuBox.width / 2, menuBox.y + menuBox.height / 2);
    await page.mouse.wheel(0, 400);
    await expect.poll(() => menu.evaluate((element) => element.scrollTop)).toBeGreaterThan(0);
    expect(await page.evaluate(() => window.scrollY)).toBe(pageScrollBefore);
  });
  test("should use the shared primary-button hover treatment", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await openPage(page, "/contact");

    const section = page.getByTestId("contact-inquiry-section");
    const submitButton = section.getByRole("button", { name: "Submit Form" });
    await submitButton.hover();

    await expect
      .poll(async () =>
        submitButton.evaluate((element) => {
          const style = getComputedStyle(element);
          return {
            backgroundColor: style.backgroundColor,
            borderColor: style.borderColor,
            boxShadow: style.boxShadow,
            color: style.color,
          };
        }),
      )
      .toEqual({
        backgroundColor: "rgb(244, 248, 246)",
        borderColor: "rgb(15, 71, 67)",
        boxShadow: "none",
        color: "rgb(15, 71, 67)",
      });
  });

  test("should keep the process cards and office map responsive", async ({ page }) => {
    for (const viewport of [
      { width: 1440, height: 900 },
      { width: 1024, height: 768 },
      { width: 390, height: 844 },
    ]) {
      await page.setViewportSize(viewport);
      await openPage(page, "/contact");

      const section = page.getByTestId("contact-process-section");
      await expect(
        section.getByRole("heading", { name: "What happens after you hit send?" }),
      ).toBeVisible();
      await expect(section.getByTitle("Work Well Coworking office location map")).toHaveAttribute(
        "src",
        "https://www.google.com/maps?q=WORK%20WELL%20COWORKING&output=embed",
      );
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(
        viewport.width,
      );

      const cards = section.locator("[data-testid^='contact-process-step-']");
      await expect(cards).toHaveCount(3);
      const cardBoxes = await cards.evaluateAll((elements) =>
        elements.map((element) => {
          const box = element.getBoundingClientRect();
          return { left: box.left, top: (element as HTMLElement).offsetTop };
        }),
      );

      if (viewport.width >= 768) {
        expect(new Set(cardBoxes.map((box) => box.top)).size).toBe(1);
      } else {
        expect(new Set(cardBoxes.map((box) => box.top)).size).toBe(3);
      }
    }
  });

  test("should highlight the hovered process step without resetting its state", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await openPage(page, "/contact");

    const section = page.getByTestId("contact-process-section");
    const firstStep = section.getByTestId("contact-process-step-01");
    const secondStep = section.getByTestId("contact-process-step-02");

    await secondStep.hover();
    await expect(secondStep).toHaveAttribute("data-active", "true");
    await expect(firstStep).toHaveAttribute("data-active", "false");
  });

  test("should use the shared smooth underline fade on hero links", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await openPage(page, "/contact");

    const emailLink = page.getByTestId("contact-hero").getByRole("link", {
      name: "info@zypher-solutions.com",
    });
    await emailLink.hover();

    await expect
      .poll(async () =>
        emailLink.evaluate((element) => {
          const underline = getComputedStyle(element, "::after");
          return {
            content: underline.content,
            opacity: underline.opacity,
            transitionProperty: underline.transitionProperty,
          };
        }),
      )
      .toEqual({
        content: '""',
        opacity: "1",
        transitionProperty: "opacity, transform",
      });
  });
  test("should keep Cal time slots visible and contained across responsive widths", async ({
    page,
  }) => {
    for (const viewport of [
      { width: 1440, height: 900 },
      { width: 1024, height: 768 },
    ]) {
      await page.setViewportSize(viewport);
      await openPage(page, "/contact");

      const calWidget = page.getByTestId("contact-hero-cal-widget");
      const calFrame = page.frameLocator("[data-testid='contact-hero-cal-widget'] iframe");
      await expect(calFrame.getByText(/^\d{1,2}:\d{2}(am|pm)$/).first()).toBeVisible();
      await expect(calWidget.locator("iframe")).toHaveCSS("border-radius", "20px");
      await expect(page.locator('[class$="__contactHeroGridLines"]')).toHaveCSS("z-index", "2");
      await expect(page.locator('[class$="__contactHeroCopy"]')).toHaveCSS("z-index", "2");
      await expect(page.locator('[class$="__contactHeroBooking"]')).toHaveCSS("z-index", "0");
      const frameBox = await calWidget.locator("xpath=..").boundingBox();
      const bookingBox = await calWidget.locator("xpath=../..").boundingBox();
      const iframeBox = await calWidget.locator("iframe").boundingBox();
      if (!bookingBox || !frameBox || !iframeBox) {
        throw new Error("Cal frame geometry is unavailable");
      }
      const frameCenter = frameBox.x + frameBox.width / 2;
      const bookingCenter = bookingBox.x + bookingBox.width / 2;
      expect(Math.abs(frameCenter - bookingCenter)).toBeLessThanOrEqual(1);
      expect(iframeBox.x).toBeGreaterThanOrEqual(frameBox.x - 1);
      expect(iframeBox.x + iframeBox.width).toBeLessThanOrEqual(frameBox.x + frameBox.width + 1);
      if (viewport.width >= 1200) {
        const scale = await calWidget.evaluate((element) => {
          const transform = getComputedStyle(element).transform;
          return Number(transform.match(/^matrix\(([^,]+)/)?.[1] ?? 1);
        });
        expect(scale).toBeGreaterThanOrEqual(0.6);
      }
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(
        viewport.width,
      );
    }
  });
});
