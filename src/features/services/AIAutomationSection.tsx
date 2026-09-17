import Image from "next/image";
import type { ReactNode } from "react";
import { ButtonLink } from "@/components/ui/ButtonLink";
import styles from "./AIAutomationSection.module.css";

const LAPTOP_SRC = "https://media.zypher-solutions.com/services-page/section-2/Laptop.png";

const capabilities = [
  { number: "01", label: "Custom Chatbots & AI Assistants", glyph: "AI" },
  { number: "02", label: "Custom Workflow Automation Pipelines", glyph: "FLOW" },
  { number: "03", label: "LLM Integration into your existing product", glyph: "LLM" },
  { number: "04", label: "RAG Systems & Knowledge-base AI", glyph: "RAG" },
  { number: "05", label: "AI-Powered Internal Tools", glyph: "TOOL" },
] as const;

const deliverables = [
  "A working AI feature integrated into your actual product, not a standalone demo.",
  "Automated workflows that remove manual, repetitive work from your team's day.",
  "Internal tools your team can query in plain language instead of digging through dashboards.",
  "Documentation handed off at launch, so your team can maintain and extend it without needing us for every change.",
] as const;

export function AIAutomationSection(): ReactNode {
  return (
    <section
      aria-labelledby="ai-automation-title"
      className={styles.aiAutomationSection}
      data-testid="ai-automation-section"
      id="ai-automation"
    >
      <div className={styles.aiAutomationGrid} data-testid="ai-automation-grid">
        <div className={styles.aiAutomationHeader}>
          <h2 className={styles.aiAutomationTitle} id="ai-automation-title">
            AI &amp; LLM Automation
          </h2>
          <p className={styles.aiAutomationIntro}>
            The service we lead with — because it&apos;s the one most businesses are asking about,
            and the one most agencies still bolt on as an afterthought.
          </p>
        </div>

        <h3 className={styles.aiCapabilitiesTitle}>Our Capabilities</h3>

        <ol
          className={styles.aiNodeWorkflow}
          data-mobile-orientation="vertical"
          data-testid="ai-node-workflow"
        >
          {capabilities.map((capability) => (
            <li
              className={styles.aiCapabilityNode}
              data-testid="ai-capability-node"
              key={capability.number}
            >
              <div aria-hidden="true" className={styles.aiNodeVisual}>
                <span className={styles.aiNodeGlyph}>{capability.glyph}</span>
              </div>
              <span aria-hidden="true" className={styles.aiNodePoint} data-testid="ai-node-point" />
              <span className={styles.aiNodeNumber}>{capability.number}</span>
              <p className={styles.aiNodeLabel}>{capability.label}</p>
            </li>
          ))}
        </ol>

        <div className={styles.aiAutomationBottomGrid}>
          <div className={styles.aiDeliverables}>
            <h3 className={styles.aiDeliverablesTitle}>Business Deliverables</h3>
            <ul className={styles.aiDeliverablesList}>
              {deliverables.map((deliverable) => (
                <li data-testid="business-deliverable" key={deliverable}>
                  {deliverable}
                </li>
              ))}
            </ul>
            <ButtonLink
              className={styles.aiAutomationCta}
              href="/services/ai-llm-automation"
              trackingLabel="See How We Build With AI"
              trackingLocation="ai-automation-section"
            >
              See How We Build With AI →
            </ButtonLink>
          </div>

          <div
            aria-hidden="true"
            className={styles.aiLaptopArtwork}
            data-image-src={LAPTOP_SRC}
            data-testid="ai-automation-laptop"
          >
            <Image
              alt=""
              className={styles.aiLaptopImage}
              fill
              sizes="(max-width: 1023px) 0px, 48vw"
              src={LAPTOP_SRC}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
