import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ServicesHeroSection } from "@/features/services/ServicesHeroSection";

const servicesDescription =
  "From your first idea to the system running in production, every capability below works together under one team, not ten different vendors stitched into your project.";

describe("services hero", () => {
  it("should render the approved copy, artwork, and calls to action", () => {
    render(<ServicesHeroSection />);

    const hero = screen.getByTestId("services-hero");

    expect(
      screen.getByRole("heading", {
        level: 1,
        name: "End to end software, engineered with AI at the core",
      }),
    ).toBeInTheDocument();
    expect(within(hero).getByTestId("services-eyebrow-what")).toHaveTextContent("WHAT");
    expect(within(hero).getByTestId("services-eyebrow-we-do")).toHaveTextContent("WE DO");
    expect(screen.getByText(servicesDescription)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "See Our Services →" })).toHaveAttribute(
      "href",
      "#ai-automation",
    );
    expect(screen.getByRole("link", { name: "See How We Build With AI →" })).toHaveAttribute(
      "href",
      "/services/ai-llm-automation",
    );
    expect(screen.getByTestId("services-hero-background")).toHaveAttribute(
      "data-image-src",
      "https://media.zypher-solutions.com/home-page/section-1/Background%20-%20Hero%20section.webp",
    );
    expect(screen.getByTestId("services-hero-illustration")).toHaveAttribute(
      "data-image-src",
      expect.stringContaining("services-page/hero-section/Hero%20Section%20Illustration.webp"),
    );
  });
});
