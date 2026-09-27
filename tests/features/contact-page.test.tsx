import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import ContactPage from "@/app/(marketing)/contact/page";

const contactSocialLinks = [
  "#",
  "https://x.com/ZyphersSolution",
  "https://www.instagram.com/zyphersolutions/",
  "https://www.linkedin.com/company/zypher-solutions/",
  "https://wa.me/918075725045",
];

describe("contact page", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("should render the Cal booking embed on the right side of the contact hero", () => {
    render(<ContactPage />);

    const hero = screen.getByTestId("contact-hero");
    expect(hero).toHaveAttribute("data-layout", "12-column");
    expect(
      within(hero).getByRole("heading", {
        name: "Tell us what you’re building. We’ll take it from there.",
      }),
    ).toBeInTheDocument();
    expect(within(hero).getByTestId("contact-hero-illustration")).toHaveAttribute(
      "data-image-src",
      "https://media.zypher-solutions.com/contact-us/section-1/3d%20Illustration.png",
    );
    expect(within(hero).getByTestId("contact-hero-illustration")).toHaveAttribute(
      "data-rotation",
      "-8.17deg",
    );
    const bookingWidget = within(hero).getByTestId("contact-hero-cal-widget");
    expect(bookingWidget).toHaveAttribute("id", "my-cal-inline-30-minute-discovery-call");
    expect(bookingWidget).toHaveAttribute("aria-label", "Schedule a 30-minute discovery call");
    const calScript = document.querySelector("script#cal-inline-30-minute-discovery-call");
    expect(calScript).toBeInTheDocument();
    expect(
      document.querySelector(`link[rel="preconnect"][href="https://app.cal.com"]`),
    ).toBeInTheDocument();
    expect(
      document.querySelector(`link[rel="preload"][href="https://app.cal.com/embed/embed.js"]`),
    ).toBeInTheDocument();
    expect(calScript?.textContent).toContain("zypher-solutions/30-minute-discovery-call");
    expect(calScript?.textContent).toContain('layout: "month_view"');
    expect(calScript?.textContent).toContain("hideEventTypeDetails: true");
    expect(
      within(hero).getByText(
        (_, element) => element?.textContent === "Prefer to write it out first? Use the Form Below",
      ),
    ).toBeInTheDocument();
    expect(within(hero).getByText("Form Below").className).toContain("contactHeroFormPromptAccent");
    expect(within(hero).getByTestId("contact-hero-illustration")).toHaveAttribute(
      "data-image-quality",
      "100",
    );
  });

  it("should link the email, phone, and verified social destinations", () => {
    render(<ContactPage />);

    const hero = screen.getByTestId("contact-hero");
    expect(within(hero).getByRole("link", { name: "info@zypher-solutions.com" })).toHaveAttribute(
      "href",
      "mailto:info@zypher-solutions.com",
    );
    expect(within(hero).getByRole("link", { name: "+91 80757 25045" })).toHaveAttribute(
      "href",
      "tel:+918075725045",
    );

    const socialLinks = within(hero).getByRole("group", { name: "Find us here as well" });
    expect(within(socialLinks).getAllByRole("link")).toHaveLength(contactSocialLinks.length);
    const renderedSocialLinks = within(socialLinks).getAllByRole("link");
    expect(renderedSocialLinks.map((link) => link.getAttribute("href"))).toEqual(
      expect.arrayContaining(contactSocialLinks),
    );
  });

  it("should render the contact inquiry form with every service and budget option", () => {
    render(<ContactPage />);

    const section = screen.getByTestId("contact-inquiry-section");
    expect(
      within(section).getByRole("heading", {
        name: "What are you trying to build or fix?",
      }),
    ).toBeInTheDocument();
    expect(within(section).getByRole("combobox", { name: "Service Interest" })).toHaveValue("");
    expect(within(section).getByRole("combobox", { name: "Budget Range" })).toHaveValue("");
    expect(
      within(section).getByRole("option", { name: "Software Development" }),
    ).toBeInTheDocument();
    expect(
      within(section).getByRole("option", { name: "Cloud & Infrastructure" }),
    ).toBeInTheDocument();
    expect(within(section).getByRole("option", { name: "5,00,000 and above" })).toBeInTheDocument();
    expect(within(section).getByRole("button", { name: "Submit Form" })).toBeInTheDocument();
    expect(within(section).queryByRole("checkbox")).not.toBeInTheDocument();
    expect(within(section).queryByText(/spam protection is enabled/i)).not.toBeInTheDocument();

    const countrySelector = within(section).getByRole("combobox", { name: "Phone country" });
    expect(countrySelector).toHaveValue("india");
    expect(within(section).getByTestId("phone-country-flag")).toHaveAttribute(
      "data-country-code",
      "in",
    );
    expect(within(section).getByTestId("phone-country-prefix")).toHaveTextContent("+91");
    expect(within(section).getByTestId("budget-control")).toHaveTextContent("₹");
    expect(within(section).getByRole("textbox", { name: "Name" })).toHaveAttribute(
      "placeholder",
      "John Doe",
    );
    expect(within(section).getByRole("textbox", { name: "Name" })).toHaveAttribute(
      "minlength",
      "2",
    );
    expect(within(section).getByRole("textbox", { name: "Company" })).toHaveAttribute(
      "minlength",
      "2",
    );
    expect(within(section).getByRole("textbox", { name: "Phone number" })).toHaveAttribute(
      "minlength",
      "5",
    );
    expect(within(section).getByRole("textbox", { name: "Message" })).toHaveAttribute(
      "placeholder",
      "Your Message...",
    );
    expect(within(section).getByRole("link", { name: "WhatsApp Us" })).toHaveAttribute(
      "href",
      "https://wa.me/918075725045",
    );
  });

  it("should clear submitted selections and show confirmation after delivery succeeds", async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true });
    vi.stubGlobal("fetch", fetchMock);

    render(<ContactPage />);

    const section = screen.getByTestId("contact-inquiry-section");
    fireEvent.change(within(section).getByRole("textbox", { name: "Name" }), {
      target: { value: "Hank Nixon" },
    });
    fireEvent.change(within(section).getByRole("textbox", { name: "Email" }), {
      target: { value: "hank@example.com" },
    });
    fireEvent.change(within(section).getByRole("combobox", { name: "Service Interest" }), {
      target: { value: "Software Development" },
    });
    fireEvent.change(within(section).getByRole("combobox", { name: "Budget Range" }), {
      target: { value: "Under 30000 INR" },
    });
    fireEvent.change(within(section).getByRole("textbox", { name: "Message" }), {
      target: { value: "I would like to discuss a tailored software project for our team." },
    });
    fireEvent.submit(within(section).getByRole("button", { name: "Submit Form" }).closest("form")!);

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith(
        "/api/contact",
        expect.objectContaining({ method: "POST" }),
      );
    });
    await waitFor(() => {
      expect(within(section).getByRole("combobox", { name: "Service Interest" })).toHaveValue("");
      expect(within(section).getByRole("combobox", { name: "Budget Range" })).toHaveValue("");
    });
    expect(
      within(section).getByText("Thanks, your message has been sent. We will be in touch soon."),
    ).toBeInTheDocument();
  });

  it("should disable production submission when Turnstile is not configured", () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("NEXT_PUBLIC_TURNSTILE_SITE_KEY", "");

    render(<ContactPage />);

    const section = screen.getByTestId("contact-inquiry-section");
    expect(
      within(section).getByText(
        "Spam protection is temporarily unavailable. Please try again later.",
      ),
    ).toBeInTheDocument();
    expect(within(section).getByRole("button", { name: "Submit Form" })).toBeDisabled();
  });

  it("should render the contact process steps and office map", () => {
    render(<ContactPage />);

    const section = screen.getByTestId("contact-process-section");
    expect(section).toHaveAttribute("data-layout", "12-column");
    expect(
      within(section).getByRole("heading", {
        name: "What happens after you hit send?",
      }),
    ).toBeInTheDocument();
    expect(within(section).getByTestId("contact-process-step-01")).toHaveAttribute(
      "data-active",
      "true",
    );
    expect(within(section).getByText("We read it, Within 24 Hours")).toBeInTheDocument();
    expect(within(section).getByText("If it’s a fit, we schedule a call")).toBeInTheDocument();
    expect(within(section).getByText("If it’s not a fit, we’ll tell you")).toBeInTheDocument();

    expect(within(section).getByTitle("Work Well Coworking office location map")).toHaveAttribute(
      "src",
      "https://www.google.com/maps?q=WORK%20WELL%20COWORKING&output=embed",
    );
  });

  it("should not render an extra process-section ellipse", () => {
    render(<ContactPage />);

    const section = screen.getByTestId("contact-process-section");
    expect(section.querySelectorAll("[class*='contactProcessTopCurve']")).toHaveLength(0);
  });
});
