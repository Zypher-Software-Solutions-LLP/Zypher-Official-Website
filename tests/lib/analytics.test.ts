import { describe, expect, it } from "vitest";
import { trackEvent } from "@/integrations/analytics/events";
import { CONSENT_COOKIE_NAME, CONSENT_VERSION } from "@/lib/consent";

function grantAnalyticsConsent(): void {
  document.cookie = `${CONSENT_COOKIE_NAME}=${encodeURIComponent(
    JSON.stringify({
      version: CONSENT_VERSION,
      necessary: true,
      analytics: true,
      marketing: false,
      updatedAt: "2026-09-16T00:00:00.000Z",
    }),
  )}`;
}

describe("trackEvent", () => {
  it("should push an approved event after analytics consent", () => {
    grantAnalyticsConsent();
    window.dataLayer = [];

    trackEvent({
      name: "cta_clicked",
      properties: {
        label: "Contact us",
        location: "hero",
        destination: "/contact",
      },
    });

    expect(window.dataLayer).toEqual([
      {
        event: "cta_clicked",
        label: "Contact us",
        location: "hero",
        destination: "/contact",
      },
    ]);
  });

  it("should not push an event before analytics consent", () => {
    document.cookie = `${CONSENT_COOKIE_NAME}=; Max-Age=0`;
    window.dataLayer = [];

    trackEvent({
      name: "blog_post_viewed",
      properties: { slug: "launch-notes" },
    });

    expect(window.dataLayer).toEqual([]);
  });

  it("should do nothing when the data layer is unavailable", () => {
    grantAnalyticsConsent();
    delete window.dataLayer;

    expect(() =>
      trackEvent({
        name: "blog_post_viewed",
        properties: { slug: "launch-notes" },
      }),
    ).not.toThrow();
  });
});
