export const workCategories = [
  "All",
  "AI Automation",
  "CRM/ERP",
  "Software Development",
  "Cybersecurity",
  "UI/UX Design",
] as const;

export type WorkCategory = (typeof workCategories)[number];

export type WorkProject = {
  id: string;
  imageSrc: string;
  imageAlt: string;
  imagePosition: "top" | "center";
  title: string;
  description: string;
  tags: readonly Exclude<WorkCategory, "All">[];
};

const workImageBaseUrl = "https://media.zypher-solutions.com/work-page/section-2";

export const workProjects: readonly WorkProject[] = [
  {
    id: "lylux-custom-crm",
    imageSrc: workImageBaseUrl + "/2.png",
    imagePosition: "top",
    imageAlt: "Lylux Custom CRM product interface",
    title: "Lylux Custom CRM",
    description:
      "A custom CRM replacing fragmented client tracking for a UAE lighting distributor.",
    tags: ["CRM/ERP", "Software Development"],
  },
  {
    id: "securethread-ops-vms",
    imageSrc: workImageBaseUrl + "/5.png",
    imagePosition: "top",
    imageAlt: "SecureThread OPS VMS platform interface",
    title: "SecureThread OPS - VMS",
    description:
      "An automated VMS platform built to detect, prioritize and manage security risks at scale.",
    tags: ["Cybersecurity", "Software Development"],
  },
  {
    id: "early-access-rental-ms",
    imageSrc: workImageBaseUrl + "/3.png",
    imagePosition: "top",
    imageAlt: "Early Access rental management platform interface",
    title: "Early Access - Rental MS",
    description:
      "A flexible rental management platform built to streamline inventory, bookings and operations.",
    tags: ["Software Development"],
  },
  {
    id: "sales-outreach-agent",
    imageSrc: workImageBaseUrl + "/4.png",
    imagePosition: "top",
    imageAlt: "Sales outreach agent interface",
    title: "Sales Outreach Agent",
    description: "A custom sales outreach agent built to automate lead engagement and follow-ups.",
    tags: ["AI Automation"],
  },
  {
    id: "official-website-meiris",
    imageSrc: workImageBaseUrl + "/1.png",
    imagePosition: "top",
    imageAlt: "MEIRIS corporate website interface",
    title: "Official Website - MEIRIS",
    description: "A multilingual corporate website showcasing SIRIEM’s power conversion solutions.",
    tags: ["UI/UX Design", "Software Development"],
  },
  {
    id: "product-configuration-platform",
    imageSrc: workImageBaseUrl + "/6.png",
    imagePosition: "top",
    imageAlt: "Product configuration platform interface",
    title: "Product Configuration Platform",
    description:
      "Custom built product configuration for streamlined discovery, specifications and datasheet access.",
    tags: ["AI Automation", "Software Development"],
  },
  {
    id: "official-website-sonexia",
    imageSrc: workImageBaseUrl + "/7.png",
    imagePosition: "center",
    imageAlt: "SONEXIA interactive acoustic website interface",
    title: "Official Website - SONEXIA",
    description:
      "Custom acoustic experience platform featuring interactive 3D visualization & real-time configuration.",
    tags: ["UI/UX Design", "Software Development"],
  },
  {
    id: "es-decorations-website",
    imageSrc: workImageBaseUrl + "/8.png",
    imagePosition: "center",
    imageAlt: "E&S Decorations event management website interface",
    title: "E&S Decorations Website",
    description:
      "Custom built event management website with built-in admin panel to showcase services and portfolio.",
    tags: ["UI/UX Design", "Software Development"],
  },
];
