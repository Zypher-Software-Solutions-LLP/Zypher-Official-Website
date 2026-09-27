import Image from "next/image";
import type { ReactNode } from "react";
import { ButtonLink } from "@/components/ui/ButtonLink";
import styles from "./AiLlmAutomationHeroSection.module.css";
import designStyles from "./DesignCreativeTypography.module.css";

const BACKGROUND_ILLUSTRATION_SRC = "/home/section-1/background-illustration.png";
const DESIGN_CREATIVE_HERO_ILLUSTRATION_SRC =
  "https://media.zypher-solutions.com/04-services-page/section-1/Hero%20Section.png";
const DESIGN_CREATIVE_DESCRIPTION =
  "From wireframe to brand identity, we design products and visuals that work for the people using them, not just the people approving them. Research first. Craft second. Delivered ready to build or go live.";

export function DesignCreativeHeroSection(): ReactNode {
  return (
    <section
      aria-labelledby="design-creative-hero-title"
      className={styles.aiLlmHeroSection}
      data-testid="design-creative-hero"
    >
      <div
        aria-hidden="true"
        className={styles.aiLlmHeroBackground}
        data-image-src={BACKGROUND_ILLUSTRATION_SRC}
        data-testid="design-creative-hero-background"
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
        <p className={styles.aiLlmHeroEyebrow} data-testid="design-creative-hero-eyebrow">
          <span>DESIGN &amp;</span> <span className={styles.aiLlmHeroEyebrowAccent}>CREATIVE</span>
        </p>

        <h1
          aria-label="Designed for how people actually use it. Not how it looks in a presentation."
          className={`${styles.aiLlmHeroTitle} ${styles.softwareDevelopmentHeroTitle} ${designStyles.designCreativeHeroTitle}`}
          data-testid="design-creative-hero-title"
          id="design-creative-hero-title"
        >
          <span className={styles.aiLlmHeroTitleAccent}>
            Designed for how people <br className={styles.aiLlmHeroMobileBreak} />
            <span className={styles.aiLlmHeroMobileTitlePlain}>actually use it.</span>
          </span>{" "}
          <br className={styles.aiLlmHeroDesktopBreak} />
          <span>Not how</span> <br className={styles.aiLlmHeroMobileBreak} />
          <span>it looks in</span> <span>a presentation.</span>
        </h1>

        <p className={styles.aiLlmHeroDescription} data-testid="design-creative-hero-description">
          {DESIGN_CREATIVE_DESCRIPTION}
        </p>

        <div className={styles.aiLlmHeroActions} data-testid="design-creative-hero-actions">
          <ButtonLink
            className={styles.aiLlmHeroPrimaryButton}
            href="/contact"
            trackingLabel="Book a Discovery call"
            trackingLocation="design-creative-hero"
          >
            Book a Discovery call
          </ButtonLink>
          <ButtonLink
            className={styles.aiLlmHeroSecondaryButton}
            href="/services/design-creative#design-creative-process"
            trackingLabel="See how we build"
            trackingLocation="design-creative-hero"
            variant="secondary"
          >
            See how we build →
          </ButtonLink>
        </div>
      </div>

      <div
        aria-hidden="true"
        className={styles.aiLlmHeroIllustration}
        data-image-src={DESIGN_CREATIVE_HERO_ILLUSTRATION_SRC}
        data-testid="design-creative-hero-illustration"
      >
        <Image
          alt=""
          className={styles.aiLlmHeroIllustrationImage}
          fill
          priority
          quality={100}
          sizes="(max-width: 47.999rem) 180vw, (max-width: 63.999rem) 145vw, 135vw"
          src={DESIGN_CREATIVE_HERO_ILLUSTRATION_SRC}
        />
      </div>
    </section>
  );
}
