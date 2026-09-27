import type { ReactNode } from "react";
import { FaqSection } from "@/features/home/faq/FaqSection";
import { mobileAppDevelopmentFaqItems } from "./mobile-app-development-faq-data";

export function MobileAppDevelopmentFaqSection(): ReactNode {
  return (
    <FaqSection
      intro="The answers we’d want before hiring anyone"
      items={mobileAppDevelopmentFaqItems}
      sectionId="mobile-app-development-faq"
      title="Questions Worth asking"
      variant="plain"
    />
  );
}
