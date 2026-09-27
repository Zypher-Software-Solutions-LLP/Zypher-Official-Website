import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import WorkPage from "@/app/(marketing)/work/page";

describe("work page", () => {
  it("renders the responsive Work hero before the project section", () => {
    render(<WorkPage />);
    const hero = screen.getByTestId("work-hero-section");
    const picture = within(hero).getByTestId("work-hero-picture");
    const desktopImage = within(picture).getByTestId("work-hero-desktop-image");

    expect(within(hero).getByRole("heading", { name: /Every Project below/i })).toBeInTheDocument();
    expect(within(hero).getByText("OUR")).toBeInTheDocument();
    expect(within(hero).getByText("WORK")).toBeInTheDocument();
    expect(within(hero).getByRole("link", { name: "See the Builds →" })).toHaveAttribute(
      "href",
      "/work#work-projects",
    );
    expect(desktopImage).toHaveAttribute("data-image-quality", "100");
    expect(desktopImage).toHaveAttribute(
      "data-image-src",
      expect.stringContaining("work-page/section-1/Hero%20Section.png"),
    );
    expect(picture.querySelector("source")).toHaveAttribute(
      "srcset",
      expect.stringContaining("work-page/section-1/Hero%20Section%20-%20Mobile.png"),
    );
    expect(screen.getByTestId("work-projects-section")).toBeInTheDocument();
  });

  it("groups the tablet illustration content into a dedicated inner copy block", () => {
    render(<WorkPage />);
    const hero = screen.getByTestId("work-hero-section");
    const screenCopy = within(hero).getByTestId("work-hero-screen-copy");

    expect(
      within(screenCopy).getByRole("heading", { name: /Every Project below/i }),
    ).toBeInTheDocument();
    expect(within(screenCopy).getByRole("link", { name: "See the Builds →" })).toBeInTheDocument();
    expect(within(screenCopy).getByText(/Builds across five countries/)).toBeInTheDocument();
  });
  it("renders the selected-work grid with all eight products and the CTA", () => {
    render(<WorkPage />);
    const section = screen.getByTestId("work-projects-section");
    expect(
      within(section).getByRole("heading", { name: "Built for Real Problems." }),
    ).toBeInTheDocument();
    expect(within(section).getAllByTestId("work-project-card")).toHaveLength(8);
    expect(within(section).getByText("Lylux Custom CRM")).toBeInTheDocument();
    expect(within(section).getByText("E&S Decorations Website")).toBeInTheDocument();
    expect(screen.getByTestId("cta-section")).toBeInTheDocument();
    expect(within(section).getByRole("button", { name: "All" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
  });

  it("renders Section 2 with the same full-width top boundary pattern as the other curved sections", () => {
    render(<WorkPage />);
    const section = screen.getByTestId("work-projects-section");

    expect(within(section).getByTestId("work-projects-surface")).toBeInTheDocument();
    expect(within(section).getByTestId("work-projects-boundary-top")).toBeInTheDocument();
    expect(section.querySelector('[data-testid="work-projects-top-curve"]')).toBeNull();
  });
  it("uses the highest image quality and top-aligns the first six project images", () => {
    render(<WorkPage />);
    const cards = screen
      .getByTestId("work-projects-section")
      .querySelectorAll<HTMLElement>('[data-testid="work-project-card"]');

    expect(cards).toHaveLength(8);
    cards.forEach((card, index) => {
      const image = within(card).getByRole("img");
      expect(image).toHaveAttribute("data-image-quality", "100");
      expect(image).toHaveAttribute("data-image-position", index < 6 ? "top" : "center");
    });
  });

  it("filters projects by one category without changing the section shell", async () => {
    const user = userEvent.setup();
    render(<WorkPage />);
    const section = screen.getByTestId("work-projects-section");
    await user.click(within(section).getByRole("button", { name: "AI Automation" }));
    expect(within(section).getAllByTestId("work-project-card")).toHaveLength(2);
    expect(within(section).getByText("Sales Outreach Agent")).toBeInTheDocument();
    expect(within(section).getByText("Product Configuration Platform")).toBeInTheDocument();
    expect(within(section).queryByText("Lylux Custom CRM")).not.toBeInTheDocument();
    expect(within(section).getByRole("button", { name: "AI Automation" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    expect(within(section).getByRole("button", { name: "All" })).toHaveAttribute(
      "aria-pressed",
      "false",
    );
  });
});
