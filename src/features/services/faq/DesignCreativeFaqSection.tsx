import type { ReactNode } from "react";
import { FaqSection } from "@/features/home/faq/FaqSection";
import { designCreativeFaqItems } from "./design-creative-faq-data";

export function DesignCreativeFaqSection(): ReactNode {
  return (
    <FaqSection
      intro="The answers we’d want before hiring anyone"
      items={designCreativeFaqItems}
      sectionId="design-creative-faq"
      title="Questions Worth asking"
      variant="plain"
    />
  );
}
