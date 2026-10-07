export type CoreExpertiseCategory = {
  id: string;
  label: string;
  description: string;
  capabilities: ReadonlyArray<{
    title: string;
    imageSrc: string;
    imageAlt: string;
  }>;
  deliverables: ReadonlyArray<string>;
  ctaLabel: string;
  ctaHref: string;
};

const SECTION_3_ASSET_BASE = "https://media.zypher-solutions.com/services-page/section-3";

export const coreExpertiseCategories: ReadonlyArray<CoreExpertiseCategory> = [
  {
    id: "software-development",
    label: "Software Development",
    description:
      "Custom software built around how your business actually runs, not a template it has to adapt to.",
    capabilities: [
      {
        title: "Custom Web Applications",
        imageSrc: `${SECTION_3_ASSET_BASE}/software-dev/Custom%20Web%20Applications.webp`,
        imageAlt: "Custom web application interface",
      },
      {
        title: "API Development & Integration",
        imageSrc: `${SECTION_3_ASSET_BASE}/software-dev/API%20Development.webp`,
        imageAlt: "API development and integration interface",
      },
      {
        title: "Cloud-native Infrastructure",
        imageSrc: `${SECTION_3_ASSET_BASE}/software-dev/Cloud%20Native%20Infrastructure.webp`,
        imageAlt: "Cloud-native infrastructure environment",
      },
      {
        title: "DevOps & CI/CD",
        imageSrc: `${SECTION_3_ASSET_BASE}/software-dev/DevOps.webp`,
        imageAlt: "DevOps and continuous delivery interface",
      },
    ],
    deliverables: [
      "A production-ready application, not a prototype.",
      "Documented APIs your team or a future vendor can build on without reverse-engineering it.",
      "A deployment pipeline that ships updates without downtime.",
    ],
    ctaLabel: "Explore Custom Software Builds",
    ctaHref: "/services/software-development",
  },
  {
    id: "mobile-app-development",
    label: "Mobile App Development",
    description:
      "Apps built for the platforms your customers actually use, native or cross-platform, whichever fits the job.",
    capabilities: [
      {
        title: "Native iOS & Android",
        imageSrc: `${SECTION_3_ASSET_BASE}/mobile-app-dev/Native%20iOS%20%26%20Android.webp`,
        imageAlt: "Native mobile app interface",
      },
      {
        title: "Cross-platform Builds",
        imageSrc: `${SECTION_3_ASSET_BASE}/mobile-app-dev/Cross-platform%20builds.webp`,
        imageAlt: "Cross-platform app interface",
      },
      {
        title: "App Maintenance & Scaling",
        imageSrc: `${SECTION_3_ASSET_BASE}/mobile-app-dev/App%20Maintenance%20%26%20Scaling.webp`,
        imageAlt: "Mobile app maintenance and scaling interface",
      },
      {
        title: "App Store / Play Store Deployment",
        imageSrc: `${SECTION_3_ASSET_BASE}/mobile-app-dev/App%20Store%20-%20Playstore%20Deployment.webp`,
        imageAlt: "App store and Play Store deployment interface",
      },
    ],
    deliverables: [
      "A published, store-ready app under your own developer account.",
      "A maintenance plan so the app keeps working through OS updates.",
      "Performance benchmarking before launch, not after user complaints.",
    ],
    ctaLabel: "See our mobile app work",
    ctaHref: "/services/mobile-app-development",
  },
  {
    id: "design-creative",
    label: "Design & Creative",
    description:
      "Interfaces designed around what your users actually do, backed by research, not guesswork.",
    capabilities: [
      {
        title: "User Research & Prototyping",
        imageSrc: `${SECTION_3_ASSET_BASE}/design-creative/User%20Research.webp`,
        imageAlt: "User research and prototyping workspace",
      },
      {
        title: "Product Design",
        imageSrc: `${SECTION_3_ASSET_BASE}/design-creative/Product%20Design.webp`,
        imageAlt: "Product design interface",
      },
      {
        title: "Design Systems",
        imageSrc: `${SECTION_3_ASSET_BASE}/design-creative/Design%20Systems.webp`,
        imageAlt: "Design system interface",
      },
      {
        title: "Usability Testing",
        imageSrc: `${SECTION_3_ASSET_BASE}/design-creative/Usability%20Testing.webp`,
        imageAlt: "Usability testing workspace",
      },
    ],
    deliverables: [
      "A design system your dev team can build from directly.",
      "Prototypes tested with real users before a single line of code is written.",
      "Reusable components that scale as your product grows, instead of one-off screens.",
    ],
    ctaLabel: "See Our Design Process",
    ctaHref: "/services/design-creative",
  },
  {
    id: "crm-erp-solutions",
    label: "CRM/ERP Solutions",
    description: "A CRM or ERP shaped around your workflow, not the other way around.",
    capabilities: [
      {
        title: "Custom CRM Builds",
        imageSrc: `${SECTION_3_ASSET_BASE}/crm-erp-sols/Custom%20CRM.webp`,
        imageAlt: "Custom CRM interface",
      },
      {
        title: "ERP Implementation",
        imageSrc: `${SECTION_3_ASSET_BASE}/crm-erp-sols/ERP%20Implementation.webp`,
        imageAlt: "ERP implementation interface",
      },
      {
        title: "Workflow & Process Automation",
        imageSrc: `${SECTION_3_ASSET_BASE}/crm-erp-sols/Workflow.webp`,
        imageAlt: "Workflow automation interface",
      },
      {
        title: "Third-party Integrations",
        imageSrc: `${SECTION_3_ASSET_BASE}/crm-erp-sols/Third%20Party.webp`,
        imageAlt: "Third-party integration interface",
      },
    ],
    deliverables: [
      "A system your team actually uses, not one they quietly route around.",
      "Automated handoffs between departments that used to require manual work.",
      "Integration with the tools you already run, not a forced rip-and-replace.",
    ],
    ctaLabel: "Build Your Custom CRM",
    ctaHref: "/services/crm-erp-solutions",
  },
];
