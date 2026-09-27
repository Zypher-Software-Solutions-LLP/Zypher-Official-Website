import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { HomePage } from "@/features/home/HomePage";

describe("homepage CTA section", () => {
  it("should render the final CTA with the approved copy and background", () => {
    render(<HomePage />);

    const section = screen.getByTestId("cta-section");

    expect(section).toHaveAttribute("data-testid", "cta-section");
    expect(
      screen.getByRole("heading", {
        level: 2,
        name: "Ready to build something that moves with you?",
      }),
    ).toBeInTheDocument();
    expect(screen.getByText("YOUR VISION, OUR CODE")).toBeInTheDocument();
    expect(
      screen.getByText(
        "No obligation on the first call. Just a conversation about what you\u2019re actually trying to solve",
      ),
    ).toBeInTheDocument();
    expect(section.querySelector("img")).toHaveAttribute(
      "data-image-src",
      expect.stringContaining("section-7/Background%20Image.png"),
    );
  });

  it("should route the final CTAs and WhatsApp to their destinations", () => {
    render(<HomePage />);

    expect(
      within(screen.getByTestId("cta-section")).getByRole("link", {
        name: "Book a Discovery Call",
      }),
    ).toHaveAttribute("href", "/contact");
    expect(
      within(screen.getByTestId("cta-section")).getByRole("link", { name: "See Our Work" }),
    ).toHaveAttribute("href", "/work");

    const whatsappLink = screen.getByRole("link", { name: "WhatsApp Us" });
    expect(whatsappLink).toHaveAttribute(
      "href",
      expect.stringMatching(
        /^https:\/\/wa\.me\/918075725045\?text=Hi%20Zypher%2C%20I%27d%20like%20to%20discuss%20a%20project\.$/,
      ),
    );
  });

  it("should remove the obsolete thinking and CTA blocks from the homepage", () => {
    render(<HomePage />);

    expect(
      screen.queryByRole("heading", { name: "Clarity is a growth advantage." }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText("Ready to see whether Zypher is the right partner for your next stage?"),
    ).not.toBeInTheDocument();
  });
});
