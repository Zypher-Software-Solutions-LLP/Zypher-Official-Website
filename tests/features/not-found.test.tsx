import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import NotFound from "@/app/not-found";

vi.mock("next/navigation", () => ({
  usePathname: () => "/missing-page",
}));

describe("not-found page", () => {
  it("should render the shared navigation and footer around the 404 experience", () => {
    render(<NotFound />);

    expect(screen.getByTestId("site-header")).toBeInTheDocument();
    expect(screen.getByTestId("not-found-page")).toBeInTheDocument();
    expect(screen.getByTestId("site-footer")).toBeInTheDocument();
  });

  it("should render the Figma 404 copy and layered illustration without a CTA", () => {
    render(<NotFound />);

    expect(screen.getByRole("heading", { name: "UH OH!" })).toBeInTheDocument();
    expect(
      screen.getByText(
        "Looks like this page caught the wrong wind. It’s not here anymore, or maybe it never was.",
      ),
    ).toBeInTheDocument();
    expect(screen.getByTestId("not-found-background-illustration")).toHaveAttribute(
      "data-image-src",
      "https://media.zypher-solutions.com/404-page/404%20Illustration.png",
    );
    expect(screen.getByTestId("not-found-image-overlay")).toHaveAttribute("aria-hidden", "true");
    expect(screen.getByTestId("not-found-number")).toHaveTextContent("404");
    expect(screen.getByTestId("not-found-number-core")).toHaveTextContent("404");
    expect(screen.getByTestId("not-found-number-glow")).toHaveTextContent("404");
    expect(screen.getByRole("link", { name: "Go Back Home" })).toHaveAttribute("href", "/");
  });
});
