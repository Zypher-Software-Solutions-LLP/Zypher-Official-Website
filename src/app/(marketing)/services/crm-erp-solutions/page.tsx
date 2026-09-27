import type { Metadata } from "next";
import { CallToActionSection } from "@/components/ui/CallToActionSection";
import { CrmErpSolutionsHeroSection } from "@/features/services/CrmErpSolutionsHeroSection";
import { CrmErpSolutionsSectionFour } from "@/features/services/CrmErpSolutionsSectionFour";
import { CrmErpSolutionsSectionFive } from "@/features/services/CrmErpSolutionsSectionFive";
import { CrmErpSolutionsSectionThree } from "@/features/services/CrmErpSolutionsSectionThree";
import { CrmErpSolutionsSectionTwo } from "@/features/services/CrmErpSolutionsSectionTwo";
import { CrmErpSolutionsFaqSection } from "@/features/services/faq/CrmErpSolutionsFaqSection";
import { getServiceDefinition } from "@/features/services/service-data";
import { BreadcrumbJsonLd, ServiceJsonLd } from "@/lib/schema";
import { getStaticPageMetadata } from "@/lib/seo";

const service = getServiceDefinition("crm-erp-solutions");

export async function generateMetadata(): Promise<Metadata> {
  return getStaticPageMetadata("/services/crm-erp-solutions");
}

export default function CrmErpSolutionsPage(): React.ReactNode {
  if (!service) return null;

  return (
    <>
      <ServiceJsonLd service={service} />
      <BreadcrumbJsonLd
        items={[
          { name: "Home", path: "/" },
          { name: "Services", path: "/services" },
          { name: service.name, path: "/services/" + service.slug },
        ]}
      />
      <main id="main-content">
        <CrmErpSolutionsHeroSection />
        <CrmErpSolutionsSectionTwo />
        <CrmErpSolutionsSectionThree />
        <CrmErpSolutionsSectionFour />
        <CrmErpSolutionsSectionFive />
        <CrmErpSolutionsFaqSection />
        <CallToActionSection />
      </main>
    </>
  );
}
