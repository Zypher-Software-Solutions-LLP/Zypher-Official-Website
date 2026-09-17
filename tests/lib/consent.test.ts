import { describe, expect, it } from "vitest";
import {
  CONSENT_VERSION,
  createDefaultConsentPreferences,
  ConsentPreferencesSchema,
} from "@/lib/consent";

describe("consent preferences", () => {
  it("should keep necessary consent enabled when creating defaults", () => {
    const preferences = createDefaultConsentPreferences();

    expect(preferences).toEqual({
      version: CONSENT_VERSION,
      necessary: true,
      analytics: false,
      marketing: false,
      updatedAt: expect.any(String),
    });
  });

  it("should reject preferences that disable necessary consent", () => {
    const result = ConsentPreferencesSchema.safeParse({
      version: CONSENT_VERSION,
      necessary: false,
      analytics: true,
      marketing: false,
      updatedAt: new Date().toISOString(),
    });

    expect(result.success).toBe(false);
  });
});
