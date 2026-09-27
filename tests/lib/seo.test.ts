import { describe, expect, it } from "vitest";
import { buildBlogPostMetadata, buildPageMetadata } from "@/lib/seo";
import type { BlogPostDetail } from "@/integrations/cms/sanity/types";

const article: BlogPostDetail = {
  id: "post-1",
  title: "Building resilient systems for growing teams",
  slug: "resilient-systems",
  excerpt: "A practical guide to shaping software around the way your team actually works.",
  author: { name: "Zypher Team", role: "Software Solutions" },
  categories: [{ title: "Engineering", slug: "engineering" }],
  publishedAt: "2026-09-20T08:00:00.000Z",
  updatedAt: "2026-09-21T08:00:00.000Z",
  image: {
    alt: "A team reviewing a systems dashboard",
    url: "https://cdn.sanity.io/images/project/production/post.jpg",
    width: 1200,
    height: 800,
  },
  body: [],
};

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
      {
        url: "http://localhost:3000/og/zypher-social-preview.png",
        alt: "Zypher Software Solutions",
        width: 1200,
        height: 630,
      },
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

  it("should support noindex pages that still allow crawlers to follow links", () => {
    const metadata = buildPageMetadata({
      title: "Blog — Page 2",
      description: "A secondary blog page.",
      path: "/blog/page/2",
      noIndex: true,
      noFollow: false,
    });

    expect(metadata.robots).toEqual({ index: false, follow: true });
  });

  it("should support indexed pages that prevent crawlers from following links", () => {
    const metadata = buildPageMetadata({
      title: "Landing page",
      description: "A landing page description.",
      path: "/landing-page",
      noFollow: true,
    });

    expect(metadata.robots).toEqual({ index: true, follow: false });
  });

  it("should produce a descriptive homepage title", () => {
    const metadata = buildPageMetadata({
      title: "Your Vision, Our Code",
      description: "Zypher Software Solutions homepage.",
      path: "/",
    });

    expect(metadata.title).toBe("Your Vision, Our Code | Zypher Software Solutions");
  });

  it("should create article metadata from the published post", () => {
    const metadata = buildBlogPostMetadata(article);
    const articleImage = article.image;
    if (!articleImage) throw new Error("Test article image is required");

    expect(metadata.alternates?.canonical).toBe("http://localhost:3000/blog/resilient-systems");
    const openGraph = metadata.openGraph as {
      type?: string;
      publishedTime?: string;
      modifiedTime?: string;
      images?: unknown;
    };
    expect(openGraph.type).toBe("article");
    expect(openGraph.publishedTime).toBe(article.publishedAt);
    expect(openGraph.modifiedTime).toBe(article.updatedAt);
    expect(openGraph.images).toEqual([
      {
        url: articleImage.url,
        alt: articleImage.alt,
        width: articleImage.width,
        height: articleImage.height,
      },
    ]);
  });

  it("should treat a Sanity SEO title override as the complete search title", () => {
    const metadata = buildBlogPostMetadata({
      ...article,
      seo: { title: "A complete SEO title for this article" },
    });

    expect(metadata.title).toBe("A complete SEO title for this article");
  });
});
