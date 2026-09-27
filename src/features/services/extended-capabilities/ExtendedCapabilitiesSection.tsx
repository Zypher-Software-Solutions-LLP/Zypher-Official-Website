"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { extendedCapabilities, type ExtendedCapability } from "./extended-capabilities-data";
import styles from "./ExtendedCapabilitiesSection.module.css";

type CapabilityView = "desktop" | "mobile";

function CapabilityButton({
  capability,
  isActive,
  onSelect,
  className,
  mobilePanelId,
  testId,
}: {
  capability: ExtendedCapability;
  isActive: boolean;
  onSelect: (capabilityId: string) => void;
  className?: string;
  mobilePanelId?: string;
  testId?: string;
}): ReactNode {
  return (
    <button
      aria-controls={mobilePanelId}
      aria-expanded={mobilePanelId ? isActive : undefined}
      aria-pressed={isActive}
      className={[styles.control, className].filter(Boolean).join(" ")}
      data-capability-id={capability.id}
      data-state={isActive ? "active" : "inactive"}
      data-testid={testId}
      onClick={() => onSelect(capability.id)}
      type="button"
    >
      <span aria-hidden="true" className={styles.controlIcon}>
        <Image alt="" fill sizes="4rem" src={capability.iconSrc} />
      </span>
      <span className={styles.controlLabel}>{capability.label}</span>
      <span aria-hidden="true" className={styles.controlArrow}>
        →
      </span>
    </button>
  );
}

function CapabilityControls({
  activeCapabilityId,
  onSelect,
}: {
  activeCapabilityId: string;
  onSelect: (capabilityId: string) => void;
}): ReactNode {
  return (
    <nav
      aria-label="Extended capabilities services"
      className={styles.controls}
      data-testid="extended-capability-controls"
    >
      {extendedCapabilities.map((capability) => (
        <CapabilityButton
          capability={capability}
          isActive={capability.id === activeCapabilityId}
          key={capability.id}
          onSelect={onSelect}
        />
      ))}
    </nav>
  );
}

function CapabilityMedia({
  capability,
  view = "desktop",
}: {
  capability: ExtendedCapability;
  view?: CapabilityView;
}): ReactNode {
  const isMobile = view === "mobile";

  return (
    <div
      className={styles.media}
      data-testid={isMobile ? "extended-capability-mobile-media" : "extended-capability-media"}
    >
      <Image
        alt={capability.label + " capability"}
        className={styles.mediaImage}
        data-testid={isMobile ? "extended-capability-mobile-image" : "extended-capability-image"}
        fill
        sizes={
          isMobile
            ? "calc(100vw - 3rem)"
            : "(max-width: 767px) calc(100vw - 3rem), (max-width: 1023px) 70vw, 37vw"
        }
        src={capability.thumbnailSrc}
      />
      <div aria-hidden="true" className={styles.mediaOverlay} />
    </div>
  );
}

function CapabilityContent({
  capability,
  view = "desktop",
}: {
  capability: ExtendedCapability;
  view?: CapabilityView;
}): ReactNode {
  const isMobile = view === "mobile";

  return (
    <div
      className={styles.content}
      data-testid={isMobile ? "extended-capability-mobile-content" : "extended-capability-content"}
    >
      <h3 className={styles.title}>{capability.label}</h3>
      <p className={styles.description}>{capability.description}</p>
      <h4 className={styles.deliverablesTitle}>Business Deliverables</h4>
      <ul className={styles.deliverables}>
        {capability.deliverables.map((deliverable) => (
          <li
            data-testid={
              isMobile
                ? "extended-capability-mobile-deliverable"
                : "extended-capability-deliverable"
            }
            key={deliverable}
          >
            {deliverable}
          </li>
        ))}
      </ul>
      <ButtonLink
        className={styles.cta}
        href={capability.ctaHref}
        trackingLabel={capability.ctaLabel}
        trackingLocation="extended-capabilities-section"
      >
        {capability.ctaLabel} →
      </ButtonLink>
    </div>
  );
}

function MobileCapabilityAccordion({
  activeCapabilityId,
  onSelect,
}: {
  activeCapabilityId: string;
  onSelect: (capabilityId: string) => void;
}): ReactNode {
  const previousCapabilityIdRef = useRef(activeCapabilityId);

  useEffect(() => {
    if (previousCapabilityIdRef.current === activeCapabilityId) {
      return;
    }

    previousCapabilityIdRef.current = activeCapabilityId;

    if (
      typeof window === "undefined" ||
      typeof window.matchMedia !== "function" ||
      !window.matchMedia("(max-width: 47.999rem)").matches
    ) {
      return;
    }

    const selectedButton = document.querySelector<HTMLButtonElement>(
      '[data-testid="extended-capability-mobile-control"][data-capability-id="' +
        activeCapabilityId +
        '"]',
    );

    if (!selectedButton) {
      return;
    }

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    selectedButton.scrollIntoView({
      behavior: reducedMotion ? "auto" : "smooth",
      block: "start",
    });
  }, [activeCapabilityId]);

  return (
    <div className={styles.mobileAccordion} data-testid="extended-capabilities-mobile-accordion">
      {extendedCapabilities.map((capability) => {
        const isActive = capability.id === activeCapabilityId;
        const panelId = "extended-capability-panel-" + capability.id;

        return (
          <article
            className={styles.mobileItem}
            data-state={isActive ? "active" : "inactive"}
            key={capability.id}
          >
            <CapabilityButton
              capability={capability}
              className={styles.mobileControl}
              isActive={isActive}
              mobilePanelId={panelId}
              onSelect={onSelect}
              testId="extended-capability-mobile-control"
            />
            {isActive ? (
              <div className={styles.mobilePanel} id={panelId}>
                <CapabilityMedia
                  capability={capability}
                  key={"mobile-media-" + capability.id}
                  view="mobile"
                />
                <CapabilityContent
                  capability={capability}
                  key={"mobile-content-" + capability.id}
                  view="mobile"
                />
              </div>
            ) : null}
          </article>
        );
      })}
    </div>
  );
}

export function ExtendedCapabilitiesSection(): ReactNode {
  const [activeCapabilityId, setActiveCapabilityId] = useState(extendedCapabilities[0].id);
  const activeCapability =
    extendedCapabilities.find((capability) => capability.id === activeCapabilityId) ??
    extendedCapabilities[0];

  return (
    <section
      aria-labelledby="extended-capabilities-title"
      className={styles.section}
      data-motion-section="true"
      data-testid="extended-capabilities-section"
      id="extended-capabilities"
    >
      <div className={styles.shell}>
        <div className={styles.headingGroup}>
          <h2 className={styles.heading} id="extended-capabilities-title">
            <span>Extended</span> Capabilities
          </h2>
        </div>

        <div className={styles.frame} data-testid="extended-capabilities-frame">
          <CapabilityControls
            activeCapabilityId={activeCapability.id}
            onSelect={setActiveCapabilityId}
          />
          <CapabilityMedia capability={activeCapability} key={"media-" + activeCapability.id} />
          <CapabilityContent capability={activeCapability} key={"content-" + activeCapability.id} />
        </div>

        <MobileCapabilityAccordion
          activeCapabilityId={activeCapability.id}
          onSelect={setActiveCapabilityId}
        />
      </div>
    </section>
  );
}
