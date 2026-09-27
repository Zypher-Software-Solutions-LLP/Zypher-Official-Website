import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import CrmErpSolutionsPage from "@/app/(marketing)/services/crm-erp-solutions/page";

describe("CRM/ERP Solutions service page", () => {
  it("should render the six-section structure with the supplied CRM and ERP content", () => {
    render(<CrmErpSolutionsPage />);

    const main = screen.getByRole("main");
    const hero = screen.getByTestId("crm-erp-solutions-hero");
    const sectionTwo = screen.getByTestId("crm-erp-solutions-section-two");
    const sectionThree = screen.getByTestId("crm-erp-solutions-section-three");
    const sectionFour = screen.getByTestId("crm-erp-solutions-section-four");
    const sectionFive = screen.getByTestId("crm-erp-solutions-section-five");
    const faq = screen.getByTestId("crm-erp-solutions-faq-section");
    const cta = screen.getByTestId("cta-section");

    expect(main.children).toHaveLength(7);
    expect(main.children[0]).toBe(hero);
    expect(main.children[1]).toBe(sectionTwo);
    expect(main.children[2]).toBe(sectionThree);
    expect(main.children[3]).toBe(sectionFour);
    expect(main.children[4]).toBe(sectionFive);
    expect(main.children[5]).toBe(faq);
    expect(main.children[6]).toBe(cta);

    expect(within(hero).getByTestId("crm-erp-solutions-hero-eyebrow")).toHaveTextContent(
      "CRM / ERP SOLUTIONS",
    );
    expect(
      within(hero).getByRole("heading", {
        level: 1,
        name: "Your operations. Finally in one place.",
      }),
    ).toBeInTheDocument();
    expect(
      within(hero).getByText(
        "Whether you need a platform configured to how your business actually runs or a system built from scratch, we map your workflow first, then build or configure around it.",
      ),
    ).toBeInTheDocument();
    expect(within(hero).getByRole("link", { name: "Book a Discovery call" })).toHaveAttribute(
      "href",
      "/contact",
    );
    expect(within(hero).getByRole("link", { name: "See how we build →" })).toHaveAttribute(
      "href",
      "/services/crm-erp-solutions#crm-erp-solutions-process",
    );
    expect(within(hero).getByTestId("crm-erp-solutions-hero-illustration")).toHaveAttribute(
      "data-image-src",
      "https://media.zypher-solutions.com/05-services-page/section-1/Hero%20Section.png",
    );

    expect(within(sectionTwo).getByRole("heading", { level: 2 })).toHaveTextContent(
      "A CRM nobody uses is just expensive software collecting contact records.",
    );
    expect(
      within(sectionTwo).getByTestId("crm-erp-solutions-section-two-illustration"),
    ).toHaveAttribute(
      "data-image-src",
      "https://media.zypher-solutions.com/05-services-page/section-2/Wide%20Section%202%20Illustration.png",
    );

    expect(within(sectionThree).getByRole("heading", { level: 2 })).toHaveTextContent(
      "Five core capabilities. Built around your workflow.",
    );
    expect(within(sectionThree).getAllByRole("article")).toHaveLength(6);
    expect(
      within(sectionThree).getByRole("heading", { name: "CRM Implementation & Config" }),
    ).toBeInTheDocument();
    expect(within(sectionThree).getByRole("link", { name: "Get in touch" })).toHaveAttribute(
      "href",
      "/contact",
    );

    expect(
      within(sectionFour).getByRole("heading", { level: 2, name: "HOW WE WORK" }),
    ).toBeInTheDocument();
    expect(
      within(sectionFour).getAllByTestId("crm-erp-solutions-section-four-step-button"),
    ).toHaveLength(4);
    expect(
      within(sectionFour).getByRole("heading", { level: 3, name: "System Mapping & Config" }),
    ).toBeInTheDocument();

    expect(
      within(sectionFive).getByRole("heading", {
        level: 2,
        name: "Configured, connected. Ready to run.",
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
      "It depends on your workflow complexity and long-term cost. Major platforms like Salesforce, HubSpot, or Odoo cover most standard processes well",
    );
  });

  it("should switch the FAQ answer while keeping the shared CTA after the FAQ", async () => {
    const user = userEvent.setup();
    render(<CrmErpSolutionsPage />);

    const faq = screen.getByTestId("crm-erp-solutions-faq-section");
    const pricingQuestion = within(faq).getByRole("button", {
      name: "How is a CRM or ERP project priced?",
    });

    await user.click(pricingQuestion);

    expect(pricingQuestion).toHaveAttribute("aria-current", "true");
    expect(within(faq).getByTestId("faq-answer-question-text")).toHaveTextContent(
      "How is a CRM or ERP project priced?",
    );
    expect(within(faq).getByTestId("faq-answer-copy")).toHaveTextContent(
      "No hourly rates, no open retainers.",
    );
    expect(faq.nextElementSibling).toBe(screen.getByTestId("cta-section"));
  });
});
