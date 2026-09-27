import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { BlogList } from "@/features/blog/BlogList";
import type { BlogPost } from "@/integrations/cms/sanity/types";

function createPost(id: string, title: string, category: string, publishedAt: string): BlogPost {
  return {
    id,
    title,
    slug: id,
    excerpt: "A practical note from the Zypher team.",
    author: { name: "Zypher Team", role: "Software Solutions" },
    categories: [{ title: category, slug: category.toLowerCase().replaceAll(" ", "-") }],
    publishedAt,
    updatedAt: publishedAt,
    image: {
      alt: title + " image",
      url: "https://cdn.sanity.io/images/project/production/post.jpg",
      width: 1200,
      height: 800,
    },
    body: [],
  };
}

const posts = Array.from({ length: 16 }, (_, index) =>
  createPost(
    "post-" + String(index + 1),
    "Post " + String(index + 1).padStart(2, "0"),
    index === 15 ? "Case Studies" : "Tutorial & Guides",
    "2026-01-" + String(index + 1).padStart(2, "0"),
  ),
);

describe("blog list", () => {
  it("should render server-provided cards with crawlable article links", () => {
    render(
      <BlogList
        categories={[{ title: "Tutorial & Guides", slug: "tutorial-guides" }]}
        posts={posts.slice(0, 1)}
        totalPages={1}
        currentPage={1}
        categorySlug={undefined}
        sort="newest"
      />,
    );

    const section = screen.getByTestId("blog-posts-section");
    expect(within(section).getAllByTestId("blog-post-card")).toHaveLength(1);
    expect(within(section).getByRole("link", { name: "Post 01" })).toHaveAttribute(
      "href",
      "/blog/post-1",
    );
  });

  it("should render crawlable pagination links", () => {
    render(
      <BlogList
        categories={[]}
        posts={posts.slice(0, 1)}
        totalPages={3}
        currentPage={2}
        categorySlug={undefined}
        sort="newest"
      />,
    );

    const section = screen.getByTestId("blog-posts-section");
    expect(within(section).getByRole("link", { name: "Go to page 1" })).toHaveAttribute(
      "href",
      "/blog",
    );
    expect(within(section).getByRole("link", { name: "Go to page 3" })).toHaveAttribute(
      "href",
      "/blog/page/3",
    );
  });

  it("should filter the local post grid without changing the page URL", async () => {
    const user = userEvent.setup();
    const initialUrl = window.location.href;

    render(
      <BlogList
        categories={[
          { title: "Case Studies", slug: "case-studies" },
          { title: "Tutorial & Guides", slug: "tutorial-guides" },
        ]}
        currentPage={1}
        interactive
        posts={[
          createPost("case-study", "Case study", "Case Studies", "2026-01-01"),
          createPost("tutorial", "Tutorial", "Tutorial & Guides", "2026-01-02"),
        ]}
        sort="newest"
        totalPages={1}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Case Studies" }));

    const section = screen.getByTestId("blog-posts-section");
    expect(within(section).getAllByTestId("blog-post-card")).toHaveLength(1);
    expect(within(section).getByRole("link", { name: "Case study" })).toBeInTheDocument();
    expect(window.location.href).toBe(initialUrl);
  });
});
