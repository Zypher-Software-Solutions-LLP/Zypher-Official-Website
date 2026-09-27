import Image from "next/image";
import type { ReactNode } from "react";
import styles from "./AiLlmAutomationSectionTwo.module.css";

const CRM_ERP_SOLUTIONS_SECTION_TWO_ILLUSTRATION_SRC =
  "https://media.zypher-solutions.com/05-services-page/section-2/Wide%20Section%202%20Illustration.png";

const CRM_ERP_SOLUTIONS_SECTION_TWO_COPY = {
  firstParagraph:
    "Most CRM and ERP implementations fail not because the platform was wrong, but because the system was configured around how the vendor assumed the business runs, not how it actually does. We start by mapping your real workflow, how your team works, where data lives today, and what needs to connect to what.",
  secondParagraph:
    "Configuration, customisation, or a custom build follows from that. Not the other way around.",
  thirdParagraph:
    "The goal isn't a technically functional system. It's one your team actually uses.",
};

export function CrmErpSolutionsSectionTwo(): ReactNode {
  return (
    <section
      aria-labelledby="crm-erp-solutions-section-two-title"
      className={styles.aiLlmSectionTwo}
      data-motion-section="true"
      data-testid="crm-erp-solutions-section-two"
    >
      <div className={styles.aiLlmSectionTwoInner} data-motion-item="true">
        <div className={styles.aiLlmSectionTwoHeader}>
          <p className={styles.aiLlmSectionTwoEyebrow}>
            <span>WHAT THIS</span>
            <span className={styles.aiLlmSectionTwoEyebrowAccent}>ACTUALLY IS</span>
          </p>

          <h2 id="crm-erp-solutions-section-two-title" className={styles.aiLlmSectionTwoTitle}>
            A CRM nobody uses is just expensive software <span>collecting contact records.</span>
          </h2>
        </div>

        <div
          aria-hidden="true"
          className={styles.aiLlmSectionTwoIllustration}
          data-image-src={CRM_ERP_SOLUTIONS_SECTION_TWO_ILLUSTRATION_SRC}
          data-testid="crm-erp-solutions-section-two-illustration"
        >
          <Image
            alt=""
            className={styles.aiLlmSectionTwoIllustrationImage}
            fill
            quality={100}
            sizes="(max-width: 47.999rem) calc(100vw - 2rem), (max-width: 74.999rem) calc(100vw - 4rem), 956px"
            src={CRM_ERP_SOLUTIONS_SECTION_TWO_ILLUSTRATION_SRC}
          />
        </div>

        <div
          className={styles.aiLlmSectionTwoDescription}
          data-testid="crm-erp-solutions-section-two-description"
        >
          <p>{CRM_ERP_SOLUTIONS_SECTION_TWO_COPY.firstParagraph}</p>
          <p>{CRM_ERP_SOLUTIONS_SECTION_TWO_COPY.secondParagraph}</p>
          <p>{CRM_ERP_SOLUTIONS_SECTION_TWO_COPY.thirdParagraph}</p>
        </div>
      </div>
    </section>
  );
}
