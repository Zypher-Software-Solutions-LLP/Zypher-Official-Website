import Image from "next/image";
import type { ReactNode } from "react";
import { ButtonLink } from "@/components/ui/ButtonLink";
import styles from "./AiLlmAutomationHeroSection.module.css";

const BACKGROUND_ILLUSTRATION_SRC = "/home/section-1/background-illustration.png";
const MOBILE_APP_DEVELOPMENT_HERO_ILLUSTRATION_SRC =
  "https://media.zypher-solutions.com/03-services-page/section-1/Hero%20Section.png";
const MOBILE_APP_DEVELOPMENT_DESCRIPTION =
  "From an idea on a napkin to a fully integrated app on iOS and Android, we build mobile products that connect to your existing systems, survive real usage, and don't need a full rebuild every time the OS updates.";

export function MobileAppDevelopmentHeroSection(): ReactNode {
  return (
    <section
      aria-labelledby="mobile-app-development-hero-title"
      className={styles.aiLlmHeroSection}
      data-testid="mobile-app-development-hero"
    >
      <div
        aria-hidden="true"
        className={styles.aiLlmHeroBackground}
        data-image-src={BACKGROUND_ILLUSTRATION_SRC}
        data-testid="mobile-app-development-hero-background"
      >
        <Image
          alt=""
          className={styles.aiLlmHeroBackgroundImage}
          fill
          priority
          sizes="100vw"
          src={BACKGROUND_ILLUSTRATION_SRC}
        />
      </div>

      <div className={styles.aiLlmHeroContent} data-motion-intro="true">
        <p className={styles.aiLlmHeroEyebrow} data-testid="mobile-app-development-hero-eyebrow">
          <span>MOBILE APP</span> <span className={styles.aiLlmHeroEyebrowAccent}>DEVELOPMENT</span>
        </p>

        <h1
          aria-label="Your app. Both platforms. One codebase that lasts."
          className={styles.aiLlmHeroTitle + " " + styles.softwareDevelopmentHeroTitle}
          data-testid="mobile-app-development-hero-title"
          id="mobile-app-development-hero-title"
        >
          <span className={styles.aiLlmHeroTitleAccent}>Your app.</span>{" "}
          <br className={styles.aiLlmHeroMobileBreak} />
          <span className={`${styles.aiLlmHeroTitleAccent} ${styles.aiLlmHeroMobileTitlePlain}`}>
            Both platforms.
          </span>
          <br className={styles.aiLlmHeroDesktopBreak} />
          <br className={styles.aiLlmHeroMobileBreak} />
          <span>One codebase that lasts.</span>
        </h1>

        <p
          className={styles.aiLlmHeroDescription}
          data-testid="mobile-app-development-hero-description"
        >
          {MOBILE_APP_DEVELOPMENT_DESCRIPTION}
        </p>

        <div className={styles.aiLlmHeroActions} data-testid="mobile-app-development-hero-actions">
          <ButtonLink
            className={styles.aiLlmHeroPrimaryButton}
            href="/contact"
            trackingLabel="Book a Discovery call"
            trackingLocation="mobile-app-development-hero"
          >
            Book a Discovery call
          </ButtonLink>
          <ButtonLink
            className={styles.aiLlmHeroSecondaryButton}
            href="/services/mobile-app-development#mobile-app-development-process"
            trackingLabel="See how we build"
            trackingLocation="mobile-app-development-hero"
            variant="secondary"
          >
            See how we build →
          </ButtonLink>
        </div>
      </div>

      <div
        aria-hidden="true"
        className={styles.aiLlmHeroIllustration}
        data-image-src={MOBILE_APP_DEVELOPMENT_HERO_ILLUSTRATION_SRC}
        data-testid="mobile-app-development-hero-illustration"
      >
        <Image
          alt=""
          className={styles.aiLlmHeroIllustrationImage}
          fill
          priority
          quality={100}
          sizes="(max-width: 47.999rem) 180vw, (max-width: 63.999rem) 145vw, 135vw"
          src={MOBILE_APP_DEVELOPMENT_HERO_ILLUSTRATION_SRC}
        />
      </div>
    </section>
  );
}
