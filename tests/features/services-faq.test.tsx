import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { ServicesFaqSection } from "@/features/services/faq/ServicesFaqSection";
import { servicesFaqItems } from "@/features/services/faq/services-faq-data";

describe("services FAQ section", () => {
  it("should render every Services question and show the first answer by default", () => {
    render(<ServicesFaqSection />);

    const section = screen.getByTestId("services-faq-section");
    const questions = within(section).getAllByTestId("faq-question");

    expect(questions).toHaveLength(7);
    expect(
      within(section).getByRole("heading", { level: 2, name: "Services FAQ" }),
    ).toBeInTheDocument();
    expect(
      within(section).queryByText(
        "No generic answers, just what you’d actually want to know before reaching out.",
      ),
    ).not.toBeInTheDocument();
    expect(questions[0]).toHaveTextContent(
      "Do you build AI features into an existing app, or only from scratch?",
    );
    expect(within(section).getByTestId("faq-answer")).toHaveTextContent(
      "Most AI & LLM Automation work is integrated into a product you already have",
    );
  });

  it("should contain no em dashes in Services FAQ content", () => {
    expect(
      servicesFaqItems.every((item) => !item.question.includes("—") && !item.answer.includes("—")),
    ).toBe(true);
  });

  it("should switch the active answer when a Services question is selected", async () => {
    const user = userEvent.setup();
    render(<ServicesFaqSection />);

    const section = screen.getByTestId("services-faq-section");
    const questionButton = within(section).getByRole("button", {
      name: "What if we're not sure which service we need?",
    });

    await user.click(questionButton);

    expect(questionButton).toHaveAttribute("aria-current", "true");
    expect(within(section).getByTestId("faq-answer")).toHaveTextContent(
      "That's what the discovery call is for",
    );
  });
});
