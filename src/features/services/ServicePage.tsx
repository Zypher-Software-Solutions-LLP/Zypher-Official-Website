import { ButtonLink } from "@/components/ui/ButtonLink";
import type { ServiceDefinition } from "@/features/services/service-data";
import { BreadcrumbJsonLd, ServiceJsonLd } from "@/lib/schema";

export function ServicePage({ service }: { service: ServiceDefinition }): React.ReactNode {
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
        <section className="border-b border-mist-300/10">
          <div className="site-container py-24 sm:py-32" data-motion-intro="true">
            <div className="max-w-3xl">
              <p className="eyebrow">Services</p>
              <h1 className="mt-4 text-3xl font-semibold tracking-tight text-mist-100 sm:text-4xl lg:text-5xl">
                {service.name}
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-7 text-mist-300 sm:text-lg">
                {service.description}
              </p>
            </div>
            <ButtonLink className="mt-8" href="/contact">
              Discuss your project
            </ButtonLink>
          </div>
        </section>
        <section
          className="site-container grid gap-6 py-24 sm:grid-cols-3 sm:py-32"
          data-motion-section="true"
        >
          {[
            [
              "01",
              "Understand",
              "We start with the context, constraints, and outcomes that make the work matter.",
            ],
            [
              "02",
              "Shape",
              "We turn the opportunity into a focused direction your team can evaluate and act on.",
            ],
            [
              "03",
              "Build",
              "We deliver a maintainable system with the clarity to keep improving after launch.",
            ],
          ].map(([number, title, description]) => (
            <article
              className="rounded-3xl border border-mist-300/15 p-6"
              data-motion-item="true"
              key={number}
            >
              <p className="text-3xl font-semibold text-cyan-300">{number}</p>
              <h2 className="mt-10 text-xl font-semibold text-mist-100">{title}</h2>
              <p className="mt-3 text-sm leading-6 text-mist-300">{description}</p>
            </article>
          ))}
        </section>
      </main>
    </>
  );
}
