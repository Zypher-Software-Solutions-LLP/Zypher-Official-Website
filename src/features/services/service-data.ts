export type ServiceDefinition = {
  slug: string;
  name: string;
  description: string;
  definition: string;
};

export const serviceDefinitions: ServiceDefinition[] = [
  {
    slug: "software-development",
    name: "Software Development",
    description:
      "Purpose-built software that turns important business workflows into clear products.",
    definition:
      "Custom software is built around a company's own workflows, not an off-the-shelf tool. Zypher Software Solutions builds web platforms and internal tools.",
  },
  {
    slug: "mobile-app-development",
    name: "Mobile App Development",
    description: "Focused mobile apps that make your product and operations easier to access.",
    definition:
      "Mobile app development means building iOS and Android apps. Zypher Software Solutions builds apps from strategy and UX through launch and support.",
  },
  {
    slug: "ai-llm-automation",
    name: "AI & LLM Automation",
    description: "Practical AI and automation systems designed around your team’s real work.",
    definition:
      "AI and LLM automation uses language models to handle repetitive business tasks. Zypher Software Solutions builds custom chatbots and workflows.",
  },
  {
    slug: "design-creative",
    name: "Design & Creative",
    description:
      "Research-led product design and creative production built to work in the real world.",
    definition:
      "Product design covers the research, UX and UI behind a digital product. Zypher Software Solutions delivers product design and design systems.",
  },
  {
    slug: "crm-erp-solutions",
    name: "CRM/ERP Solutions",
    description: "Connected operational systems that give teams better visibility and control.",
    definition:
      "A CRM manages customers and sales; an ERP connects finance, inventory and operations. Zypher Software Solutions builds custom CRM and ERP systems.",
  },
];

export function getServiceDefinition(slug: string): ServiceDefinition | undefined {
  return serviceDefinitions.find((service) => service.slug === slug);
}
