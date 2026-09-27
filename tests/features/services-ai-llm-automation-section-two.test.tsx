import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { AiLlmAutomationSectionTwo } from "@/features/services/AiLlmAutomationSectionTwo";

describe("AI and LLM automation Section 2", () => {
  it("should render the approved heading, illustration, and full copy", () => {
    render(<AiLlmAutomationSectionTwo />);

    expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent(
      "Most AI Implementations look impressive in a demo. Few survive real usage.",
    );
    expect(screen.getByText("WHAT THIS")).toBeInTheDocument();
    expect(screen.getByText("ACTUALLY IS")).toBeInTheDocument();
    expect(
      screen.getByText(/The gap between "we added AI" and "AI is running our operations"/),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/What we build isn't a layer on top of your existing tools/),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "The demo works because we scope it to work in production, not to impress in a presentation.",
      ),
    ).toBeInTheDocument();
    expect(screen.getByTestId("ai-llm-section-two-illustration")).toHaveAttribute(
      "data-image-src",
      "https://media.zypher-solutions.com/01-services-page/section-2/Wide%20Section%202%20Illustration.png",
    );
  });
});
