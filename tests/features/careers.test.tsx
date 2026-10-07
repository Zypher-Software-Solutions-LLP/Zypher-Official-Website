import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import CareersPage from "@/app/(marketing)/careers/page";

describe("Careers page", () => {
  it("should render the careers copy, image treatment, and application mail link", () => {
    render(<CareersPage />);

    const hero = screen.getByTestId("careers-hero");

    expect(
      within(hero).getByRole("heading", {
        level: 1,
        name: "No open roles right now. But the right person does not wait for a listing.",
      }),
    ).toBeInTheDocument();
    expect(
      within(hero).getByText(
        "We’re a small team that grows slowly and carefully. When we bring in someone it’s because we found someone who fits. If you think that’s you, tell us.",
      ),
    ).toBeInTheDocument();
    expect(within(hero).getByRole("heading", { name: "Join us?" })).toBeInTheDocument();
    expect(within(hero).getByRole("link", { name: "Send Your Application" })).toHaveAttribute(
      "href",
      "mailto:info@zypher-solutions.com?subject=Career%20Application%20-%20Zypher",
    );
    expect(screen.getByTestId("careers-hero-background")).toHaveAttribute(
      "data-image-src",
      "https://media.zypher-solutions.com/home-page/section-1/Background%20-%20Hero%20section.webp",
    );
    expect(screen.getByTestId("careers-hero-join-title")).toHaveAttribute(
      "data-image-src",
      "https://media.zypher-solutions.com/careers-page/Careers.webp",
    );
  });
});
