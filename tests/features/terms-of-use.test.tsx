import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import TermsOfUsePage from "@/app/(marketing)/terms-of-service/page";

describe("terms of use page", () => {
  it("renders the legal hero and all supplied Terms of Use sections", () => {
    render(<TermsOfUsePage />);

    expect(screen.getByTestId("terms-of-use-hero")).toBeInTheDocument();
    expect(screen.getByText("Legal")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Terms of Use" })).toBeInTheDocument();
    expect(screen.getByText("The terms governing use of the Zypher website.")).toBeInTheDocument();

    const reader = screen.getByTestId("terms-of-use-reader");
    expect(within(reader).getAllByRole("heading", { level: 2 })).toHaveLength(19);
    expect(
      within(reader).getByRole("heading", { name: "Information You Submit" }),
    ).toBeInTheDocument();
    expect(
      within(reader).getByRole("heading", { name: "Governing Law and Dispute Resolution" }),
    ).toBeInTheDocument();
    expect(within(reader).getByText("Last Updated Date")).toBeInTheDocument();
  });

  it("renders the Terms of Use section index with the supplied content", () => {
    const { getByTestId } = render(<TermsOfUsePage />);

    const index = getByTestId("terms-of-use-index");
    expect(
      within(index).getByRole("navigation", { name: "Terms of Use sections" }),
    ).toBeInTheDocument();
    expect(within(index).getByText("19")).toBeInTheDocument();
    expect(
      screen.getByText(
        "If Website content conflicts with a signed agreement, the signed agreement will govern.",
      ),
    ).toBeInTheDocument();
  });
});
