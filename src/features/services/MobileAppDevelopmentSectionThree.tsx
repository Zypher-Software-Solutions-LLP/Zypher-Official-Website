import Image from "next/image";
import type { ReactNode } from "react";
import { ButtonLink } from "@/components/ui/ButtonLink";
import styles from "./AiLlmAutomationSectionThree.module.css";

type CapabilityCard = {
  title: string;
  description: string;
  imageSrc: string;
};

const MOBILE_APP_DEVELOPMENT_SECTION_THREE_CARDS: CapabilityCard[] = [
  {
    title: "Cross Platform Mobile Apps",
    description:
      "Flutter first development that ships to iOS and Android from a single codebase. Near-native performance without the cost of maintaining two separate builds.",
    imageSrc: "https://media.zypher-solutions.com/03-services-page/section-3/Cross%20Platform.png",
  },
  {
    title: "Native iOS & Android",
    description:
      "Swift for iOS, Kotlin for Android, when platform-specific performance, hardware access, or deep OS integration makes native the right call.",
    imageSrc:
      "https://media.zypher-solutions.com/03-services-page/section-3/Native%20iOS%20%26%20Android.png",
  },
  {
    title: "App & Web Integration",
    description:
      "The same backend powering your app and your website. One data source, one authentication layer, one admin panel. Both your products working as one.",
    imageSrc:
      "https://media.zypher-solutions.com/03-services-page/section-3/App%20%26%20Web%20Integration.png",
  },
  {
    title: "Mobile UI UX Design",
    description:
      "Interfaces designed for how people actually use their phones, thumb-reach zones, gesture patterns, loading states and empty states that guide rather than confuse.",
    imageSrc:
      "https://media.zypher-solutions.com/03-services-page/section-3/Mobile%20UI%20UX%20Design.png",
  },
  {
    title: "Post Launch Support & Updates",
    description:
      "OS updates break things. User behavior reveals gaps. New features get requested. We offer defined post-launch support scopes so your app stays functional.",
    imageSrc:
      "https://media.zypher-solutions.com/03-services-page/section-3/Post%20Launch%20Support.png",
  },
];

const MOBILE_APP_DEVELOPMENT_SECTION_THREE_CTA_IMAGE_SRC =
  "https://media.zypher-solutions.com/01-services-page/section-3/Something%20else%20entirely.png";

const IMAGE_SIZES =
  "(max-width: 39.999rem) calc(100vw - 2rem), (max-width: 48rem) calc((100vw - 3rem) / 2), (max-width: 63.999rem) calc((100vw - 6.5rem) / 3), 270px";

export function MobileAppDevelopmentSectionThree(): ReactNode {
  return (
    <section
      aria-labelledby="mobile-app-development-section-three-title"
      className={styles.section}
      data-motion-section="true"
      data-testid="mobile-app-development-section-three"
    >
      <svg
        aria-hidden="true"
        className={`${styles.boundary} ${styles.boundaryTop}`}
        data-testid="mobile-app-development-section-three-boundary-top"
        preserveAspectRatio="none"
        viewBox="0 0 1440 140"
      >
        <path
          d="M0 28 C220 8 430 8 690 48 C920 82 1220 74 1440 32 L1440 140 L0 140 Z"
          fill="var(--color-brand-dark)"
        />
      </svg>

      <svg
        aria-hidden="true"
        className={`${styles.boundary} ${styles.boundaryBottom}`}
        data-testid="mobile-app-development-section-three-boundary-bottom"
        preserveAspectRatio="none"
        viewBox="0 0 1440 140"
      >
        <path
          d="M0 86 C220 66 430 66 690 106 C920 140 1220 132 1440 90 L1440 0 L0 0 Z"
          fill="var(--color-brand-dark)"
        />
      </svg>

      <div
        aria-hidden="true"
        className={styles.surface}
        data-testid="mobile-app-development-section-three-surface"
      />

      <div className={styles.shell} data-motion-item="true">
        <header className={styles.header}>
          <h2 className={styles.heading} id="mobile-app-development-section-three-title">
            <span>Five core capabilities.</span>{" "}
            <span className={styles.headingAccent + " " + styles.softwareHeadingAccent}>
              Shipped to both platforms.
            </span>
          </h2>
          <p className={styles.intro}>
            These aren&apos;t the only things we build, but they&apos;re where most mobile
            engagements start.
          </p>
        </header>

        <div className={styles.grid} data-testid="mobile-app-development-section-three-cards">
          {MOBILE_APP_DEVELOPMENT_SECTION_THREE_CARDS.map((card) => (
            <article className={styles.card} key={card.title}>
              <div aria-hidden="true" className={styles.imageFrame}>
                <Image
                  alt=""
                  className={styles.image}
                  fill
                  quality={100}
                  sizes={IMAGE_SIZES}
                  src={card.imageSrc}
                />
              </div>
              <div className={styles.cardBody}>
                <h3 className={styles.cardTitle}>{card.title}</h3>
                <p className={styles.cardDescription}>{card.description}</p>
              </div>
            </article>
          ))}

          <article className={`${styles.card} ${styles.ctaCard}`}>
            <div aria-hidden="true" className={styles.imageFrame}>
              <Image
                alt=""
                className={styles.image}
                fill
                quality={100}
                sizes={IMAGE_SIZES}
                src={MOBILE_APP_DEVELOPMENT_SECTION_THREE_CTA_IMAGE_SRC}
              />
            </div>
            <div className={styles.cardBody}>
              <h3 className={styles.cardTitle}>Something else entirely?</h3>
              <p className={styles.cardDescription}>
                If the problem is real, we&apos;ll scope it. Every engagement starts with a
                conversation.
              </p>
              <ButtonLink
                className={styles.ctaButton}
                href="/contact"
                trackingLabel="Get in touch"
                trackingLocation="mobile-app-development-capabilities"
              >
                Get in touch
              </ButtonLink>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
