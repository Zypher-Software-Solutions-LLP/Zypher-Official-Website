import type { Metadata } from "next";
import { CallToActionSection } from "@/components/ui/CallToActionSection";
import { MobileAppDevelopmentHeroSection } from "@/features/services/MobileAppDevelopmentHeroSection";
import { MobileAppDevelopmentSectionFour } from "@/features/services/MobileAppDevelopmentSectionFour";
import { MobileAppDevelopmentSectionFive } from "@/features/services/MobileAppDevelopmentSectionFive";
import { MobileAppDevelopmentSectionThree } from "@/features/services/MobileAppDevelopmentSectionThree";
import { MobileAppDevelopmentSectionTwo } from "@/features/services/MobileAppDevelopmentSectionTwo";
import { MobileAppDevelopmentFaqSection } from "@/features/services/faq/MobileAppDevelopmentFaqSection";
import { mobileAppDevelopmentFaqItems } from "@/features/services/faq/mobile-app-development-faq-data";
import { getServiceDefinition } from "@/features/services/service-data";
import { BreadcrumbJsonLd, FaqJsonLd, ServiceJsonLd } from "@/lib/schema";
import { getStaticPageMetadata } from "@/lib/seo";

const service = getServiceDefinition("mobile-app-development");

export async function generateMetadata(): Promise<Metadata> {
  return getStaticPageMetadata("/services/mobile-app-development");
}

export default function MobileAppDevelopmentPage(): React.ReactNode {
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
      <FaqJsonLd items={mobileAppDevelopmentFaqItems} />
      <main id="main-content">
        <MobileAppDevelopmentHeroSection />
        <MobileAppDevelopmentSectionTwo />
        <MobileAppDevelopmentSectionThree />
        <MobileAppDevelopmentSectionFour />
        <MobileAppDevelopmentSectionFive />
        <MobileAppDevelopmentFaqSection />
        <CallToActionSection />
      </main>
    </>
  );
}
