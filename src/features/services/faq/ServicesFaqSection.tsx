import type { ReactNode } from "react";
import { FaqSection } from "@/features/home/faq/FaqSection";
import { servicesFaqItems } from "./services-faq-data";

export function ServicesFaqSection(): ReactNode {
  return (
    <FaqSection
      intro={null}
      items={servicesFaqItems}
      sectionId="services-faq"
      title="Services FAQ"
      variant="plain"
    />
  );
}
