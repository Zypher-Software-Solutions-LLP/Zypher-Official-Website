import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { BlogSortOptions } from "@/features/blog/BlogSortOptions";

describe("BlogSortOptions", () => {
  it("should expose crawlable links for each sort option", () => {
    render(<BlogSortOptions basePath="/blog" value="newest" />);

    expect(screen.getByRole("link", { name: "Newest" })).toHaveAttribute("href", "/blog");
    expect(screen.getByRole("link", { name: "Oldest" })).toHaveAttribute(
      "href",
      "/blog?sort=oldest",
    );
  });

  it("should mark the current sort option for assistive technology", () => {
    render(<BlogSortOptions basePath="/blog/category/engineering" value="oldest" />);

    expect(screen.getByRole("link", { name: "Oldest" })).toHaveAttribute("aria-current", "page");
  });

  it("should use local buttons when the listing is interactive", async () => {
    const onValueChange = vi.fn();

    render(
      <BlogSortOptions basePath="/blog" interactive onValueChange={onValueChange} value="newest" />,
    );

    expect(screen.getByRole("button", { name: "Newest" })).not.toHaveAttribute("href");
    await screen.getByRole("button", { name: "Oldest" }).click();
    expect(onValueChange).toHaveBeenCalledWith("oldest");
  });
});
