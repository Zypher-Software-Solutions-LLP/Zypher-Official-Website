import { beforeEach, describe, expect, it, vi } from "vitest";

const { fetchMock, getClientMock } = vi.hoisted(() => ({
  fetchMock: vi.fn(),
  getClientMock: vi.fn(),
}));

vi.mock("@/integrations/cms/sanity/client", () => ({
  getSanityClient: getClientMock,
}));

import {
  getAllPublishedBlogPosts,
  getBlogCategories,
  getBlogPost,
  getLatestPublishedPost,
  getPaginatedBlogPosts,
  getStaticPageSeo,
} from "@/integrations/cms/sanity/queries";

describe("Sanity blog queries", () => {
  beforeEach(() => {
    fetchMock.mockReset();
    getClientMock.mockReturnValue({ fetch: fetchMock });
  });

  it("should query the newest published post with cache tags", async () => {
    fetchMock.mockResolvedValue(null);

    const result = await getLatestPublishedPost();

    expect(result).toEqual({ status: "ok", data: null });
    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining("publishedAt <= now()"),
      {},
      expect.objectContaining({
        cache: "force-cache",
        next: { tags: ["sanity:blog", "sanity:blog:list"] },
      }),
    );
    expect(fetchMock.mock.calls[0][0]).toContain("order(publishedAt desc, _createdAt desc)");
  });

  it("should bypass persistent cache during local development", async () => {
    fetchMock.mockResolvedValue(null);
    vi.stubEnv("NODE_ENV", "development");

    try {
      await getLatestPublishedPost();
    } finally {
      vi.unstubAllEnvs();
    }

    expect(fetchMock.mock.calls[0][2]).toEqual({ cache: "no-store" });
  });

  it("should filter the hero post before calculating paginated results", async () => {
    fetchMock.mockResolvedValue({ totalItems: 9, items: [] });

    const result = await getPaginatedBlogPosts({
      page: 2,
      categorySlug: "engineering",
      heroPostId: "hero-1",
    });

    expect(result).toEqual({
      status: "ok",
      data: { items: [], page: 2, pageSize: 8, totalItems: 9, totalPages: 2 },
    });
    expect(fetchMock.mock.calls[0][0]).toContain("_id != $heroPostId");
    expect(fetchMock.mock.calls[0][0]).toContain("$categorySlug in categories[]->slug.current");
    expect(fetchMock.mock.calls[0][1]).toEqual({
      categorySlug: "engineering",
      heroPostId: "hero-1",
    });
  });

  it("should include the featured post in the main blog listing", async () => {
    fetchMock.mockResolvedValue([]);

    const result = await getAllPublishedBlogPosts();

    expect(result).toEqual({ status: "ok", data: [] });
    expect(fetchMock.mock.calls[0][0]).not.toContain("_id != $heroPostId");
    expect(fetchMock.mock.calls[0][1]).toEqual({});
  });

  it("should return an explicit error state when the Sanity request fails", async () => {
    fetchMock.mockRejectedValue(new Error("Content Lake unavailable"));

    const result = await getBlogCategories();

    expect(result.status).toBe("error");
    expect(result.data).toBeNull();
  });

  it("should use draft perspective without public cache tags in preview", async () => {
    fetchMock.mockResolvedValue(null);

    await getBlogPost("draft-post", { preview: true });

    expect(fetchMock.mock.calls[0][2]).toEqual({ cache: "no-store" });
  });

  it("should query static page SEO by canonical path with its dedicated cache tag", async () => {
    fetchMock.mockResolvedValue({
      id: "page-seo-home",
      path: "/",
      title: "Your Vision, Our Code | Zypher",
      description: "A description for the Zypher homepage that is long enough for validation.",
    });

    const result = await getStaticPageSeo("/");

    expect(result.status).toBe("ok");
    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining('_type == "pageSeo" && pagePath == $path'),
      { path: "/" },
      expect.objectContaining({
        cache: "force-cache",
        next: { tags: ["sanity:page-seo"] },
      }),
    );
  });
});
