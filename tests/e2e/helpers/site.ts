import { expect, type Page } from "@playwright/test";

export async function dismissConsent(page: Page): Promise<void> {
  const consentDialog = page.getByRole("dialog", { name: "Cookie consent" });
  const hasStoredConsent = await page.evaluate(() =>
    document.cookie.includes("zypher_consent_v1="),
  );

  if (hasStoredConsent) {
    await expect(consentDialog).toBeHidden();
    return;
  }

  await expect(consentDialog).toBeVisible();
  const rejectButton = consentDialog.getByRole("button", { name: "Reject optional" });
  await expect(rejectButton).toBeEnabled();
  await rejectButton.click();
  await expect(consentDialog).toBeHidden();
}

export async function openPage(page: Page, path = "/"): Promise<void> {
  await page.goto(path);
  await dismissConsent(page);
}
