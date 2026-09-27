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
    description:
      "Developer-ready Figma files. Every component named, designed, and ready to build without interpretation",
    imageAlt: "Developer-ready Figma design files",
    imageSrc: "https://media.zypher-solutions.com/04-services-page/section-5/Pt%20-%201.png",
  },
  {
    description:
      "Color tokens, typography scale, spacing rules, and a library your team can extend",
    imageAlt: "Design tokens and component library",
    imageSrc: "https://media.zypher-solutions.com/04-services-page/section-5/Pt%20-%202.png",
  },
  {
    description:
      "Edited video files, motion graphics, and animation exports, production-ready in the formats your platforms need",
    imageAlt: "Production-ready motion and video exports",
    imageSrc: "https://media.zypher-solutions.com/04-services-page/section-5/Pt%20-%203.png",
  },
  {
    description:
      "Logo, color system, typography, and brand guidelines documented for consistent use",
    imageAlt: "Documented brand identity system",
    imageSrc: "https://media.zypher-solutions.com/04-services-page/section-5/Pt%20-%204.png",
  },
  {
    description:
      "Interaction specs, Lottie animations, and motion files, documented and exported, ready to implement without guesswork",
    imageAlt: "Interaction and motion specifications",
    imageSrc: "https://media.zypher-solutions.com/04-services-page/section-5/Pt%20-%205.png",
  },
  {
    description: "Every asset exported in the formats your team needs",
    imageAlt: "Exported creative assets",
    imageSrc: "https://media.zypher-solutions.com/04-services-page/section-5/Pt%20-%206.png",
  },
];

export function DesignCreativeSectionFive(): ReactNode {
  return (
    <section
      aria-labelledby="design-creative-section-five-title"
      className={styles.section}
      data-motion-section="true"
      data-testid="design-creative-section-five"
      id="design-creative-deliverables"
    >
      <div className={styles.surface} data-testid="design-creative-section-five-surface">
        <div className={styles.content} data-motion-item="true">
          <header className={styles.header}>
            <div className={styles.introduction}>
              <h2
                aria-label="Designed, documented, ready to use."
                className={styles.title}
                id="design-creative-section-five-title"
              >
                <span>Designed, documented,</span>
                <span className={styles.titleAccent}>ready to use.</span>
              </h2>
              <p className={styles.description}>
                Every engagement ends with files your team can build from, maintain, and hand to
                anyone, without needing us to explain every decision.
              </p>
              <ButtonLink
                className={styles.buildsLink}
                href="/work"
                trackingLabel="See Our Builds"
                trackingLocation="design-creative-deliverables"
                variant="secondary"
              >
                See Our Builds <span aria-hidden="true">→</span>
              </ButtonLink>
            </div>

            <h3
              className={styles.deliverablesTitle}
              id="design-creative-section-five-deliverables-title"
            >
              Deliverables List
            </h3>
          </header>

          <ul
            aria-labelledby="design-creative-section-five-deliverables-title"
            className={styles.grid}
            data-testid="design-creative-section-five-grid"
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
