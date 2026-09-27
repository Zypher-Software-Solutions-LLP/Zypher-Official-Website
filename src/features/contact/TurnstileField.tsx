"use client";

import { useEffect, useRef, type ReactNode } from "react";

const TURNSTILE_SCRIPT_URL =
  "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";

type TurnstileAppearance = "always" | "execute" | "interaction-only";

type TurnstileFieldProps = {
  action: string;
  onTokenChange: (token: string) => void;
  appearance?: TurnstileAppearance;
  resetSignal?: number;
  showDevelopmentMessage?: boolean;
};

export function TurnstileField({
  action,
  onTokenChange,
  appearance = "execute",
  resetSignal = 0,
  showDevelopmentMessage = true,
}: TurnstileFieldProps): ReactNode {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | undefined>(undefined);
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
  const isProduction = process.env.NODE_ENV === "production";

  useEffect(() => {
    if (!siteKey) {
      onTokenChange(isProduction ? "" : "local-development-token");
      return undefined;
    }

    let widgetId: string | undefined;
    let retryTimer: ReturnType<typeof setTimeout> | undefined;

    const renderWidget = (): void => {
      if (!containerRef.current || !window.turnstile) {
        retryTimer = setTimeout(renderWidget, 100);
        return;
      }

      widgetId = window.turnstile.render(containerRef.current, {
        sitekey: siteKey,
        action,
        appearance,
        callback: onTokenChange,
        "expired-callback": () => onTokenChange(""),
        "error-callback": () => onTokenChange(""),
      });
      widgetIdRef.current = widgetId;
    };

    const existingScript = document.querySelector<HTMLScriptElement>(
      'script[src^="https://challenges.cloudflare.com/turnstile/v0/api.js"]',
    );

    if (existingScript) {
      renderWidget();
    } else {
      const script = document.createElement("script");
      script.async = true;
      script.defer = true;
      script.src = TURNSTILE_SCRIPT_URL;
      script.addEventListener("load", renderWidget);
      document.head.appendChild(script);
    }

    return () => {
      if (retryTimer) clearTimeout(retryTimer);
      if (widgetId && window.turnstile) window.turnstile.reset(widgetId);
      widgetIdRef.current = undefined;
    };
  }, [action, appearance, isProduction, onTokenChange, siteKey]);

  useEffect(() => {
    if (resetSignal === 0 || !widgetIdRef.current || !window.turnstile) return;

    window.turnstile.reset(widgetIdRef.current);
    onTokenChange("");
  }, [onTokenChange, resetSignal]);

  if (!siteKey) {
    if (isProduction) {
      return (
        <p
          aria-live="polite"
          className="rounded-lg border border-mist-300/15 bg-ink-900 px-3 py-2 text-xs text-mist-500"
        >
          Spam protection is temporarily unavailable. Please try again later.
        </p>
      );
    }

    if (!showDevelopmentMessage) return null;

    return (
      <p className="rounded-lg border border-mist-300/15 bg-ink-900 px-3 py-2 text-xs text-mist-500">
        Spam protection is enabled automatically in production.
      </p>
    );
  }

  return (
    <div aria-label="Spam protection" className="turnstileField" ref={containerRef} role="group" />
  );
}
