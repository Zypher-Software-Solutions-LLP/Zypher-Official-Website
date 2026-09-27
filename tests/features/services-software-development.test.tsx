import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import SoftwareDevelopmentPage from "@/app/(marketing)/services/software-development/page";

describe("Software Development service page", () => {
  it("should render the six-section structure with the supplied software-development content", () => {
    render(<SoftwareDevelopmentPage />);

    const main = screen.getByRole("main");
    const hero = screen.getByTestId("software-development-hero");
    const sectionTwo = screen.getByTestId("software-development-section-two");
    const sectionThree = screen.getByTestId("software-development-section-three");
    const sectionFour = screen.getByTestId("software-development-section-four");
    const sectionFive = screen.getByTestId("software-development-section-five");
    const faq = screen.getByTestId("software-development-faq-section");
    const cta = screen.getByTestId("cta-section");

    expect(main.children).toHaveLength(7);
    expect(main.children[0]).toBe(hero);
    expect(main.children[1]).toBe(sectionTwo);
    expect(main.children[2]).toBe(sectionThree);
    expect(main.children[3]).toBe(sectionFour);
    expect(main.children[4]).toBe(sectionFive);
    expect(main.children[5]).toBe(faq);
    expect(main.children[6]).toBe(cta);

    expect(within(hero).getByTestId("software-development-hero-eyebrow")).toHaveTextContent(
      "SOFTWARE DEVELOPMENT",
    );
    expect(
      within(hero).getByRole("heading", {
        level: 1,
        name: "Built around how your business actually runs. Not a template it has to adapt to.",
      }),
    ).toBeInTheDocument();
    expect(
      within(hero).getByText(
        "From a single internal tool to a full-scale platform, we build software that fits your actual process, connects to your existing systems, and ships ready to run in production, not just in a demo environment.",
      ),
    ).toBeInTheDocument();
    expect(within(hero).getByRole("link", { name: "Book a Discovery call" })).toHaveAttribute(
      "href",
      "/contact",
    );
    expect(within(hero).getByRole("link", { name: "See how we build →" })).toHaveAttribute(
      "href",
      "/services/software-development#software-development-process",
    );
    expect(within(hero).getByTestId("software-development-hero-illustration")).toHaveAttribute(
      "data-image-src",
      "https://media.zypher-solutions.com/02-services-page/section-1/Hero%20Section.png",
    );

    expect(within(sectionTwo).getByRole("heading", { level: 2 })).toHaveTextContent(
      "Most software projects don't fail because of bad code. They fail before a line is written.",
    );
    expect(
      within(sectionTwo).getByTestId("software-development-section-two-illustration"),
    ).toHaveAttribute(
      "data-image-src",
      "https://media.zypher-solutions.com/02-services-page/section-2/Wide%20Section%202%20Illustration.png",
    );

    expect(within(sectionThree).getByRole("heading", { level: 2 })).toHaveTextContent(
      "Five core capabilities. Every one production-ready.",
    );
    expect(within(sectionThree).getAllByRole("article")).toHaveLength(6);
    expect(
      within(sectionThree).getByRole("heading", { name: "Custom Web Applications" }),
    ).toBeInTheDocument();
    expect(within(sectionThree).getByRole("link", { name: "Get in touch" })).toHaveAttribute(
      "href",
      "/contact",
    );

    expect(
      within(sectionFour).getByRole("heading", { level: 2, name: "HOW WE WORK" }),
    ).toBeInTheDocument();
    expect(
      within(sectionFour).getAllByTestId("software-development-section-four-step-button"),
    ).toHaveLength(4);
    expect(
      within(sectionFour).getByRole("heading", { level: 3, name: "Discovery" }),
    ).toBeInTheDocument();

    expect(
      within(sectionFive).getByRole("heading", {
        level: 2,
        name: "Production Ready. Fully Yours.",
      }),
    ).toBeInTheDocument();
    expect(within(sectionFive).getAllByRole("listitem")).toHaveLength(6);
    expect(within(sectionFive).getByRole("link", { name: "See Our Builds" })).toHaveAttribute(
      "href",
      "/work",
    );

    expect(
      within(faq).getByRole("heading", { level: 2, name: "Questions Worth asking" }),
    ).toBeInTheDocument();
    expect(within(faq).getAllByTestId("faq-question")).toHaveLength(8);
    expect(within(faq).getByTestId("faq-answer-copy")).toHaveTextContent(
      "The same people. The engineers and designers you speak to during discovery are the ones building your product.",
    );
  });

  it("should switch the FAQ answer while keeping the shared CTA after the FAQ", async () => {
    const user = userEvent.setup();
    render(<SoftwareDevelopmentPage />);

    const faq = screen.getByTestId("software-development-faq-section");
    const pricingQuestion = within(faq).getByRole("button", {
      name: "How is a custom software project priced?",
    });

    await user.click(pricingQuestion);

    expect(pricingQuestion).toHaveAttribute("aria-current", "true");
    expect(within(faq).getByTestId("faq-answer-question-text")).toHaveTextContent(
      "How is a custom software project priced?",
    );
    expect(within(faq).getByTestId("faq-answer-copy")).toHaveTextContent(
      "No hourly rates, no retainers, no open-ended engagements.",
    );
    expect(faq.nextElementSibling).toBe(screen.getByTestId("cta-section"));
  });
});
