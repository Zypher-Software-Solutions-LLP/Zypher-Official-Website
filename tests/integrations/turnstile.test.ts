import { afterEach, describe, expect, it, vi } from "vitest";
import { verifyTurnstile } from "@/integrations/security/turnstile";

describe("Turnstile verification", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });

  it("should accept a token only when Cloudflare confirms the contact action and hostname", async () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("TURNSTILE_SECRET_KEY", "turnstile-secret");
    vi.stubEnv("TURNSTILE_HOSTNAMES", "localhost,zypher-solutions.com");
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(
        JSON.stringify({
          success: true,
          action: "contact",
          hostname: "zypher-solutions.com",
        }),
        { status: 200 },
      ),
    );
    vi.stubGlobal("fetch", fetchMock);

    await expect(verifyTurnstile("turnstile-token")).resolves.toBe(true);

    expect(fetchMock).toHaveBeenCalledWith(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      expect.objectContaining({
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      }),
    );
  });

  it("should reject a valid Cloudflare response with the wrong action or hostname", async () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("TURNSTILE_SECRET_KEY", "turnstile-secret");
    vi.stubEnv("TURNSTILE_HOSTNAMES", "localhost,zypher-solutions.com");
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        new Response(
          JSON.stringify({
            success: true,
            action: "other-action",
            hostname: "untrusted.example.com",
          }),
          { status: 200 },
        ),
      ),
    );

    await expect(verifyTurnstile("turnstile-token")).resolves.toBe(false);
  });
});
