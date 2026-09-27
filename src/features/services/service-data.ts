export type ServiceDefinition = {
  slug: string;
  name: string;
  description: string;
};

export const serviceDefinitions: ServiceDefinition[] = [
  {
    slug: "software-development",
    name: "Software Development",
    description:
      "Purpose-built software that turns important business workflows into clear products.",
  },
  {
    slug: "mobile-app-development",
    name: "Mobile App Development",
    description: "Focused mobile apps that make your product and operations easier to access.",
  },
  {
    slug: "ai-llm-automation",
    name: "AI & LLM Automation",
    description: "Practical AI and automation systems designed around your team’s real work.",
  },
  {
    slug: "design-creative",
    name: "Design & Creative",
    description:
      "Research-led product design and creative production built to work in the real world.",
  },
  {
    slug: "crm-erp-solutions",
    name: "CRM/ERP Solutions",
    description: "Connected operational systems that give teams better visibility and control.",
  },
];

export function getServiceDefinition(slug: string): ServiceDefinition | undefined {
  return serviceDefinitions.find((service) => service.slug === slug);
}
