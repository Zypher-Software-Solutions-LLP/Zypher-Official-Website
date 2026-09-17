import { z } from "zod";

export const CONSENT_VERSION = "2026-09-16.v1";
export const CONSENT_COOKIE_NAME = "zypher_consent_v1";

export const ConsentPreferencesSchema = z.object({
  version: z.string().min(1),
  necessary: z.literal(true),
  analytics: z.boolean(),
  marketing: z.boolean(),
  updatedAt: z.string().datetime(),
});

export type ConsentPreferences = z.infer<typeof ConsentPreferencesSchema>;

export function createDefaultConsentPreferences(): ConsentPreferences {
  return {
    version: CONSENT_VERSION,
    necessary: true,
    analytics: false,
    marketing: false,
    updatedAt: new Date().toISOString(),
  };
}
