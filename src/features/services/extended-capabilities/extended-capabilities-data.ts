export type ExtendedCapability = {
  id: string;
  label: string;
  iconSrc: string;
  thumbnailSrc: string;
  description: string;
  deliverables: readonly string[];
  ctaLabel: string;
  ctaHref: string;
};

const SECTION_4_ASSET_BASE = "https://media.zypher-solutions.com/services-page/section-4";

export const extendedCapabilities: readonly ExtendedCapability[] = [
  {
    id: "cybersecurity",
    label: "Cybersecurity",
    iconSrc: `${SECTION_4_ASSET_BASE}/Cybersecurity%20-%20Icon.png`,
    thumbnailSrc: `${SECTION_4_ASSET_BASE}/Cybersecurity%20-%20Thumbnail.png`,
    description:
      "Security audits, penetration testing, and compliance setup (SOC2, GDPR) so vulnerabilities get found by us, not by an attacker. Every engagement ends with a remediation report your team can act on immediately, not a generic scorecard.",
    deliverables: [
      "A full audit report with ranked, actionable vulnerabilities",
      "Compliance documentation ready for SOC2 or GDPR review",
      "A secure architecture recommendation for long-term hardening",
    ],
    ctaLabel: "Get In Touch",
    ctaHref: "/contact",
  },
  {
    id: "data-analytics",
    label: "Data Analytics & Data Science",
    iconSrc: `${SECTION_4_ASSET_BASE}/Data%20Analytics%20%26%20Data%20Science%20-%20Icon.png`,
    thumbnailSrc: `${SECTION_4_ASSET_BASE}/Data%20Analytics%20%26%20Data%20Science%20-%20Thumbnail.png`,
    description:
      "Predictive models, BI dashboards, and reporting built from data your business already has but isn't using. The goal is decisions made faster, not more data to stare at.",
    deliverables: [
      "A live dashboard your team can query without a data scientist in the room",
      "A cleaned, structured data pipeline that feeds future models",
      "An initial predictive model scoped to your highest-value use case",
    ],
    ctaLabel: "Get In Touch",
    ctaHref: "/contact",
  },
  {
    id: "digital-marketing",
    label: "Digital Marketing",
    iconSrc:
      "https://media.zypher-solutions.com/services-page/section-4/Digital%20Marketing%20-%20Icon.png",
    thumbnailSrc:
      "https://media.zypher-solutions.com/services-page/section-4/Digital%20Marketing%20-%20Thumbnail.png",
    description:
      "Paid, organic, and lifecycle campaigns built around the audience you need to reach, with reporting tied to business outcomes rather than vanity metrics.",
    deliverables: [
      "A channel strategy tied to the goals and audience that matter to your business",
      "Campaign creative and landing-page direction built to convert attention into action",
      "Reporting that connects campaign performance to qualified opportunities and revenue",
    ],
    ctaLabel: "Get In Touch",
    ctaHref: "/contact",
  },
  {
    id: "seo-aeo-geo",
    label: "SEO, AEO & GEO",
    iconSrc: `${SECTION_4_ASSET_BASE}/SEO%2C%20AEO%2C%20GEO%20-%20Icon.png`,
    thumbnailSrc: `${SECTION_4_ASSET_BASE}/SEO%20AEO%20GEO%20-%20Thumbnail.png`,
    description:
      "Technical and content SEO, plus optimization for how AI engines like ChatGPT and Perplexity find and cite your business, the same discipline applied to Zypher's own site, so it's a claim backed by practice, not a pitch. Ranking in traditional search and being cited in AI-generated answers are now two different problems that need to be solved together.",
    deliverables: [
      "A technical SEO audit with prioritized fixes, not a 200-item checklist",
      "Content structured to be cited by AI answer engines (AEO/GEO compliant)",
      "An llms.txt and structured data layer so AI agents can read and reference your site accurately",
    ],
    ctaLabel: "Get In Touch",
    ctaHref: "/contact",
  },
  {
    id: "cloud-infrastructure",
    label: "Cloud & Infrastructure",
    iconSrc: `${SECTION_4_ASSET_BASE}/Cloud%20%26%20Infrastructure%20-%20Icon.png`,
    thumbnailSrc: `${SECTION_4_ASSET_BASE}/Cloud%20Infrastructure%20-%20Thumbnail.png`,
    description:
      "Migration, scaling, and monitoring so your infrastructure isn't the reason something breaks at the worst time. Every system is handed back with runbooks, not just a working deployment.",
    deliverables: [
      "A cloud architecture scoped to your current load and next growth stage",
      "A monitoring and alerting setup that catches problems before your users do",
      "Runbooks and documentation so your team can maintain it without calling us",
    ],
    ctaLabel: "Get In Touch",
    ctaHref: "/contact",
  },
];
