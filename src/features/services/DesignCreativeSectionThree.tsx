import Image from "next/image";
import type { ReactNode } from "react";
import { ButtonLink } from "@/components/ui/ButtonLink";
import styles from "./AiLlmAutomationSectionThree.module.css";

type CapabilityCard = {
  title: string;
  description: string;
  imageSrc: string;
};

const DESIGN_CREATIVE_SECTION_THREE_CARDS: CapabilityCard[] = [
  {
    title: "User Research & Prototyping",
    description:
      "We study the people using your product before designing a single screen. Behavioral patterns, pain points, and what competitors get wrong.",
    imageSrc: "https://media.zypher-solutions.com/04-services-page/section-3/User%20Research.webp",
  },
  {
    title: "Product Design (Web & Mobile)",
    description:
      "Interfaces designed for how people actually navigate, thumb zones, scroll behavior, and moments where users decide to stay or leave. Built for the platform, not adapted after.",
    imageSrc: "https://media.zypher-solutions.com/04-services-page/section-3/Product%20Design.webp",
  },
  {
    title: "Design Systems & Libraries",
    description:
      "A single source of truth for every visual decision in your product. Components, tokens, spacing rules, and interaction patterns. Documented and ready for developers.",
    imageSrc: "https://media.zypher-solutions.com/04-services-page/section-3/Design%20Systems.webp",
  },
  {
    title: "Motion, Video & Creative",
    description:
      "Video editing, motion graphics, 3D rendering, and animation from social content to brand films. Built in After Effects, DaVinci Resolve, and Lottie.",
    imageSrc: "https://media.zypher-solutions.com/04-services-page/section-3/Motion.webp",
  },
  {
    title: "Branding & Creative Production",
    description:
      "Logo, color system, typography, brand guidelines, graphic design, and print, built from scratch or refined from what exists.",
    imageSrc: "https://media.zypher-solutions.com/04-services-page/section-3/Branding.webp",
  },
];

const DESIGN_CREATIVE_SECTION_THREE_CTA_IMAGE_SRC =
  "https://media.zypher-solutions.com/01-services-page/section-3/Something%20else%20entirely.webp";

const IMAGE_SIZES =
  "(max-width: 39.999rem) calc(100vw - 2rem), (max-width: 48rem) calc((100vw - 3rem) / 2), (max-width: 63.999rem) calc((100vw - 6.5rem) / 3), 270px";

export function DesignCreativeSectionThree(): ReactNode {
  return (
    <section
      aria-labelledby="design-creative-section-three-title"
      className={styles.section}
      data-motion-section="true"
      data-testid="design-creative-section-three"
    >
      <svg
        aria-hidden="true"
        className={`${styles.boundary} ${styles.boundaryTop}`}
        data-testid="design-creative-section-three-boundary-top"
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
        data-testid="design-creative-section-three-boundary-bottom"
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
        data-testid="design-creative-section-three-surface"
      />

      <div className={styles.shell} data-motion-item="true">
        <header className={styles.header}>
          <h2 className={styles.heading} id="design-creative-section-three-title">
            <span>Five core capabilities.</span>{" "}
            <span className={styles.headingAccent + " " + styles.softwareHeadingAccent}>
              Every one built to last.
            </span>
          </h2>
          <p className={styles.intro}>
            These aren&apos;t the only things we design, but they&apos;re where most engagements
            start.
          </p>
        </header>

        <div className={styles.grid} data-testid="design-creative-section-three-cards">
          {DESIGN_CREATIVE_SECTION_THREE_CARDS.map((card) => (
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
                src={DESIGN_CREATIVE_SECTION_THREE_CTA_IMAGE_SRC}
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
                trackingLocation="design-creative-capabilities"
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
