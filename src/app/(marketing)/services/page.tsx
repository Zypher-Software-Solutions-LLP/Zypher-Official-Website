import type { Metadata } from "next";
import Link from "next/link";
import { CallToActionSection } from "@/components/ui/CallToActionSection";
import { serviceDefinitions } from "@/features/services/service-data";
import { ServicesHeroSection } from "@/features/services/ServicesHeroSection";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Services",
  description:
    "End-to-end software, engineered with AI at the core, from your first idea to production.",
  path: "/services",
});

export default function ServicesPage(): React.ReactNode {
  return (
    <main id="main-content">
      <ServicesHeroSection />
      <section
        className="site-container grid gap-4 py-20 md:grid-cols-2 lg:grid-cols-3 sm:py-28"
        data-testid="service-lines"
        id="service-lines"
      >
        {serviceDefinitions.map((service) => (
          <Link
            className="rounded-3xl border border-mist-300/15 p-6 transition-colors hover:border-cyan-300/60 hover:bg-ink-900"
            href={`/services/${service.slug}`}
            key={service.slug}
          >
            <p className="eyebrow">Service</p>
            <h2 className="mt-5 text-xl font-semibold text-mist-100">{service.name}</h2>
            <p className="mt-3 text-sm leading-6 text-mist-300">{service.description}</p>
          </Link>
        ))}
      </section>
      <CallToActionSection />
    </main>
  );
}
