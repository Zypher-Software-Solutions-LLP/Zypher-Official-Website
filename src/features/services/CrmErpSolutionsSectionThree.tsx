import Image from "next/image";
import type { ReactNode } from "react";
import { ButtonLink } from "@/components/ui/ButtonLink";
import styles from "./AiLlmAutomationSectionThree.module.css";

type CapabilityCard = {
  title: string;
  description: string;
  imageSrc: string;
};

const CRM_ERP_SOLUTIONS_SECTION_THREE_CARDS: CapabilityCard[] = [
  {
    title: "CRM Implementation & Config",
    description:
      "Salesforce, HubSpot, Monday.com, Odoo, and other major platforms, configured to how your team actually sells, follows up, and manages relationships.",
    imageSrc:
      "https://media.zypher-solutions.com/05-services-page/section-3/CRM%20Implementation.png",
  },
  {
    title: "Custom CRM Development",
    description:
      "When off-the-shelf platforms don't fit your process or cost more to configure than to build, we develop a CRM from the ground up.",
    imageSrc: "https://media.zypher-solutions.com/05-services-page/section-3/Custom%20CRM.png",
  },
  {
    title: "ERP Implementation & Setup",
    description:
      "End-to-end ERP configuration connecting your finance, inventory, procurement, and operations into one system. Mapped to your business processes.",
    imageSrc:
      "https://media.zypher-solutions.com/05-services-page/section-3/ERP%20Implementaation.png",
  },
  {
    title: "Data Migration",
    description:
      "Moving your existing data, contacts, deals, history, and documents into a new system without losing relationships or breaking records.",
    imageSrc: "https://media.zypher-solutions.com/05-services-page/section-3/Data%20Migration.png",
  },
  {
    title: "Systems Integration",
    description:
      "Connecting your CRM or ERP to the rest of your stack, marketing tools, finance software, communication platforms, and custom APIs.",
    imageSrc:
      "https://media.zypher-solutions.com/05-services-page/section-3/Systems%20Integration.png",
  },
];

const CRM_ERP_SOLUTIONS_SECTION_THREE_CTA_IMAGE_SRC =
  "https://media.zypher-solutions.com/01-services-page/section-3/Something%20else%20entirely.png";

const IMAGE_SIZES =
  "(max-width: 39.999rem) calc(100vw - 2rem), (max-width: 48rem) calc((100vw - 3rem) / 2), (max-width: 63.999rem) calc((100vw - 6.5rem) / 3), 270px";

export function CrmErpSolutionsSectionThree(): ReactNode {
  return (
    <section
      aria-labelledby="crm-erp-solutions-section-three-title"
      className={styles.section}
      data-motion-section="true"
      data-testid="crm-erp-solutions-section-three"
    >
      <svg
        aria-hidden="true"
        className={`${styles.boundary} ${styles.boundaryTop}`}
        data-testid="crm-erp-solutions-section-three-boundary-top"
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
        data-testid="crm-erp-solutions-section-three-boundary-bottom"
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
        data-testid="crm-erp-solutions-section-three-surface"
      />

      <div className={styles.shell} data-motion-item="true">
        <header className={styles.header}>
          <h2 className={styles.heading} id="crm-erp-solutions-section-three-title">
            <span>Five core capabilities.</span>{" "}
            <span className={styles.headingAccent + " " + styles.softwareHeadingAccent}>
              Built around your workflow.
            </span>
          </h2>
          <p className={styles.intro}>
            These aren&apos;t the only things we do, but they&apos;re where most engagements start.
          </p>
        </header>

        <div className={styles.grid} data-testid="crm-erp-solutions-section-three-cards">
          {CRM_ERP_SOLUTIONS_SECTION_THREE_CARDS.map((card) => (
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
                src={CRM_ERP_SOLUTIONS_SECTION_THREE_CTA_IMAGE_SRC}
              />
            </div>
            <div className={styles.cardBody}>
              <h3 className={styles.cardTitle}>Something else entirely?</h3>
              <p className={styles.cardDescription}>
                If the problem is real, we&apos;ll scope it. Every engagement starts with a
                conversation.
              </p>
              <ButtonLink
                className={styles.ctaButton}
                href="/contact"
                trackingLabel="Get in touch"
                trackingLocation="crm-erp-solutions-capabilities"
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
