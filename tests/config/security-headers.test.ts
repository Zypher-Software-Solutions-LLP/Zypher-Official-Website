import { describe, expect, it } from "vitest";
import { createSecurityHeaders } from "@/lib/security/content-security-policy";

function toHeaderMap(headers: Array<{ key: string; value: string }>): Record<string, string> {
  return Object.fromEntries(headers.map(({ key, value }) => [key, value]));
}

describe("security headers", () => {
  it("should build an enforced static-compatible CSP for public pages", () => {
    const headers = toHeaderMap(
      createSecurityHeaders({ environment: "production", r2Hostname: undefined }),
    );
    const policy = headers["Content-Security-Policy"];

    expect(policy).toBeDefined();
    expect(headers["Content-Security-Policy-Report-Only"]).toBeUndefined();
    expect(policy).toContain("default-src 'self'");
    expect(policy).toContain("script-src 'self' 'unsafe-inline'");
    expect(policy).not.toContain("'unsafe-eval'");
    expect(policy).toContain("object-src 'none'");
    expect(policy).toContain("base-uri 'self'");
    expect(policy).toContain("form-action 'self'");
    expect(policy).toContain("frame-ancestors 'none'");
    expect(policy).toContain("upgrade-insecure-requests");
    expect(policy).toContain("https://app.cal.com");
    expect(policy).toContain("https://challenges.cloudflare.com");
    expect(policy).not.toContain("*.r2.dev");
  });

  it("should allow only the configured R2 hostname for images", () => {
    const headers = toHeaderMap(
      createSecurityHeaders({
        environment: "production",
        r2Hostname: "media.example.r2.cloudflarestorage.com",
      }),
    );

    expect(headers["Content-Security-Policy"]).toContain(
      "https://media.example.r2.cloudflarestorage.com",
    );
    expect(headers["Content-Security-Policy"]).not.toContain("*.r2.dev");
  });

  it("should add noindex protection to Studio and API routes", () => {
    const studioHeaders = toHeaderMap(
      createSecurityHeaders({ environment: "production", route: "studio" }),
    );
    const apiHeaders = toHeaderMap(
      createSecurityHeaders({ environment: "production", route: "api" }),
    );

    expect(studioHeaders["X-Robots-Tag"]).toBe("noindex, nofollow");
    expect(apiHeaders["X-Robots-Tag"]).toBe("noindex, nofollow");
  });

  it("should allow Next development evaluation only outside production", () => {
    const headers = toHeaderMap(
      createSecurityHeaders({ environment: "development", route: "public" }),
    );

    expect(headers["Content-Security-Policy"]).toContain("'unsafe-eval'");
  });
});
