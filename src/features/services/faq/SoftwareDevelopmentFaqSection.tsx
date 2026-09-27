import type { ReactNode } from "react";
import { FaqSection } from "@/features/home/faq/FaqSection";
import { softwareDevelopmentFaqItems } from "./software-development-faq-data";

export function SoftwareDevelopmentFaqSection(): ReactNode {
  return (
    <FaqSection
      intro="The answers we’d want before hiring anyone"
      items={softwareDevelopmentFaqItems}
      sectionId="software-development-faq"
      title="Questions Worth asking"
      variant="plain"
    />
  );
}
