import Image from "next/image";
import type { ReactNode } from "react";
import { ButtonLink } from "@/components/ui/ButtonLink";
import styles from "./ServicesHeroSection.module.css";

const BACKGROUND_ILLUSTRATION_SRC = "/home/section-1/background-illustration.png";
const SERVICES_ILLUSTRATION_SRC =
  "https://media.zypher-solutions.com/services-page/hero-section/Hero%20Section%20Illustration.png";
const SERVICES_DESCRIPTION =
  "From your first idea to the system running in production, every capability below works together under one team, not ten different vendors stitched into your project.";

export function ServicesHeroSection(): ReactNode {
  return (
    <section
      aria-labelledby="services-hero-title"
      className={styles.servicesHeroSection}
      data-testid="services-hero"
    >
      <div className={styles.servicesHeroSurface} data-testid="services-hero-surface">
        <div
          aria-hidden="true"
          className={styles.servicesHeroBackground}
          data-image-src={BACKGROUND_ILLUSTRATION_SRC}
          data-testid="services-hero-background"
        >
          <Image
            alt=""
            className={styles.servicesHeroBackgroundImage}
            fill
            priority
            sizes="100vw"
            src={BACKGROUND_ILLUSTRATION_SRC}
          />
        </div>

        <div className={styles.servicesHeroGrid} data-testid="services-hero-grid">
          <div className={styles.servicesHeroCopy}>
            <p
              className={styles.servicesHeroEyebrow + " " + styles.servicesHeroFade}
              data-testid="services-hero-eyebrow"
            >
              <span data-testid="services-eyebrow-what">WHAT</span>{" "}
              <span
                className={styles.servicesHeroEyebrowAccent}
                data-testid="services-eyebrow-we-do"
              >
                WE DO
              </span>
            </p>

            <h1
              aria-label="End to end software, engineered with AI at the core"
              className={styles.servicesHeroTitle}
              data-testid="services-hero-title"
              id="services-hero-title"
            >
              <span
                className={
                  styles.servicesHeroTitleAccent +
                  " " +
                  styles.servicesHeroFade +
                  " " +
                  styles.servicesHeroFadeDelay1
                }
              >
                End to end software,
              </span>
              <span className={styles.servicesHeroFade + " " + styles.servicesHeroFadeDelay2}>
                engineered with AI
              </span>
              <span className={styles.servicesHeroFade + " " + styles.servicesHeroFadeDelay3}>
                at the core
              </span>
            </h1>

            <p
              className={
                styles.servicesHeroDescription +
                " " +
                styles.servicesHeroFade +
                " " +
                styles.servicesHeroFadeDelay4
              }
              data-testid="services-hero-description"
            >
              {SERVICES_DESCRIPTION}
            </p>

            <div
              className={
                styles.servicesHeroActions +
                " " +
                styles.servicesHeroFade +
                " " +
                styles.servicesHeroFadeDelay5
              }
              data-testid="services-hero-actions"
            >
              <ButtonLink
                className={styles.servicesHeroPrimaryButton}
                href="#service-lines"
                trackingLabel="See Our Services"
                trackingLocation="services-hero"
              >
                See Our Services →
              </ButtonLink>
              <ButtonLink
                className={styles.servicesHeroSecondaryButton}
                href="/services/ai-llm-automation"
                trackingLabel="See How We Build With AI"
                trackingLocation="services-hero"
                variant="secondary"
              >
                See How We Build With AI →
              </ButtonLink>
            </div>
          </div>

          <div
            aria-hidden="true"
            className={styles.servicesHeroIllustration}
            data-image-src={SERVICES_ILLUSTRATION_SRC}
            data-testid="services-hero-illustration"
          >
            <Image
              alt=""
              className={styles.servicesHeroIllustrationImage}
              fill
              priority
              sizes="(max-width: 1199px) 38vw, 35vw"
              src={SERVICES_ILLUSTRATION_SRC}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
