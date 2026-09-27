import type { Metadata } from "next";
import { CallToActionSection } from "@/components/ui/CallToActionSection";
import { SoftwareDevelopmentHeroSection } from "@/features/services/SoftwareDevelopmentHeroSection";
import { SoftwareDevelopmentSectionFour } from "@/features/services/SoftwareDevelopmentSectionFour";
import { SoftwareDevelopmentSectionFive } from "@/features/services/SoftwareDevelopmentSectionFive";
import { SoftwareDevelopmentSectionThree } from "@/features/services/SoftwareDevelopmentSectionThree";
import { SoftwareDevelopmentSectionTwo } from "@/features/services/SoftwareDevelopmentSectionTwo";
import { SoftwareDevelopmentFaqSection } from "@/features/services/faq/SoftwareDevelopmentFaqSection";
import { getServiceDefinition } from "@/features/services/service-data";
import { BreadcrumbJsonLd, ServiceJsonLd } from "@/lib/schema";
import { getStaticPageMetadata } from "@/lib/seo";

const service = getServiceDefinition("software-development");

export async function generateMetadata(): Promise<Metadata> {
  return getStaticPageMetadata("/services/software-development");
}

export default function SoftwareDevelopmentPage(): React.ReactNode {
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
        <SoftwareDevelopmentHeroSection />
        <SoftwareDevelopmentSectionTwo />
        <SoftwareDevelopmentSectionThree />
        <SoftwareDevelopmentSectionFour />
        <SoftwareDevelopmentSectionFive />
        <SoftwareDevelopmentFaqSection />
        <CallToActionSection />
      </main>
    </>
  );
}
