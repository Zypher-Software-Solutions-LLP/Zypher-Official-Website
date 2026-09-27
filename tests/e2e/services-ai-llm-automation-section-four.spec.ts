import { expect, test } from "@playwright/test";
import { openPage } from "./helpers/site";

const stageHeadings = [
  "Discovery",
  "Architecture & Scope",
  "Build & Integration",
  "Handoff & Documentation",
];

test.describe("AI and LLM automation Section 4", () => {
  test("should render four icon-free stages after Section 3 and activate a selected stage", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 1080 });
    await openPage(page, "/services/ai-llm-automation");

    const section = page.getByTestId("ai-llm-section-four");
    const stageButtons = section.getByTestId("ai-llm-section-four-step-button");

    await expect(section).toBeVisible();
    await expect(section.locator("xpath=preceding-sibling::*[1]")).toHaveAttribute(
      "data-testid",
      "ai-llm-section-three",
    );
    await expect(stageButtons).toHaveCount(stageHeadings.length);
    await expect(section.getByRole("img")).toHaveCount(stageHeadings.length);

    for (const heading of stageHeadings) {
      await expect(section.getByRole("heading", { level: 3, name: heading })).toBeVisible();
    }

    const architectureButton = section.getByRole("button", { name: "Architecture & Scope" });
    await architectureButton.click();

    await expect(architectureButton).toHaveAttribute("aria-current", "true");
    await expect(
      section.getByTestId("ai-llm-section-four-panel-architecture-and-scope"),
    ).toHaveAttribute("data-active", "true");
  });

  test("should fit the section without horizontal overflow on desktop, tablet, and phone", async ({
    page,
  }) => {
    await openPage(page, "/services/ai-llm-automation");

    for (const viewport of [
      { width: 1440, height: 1080 },
      { width: 768, height: 1024 },
      { width: 390, height: 844 },
    ]) {
      await page.setViewportSize(viewport);

      const dimensions = await page.getByTestId("ai-llm-section-four").evaluate((section) => ({
        clientWidth: section.clientWidth,
        scrollWidth: section.scrollWidth,
      }));

      expect(dimensions.scrollWidth).toBeLessThanOrEqual(dimensions.clientWidth + 1);
    }
  });

  test("should show four quick-navigation buttons and activate a stage on a phone", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await openPage(page, "/services/ai-llm-automation");

    const section = page.getByTestId("ai-llm-section-four");
    const sectionTop = await section.evaluate(
      (element) => element.getBoundingClientRect().top + window.scrollY,
    );
    const dock = section.getByTestId("ai-llm-section-four-jump-dock");

    await page.evaluate(
      (top) => window.scrollTo({ behavior: "auto", top: top - window.innerHeight / 2 }),
      sectionTop,
    );
    await expect(dock).toHaveAttribute("data-state", "visible");
    await expect(dock.getByTestId("ai-llm-section-four-jump-button")).toHaveCount(4);

    const consentDialog = page.getByRole("dialog", { name: "Cookie consent" });

    if (await consentDialog.isVisible()) {
      await consentDialog.getByRole("button", { name: "Reject optional" }).click();
      await expect(consentDialog).toBeHidden();
    }

    const handoffButton = dock.getByRole("button", { name: "Handoff & Documentation" });
    await handoffButton.click();

    await expect(handoffButton).toHaveAttribute("aria-current", "true");
    await expect(
      section.getByTestId("ai-llm-section-four-panel-handoff-and-documentation"),
    ).toHaveAttribute("data-active", "true");
  });
});
