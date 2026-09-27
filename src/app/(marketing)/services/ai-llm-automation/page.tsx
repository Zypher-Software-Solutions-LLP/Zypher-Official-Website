import type { Metadata } from "next";
import { CallToActionSection } from "@/components/ui/CallToActionSection";
import { AiLlmAutomationHeroSection } from "@/features/services/AiLlmAutomationHeroSection";
import { AiLlmAutomationSectionFour } from "@/features/services/AiLlmAutomationSectionFour";
import { AiLlmAutomationSectionFive } from "@/features/services/AiLlmAutomationSectionFive";
import { AiLlmAutomationSectionThree } from "@/features/services/AiLlmAutomationSectionThree";
import { AiLlmAutomationSectionTwo } from "@/features/services/AiLlmAutomationSectionTwo";
import { AiLlmAutomationFaqSection } from "@/features/services/faq/AiLlmAutomationFaqSection";
import { getServiceDefinition } from "@/features/services/service-data";
import { BreadcrumbJsonLd, ServiceJsonLd } from "@/lib/schema";
import { getStaticPageMetadata } from "@/lib/seo";

const service = getServiceDefinition("ai-llm-automation");

export async function generateMetadata(): Promise<Metadata> {
  return getStaticPageMetadata("/services/ai-llm-automation");
}

export default function AiLlmAutomationPage(): React.ReactNode {
  if (!service) return null;

  return (
    <>
      <ServiceJsonLd service={service} />
      <BreadcrumbJsonLd
        items={[
          { name: "Home", path: "/" },
          { name: "Services", path: "/services" },
          { name: service.name, path: `/services/${service.slug}` },
        ]}
      />
      <main id="main-content">
        <AiLlmAutomationHeroSection />
        <AiLlmAutomationSectionTwo />
        <AiLlmAutomationSectionThree />
        <AiLlmAutomationSectionFour />
        <AiLlmAutomationSectionFive />
        <AiLlmAutomationFaqSection />
        <CallToActionSection />
      </main>
    </>
  );
}
