import Image from "next/image";
import type { ReactNode } from "react";
import { ButtonLink } from "@/components/ui/ButtonLink";
import styles from "./AiLlmAutomationSectionFive.module.css";

type Deliverable = {
  description: string;
  imageAlt: string;
  imageSrc: string;
};

const DELIVERABLES: readonly Deliverable[] = [
  {
    description: "A production ready app live in App Store and Google Play, not a TestFlight build",
    imageAlt: "Production-ready mobile app live in both stores",
    imageSrc: "https://media.zypher-solutions.com/03-services-page/section-5/Pt%20-%201.webp",
  },
  {
    description:
      "Full codebase ownership, Flutter or native, no proprietary wrapper that locks you in",
    imageAlt: "Mobile codebase prepared for full ownership",
    imageSrc: "https://media.zypher-solutions.com/03-services-page/section-5/Pt%20-%202.webp",
  },
  {
    description: "Backend and API documentation your team or future developers can build on",
    imageAlt: "Backend and API documentation for future development",
    imageSrc: "https://media.zypher-solutions.com/03-services-page/section-5/Pt%20-%203.webp",
  },
  {
    description: "App store assets, metadata and submission handled as part of the engagement",
    imageAlt: "App store assets and submission materials",
    imageSrc: "https://media.zypher-solutions.com/03-services-page/section-5/Pt%20-%204.webp",
  },
  {
    description: "Tested across real devices and OS versions, not just emulators",
    imageAlt: "Mobile app tested across real devices",
    imageSrc: "https://media.zypher-solutions.com/03-services-page/section-5/Pt%20-%205.webp",
  },
  {
    description: "Handoff-ready documentation and post-launch support defined upfront",
    imageAlt: "Handoff documentation and post-launch support plan",
    imageSrc: "https://media.zypher-solutions.com/03-services-page/section-5/Pt%20-6.webp",
  },
];

export function MobileAppDevelopmentSectionFive(): ReactNode {
  return (
    <section
      aria-labelledby="mobile-app-development-section-five-title"
      className={styles.section}
      data-motion-section="true"
      data-testid="mobile-app-development-section-five"
      id="mobile-app-development-deliverables"
    >
      <div className={styles.surface} data-testid="mobile-app-development-section-five-surface">
        <div className={styles.content} data-motion-item="true">
          <header className={styles.header}>
            <div className={styles.introduction}>
              <h2
                aria-label="Live on both stores. Fully yours."
                className={styles.title}
                id="mobile-app-development-section-five-title"
              >
                <span>Live on both stores.</span>
                <span className={styles.titleAccent}>Fully yours.</span>
              </h2>
              <p className={styles.description}>
                Every engagement ends with a working app on the App Store and Google Play, owned &
                documented for whoever maintains it.
              </p>
              <ButtonLink
                className={styles.buildsLink}
                href="/work"
                trackingLabel="See Our Builds"
                trackingLocation="mobile-app-development-deliverables"
                variant="secondary"
              >
                See Our Builds <span aria-hidden="true">→</span>
              </ButtonLink>
            </div>

            <h3
              className={styles.deliverablesTitle}
              id="mobile-app-development-section-five-deliverables-title"
            >
              Deliverables List
            </h3>
          </header>

          <ul
            aria-labelledby="mobile-app-development-section-five-deliverables-title"
            className={styles.grid}
            data-testid="mobile-app-development-section-five-grid"
          >
            {DELIVERABLES.map((deliverable) => (
              <li className={styles.card} key={deliverable.imageSrc}>
                <div className={styles.artwork}>
                  <Image
                    alt={deliverable.imageAlt}
                    className={styles.image}
                    fill
                    sizes="(max-width: 47.999rem) 7rem, 8.4375rem"
                    src={deliverable.imageSrc}
                  />
                </div>
                <p className={styles.cardDescription}>{deliverable.description}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
