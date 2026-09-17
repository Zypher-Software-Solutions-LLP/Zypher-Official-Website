import { expect, test } from "@playwright/test";
import { openPage } from "./helpers/site";

test.describe("responsive homepage How We Work section", () => {
  test("should cap panel height on a 4K viewport", async ({ page }) => {
    await page.setViewportSize({ width: 3840, height: 2160 });
    await openPage(page);

    const geometry = await page.getByTestId("how-we-work-panel-discover").evaluate((panel) => ({
      minHeight: Number.parseFloat(getComputedStyle(panel).minHeight),
    }));

    expect(geometry.minHeight).toBeLessThanOrEqual(1_100);
  });

  test("should keep panel height compact on a 1440p viewport", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 1080 });
    await openPage(page);

    const geometry = await page.getByTestId("how-we-work-panel-discover").evaluate((panel) => ({
      minHeight: Number.parseFloat(getComputedStyle(panel).minHeight),
    }));

    expect(geometry.minHeight).toBeLessThanOrEqual(1_000);
  });
  test("should advance the active desktop step without bouncing backward", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 1080 });
    await openPage(page);

    const section = page.getByTestId("how-we-work-section");
    const bounds = await section.evaluate((element) => {
      const box = element.getBoundingClientRect();
      return { bottom: box.bottom + window.scrollY, top: box.top + window.scrollY };
    });
    const stepNames = ["Discover", "Scope & Quote", "Build", "Launch & Stay On"];
    const activeSteps: string[] = [];

    for (let top = bounds.top + 20; top < bounds.bottom - 200; top += 120) {
      await page.evaluate(
        (scrollTop) => window.scrollTo({ behavior: "auto", top: scrollTop }),
        top,
      );
      await page.waitForTimeout(35);

      const activeStep = await section
        .locator('[data-testid="how-we-work-step-button"][aria-current="true"]')
        .textContent();
      const normalizedStep = activeStep?.replace(/^\d+/, "").trim();

      if (normalizedStep && activeSteps.at(-1) !== normalizedStep) {
        activeSteps.push(normalizedStep);
      }
    }

    const activeStepIndexes = activeSteps.map((step) => stepNames.indexOf(step));
    expect(
      activeStepIndexes.every(
        (index, position) => position === 0 || index >= activeStepIndexes[position - 1],
      ),
    ).toBe(true);
  });

  test("should switch dock stages on one click", async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await openPage(page);

    const section = page.getByTestId("how-we-work-section");
    const sectionTop = await section.evaluate(
      (element) => element.getBoundingClientRect().top + window.scrollY,
    );
    const dock = page.getByTestId("how-we-work-jump-dock");

    await page.evaluate(
      (scrollTop) => window.scrollTo({ behavior: "auto", top: scrollTop }),
      sectionTop - 512,
    );
    await expect(dock).toHaveAttribute("data-state", "visible");

    const buildButton = dock.getByTestId("how-we-work-jump-button").nth(2);
    await buildButton.click();

    await expect(buildButton).toHaveAttribute("aria-current", "true");
    await expect(section.getByTestId("how-we-work-panel-built-from-scratch")).toHaveAttribute(
      "data-active",
      "true",
    );
  });

  test("should respond to a dock touch while the page is still scrolling", async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await openPage(page);

    const section = page.getByTestId("how-we-work-section");
    const sectionTop = await section.evaluate(
      (element) => element.getBoundingClientRect().top + window.scrollY,
    );
    const dock = page.getByTestId("how-we-work-jump-dock");

    await page.evaluate(
      (scrollTop) => window.scrollTo({ behavior: "auto", top: scrollTop }),
      sectionTop - 512,
    );
    await expect(dock).toHaveAttribute("data-state", "visible");

    await page.evaluate(
      (scrollTop) => window.scrollTo({ behavior: "smooth", top: scrollTop }),
      sectionTop - 256,
    );

    const buildButton = dock.getByTestId("how-we-work-jump-button").nth(2);
    await buildButton.dispatchEvent("pointerdown", { pointerType: "touch" });

    await expect(buildButton).toHaveAttribute("aria-current", "true");
    await expect(section.getByTestId("how-we-work-panel-built-from-scratch")).toHaveAttribute(
      "data-active",
      "true",
    );
  });

  test("should show the dock after section entry and hide it after section exit", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await openPage(page);

    const section = page.getByTestId("how-we-work-section");
    const sectionTop = await section.evaluate(
      (element) => element.getBoundingClientRect().top + window.scrollY,
    );
    const dock = page.getByTestId("how-we-work-jump-dock");

    const sectionBounds = await section.evaluate((element) => {
      const box = element.getBoundingClientRect();

      return {
        bottom: box.bottom + window.scrollY,
        top: box.top + window.scrollY,
      };
    });

    await page.evaluate(
      (scrollTop) => window.scrollTo({ behavior: "auto", top: scrollTop }),
      sectionTop - 1024 + 8,
    );
    await expect(dock).toHaveCSS("opacity", "0");

    await page.evaluate(
      (scrollTop) => window.scrollTo({ behavior: "auto", top: scrollTop }),
      sectionTop - 512,
    );
    await expect(dock).toHaveCSS("opacity", "1");

    await page.evaluate(
      (scrollTop) => window.scrollTo({ behavior: "auto", top: scrollTop }),
      sectionBounds.bottom + 20,
    );
    await expect(dock).toHaveCSS("opacity", "0");

    const dockWidth = await dock.evaluate((element) =>
      Number.parseFloat(getComputedStyle(element).width),
    );
    expect(dockWidth).toBeLessThanOrEqual(240);
  });
});
