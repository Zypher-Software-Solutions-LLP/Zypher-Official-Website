import { beforeEach, describe, expect, it, vi } from "vitest";

const { getStaticPageSeoMock } = vi.hoisted(() => ({
  getStaticPageSeoMock: vi.fn(),
}));

vi.mock("@/integrations/cms/sanity/queries", () => ({
  getStaticPageSeo: getStaticPageSeoMock,
}));

import { getStaticPageMetadata } from "@/lib/seo";

describe("static page SEO metadata", () => {
  beforeEach(() => {
    getStaticPageSeoMock.mockReset();
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "http://localhost:3000");
  });

  it("should render Sanity metadata in the public page head", async () => {
    getStaticPageSeoMock.mockResolvedValue({
      status: "ok",
      data: {
        id: "page-seo-about",
        path: "/about",
        title: "About Zypher Software Solutions",
        description:
          "Learn how Zypher approaches software, design, automation, and long-term partnerships.",
        noIndex: false,
        noFollow: false,
      },
    });

    const metadata = await getStaticPageMetadata("/about");

    expect(metadata.title).toBe("About Zypher Software Solutions");
    expect(metadata.description).toContain("Learn how Zypher approaches");
    expect(metadata.alternates?.canonical).toBe("http://localhost:3000/about");
    expect(getStaticPageSeoMock).toHaveBeenCalledWith("/about", { preview: undefined });
  });

  it("should keep the page crawlable while Sanity metadata is unavailable", async () => {
    getStaticPageSeoMock.mockResolvedValue({ status: "unconfigured", data: null });

    const metadata = await getStaticPageMetadata("/contact");

    expect(metadata.title).toBe("Zypher Software Solutions");
    expect(metadata.robots).toEqual({ index: true, follow: true });
  });
});
