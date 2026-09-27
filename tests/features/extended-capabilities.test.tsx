import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { ExtendedCapabilitiesSection } from "@/features/services/extended-capabilities/ExtendedCapabilitiesSection";

describe("ExtendedCapabilitiesSection", () => {
  it("renders the active cybersecurity capability with all three deliverables", () => {
    render(<ExtendedCapabilitiesSection />);

    const section = screen.getByTestId("extended-capabilities-section");
    const frame = screen.getByTestId("extended-capabilities-frame");
    const controls = within(screen.getByTestId("extended-capability-controls"));
    const frameContent = within(frame);

    expect(screen.getByRole("heading", { name: "Extended Capabilities" })).toBeInTheDocument();
    expect(controls.getAllByRole("button")).toHaveLength(5);
    expect(frameContent.getByRole("heading", { name: "Cybersecurity" })).toBeInTheDocument();
    expect(frameContent.getAllByTestId("extended-capability-deliverable")).toHaveLength(3);
    expect(frameContent.getByRole("link", { name: "Get In Touch →" })).toHaveAttribute(
      "href",
      "/contact",
    );
    expect(screen.queryByText("Beyond development.")).not.toBeInTheDocument();
    expect(section.textContent).not.toContain("—");
  });

  it("switches the active capability and updates its image and content", async () => {
    const user = userEvent.setup();

    render(<ExtendedCapabilitiesSection />);
    const frame = screen.getByTestId("extended-capabilities-frame");
    const frameContent = within(frame);

    await user.click(
      within(screen.getByTestId("extended-capability-controls")).getByRole("button", {
        name: "Digital Marketing",
      }),
    );

    expect(frameContent.getByRole("heading", { name: "Digital Marketing" })).toBeInTheDocument();
    expect(
      within(screen.getByTestId("extended-capability-controls")).getByRole("button", {
        name: "Digital Marketing",
      }),
    ).toHaveAttribute("aria-pressed", "true");
    expect(
      within(screen.getByTestId("extended-capability-controls")).getByRole("button", {
        name: "Cybersecurity",
      }),
    ).toHaveAttribute("aria-pressed", "false");
    expect(frameContent.getByTestId("extended-capability-image")).toHaveAttribute(
      "alt",
      "Digital Marketing capability",
    );
    expect(frameContent.getByRole("link", { name: "Get In Touch →" })).toBeInTheDocument();
  });

  it("provides an in-place mobile accordion for reading each capability", async () => {
    const user = userEvent.setup();
    const { getByTestId } = render(<ExtendedCapabilitiesSection />);
    const accordion = getByTestId("extended-capabilities-mobile-accordion");

    expect(within(accordion).getAllByRole("button")).toHaveLength(5);
    expect(within(accordion).getByRole("heading", { name: "Cybersecurity" })).toBeInTheDocument();

    await user.click(
      within(accordion).getByRole("button", { name: "Data Analytics & Data Science" }),
    );

    expect(
      within(accordion).getByRole("heading", { name: "Data Analytics & Data Science" }),
    ).toBeInTheDocument();
    expect(within(accordion).getAllByTestId("extended-capability-mobile-deliverable")).toHaveLength(
      3,
    );
  });
});
