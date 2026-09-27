import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Header } from "@/components/layout/Header";

vi.mock("next/navigation", () => ({
  usePathname: () => "/",
}));

describe("site header", () => {
  it("should expose the brand home link, primary navigation, services submenu, and contact CTA", () => {
    render(<Header />);

    expect(screen.getByRole("banner")).toHaveAttribute("data-variant", "compact");
    expect(screen.getByRole("banner")).toHaveAttribute("data-width", "responsive");
    expect(screen.getByRole("link", { name: "Zypher Software Solutions home" })).toHaveAttribute(
      "href",
      "/",
    );

    const primaryNavigation = screen.getByRole("navigation", { name: "Primary navigation" });
    expect(primaryNavigation).toHaveTextContent("Services");
    expect(primaryNavigation).toHaveTextContent("Work");
    expect(primaryNavigation).toHaveTextContent("Scale");
    expect(primaryNavigation).toHaveTextContent("About");
    expect(primaryNavigation).toHaveTextContent("Blog");
    expect(within(primaryNavigation).getByRole("link", { name: "Services" })).toHaveAttribute(
      "href",
      "/services",
    );

    const servicesSubmenu = within(primaryNavigation).getByTestId("site-header-services-submenu");
    expect(within(servicesSubmenu).getAllByRole("link")).toHaveLength(5);
    expect(
      within(servicesSubmenu).getByRole("link", { name: "Design & Creative" }),
    ).toHaveAttribute("href", "/services/design-creative");
    expect(
      within(servicesSubmenu).getByRole("link", { name: "CRM/ERP Solutions" }),
    ).toHaveAttribute("href", "/services/crm-erp-solutions");

    expect(screen.getByRole("link", { name: "Contact Us" })).toHaveAttribute("href", "/contact");
  });

  it("should expose an accessible collapsed services accordion in the mobile navigation", async () => {
    const user = userEvent.setup();
    render(<Header />);

    await user.click(screen.getByRole("button", { name: "Open navigation menu" }));

    const mobileNavigation = screen.getByRole("navigation", { name: "Mobile navigation" });
    const servicesToggle = within(mobileNavigation).getByRole("button", { name: "Services" });
    const servicesSubmenu = within(mobileNavigation).getByTestId(
      "site-header-mobile-services-submenu",
    );

    expect(servicesToggle).toHaveAttribute("aria-controls", "mobile-services-submenu");
    expect(servicesToggle).toHaveAttribute("aria-expanded", "false");
    expect(servicesSubmenu).toHaveAttribute("aria-hidden", "true");
    expect(() => within(servicesSubmenu).getByRole("link", { name: "All Services" })).toThrow();

    servicesToggle.focus();
    await user.keyboard("{Enter}");

    expect(servicesToggle).toHaveAttribute("aria-expanded", "true");
    expect(servicesSubmenu).toHaveAttribute("aria-hidden", "false");
    expect(within(servicesSubmenu).getAllByRole("link")).toHaveLength(6);
    expect(within(servicesSubmenu).getByRole("link", { name: "All Services" })).toHaveAttribute(
      "href",
      "/services",
    );
    expect(
      within(servicesSubmenu).getByRole("link", { name: "Software Development" }),
    ).toHaveAttribute("href", "/services/software-development");
    expect(
      within(servicesSubmenu).getByRole("link", { name: "Mobile App Development" }),
    ).toHaveAttribute("href", "/services/mobile-app-development");

    await user.keyboard("{Enter}");
    expect(servicesToggle).toHaveAttribute("aria-expanded", "false");
    expect(servicesSubmenu).toHaveAttribute("aria-hidden", "true");

    await user.click(servicesToggle);
    await user.click(screen.getByRole("button", { name: "Close navigation menu" }));
    await user.click(screen.getByRole("button", { name: "Open navigation menu" }));

    expect(
      within(screen.getByRole("navigation", { name: "Mobile navigation" })).getByRole("button", {
        name: "Services",
      }),
    ).toHaveAttribute("aria-expanded", "false");
  });
});
