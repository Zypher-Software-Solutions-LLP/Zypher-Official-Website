import type { ReactNode } from "react";
import { FaqSection } from "@/features/home/faq/FaqSection";
import { aiLlmAutomationFaqItems } from "./ai-llm-automation-faq-data";

export function AiLlmAutomationFaqSection(): ReactNode {
  return (
    <FaqSection
      intro="The answers we’d want before hiring anyone"
      items={aiLlmAutomationFaqItems}
      sectionId="ai-llm-automation-faq"
      title="Questions Worth asking"
      variant="plain"
    />
  );
}
