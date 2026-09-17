import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Header } from "@/components/layout/Header";

vi.mock("next/navigation", () => ({
  usePathname: () => "/",
}));

describe("site header", () => {
  it("should expose the brand home link, primary navigation, and contact CTA", () => {
    render(<Header />);

    expect(screen.getByRole("banner")).toHaveAttribute("data-variant", "compact");
    expect(screen.getByRole("banner")).toHaveAttribute("data-width", "responsive");
    expect(screen.getByRole("link", { name: "Zypher Software Solutions home" })).toHaveAttribute(
      "href",
      "/",
    );
    expect(screen.getByRole("navigation", { name: "Primary navigation" })).toHaveTextContent(
      "Services",
    );
    expect(screen.getByRole("navigation", { name: "Primary navigation" })).toHaveTextContent(
      "Work",
    );
    expect(screen.getByRole("navigation", { name: "Primary navigation" })).toHaveTextContent(
      "Scale",
    );
    expect(screen.getByRole("navigation", { name: "Primary navigation" })).toHaveTextContent(
      "About",
    );
    expect(screen.getByRole("navigation", { name: "Primary navigation" })).toHaveTextContent(
      "Blog",
    );
    expect(screen.getByRole("link", { name: "Contact Us" })).toHaveAttribute("href", "/contact");
  });
});
