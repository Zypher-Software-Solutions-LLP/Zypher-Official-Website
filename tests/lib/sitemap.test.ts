import { describe, expect, it, vi } from "vitest";

const { getBlogSitemapEntriesMock } = vi.hoisted(() => ({
  getBlogSitemapEntriesMock: vi.fn(),
}));

vi.mock("@/integrations/cms/sanity/queries", () => ({
  getBlogSitemapEntries: getBlogSitemapEntriesMock,
}));

import sitemap, { revalidate } from "@/app/sitemap";

describe("sitemap", () => {
  it("should refresh on an hourly cache window while webhooks provide immediate invalidation", () => {
    expect(revalidate).toBe(3600);
  });

  it("should include published article modification dates and images", async () => {
    getBlogSitemapEntriesMock.mockResolvedValue({
      status: "ok",
      data: [
        {
          slug: "resilient-systems",
          publishedAt: "2026-09-20T08:00:00.000Z",
          updatedAt: "2026-09-21T08:00:00.000Z",
          image: {
            alt: "A systems dashboard",
            url: "https://cdn.sanity.io/images/project/production/post.jpg",
          },
        },
      ],
    });

    const entries = await sitemap();
    const articleEntry = entries.find((entry) => entry.url.endsWith("/blog/resilient-systems"));

    expect(articleEntry).toMatchObject({
      lastModified: "2026-09-21T08:00:00.000Z",
      images: ["https://cdn.sanity.io/images/project/production/post.jpg"],
    });
  });
});
