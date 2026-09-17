"use client";

import Image from "next/image";
import styles from "./ExecutionGapSection.module.css";
import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { executionGapItems } from "./execution-gap-data";
const executionGapIllustrationSrc =
  "https://media.zypher-solutions.com/home-page/section-3/Problem%20Overall%20Graphic.png";
const initialItemId = executionGapItems[0].id;

export function ExecutionGapSection(): ReactNode {
  const [activeItemId, setActiveItemId] = useState<string>(initialItemId);
  const [hasEnteredViewport, setHasEnteredViewport] = useState<boolean>(true);
  const sectionRef = useRef<HTMLElement | null>(null);
  const activeItem =
    executionGapItems.find((item) => item.id === activeItemId) ?? executionGapItems[0];

  useEffect((): (() => void) | void => {
    const section = sectionRef.current;

    if (!section || !("IntersectionObserver" in window)) {
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setHasEnteredViewport(Boolean(entry?.isIntersecting));

        if (entry?.isIntersecting) {
          observer.disconnect();
        }
      },
      { rootMargin: "0px 0px 20% 0px", threshold: 0.08 },
    );

    observer.observe(section);

    return (): void => observer.disconnect();
  }, []);

  return (
    <section
      aria-labelledby="execution-gap-title"
      className={styles.executionGapSection}
      data-reveal-state={hasEnteredViewport ? "visible" : "hidden"}
      data-testid="execution-gap-section"
      id="execution-gap"
      ref={sectionRef}
    >
      <svg
        aria-hidden="true"
        className={styles.executionGapSectionBoundary + " " + styles.executionGapSectionBoundaryTop}
        data-testid="execution-gap-boundary-top"
        preserveAspectRatio="none"
        viewBox="0 0 1440 140"
      >
        <path
          d="M0 28 C220 8 430 8 690 48 C920 82 1220 74 1440 32 L1440 140 L0 140 Z"
          fill="var(--color-brand-dark)"
        />
      </svg>

      <svg
        aria-hidden="true"
        className={
          styles.executionGapSectionBoundary + " " + styles.executionGapSectionBoundaryBottom
        }
        data-testid="execution-gap-boundary-bottom"
        preserveAspectRatio="none"
        viewBox="0 0 1440 140"
      >
        <path
          d="M0 86 C220 66 430 66 690 106 C920 140 1220 132 1440 90 L1440 0 L0 0 Z"
          fill="var(--color-brand-dark)"
        />
      </svg>

      <div
        aria-hidden="true"
        className={styles.executionGapSectionSurface}
        data-testid="execution-gap-surface"
      />

      <div className={styles.executionGapSectionInner}>
        <header className={styles.executionGapSectionHeader}>
          <p className={styles.executionGapSectionEyebrow}>THE EXECUTION GAP</p>
          <h2 className={styles.executionGapSectionTitle} id="execution-gap-title">
            <span>Most Software isn&rsquo;t broken,</span>
            <span>
              It&rsquo;s just <strong>not yours.</strong>
            </span>
          </h2>
        </header>

        <div className={styles.executionGapSectionContent} data-testid="execution-gap-content">
          <div className={styles.executionGapSectionMedia} data-testid="execution-gap-media">
            <picture className={styles.executionGapSectionPicture}>
              <source media="(max-width: 1199px)" srcSet={activeItem.mobileImageSrc} />
              <Image
                alt={activeItem.imageAlt}
                className={styles.executionGapSectionImage}
                data-image-src={activeItem.imageSrc}
                data-testid="execution-gap-image"
                fill
                key={activeItem.id}
                loading={activeItem.id === initialItemId ? "eager" : "lazy"}
                priority={activeItem.id === initialItemId}
                sizes="(max-width: 1199px) min(100vw - 2rem, 36rem), 466px"
                src={activeItem.imageSrc}
              />
            </picture>
          </div>

          <div className={styles.executionGapSectionDetails} data-testid="execution-gap-details">
            <Image
              alt=""
              aria-hidden="true"
              className={styles.executionGapSectionIllustration}
              data-testid="execution-gap-illustration"
              fill
              loading="lazy"
              sizes="(max-width: 767px) 70vw, 312px"
              src={executionGapIllustrationSrc}
            />

            <ButtonLink
              className={styles.executionGapSectionLearnMore}
              href="/contact"
              trackingLabel="Learn More"
              trackingLocation="execution-gap"
              variant="tertiary"
            >
              Learn More <span aria-hidden="true">&#8594;</span>
            </ButtonLink>

            <div
              className={styles.executionGapSectionAccordion}
              data-testid="execution-gap-accordion"
            >
              {executionGapItems.map((item) => {
                const isActive = item.id === activeItem.id;
                const buttonId = "execution-gap-trigger-" + item.id;
                const panelId = "execution-gap-panel-" + item.id;

                return (
                  <article
                    className={styles.executionGapSectionItem}
                    data-state={isActive ? "active" : "inactive"}
                    key={item.id}
                  >
                    <h3 className={styles.executionGapSectionItemHeading}>
                      <button
                        aria-controls={panelId}
                        aria-expanded={isActive}
                        className={styles.executionGapSectionTrigger}
                        id={buttonId}
                        onClick={(): void => setActiveItemId(item.id)}
                        type="button"
                      >
                        <span>{item.heading}</span>
                        <span aria-hidden="true" className={styles.executionGapSectionToggle}>
                          {isActive ? "-" : "+"}
                        </span>
                      </button>
                    </h3>

                    <div
                      aria-hidden={!isActive}
                      aria-labelledby={buttonId}
                      className={styles.executionGapSectionPanel}
                      data-state={isActive ? "open" : "closed"}
                      id={panelId}
                      role="region"
                    >
                      <div className={styles.executionGapSectionPanelInner}>
                        <p className={styles.executionGapSectionCopy}>
                          <strong>Problem:</strong> {item.problem}
                        </p>
                        <p className={styles.executionGapSectionSolutionHeading}>
                          HOW WE <strong>SOLVE IT</strong>
                        </p>
                        <p className={styles.executionGapSectionCopy}>
                          <strong>Solution:</strong> {item.solution}
                        </p>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
