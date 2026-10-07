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
      "A CRM or ERP set up around your actual workflow, not the vendor's default template",
    imageAlt: "CRM or ERP configured around the actual workflow",
    imageSrc: "https://media.zypher-solutions.com/05-services-page/section-5/Pt%20-%201.webp",
  },
  {
    description:
      "Your existing contacts, deals, and history migrated, cleaned, and validated, with nothing lost",
    imageAlt: "Migrated and validated business data",
    imageSrc: "https://media.zypher-solutions.com/05-services-page/section-5/Pt%20-%202.webp",
  },
  {
    description:
      "Your CRM or ERP connected to the tools your team already uses, with one data source",
    imageAlt: "CRM or ERP connected to existing business tools",
    imageSrc: "https://media.zypher-solutions.com/05-services-page/section-5/Pt%20-%203.webp",
  },
  {
    description:
      "Full admin access, credentials, and configs, with no dependency on us to make changes",
    imageAlt: "Administrative access and system configuration",
    imageSrc: "https://media.zypher-solutions.com/05-services-page/section-5/Pt%20-%204.webp",
  },
  {
    description:
      "Your team trained before handoff. Documentation written for the people using it, not us",
    imageAlt: "Team training and system documentation",
    imageSrc: "https://media.zypher-solutions.com/05-services-page/section-5/Pt%20-%205.webp",
  },
  {
    description: "Post-launch support scoped and priced upfront, with no surprises after go-live",
    imageAlt: "Post-launch support plan",
    imageSrc: "https://media.zypher-solutions.com/05-services-page/section-5/Pt%20-%206.webp",
  },
];

export function CrmErpSolutionsSectionFive(): ReactNode {
  return (
    <section
      aria-labelledby="crm-erp-solutions-section-five-title"
      className={styles.section}
      data-motion-section="true"
      data-testid="crm-erp-solutions-section-five"
      id="crm-erp-solutions-deliverables"
    >
      <div className={styles.surface} data-testid="crm-erp-solutions-section-five-surface">
        <div className={styles.content} data-motion-item="true">
          <header className={styles.header}>
            <div className={styles.introduction}>
              <h2
                aria-label="Configured, connected. Ready to run."
                className={styles.title}
                id="crm-erp-solutions-section-five-title"
              >
                <span>Configured, connected.</span>
                <span className={styles.titleAccent}>Ready to run.</span>
              </h2>
              <p className={styles.description}>
                Every engagement ends with a system your team actually uses, documented, integrated,
                and handed over with no strings attached.
              </p>
              <ButtonLink
                className={styles.buildsLink}
                href="/work"
                trackingLabel="See Our Builds"
                trackingLocation="crm-erp-solutions-deliverables"
                variant="secondary"
              >
                See Our Builds <span aria-hidden="true">→</span>
              </ButtonLink>
            </div>

            <h3
              className={styles.deliverablesTitle}
              id="crm-erp-solutions-section-five-deliverables-title"
            >
              Deliverables List
            </h3>
          </header>

          <ul
            aria-labelledby="crm-erp-solutions-section-five-deliverables-title"
            className={styles.grid}
            data-testid="crm-erp-solutions-section-five-grid"
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
