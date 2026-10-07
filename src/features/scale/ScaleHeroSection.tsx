import Image from "next/image";
import type { ReactNode } from "react";
import { ButtonLink } from "@/components/ui/ButtonLink";
import styles from "./ScaleHeroSection.module.css";

const BACKGROUND_ILLUSTRATION_SRC =
  "https://media.zypher-solutions.com/home-page/section-1/Background%20-%20Hero%20section.webp";
const SCALE_ILLUSTRATION_SRC =
  "https://media.zypher-solutions.com/scale-page/section-1/Hero%20Section%20Illustration.webp";

export function ScaleHeroSection(): ReactNode {
  return (
    <section
      aria-labelledby="scale-hero-title"
      className={styles.scaleHeroSection}
      data-testid="scale-hero"
    >
      <div className={styles.scaleHeroSurface}>
        <div
          aria-hidden="true"
          className={styles.scaleHeroBackground}
          data-image-src={BACKGROUND_ILLUSTRATION_SRC}
          data-testid="scale-hero-background"
        >
          <Image
            alt=""
            className={styles.scaleHeroBackgroundImage}
            fill
            priority
            sizes="100vw"
            src={BACKGROUND_ILLUSTRATION_SRC}
          />
        </div>

        <div
          className={styles.scaleHeroGrid}
          data-motion-intro="true"
          data-testid="scale-hero-grid"
        >
          <div className={styles.scaleHeroHeader}>
            <p className={styles.scaleHeroEyebrow}>
              WHO WE <span className={styles.scaleHeroEyebrowAccent}>WORK FOR</span>
            </p>
            <h1
              aria-label="Whatever the size. Whatever the stage. Built to fit."
              className={styles.scaleHeroTitle}
              id="scale-hero-title"
            >
              <span className={styles.scaleHeroTitleAccent}>Whatever the size.</span>
              <span>Whatever the stage. Built to fit.</span>
            </h1>
          </div>

          <div className={styles.scaleHeroCopy} data-testid="scale-hero-copy">
            <p className={styles.scaleHeroDescription}>
              From a founder validating their first product to an operations team replacing a system
              that stopped scaling, if the problem is real, we’re the right conversation.
            </p>
            <ButtonLink
              className={styles.scaleHeroButton}
              href="/contact"
              trackingLabel="Book a Discovery Call"
              trackingLocation="scale-hero"
            >
              Book A Discovery Call
            </ButtonLink>
          </div>

          <div className={styles.scaleHeroVisual} data-testid="scale-hero-visual">
            <div
              className={styles.scaleHeroIllustration}
              data-image-src={SCALE_ILLUSTRATION_SRC}
              data-testid="scale-hero-illustration"
            >
              <span
                aria-hidden="true"
                className={styles.scaleHeroEllipse}
                data-testid="scale-hero-ellipse"
              />
              <Image
                alt=""
                className={styles.scaleHeroIllustrationImage}
                fill
                sizes="(max-width: 899px) min(92vw, 34rem), min(55vw, 50.125rem)"
                src={SCALE_ILLUSTRATION_SRC}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
