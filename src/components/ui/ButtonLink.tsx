"use client";

import Link from "next/link";
import styles from "./ButtonLink.module.css";
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
      ? styles.buttonLinkPrimary
      : variant === "secondary"
        ? styles.buttonLinkSecondary
        : styles.buttonLinkTertiary;

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
      className={styles.buttonLink + " " + variantClass + " " + className}
      href={href}
      onClick={handleClick}
    >
      {children}
    </Link>
  );
}
