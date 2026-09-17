import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { AIAutomationSection } from "@/features/services/AIAutomationSection";

describe("AI and LLM automation section", () => {
  it("should render the approved capabilities, deliverables, laptop, and CTA", () => {
    render(<AIAutomationSection />);

    const section = screen.getByTestId("ai-automation-section");

    expect(
      within(section).getByRole("heading", {
        level: 2,
        name: "AI & LLM Automation",
      }),
    ).toBeInTheDocument();
    expect(
      within(section).getByText(
        "The service we lead with — because it's the one most businesses are asking about, and the one most agencies still bolt on as an afterthought.",
      ),
    ).toBeInTheDocument();
    expect(screen.getAllByTestId("ai-capability-node")).toHaveLength(5);
    expect(screen.getAllByTestId("ai-node-point")).toHaveLength(5);
    expect(screen.getAllByTestId("business-deliverable")).toHaveLength(4);
    expect(screen.getByTestId("ai-automation-laptop")).toHaveAttribute(
      "data-image-src",
      expect.stringContaining("services-page/section-2/Laptop.png"),
    );
    expect(
      within(section).getByRole("link", { name: "See How We Build With AI →" }),
    ).toHaveAttribute("href", "/services/ai-llm-automation");
  });
});
