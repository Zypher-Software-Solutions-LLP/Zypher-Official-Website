import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import AboutPage from "@/app/(marketing)/about/page";

describe("About hero section", () => {
  it("should render the approved About copy, artwork, background, and CTAs", () => {
    render(<AboutPage />);

    const hero = screen.getByTestId("about-hero");

    expect(
      within(hero).getByRole("heading", {
        level: 1,
        name: "We started fixing things nobody asked us to fix. That part never changed.",
      }),
    ).toBeInTheDocument();
    expect(
      within(hero).getByText(
        "Zypher began as three people solving problems around them, long before it was a company. Today we build tailored software for teams across 5+ countries without losing the part that made it work in the first place.",
      ),
    ).toBeInTheDocument();
    expect(screen.getByTestId("about-hero-background")).toHaveAttribute(
      "data-image-src",
      "/home/section-1/background-illustration.png",
    );
    expect(screen.getByTestId("about-hero-illustration")).toHaveAttribute(
      "data-image-src",
      "https://media.zypher-solutions.com/about-page/section-1/Hero%20Section.png",
    );
    expect(within(hero).getByRole("link", { name: "Book a Discovery Call" })).toHaveAttribute(
      "href",
      "/contact",
    );
    expect(within(hero).getByRole("link", { name: "See Our Work" })).toHaveAttribute(
      "href",
      "/work",
    );
  });
});
