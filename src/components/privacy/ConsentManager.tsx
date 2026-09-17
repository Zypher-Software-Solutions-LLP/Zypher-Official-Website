"use client";

import { useEffect, useState, type ReactNode } from "react";
import {
  CONSENT_COOKIE_NAME,
  CONSENT_VERSION,
  ConsentPreferencesSchema,
  createDefaultConsentPreferences,
  type ConsentPreferences,
} from "@/lib/consent";

function readStoredPreferences(): ConsentPreferences | null {
  const cookie = document.cookie
    .split("; ")
    .find((entry) => entry.startsWith(`${CONSENT_COOKIE_NAME}=`));

  if (!cookie) {
    return null;
  }

  try {
    const value = decodeURIComponent(cookie.split("=").slice(1).join("="));
    const result = ConsentPreferencesSchema.safeParse(JSON.parse(value));
    return result.success ? result.data : null;
  } catch {
    return null;
  }
}

function savePreferences(preferences: ConsentPreferences): void {
  const serialized = encodeURIComponent(JSON.stringify(preferences));
  document.cookie = `${CONSENT_COOKIE_NAME}=${serialized}; Max-Age=31536000; Path=/; SameSite=Lax; Secure`;
}

function loadGoogleTagManager(): void {
  const containerId = process.env.NEXT_PUBLIC_GTM_ID;

  if (!containerId || document.getElementById("zypher-gtm")) {
    return;
  }

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ "gtm.start": Date.now(), event: "gtm.js" });

  const script = document.createElement("script");
  script.id = "zypher-gtm";
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtm.js?id=${encodeURIComponent(containerId)}`;
  document.head.appendChild(script);
}

export function ConsentManager(): ReactNode {
  const [preferences, setPreferences] = useState<ConsentPreferences | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const stored = readStoredPreferences();
    const preferenceTimer = window.setTimeout(() => setPreferences(stored), 0);

    if (stored?.analytics) {
      loadGoogleTagManager();
    }

    const handleOpen = (): void => setIsOpen(true);
    window.addEventListener("zypher:open-consent", handleOpen);
    return () => {
      window.clearTimeout(preferenceTimer);
      window.removeEventListener("zypher:open-consent", handleOpen);
    };
  }, []);

  function updatePreferences(analytics: boolean, marketing: boolean): void {
    const nextPreferences: ConsentPreferences = {
      ...createDefaultConsentPreferences(),
      version: CONSENT_VERSION,
      analytics,
      marketing,
      updatedAt: new Date().toISOString(),
    };
    savePreferences(nextPreferences);
    setPreferences(nextPreferences);
    setIsOpen(false);

    if (analytics) {
      loadGoogleTagManager();
    }

    window.dataLayer?.push({
      event: "consent_preferences_updated",
      analytics_storage: analytics ? "granted" : "denied",
      ad_storage: marketing ? "granted" : "denied",
    });
  }

  if (preferences && !isOpen) {
    return null;
  }

  return (
    <div
      aria-label="Cookie consent"
      aria-modal="true"
      className="fixed inset-x-4 bottom-4 z-50 mx-auto max-w-xl rounded-2xl border border-mist-300/20 bg-ink-800 p-5 shadow-2xl shadow-black/30 sm:inset-x-auto sm:right-6 sm:p-6"
      role="dialog"
    >
      <p className="eyebrow">Your privacy</p>
      <h2 className="mt-2 text-xl font-semibold text-mist-100">Choose your cookie settings</h2>
      <p className="mt-3 text-sm leading-6 text-mist-300">
        Necessary cookies keep the website working. Optional analytics help us understand which
        pages are useful. You can change this choice at any time.
      </p>
      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:justify-end">
        <button
          className="min-h-11 rounded-full border border-mist-300/30 px-5 py-2.5 text-sm font-semibold text-mist-100 transition-colors hover:border-cyan-300 hover:text-cyan-300"
          onClick={() => updatePreferences(false, false)}
          type="button"
        >
          Reject optional
        </button>
        <button
          className="min-h-11 rounded-full border border-mist-300/30 px-5 py-2.5 text-sm font-semibold text-mist-100 transition-colors hover:border-cyan-300 hover:text-cyan-300"
          onClick={() => updatePreferences(true, false)}
          type="button"
        >
          Accept analytics
        </button>
        <button
          className="min-h-11 rounded-full bg-cyan-400 px-5 py-2.5 text-sm font-semibold text-ink-950 transition-colors hover:bg-cyan-300"
          onClick={() => updatePreferences(true, true)}
          type="button"
        >
          Accept all optional
        </button>
      </div>
    </div>
  );
}
