import Image from "next/image";
import type { ReactNode } from "react";
import { ButtonLink } from "@/components/ui/ButtonLink";
import styles from "./AboutHeroSection.module.css";

const BACKGROUND_ILLUSTRATION_SRC = "/home/section-1/background-illustration.png";
const ABOUT_HERO_ILLUSTRATION_SRC =
  "https://media.zypher-solutions.com/about-page/section-1/Hero%20Section.png";
const ABOUT_HERO_TITLE =
  "We started fixing things nobody asked us to fix. That part never changed.";
const ABOUT_HERO_DESCRIPTION =
  "Zypher began as three people solving problems around them, long before it was a company. Today we build tailored software for teams across 5+ countries without losing the part that made it work in the first place.";

export function AboutHeroSection(): ReactNode {
  return (
    <section
      aria-labelledby="about-hero-title"
      className={styles.aboutHeroSection}
      data-testid="about-hero"
    >
      <div
        aria-hidden="true"
        className={styles.aboutHeroBackground}
        data-image-src={BACKGROUND_ILLUSTRATION_SRC}
        data-testid="about-hero-background"
      >
        <Image
          alt=""
          className={styles.aboutHeroBackgroundImage}
          fill
          priority
          sizes="100vw"
          src={BACKGROUND_ILLUSTRATION_SRC}
        />
      </div>

      <div className={styles.aboutHeroGrid} data-testid="about-hero-grid">
        <div className={styles.aboutHeroCopy} data-motion-intro="true">
          <h1
            aria-label={ABOUT_HERO_TITLE}
            className={styles.aboutHeroTitle + " " + styles.aboutHeroFade}
            data-testid="about-hero-title"
            id="about-hero-title"
          >
            {ABOUT_HERO_TITLE}
          </h1>
          <p
            className={
              styles.aboutHeroDescription +
              " " +
              styles.aboutHeroFade +
              " " +
              styles.aboutHeroFadeDelay1
            }
            data-testid="about-hero-description"
          >
            {ABOUT_HERO_DESCRIPTION}
          </p>
          <div
            className={
              styles.aboutHeroActions +
              " " +
              styles.aboutHeroFade +
              " " +
              styles.aboutHeroFadeDelay2
            }
            data-testid="about-hero-actions"
          >
            <ButtonLink
              className={styles.aboutHeroPrimaryButton}
              href="/contact"
              trackingLabel="Book a Discovery Call"
              trackingLocation="about-hero"
            >
              Book a Discovery Call
            </ButtonLink>
            <ButtonLink
              className={styles.aboutHeroSecondaryButton}
              href="/work"
              trackingLabel="See Our Work"
              trackingLocation="about-hero"
              variant="secondary"
            >
              See Our Work
            </ButtonLink>
          </div>
        </div>

        <div
          aria-hidden="true"
          className={styles.aboutHeroIllustration}
          data-image-src={ABOUT_HERO_ILLUSTRATION_SRC}
          data-testid="about-hero-illustration"
        >
          <Image
            alt=""
            className={styles.aboutHeroIllustrationImage}
            priority
            sizes="(max-width: 899px) 130vw, 42vw"
            src={ABOUT_HERO_ILLUSTRATION_SRC}
            width={626}
            height={902}
          />
        </div>
      </div>
    </section>
  );
}
