import Image from "next/image";
import styles from "./HeroSection.module.css";
import { ButtonLink } from "@/components/ui/ButtonLink";

const HERO_BACKGROUND_URL =
  "https://media.zypher-solutions.com/home-page/section-1/Background%20PC%20Image.webp";
const HERO_BACKGROUND_MOBILE_URL =
  "https://media.zypher-solutions.com/home-page/section-1/Background%20Mobile%20Image.webp";

export function HeroSection(): React.ReactNode {
  return (
    <section aria-labelledby="hero-title" className={styles.heroSection} data-testid="hero-section">
      <div
        aria-hidden="true"
        className={styles.heroBackground}
        data-layer="background-illustration"
        data-position="background"
        data-testid="hero-background"
      >
        <picture className={styles.heroBackgroundPicture} data-testid="hero-background-picture">
          <source
            media="(max-width: 899px), (orientation: portrait) and (max-width: 1180px)"
            srcSet={HERO_BACKGROUND_MOBILE_URL}
          />
          <Image
            alt=""
            className={styles.heroBackgroundImage}
            data-testid="hero-background-image"
            fill
            priority
            sizes="100vw"
            src={HERO_BACKGROUND_URL}
          />
        </picture>
      </div>

      <div
        className={styles.heroGrid + " " + styles.heroContent}
        data-motion-intro="true"
        data-testid="hero-grid"
      >
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
              <span className={styles.heroTitleLine}>the way your business</span>
              <span className={styles.heroTitleLine}>already does</span>
            </span>
          </h1>

          <p
            className={styles.heroDescription + " " + styles.heroFade + " " + styles.heroFadeDelay2}
            data-testid="hero-description"
          >
            Zypher builds custom AI Workflows, websites, software, mobile apps for businesses that
            need solutions shaped around how they actually work.
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
