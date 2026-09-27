import { expect, test } from "@playwright/test";

test.describe("security headers", () => {
  test("should send enforced security headers on public, Studio, and API routes", async ({
    request,
  }) => {
    for (const path of ["/", "/contact", "/blog", "/studio", "/api/contact"]) {
      const response = await request.get(path);
      const headers = response.headers();

      expect(headers["content-security-policy"], path).toContain("default-src 'self'");
      expect(headers["content-security-policy-report-only"], path).toBeUndefined();
      expect(headers["x-content-type-options"], path).toBe("nosniff");
      expect(headers["x-frame-options"], path).toBe("DENY");
      expect(headers["referrer-policy"], path).toBe("strict-origin-when-cross-origin");
    }
  });

  test("should prevent indexing of the embedded Studio and public API", async ({ request }) => {
    for (const path of ["/studio", "/api/contact"]) {
      const response = await request.get(path);
      expect(response.headers()["x-robots-tag"], path).toBe("noindex, nofollow");
    }
  });
});
