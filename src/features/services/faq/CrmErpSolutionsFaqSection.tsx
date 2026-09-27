import type { ReactNode } from "react";
import { FaqSection } from "@/features/home/faq/FaqSection";
import { crmErpSolutionsFaqItems } from "./crm-erp-solutions-faq-data";

export function CrmErpSolutionsFaqSection(): ReactNode {
  return (
    <FaqSection
      intro="The answers we'd want before hiring anyone"
      items={crmErpSolutionsFaqItems}
      sectionId="crm-erp-solutions-faq"
      title="Questions Worth asking"
      variant="plain"
    />
  );
}
