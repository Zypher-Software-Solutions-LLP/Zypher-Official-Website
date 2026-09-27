import Image from "next/image";
import type { ReactNode } from "react";
import { ButtonLink } from "@/components/ui/ButtonLink";
import styles from "./WorkHeroSection.module.css";

const BACKGROUND_ILLUSTRATION_SRC = "/home/section-1/background-illustration.png";
const WORK_HERO_DESKTOP_SRC =
  "https://media.zypher-solutions.com/work-page/section-1/Hero%20Section.png";
const WORK_HERO_MOBILE_SRC =
  "https://media.zypher-solutions.com/work-page/section-1/Hero%20Section%20-%20Mobile.png";

export function WorkHeroSection(): ReactNode {
  return (
    <section
      aria-labelledby="work-hero-title"
      className={styles.workHeroSection}
      data-layout="12-column"
      data-testid="work-hero-section"
      id="work-hero"
    >
      <div
        aria-hidden="true"
        className={styles.workHeroBackground}
        data-layer="background-illustration"
      >
        <Image
          alt=""
          className={styles.workHeroBackgroundImage}
          fill
          priority
          sizes="100vw"
          src={BACKGROUND_ILLUSTRATION_SRC}
        />
      </div>

      <div aria-hidden="true" className={styles.workHeroVisual} data-testid="work-hero-visual">
        <picture className={styles.workHeroPicture} data-testid="work-hero-picture">
          <source
            data-testid="work-hero-mobile-source"
            media="(max-width: 767px)"
            srcSet={WORK_HERO_MOBILE_SRC}
          />
          <Image
            alt=""
            className={styles.workHeroAsset}
            data-image-position="center"
            data-image-quality="100"
            data-image-src={WORK_HERO_DESKTOP_SRC}
            data-testid="work-hero-desktop-image"
            fill
            priority
            quality={100}
            sizes="(max-width: 767px) 100vw, (max-width: 1199px) 94vw, min(92vw, 1408px)"
            src={WORK_HERO_DESKTOP_SRC}
          />
        </picture>
      </div>

      <div className={styles.workHeroContent} data-motion-intro="true">
        <div className={styles.workHeroCopy}>
          <p className={styles.workHeroEyebrow}>
            <span>OUR</span> <span className={styles.workHeroEyebrowAccent}>WORK</span>
          </p>

          <div className={styles.workHeroScreenCopy} data-testid="work-hero-screen-copy">
            <h1 className={styles.workHeroTitle} id="work-hero-title">
              Every Project below started as a problem, No one had solved yet.
            </h1>

            <ButtonLink
              className={styles.workHeroButton}
              href="/work#work-projects"
              trackingLabel="See the Builds"
              trackingLocation="work-hero"
            >
              See the Builds →
            </ButtonLink>

            <p className={styles.workHeroDescription}>
              Builds across five countries, different industries, different scales, one standard.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
