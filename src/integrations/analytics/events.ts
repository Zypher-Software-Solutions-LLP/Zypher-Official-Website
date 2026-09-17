import { CONSENT_COOKIE_NAME, CONSENT_VERSION, ConsentPreferencesSchema } from "@/lib/consent";

export type AnalyticsEvent =
  | { name: "cta_clicked"; properties: { label: string; location: string; destination: string } }
  | {
      name: "navigation_clicked";
      properties: { label: string; destination: string; location: string };
    }
  | { name: "contact_form_started"; properties: { form_name: string } }
  | { name: "contact_form_submitted"; properties: { form_name: string } }
  | { name: "contact_form_failed"; properties: { form_name: string; reason: string } }
  | { name: "blog_post_viewed"; properties: { slug: string } }
  | { name: "outbound_link_clicked"; properties: { destination: string; location: string } };

function hasAnalyticsConsent(): boolean {
  if (typeof document === "undefined") {
    return false;
  }

  const cookie = document.cookie
    .split("; ")
    .find((entry) => entry.startsWith(`${CONSENT_COOKIE_NAME}=`));

  if (!cookie) {
    return false;
  }

  try {
    const value = decodeURIComponent(cookie.split("=").slice(1).join("="));
    const result = ConsentPreferencesSchema.safeParse(JSON.parse(value));
    return result.success && result.data.version === CONSENT_VERSION && result.data.analytics;
  } catch {
    return false;
  }
}

export function trackEvent(event: AnalyticsEvent): boolean {
  if (typeof window === "undefined" || !window.dataLayer || !hasAnalyticsConsent()) {
    return false;
  }

  window.dataLayer.push({ event: event.name, ...event.properties });
  return true;
}
