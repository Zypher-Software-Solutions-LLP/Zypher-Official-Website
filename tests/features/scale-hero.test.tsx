import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ScaleHeroSection } from "@/features/scale/ScaleHeroSection";

const scaleDescription =
  "From a founder validating their first product to an operations team replacing a system that stopped scaling, if the problem is real, we’re the right conversation.";

describe("scale hero", () => {
  it("should render the approved copy, artwork, backdrop circle, and CTA", () => {
    render(<ScaleHeroSection />);

    const hero = screen.getByTestId("scale-hero");

    expect(
      screen.getByRole("heading", {
        level: 1,
        name: "Whatever the size. Whatever the stage. Built to fit.",
      }),
    ).toBeInTheDocument();
    expect(hero.querySelector("p")?.textContent).toBe("WHO WE WORK FOR");
    expect(screen.getByText("WORK FOR")).toBeInTheDocument();
    expect(screen.getByText(scaleDescription)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Book A Discovery Call" })).toHaveAttribute(
      "href",
      "/contact",
    );
    expect(screen.getByTestId("scale-hero-background")).toHaveAttribute(
      "data-image-src",
      "/home/section-1/background-illustration.png",
    );
    expect(screen.getByTestId("scale-hero-illustration")).toHaveAttribute(
      "data-image-src",
      expect.stringContaining("scale-page/section-1/Hero%20Section%20Illustration.png"),
    );
    expect(hero.querySelectorAll('[data-testid="scale-hero-ellipse"]')).toHaveLength(1);
  });
});
