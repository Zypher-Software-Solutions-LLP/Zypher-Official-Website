export type ScaleMetric = {
  id: string;
  title: string;
  value: string;
  prefix?: string;
  label: string;
  description: string;
};

export type ScaleProject = {
  id: string;
  href: string;
  eyebrow: string;
  title: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
};

export type ScaleClientLogo = {
  id: string;
  name: string;
  src: string;
  alt: string;
};

const MEDIA_BASE_URL = "https://media.zypher-solutions.com/home-page/section-2";
const WORK_ROUTE = "/work";

export const scaleMetrics = [
  {
    id: "projects-delivered",
    title: "25+ Projects Delivered",
    value: "25+",
    label: "Projects Delivered",
    description: "Across a range of industries from manufacturing to healthcare to Real estate.",
  },
  {
    id: "clients-served",
    title: "20+ Clients Served",
    value: "20+",
    label: "Clients Served",
    description: "From first-time founders to established enterprises.",
  },
  {
    id: "countries-served",
    title: "Across 10+ Countries",
    prefix: "Across",
    value: "10+",
    label: "Countries",
    description: "U.S.A, U.K, U.A.E, Qatar, India, Netherlands and more.",
  },
] as const satisfies readonly ScaleMetric[];

export const scaleProjects = [
  {
    id: "custom-crm",
    href: WORK_ROUTE,
    eyebrow: "CRM & ERP",
    title: "Custom CRM",
    description:
      "A custom CRM connecting one client's business end-to-end, with automation replacing manual work.",
    imageSrc: MEDIA_BASE_URL + "/2.webp",
    imageAlt: "Custom CRM dashboard showing connected business operations",
  },
  {
    id: "vms-platform",
    href: WORK_ROUTE,
    eyebrow: "CYBERSECURITY",
    title: "VMS - Platform",
    description: "A cybersecurity platform catching vulnerabilities before they become incidents.",
    imageSrc: MEDIA_BASE_URL + "/5.webp",
    imageAlt: "VMS cybersecurity platform dashboard showing security controls",
  },
  {
    id: "rental-system",
    href: WORK_ROUTE,
    eyebrow: "RETAIL OPS",
    title: "Rental System",
    description: "A rental platform that gave a two-branch business one place to run both.",
    imageSrc: MEDIA_BASE_URL + "/3.webp",
    imageAlt: "Rental System retail operations interface",
  },
] as const satisfies readonly ScaleProject[];

export const scaleClientLogos = [
  {
    id: "divise",
    name: "DiViSe",
    src: MEDIA_BASE_URL + "/DiViSe%20Logo.png",
    alt: "DiViSe client logo",
  },
  {
    id: "es-decorations",
    name: "ES Decorations",
    src: MEDIA_BASE_URL + "/ES%20Decorations%20Logo.png",
    alt: "ES Decorations client logo",
  },
  {
    id: "liminal",
    name: "Liminal",
    src: MEDIA_BASE_URL + "/LIMINAL%20Logo.png",
    alt: "Liminal client logo",
  },
  {
    id: "lylux",
    name: "Lylux",
    src: MEDIA_BASE_URL + "/Lylux%20Logo.png",
    alt: "Lylux client logo",
  },
  {
    id: "meiris",
    name: "Meiris",
    src: MEDIA_BASE_URL + "/MEIRIS%20Logo.png",
    alt: "Meiris client logo",
  },
  {
    id: "people-maketh",
    name: "PeopleMaketh",
    src: MEDIA_BASE_URL + "/PeopleMaketh%20Logo.png",
    alt: "PeopleMaketh client logo",
  },
  {
    id: "smt-malabar",
    name: "SMT Malabar",
    src: MEDIA_BASE_URL + "/SMT%20Malabar%20Logo.png",
    alt: "SMT Malabar client logo",
  },
  {
    id: "securethread",
    name: "SecureThread OPS",
    src: MEDIA_BASE_URL + "/SecureThread%20OPS%20Logo.png",
    alt: "SecureThread OPS client logo",
  },
  {
    id: "sonexia",
    name: "Sonexia",
    src: MEDIA_BASE_URL + "/Sonexia%20Logo.png",
    alt: "Sonexia client logo",
  },
  {
    id: "usr",
    name: "USR",
    src: MEDIA_BASE_URL + "/USR%20Logo.png",
    alt: "USR client logo",
  },
] as const satisfies readonly ScaleClientLogo[];
