import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Footer } from "@/components/layout/Footer";

describe("site footer", () => {
  it("should expose the shared brand, navigation, social links, and utility controls", () => {
    render(<Footer />);

    expect(screen.getByRole("contentinfo")).toHaveAttribute("data-testid", "site-footer");
    expect(screen.getByRole("link", { name: "Zypher Software Solutions home" })).toHaveAttribute(
      "href",
      "/",
    );
    expect(screen.getByRole("navigation", { name: "Footer navigation" })).toHaveTextContent(
      "Explore",
    );
    expect(screen.getByRole("link", { name: "AI & LLM Autom." })).toHaveAttribute(
      "href",
      "/services/ai-llm-automation",
    );
    expect(screen.getByRole("link", { name: "info@zypher-solutions.com" })).toHaveAttribute(
      "href",
      "mailto:info@zypher-solutions.com",
    );
    expect(screen.getByRole("navigation", { name: "Utility navigation" })).toHaveTextContent(
      "Privacy",
    );
    expect(screen.getByRole("button", { name: "Cookie settings" })).toBeInTheDocument();
  });

  it("should preserve the supplied social destinations", () => {
    render(<Footer />);

    expect(screen.getByRole("link", { name: "Facebook" })).toHaveAttribute(
      "href",
      "https://www.facebook.com/profile.php?id=61594146397661",
    );
    expect(screen.getByRole("link", { name: "X" })).toHaveAttribute(
      "href",
      "https://x.com/ZyphersSolution",
    );
    expect(screen.getByRole("link", { name: "Instagram" })).toHaveAttribute(
      "href",
      "https://www.instagram.com/zyphersolutions/",
    );
    expect(screen.getByRole("link", { name: "LinkedIn" })).toHaveAttribute(
      "href",
      "https://www.linkedin.com/company/zypher-solutions/",
    );
    expect(screen.getByRole("link", { name: "WhatsApp" })).toHaveAttribute(
      "href",
      "https://wa.me/918075725045",
    );
  });
  it("should render the supplied footer illustration as a decorative background layer", () => {
    render(<Footer />);

    const illustration = screen.getByTestId("site-footer-illustration");

    expect(illustration).toHaveAttribute(
      "data-image-src",
      "https://media.zypher-solutions.com/footer/Footer%20Illustration.png",
    );
    expect(illustration.querySelector("img")).not.toBeNull();
    expect(illustration).toHaveAttribute("aria-hidden", "true");
  });
});
