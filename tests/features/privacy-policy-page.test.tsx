import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import PrivacyPolicyPage from "@/app/(marketing)/privacy-policy/page";

describe("privacy policy page", () => {
  it("renders the legal hero and all policy sections from the supplied policy copy", () => {
    render(<PrivacyPolicyPage />);

    expect(screen.getByTestId("privacy-policy-hero")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Privacy Policy" })).toBeInTheDocument();
    expect(
      screen.getByText(
        "Your privacy matters. Here’s how we collect, use, protect, and handle your information at Zypher.",
      ),
    ).toBeInTheDocument();

    const reader = screen.getByTestId("privacy-policy-reader");
    expect(within(reader).getAllByRole("heading", { level: 2 })).toHaveLength(14);
    expect(
      within(reader).getByRole("heading", { name: "Information We Collect" }),
    ).toBeInTheDocument();
    expect(
      within(reader).getByRole("heading", { name: "Contact and Grievance Officer" }),
    ).toBeInTheDocument();
    expect(
      within(reader).getByText("We do not sell or rent personal information."),
    ).toBeInTheDocument();
    expect(within(reader).getAllByText("Email: info@zypher-solutions.com")).toHaveLength(2);
  });

  it("renders a static section index and last-updated date alongside the policy body", () => {
    render(<PrivacyPolicyPage />);

    const index = screen.getByTestId("privacy-policy-index");
    expect(
      within(index).getByRole("navigation", { name: "Privacy policy sections" }),
    ).toBeInTheDocument();
    expect(within(index).getByText("Last Updated")).toBeInTheDocument();
    expect(within(index).getByText("10 September 2026")).toBeInTheDocument();
    expect(screen.getByTestId("privacy-policy-body")).toHaveAttribute("tabindex", "0");
  });
});
