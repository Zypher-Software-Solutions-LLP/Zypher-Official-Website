import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import AboutPage from "@/app/(marketing)/about/page";

const TEAM_MEMBERS = [
  {
    name: "Rehen Manoy",
    role: "AI Backend Engineer",
    image: "https://media.zypher-solutions.com/about-page/section-5/Rehen.webp",
    linkedin: "https://www.linkedin.com/in/rehenmanoy/",
  },
  {
    name: "Sanjana Dev",
    role: "Software Developer",
    image: "https://media.zypher-solutions.com/about-page/section-5/Sanjana.webp",
    linkedin: "https://www.linkedin.com/in/sanjana-dev-658aa4324/",
  },
  {
    name: "Keerthana Abhilash",
    role: "QA Engineer",
    image: "https://media.zypher-solutions.com/about-page/section-5/Keerthana.webp",
    linkedin: "https://www.linkedin.com/in/keerthana-abhilash-7b8350322/",
  },
  {
    name: "Hanna Ann Renju",
    role: "Frontend Developer",
    image: "https://media.zypher-solutions.com/about-page/section-5/Hanna.webp",
    linkedin: "https://www.linkedin.com/in/hannarenju/",
  },
  {
    name: "Vivek Vinod",
    role: "Product Designer",
    image: "https://media.zypher-solutions.com/about-page/section-5/Vivek.webp",
    linkedin: "https://www.linkedin.com/in/viwvwek/",
  },
  {
    name: "Divin Siby",
    role: "Head of Marketing",
    image: "https://media.zypher-solutions.com/about-page/section-5/Divin.webp",
    linkedin: "https://www.linkedin.com/in/divin-siby-7862b0363/",
  },
] as const;

describe("About team section", () => {
  it("should render the supplied team portraits, roles, and LinkedIn links", () => {
    render(<AboutPage />);

    const section = screen.getByTestId("about-team");
    const cards = within(section).getAllByTestId("about-team-card");

    expect(within(section).getByRole("heading", { name: "Our Team" })).toBeInTheDocument();
    expect(cards).toHaveLength(7);

    TEAM_MEMBERS.forEach((member, index) => {
      const card = cards[index]!;

      expect(within(card).getByRole("heading", { name: member.name })).toBeInTheDocument();
      expect(within(card).getByText(member.role)).toBeInTheDocument();
      expect(within(card).getByTestId("about-team-image")).toHaveAttribute(
        "data-image-src",
        member.image,
      );
      expect(
        within(card).getByRole("link", { name: `${member.name} on LinkedIn` }),
      ).toHaveAttribute("href", member.linkedin);
    });
  });

  it("should keep the anonymous application slot and resume email actionable", () => {
    render(<AboutPage />);

    const section = screen.getByTestId("about-team");
    const anonymousCard = within(section).getAllByTestId("about-team-card").at(-1)!;
    const anonymousImage = within(anonymousCard).getByTestId("about-team-anonymous-image");

    expect(anonymousCard).toHaveTextContent("You Next?");
    expect(anonymousCard).toHaveTextContent("Open to the right person");
    expect(anonymousImage).toHaveAttribute(
      "data-image-src",
      "https://media.zypher-solutions.com/about-page/section-5/Anonymous.jpg",
    );
    expect(within(section).getByTestId("about-team-anonymous-arc")).toBeInTheDocument();
    expect(
      within(section).getByRole("link", { name: "info@zypher-solutions.com" }),
    ).toHaveAttribute("href", "mailto:info@zypher-solutions.com");
  });

  it("should render the recruitment copy and supplied gradient frame assets", () => {
    render(<AboutPage />);

    const section = screen.getByTestId("about-team");

    expect(
      within(section).getByRole("heading", { name: "Think you belong here?" }),
    ).toBeInTheDocument();
    expect(within(section).getByText(/If you’re good at what you do/)).toBeInTheDocument();
    expect(within(section).getAllByTestId("about-team-frame")).toHaveLength(6);
    expect(within(section).getAllByTestId("about-team-portrait-inside-mask")).toHaveLength(6);
    expect(within(section).getAllByTestId("about-team-portrait-popout-stage")).toHaveLength(6);
    const arcCount =
      within(section).getAllByTestId("about-team-arc-top").length +
      within(section).getAllByTestId("about-team-arc-bottom").length +
      within(section).getAllByTestId("about-team-anonymous-arc").length;
    expect(arcCount).toBe(13);
  });
});
