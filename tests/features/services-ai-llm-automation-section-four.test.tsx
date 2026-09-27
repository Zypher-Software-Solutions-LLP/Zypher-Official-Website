import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import AiLlmAutomationPage from "@/app/(marketing)/services/ai-llm-automation/page";

const stages = [
  {
    label: "Discover",
    heading: "Discovery",
    description:
      'We start by understanding the process, not the technology. What\'s actually happening, where the friction is, what data exists, and what "working" looks like for your team. No proposal before this is done.',
    asset: "https://media.zypher-solutions.com/01-services-page/section-4/Discovery.png",
  },
  {
    label: "Architecture & Scope",
    heading: "Architecture & Scope",
    description:
      "We map the system before we build it: which model, which orchestration approach, which integrations, and which fail-safes. Scope and price are locked before anything is built.",
    asset: "https://media.zypher-solutions.com/01-services-page/section-4/Architecture.png",
  },
  {
    label: "Build & Integration",
    heading: "Build & Integration",
    description:
      "Engineering starts. The system is built to connect to your real data and real tools, not a sandboxed demo environment. Edge cases are scoped and handled before launch, not after.",
    asset:
      "https://media.zypher-solutions.com/01-services-page/section-4/Build%20%26%20Integration.png",
  },
  {
    label: "Handoff & Documentation",
    heading: "Handoff & Documentation",
    description:
      "Full ownership transfers at handoff: code, prompts, configs, credentials. Documentation is written for the people maintaining it, not the people who built it. What happens after launch is scoped before we start.",
    asset:
      "https://media.zypher-solutions.com/01-services-page/section-4/Handoff%20%26%20Documentation.png",
  },
] as const;

describe("AI and LLM automation Section 4", () => {
  it("should render four icon-free stages with the supplied images and approved copy", () => {
    render(<AiLlmAutomationPage />);

    const section = screen.getByTestId("ai-llm-section-four");
    const stepButtons = within(section).getAllByTestId("ai-llm-section-four-step-button");
    const panels = Array.from(
      section.querySelectorAll<HTMLElement>('[data-testid^="ai-llm-section-four-panel-"]'),
    );
    const images = within(section).getAllByRole("img");

    expect(stepButtons).toHaveLength(stages.length);
    expect(
      stepButtons.map((button) => button.textContent?.replace(/^\s*\d+\s*/, "").trim()),
    ).toEqual(stages.map((stage) => stage.label));
    expect(panels).toHaveLength(stages.length);
    expect(images).toHaveLength(stages.length);

    stages.forEach((stage, index) => {
      expect(within(panels[index]).getByRole("heading", { level: 3 })).toHaveTextContent(
        stage.heading,
      );
      expect(within(panels[index]).getByText(stage.description)).toBeInTheDocument();
      const imageSource = images[index].getAttribute("src");
      expect(imageSource).not.toBeNull();
      expect(new URL(imageSource ?? "", window.location.origin).searchParams.get("url")).toBe(
        stage.asset,
      );
    });

    expect(section.textContent).not.toContain("—");
  });

  it("should activate the matching panel when a static stage is selected", async () => {
    const user = userEvent.setup();
    render(<AiLlmAutomationPage />);

    const section = screen.getByTestId("ai-llm-section-four");
    const rail = within(section).getByTestId("ai-llm-section-four-rail");
    const architectureButton = within(rail).getByRole("button", {
      name: "Architecture & Scope",
    });

    await user.click(architectureButton);

    expect(architectureButton).toHaveAttribute("aria-current", "true");
    expect(
      within(section).getByTestId("ai-llm-section-four-panel-architecture-and-scope"),
    ).toHaveAttribute("data-active", "true");
    expect(within(section).getByTestId("ai-llm-section-four-panel-discovery")).toHaveAttribute(
      "data-active",
      "false",
    );
  });
});
