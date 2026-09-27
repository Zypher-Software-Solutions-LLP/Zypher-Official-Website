import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ScaleTestimonialsSection } from "@/features/scale/ScaleTestimonialsSection";

const testimonialNames = [
  "Divin Siby",
  "Kenzy Attia",
  "Andrew Kong",
  "Muhammed Shuhaib",
  "Bharat Kaistha",
  "Umair Moideen",
  "Shaji Parakandi",
];

describe("scale testimonials section", () => {
  it("should render all supplied testimonials in the primary track", () => {
    render(<ScaleTestimonialsSection />);

    expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent(
      "Heard it from us. Now hear it from them.",
    );
    expect(screen.getByTestId("scale-testimonials-title-accent")).toHaveTextContent("from them.");
    expect(
      screen
        .getByTestId("scale-testimonials-section")
        .querySelector('[class*="scaleTestimonialsTopCurve"]'),
    ).toBeNull();

    const primaryTrack = screen.getByTestId("scale-testimonials-primary-track");
    expect(primaryTrack.querySelectorAll('[data-testid="scale-testimonial-card"]')).toHaveLength(7);

    for (const name of testimonialNames) {
      expect(primaryTrack).toHaveTextContent(name);
    }

    expect(primaryTrack).not.toHaveTextContent("Kenzi Attia");
    expect(primaryTrack).toHaveTextContent(
      "Zypher delivered a site we're proud to send clients to.",
    );
    expect(
      primaryTrack.querySelector(
        '[data-image-src="https://media.zypher-solutions.com/scale-page/section-5/Umair%20Moideen.jpeg"]',
      ),
    ).not.toBeNull();
  });

  it("should provide an aria-hidden duplicate track for the seamless loop", () => {
    render(<ScaleTestimonialsSection />);

    const duplicateTrack = screen.getByTestId("scale-testimonials-duplicate-track");
    expect(duplicateTrack).toHaveAttribute("aria-hidden", "true");
    expect(duplicateTrack.querySelectorAll('[data-testid="scale-testimonial-card"]')).toHaveLength(
      7,
    );
  });
});
