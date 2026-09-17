import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { faqItems } from "@/features/home/faq/faq-data";
import { HomePage } from "@/features/home/HomePage";

describe("homepage FAQ section", () => {
  it("should render every question and show the first answer by default", () => {
    render(<HomePage />);

    const section = screen.getByTestId("faq-section");
    const questions = within(section).getAllByTestId("faq-question");

    expect(
      within(section).getByRole("heading", {
        level: 2,
        name: "Questions you’re probably already asking",
      }),
    ).toBeInTheDocument();
    expect(
      within(section).getByRole("heading", {
        level: 3,
        name: "The Answers to the Questions",
      }),
    ).toBeInTheDocument();
    expect(
      within(section).getByText(
        "No generic answers, just what you’d actually want to know before reaching out.",
      ),
    ).toBeInTheDocument();
    expect(questions).toHaveLength(9);
    expect(questions[0]).toHaveTextContent("1.");
    expect(questions[0]).toHaveTextContent("How much does custom software development cost?");
    expect(
      within(section).getByRole("option", {
        name: "How much does custom software development cost?",
      }),
    ).toBeInTheDocument();
    expect(questions[8]).toHaveTextContent(
      "What’s the difference between hiring a freelancer and working with an agency like Zypher?",
    );
    expect(within(section).getByTestId("faq-answer")).toHaveTextContent(
      "There's no fixed package price",
    );
    const answerQuestion = within(section).getByTestId("faq-answer-question");
    expect(answerQuestion).toHaveTextContent("01");
    expect(
      within(answerQuestion).getByText("How much does custom software development cost?"),
    ).toBeInTheDocument();
    expect(within(answerQuestion).queryByRole("heading")).not.toBeInTheDocument();
  });

  it("should contain no em dashes in FAQ answers", () => {
    expect(faqItems.every((item) => !item.answer.includes("—"))).toBe(true);
  });

  it("should switch the desktop answer when a question is selected", async () => {
    const user = userEvent.setup();
    render(<HomePage />);

    const section = screen.getByTestId("faq-section");
    const questionButton = within(section).getByRole("button", {
      name: "How long does custom software development take?",
    });

    await user.click(questionButton);

    expect(questionButton).toHaveAttribute("aria-current", "true");
    expect(within(section).getByTestId("faq-answer")).toHaveTextContent(
      "Timeline depends on scope the same way cost does",
    );
  });

  it("should switch the compact answer when the dropdown value changes", async () => {
    const user = userEvent.setup();
    render(<HomePage />);

    const section = screen.getByTestId("faq-section");
    const select = within(section).getByRole("combobox", {
      name: "Choose a frequently asked question",
    });

    await user.selectOptions(select, "data-security");

    expect(select).toHaveValue("data-security");
    expect(within(section).getByTestId("faq-answer")).toHaveTextContent("Your data stays yours");
  });
});
