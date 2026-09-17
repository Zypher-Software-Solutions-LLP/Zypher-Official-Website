"use client";

import type { ReactNode } from "react";

type CookieSettingsButtonProps = {
  className?: string;
};

export function CookieSettingsButton({ className = "" }: CookieSettingsButtonProps): ReactNode {
  const buttonClassName =
    className ||
    "text-left text-xs text-mist-300 underline decoration-mist-500 underline-offset-4 transition-colors hover:text-cyan-300";

  return (
    <button
      className={buttonClassName}
      onClick={() => window.dispatchEvent(new CustomEvent("zypher:open-consent"))}
      type="button"
    >
      Cookie settings
    </button>
  );
}
