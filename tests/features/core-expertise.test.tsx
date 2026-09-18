import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { CoreExpertiseSection } from "@/features/services/core-expertise/CoreExpertiseSection";

describe("CoreExpertiseSection", () => {
  it("renders the software development category with four capability cards", () => {
    render(<CoreExpertiseSection />);

    expect(screen.getByTestId("core-expertise-section")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Software Development" })).toBeInTheDocument();
    expect(screen.getAllByTestId("core-expertise-card")).toHaveLength(4);
    expect(
      screen.getByRole("link", { name: "Explore Custom Software Builds →" }),
    ).toBeInTheDocument();
  });

  it("switches the category in one click and updates its content", async () => {
    const user = userEvent.setup();

    render(<CoreExpertiseSection />);
    await user.click(screen.getByRole("button", { name: "Mobile App Development" }));

    expect(screen.getByRole("heading", { name: "Mobile App Development" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "See our mobile app work →" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Mobile App Development" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    expect(screen.getAllByTestId("core-expertise-card")).toHaveLength(4);
  });
});
