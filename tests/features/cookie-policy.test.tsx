import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import CookiePolicyPage from "@/app/(marketing)/cookie-policy/page";

describe("cookie policy page", () => {
  it("renders the legal hero and all supplied Cookie Policy sections", () => {
    render(<CookiePolicyPage />);

    expect(screen.getByTestId("cookie-policy-hero")).toBeInTheDocument();
    expect(screen.getByText("Legal")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Cookie Policy" })).toBeInTheDocument();
    expect(
      screen.getByText("How cookies and optional analytics are used on the Zypher website."),
    ).toBeInTheDocument();

    const reader = screen.getByTestId("cookie-policy-reader");
    expect(within(reader).getAllByRole("heading", { level: 2 })).toHaveLength(11);
    expect(
      within(reader).getByRole("heading", { name: "Types of Cookies We Use" }),
    ).toBeInTheDocument();
    expect(
      within(reader).getByRole("heading", { name: "Your Cookie Choices" }),
    ).toBeInTheDocument();
    expect(within(reader).getByText("Last Updated Date")).toBeInTheDocument();
  });

  it("renders cookie choice subsections and the contact details", () => {
    render(<CookiePolicyPage />);

    const reader = screen.getByTestId("cookie-policy-reader");
    expect(within(reader).getByRole("heading", { name: "Necessary Cookies" })).toBeInTheDocument();
    expect(
      within(reader).getByRole("heading", { name: "Analytics and Performance Cookies" }),
    ).toBeInTheDocument();
    expect(
      within(reader).getByText("Google Chrome: chrome://settings/cookies"),
    ).toBeInTheDocument();
    expect(within(reader).getByText("Email: info@zypher-solutions.com")).toBeInTheDocument();
  });
});
