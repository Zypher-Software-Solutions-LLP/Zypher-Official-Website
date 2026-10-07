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
    imageAlt: "Server stack representing a production-scoped AI system",
    imageSrc: "https://media.zypher-solutions.com/01-services-page/section-5/Pt%20-%201.webp",
  },
  {
    description:
      "Full ownership at handoff: code, prompts, configs, everything. No lock-in, no ongoing dependency on us.",
    imageAlt: "Code and configuration prepared for handoff",
    imageSrc: "https://media.zypher-solutions.com/01-services-page/section-5/Pt%20-%202.webp",
  },
  {
    description:
      "Integration with your existing tools and data sources, tested against real inputs",
    imageAlt: "AI system connected to existing tools and data sources",
    imageSrc: "https://media.zypher-solutions.com/01-services-page/section-5/Pt%20-%203.webp",
  },
  {
    description: "Documented prompts, configs, and system logic your team can read and modify",
    imageAlt: "Readable prompts, configurations, and system documentation",
    imageSrc: "https://media.zypher-solutions.com/01-services-page/section-5/Pt%20-%204.webp",
  },
  {
    description:
      "Defined fail-safes and edge case handling, the system knows what to do when the unexpected happens",
    imageAlt: "Workflow safeguards for unexpected cases",
    imageSrc: "https://media.zypher-solutions.com/01-services-page/section-5/Pt%20-%205.webp",
  },
  {
    description:
      "Handoff documentation written for the people maintaining it, not the people who built it",
    imageAlt: "Documentation prepared for the team maintaining the system",
    imageSrc: "https://media.zypher-solutions.com/01-services-page/section-5/Pt%20-%206.webp",
  },
];

export function AiLlmAutomationSectionFive(): ReactNode {
  return (
    <section
      aria-labelledby="ai-llm-section-five-title"
      className={styles.section}
      data-motion-section="true"
      data-testid="ai-llm-section-five"
      id="ai-llm-automation-deliverables"
    >
      <div className={styles.surface} data-testid="ai-llm-section-five-surface">
        <div className={styles.content} data-motion-item="true">
          <header className={styles.header}>
            <div className={styles.introduction}>
              <h2
                aria-label="Production Ready. Not demo-ready"
                className={styles.title}
                id="ai-llm-section-five-title"
              >
                <span>
                  Production <span className={styles.titleAccent}>Ready.</span>
                </span>
                <span>Not demo-ready</span>
              </h2>
              <p className={styles.description}>
                Every engagement ends with something your team can run, maintain, and build on,
                without depending on us for every update.
              </p>
              <ButtonLink
                className={styles.buildsLink}
                href="/work"
                trackingLabel="See Our Builds"
                trackingLocation="ai-llm-automation-deliverables"
                variant="secondary"
              >
                See Our Builds <span aria-hidden="true">→</span>
              </ButtonLink>
            </div>

            <h3 className={styles.deliverablesTitle} id="ai-llm-section-five-deliverables-title">
              Deliverables List
            </h3>
          </header>

          <ul
            aria-labelledby="ai-llm-section-five-deliverables-title"
            className={styles.grid}
            data-testid="ai-llm-section-five-grid"
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
