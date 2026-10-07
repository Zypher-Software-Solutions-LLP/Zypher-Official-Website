export type ScaleIndustry = {
  readonly id: string;
  readonly title: string;
  readonly imageSrc: string;
  readonly imageAlt: string;
  readonly desktopPlacement?: "education" | "professional";
};

const INDUSTRY_ASSET_BASE = "https://media.zypher-solutions.com/scale-page/section-3/";

export const scaleIndustries: ReadonlyArray<ScaleIndustry> = [
  {
    id: "fintech",
    title: "Fintech",
    imageSrc: `${INDUSTRY_ASSET_BASE}Fintech.webp`,
    imageAlt: "Fintech workspace",
  },
  {
    id: "retail",
    title: "Retail & E-Commerce",
    imageSrc: `${INDUSTRY_ASSET_BASE}Retail.webp`,
    imageAlt: "Retail and e-commerce workspace",
  },
  {
    id: "healthcare",
    title: "Healthcare",
    imageSrc: `${INDUSTRY_ASSET_BASE}Healthcare.webp`,
    imageAlt: "Healthcare workspace",
  },
  {
    id: "sports",
    title: "Sports",
    imageSrc: `${INDUSTRY_ASSET_BASE}Sports.webp`,
    imageAlt: "Sports workspace",
  },
  {
    id: "logistics",
    title: "Logistics & Ops",
    imageSrc: `${INDUSTRY_ASSET_BASE}Logistics%20%26%20Ops.webp`,
    imageAlt: "Logistics and operations workspace",
  },
  {
    id: "real-estate",
    title: "Real Estate",
    imageSrc: `${INDUSTRY_ASSET_BASE}Real%20Estate.webp`,
    imageAlt: "Real estate workspace",
  },
  {
    id: "saas",
    title: "SaaS & Services",
    imageSrc: `${INDUSTRY_ASSET_BASE}Saas%20%26%20Services.webp`,
    imageAlt: "SaaS and services workspace",
  },
  {
    id: "hospitality",
    title: "Hospitality | Events",
    imageSrc: `${INDUSTRY_ASSET_BASE}Hospitality.webp`,
    imageAlt: "Hospitality and events workspace",
  },
  {
    id: "education",
    title: "Education & EdTech",
    imageSrc: `${INDUSTRY_ASSET_BASE}Education.webp`,
    imageAlt: "Education and EdTech workspace",
    desktopPlacement: "education",
  },
  {
    id: "professional-services",
    title: "Professional Services",
    imageSrc: `${INDUSTRY_ASSET_BASE}Professional%20Services.webp`,
    imageAlt: "Professional services workspace",
    desktopPlacement: "professional",
  },
];
