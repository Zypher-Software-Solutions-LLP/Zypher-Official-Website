import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import DesignCreativePage from "@/app/(marketing)/services/design-creative/page";

describe("Design & Creative service page", () => {
  it("should render the six-section structure with the supplied design and creative content", () => {
    render(<DesignCreativePage />);

    const main = screen.getByRole("main");
    const hero = screen.getByTestId("design-creative-hero");
    const sectionTwo = screen.getByTestId("design-creative-section-two");
    const sectionThree = screen.getByTestId("design-creative-section-three");
    const sectionFour = screen.getByTestId("design-creative-section-four");
    const sectionFive = screen.getByTestId("design-creative-section-five");
    const faq = screen.getByTestId("design-creative-faq-section");
    const cta = screen.getByTestId("cta-section");

    expect(main.children).toHaveLength(7);
    expect(main.children[0]).toBe(hero);
    expect(main.children[1]).toBe(sectionTwo);
    expect(main.children[2]).toBe(sectionThree);
    expect(main.children[3]).toBe(sectionFour);
    expect(main.children[4]).toBe(sectionFive);
    expect(main.children[5]).toBe(faq);
    expect(main.children[6]).toBe(cta);

    expect(within(hero).getByTestId("design-creative-hero-eyebrow")).toHaveTextContent(
      "DESIGN & CREATIVE",
    );
    expect(
      within(hero).getByRole("heading", {
        level: 1,
        name: "Designed for how people actually use it. Not how it looks in a presentation.",
      }),
    ).toBeInTheDocument();
    expect(
      within(hero).getByRole("heading", { level: 1 }).textContent?.replace(/\s+/g, " ").trim(),
    ).toBe("Designed for how people actually use it. Not how it looks in a presentation.");
    expect(
      within(hero).getByText(
        "From wireframe to brand identity, we design products and visuals that work for the people using them, not just the people approving them. Research first. Craft second. Delivered ready to build or go live.",
      ),
    ).toBeInTheDocument();
    expect(within(hero).getByRole("link", { name: "Book a Discovery call" })).toHaveAttribute(
      "href",
      "/contact",
    );
    expect(within(hero).getByRole("link", { name: "See how we build →" })).toHaveAttribute(
      "href",
      "/services/design-creative#design-creative-process",
    );
    expect(within(hero).getByTestId("design-creative-hero-illustration")).toHaveAttribute(
      "data-image-src",
      "https://media.zypher-solutions.com/04-services-page/section-1/Hero%20Section.webp",
    );

    expect(within(sectionTwo).getByRole("heading", { level: 2 })).toHaveTextContent(
      "AI can generate a screen in seconds. It can't tell you if it's the right one.",
    );
    expect(
      within(sectionTwo).getByTestId("design-creative-section-two-illustration"),
    ).toHaveAttribute(
      "data-image-src",
      "https://media.zypher-solutions.com/04-services-page/section-2/Wide%20Section%202%20Illustration.webp",
    );

    expect(within(sectionThree).getByRole("heading", { level: 2 })).toHaveTextContent(
      "Five core capabilities. Every one built to last.",
    );
    expect(within(sectionThree).getAllByRole("article")).toHaveLength(6);
    expect(
      within(sectionThree).getByRole("heading", { name: "User Research & Prototyping" }),
    ).toBeInTheDocument();
    expect(within(sectionThree).getByRole("link", { name: "Get in touch" })).toHaveAttribute(
      "href",
      "/contact",
    );

    expect(
      within(sectionFour).getByRole("heading", { level: 2, name: "HOW WE WORK" }),
    ).toBeInTheDocument();
    expect(
      within(sectionFour).getAllByTestId("design-creative-section-four-step-button"),
    ).toHaveLength(4);
    expect(
      within(sectionFour).getByRole("heading", { level: 3, name: "Research & Strategy" }),
    ).toBeInTheDocument();

    expect(
      within(sectionFive).getByRole("heading", {
        level: 2,
        name: "Designed, documented, ready to use.",
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
      "AI can generate screens quickly. What it can't do is tell you whether the screen solves the right problem",
    );
  });

  it("should switch the FAQ answer while keeping the shared CTA after the FAQ", async () => {
    const user = userEvent.setup();
    render(<DesignCreativePage />);

    const faq = screen.getByTestId("design-creative-faq-section");
    const timelineQuestion = within(faq).getByRole("button", {
      name: "How long does a design or creative project take?",
    });

    await user.click(timelineQuestion);

    expect(timelineQuestion).toHaveAttribute("aria-current", "true");
    expect(within(faq).getByTestId("faq-answer-question-text")).toHaveTextContent(
      "How long does a design or creative project take?",
    );
    expect(within(faq).getByTestId("faq-answer-copy")).toHaveTextContent(
      "A focused UI/UX scope, one user flow, clearly defined, can be delivered in two to four weeks.",
    );
    expect(faq.nextElementSibling).toBe(screen.getByTestId("cta-section"));
  });
});
