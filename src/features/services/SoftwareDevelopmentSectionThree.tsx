import Image from "next/image";
import type { ReactNode } from "react";
import { ButtonLink } from "@/components/ui/ButtonLink";
import styles from "./AiLlmAutomationSectionThree.module.css";

type CapabilityCard = {
  title: string;
  description: string;
  imageSrc: string;
};

const SOFTWARE_DEVELOPMENT_SECTION_THREE_CARDS: CapabilityCard[] = [
  {
    title: "Custom Web Applications",
    description:
      "Built around your business logic, not a template’s limitations. From internal tools to customer-facing platforms. Scope to what you actually need.",
    imageSrc:
      "https://media.zypher-solutions.com/02-services-page/section-3/Custom%20Web%20Applications.png",
  },
  {
    title: "API Development & Integration",
    description:
      "APIs your team can build on and your partners can connect to. Documented, versioned, and designed to handle what actually happens in production.",
    imageSrc: "https://media.zypher-solutions.com/02-services-page/section-3/API%20Development.png",
  },
  {
    title: "Cloud Native Infrastructure",
    description:
      "Infrastructure built to scale with the product, not retrofitted after it breaks. Designed for the load you will have in the future, not just today.",
    imageSrc: "https://media.zypher-solutions.com/02-services-page/section-3/Cloud%20Native.png",
  },
  {
    title: "DevOps & CI/CD",
    description:
      "Deployment pipelines that ship updates without downtime and catch problems before they reach production.",
    imageSrc: "https://media.zypher-solutions.com/02-services-page/section-3/DevOps.png",
  },
  {
    title: "Legacy System Modernisation",
    description:
      "Replacing or extending a system that’s become a bottleneck without burning down what already works. We migrate incrementally.",
    imageSrc: "https://media.zypher-solutions.com/02-services-page/section-3/Legacy%20System.png",
  },
];

const SOFTWARE_DEVELOPMENT_SECTION_THREE_CTA_IMAGE_SRC =
  "https://media.zypher-solutions.com/01-services-page/section-3/Something%20else%20entirely.png";

const IMAGE_SIZES =
  "(max-width: 39.999rem) calc(100vw - 2rem), (max-width: 48rem) calc((100vw - 3rem) / 2), (max-width: 63.999rem) calc((100vw - 6.5rem) / 3), 270px";

export function SoftwareDevelopmentSectionThree(): ReactNode {
  return (
    <section
      aria-labelledby="software-development-section-three-title"
      className={styles.section}
      data-motion-section="true"
      data-testid="software-development-section-three"
    >
      <svg
        aria-hidden="true"
        className={`${styles.boundary} ${styles.boundaryTop}`}
        data-testid="software-development-section-three-boundary-top"
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
        data-testid="software-development-section-three-boundary-bottom"
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
        data-testid="software-development-section-three-surface"
      />

      <div className={styles.shell} data-motion-item="true">
        <header className={styles.header}>
          <h2 className={styles.heading} id="software-development-section-three-title">
            <span>Five core capabilities.</span>{" "}
            <span className={styles.headingAccent + " " + styles.softwareHeadingAccent}>
              Every one production-ready.
            </span>
          </h2>
          <p className={styles.intro}>
            These aren’t the only things we build, but they’re where most engagements start
          </p>
        </header>

        <div className={styles.grid} data-testid="software-development-section-three-cards">
          {SOFTWARE_DEVELOPMENT_SECTION_THREE_CARDS.map((card) => (
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
                src={SOFTWARE_DEVELOPMENT_SECTION_THREE_CTA_IMAGE_SRC}
              />
            </div>
            <div className={styles.cardBody}>
              <h3 className={styles.cardTitle}>Something else entirely?</h3>
              <p className={styles.cardDescription}>
                If the problem is real, we’ll scope it. Every engagement starts with a conversation.
              </p>
              <ButtonLink
                className={styles.ctaButton}
                href="/contact"
                trackingLabel="Get in touch"
                trackingLocation="software-development-capabilities"
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
