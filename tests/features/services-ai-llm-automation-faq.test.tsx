import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import AiLlmAutomationPage from "@/app/(marketing)/services/ai-llm-automation/page";

describe("AI and LLM automation FAQ", () => {
  it("should render the requested introduction, eight questions, and the first answer", () => {
    render(<AiLlmAutomationPage />);

    const section = screen.getByTestId("ai-llm-automation-faq-section");
    const questions = within(section).getAllByTestId("faq-question");

    expect(
      within(section).getByRole("heading", { level: 2, name: "Questions Worth asking" }),
    ).toBeInTheDocument();
    expect(
      within(section).getByText("The answers we’d want before hiring anyone"),
    ).toBeInTheDocument();
    expect(questions).toHaveLength(8);
    expect(questions[0]).toHaveTextContent(
      "Do I own everything after the build: code, prompts, configs, and data?",
    );
    expect(within(section).getByTestId("faq-answer-copy")).toHaveTextContent(
      "Yes, full ownership transfers at handoff.",
    );
    expect(section.textContent).not.toContain("—");
  });

  it("should switch the answer when a question is selected", async () => {
    const user = userEvent.setup();
    render(<AiLlmAutomationPage />);

    const section = screen.getByTestId("ai-llm-automation-faq-section");
    const dataQuestion = within(section).getByRole("button", {
      name: "Where is our data processed during the build, and who has access to it?",
    });

    await user.click(dataQuestion);

    expect(dataQuestion).toHaveAttribute("aria-current", "true");
    expect(within(section).getByTestId("faq-answer-question-text")).toHaveTextContent(
      "Where is our data processed during the build, and who has access to it?",
    );
    expect(within(section).getByTestId("faq-answer-copy")).toHaveTextContent(
      "Your data stays on infrastructure agreed with you during discovery, never on systems only we control.",
    );
  });

  it("should place the shared final CTA immediately after the FAQ", () => {
    render(<AiLlmAutomationPage />);

    const main = screen.getByRole("main");
    const faq = screen.getByTestId("ai-llm-automation-faq-section");
    const cta = screen.getByTestId("cta-section");

    expect(faq.nextElementSibling).toBe(cta);
    expect(main.lastElementChild).toBe(cta);
    expect(within(cta).getByRole("link", { name: "WhatsApp Us" })).toBeInTheDocument();
  });
});
