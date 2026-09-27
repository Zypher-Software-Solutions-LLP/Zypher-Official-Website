import { describe, expect, it } from "vitest";
import { getEnvironment, validateProductionEnvironment } from "@/lib/env";

describe("environment configuration", () => {
  it("should expose the server-only Sanity revalidation secret", () => {
    process.env.SANITY_REVALIDATE_SECRET = "test-webhook-secret";

    expect(getEnvironment().SANITY_REVALIDATE_SECRET).toBe("test-webhook-secret");
  });

  it("should accept a complete production configuration", () => {
    const result = validateProductionEnvironment({
      NEXT_PUBLIC_SITE_URL: "https://zypher-solutions.com",
      NEXT_PUBLIC_SANITY_PROJECT_ID: "zypher-project",
      NEXT_PUBLIC_SANITY_DATASET: "production",
      SANITY_PREVIEW_SECRET: "p".repeat(32),
      SANITY_REVALIDATE_SECRET: "r".repeat(32),
      NEXT_PUBLIC_TURNSTILE_SITE_KEY: "live-turnstile-site-key",
      TURNSTILE_SECRET_KEY: "t".repeat(32),
      TURNSTILE_HOSTNAMES: "zypher-solutions.com,www.zypher-solutions.com",
      RESEND_API_KEY: "re_test_production_key",
      CONTACT_TO_EMAIL: "info@zypher-solutions.com",
      CONTACT_FROM_EMAIL: "website@zypher-solutions.com",
    });

    expect(result).toEqual({ ok: true, issues: [] });
  });

  it("should report every unsafe production setting in one result", () => {
    const result = validateProductionEnvironment({
      NEXT_PUBLIC_SITE_URL: "http://localhost:3000",
      NEXT_PUBLIC_SANITY_PROJECT_ID: "",
      NEXT_PUBLIC_SANITY_DATASET: "",
      SANITY_PREVIEW_SECRET: "short",
      SANITY_REVALIDATE_SECRET: undefined,
      NEXT_PUBLIC_TURNSTILE_SITE_KEY: "1x00000000000000000000AA",
      TURNSTILE_SECRET_KEY: "1x0000000000000000000000000000000AA",
      TURNSTILE_HOSTNAMES: "localhost",
      RESEND_API_KEY: undefined,
      CONTACT_TO_EMAIL: "not-an-email",
      CONTACT_FROM_EMAIL: undefined,
    });

    expect(result.ok).toBe(false);
    expect(result.issues.join("\n")).toEqual(expect.stringContaining("NEXT_PUBLIC_SITE_URL"));
    expect(result.issues.join("\n")).toEqual(
      expect.stringContaining("NEXT_PUBLIC_SANITY_PROJECT_ID"),
    );
    expect(result.issues.join("\n")).toEqual(expect.stringContaining("SANITY_PREVIEW_SECRET"));
    expect(result.issues.join("\n")).toEqual(expect.stringContaining("SANITY_REVALIDATE_SECRET"));
    expect(result.issues.join("\n")).toEqual(
      expect.stringContaining("NEXT_PUBLIC_TURNSTILE_SITE_KEY"),
    );
    expect(result.issues.join("\n")).toEqual(expect.stringContaining("TURNSTILE_SECRET_KEY"));
    expect(result.issues.join("\n")).toEqual(expect.stringContaining("TURNSTILE_HOSTNAMES"));
    expect(result.issues.join("\n")).toEqual(expect.stringContaining("RESEND_API_KEY"));
    expect(result.issues.join("\n")).toEqual(expect.stringContaining("CONTACT_TO_EMAIL"));
    expect(result.issues.join("\n")).toEqual(expect.stringContaining("CONTACT_FROM_EMAIL"));
  });
});
