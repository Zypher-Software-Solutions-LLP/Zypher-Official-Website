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
    description: "A working AI system scoped for production, not a proof of concept",
    imageAlt: "Production-scoped software system",
    imageSrc: "https://media.zypher-solutions.com/02-services-page/section-5/Pt%20-%201.webp",
  },
  {
    description:
      "Full codebase ownership, no vendor lock-in, no proprietary framework that traps you",
    imageAlt: "Codebase prepared for full ownership",
    imageSrc: "https://media.zypher-solutions.com/02-services-page/section-5/Pt%20-%202.webp",
  },
  {
    description:
      "Documented APIs your team or future partners can build on without reverse engineering",
    imageAlt: "Documented APIs for future development",
    imageSrc: "https://media.zypher-solutions.com/02-services-page/section-5/Pt%20-%203.webp",
  },
  {
    description:
      "A deployment pipeline that ships updates without downtime & catches problems before production",
    imageAlt: "Deployment pipeline for production updates",
    imageSrc: "https://media.zypher-solutions.com/02-services-page/section-5/Pt%20-%204.webp",
  },
  {
    description:
      "Environment configs, credentials, & infrastructure documentation your team controls",
    imageAlt: "Infrastructure documentation under team control",
    imageSrc: "https://media.zypher-solutions.com/02-services-page/section-5/Pt%20-%205.webp",
  },
  {
    description:
      "Handoff documentation written for the people maintaining the system, not the ones who built it",
    imageAlt: "Handoff documentation for the maintaining team",
    imageSrc: "https://media.zypher-solutions.com/02-services-page/section-5/Pt%20-%206.webp",
  },
];

export function SoftwareDevelopmentSectionFive(): ReactNode {
  return (
    <section
      aria-labelledby="software-development-section-five-title"
      className={styles.section}
      data-motion-section="true"
      data-testid="software-development-section-five"
      id="software-development-deliverables"
    >
      <div className={styles.surface} data-testid="software-development-section-five-surface">
        <div className={styles.content} data-motion-item="true">
          <header className={styles.header}>
            <div className={styles.introduction}>
              <h2
                aria-label="Production Ready. Fully Yours."
                className={styles.title}
                id="software-development-section-five-title"
              >
                <span>
                  Production <span className={styles.titleAccent}>Ready.</span>
                </span>
                <span>Fully Yours.</span>
              </h2>
              <p className={styles.description}>
                Every engagement ends with something your team can run, extend, and hand to anyone,
                without depending on us for every change or update.
              </p>
              <ButtonLink
                className={styles.buildsLink}
                href="/work"
                trackingLabel="See Our Builds"
                trackingLocation="software-development-deliverables"
                variant="secondary"
              >
                See Our Builds <span aria-hidden="true">→</span>
              </ButtonLink>
            </div>

            <h3
              className={styles.deliverablesTitle}
              id="software-development-section-five-deliverables-title"
            >
              Deliverables List
            </h3>
          </header>

          <ul
            aria-labelledby="software-development-section-five-deliverables-title"
            className={styles.grid}
            data-testid="software-development-section-five-grid"
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
