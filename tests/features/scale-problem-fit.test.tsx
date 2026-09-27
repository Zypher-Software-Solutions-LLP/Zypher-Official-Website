import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ScaleProblemFitSection } from "@/features/scale/ScaleProblemFitSection";

describe("scale problem fit section", () => {
  it("should render the active fit criterion and switch its image and description", () => {
    render(<ScaleProblemFitSection />);

    const section = screen.getByTestId("scale-problem-fit-section");
    expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent(
      "You don’t need to have the answer. You need to know the problem.",
    );
    expect(screen.getAllByTestId("scale-problem-fit-trigger")).toHaveLength(4);
    expect(screen.getByTestId("scale-problem-fit-image")).toHaveAttribute(
      "data-image-src",
      "https://media.zypher-solutions.com/scale-page/section-4/Problem%20Clarity.png",
    );
    expect(screen.getByTestId("scale-problem-fit-description")).toHaveTextContent(
      "You've identified something costing you time, money, customers, or growth.",
    );
    expect(section.querySelectorAll('[data-testid^="scale-problem-fit-boundary-"]')).toHaveLength(
      2,
    );
  });

  it("should update the active criterion without em dashes", () => {
    render(<ScaleProblemFitSection />);

    const section = screen.getByTestId("scale-problem-fit-section");

    fireEvent.click(screen.getByRole("button", { name: "Direct Communication" }));

    expect(screen.getByRole("button", { name: "Direct Communication" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    expect(screen.getByTestId("scale-problem-fit-image")).toHaveAttribute(
      "data-image-src",
      "https://media.zypher-solutions.com/scale-page/section-4/Direct%20Communication.png",
    );
    expect(screen.getByTestId("scale-problem-fit-description")).toHaveTextContent(
      "Our clients talk directly to the people building their product.",
    );
    expect(section.textContent).not.toContain("—");
  });

  it("should cycle and wrap the mobile criterion with arrow controls", () => {
    render(<ScaleProblemFitSection />);

    const mobileTitle = screen.getByTestId("scale-problem-fit-mobile-title");
    const previousButton = screen.getByRole("button", { name: "Show previous fit criterion" });
    const nextButton = screen.getByRole("button", { name: "Show next fit criterion" });

    expect(mobileTitle).toHaveTextContent("Problem Clarity");

    fireEvent.click(previousButton);
    expect(mobileTitle).toHaveTextContent("Direct Communication");
    expect(screen.getByTestId("scale-problem-fit-mobile-description")).toHaveTextContent(
      "Our clients talk directly to the people building their product.",
    );

    fireEvent.click(nextButton);
    expect(mobileTitle).toHaveTextContent("Problem Clarity");
    expect(screen.getByTestId("scale-problem-fit-mobile-image")).toHaveAttribute(
      "data-image-src",
      "https://media.zypher-solutions.com/scale-page/section-4/Problem%20Clarity.png",
    );
  });
});
