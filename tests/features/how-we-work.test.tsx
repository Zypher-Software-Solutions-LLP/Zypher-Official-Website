import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { HomePage } from "@/features/home/HomePage";

describe("homepage how we work section", () => {
  it("should render every work panel in the requested content order", () => {
    render(<HomePage />);

    const section = screen.getByTestId("how-we-work-section");
    const panels = Array.from(
      section.querySelectorAll<HTMLElement>('[data-testid^="how-we-work-panel-"]'),
    );

    expect(within(section).getByRole("heading", { level: 2, name: "HOW WE WORK" })).toBeVisible();
    expect(panels).toHaveLength(6);
    expect(
      panels.map((panel) => within(panel).getByRole("heading", { level: 3 }).textContent),
    ).toEqual([
      "A Conversation, not a pitch",
      "Fixed scope & price before you commit to anything.",
      "Built from scratch",
      "Customized on existing platforms",
      "Automated & AI-Integrated",
      "Launch & Stay on",
    ]);

    expect(within(section).getAllByTestId("how-we-work-icon")).toHaveLength(6);
    expect(within(section).getAllByTestId("how-we-work-image")).toHaveLength(6);
  });

  it("should activate a selected top-level step and its nested build substep", async () => {
    const user = userEvent.setup();
    render(<HomePage />);

    const section = screen.getByTestId("how-we-work-section");
    const rail = within(section).getByTestId("how-we-work-rail");
    const scopeButton = within(rail).getByRole("button", { name: "Scope & Quote" });

    await user.click(scopeButton);

    expect(scopeButton).toHaveAttribute("aria-current", "true");
    expect(within(section).getByTestId("how-we-work-panel-scope-quote")).toHaveAttribute(
      "data-active",
      "true",
    );

    const buildButton = within(rail).getByRole("button", { name: "Build" });
    await user.click(buildButton);

    const nestedButton = within(rail).getByRole("button", {
      name: "Built from scratch",
    });
    await user.click(nestedButton);

    expect(buildButton).toHaveAttribute("aria-current", "true");
    expect(nestedButton).toHaveAttribute("aria-current", "true");
    expect(within(section).getByTestId("how-we-work-panel-built-from-scratch")).toHaveAttribute(
      "data-active",
      "true",
    );
  });

  it("should keep the clicked panel active while smooth scrolling settles", async () => {
    const user = userEvent.setup();
    render(<HomePage />);

    const section = screen.getByTestId("how-we-work-section");
    const panels = Array.from(
      section.querySelectorAll<HTMLElement>('[data-testid^="how-we-work-panel-"]'),
    );
    const rail = within(section).getByTestId("how-we-work-rail");
    const scopeButton = within(rail).getByRole("button", { name: "Scope & Quote" });
    const originalInnerHeight = window.innerHeight;
    let panelAtAnchor = "discover";

    Object.defineProperty(window, "innerHeight", { configurable: true, value: 1_000 });
    const panelRectSpies = panels.map((panel) =>
      vi.spyOn(panel, "getBoundingClientRect").mockImplementation(() => {
        const isAtAnchor = panel.id === `how-we-work-panel-${panelAtAnchor}`;
        const top = isAtAnchor ? 250 : 1_100;

        return {
          bottom: isAtAnchor ? 750 : 1_500,
          height: isAtAnchor ? 500 : 400,
          left: 0,
          right: 400,
          top,
          width: 400,
          x: 0,
          y: top,
        } as DOMRect;
      }),
    );

    try {
      await user.click(scopeButton);
      expect(scopeButton).toHaveAttribute("aria-current", "true");

      window.dispatchEvent(new Event("scroll"));
      await new Promise<void>((resolve) => window.setTimeout(resolve, 50));
      expect(scopeButton).toHaveAttribute("aria-current", "true");

      panelAtAnchor = "scope-quote";
      window.dispatchEvent(new Event("scroll"));
      await new Promise<void>((resolve) => window.setTimeout(resolve, 50));
      expect(scopeButton).toHaveAttribute("aria-current", "true");
    } finally {
      Object.defineProperty(window, "innerHeight", {
        configurable: true,
        value: originalInnerHeight,
      });
      panelRectSpies.forEach((spy) => spy.mockRestore());
    }
  });
  it("should update the active step from the panel at the viewport anchor", async () => {
    render(<HomePage />);

    const section = screen.getByTestId("how-we-work-section");
    const panels = Array.from(
      section.querySelectorAll<HTMLElement>('[data-testid^="how-we-work-panel-"]'),
    );
    const rail = within(section).getByTestId("how-we-work-rail");
    const originalInnerHeight = window.innerHeight;
    let panelAtAnchor = "discover";

    Object.defineProperty(window, "innerHeight", { configurable: true, value: 1_000 });
    const panelRectSpies = panels.map((panel) =>
      vi.spyOn(panel, "getBoundingClientRect").mockImplementation(() => {
        const isAtAnchor = panel.id === `how-we-work-panel-${panelAtAnchor}`;
        const top = isAtAnchor ? 250 : 1_100;

        return {
          bottom: isAtAnchor ? 750 : 1_500,
          height: isAtAnchor ? 500 : 400,
          left: 0,
          right: 400,
          top,
          width: 400,
          x: 0,
          y: top,
        } as DOMRect;
      }),
    );

    try {
      panelAtAnchor = "scope-quote";
      window.dispatchEvent(new Event("scroll"));

      await waitFor(() => {
        expect(within(rail).getByRole("button", { name: "Scope & Quote" })).toHaveAttribute(
          "aria-current",
          "true",
        );
      });
    } finally {
      Object.defineProperty(window, "innerHeight", {
        configurable: true,
        value: originalInnerHeight,
      });
      panelRectSpies.forEach((spy) => spy.mockRestore());
    }
  });
});
