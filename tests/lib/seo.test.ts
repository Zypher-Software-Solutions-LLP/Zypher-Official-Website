import { describe, expect, it } from "vitest";
import { buildPageMetadata } from "@/lib/seo";

describe("buildPageMetadata", () => {
  it("should create canonical metadata when a page definition is provided", () => {
    const metadata = buildPageMetadata({
      title: "Services",
      description: "Explore Zypher software services.",
      path: "/services",
    });

    expect(metadata.title).toBe("Services | Zypher Software Solutions");
    expect(metadata.description).toBe("Explore Zypher software services.");
    expect(metadata.alternates?.canonical).toBe("http://localhost:3000/services");
    expect(metadata.openGraph?.images).toEqual([
      { url: "http://localhost:3000/og/zypher-social-preview.png" },
    ]);
  });

  it("should mark a page noindex when its definition requests it", () => {
    const metadata = buildPageMetadata({
      title: "Preview",
      description: "Preview page.",
      path: "/preview",
      noIndex: true,
    });

    expect(metadata.robots).toEqual({ index: false, follow: false });
  });
});
