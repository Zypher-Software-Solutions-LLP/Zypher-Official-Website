import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { HomePage } from "@/features/home/HomePage";

describe("homepage hero", () => {
  it("should render the approved headline and supporting copy", () => {
    render(<HomePage />);

    expect(
      screen.getByRole("heading", {
        level: 1,
        name: "Solutions that move the way your business already does",
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "No templates, no bolt-on features you'll never touch, just systems shaped around how you actually work, built by a team that stays in the room after launch.",
      ),
    ).toBeInTheDocument();
  });

  it("should route the hero calls to action to contact and work", () => {
    render(<HomePage />);

    expect(screen.getByRole("link", { name: "Book a Discovery Call" })).toHaveAttribute(
      "href",
      "/contact",
    );
    expect(screen.getByRole("link", { name: "See Our Work" })).toHaveAttribute("href", "/work");
    expect(screen.getByTestId("hero-background")).toHaveAttribute(
      "data-layer",
      "background-illustration",
    );
    expect(screen.getByTestId("hero-background")).toHaveAttribute("data-opacity", "0.13");
    expect(screen.getByTestId("hero-subject")).toHaveAttribute("data-position", "anchored");
    expect(screen.getByTestId("hero-subject")).toHaveAttribute("data-opacity", "0.4");
    expect(screen.getByTestId("hero-grid-overlay")).toHaveAttribute("data-position", "top-left");
  });
});

describe("homepage scale section", () => {
  it("should render the approved scale metrics and project controls", () => {
    render(<HomePage />);

    expect(
      screen.getByRole("heading", {
        level: 2,
        name: "TRUSTED BY TEAMS AT EVERY SCALE",
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 3, name: "25+ Projects Delivered" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 3, name: "20+ Clients Served" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 3, name: "Across 10+ Countries" }),
    ).toBeInTheDocument();
    expect(screen.getAllByTestId("scale-project-card")).toHaveLength(3);
    expect(screen.getByRole("link", { name: "View All Works" })).toHaveAttribute("href", "/work");

    const scaleSection = screen.getByTestId("scale-section");
    const projectControls = within(scaleSection).getAllByRole("button", { name: /projects/i });
    expect(projectControls).toHaveLength(2);
    expect(projectControls.every((button) => (button as HTMLButtonElement).disabled)).toBe(true);
  });

  it("should render every supplied client logo in the marquee", () => {
    render(<HomePage />);

    expect(screen.getAllByTestId("scale-client-logo")).toHaveLength(10);
    expect(screen.getByRole("img", { name: "DiViSe client logo" })).toBeInTheDocument();
    expect(screen.getByRole("img", { name: "SecureThread OPS client logo" })).toBeInTheDocument();
  });

  it("should render clickable project cards with the approved content", () => {
    render(<HomePage />);

    expect(screen.getAllByTestId("scale-project-card")).toHaveLength(3);
    expect(screen.getByRole("link", { name: /Custom CRM/ })).toHaveAttribute("href", "/work");
    expect(screen.getByRole("link", { name: /VMS - Platform/ })).toHaveAttribute("href", "/work");
    expect(screen.getByRole("link", { name: /Rental System/ })).toHaveAttribute("href", "/work");
    expect(
      screen.getByText(
        "A custom CRM connecting one client's business end-to-end, with automation replacing manual work.",
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "A cybersecurity platform catching vulnerabilities before they become incidents.",
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText("A rental platform that gave a two-branch business one place to run both."),
    ).toBeInTheDocument();
  });
  it("should open the first execution gap item by default", () => {
    render(<HomePage />);

    const section = screen.getByTestId("execution-gap-section");
    const accordionButtons = within(section).getAllByRole("button", {
      name: /average|scope|automation|support/i,
    });

    expect(section).toBeInTheDocument();
    expect(accordionButtons).toHaveLength(4);
    expect(accordionButtons[0]).toHaveAttribute("aria-expanded", "true");
    expect(accordionButtons[1]).toHaveAttribute("aria-expanded", "false");
    expect(screen.getByText(/Most software is built for the average customer/)).toBeVisible();
    expect(screen.getByTestId("execution-gap-image")).toHaveAttribute(
      "data-image-src",
      expect.stringContaining("Problem%20-%201.png"),
    );
  });

  it("should switch the active problem and image when an accordion item is selected", async () => {
    const user = userEvent.setup();
    render(<HomePage />);

    const section = screen.getByTestId("execution-gap-section");
    const accordionButtons = within(section).getAllByRole("button", {
      name: /average|scope|automation|support/i,
    });
    await user.click(accordionButtons[1]);

    expect(accordionButtons[0]).toHaveAttribute("aria-expanded", "false");
    expect(accordionButtons[1]).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByText(/Scope and price are fixed before work starts/)).toBeVisible();
    expect(screen.getByTestId("execution-gap-image")).toHaveAttribute(
      "data-image-src",
      expect.stringContaining("Problem%20-%202.png"),
    );
  });
});

describe("homepage solutions section", () => {
  it("should render the four solution cards with the supplied content and assets", () => {
    render(<HomePage />);

    const section = screen.getByRole("region", {
      name: /Why Zypher is different from Everyone else you.?ve worked with/i,
    });
    const cards = screen.getAllByTestId("solution-card");

    const title = screen.getByRole("heading", {
      level: 2,
      name: /Why Zypher is different from Everyone else you.?ve worked with/i,
    });
    const titleSpans = title.querySelectorAll(":scope > span");

    expect(titleSpans).toHaveLength(2);
    expect(titleSpans[0]).toHaveAttribute("data-testid", "solutions-title-accent");
    expect(titleSpans[0]).toHaveTextContent("Why Zypher is different");
    expect(titleSpans[0]).not.toHaveTextContent("from");
    expect(titleSpans[1]).toHaveAttribute("data-testid", "solutions-title-rest");
    expect(titleSpans[1]).toHaveTextContent(/from Everyone else you.?ve worked with/);

    expect(section).toHaveAttribute("data-testid", "solutions-section");
    expect(cards).toHaveLength(4);
    expect(cards.map((card) => card.getAttribute("data-card-number"))).toEqual([
      "/01",
      "/02",
      "/03",
      "/04",
    ]);
    expect(screen.getByRole("link", { name: /About Zypher/ })).toHaveAttribute("href", "/about");
    expect(screen.getByText("You own everything you pay for")).toBeInTheDocument();
    expect(screen.getByText("Direct line to the people building it")).toBeInTheDocument();
    expect(
      screen.getByText("Whatever stack actually fits, not whatever we default to"),
    ).toBeInTheDocument();
    expect(screen.getByText("A.I Where it earns its place, not everywhere")).toBeInTheDocument();

    cards.forEach((card, index) => {
      expect(card.querySelector("img")).toHaveAttribute(
        "data-image-src",
        expect.stringContaining("Solution%20-%20" + (index + 1) + ".png"),
      );
    });
  });
});
