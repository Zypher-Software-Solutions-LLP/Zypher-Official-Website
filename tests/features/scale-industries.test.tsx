import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ScaleIndustriesSection } from "@/features/scale/ScaleIndustriesSection";

const industryTitles = [
  "Fintech",
  "Retail & E-Commerce",
  "Healthcare",
  "Sports",
  "Logistics & Ops",
  "Real Estate",
  "SaaS & Services",
  "Hospitality | Events",
  "Education & EdTech",
  "Professional Services",
];

describe("scale industries section", () => {
  it("should render all industry cards, assets, and decorative lines", () => {
    render(<ScaleIndustriesSection />);

    const section = screen.getByTestId("scale-industries-section");

    expect(
      screen.getByRole("heading", {
        level: 2,
        name: "Built Across industries. Fluent in the problems behind them.",
      }),
    ).toBeInTheDocument();
    expect(screen.getByText("Industries we build for")).toBeInTheDocument();
    expect(screen.getAllByTestId("scale-industry-card")).toHaveLength(industryTitles.length);
    expect(screen.getByTestId("scale-industries-lines")).toBeInTheDocument();
    expect(screen.queryByTestId("scale-industries-top-shape")).not.toBeInTheDocument();
    expect(screen.queryByTestId("scale-industries-bottom-shape")).not.toBeInTheDocument();

    for (const title of industryTitles) {
      expect(screen.getByRole("heading", { level: 3, name: title })).toBeInTheDocument();
    }

    expect(section.querySelectorAll("img")).toHaveLength(industryTitles.length);
    expect(screen.getByTestId("scale-industry-image-fintech")).toHaveAttribute(
      "data-image-src",
      "https://media.zypher-solutions.com/scale-page/section-3/Fintech.png",
    );
  });
});
