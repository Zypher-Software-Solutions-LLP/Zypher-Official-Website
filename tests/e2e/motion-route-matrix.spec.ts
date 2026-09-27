import { expect, test } from "@playwright/test";
import { publicRoutes } from "../../src/lib/routes";
import { openPage } from "./helpers/site";

const expectedSectionSelectors: Partial<Record<(typeof publicRoutes)[number], readonly string[]>> =
  {
    "/": ['[data-testid="solutions-section"]'],
    "/services": [
      '[data-testid="ai-automation-section"]',
      '[data-testid="core-expertise-section"]',
      '[data-testid="extended-capabilities-section"]',
      '[data-testid="scope-approach-section"]',
      '[data-testid="services-faq-section"]',
      '[data-testid="cta-section"]',
    ],
    "/services/software-development": [
      '[data-testid="software-development-section-two"]',
      '[data-testid="software-development-section-three"]',
      '[data-testid="software-development-section-four"]',
      '[data-testid="software-development-section-five"]',
      '[data-testid="software-development-faq-section"]',
      '[data-testid="cta-section"]',
    ],
    "/services/mobile-app-development": [
      '[data-testid="mobile-app-development-section-two"]',
      '[data-testid="mobile-app-development-section-three"]',
      '[data-testid="mobile-app-development-section-four"]',
      '[data-testid="mobile-app-development-section-five"]',
      '[data-testid="mobile-app-development-faq-section"]',
      '[data-testid="cta-section"]',
    ],
    "/services/ai-llm-automation": [
      '[data-testid="ai-llm-section-two"]',
      '[data-testid="ai-llm-section-three"]',
      '[data-testid="ai-llm-section-four"]',
      '[data-testid="ai-llm-section-five"]',
      '[data-testid="ai-llm-automation-faq-section"]',
      '[data-testid="cta-section"]',
    ],
    "/services/design-creative": [
      '[data-testid="design-creative-section-two"]',
      '[data-testid="design-creative-section-three"]',
      '[data-testid="design-creative-section-four"]',
      '[data-testid="design-creative-section-five"]',
      '[data-testid="design-creative-faq-section"]',
      '[data-testid="cta-section"]',
    ],
    "/services/crm-erp-solutions": [
      '[data-testid="crm-erp-solutions-section-two"]',
      '[data-testid="crm-erp-solutions-section-three"]',
      '[data-testid="crm-erp-solutions-section-four"]',
      '[data-testid="crm-erp-solutions-section-five"]',
      '[data-testid="crm-erp-solutions-faq-section"]',
      '[data-testid="cta-section"]',
    ],
    "/work": ['[data-testid="work-projects-section"]', '[data-testid="cta-section"]'],
    "/scale": ['[data-testid="scale-engagement-section"]', '[data-testid="cta-section"]'],
    "/about": ['[data-testid="about-story"]', '[data-testid="cta-section"]'],
    "/blog": ['[data-testid="blog-posts-section"]'],
    "/contact": [
      '[data-testid="contact-inquiry-section"]',
      '[data-testid="contact-process-section"]',
    ],
    "/privacy-policy": ['[data-testid="privacy-policy-reader"]'],
    "/terms-of-use": ['[data-testid="terms-of-use-reader"]'],
    "/cookie-policy": ['[data-testid="cookie-policy-reader"]'],
  };

test.describe("sitewide motion route coverage", () => {
  for (const route of publicRoutes) {
    test(`${route} exposes a page intro and expected reveal surface`, async ({ page }) => {
      await openPage(page, route);

      await expect(page.locator("[data-motion-intro]")).toHaveCount(1);

      const sectionSelectors = expectedSectionSelectors[route];
      for (const sectionSelector of sectionSelectors ?? []) {
        await expect(page.locator(sectionSelector).first()).toHaveCount(1);
      }
    });
  }

  test("dynamic blog articles use page-entry motion without section replay targets", async ({
    page,
  }) => {
    await openPage(page, "/blog/missing-article");

    await expect(page.locator("[data-motion-intro]")).toHaveCount(1);
    await expect(page.locator("[data-motion-section]")).toHaveCount(0);
  });

  test("the 404 foreground uses page-entry motion while its background remains separate", async ({
    page,
  }) => {
    await openPage(page, "/this-page-does-not-exist");

    await expect(page.locator("[data-motion-intro]")).toHaveCount(1);
    await expect(page.getByTestId("not-found-background-illustration")).not.toHaveAttribute(
      "data-motion-intro",
    );
  });
});
