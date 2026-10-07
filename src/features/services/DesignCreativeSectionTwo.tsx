import Image from "next/image";
import type { ReactNode } from "react";
import styles from "./AiLlmAutomationSectionTwo.module.css";
import designStyles from "./DesignCreativeTypography.module.css";

const DESIGN_CREATIVE_SECTION_TWO_ILLUSTRATION_SRC =
  "https://media.zypher-solutions.com/04-services-page/section-2/Wide%20Section%202%20Illustration.webp";

const DESIGN_CREATIVE_SECTION_TWO_COPY = {
  firstParagraph:
    "Design tools have gotten faster. AI assists with layouts, variations, and asset generation, and we use those tools where they save time. But the judgment behind every decision, what a user actually needs, where they get confused, and what makes them trust a product enough to pay for it, still comes from research, experience, and the kind of attention that can't be automated.",
  secondParagraph:
    "The difference between a designed product and a generated one shows up in the details: the loading state nobody thought about, the error message that actually helps, and the onboarding flow that doesn't make someone feel stupid. Those decisions require someone who understands the person on the other side of the screen.",
  thirdParagraph: "We use AI where it accelerates the work. The work itself is still ours.",
};

export function DesignCreativeSectionTwo(): ReactNode {
  return (
    <section
      aria-labelledby="design-creative-section-two-title"
      className={styles.aiLlmSectionTwo}
      data-motion-section="true"
      data-testid="design-creative-section-two"
    >
      <div className={styles.aiLlmSectionTwoInner} data-motion-item="true">
        <div className={styles.aiLlmSectionTwoHeader}>
          <p className={styles.aiLlmSectionTwoEyebrow}>
            <span>WHAT THIS</span>
            <span className={styles.aiLlmSectionTwoEyebrowAccent}>ACTUALLY IS</span>
          </p>

          <h2
            id="design-creative-section-two-title"
            className={`${styles.aiLlmSectionTwoTitle} ${designStyles.designCreativeSectionTwoTitle}`}
          >
            <span className={designStyles.designCreativeSectionTwoFirstSentence}>
              AI can generate a screen in seconds.
            </span>{" "}
            <br />
            <span>It can&apos;t tell you if it&apos;s the right one.</span>
          </h2>
        </div>

        <div
          aria-hidden="true"
          className={styles.aiLlmSectionTwoIllustration}
          data-image-src={DESIGN_CREATIVE_SECTION_TWO_ILLUSTRATION_SRC}
          data-testid="design-creative-section-two-illustration"
        >
          <Image
            alt=""
            className={styles.aiLlmSectionTwoIllustrationImage}
            fill
            quality={100}
            sizes="(max-width: 47.999rem) calc(100vw - 2rem), (max-width: 74.999rem) calc(100vw - 4rem), 956px"
            src={DESIGN_CREATIVE_SECTION_TWO_ILLUSTRATION_SRC}
          />
        </div>

        <div
          className={styles.aiLlmSectionTwoDescription}
          data-testid="design-creative-section-two-description"
        >
          <p>{DESIGN_CREATIVE_SECTION_TWO_COPY.firstParagraph}</p>
          <p>{DESIGN_CREATIVE_SECTION_TWO_COPY.secondParagraph}</p>
          <p>{DESIGN_CREATIVE_SECTION_TWO_COPY.thirdParagraph}</p>
        </div>
      </div>
    </section>
  );
}
