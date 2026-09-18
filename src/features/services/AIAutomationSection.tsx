"use client";

import Image from "next/image";
import { useRef } from "react";
import type { ReactNode } from "react";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { useViewportReveal } from "@/components/motion/useViewportReveal";
import styles from "./AIAutomationSection.module.css";

const LAPTOP_SRC = "https://media.zypher-solutions.com/services-page/section-2/Laptop.png";
const NODE_WORKFLOW_SRC =
  "https://media.zypher-solutions.com/services-page/section-2/Group%2022.png";
const NODE_WORKFLOW_MOBILE_SRC =
  "https://media.zypher-solutions.com/services-page/section-2/Group%2022%20-%20Mobile%20View.png";

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
  const sectionRef = useRef<HTMLElement | null>(null);
  const hasEnteredViewport = useViewportReveal(sectionRef);

  return (
    <section
      aria-labelledby="ai-automation-title"
      className={styles.aiAutomationSection}
      data-reveal-state={hasEnteredViewport ? "visible" : "hidden"}
      data-testid="ai-automation-section"
      id="ai-automation"
      ref={sectionRef}
    >
      <div className={styles.aiAutomationGrid} data-testid="ai-automation-grid">
        <div className={styles.aiAutomationHeader}>
          <h2 className={styles.aiAutomationTitle} id="ai-automation-title">
            AI &amp; LLM Automation
          </h2>
          <p className={styles.aiAutomationIntro}>
            The service we lead with, because it&apos;s the one most businesses are asking about,
            and the one most agencies still bolt on as an afterthought.
          </p>
        </div>

        <h3 className={styles.aiCapabilitiesTitle}>Our Capabilities</h3>

        <div className={styles.aiNodeWorkflowFrame}>
          <div
            aria-hidden="true"
            className={styles.aiNodeWorkflowArtwork}
            data-image-src={NODE_WORKFLOW_SRC}
            data-testid="ai-node-workflow-image"
          >
            <Image
              alt=""
              className={styles.aiNodeWorkflowImage}
              fill
              sizes="(max-width: 767px) 288px, 80vw"
              src={NODE_WORKFLOW_SRC}
            />
          </div>
          <div
            aria-hidden="true"
            className={styles.aiNodeWorkflowMobileArtwork}
            data-image-src={NODE_WORKFLOW_MOBILE_SRC}
            data-testid="ai-node-workflow-mobile-image"
          >
            <Image
              alt=""
              className={styles.aiNodeWorkflowMobileImage}
              fill
              sizes="80px"
              src={NODE_WORKFLOW_MOBILE_SRC}
            />
          </div>
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
                <span
                  aria-hidden="true"
                  className={styles.aiNodePoint}
                  data-testid="ai-node-point"
                />
                <span className={styles.aiNodeNumber}>{capability.number}</span>
                <p className={styles.aiNodeLabel} data-testid="ai-capability-label">
                  {capability.label}
                </p>
              </li>
            ))}
          </ol>
        </div>

        <div className={styles.aiAutomationBottomGrid} data-testid="ai-automation-bottom-grid">
          <div className={styles.aiDeliverables}>
            <h3 className={styles.aiDeliverablesTitle}>Business Deliverables</h3>
            <ul className={styles.aiDeliverablesList} data-testid="business-deliverables-list">
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
        </div>
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
          sizes="(max-width: 1023px) 0px, 64vw"
          src={LAPTOP_SRC}
        />
      </div>
    </section>
  );
}
