import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import AiLlmAutomationPage from "@/app/(marketing)/services/ai-llm-automation/page";

const deliverables = [
  {
    description: "A working AI system scoped for production, not a proof of concept",
    image: "https://media.zypher-solutions.com/01-services-page/section-5/Pt%20-%201.webp",
  },
  {
    description:
      "Full ownership at handoff: code, prompts, configs, everything. No lock-in, no ongoing dependency on us.",
    image: "https://media.zypher-solutions.com/01-services-page/section-5/Pt%20-%202.webp",
  },
  {
    description:
      "Integration with your existing tools and data sources, tested against real inputs",
    image: "https://media.zypher-solutions.com/01-services-page/section-5/Pt%20-%203.webp",
  },
  {
    description: "Documented prompts, configs, and system logic your team can read and modify",
    image: "https://media.zypher-solutions.com/01-services-page/section-5/Pt%20-%204.webp",
  },
  {
    description:
      "Defined fail-safes and edge case handling, the system knows what to do when the unexpected happens",
    image: "https://media.zypher-solutions.com/01-services-page/section-5/Pt%20-%205.webp",
  },
  {
    description:
      "Handoff documentation written for the people maintaining it, not the people who built it",
    image: "https://media.zypher-solutions.com/01-services-page/section-5/Pt%20-%206.webp",
  },
] as const;

describe("AI and LLM automation Section 5", () => {
  it("should render the production-ready heading, builds link, and all six mapped deliverables", () => {
    render(<AiLlmAutomationPage />);

    const section = screen.getByTestId("ai-llm-section-five");
    expect(
      within(section).getByRole("heading", {
        level: 2,
        name: "Production Ready. Not demo-ready",
      }),
    ).toBeInTheDocument();
    expect(
      within(section).getByText(
        "Every engagement ends with something your team can run, maintain, and build on, without depending on us for every update.",
      ),
    ).toBeInTheDocument();
    expect(within(section).getByRole("link", { name: "See Our Builds" })).toHaveAttribute(
      "href",
      "/work",
    );

    const cards = within(section).getAllByRole("listitem");
    expect(cards).toHaveLength(deliverables.length);

    deliverables.forEach((deliverable, index) => {
      const card = cards[index];
      expect(within(card).getByText(deliverable.description)).toBeInTheDocument();

      const image = within(card).getByRole("img");
      const imageSource = image.getAttribute("src");
      expect(imageSource).not.toBeNull();
      expect(new URL(imageSource ?? "", window.location.origin).searchParams.get("url")).toBe(
        deliverable.image,
      );
    });
  });
});
