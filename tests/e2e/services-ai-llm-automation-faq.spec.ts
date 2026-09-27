import { expect, test } from "@playwright/test";
import { openPage } from "./helpers/site";

test.describe("AI & LLM Automation FAQ", () => {
  test("should show the numbered question rail and update the answer on desktop", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 1080 });
    await openPage(page, "/services/ai-llm-automation");

    const section = page.getByTestId("ai-llm-automation-faq-section");
    const rail = section.getByTestId("faq-question-navigation");

    await expect(section).toBeVisible();
    await expect(
      section.getByRole("heading", { level: 2, name: "Questions Worth asking" }),
    ).toBeVisible();
    await expect(section.getByText("The answers we’d want before hiring anyone")).toHaveCSS(
      "color",
      "rgb(16, 23, 21)",
    );
    await expect(rail.getByTestId("faq-question")).toHaveCount(8);
    await expect(section.getByRole("combobox")).toBeHidden();

    const pricingQuestion = rail.getByRole("button", {
      name: "How is an AI automation project priced? What affects the cost?",
    });
    await pricingQuestion.click();

    await expect(pricingQuestion).toHaveAttribute("aria-current", "true");
    await expect(section.getByTestId("faq-answer-copy")).toContainText(
      "You always get a fixed quote after discovery",
    );
  });

  test("should use the accessible question selector on tablet and mobile", async ({ page }) => {
    await page.setViewportSize({ width: 1024, height: 768 });
    await openPage(page, "/services/ai-llm-automation");

    const section = page.getByTestId("ai-llm-automation-faq-section");
    const questionRail = section.getByTestId("faq-question-navigation");
    const selector = section.getByRole("combobox", {
      name: "Choose a frequently asked question",
    });

    await expect(questionRail).toBeHidden();
    await expect(selector).toBeVisible();

    for (const width of [768, 390, 320]) {
      await page.setViewportSize({ width, height: 900 });
      await expect(selector).toBeVisible();
      await selector.selectOption("ai-data-access");
      await expect(section.getByTestId("faq-answer-question-text")).toHaveText(
        "Where is our data processed during the build, and who has access to it?",
      );
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(
        width,
      );
    }
  });

  test("should place the shared CTA after the FAQ and before the site footer", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await openPage(page, "/services/ai-llm-automation");

    const section = page.getByTestId("ai-llm-automation-faq-section");
    const cta = page.getByTestId("cta-section");
    const footer = page.locator("footer");

    await expect(section).toBeVisible();
    await expect(cta).toBeVisible();
    await expect(footer).toBeVisible();
    const mainOrder = await page
      .getByRole("main")
      .evaluate((main) =>
        Array.from(main.children).map((element) => element.getAttribute("data-testid")),
      );
    const ctaPrecedesFooter = await cta.evaluate((element) => {
      const footerElement = document.querySelector("footer");
      return footerElement !== null && Boolean(element.compareDocumentPosition(footerElement) & 4);
    });

    expect(mainOrder.slice(-2)).toEqual(["ai-llm-automation-faq-section", "cta-section"]);
    expect(ctaPrecedesFooter).toBe(true);
    await expect(cta.getByRole("link", { name: "WhatsApp Us" })).toHaveAttribute(
      "href",
      /wa\.me\/918075725045/,
    );
  });
});
