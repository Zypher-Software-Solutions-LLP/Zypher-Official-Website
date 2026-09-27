import Image from "next/image";
import type { ReactNode } from "react";
import { ButtonLink } from "@/components/ui/ButtonLink";
import styles from "./AiLlmAutomationHeroSection.module.css";

const BACKGROUND_ILLUSTRATION_SRC = "/home/section-1/background-illustration.png";
const CRM_ERP_SOLUTIONS_HERO_ILLUSTRATION_SRC =
  "https://media.zypher-solutions.com/05-services-page/section-1/Hero%20Section.png";
const CRM_ERP_SOLUTIONS_DESCRIPTION =
  "Whether you need a platform configured to how your business actually runs or a system built from scratch, we map your workflow first, then build or configure around it.";

export function CrmErpSolutionsHeroSection(): ReactNode {
  return (
    <section
      aria-labelledby="crm-erp-solutions-hero-title"
      className={styles.aiLlmHeroSection}
      data-testid="crm-erp-solutions-hero"
    >
      <div
        aria-hidden="true"
        className={styles.aiLlmHeroBackground}
        data-image-src={BACKGROUND_ILLUSTRATION_SRC}
        data-testid="crm-erp-solutions-hero-background"
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
        <p className={styles.aiLlmHeroEyebrow} data-testid="crm-erp-solutions-hero-eyebrow">
          <span>CRM / ERP</span> <span className={styles.aiLlmHeroEyebrowAccent}>SOLUTIONS</span>
        </p>

        <h1
          aria-label="Your operations. Finally in one place."
          className={styles.aiLlmHeroTitle + " " + styles.softwareDevelopmentHeroTitle}
          data-testid="crm-erp-solutions-hero-title"
          id="crm-erp-solutions-hero-title"
        >
          <span className={styles.aiLlmHeroTitleAccent}>Your operations.</span>
          <br className={styles.aiLlmHeroDesktopBreak} />
          <br className={styles.aiLlmHeroMobileBreak} />
          <span>Finally in one place.</span>
        </h1>

        <p className={styles.aiLlmHeroDescription} data-testid="crm-erp-solutions-hero-description">
          {CRM_ERP_SOLUTIONS_DESCRIPTION}
        </p>

        <div className={styles.aiLlmHeroActions} data-testid="crm-erp-solutions-hero-actions">
          <ButtonLink
            className={styles.aiLlmHeroPrimaryButton}
            href="/contact"
            trackingLabel="Book a Discovery call"
            trackingLocation="crm-erp-solutions-hero"
          >
            Book a Discovery call
          </ButtonLink>
          <ButtonLink
            className={styles.aiLlmHeroSecondaryButton}
            href="/services/crm-erp-solutions#crm-erp-solutions-process"
            trackingLabel="See how we build"
            trackingLocation="crm-erp-solutions-hero"
            variant="secondary"
          >
            See how we build →
          </ButtonLink>
        </div>
      </div>

      <div
        aria-hidden="true"
        className={styles.aiLlmHeroIllustration}
        data-image-src={CRM_ERP_SOLUTIONS_HERO_ILLUSTRATION_SRC}
        data-testid="crm-erp-solutions-hero-illustration"
      >
        <Image
          alt=""
          className={styles.aiLlmHeroIllustrationImage}
          fill
          priority
          quality={100}
          sizes="(max-width: 47.999rem) 180vw, (max-width: 63.999rem) 145vw, 135vw"
          src={CRM_ERP_SOLUTIONS_HERO_ILLUSTRATION_SRC}
        />
      </div>
    </section>
  );
}
