import { expect, test } from "@playwright/test";
import { openPage } from "./helpers/site";

test.describe("responsive Services FAQ section", () => {
  test("should show the Services question rail and dynamic answer on desktop", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 1080 });
    await openPage(page, "/services");

    const section = page.getByTestId("services-faq-section");
    const questionRail = section.getByTestId("faq-question-navigation");

    await expect(section).toBeVisible();
    await expect(questionRail).toBeVisible();
    await expect(questionRail.getByTestId("faq-question")).toHaveCount(7);
    await expect(section.getByRole("combobox")).toBeHidden();

    await questionRail
      .getByRole("button", {
        name: "Can you build a CRM that integrates with tools we already use, like Salesforce?",
      })
      .click();
    await expect(section.getByTestId("faq-answer-copy")).toHaveText(
      "Yes, third-party integration is part of the CRM/ERP service by default, not an add-on.",
    );
  });

  test("should use the compact selector on tablet and mobile", async ({ page }) => {
    for (const viewport of [768, 390]) {
      await page.setViewportSize({ width: viewport, height: 1024 });
      await openPage(page, "/services");

      const section = page.getByTestId("services-faq-section");
      const questionRail = section.getByTestId("faq-question-navigation");
      const selector = section.getByRole("combobox", {
        name: "Choose a frequently asked question",
      });

      await expect(questionRail).toBeHidden();
      await expect(selector).toBeVisible();
      await selector.selectOption("which-service");
      await expect(section.getByTestId("faq-answer-question-text")).toHaveText(
        "What if we're not sure which service we need?",
      );
    }
  });
});
