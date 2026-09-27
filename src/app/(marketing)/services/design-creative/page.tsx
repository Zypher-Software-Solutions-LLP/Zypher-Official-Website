import type { Metadata } from "next";
import { CallToActionSection } from "@/components/ui/CallToActionSection";
import { DesignCreativeHeroSection } from "@/features/services/DesignCreativeHeroSection";
import { DesignCreativeSectionFour } from "@/features/services/DesignCreativeSectionFour";
import { DesignCreativeSectionFive } from "@/features/services/DesignCreativeSectionFive";
import { DesignCreativeSectionThree } from "@/features/services/DesignCreativeSectionThree";
import { DesignCreativeSectionTwo } from "@/features/services/DesignCreativeSectionTwo";
import { DesignCreativeFaqSection } from "@/features/services/faq/DesignCreativeFaqSection";
import { getServiceDefinition } from "@/features/services/service-data";
import { BreadcrumbJsonLd, ServiceJsonLd } from "@/lib/schema";
import { getStaticPageMetadata } from "@/lib/seo";

const service = getServiceDefinition("design-creative");

export async function generateMetadata(): Promise<Metadata> {
  return getStaticPageMetadata("/services/design-creative");
}

export default function DesignCreativePage(): React.ReactNode {
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
        <DesignCreativeHeroSection />
        <DesignCreativeSectionTwo />
        <DesignCreativeSectionThree />
        <DesignCreativeSectionFour />
        <DesignCreativeSectionFive />
        <DesignCreativeFaqSection />
        <CallToActionSection />
      </main>
    </>
  );
}
