import Image from "next/image";
import type { ReactNode } from "react";
import { ButtonLink } from "@/components/ui/ButtonLink";
import styles from "./AiLlmAutomationHeroSection.module.css";

const BACKGROUND_ILLUSTRATION_SRC = "/home/section-1/background-illustration.png";
const AI_LLM_HERO_ILLUSTRATION_SRC =
  "https://media.zypher-solutions.com/01-services-page/section-1/Hero%20Section.png";
const AI_LLM_DESCRIPTION =
  "From automating the manual work your team shouldn’t be doing to building intelligent systems that connect your entire operation, We engineer AI that fits how your business actually runs.";

export function AiLlmAutomationHeroSection(): ReactNode {
  return (
    <section
      aria-labelledby="ai-llm-hero-title"
      className={styles.aiLlmHeroSection}
      data-testid="ai-llm-hero"
    >
      <div
        aria-hidden="true"
        className={styles.aiLlmHeroBackground}
        data-image-src={BACKGROUND_ILLUSTRATION_SRC}
        data-testid="ai-llm-hero-background"
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
        <p className={styles.aiLlmHeroEyebrow} data-testid="ai-llm-hero-eyebrow">
          <span>AI &amp; LLM</span>{" "}
          <span className={styles.aiLlmHeroEyebrowAccent}>AUTOMATION</span>
        </p>

        <h1
          aria-label="AI that works inside your business. Not Alongside it."
          className={styles.aiLlmHeroTitle}
          data-testid="ai-llm-hero-title"
          id="ai-llm-hero-title"
        >
          <span className={styles.aiLlmHeroTitleAccent}>AI that works inside</span>{" "}
          <br className={styles.aiLlmHeroMobileBreak} />
          <span className={`${styles.aiLlmHeroTitleAccent} ${styles.aiLlmHeroMobileTitlePlain}`}>
            your
          </span>{" "}
          <br className={styles.aiLlmHeroDesktopBreak} />
          <span>business. Not</span> <br className={styles.aiLlmHeroMobileBreak} />
          <span>Alongside it.</span>
        </h1>

        <p className={styles.aiLlmHeroDescription} data-testid="ai-llm-hero-description">
          {AI_LLM_DESCRIPTION}
        </p>

        <div className={styles.aiLlmHeroActions} data-testid="ai-llm-hero-actions">
          <ButtonLink
            className={styles.aiLlmHeroPrimaryButton}
            href="/contact"
            trackingLabel="Book a Discovery Call"
            trackingLocation="ai-llm-automation-hero"
          >
            Book a Discovery Call
          </ButtonLink>
          <ButtonLink
            className={styles.aiLlmHeroSecondaryButton}
            href="/services#ai-automation"
            trackingLabel="See How We Build With AI"
            trackingLocation="ai-llm-automation-hero"
            variant="secondary"
          >
            See How We Build With AI →
          </ButtonLink>
        </div>
      </div>

      <div
        aria-hidden="true"
        className={styles.aiLlmHeroIllustration}
        data-image-src={AI_LLM_HERO_ILLUSTRATION_SRC}
        data-testid="ai-llm-hero-illustration"
      >
        <Image
          alt=""
          className={styles.aiLlmHeroIllustrationImage}
          fill
          priority
          quality={100}
          sizes="(max-width: 47.999rem) 180vw, (max-width: 63.999rem) 145vw, 135vw"
          src={AI_LLM_HERO_ILLUSTRATION_SRC}
        />
      </div>
    </section>
  );
}
