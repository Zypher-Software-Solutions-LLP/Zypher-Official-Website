import Image from "next/image";
import styles from "./HeroSection.module.css";
import { ButtonLink } from "@/components/ui/ButtonLink";
const BACKGROUND_ILLUSTRATION_SRC = "/home/section-1/background-illustration.png";
const BACKGROUND_GRID_URL =
  "https://media.zypher-solutions.com/home-page/section-1/Background%20Grid.png";
const HERO_SUBJECT_URL =
  "https://media.zypher-solutions.com/home-page/section-1/Hero%20Section%20-%20Main%20Subject.png";
const HERO_SUBJECT_MOBILE_URL =
  "https://media.zypher-solutions.com/home-page/section-1/Hero%20section%20-%20Mobile.png";

export function HeroSection(): React.ReactNode {
  return (
    <section aria-labelledby="hero-title" className={styles.heroSection} data-testid="hero-section">
      <div
        aria-hidden="true"
        className={styles.heroBackground}
        data-layer="background-illustration"
        data-opacity="0.13"
        data-position="background"
        data-testid="hero-background"
      >
        <Image
          alt=""
          className={styles.heroBackgroundImage}
          fill
          priority
          sizes="100vw"
          src={BACKGROUND_ILLUSTRATION_SRC}
        />
      </div>

      <div
        aria-hidden="true"
        className={styles.heroGridOverlay + " " + styles.heroGridOverlayTopLeft}
        data-position="top-left"
        data-testid="hero-grid-overlay"
      >
        <div className={styles.heroGridOverlayCrop}>
          <Image
            alt=""
            className={styles.heroGridOverlayImage}
            fill
            sizes="(max-width: 900px) 75vw, 547px"
            src={BACKGROUND_GRID_URL}
          />
        </div>
      </div>

      <div
        aria-hidden="true"
        className={styles.heroSubject + " " + styles.heroSubjectAnchored}
        data-opacity="0.4"
        data-position="anchored"
        data-testid="hero-subject"
      >
        <div className={styles.heroSubjectImageCrop} data-testid="hero-subject-image-crop">
          <picture className={styles.heroSubjectPicture} data-testid="hero-subject-picture">
            <source media="(max-width: 767px)" srcSet={HERO_SUBJECT_MOBILE_URL} />
            <Image
              alt=""
              className={styles.heroSubjectImage}
              data-testid="hero-subject-image"
              fill
              priority
              sizes="(max-width: 480px) 180vw, (max-width: 899px) 120vw, 60.14vw"
              src={HERO_SUBJECT_URL}
            />
          </picture>
        </div>
      </div>

      <div className={styles.heroGrid + " " + styles.heroContent} data-testid="hero-grid">
        <div className={styles.heroCopy}>
          <h1
            aria-label="Solutions that move the way your business already does"
            className={styles.heroTitle}
            data-testid="hero-title"
            id="hero-title"
          >
            <span
              className={styles.heroTitleAccent + " " + styles.heroFade}
              data-testid="hero-title-accent"
            >
              Solutions that move
            </span>
            <span
              data-testid="hero-title-main"
              className={styles.heroTitleMain + " " + styles.heroFade + " " + styles.heroFadeDelay1}
            >
              the way your business already does
            </span>
          </h1>

          <p
            className={styles.heroDescription + " " + styles.heroFade + " " + styles.heroFadeDelay2}
            data-testid="hero-description"
          >
            No templates, no bolt-on features you&apos;ll never touch, just systems shaped around
            how you actually work, built by a team that stays in the room after launch.
          </p>

          <div
            className={styles.heroActions + " " + styles.heroFade + " " + styles.heroFadeDelay3}
            data-testid="hero-actions"
          >
            <ButtonLink
              className={styles.heroPrimaryButton}
              href="/contact"
              trackingLabel="Book a Discovery Call"
              trackingLocation="hero"
            >
              Book a Discovery Call
            </ButtonLink>
            <ButtonLink
              className={styles.heroSecondaryButton}
              href="/work"
              trackingLabel="See Our Work"
              trackingLocation="hero"
              variant="secondary"
            >
              See Our Work
            </ButtonLink>
          </div>
        </div>
      </div>
    </section>
  );
}
