import { describe, expect, it } from "vitest";
import robots from "@/app/robots";

describe("robots metadata", () => {
  it("should exclude private route prefixes including their bare paths", () => {
    const rules = robots().rules;
    const wildcardRule = Array.isArray(rules) ? rules[0] : rules;
    const disallowed = Array.isArray(wildcardRule.disallow)
      ? wildcardRule.disallow
      : [wildcardRule.disallow];

    expect(disallowed).toEqual(expect.arrayContaining(["/api/", "/studio", "/preview"]));
  });
});
