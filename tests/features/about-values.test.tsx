import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import AboutPage from "@/app/(marketing)/about/page";

const VALUE_ASSETS = [
  "https://media.zypher-solutions.com/about-page/section-3/Family%20First.png",
  "https://media.zypher-solutions.com/about-page/section-3/Zero%20Shortcuts.png",
  "https://media.zypher-solutions.com/about-page/section-3/Direct.png",
  "https://media.zypher-solutions.com/about-page/section-3/Space.png",
  "https://media.zypher-solutions.com/about-page/section-3/Built.png",
];

describe("About values section", () => {
  it("should render the approved values copy and five supplied illustrations", () => {
    render(<AboutPage />);

    const section = screen.getByTestId("about-values");

    expect(within(section).getByRole("heading", { name: "Our Values" })).toBeInTheDocument();
    expect(
      within(section).getByRole("heading", {
        name: "Structured doesn’t mean slow. Fast doesn’t mean loose.",
      }),
    ).toBeInTheDocument();
    expect(
      within(section).getByText(
        "Everything at Zypher, the fixed scope, the direct access to the people building your product, the stack chosen for the job, comes from the same place. We've been the client who got burned, and we built Zypher to not be that.",
      ),
    ).toBeInTheDocument();

    const cards = within(section).getAllByTestId("about-value-card");
    expect(cards).toHaveLength(5);

    const titles = [
      "Family First, Agency Second",
      "Zero Shortcuts",
      "Direct Always",
      "Space to Grow",
      "Built to Last",
    ];

    titles.forEach((title, index) => {
      expect(within(cards[index]!).getByRole("heading", { name: title })).toBeInTheDocument();
      expect(within(cards[index]!).getByTestId("about-value-icon")).toHaveAttribute(
        "data-image-src",
        VALUE_ASSETS[index],
      );
    });
  });
});
