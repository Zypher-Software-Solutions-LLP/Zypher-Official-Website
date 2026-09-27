import type { Metadata } from "next";
import { CallToActionSection } from "@/components/ui/CallToActionSection";
import { AIAutomationSection } from "@/features/services/AIAutomationSection";
import { CoreExpertiseSection } from "@/features/services/core-expertise/CoreExpertiseSection";
import { ExtendedCapabilitiesSection } from "@/features/services/extended-capabilities/ExtendedCapabilitiesSection";
import { ServicesFaqSection } from "@/features/services/faq/ServicesFaqSection";
import { ScopeApproachSection } from "@/features/services/scope-approach/ScopeApproachSection";
import { ServicesHeroSection } from "@/features/services/ServicesHeroSection";
import { getStaticPageMetadata } from "@/lib/seo";
import styles from "./ServicesPage.module.css";

export async function generateMetadata(): Promise<Metadata> {
  return getStaticPageMetadata("/services");
}

export default function ServicesPage(): React.ReactNode {
  return (
    <main className={styles.servicesPage} id="main-content">
      <ServicesHeroSection />
      <AIAutomationSection />
      <CoreExpertiseSection />
      <ExtendedCapabilitiesSection />
      <ScopeApproachSection />
      <ServicesFaqSection />
      <CallToActionSection />
    </main>
  );
}
