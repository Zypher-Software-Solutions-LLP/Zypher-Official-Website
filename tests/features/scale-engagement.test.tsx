import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ScaleEngagementSection } from "@/features/scale/ScaleEngagementSection";

const engagementParagraphs = [
  "We've built internal tools for two-person teams and custom platforms for operations running across three countries.",
  "The process on the outside stays the same, a discovery call, a scoped brief, a fixed quote, a build. What changes is the depth of what happens inside that process.",
  "More stakeholders, deeper discovery. More complexity, more documentation. More risk surface, more security consideration. The scale of the problem shapes the work. The client shapes the collaboration.",
];

describe("scale engagement section", () => {
  it("should render the approved copy, portrait, and curved bottom boundary", () => {
    render(<ScaleEngagementSection />);

    const section = screen.getByTestId("scale-engagement-section");

    expect(section.querySelector("p")?.textContent).toBe("HOW WE ENGAGE");
    expect(
      screen.getByRole("heading", {
        level: 2,
        name: "The problem determines the engagement. Not the size of your company.",
      }),
    ).toBeInTheDocument();
    for (const paragraph of engagementParagraphs) {
      expect(screen.getByText(paragraph)).toBeInTheDocument();
    }
    expect(screen.getByTestId("scale-engagement-image")).toHaveAttribute(
      "data-image-src",
      "https://media.zypher-solutions.com/scale-page/section-2/Section%202%20HOW%20WE%20ENGAGE.webp",
    );
    expect(screen.getByTestId("scale-engagement-boundary-bottom")).toBeInTheDocument();
  });
});
