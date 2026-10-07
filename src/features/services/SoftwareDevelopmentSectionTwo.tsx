import Image from "next/image";
import type { ReactNode } from "react";
import styles from "./AiLlmAutomationSectionTwo.module.css";

const SOFTWARE_DEVELOPMENT_SECTION_TWO_ILLUSTRATION_SRC =
  "https://media.zypher-solutions.com/02-services-page/section-2/Wide%20Section%202%20Illustration.webp";

const SOFTWARE_DEVELOPMENT_SECTION_TWO_COPY = {
  firstParagraph:
    "Misaligned scope, requirements that shift without a paper trail, and a discovery phase that gets skipped to save time, these are what cause projects to overrun, underdeliver, and eventually get rebuilt from scratch. What we build starts with understanding how your business actually operates before anything is designed or coded.",
  secondParagraph:
    "The architecture decisions, the stack choices, the integration approach, all of it follows from that understanding, not from what's fastest or most familiar to build.",
  thirdParagraph:
    "You talk to the people building your software throughout the engagement, not a project manager relaying messages between you and a team you never meet. That's not a perk. It's how good software gets built.",
};

export function SoftwareDevelopmentSectionTwo(): ReactNode {
  return (
    <section
      aria-labelledby="software-development-section-two-title"
      className={styles.aiLlmSectionTwo}
      data-motion-section="true"
      data-testid="software-development-section-two"
    >
      <div className={styles.aiLlmSectionTwoInner} data-motion-item="true">
        <div className={styles.aiLlmSectionTwoHeader}>
          <p className={styles.aiLlmSectionTwoEyebrow}>
            <span>WHAT THIS</span>
            <span className={styles.aiLlmSectionTwoEyebrowAccent}>ACTUALLY IS</span>
          </p>

          <h2 id="software-development-section-two-title" className={styles.aiLlmSectionTwoTitle}>
            Most software projects don&apos;t fail because of bad code.{" "}
            <span>They fail before a line is written.</span>
          </h2>
        </div>

        <div
          aria-hidden="true"
          className={styles.aiLlmSectionTwoIllustration}
          data-image-src={SOFTWARE_DEVELOPMENT_SECTION_TWO_ILLUSTRATION_SRC}
          data-testid="software-development-section-two-illustration"
        >
          <Image
            alt=""
            className={styles.aiLlmSectionTwoIllustrationImage}
            fill
            quality={100}
            sizes="(max-width: 47.999rem) calc(100vw - 2rem), (max-width: 74.999rem) calc(100vw - 4rem), 956px"
            src={SOFTWARE_DEVELOPMENT_SECTION_TWO_ILLUSTRATION_SRC}
          />
        </div>

        <div
          className={styles.aiLlmSectionTwoDescription}
          data-testid="software-development-section-two-description"
        >
          <p>{SOFTWARE_DEVELOPMENT_SECTION_TWO_COPY.firstParagraph}</p>
          <p>{SOFTWARE_DEVELOPMENT_SECTION_TWO_COPY.secondParagraph}</p>
          <p>{SOFTWARE_DEVELOPMENT_SECTION_TWO_COPY.thirdParagraph}</p>
        </div>
      </div>
    </section>
  );
}
