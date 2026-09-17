"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { trackEvent } from "@/integrations/analytics/events";

type ButtonLinkProps = {
  children: ReactNode;
  href: string;
  variant?: "primary" | "secondary" | "tertiary";
  className?: string;
  trackingLabel?: string;
  trackingLocation?: string;
};

export function ButtonLink({
  children,
  href,
  variant = "primary",
  className = "",
  trackingLabel,
  trackingLocation = "page",
}: ButtonLinkProps): ReactNode {
  const variantClass =
    variant === "primary"
      ? "button-link--primary"
      : variant === "secondary"
        ? "button-link--secondary"
        : "button-link--tertiary";

  function handleClick(): void {
    trackEvent({
      name: "cta_clicked",
      properties: {
        label: trackingLabel || (typeof children === "string" ? children : "CTA"),
        location: trackingLocation,
        destination: href,
      },
    });
  }

  return (
    <Link
      className={"button-link " + variantClass + " " + className}
      href={href}
      onClick={handleClick}
    >
      {children}
    </Link>
  );
}
