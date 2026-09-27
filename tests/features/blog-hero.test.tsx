import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { BlogHeroSection } from "@/features/blog/BlogHeroSection";
import type { BlogPostSummary } from "@/integrations/cms/sanity/types";

const post: BlogPostSummary = {
  id: "post-1",
  title: "Building resilient systems for growing teams",
  slug: "resilient-systems",
  excerpt: "A practical guide to shaping software around the way your team actually works.",
  categories: [{ title: "Engineering", slug: "engineering" }],
  publishedAt: "2026-09-20T08:00:00.000Z",
  updatedAt: "2026-09-21T08:00:00.000Z",
  author: { name: "Zypher Team", role: "Software Solutions" },
  image: {
    alt: "A team reviewing a systems dashboard",
    url: "https://cdn.sanity.io/images/project/production/post.jpg",
    width: 1200,
    height: 800,
  },
};

describe("blog hero", () => {
  it("should render the newest published post with a real article link", () => {
    render(<BlogHeroSection post={post} />);

    expect(screen.getByTestId("blog-hero")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        level: 1,
        name: "Notes from the team actually building this.",
      }),
    ).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: post.title })).not.toBeInTheDocument();
    expect(screen.getAllByText(post.excerpt)).toHaveLength(1);
    expect(screen.getByText("FEATURED POST")).toBeInTheDocument();
    expect(screen.getByRole("img", { name: post.image?.alt })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /read the article/i })).toHaveAttribute(
      "href",
      "/blog/resilient-systems",
    );
  });
});
