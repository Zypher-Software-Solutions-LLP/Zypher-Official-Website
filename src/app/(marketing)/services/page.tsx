import type { Metadata } from "next";
import Link from "next/link";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { serviceDefinitions } from "@/features/services/service-data";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Services",
  description: "Explore Zypher software, mobile, automation, CRM/ERP, and UI/UX services.",
  path: "/services",
});

export default function ServicesPage(): React.ReactNode {
  return (
    <main id="main-content">
      <section className="border-b border-mist-300/10">
        <div className="site-container py-24 sm:py-32">
          <SectionHeading
            eyebrow="Services"
            title="Build the system your next stage needs."
            description="Choose the capability that matches the problem in front of you, or bring us the wider challenge and we will help shape the path."
          />
        </div>
      </section>
      <section className="site-container grid gap-4 py-20 md:grid-cols-2 lg:grid-cols-3 sm:py-28">
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
    </main>
  );
}
