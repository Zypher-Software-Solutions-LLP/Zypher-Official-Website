import Image from "next/image";
import type { ReactNode } from "react";
import { ButtonLink } from "@/components/ui/ButtonLink";
import styles from "./AiLlmAutomationHeroSection.module.css";

const BACKGROUND_ILLUSTRATION_SRC = "/home/section-1/background-illustration.png";
const SOFTWARE_DEVELOPMENT_HERO_ILLUSTRATION_SRC =
  "https://media.zypher-solutions.com/02-services-page/section-1/Hero%20Section.png";
const SOFTWARE_DEVELOPMENT_DESCRIPTION =
  "From a single internal tool to a full-scale platform, we build software that fits your actual process, connects to your existing systems, and ships ready to run in production, not just in a demo environment.";

export function SoftwareDevelopmentHeroSection(): ReactNode {
  return (
    <section
      aria-labelledby="software-development-hero-title"
      className={styles.aiLlmHeroSection}
      data-testid="software-development-hero"
    >
      <div
        aria-hidden="true"
        className={styles.aiLlmHeroBackground}
        data-image-src={BACKGROUND_ILLUSTRATION_SRC}
        data-testid="software-development-hero-background"
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
        <p className={styles.aiLlmHeroEyebrow} data-testid="software-development-hero-eyebrow">
          <span>SOFTWARE</span> <span className={styles.aiLlmHeroEyebrowAccent}>DEVELOPMENT</span>
        </p>

        <h1
          aria-label="Built around how your business actually runs. Not a template it has to adapt to."
          className={styles.aiLlmHeroTitle + " " + styles.softwareDevelopmentHeroTitle}
          data-testid="software-development-hero-title"
          id="software-development-hero-title"
        >
          <span className={styles.aiLlmHeroTitleAccent}>Built around how your</span>{" "}
          <br className={styles.aiLlmHeroMobileBreak} />
          <span className={`${styles.aiLlmHeroTitleAccent} ${styles.aiLlmHeroMobileTitlePlain}`}>
            business
          </span>{" "}
          <br className={styles.aiLlmHeroDesktopBreak} />
          <span>actually runs.</span> <br className={styles.aiLlmHeroMobileBreak} />
          <span>Not a template</span>
          <br className={styles.aiLlmHeroDesktopBreak} />
          <br className={styles.aiLlmHeroMobileBreak} />
          <span>it has to adapt to.</span>
        </h1>

        <p
          className={styles.aiLlmHeroDescription}
          data-testid="software-development-hero-description"
        >
          {SOFTWARE_DEVELOPMENT_DESCRIPTION}
        </p>

        <div className={styles.aiLlmHeroActions} data-testid="software-development-hero-actions">
          <ButtonLink
            className={styles.aiLlmHeroPrimaryButton}
            href="/contact"
            trackingLabel="Book a Discovery call"
            trackingLocation="software-development-hero"
          >
            Book a Discovery call
          </ButtonLink>
          <ButtonLink
            className={styles.aiLlmHeroSecondaryButton}
            href="/services/software-development#software-development-process"
            trackingLabel="See how we build"
            trackingLocation="software-development-hero"
            variant="secondary"
          >
            See how we build →
          </ButtonLink>
        </div>
      </div>

      <div
        aria-hidden="true"
        className={styles.aiLlmHeroIllustration}
        data-image-src={SOFTWARE_DEVELOPMENT_HERO_ILLUSTRATION_SRC}
        data-testid="software-development-hero-illustration"
      >
        <Image
          alt=""
          className={styles.aiLlmHeroIllustrationImage}
          fill
          priority
          quality={100}
          sizes="(max-width: 47.999rem) 180vw, (max-width: 63.999rem) 145vw, 135vw"
          src={SOFTWARE_DEVELOPMENT_HERO_ILLUSTRATION_SRC}
        />
      </div>
    </section>
  );
}
