import { describe, expect, it } from "vitest";
import sanityConfig from "../../sanity.config";

describe("Sanity Studio configuration", () => {
  it("should mount the embedded Studio at /studio", () => {
    expect(sanityConfig.basePath).toBe("/studio");
  });
});
