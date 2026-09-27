import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ScopeApproachSection } from "@/features/services/scope-approach/ScopeApproachSection";

describe("ScopeApproachSection", () => {
  it("renders the scope message, illustration, and CTA", () => {
    render(<ScopeApproachSection />);

    const section = screen.getByTestId("scope-approach-section");

    expect(
      screen.getByRole("heading", { name: "The same problem often has two right answers." }),
    ).toBeInTheDocument();
    expect(screen.getByText(/A business drowning in manual client follow-ups/)).toBeInTheDocument();
    expect(screen.getByTestId("scope-approach-media")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "See Who We Work With" })).toHaveAttribute(
      "href",
      "/scale",
    );
    expect(section.textContent).not.toContain("—");
  });

  it("uses the same curve boundary paths as the home execution gap section", () => {
    render(<ScopeApproachSection />);

    expect(screen.getByTestId("scope-approach-boundary-top").querySelector("path")).toHaveAttribute(
      "d",
      "M0 28 C220 8 430 8 690 48 C920 82 1220 74 1440 32 L1440 140 L0 140 Z",
    );
    expect(
      screen.getByTestId("scope-approach-boundary-bottom").querySelector("path"),
    ).toHaveAttribute("d", "M0 86 C220 66 430 66 690 106 C920 140 1220 132 1440 90 L1440 0 L0 0 Z");
  });
});
