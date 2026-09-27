import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { AiLlmAutomationHeroSection } from "@/features/services/AiLlmAutomationHeroSection";

const description =
  "From automating the manual work your team shouldn’t be doing to building intelligent systems that connect your entire operation, We engineer AI that fits how your business actually runs.";

describe("AI and LLM automation hero", () => {
  it("should render the approved copy, artwork, and calls to action", () => {
    render(<AiLlmAutomationHeroSection />);

    expect(
      screen.getByRole("heading", {
        level: 1,
        name: "AI that works inside your business. Not Alongside it.",
      }),
    ).toBeInTheDocument();
    expect(screen.getByTestId("ai-llm-hero-eyebrow")).toHaveTextContent("AI & LLM AUTOMATION");
    expect(screen.getByText(description)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Book a Discovery Call" })).toHaveAttribute(
      "href",
      "/contact",
    );
    expect(screen.getByRole("link", { name: "See How We Build With AI →" })).toHaveAttribute(
      "href",
      "/services#ai-automation",
    );
    expect(screen.getByTestId("ai-llm-hero-background")).toHaveAttribute(
      "data-image-src",
      "/home/section-1/background-illustration.png",
    );
    expect(screen.getByTestId("ai-llm-hero-illustration")).toHaveAttribute(
      "data-image-src",
      "https://media.zypher-solutions.com/01-services-page/section-1/Hero%20Section.png",
    );
  });
});
