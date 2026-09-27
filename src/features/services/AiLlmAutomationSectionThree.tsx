import Image from "next/image";
import type { ReactNode } from "react";
import { ButtonLink } from "@/components/ui/ButtonLink";
import styles from "./AiLlmAutomationSectionThree.module.css";

type CapabilityCard = {
  title: string;
  description: string;
  imageSrc: string;
};

const AI_LLM_SECTION_THREE_CARDS: CapabilityCard[] = [
  {
    title: "Custom Chatbots & Assistants",
    description:
      "Trained on your data. Scope to your use case. Not a generic assistant, a system that knows your products, your processes, and how your customers talk.",
    imageSrc: "https://media.zypher-solutions.com/01-services-page/section-3/Custom%20Chatbots.png",
  },
  {
    title: "Custom Workflow Automation",
    description:
      "End to end process automation that removes the manual handoffs slowing your team down. We find the real bottleneck first, then automate that.",
    imageSrc:
      "https://media.zypher-solutions.com/01-services-page/section-3/Custom%20Workflow%20Automation.png",
  },
  {
    title: "LLM Integration",
    description:
      "AI embedded into your existing product, not bolted on as a feature. Engineered to sit inside your current architecture and operate as part of the system.",
    imageSrc: "https://media.zypher-solutions.com/01-services-page/section-3/LLM%20Integration.png",
  },
  {
    title: "RAG Systems & Knowledge Base",
    description:
      "Your documents, policies and institutional knowledge made queryable. Your team gets answers from your actual data.",
    imageSrc: "https://media.zypher-solutions.com/01-services-page/section-3/RAG%20Systems.png",
  },
  {
    title: "AI-Powered Internal Tools",
    description:
      "Tools built around how your team actually works not how a generic SaaS product assumes they work. Maintained without needing an engineer.",
    imageSrc:
      "https://media.zypher-solutions.com/01-services-page/section-3/AI%20Powered%20Tools.png",
  },
];

const AI_LLM_SECTION_THREE_CTA_IMAGE_SRC =
  "https://media.zypher-solutions.com/01-services-page/section-3/Something%20else%20entirely.png";

const IMAGE_SIZES =
  "(max-width: 39.999rem) calc(100vw - 2rem), (max-width: 48rem) calc((100vw - 3rem) / 2), (max-width: 63.999rem) calc((100vw - 6.5rem) / 3), 270px";

export function AiLlmAutomationSectionThree(): ReactNode {
  return (
    <section
      aria-labelledby="ai-llm-section-three-title"
      className={styles.section}
      data-motion-section="true"
      data-testid="ai-llm-section-three"
    >
      <svg
        aria-hidden="true"
        className={`${styles.boundary} ${styles.boundaryTop}`}
        data-testid="ai-llm-section-three-boundary-top"
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
        data-testid="ai-llm-section-three-boundary-bottom"
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
        data-testid="ai-llm-section-three-surface"
      />

      <div className={styles.shell} data-motion-item="true">
        <header className={styles.header}>
          <h2 className={styles.heading} id="ai-llm-section-three-title">
            <span>Five Core Capabilities.</span>
            <span className={styles.headingAccent}>Built deeper than most.</span>
          </h2>
          <p className={styles.intro}>
            These aren’t the only things we build, but they’re where most engagements start
          </p>
        </header>

        <div className={styles.grid} data-testid="ai-llm-section-three-cards">
          {AI_LLM_SECTION_THREE_CARDS.map((card) => (
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
                src={AI_LLM_SECTION_THREE_CTA_IMAGE_SRC}
              />
            </div>
            <div className={styles.cardBody}>
              <h3 className={styles.cardTitle}>Something else entirely?</h3>
              <p className={styles.cardDescription}>
                If the problem is real, we’ll scope it. Every engagement starts with a conversation.
              </p>
              <ButtonLink
                className={styles.ctaButton}
                href="/contact"
                trackingLabel="Get in touch"
                trackingLocation="ai-llm-automation-capabilities"
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
