import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import manifest from "@/app/manifest.json";

function readPngDimensions(filePath: string): { width: number; height: number } {
  const contents = readFileSync(filePath);
  return {
    width: contents.readUInt32BE(16),
    height: contents.readUInt32BE(20),
  };
}

describe("web app manifest", () => {
  it("should reference real 192px and 512px PNG icons", () => {
    expect(manifest.name).toBe("Zypher Software Solutions");
    expect(manifest.short_name).toBe("Zypher");
    expect(manifest.start_url).toBe("/");
    expect(manifest.scope).toBe("/");
    expect(manifest.display).toBe("standalone");
    expect(manifest.theme_color).toBe("#0f4743");
    expect(manifest.background_color).toBe("#f4f8f6");

    for (const icon of manifest.icons) {
      const filePath = resolve("public", icon.src.replace(/^\//, ""));
      expect(existsSync(filePath)).toBe(true);
      expect(icon.type).toBe("image/png");
      const dimensions = readPngDimensions(filePath);
      expect(`${dimensions.width}x${dimensions.height}`).toBe(icon.sizes);
    }
  });
});
