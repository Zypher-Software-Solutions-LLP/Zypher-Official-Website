import { expect, test, type Page } from "@playwright/test";

async function dismissConsent(page: Page): Promise<void> {
  const consentDialog = page.getByRole("dialog", { name: "Cookie consent" });
  if (await consentDialog.isVisible()) {
    await consentDialog.getByRole("button", { name: "Reject optional" }).click();
  }
}

test.describe("responsive homepage How We Work section", () => {
  test("should cap panel height on a 4K viewport", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name === "mobile", "4K layout check runs in the desktop project.");
    await page.setViewportSize({ width: 3840, height: 2160 });
    await page.goto("/");
    await dismissConsent(page);

    const geometry = await page.getByTestId("how-we-work-panel-discover").evaluate((panel) => ({
      minHeight: Number.parseFloat(getComputedStyle(panel).minHeight),
    }));

    expect(geometry.minHeight).toBeLessThanOrEqual(1_100);
  });

  test("should keep panel height compact on a 1440p viewport", async ({ page }, testInfo) => {
    test.skip(
      testInfo.project.name === "mobile",
      "1440p layout check runs in the desktop project.",
    );
    await page.setViewportSize({ width: 2560, height: 1440 });
    await page.goto("/");
    await dismissConsent(page);

    const geometry = await page.getByTestId("how-we-work-panel-discover").evaluate((panel) => ({
      minHeight: Number.parseFloat(getComputedStyle(panel).minHeight),
    }));

    expect(geometry.minHeight).toBeLessThanOrEqual(1_000);
  });
  test("should advance the active desktop step without bouncing backward", async ({
    page,
  }, testInfo) => {
    test.skip(
      testInfo.project.name === "mobile",
      "Desktop active-step check runs in the desktop project.",
    );
    await page.setViewportSize({ width: 1440, height: 1080 });
    await page.goto("/");
    await dismissConsent(page);

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
        .locator('.how-we-work__step-button[aria-current="true"]')
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

  test("should show a compact dock as soon as the section enters the viewport", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto("/");
    await dismissConsent(page);

    const section = page.getByTestId("how-we-work-section");
    const sectionTop = await section.evaluate(
      (element) => element.getBoundingClientRect().top + window.scrollY,
    );
    const dock = page.getByTestId("how-we-work-jump-dock");

    await page.evaluate(
      (scrollTop) => window.scrollTo({ behavior: "auto", top: scrollTop }),
      sectionTop - 8,
    );
    await expect(dock).toHaveCSS("opacity", "1");

    const dockWidth = await dock.evaluate((element) =>
      Number.parseFloat(getComputedStyle(element).width),
    );
    expect(dockWidth).toBeLessThanOrEqual(240);
  });
});
