import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { ConsentManager } from "@/components/privacy/ConsentManager";
import { CONSENT_COOKIE_NAME, CONSENT_VERSION } from "@/lib/consent";

describe("consent manager", () => {
  let cookieValue = "";

  beforeEach(() => {
    cookieValue = "";
    Object.defineProperty(document, "cookie", {
      configurable: true,
      get: () => cookieValue,
      set: (value: string) => {
        cookieValue = value.split(";")[0] ?? "";
      },
    });
  });

  afterEach(() => {
    cleanup();
  });

  it("should show the compact banner before opening detailed preferences", async () => {
    render(<ConsentManager />);

    const banner = await screen.findByRole("dialog", { name: "Cookie consent" });

    expect(banner).toHaveTextContent("Your privacy choices");
    expect(banner).toHaveTextContent("Cookies, on your terms.");
    expect(screen.getByRole("button", { name: "Manage preferences" })).toBeInTheDocument();
    expect(screen.queryByText("Analytics and performance")).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Manage preferences" }));

    expect(await screen.findByText("Analytics and performance")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Close cookie settings" })).toBeInTheDocument();
  });

  it("should save the selected optional categories and close the preferences modal", async () => {
    render(<ConsentManager />);

    await screen.findByRole("dialog", { name: "Cookie consent" });
    fireEvent.click(screen.getByRole("button", { name: "Manage preferences" }));
    await screen.findByText("Analytics and performance");
    fireEvent.click(screen.getByRole("switch", { name: "Analytics and performance cookies" }));
    fireEvent.click(screen.getByRole("button", { name: "Save preferences" }));

    await waitFor(() => {
      expect(screen.queryByRole("dialog", { name: "Cookie consent" })).not.toBeInTheDocument();
    });

    expect(cookieValue).toContain(`${CONSENT_COOKIE_NAME}=`);
    const serializedPreferences = decodeURIComponent(cookieValue.split("=")[1] ?? "");
    const preferences = JSON.parse(serializedPreferences) as {
      version: string;
      necessary: boolean;
      analytics: boolean;
      marketing: boolean;
    };

    expect(preferences).toMatchObject({
      version: CONSENT_VERSION,
      necessary: true,
      analytics: true,
      marketing: false,
    });
  });

  it("should reopen detailed preferences from the footer event", async () => {
    render(<ConsentManager />);

    await screen.findByRole("dialog", { name: "Cookie consent" });
    fireEvent.click(screen.getByRole("button", { name: "Reject optional" }));

    await waitFor(() => {
      expect(screen.queryByRole("dialog", { name: "Cookie consent" })).not.toBeInTheDocument();
    });

    window.dispatchEvent(new CustomEvent("zypher:open-consent"));

    expect(await screen.findByText("Analytics and performance")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Close cookie settings" })).toBeInTheDocument();
  });

  it("should keep the first-visit banner until a choice is made", async () => {
    render(<ConsentManager />);

    const banner = await screen.findByRole("dialog", { name: "Cookie consent" });
    const bannerLayer = banner.parentElement;

    expect(bannerLayer).not.toBeNull();
    fireEvent.click(bannerLayer as HTMLElement);
    expect(screen.getByText("Cookies, on your terms.")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Manage preferences" }));

    const preferencesDialog = await screen.findByRole("dialog", { name: "Cookie consent" });
    const scrim = preferencesDialog.parentElement;

    expect(scrim).not.toBeNull();
    fireEvent.click(scrim as HTMLElement);

    expect(await screen.findByText("Cookies, on your terms.")).toBeInTheDocument();
  });
});
