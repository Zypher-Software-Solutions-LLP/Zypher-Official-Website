import Image from "next/image";
import type { ReactNode } from "react";
import styles from "./AiLlmAutomationSectionTwo.module.css";

const AI_LLM_SECTION_TWO_ILLUSTRATION_SRC =
  "https://media.zypher-solutions.com/01-services-page/section-2/Wide%20Section%202%20Illustration.webp";

const AI_LLM_SECTION_TWO_COPY = {
  firstParagraph:
    'The gap between "we added AI" and "AI is running our operations" is almost always an architecture problem, not a model problem. The right language model matters far less than the system built around it. The state management, the orchestration logic, the integration layer, the fail-safes that catch edge cases before they cause damage.',
  secondParagraph:
    "What we build isn't a layer on top of your existing tools. It's engineered to sit inside your workflows, connect to your data, query your systems, and operate with the kind of reliability your business actually needs.",
  thirdParagraph:
    "The demo works because we scope it to work in production, not to impress in a presentation.",
};

export function AiLlmAutomationSectionTwo(): ReactNode {
  return (
    <section
      aria-labelledby="ai-llm-section-two-title"
      className={styles.aiLlmSectionTwo}
      data-motion-section="true"
      data-testid="ai-llm-section-two"
    >
      <div className={styles.aiLlmSectionTwoInner} data-motion-item="true">
        <div className={styles.aiLlmSectionTwoHeader}>
          <p className={styles.aiLlmSectionTwoEyebrow}>
            <span>WHAT THIS</span>
            <span className={styles.aiLlmSectionTwoEyebrowAccent}>ACTUALLY IS</span>
          </p>

          <h2 id="ai-llm-section-two-title" className={styles.aiLlmSectionTwoTitle}>
            Most AI Implementations look{" "}
            <span>
              impressive
              <br className={styles.aiLlmSectionTwoDesktopBreak} /> in a demo.
            </span>{" "}
            Few survive real usage.
          </h2>
        </div>

        <div
          aria-hidden="true"
          className={styles.aiLlmSectionTwoIllustration}
          data-image-src={AI_LLM_SECTION_TWO_ILLUSTRATION_SRC}
          data-testid="ai-llm-section-two-illustration"
        >
          <Image
            alt=""
            className={styles.aiLlmSectionTwoIllustrationImage}
            fill
            quality={100}
            sizes="(max-width: 47.999rem) calc(100vw - 2rem), (max-width: 74.999rem) calc(100vw - 4rem), 956px"
            src={AI_LLM_SECTION_TWO_ILLUSTRATION_SRC}
          />
        </div>

        <div
          className={styles.aiLlmSectionTwoDescription}
          data-testid="ai-llm-section-two-description"
        >
          <p>{AI_LLM_SECTION_TWO_COPY.firstParagraph}</p>
          <p>{AI_LLM_SECTION_TWO_COPY.secondParagraph}</p>
          <p>{AI_LLM_SECTION_TWO_COPY.thirdParagraph}</p>
        </div>
      </div>
    </section>
  );
}
