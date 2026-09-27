import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import AboutPage from "@/app/(marketing)/about/page";

describe("About founders section", () => {
  it("should render all founders with their roles, supplied portraits, and LinkedIn links", () => {
    render(<AboutPage />);

    const section = screen.getByTestId("about-founders");
    const cards = within(section).getAllByTestId("about-founder-card");

    expect(
      within(section).getByRole("heading", { name: "Three co-founders. One standard." }),
    ).toBeInTheDocument();
    expect(cards).toHaveLength(3);

    const founders = [
      {
        name: "Muhammed Hasheem",
        role: "CO-FOUNDER & CEO",
        image: "https://media.zypher-solutions.com/about-page/section-4/Hasheem.png",
        linkedin: "https://www.linkedin.com/in/muhammedhasheem/",
      },
      {
        name: "Mohammed Ziyan",
        role: "CO-FOUNDER & COO",
        image: "https://media.zypher-solutions.com/about-page/section-4/Ziyan.png",
        linkedin: "https://www.linkedin.com/in/mohammedziyan7/",
      },
      {
        name: "Hank Emmanuel Nixon",
        role: "CO-FOUNDER & CTO",
        image: "https://media.zypher-solutions.com/about-page/section-4/Hank.png",
        linkedin: "https://www.linkedin.com/in/hanknixon/",
      },
    ];

    founders.forEach((founder, index) => {
      const card = cards[index]!;

      expect(within(card).getByRole("heading", { name: founder.name })).toBeInTheDocument();
      expect(within(card).getByText(founder.role)).toBeInTheDocument();
      expect(within(card).getByTestId("about-founder-image")).toHaveAttribute(
        "data-image-src",
        founder.image,
      );
      expect(
        within(card).getByRole("link", { name: `${founder.name} on LinkedIn` }),
      ).toHaveAttribute("href", founder.linkedin);
    });
  });
  it("should expose each founder's portfolio and emphasize the approved name segment", () => {
    render(<AboutPage />);

    const cards = screen.getAllByTestId("about-founder-card");
    const founders = [
      {
        name: "Muhammed Hasheem",
        highlight: "Hasheem",
        portfolio: "https://www.muhammed-hasheem.me/",
      },
      {
        name: "Mohammed Ziyan",
        highlight: "Ziyan",
        portfolio: "https://www.mohammedziyan.me/",
      },
      {
        name: "Hank Emmanuel Nixon",
        highlight: "Emmanuel Nixon",
        portfolio: "https://www.hanknixon.online/",
      },
    ];

    founders.forEach((founder, index) => {
      const card = cards[index]!;

      expect(within(card).getByRole("link", { name: `${founder.name} portfolio` })).toHaveAttribute(
        "href",
        founder.portfolio,
      );
      expect(within(card).getByTestId("about-founder-name-highlight")).toHaveTextContent(
        founder.highlight,
      );
    });
  });
});
