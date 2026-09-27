import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ArticleTableOfContents } from "@/features/blog/ArticleTableOfContents";
import type { BlogArticleSection } from "@/features/blog/article-content";

const pageScrollController = vi.hoisted(() => ({
  scrollTo: vi.fn(),
  scrollToTop: vi.fn(),
  subscribeToUserScrollIntent: vi.fn(() => vi.fn()),
}));

vi.mock("@/components/motion/MotionProvider", () => ({
  usePageScrollController: () => pageScrollController,
}));

const sections: BlogArticleSection[] = [
  { id: "introduction", level: 2, text: "Introduction" },
  { id: "implementation", level: 2, text: "Implementation" },
];

describe("blog table of contents", () => {
  afterEach(() => {
    cleanup();
    document.body.replaceChildren();
    vi.clearAllMocks();
  });

  it("should highlight the section currently at the reading position", async () => {
    vi.spyOn(window, "innerHeight", "get").mockReturnValue(100);
    const firstHeading = document.createElement("h2");
    firstHeading.id = "introduction";
    const secondHeading = document.createElement("h2");
    secondHeading.id = "implementation";
    document.body.append(firstHeading, secondHeading);

    vi.spyOn(firstHeading, "getBoundingClientRect").mockReturnValue({
      bottom: 100,
      height: 200,
      top: -100,
    } as DOMRect);
    vi.spyOn(secondHeading, "getBoundingClientRect").mockReturnValue({
      bottom: 160,
      height: 40,
      top: 120,
    } as DOMRect);

    render(<ArticleTableOfContents sections={sections} />);
    await waitFor(() => {
      expect(screen.getByRole("link", { name: "Introduction" })).toHaveAttribute(
        "aria-current",
        "location",
      );
    });

    vi.spyOn(firstHeading, "getBoundingClientRect").mockReturnValue({
      bottom: -200,
      height: 200,
      top: -400,
    } as DOMRect);
    vi.spyOn(secondHeading, "getBoundingClientRect").mockReturnValue({
      bottom: 60,
      height: 40,
      top: 20,
    } as DOMRect);
    fireEvent.scroll(window);

    await waitFor(() => {
      expect(screen.getByRole("link", { name: "Implementation" })).toHaveAttribute(
        "aria-current",
        "location",
      );
    });
  });

  it("should smoothly scroll to a selected section", async () => {
    const user = userEvent.setup();
    const heading = document.createElement("h2");
    heading.id = "introduction";
    document.body.append(heading);

    render(<ArticleTableOfContents sections={[sections[0]]} />);
    await user.click(screen.getByRole("link", { name: "Introduction" }));

    expect(pageScrollController.scrollTo).toHaveBeenCalledWith(
      heading,
      expect.objectContaining({
        behavior: "smooth",
        offset: -24,
      }),
    );
  });
});
