import { describe, expect, it } from "vitest";
import { secretsMatch } from "@/lib/security/secret-comparison";

describe("secretsMatch", () => {
  it("should match identical configured and supplied secrets", () => {
    expect(secretsMatch("preview-secret", "preview-secret")).toBe(true);
  });

  it("should reject different secrets", () => {
    expect(secretsMatch("wrong-secret", "preview-secret")).toBe(false);
  });

  it("should reject missing secrets", () => {
    expect(secretsMatch(null, undefined)).toBe(false);
    expect(secretsMatch("preview-secret", undefined)).toBe(false);
    expect(secretsMatch(null, "preview-secret")).toBe(false);
  });
});
