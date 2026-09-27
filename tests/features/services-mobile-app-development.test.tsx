import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import MobileAppDevelopmentPage from "@/app/(marketing)/services/mobile-app-development/page";

describe("Mobile App Development service page", () => {
  it("should render the six-section structure with the supplied mobile-app-development content", () => {
    render(<MobileAppDevelopmentPage />);

    const main = screen.getByRole("main");
    const hero = screen.getByTestId("mobile-app-development-hero");
    const sectionTwo = screen.getByTestId("mobile-app-development-section-two");
    const sectionThree = screen.getByTestId("mobile-app-development-section-three");
    const sectionFour = screen.getByTestId("mobile-app-development-section-four");
    const sectionFive = screen.getByTestId("mobile-app-development-section-five");
    const faq = screen.getByTestId("mobile-app-development-faq-section");
    const cta = screen.getByTestId("cta-section");

    expect(main.children).toHaveLength(7);
    expect(main.children[0]).toBe(hero);
    expect(main.children[1]).toBe(sectionTwo);
    expect(main.children[2]).toBe(sectionThree);
    expect(main.children[3]).toBe(sectionFour);
    expect(main.children[4]).toBe(sectionFive);
    expect(main.children[5]).toBe(faq);
    expect(main.children[6]).toBe(cta);

    expect(within(hero).getByTestId("mobile-app-development-hero-eyebrow")).toHaveTextContent(
      "MOBILE APP DEVELOPMENT",
    );
    expect(
      within(hero).getByRole("heading", {
        level: 1,
        name: "Your app. Both platforms. One codebase that lasts.",
      }),
    ).toBeInTheDocument();
    expect(
      within(hero).getByText(
        "From an idea on a napkin to a fully integrated app on iOS and Android, we build mobile products that connect to your existing systems, survive real usage, and don't need a full rebuild every time the OS updates.",
      ),
    ).toBeInTheDocument();
    expect(within(hero).getByRole("link", { name: "Book a Discovery call" })).toHaveAttribute(
      "href",
      "/contact",
    );
    expect(within(hero).getByRole("link", { name: "See how we build →" })).toHaveAttribute(
      "href",
      "/services/mobile-app-development#mobile-app-development-process",
    );
    expect(within(hero).getByTestId("mobile-app-development-hero-illustration")).toHaveAttribute(
      "data-image-src",
      "https://media.zypher-solutions.com/03-services-page/section-1/Hero%20Section.png",
    );

    expect(within(sectionTwo).getByRole("heading", { level: 2 })).toHaveTextContent(
      "Most apps don't fail because of bad code. They fail before a line is written.",
    );
    expect(
      within(sectionTwo).getByTestId("mobile-app-development-section-two-illustration"),
    ).toHaveAttribute(
      "data-image-src",
      "https://media.zypher-solutions.com/03-services-page/section-2/Wide%20Section%202%20Illustration.png",
    );

    expect(within(sectionThree).getByRole("heading", { level: 2 })).toHaveTextContent(
      "Five core capabilities. Shipped to both platforms.",
    );
    expect(within(sectionThree).getAllByRole("article")).toHaveLength(6);
    expect(
      within(sectionThree).getByRole("heading", { name: "Cross Platform Mobile Apps" }),
    ).toBeInTheDocument();
    expect(within(sectionThree).getByRole("link", { name: "Get in touch" })).toHaveAttribute(
      "href",
      "/contact",
    );

    expect(
      within(sectionFour).getByRole("heading", { level: 2, name: "HOW WE WORK" }),
    ).toBeInTheDocument();
    expect(
      within(sectionFour).getAllByTestId("mobile-app-development-section-four-step-button"),
    ).toHaveLength(4);
    expect(
      within(sectionFour).getByRole("heading", { level: 3, name: "Discovery" }),
    ).toBeInTheDocument();

    expect(
      within(sectionFive).getByRole("heading", {
        level: 2,
        name: "Live on both stores. Fully yours.",
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
      "That depends on what the app needs to do. Flutter is our default recommendation for most business apps, near-native performance, one codebase, both platforms, significantly lower build and maintenance cost.",
    );
  });

  it("should switch the FAQ answer while keeping the shared CTA after the FAQ", async () => {
    const user = userEvent.setup();
    render(<MobileAppDevelopmentPage />);

    const faq = screen.getByTestId("mobile-app-development-faq-section");
    const pricingQuestion = within(faq).getByRole("button", {
      name: "How is a mobile app project priced?",
    });

    await user.click(pricingQuestion);

    expect(pricingQuestion).toHaveAttribute("aria-current", "true");
    expect(within(faq).getByTestId("faq-answer-question-text")).toHaveTextContent(
      "How is a mobile app project priced?",
    );
    expect(within(faq).getByTestId("faq-answer-copy")).toHaveTextContent(
      "No hourly rates, no open-ended retainers.",
    );
    expect(faq.nextElementSibling).toBe(screen.getByTestId("cta-section"));
  });
});
