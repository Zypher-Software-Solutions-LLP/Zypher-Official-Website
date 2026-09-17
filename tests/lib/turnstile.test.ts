import { describe, expect, it, vi } from "vitest";
import { verifyTurnstile } from "@/integrations/security/turnstile";

describe("verifyTurnstile", () => {
  it("should allow the local development token when Turnstile is not configured", async () => {
    vi.stubEnv("NODE_ENV", "development");
    vi.stubEnv("TURNSTILE_SECRET_KEY", "");

    await expect(verifyTurnstile("local-development-token")).resolves.toBe(true);
  });

  it("should reject missing tokens in production", async () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("TURNSTILE_SECRET_KEY", "production-secret");

    await expect(verifyTurnstile("")).resolves.toBe(false);
  });
});
