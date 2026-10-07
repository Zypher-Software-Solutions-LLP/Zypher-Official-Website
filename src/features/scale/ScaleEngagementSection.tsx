"use client";

import Image from "next/image";
import type { ReactNode } from "react";
import styles from "./ScaleEngagementSection.module.css";

const PORTRAIT_SRC =
  "https://media.zypher-solutions.com/scale-page/section-2/Section%202%20HOW%20WE%20ENGAGE.webp";

export function ScaleEngagementSection(): ReactNode {
  return (
    <section
      aria-labelledby="scale-engagement-title"
      className={styles.scaleEngagementSection}
      data-motion-section="true"
      data-testid="scale-engagement-section"
      id="scale-engagement"
    >
      <div aria-hidden="true" className={styles.scaleEngagementSurface} />

      <svg
        aria-hidden="true"
        className={styles.scaleEngagementBoundary}
        data-testid="scale-engagement-boundary-bottom"
        preserveAspectRatio="none"
        viewBox="0 0 1440 140"
      >
        <path
          d="M0 86 C220 66 430 66 690 106 C920 140 1220 132 1440 90 L1440 0 L0 0 Z"
          fill="var(--color-brand-dark)"
        />
      </svg>

      <div className={styles.scaleEngagementGrid} data-testid="scale-engagement-grid">
        <div className={styles.scaleEngagementCopy} data-testid="scale-engagement-copy">
          <p className={styles.scaleEngagementEyebrow}>
            HOW WE <span className={styles.scaleEngagementEyebrowAccent}>ENGAGE</span>
          </p>
          <h2 className={styles.scaleEngagementTitle} id="scale-engagement-title">
            <span data-testid="scale-engagement-title-lines">The problem determines the</span>{" "}
            <span data-testid="scale-engagement-title-lines">engagement. Not the size of</span>{" "}
            <span data-testid="scale-engagement-title-lines">your company.</span>
          </h2>
          <div className={styles.scaleEngagementDescription}>
            <p>
              We&apos;ve built internal tools for two-person teams and custom platforms for
              operations running across three countries.
            </p>
            <p>
              The process on the outside stays the same, a discovery call, a scoped brief, a fixed
              quote, a build. What changes is the depth of what happens inside that process.
            </p>
            <p>
              More stakeholders, deeper discovery. More complexity, more documentation. More risk
              surface, more security consideration. The scale of the problem shapes the work. The
              client shapes the collaboration.
            </p>
          </div>
        </div>

        <div className={styles.scaleEngagementMedia} data-testid="scale-engagement-media">
          <Image
            alt="Person working on a laptop at a desk"
            className={styles.scaleEngagementImage}
            data-image-src={PORTRAIT_SRC}
            data-testid="scale-engagement-image"
            fill
            loading="lazy"
            quality={100}
            sizes="(max-width: 767px) min(100vw - 2rem, 24rem), (max-width: 1199px) 42vw, 466px"
            src={PORTRAIT_SRC}
          />
        </div>
      </div>
    </section>
  );
}
