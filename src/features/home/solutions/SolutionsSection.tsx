"use client";

import Image from "next/image";
import styles from "./SolutionsSection.module.css";
import type { ReactNode } from "react";
import { ArrowIcon } from "@/components/ui/ArrowIcon";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { solutionCards } from "./solutions-data";
export function SolutionsSection(): ReactNode {
  return (
    <section
      aria-labelledby="solutions-section-title"
      className={styles.solutionsSection}
      data-motion-section="true"
      data-testid="solutions-section"
      id="solutions"
    >
      <div className={styles.solutionsSectionInner} data-testid="solutions-inner">
        <header className={styles.solutionsSectionHeader}>
          <div className={styles.solutionsSectionCopy}>
            <h2
              aria-label="Why Zypher is different from Everyone else you've worked with"
              className={styles.solutionsSectionTitle}
              data-testid="solutions-title"
              id="solutions-section-title"
            >
              <span
                className={styles.solutionsSectionTitleAccent}
                data-testid="solutions-title-accent"
              >
                Why Zypher is different
              </span>
              <span className={styles.solutionsSectionTitleRest} data-testid="solutions-title-rest">
                from Everyone else you&rsquo;ve worked with
              </span>
            </h2>
            <p className={styles.solutionsSectionSubtitle} data-testid="solutions-subtitle">
              Here&rsquo;s what your solution actually looks like.
            </p>
          </div>

          <ButtonLink
            className={styles.solutionsSectionCta}
            href="/about"
            trackingLabel="About Zypher"
            trackingLocation="solutions"
            variant="secondary"
          >
            About Zypher <ArrowIcon />
          </ButtonLink>
        </header>

        <div className={styles.solutionsSectionGrid} data-testid="solutions-grid">
          {solutionCards.map((card) => (
            <article
              className={styles.solutionsCard + " " + styles["solutionsCard" + card.id]}
              data-card-number={card.number}
              data-variant={card.id}
              data-testid="solution-card"
              key={card.id}
            >
              <div aria-hidden="true" className={styles.solutionsCardArt}>
                <Image
                  alt=""
                  data-image-src={card.imageSrc}
                  fill
                  loading="lazy"
                  sizes="(max-width: 767px) calc(100vw - 2rem), (max-width: 2999px) 40vw, 44rem"
                  src={card.imageSrc}
                />
              </div>
              <div className={styles.solutionsCardContent}>
                <p className={styles.solutionsCardNumber}>{card.number}</p>
                <h3 className={styles.solutionsCardHeading}>{card.heading}</h3>
                <p className={styles.solutionsCardDescription}>{card.description}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
