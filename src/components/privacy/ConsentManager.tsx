"use client";

import { useCallback, useEffect, useRef, useState, type MouseEvent, type ReactNode } from "react";
import {
  CONSENT_COOKIE_NAME,
  CONSENT_VERSION,
  ConsentPreferencesSchema,
  createDefaultConsentPreferences,
  type ConsentPreferences,
} from "@/lib/consent";
import styles from "./ConsentManager.module.css";

type ConsentView = "banner" | "preferences";
type OptionalPreferences = Pick<ConsentPreferences, "analytics" | "marketing">;

const CONSENT_CLOSE_DURATION_MS = 220;

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

function toOptionalPreferences(preferences: ConsentPreferences | null): OptionalPreferences {
  return {
    analytics: preferences?.analytics ?? false,
    marketing: preferences?.marketing ?? false,
  };
}

function CookieToggle({
  checked,
  label,
  onChange,
}: {
  checked: boolean;
  label: string;
  onChange: () => void;
}): ReactNode {
  return (
    <button
      aria-checked={checked}
      aria-label={label}
      className={styles.toggle}
      onClick={onChange}
      role="switch"
      type="button"
    >
      <span className={styles.toggleThumb} />
    </button>
  );
}

export function ConsentManager(): ReactNode {
  const [preferences, setPreferences] = useState<ConsentPreferences | null>(null);
  const [draftPreferences, setDraftPreferences] = useState<OptionalPreferences>({
    analytics: false,
    marketing: false,
  });
  const [hasLoaded, setHasLoaded] = useState(false);
  const [view, setView] = useState<ConsentView | null>(null);
  const [isClosing, setIsClosing] = useState(false);
  const preferencesRef = useRef<ConsentPreferences | null>(null);
  const closeTimerRef = useRef<number | null>(null);

  const closeConsent = useCallback((destination: ConsentView | null): void => {
    if (closeTimerRef.current !== null) {
      return;
    }

    setIsClosing(true);
    closeTimerRef.current = window.setTimeout(() => {
      closeTimerRef.current = null;
      setView(destination);
      setIsClosing(false);
    }, CONSENT_CLOSE_DURATION_MS);
  }, []);

  const openPreferences = useCallback((): void => {
    if (closeTimerRef.current !== null) {
      window.clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }

    setIsClosing(false);
    setView("preferences");
  }, []);

  useEffect(() => {
    const stored = readStoredPreferences();
    preferencesRef.current = stored;
    const preferenceTimer = window.setTimeout(() => {
      setPreferences(stored);
      setDraftPreferences(toOptionalPreferences(stored));
      setView(stored ? null : "banner");
      setHasLoaded(true);
    }, 0);

    if (stored?.analytics) {
      loadGoogleTagManager();
    }

    const handleOpen = (): void => {
      setDraftPreferences(toOptionalPreferences(preferencesRef.current));
      openPreferences();
    };

    window.addEventListener("zypher:open-consent", handleOpen);
    return () => {
      window.clearTimeout(preferenceTimer);
      if (closeTimerRef.current !== null) {
        window.clearTimeout(closeTimerRef.current);
      }
      window.removeEventListener("zypher:open-consent", handleOpen);
    };
  }, [openPreferences]);

  useEffect(() => {
    if (!view) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent): void => {
      if (event.key !== "Escape" || view !== "preferences") {
        return;
      }

      closeConsent(preferences ? null : "banner");
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [closeConsent, preferences, view]);

  function updatePreferences(nextOptionalPreferences: OptionalPreferences): void {
    const nextPreferences: ConsentPreferences = {
      ...createDefaultConsentPreferences(),
      version: CONSENT_VERSION,
      ...nextOptionalPreferences,
      updatedAt: new Date().toISOString(),
    };

    savePreferences(nextPreferences);
    preferencesRef.current = nextPreferences;
    setPreferences(nextPreferences);
    setDraftPreferences(nextOptionalPreferences);
    closeConsent(null);

    if (nextPreferences.analytics) {
      loadGoogleTagManager();
    }

    window.dataLayer?.push({
      event: "consent_preferences_updated",
      analytics_storage: nextPreferences.analytics ? "granted" : "denied",
      ad_storage: nextPreferences.marketing ? "granted" : "denied",
    });
  }

  function handleOuterClick(event: MouseEvent<HTMLDivElement>): void {
    if (event.target !== event.currentTarget || view === "banner") {
      return;
    }

    closeConsent(preferences ? null : "banner");
  }

  function rejectOptionalCookies(): void {
    updatePreferences({ analytics: false, marketing: false });
  }

  function acceptAllOptionalCookies(): void {
    updatePreferences({ analytics: true, marketing: true });
  }

  if (!hasLoaded || !view) {
    return null;
  }

  if (view === "banner") {
    return (
      <div
        className={`${styles.bannerLayer} ${isClosing ? styles.bannerLayerClosing : ""}`}
        onClick={handleOuterClick}
      >
        <section
          aria-describedby="zypher-consent-banner-description"
          aria-label="Cookie consent"
          aria-modal="false"
          className={styles.bannerCard}
          role="dialog"
        >
          <div className={styles.bannerCopy}>
            <p className={styles.eyebrow}>Your privacy choices</p>
            <h2 className={styles.bannerTitle}>Cookies, on your terms.</h2>
            <p className={styles.bannerDescription} id="zypher-consent-banner-description">
              Necessary cookies keep Zypher secure and working. Choose whether we can use optional
              analytics and marketing technologies.
            </p>
            <a className={styles.policyLink} href="/cookie-policy">
              Read our Cookie Policy
              <span aria-hidden="true">↗</span>
            </a>
          </div>

          <div className={styles.bannerActions}>
            <button className={styles.secondaryButton} onClick={openPreferences} type="button">
              Manage preferences
            </button>
            <button
              className={styles.secondaryButton}
              onClick={rejectOptionalCookies}
              type="button"
            >
              Reject optional
            </button>
            <button
              className={styles.primaryButton}
              onClick={acceptAllOptionalCookies}
              type="button"
            >
              Accept all optional
            </button>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div
      className={`${styles.scrim} ${isClosing ? styles.scrimClosing : ""}`}
      onClick={handleOuterClick}
    >
      <section
        aria-describedby="zypher-consent-description"
        aria-label="Cookie consent"
        aria-modal="true"
        className={styles.dialog}
        role="dialog"
      >
        <div className={styles.dialogHeader}>
          <div>
            <p className={styles.eyebrow}>Your privacy</p>
            <h2 className={styles.title}>Choose what you&apos;re comfortable with.</h2>
          </div>
          <button
            aria-label="Close cookie settings"
            className={styles.closeButton}
            onClick={() => closeConsent(preferences ? null : "banner")}
            type="button"
          >
            <span aria-hidden="true" />
            <span aria-hidden="true" />
          </button>
        </div>

        <p className={styles.description} id="zypher-consent-description">
          Cookies help us keep the site secure, remember your consent, and understand what content
          is useful. Necessary cookies are always on. Optional categories stay off until you choose
          them.
        </p>

        <a className={styles.policyLink} href="/cookie-policy">
          Read our Cookie Policy
          <span aria-hidden="true">↗</span>
        </a>

        <div className={styles.preferenceList}>
          <div className={styles.preferenceCard}>
            <div className={styles.preferenceCopy}>
              <div className={styles.preferenceTitle}>
                <h3>Necessary cookies</h3>
                <span className={styles.statusBadge}>Always active</span>
              </div>
              <p>
                Keep the website secure, store your consent choice, and support essential
                functionality. These cannot be switched off.
              </p>
            </div>
          </div>

          <div className={styles.preferenceCard}>
            <div className={styles.preferenceCopy}>
              <div className={styles.preferenceTitle}>
                <h3>Analytics and performance</h3>
              </div>
              <p>
                Help us understand pages viewed, interactions, browser and device information, and
                website performance. Providers may include Google Analytics, Google Tag Manager, or
                Vercel Analytics.
              </p>
            </div>
            <CookieToggle
              checked={draftPreferences.analytics}
              label="Analytics and performance cookies"
              onChange={() =>
                setDraftPreferences((current) => ({
                  ...current,
                  analytics: !current.analytics,
                }))
              }
            />
          </div>

          <div className={styles.preferenceCard}>
            <div className={styles.preferenceCopy}>
              <div className={styles.preferenceTitle}>
                <h3>Functional preferences</h3>
                <span className={styles.statusBadge}>Feature dependent</span>
              </div>
              <p>
                Some preference technologies may support a feature you request. No separate optional
                functional category is currently active on this site.
              </p>
            </div>
          </div>

          <div className={styles.preferenceCard}>
            <div className={styles.preferenceCopy}>
              <div className={styles.preferenceTitle}>
                <h3>Marketing cookies</h3>
              </div>
              <p>
                May support future campaign measurement or conversion tracking. These technologies
                are not activated unless you choose to allow them.
              </p>
            </div>
            <CookieToggle
              checked={draftPreferences.marketing}
              label="Marketing cookies"
              onChange={() =>
                setDraftPreferences((current) => ({
                  ...current,
                  marketing: !current.marketing,
                }))
              }
            />
          </div>
        </div>

        <div className={styles.actionBar}>
          <p className={styles.revisitNote}>
            You can revisit these choices from the footer at any time.
          </p>
          <div className={styles.actions}>
            <button
              className={styles.secondaryButton}
              onClick={rejectOptionalCookies}
              type="button"
            >
              Reject optional
            </button>
            <button
              className={styles.secondaryButton}
              onClick={() => updatePreferences(draftPreferences)}
              type="button"
            >
              Save preferences
            </button>
            <button
              className={styles.primaryButton}
              onClick={acceptAllOptionalCookies}
              type="button"
            >
              Accept all optional
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
