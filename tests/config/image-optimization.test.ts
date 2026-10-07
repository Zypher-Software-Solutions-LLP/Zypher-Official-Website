import { afterEach, describe, expect, it, vi } from "vitest";
import { hasLocalMatch } from "next/dist/shared/lib/match-local-pattern";
import { hasRemoteMatch } from "next/dist/shared/lib/match-remote-pattern";

async function getImageConfig() {
  vi.stubEnv("NEXT_PUBLIC_SANITY_PROJECT_ID", "testproject");
  vi.stubEnv("NEXT_PUBLIC_SANITY_DATASET", "production");
  vi.stubEnv("NEXT_PUBLIC_R2_MEDIA_HOSTNAME", "media.example.r2.dev");
  vi.resetModules();

  const { default: nextConfig } = await import("../../next.config");
  if (!nextConfig.images) {
    throw new Error("Next image configuration is required");
  }

  return nextConfig.images;
}

afterEach(() => {
  vi.unstubAllEnvs();
  vi.resetModules();
});

describe("image optimization", () => {
  it("should reject query variants and unrelated local images when optimizing a local asset", async () => {
    const images = await getImageConfig();

    expect(hasLocalMatch(images.localPatterns, "/home/section-1/background-illustration.png")).toBe(
      true,
    );
    expect(
      hasLocalMatch(images.localPatterns, "/home/section-1/background-illustration.png?v=1"),
    ).toBe(false);
    expect(hasLocalMatch(images.localPatterns, "/og/zypher-social-preview.png")).toBe(false);
  });

  it("should allow only query-free image URLs from approved remote sources", async () => {
    const images = await getImageConfig();
    const isAllowed = (url: string): boolean =>
      hasRemoteMatch([], images.remotePatterns ?? [], new URL(url));

    expect(
      isAllowed(
        "https://media.zypher-solutions.com/home-page/section-1/Background%20PC%20Image.webp",
      ),
    ).toBe(true);
    expect(isAllowed("https://media.example.r2.dev/home-page/hero.png")).toBe(true);
    expect(isAllowed("https://cdn.sanity.io/images/testproject/production/asset-100x100.png")).toBe(
      true,
    );
    expect(
      isAllowed(
        "https://media.zypher-solutions.com/home-page/section-1/Background%20PC%20Image.webp?v=1",
      ),
    ).toBe(false);
    expect(isAllowed("https://cdn.sanity.io/images/anotherproject/production/asset.png")).toBe(
      false,
    );
    expect(isAllowed("https://flagcdn.com/us.svg")).toBe(false);
  });

  it("should retain optimized images through a monthly usage cycle", async () => {
    const images = await getImageConfig();

    expect(images.minimumCacheTTL).toBeGreaterThanOrEqual(31 * 24 * 60 * 60);
  });
});
