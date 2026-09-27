import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import ScalePage from "@/app/(marketing)/scale/page";

describe("scale page", () => {
  it("should compose the hero, Scale sections, and shared final CTA", () => {
    const { container } = render(<ScalePage />);
    const main = container.querySelector("main");

    expect(main?.firstElementChild).toHaveAttribute("data-testid", "scale-hero");
    expect(screen.getByTestId("cta-section")).toBeInTheDocument();
    expect(main?.children).toHaveLength(6);
    expect(main?.children[1]).toHaveAttribute("data-testid", "scale-engagement-section");
    expect(main?.children[2]).toHaveAttribute("data-testid", "scale-industries-section");
    expect(main?.children[3]).toHaveAttribute("data-testid", "scale-problem-fit-section");
    expect(main?.children[4]).toHaveAttribute("data-testid", "scale-testimonials-section");
  });
});
