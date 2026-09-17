"use client";

import { useEffect, useRef, type ReactNode } from "react";

type TurnstileFieldProps = {
  onTokenChange: (token: string) => void;
};

export function TurnstileField({ onTokenChange }: TurnstileFieldProps): ReactNode {
  const containerRef = useRef<HTMLDivElement>(null);
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

  useEffect(() => {
    if (!siteKey) {
      onTokenChange("local-development-token");
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
        callback: onTokenChange,
        "expired-callback": () => onTokenChange(""),
        "error-callback": () => onTokenChange(""),
      });
    };

    const existingScript = document.querySelector<HTMLScriptElement>(
      'script[src="https://challenges.cloudflare.com/turnstile/v0/api.js"]',
    );

    if (existingScript) {
      renderWidget();
    } else {
      const script = document.createElement("script");
      script.async = true;
      script.defer = true;
      script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js";
      script.addEventListener("load", renderWidget);
      document.head.appendChild(script);
    }

    return () => {
      if (retryTimer) clearTimeout(retryTimer);
      if (widgetId && window.turnstile) window.turnstile.reset(widgetId);
    };
  }, [onTokenChange, siteKey]);

  if (!siteKey) {
    return (
      <p className="rounded-lg border border-mist-300/15 bg-ink-900 px-3 py-2 text-xs text-mist-500">
        Spam protection is enabled automatically in production.
      </p>
    );
  }

  return <div aria-label="Spam protection" ref={containerRef} />;
}
