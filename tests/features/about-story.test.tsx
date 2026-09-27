import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import AboutPage from "@/app/(marketing)/about/page";

const STORY_ILLUSTRATION_SRC =
  "https://media.zypher-solutions.com/about-page/section-2/Section%202%20Illustration.png";
const STORY_COPY_ONE =
  "Three founders met in their first year of college and quickly fell into the same pattern: noticing problems " +
  "in the people and places around them, then building something to fix it, not because anyone asked, but because " +
  "they already knew how to.";
const STORY_COPY_TWO =
  "That pattern became a question worth answering seriously: why not do this properly, at scale? Zypher wasn't built " +
  "from a business plan. It was built around a standard the founders already held, software engineered to last, " +
  "structured for the long term, free of shortcuts.";
const STORY_COPY_THREE =
  "That standard hasn't changed as the company has grown. Alongside client work, the team is building independent " +
  "products of its own, solutions shaped by problems the founders ran into and couldn't find a simple enough answer " +
  "for. More will be shared as they near release.";

describe("About story section", () => {
  it("should render the story copy, numbered milestones, illustration, and CTA", () => {
    render(<AboutPage />);

    expect(screen.getByTestId("about-story")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Our Story" })).toBeInTheDocument();
    expect(screen.getAllByTestId("about-story-number")).toHaveLength(3);
    expect(screen.getByText("01")).toBeInTheDocument();
    expect(screen.getByText("02")).toBeInTheDocument();
    expect(screen.getByText("03")).toBeInTheDocument();
    expect(screen.getByText(STORY_COPY_ONE)).toBeInTheDocument();
    expect(screen.getByText(STORY_COPY_TWO)).toBeInTheDocument();
    expect(screen.getByText(STORY_COPY_THREE)).toBeInTheDocument();

    expect(screen.getByTestId("about-story-illustration")).toHaveAttribute(
      "data-image-src",
      STORY_ILLUSTRATION_SRC,
    );
    expect(screen.getByTestId("cta-section")).toBeInTheDocument();
    expect(screen.getByTestId("about-values")).toBeInTheDocument();
  });
});
