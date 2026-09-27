"use client";

import Image from "next/image";
import type { ReactNode } from "react";
import { ButtonLink } from "@/components/ui/ButtonLink";
import styles from "./ScopeApproachSection.module.css";

const illustrationSrc =
  "https://media.zypher-solutions.com/services-page/section-5/Illustration.png";

export function ScopeApproachSection(): ReactNode {
  return (
    <section
      aria-labelledby="scope-approach-title"
      className={styles.section}
      data-motion-section="true"
      data-testid="scope-approach-section"
      id="scope-approach"
    >
      <svg
        aria-hidden="true"
        className={styles.boundary + " " + styles.boundaryTop}
        data-testid="scope-approach-boundary-top"
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
        className={styles.boundary + " " + styles.boundaryBottom}
        data-testid="scope-approach-boundary-bottom"
        preserveAspectRatio="none"
        viewBox="0 0 1440 140"
      >
        <path
          d="M0 86 C220 66 430 66 690 106 C920 140 1220 132 1440 90 L1440 0 L0 0 Z"
          fill="var(--color-brand-dark)"
        />
      </svg>

      <div aria-hidden="true" className={styles.surface} data-testid="scope-approach-surface" />

      <div className={styles.inner}>
        <div className={styles.content}>
          <div className={styles.copy}>
            <p className={styles.eyebrow}>Our approach to scope</p>
            <h2 className={styles.title} id="scope-approach-title">
              The same problem often has two right answers.
            </h2>
            <p className={styles.description}>
              A business drowning in manual client follow-ups might need a CRM. Or it might need an
              AI agent that handles the follow-up itself and only escalates what actually needs a
              human. We do not start a conversation by pitching the service we would rather sell. We
              start by figuring out which of the capabilities above the problem actually needs.
              Sometimes it is one. Sometimes it is three, working together. That gets decided in the
              discovery call, before anything is scoped or quoted.
            </p>
            <ButtonLink
              className={styles.cta}
              href="/scale"
              trackingLabel="See Who We Work With"
              trackingLocation="scope-approach"
            >
              See Who We Work With <span aria-hidden="true">→</span>
            </ButtonLink>
          </div>

          <div className={styles.media} data-testid="scope-approach-media">
            <Image
              alt="Two people planning a software project together"
              className={styles.image}
              fill
              loading="lazy"
              sizes="(max-width: 767px) min(100% - 2rem, 24rem), (max-width: 1199px) 36vw, 368px"
              src={illustrationSrc}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
