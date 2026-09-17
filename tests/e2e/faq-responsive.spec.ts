import { expect, test, type Page } from "@playwright/test";

async function dismissConsent(page: Page): Promise<void> {
  const consentDialog = page.getByRole("dialog", { name: "Cookie consent" });
  if (await consentDialog.isVisible()) {
    await consentDialog.getByRole("button", { name: "Reject optional" }).click();
  }
}

test.describe("responsive homepage FAQ section", () => {
  test("should show the question rail and dynamic answer on desktop", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 1080 });
    await page.goto("/");
    await dismissConsent(page);

    const section = page.getByTestId("faq-section");
    const questionRail = section.locator(".faq-section__navigation");
    const selector = section.getByRole("combobox", {
      name: "Choose a frequently asked question",
    });

    await expect(
      section.getByRole("heading", {
        level: 2,
        name: "Questions you’re probably already asking",
      }),
    ).toBeVisible();
    await expect(questionRail).toBeVisible();
    await expect(questionRail.getByTestId("faq-question")).toHaveCount(9);
    await expect(selector).toBeHidden();
    await expect(section.getByTestId("faq-answer-question")).toHaveCSS("display", "flex");
    const answerQuestion = section.getByTestId("faq-answer-question").getByRole("heading", {
      level: 4,
    });
    await expect(answerQuestion).toHaveCSS("font-weight", "400");
    await expect(answerQuestion).toHaveCSS("font-size", "28px");
    await expect(section.locator(".faq-section__answer-copy")).toHaveCSS("font-weight", "400");

    await questionRail
      .getByRole("button", { name: "How long does custom software development take?" })
      .click();
    await expect(section.getByTestId("faq-answer").getByRole("heading", { level: 4 })).toHaveText(
      "How long does custom software development take?",
    );
  });

  test("should replace the question rail with a centered selector on tablet", async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto("/");
    await dismissConsent(page);

    const section = page.getByTestId("faq-section");
    const questionRail = section.locator(".faq-section__navigation");
    const selector = section.getByRole("combobox", {
      name: "Choose a frequently asked question",
    });

    await expect(questionRail).toBeHidden();
    await expect(selector).toBeVisible();
    await expect(
      section.getByRole("heading", { level: 3, name: "The Answers to the Questions" }),
    ).toBeHidden();
    await expect(section.locator(".faq-section__answer-number")).toBeHidden();
    await selector.selectOption("freelancer-or-agency");
    await expect(selector.locator("option:checked")).toHaveText(
      "What’s the difference between hiring a freelancer and working with an agency like Zypher?",
    );
    await expect(section.getByTestId("faq-answer").getByRole("heading", { level: 4 })).toHaveText(
      "What’s the difference between hiring a freelancer and working with an agency like Zypher?",
    );
  });
});
