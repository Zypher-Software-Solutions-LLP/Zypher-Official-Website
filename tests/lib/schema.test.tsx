import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { BlogPostingJsonLd } from "@/lib/schema";
import type { BlogPostDetail } from "@/integrations/cms/sanity/types";

const article: BlogPostDetail = {
  id: "post-1",
  title: "Building resilient systems for growing teams",
  slug: "resilient-systems",
  excerpt: "A practical guide to shaping software around the way your team actually works.",
  author: { name: "Zypher Team", url: "https://www.linkedin.com/company/zypher-solutions/" },
  categories: [{ title: "Engineering", slug: "engineering" }],
  publishedAt: "2026-09-20T08:00:00.000Z",
  updatedAt: "2026-09-21T08:00:00.000Z",
  image: {
    alt: "A systems dashboard",
    url: "https://cdn.sanity.io/images/project/production/post.jpg",
    width: 1200,
    height: 800,
  },
  body: [],
};

describe("BlogPostingJsonLd", () => {
  it("should expose article image, dates, publisher, and canonical URL", () => {
    render(<BlogPostingJsonLd post={article} />);
    const articleImage = article.image;
    if (!articleImage) throw new Error("Test article image is required");
    const script = document.querySelector('script[type="application/ld+json"]');
    const data = JSON.parse(script?.textContent || "{}");

    expect(data["@type"]).toBe("BlogPosting");
    expect(data.image).toBe(articleImage.url);
    expect(data.datePublished).toBe(article.publishedAt);
    expect(data.dateModified).toBe(article.updatedAt);
    expect(data.url).toBe("http://localhost:3000/blog/resilient-systems");
    expect(data.author).toEqual({
      "@type": "Organization",
      name: article.author.name,
      url: article.author.url,
    });
    expect(data.publisher["@id"]).toBe("http://localhost:3000/#organization");
    expect(data.publisher.logo.url).toBe("http://localhost:3000/icon-512.png");
  });
});
