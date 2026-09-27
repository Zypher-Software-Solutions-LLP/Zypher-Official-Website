import Image from "next/image";
import type { ReactNode } from "react";
import styles from "./AiLlmAutomationSectionTwo.module.css";

const MOBILE_APP_DEVELOPMENT_SECTION_TWO_ILLUSTRATION_SRC =
  "https://media.zypher-solutions.com/03-services-page/section-2/Wide%20Section%202%20Illustration.png";

const MOBILE_APP_DEVELOPMENT_SECTION_TWO_COPY = {
  firstParagraph:
    "A vague business goal, an inflated feature list, a platform choice made on gut feeling, and a launch plan that stops at the app store submission, these are what turn a promising product into an expensive icon nobody opens after the first week. We start by establishing what the app actually needs to do and for whom, not by asking for a feature list.",
  secondParagraph:
    "Platform choice, backend architecture, third-party integrations, and the post-launch reality all get mapped before a single screen is designed or a line of code is written.",
  thirdParagraph:
    "Launching is not the finish line. It's where the real work begins. We build with that in mind from day one.",
};

export function MobileAppDevelopmentSectionTwo(): ReactNode {
  return (
    <section
      aria-labelledby="mobile-app-development-section-two-title"
      className={styles.aiLlmSectionTwo}
      data-motion-section="true"
      data-testid="mobile-app-development-section-two"
    >
      <div className={styles.aiLlmSectionTwoInner} data-motion-item="true">
        <div className={styles.aiLlmSectionTwoHeader}>
          <p className={styles.aiLlmSectionTwoEyebrow}>
            <span>WHAT THIS</span>
            <span className={styles.aiLlmSectionTwoEyebrowAccent}>ACTUALLY IS</span>
          </p>

          <h2 id="mobile-app-development-section-two-title" className={styles.aiLlmSectionTwoTitle}>
            Most apps don&apos;t fail because of bad code.{" "}
            <span>They fail before a line is written.</span>
          </h2>
        </div>

        <div
          aria-hidden="true"
          className={styles.aiLlmSectionTwoIllustration}
          data-image-src={MOBILE_APP_DEVELOPMENT_SECTION_TWO_ILLUSTRATION_SRC}
          data-testid="mobile-app-development-section-two-illustration"
        >
          <Image
            alt=""
            className={styles.aiLlmSectionTwoIllustrationImage}
            fill
            quality={100}
            sizes="(max-width: 47.999rem) calc(100vw - 2rem), (max-width: 74.999rem) calc(100vw - 4rem), 956px"
            src={MOBILE_APP_DEVELOPMENT_SECTION_TWO_ILLUSTRATION_SRC}
          />
        </div>

        <div
          className={styles.aiLlmSectionTwoDescription}
          data-testid="mobile-app-development-section-two-description"
        >
          <p>{MOBILE_APP_DEVELOPMENT_SECTION_TWO_COPY.firstParagraph}</p>
          <p>{MOBILE_APP_DEVELOPMENT_SECTION_TWO_COPY.secondParagraph}</p>
          <p>{MOBILE_APP_DEVELOPMENT_SECTION_TWO_COPY.thirdParagraph}</p>
        </div>
      </div>
    </section>
  );
}
