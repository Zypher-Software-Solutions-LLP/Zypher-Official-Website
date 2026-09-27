import { beforeEach, describe, expect, it, vi } from "vitest";

const {
  draftModeMock,
  getAllPublishedBlogPostsMock,
  getBlogCategoriesMock,
  getLatestPublishedPostMock,
  getPaginatedBlogPostsMock,
  notFoundMock,
} = vi.hoisted(() => ({
  draftModeMock: vi.fn(),
  getAllPublishedBlogPostsMock: vi.fn(),
  getBlogCategoriesMock: vi.fn(),
  getLatestPublishedPostMock: vi.fn(),
  getPaginatedBlogPostsMock: vi.fn(),
  notFoundMock: vi.fn(() => {
    throw new Error("NEXT_NOT_FOUND");
  }),
}));

vi.mock("next/headers", () => ({ draftMode: draftModeMock }));
vi.mock("next/navigation", () => ({ notFound: notFoundMock }));
vi.mock("@/integrations/cms/sanity/queries", () => ({
  getAllPublishedBlogPosts: getAllPublishedBlogPostsMock,
  getBlogCategories: getBlogCategoriesMock,
  getLatestPublishedPost: getLatestPublishedPostMock,
  getPaginatedBlogPosts: getPaginatedBlogPostsMock,
}));
vi.mock("@/features/blog/BlogHeroSection", () => ({ BlogHeroSection: () => null }));
vi.mock("@/features/blog/BlogList", () => ({ BlogList: () => null }));

import { BlogListingPage } from "@/features/blog/BlogListingPage";

describe("BlogListingPage", () => {
  beforeEach(() => {
    draftModeMock.mockResolvedValue({ isEnabled: false });
    getLatestPublishedPostMock.mockResolvedValue({ status: "ok", data: null });
    getBlogCategoriesMock.mockResolvedValue({
      status: "ok",
      data: [{ title: "Business Notes", slug: "business-notes" }],
    });
    getPaginatedBlogPostsMock.mockResolvedValue({
      status: "ok",
      data: { items: [], page: 1, pageSize: 8, totalItems: 0, totalPages: 0 },
    });
  });

  it("should return not found for an existing category with no published posts", async () => {
    await expect(
      BlogListingPage({ categorySlug: "business-notes", page: 1, sort: "newest" }),
    ).rejects.toThrow("NEXT_NOT_FOUND");
  });
});
