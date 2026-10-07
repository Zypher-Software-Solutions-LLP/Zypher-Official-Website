import { expect, test } from "@playwright/test";
import { openPage } from "./helpers/site";

test.describe("Services extended capabilities", () => {
  test("should defer section entrance animations until the section enters the viewport", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 700 });
    await openPage(page, "/services");

    const section = page.getByTestId("extended-capabilities-section");
    const initialState = await section.evaluate((element) => {
      const media = element.querySelector<HTMLElement>("[data-testid='extended-capability-media']");
      const content = element.querySelector<HTMLElement>(
        "[data-testid='extended-capability-content']",
      );

      if (!media || !content) {
        throw new Error("Missing extended capabilities animation elements");
      }

      return {
        sectionState: element.getAttribute("data-reveal-state"),
        mediaAnimationState: getComputedStyle(media).animationPlayState,
        contentAnimationState: getComputedStyle(content).animationPlayState,
      };
    });

    expect(initialState.sectionState).toBe("hidden");
    expect(initialState.mediaAnimationState).toBe("paused");
    expect(initialState.contentAnimationState).toBe("paused");

    await section.scrollIntoViewIfNeeded();
    await expect.poll(() => section.getAttribute("data-reveal-state")).toBe("visible");
  });

  test("should render the desktop master-detail composition with animated color and content states", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await openPage(page, "/services");

    const section = page.getByTestId("extended-capabilities-section");
    await section.scrollIntoViewIfNeeded();

    await expect(section.getByRole("heading", { name: "Extended Capabilities" })).toBeVisible();
    await expect(section.getByRole("button")).toHaveCount(5);
    await expect(section.getByRole("heading", { name: "Cybersecurity" })).toBeVisible();
    await expect(section.getByTestId("extended-capability-deliverable")).toHaveCount(3);

    const desktopLayout = await section.evaluate((element) => {
      const frame = element.querySelector<HTMLElement>(
        "[data-testid='extended-capabilities-frame']",
      );
      const controls = element.querySelector<HTMLElement>(
        "[data-testid='extended-capability-controls']",
      );
      const image = element.querySelector<HTMLElement>("[data-testid='extended-capability-media']");
      const content = element.querySelector<HTMLElement>(
        "[data-testid='extended-capability-content']",
      );
      const activeControl = controls?.querySelector<HTMLElement>("[data-state='active']");
      const icon = controls?.querySelector<HTMLElement>("[class*='controlIcon']");

      if (!frame || !controls || !image || !content || !activeControl || !icon) {
        throw new Error("Missing extended capabilities layout");
      }

      return {
        frameColumns: getComputedStyle(frame).gridTemplateColumns.split(" ").length,
        controlsWidth: controls.getBoundingClientRect().width,
        controlsBackground: getComputedStyle(controls).backgroundColor,
        imageWidth: image.getBoundingClientRect().width,
        contentWidth: content.getBoundingClientRect().width,
        iconWidth: icon.getBoundingClientRect().width,
        activeControlColor: getComputedStyle(activeControl).color,
        imageSource: image.querySelector("img")?.getAttribute("src"),
        mediaBeforeContent: Boolean(
          image.compareDocumentPosition(content) & Node.DOCUMENT_POSITION_FOLLOWING,
        ),
      };
    });

    expect(desktopLayout.frameColumns).toBe(3);
    expect(desktopLayout.controlsWidth).toBeGreaterThan(120);
    expect(desktopLayout.controlsBackground).toBe("rgb(15, 71, 67)");
    expect(desktopLayout.imageWidth).toBeGreaterThan(200);
    expect(desktopLayout.contentWidth).toBeGreaterThan(200);
    expect(desktopLayout.iconWidth).toBeGreaterThan(48);
    expect(desktopLayout.activeControlColor).toBe("rgb(16, 23, 21)");
    expect(desktopLayout.imageSource).toContain("Cybersecurity%2520-%2520Thumbnail.webp");
    expect(desktopLayout.mediaBeforeContent).toBe(true);

    const cta = section.getByRole("link", { name: "Get In Touch →" });
    await cta.hover();
    await expect(cta).toHaveCSS("background-color", "rgb(244, 248, 246)");

    await section.getByRole("button", { name: "Cloud & Infrastructure" }).click();
    await expect(section.getByRole("heading", { name: "Cloud & Infrastructure" })).toBeVisible();
    await expect(section.getByRole("button", { name: "Cloud & Infrastructure" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );

    const animatedState = await section.evaluate((element) => {
      const media = element.querySelector<HTMLElement>("[data-testid='extended-capability-media']");
      const content = element.querySelector<HTMLElement>(
        "[data-testid='extended-capability-content']",
      );

      if (!media || !content) {
        throw new Error("Missing animated capability content");
      }

      return {
        mediaAnimation: getComputedStyle(media).animationName,
        contentAnimation: getComputedStyle(content).animationName,
      };
    });

    expect(animatedState.mediaAnimation).toContain("capability-content-in");
    expect(animatedState.contentAnimation).toContain("capability-content-in");
  });

  test("should not scroll to the first mobile capability on initial page load", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await openPage(page, "/services");

    await page.waitForTimeout(400);
    expect(await page.evaluate(() => window.scrollY)).toBeLessThan(8);
  });

  test("should place the mobile accordion content directly under the selected service", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await openPage(page, "/services");

    const section = page.getByTestId("extended-capabilities-section");
    await section.scrollIntoViewIfNeeded();
    const accordion = section.getByTestId("extended-capabilities-mobile-accordion");

    await expect(accordion).toBeVisible();
    await expect(accordion.getByRole("button")).toHaveCount(5);
    await expect(accordion.getByTestId("extended-capability-mobile-content")).toBeVisible();

    const initialLayout = await accordion.evaluate((element) => {
      const firstButton = element.querySelector<HTMLElement>("button");
      const content = element.querySelector<HTMLElement>(
        "[data-testid='extended-capability-mobile-content']",
      );

      if (!firstButton || !content) {
        throw new Error("Missing mobile accordion layout");
      }

      return {
        accordionDisplay: getComputedStyle(element).display,
        buttonBottom: firstButton.getBoundingClientRect().bottom,
        contentTop: content.getBoundingClientRect().top,
        viewportWidth: window.innerWidth,
        documentWidth: document.documentElement.scrollWidth,
        controlMinHeight: Math.min(
          ...Array.from(
            element.querySelectorAll("button"),
            (button) => button.getBoundingClientRect().height,
          ),
        ),
      };
    });

    expect(initialLayout.accordionDisplay).toBe("grid");
    expect(initialLayout.buttonBottom).toBeLessThanOrEqual(initialLayout.contentTop);
    expect(initialLayout.documentWidth).toBeLessThanOrEqual(initialLayout.viewportWidth);
    expect(initialLayout.controlMinHeight).toBeGreaterThanOrEqual(44);

    await accordion.getByRole("button", { name: "Data Analytics & Data Science" }).click();
    await expect(
      accordion.getByRole("heading", { name: "Data Analytics & Data Science" }),
    ).toBeVisible();
    await expect(accordion.getByTestId("extended-capability-mobile-deliverable")).toHaveCount(3);

    await expect
      .poll(() =>
        accordion
          .getByRole("button", { name: "Data Analytics & Data Science" })
          .evaluate((button) => button.getBoundingClientRect().top),
      )
      .toBeLessThan(130);
  });

  test("should center tablet icons above their labels and keep the image compact", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 820, height: 1180 });
    await openPage(page, "/services");

    const section = page.getByTestId("extended-capabilities-section");
    await section.scrollIntoViewIfNeeded();

    const tabletLayout = await section.evaluate((element) => {
      const frame = element.querySelector<HTMLElement>(
        "[data-testid='extended-capabilities-frame']",
      );
      const media = element.querySelector<HTMLElement>("[data-testid='extended-capability-media']");
      const controls = element.querySelector<HTMLElement>(
        "[data-testid='extended-capability-controls']",
      );
      const control = controls?.querySelector<HTMLElement>("button");
      const icon = control?.querySelector<HTMLElement>("[class*='controlIcon']");
      const label = control?.querySelector<HTMLElement>("[class*='controlLabel']");

      if (!frame || !media || !controls || !control || !icon || !label) {
        throw new Error("Missing tablet extended capabilities layout");
      }

      const controlRect = control.getBoundingClientRect();
      const iconRect = icon.getBoundingClientRect();
      const labelRect = label.getBoundingClientRect();

      return {
        frameColumns: getComputedStyle(frame).gridTemplateColumns.split(" ").length,
        mediaHeight: media.getBoundingClientRect().height,
        mediaWidth: media.getBoundingClientRect().width,
        controlsWidth: controls.getBoundingClientRect().width,
        iconCenterOffset: Math.abs(
          iconRect.left + iconRect.width / 2 - (controlRect.left + controlRect.width / 2),
        ),
        labelCenterOffset: Math.abs(
          labelRect.left + labelRect.width / 2 - (controlRect.left + controlRect.width / 2),
        ),
        iconBelowLabel: iconRect.bottom <= labelRect.top,
        viewportWidth: window.innerWidth,
        documentWidth: document.documentElement.scrollWidth,
      };
    });

    expect(tabletLayout.frameColumns).toBe(2);
    expect(tabletLayout.mediaHeight).toBeLessThan(tabletLayout.mediaWidth * 1.3);
    expect(tabletLayout.controlsWidth).toBeLessThan(180);
    expect(tabletLayout.iconCenterOffset).toBeLessThanOrEqual(1);
    expect(tabletLayout.labelCenterOffset).toBeLessThanOrEqual(1);
    expect(tabletLayout.iconBelowLabel).toBe(true);
    expect(tabletLayout.documentWidth).toBeLessThanOrEqual(tabletLayout.viewportWidth);
  });
});
