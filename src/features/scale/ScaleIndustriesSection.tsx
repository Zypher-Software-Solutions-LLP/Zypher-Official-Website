"use client";

import Image from "next/image";
import type { ReactNode } from "react";
import { scaleIndustries } from "./scale-industries-data";
import styles from "./ScaleIndustriesSection.module.css";

const VERTICAL_LINE_COUNT = 7;
const HORIZONTAL_LINE_COUNT = 8;

export function ScaleIndustriesSection(): ReactNode {
  return (
    <section
      aria-labelledby="scale-industries-title"
      className={styles.scaleIndustriesSection}
      data-motion-section="true"
      data-testid="scale-industries-section"
      id="scale-industries"
    >
      <div className={styles.scaleIndustriesContainer}>
        <h2 className={styles.scaleIndustriesTitle} id="scale-industries-title">
          Built Across industries. Fluent in the problems behind them.
        </h2>
        <p className={styles.scaleIndustriesEyebrow}>Industries we build for</p>

        <div className={styles.scaleIndustriesGrid} data-testid="scale-industries-grid">
          <div
            aria-hidden="true"
            className={styles.scaleIndustriesLines}
            data-testid="scale-industries-lines"
          >
            <div className={styles.scaleIndustriesVerticalLines}>
              {Array.from({ length: VERTICAL_LINE_COUNT }, (_, index) => (
                <span className={styles.scaleIndustriesVerticalLine} key={`vertical-${index}`} />
              ))}
            </div>
            <div className={styles.scaleIndustriesHorizontalLines}>
              {Array.from({ length: HORIZONTAL_LINE_COUNT }, (_, index) => (
                <span
                  className={styles.scaleIndustriesHorizontalLine}
                  key={`horizontal-${index}`}
                />
              ))}
            </div>
          </div>

          {scaleIndustries.map((industry) => {
            const placementClass = industry.desktopPlacement
              ? industry.desktopPlacement === "education"
                ? styles.scaleIndustriesEducationCard
                : styles.scaleIndustriesProfessionalCard
              : "";

            return (
              <article
                className={`${styles.scaleIndustriesCard} ${placementClass}`.trim()}
                data-testid="scale-industry-card"
                key={industry.id}
              >
                <Image
                  alt={industry.imageAlt}
                  className={styles.scaleIndustriesImage}
                  data-image-src={industry.imageSrc}
                  data-testid={`scale-industry-image-${industry.id}`}
                  fill
                  loading="lazy"
                  quality={100}
                  sizes="(max-width: 767px) 44vw, (max-width: 1199px) 31vw, 270px"
                  src={industry.imageSrc}
                />
                <div aria-hidden="true" className={styles.scaleIndustriesOverlay} />
                <h3 className={styles.scaleIndustriesCardTitle}>{industry.title}</h3>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
