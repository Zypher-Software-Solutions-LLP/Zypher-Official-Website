import type { LegalPolicySection } from "./legal-policy-types";

export type { LegalPolicyBlock, LegalPolicySection } from "./legal-policy-types";

export const PRIVACY_POLICY_LAST_UPDATED = "10 September 2026";
export const privacyPolicyIntroduction: readonly string[] = [
  'Zypher Software Solutions LLP ("Zypher", "we", "us", or "our") respects your privacy and is committed to protecting personal information collected through zypher-solutions.com (the "Website").',
  'This Privacy Policy explains what information we collect, how we use it, your rights, and the choices available to you. It also describes how we handle personal data in accordance with applicable laws, including the Digital Personal Data Protection Act, 2023 and the Digital Personal Data Protection Rules, 2025 (together, the "DPDP Framework").',
  "Zypher Software Solutions LLP is established in Kerala, India and is registered as a Limited Liability Partnership.",
];

export const privacyPolicySections: readonly LegalPolicySection[] = [
  {
    id: "information-we-collect",
    number: "01",
    title: "Information We Collect",
    blocks: [
      {
        type: "paragraph",
        text: "The information we collect depends on how you interact with us.",
      },
      { type: "subheading", text: "Information you provide" },
      {
        type: "paragraph",
        text: "When you contact us, submit an enquiry, request a consultation, or discuss a potential project, we may collect:",
      },
      {
        type: "list",
        items: [
          "name;",
          "email address;",
          "telephone number;",
          "company or organisation name;",
          "service or solution of interest;",
          "project requirements;",
          "budget range;",
          "information included in your message; and",
          "any other information you choose to provide.",
        ],
      },
      {
        type: "paragraph",
        text: "If you schedule a meeting, we may also collect meeting preferences, date and time, timezone, and related information.",
      },
      { type: "subheading", text: "Recruitment information" },
      {
        type: "paragraph",
        text: "If you apply for employment, an internship, freelance work, or another opportunity with Zypher, we may collect information such as your contact details, CV or résumé, education, employment history, portfolio, professional profiles, and information provided during the recruitment process.",
      },
      { type: "subheading", text: "Newsletter information" },
      {
        type: "paragraph",
        text: "If you choose to subscribe to our newsletter or other updates, we may collect your name, email address, and communication preferences.",
      },
      {
        type: "paragraph",
        text: "Submitting an enquiry does not automatically subscribe you to marketing communications.",
      },
      { type: "subheading", text: "Information collected automatically" },
      {
        type: "paragraph",
        text: "When you use our Website, we or our service providers may collect technical and usage information such as:",
      },
      {
        type: "list",
        items: [
          "IP address;",
          "browser and device information;",
          "operating system;",
          "approximate location;",
          "pages viewed;",
          "referring pages;",
          "Website interactions;",
          "session and performance information; and",
          "cookie, analytics, or security information.",
        ],
      },
    ],
  },
  {
    id: "how-we-use-your-information",
    number: "02",
    title: "How We Use Your Information",
    blocks: [
      {
        type: "paragraph",
        text: "We may use personal information to:",
      },
      {
        type: "list",
        items: [
          "respond to enquiries;",
          "understand project requirements;",
          "schedule consultations and meetings;",
          "prepare proposals, quotations, or estimates;",
          "communicate with prospective and existing clients;",
          "operate and improve our Website and services;",
          "analyse Website traffic and performance;",
          "prevent spam, fraud, bots, and malicious activity;",
          "manage recruitment applications;",
          "send newsletters or updates where you have chosen to receive them;",
          "maintain appropriate business records; and",
          "comply with applicable legal or regulatory requirements.",
        ],
      },
      { type: "paragraph", text: "We do not sell or rent personal information." },
    ],
  },
  {
    id: "cookies-and-analytics",
    number: "03",
    title: "Cookies and Analytics",
    blocks: [
      {
        type: "paragraph",
        text: "Our Website uses or may use cookies and similar technologies for Website functionality, security, analytics, performance, and user preferences.",
      },
      {
        type: "paragraph",
        text: "Our technology environment may include services such as:",
      },
      {
        type: "list",
        items: [
          "Google Analytics;",
          "Google Tag Manager;",
          "Vercel Analytics;",
          "Cloudflare;",
          "Sanity;",
          "Cloudinary;",
          "Cal.com; and",
          "other service providers that support our Website and business operations.",
        ],
      },
      {
        type: "paragraph",
        text: "Where applicable law requires consent for non-essential cookies or similar technologies, we will provide appropriate cookie controls before such technologies are activated.",
      },
      { type: "paragraph", text: "For more information, please see our Cookie Policy." },
    ],
  },
  {
    id: "service-providers",
    number: "04",
    title: "Service Providers",
    blocks: [
      {
        type: "paragraph",
        text: "We use third-party service providers to support functions such as:",
      },
      {
        type: "list",
        items: [
          "Website and cloud hosting;",
          "content management;",
          "media delivery;",
          "analytics;",
          "email communication;",
          "meeting scheduling;",
          "Website security;",
          "anti-spam and bot protection;",
          "customer relationship management; and",
          "recruitment.",
        ],
      },
      {
        type: "paragraph",
        text: "These providers are permitted to process personal information only to the extent necessary to provide their services to us. The providers we use may change as our systems and business evolve.",
      },
      {
        type: "paragraph",
        text: "We may also disclose information where required by law, to professional advisers, or where reasonably necessary to protect our rights, systems, or users.",
      },
    ],
  },
  {
    id: "international-data-transfers",
    number: "05",
    title: "International Data Transfers",
    blocks: [
      {
        type: "paragraph",
        text: "Zypher is based in India and works with clients and service providers internationally, including in the Gulf Cooperation Council (GCC) region, Asia, Europe, and the United States.",
      },
      {
        type: "paragraph",
        text: "As a result, personal information may be processed or stored in India or in other countries where our technology providers or business partners operate.",
      },
      {
        type: "paragraph",
        text: "Where applicable law requires safeguards for international transfers — including under the DPDP Framework — we take reasonable steps to use appropriate contractual, technical, or organisational measures. Cross-border transfers of personal data are subject to applicable Indian law and any notified country-level approvals under the DPDP Framework.",
      },
    ],
  },
  {
    id: "data-retention",
    number: "06",
    title: "Data Retention",
    blocks: [
      {
        type: "paragraph",
        text: "We retain personal information only for as long as reasonably necessary for the purpose for which it was collected and for applicable legal, contractual, accounting, security, or business requirements.",
      },
      { type: "subheading", text: "For example:" },
      {
        type: "list",
        items: [
          "enquiry information may be retained while we respond and for a reasonable period afterwards;",
          "client information may be retained for the duration of the business relationship and any required period afterwards;",
          "recruitment information may be retained for the relevant recruitment process and, where appropriate, for future opportunities;",
          "newsletter information may be retained until you unsubscribe; and",
          "technical and security logs may be retained for security and troubleshooting purposes.",
        ],
      },
      {
        type: "paragraph",
        text: "When information is no longer required, we may delete, anonymise, or securely dispose of it.",
      },
    ],
  },
  {
    id: "data-security",
    number: "07",
    title: "Data Security",
    blocks: [
      {
        type: "paragraph",
        text: "We use reasonable technical and organisational measures designed to protect personal information against unauthorised access, misuse, loss, alteration, or disclosure.",
      },
      {
        type: "paragraph",
        text: "These measures may include secure cloud infrastructure, encrypted communications, access controls, monitoring, bot and abuse protection, software maintenance, and restricted access to information.",
      },
      {
        type: "paragraph",
        text: "However, no online system or method of electronic storage can be guaranteed to be completely secure.",
      },
      { type: "subheading", text: "Data Breach Notification" },
      {
        type: "paragraph",
        text: "In the event of a personal data breach that is likely to result in harm to you, we will notify you and, where required, the Data Protection Board of India, without undue delay and in accordance with the obligations under the DPDP Framework. Notification will include details of the breach and steps we are taking or have taken to address it.",
      },
    ],
  },
  {
    id: "your-privacy-rights",
    number: "08",
    title: "Your Privacy Rights",
    blocks: [
      {
        type: "paragraph",
        text: "Under the DPDP Framework and, where applicable, other laws governing your jurisdiction, you may have the right to:",
      },
      {
        type: "list",
        items: [
          "request information about personal data we process about you;",
          "request access to personal data we hold about you;",
          "request correction or updating of inaccurate or incomplete information;",
          "request erasure of personal data where applicable;",
          "withdraw consent at any time where processing is based on consent (withdrawal does not affect the lawfulness of prior processing);",
          "object to or restrict certain processing where applicable;",
          "request data portability where applicable;",
          "nominate another individual to exercise your rights on your behalf; and",
          "raise a privacy complaint or grievance.",
        ],
      },
      { type: "subheading", text: "How to Withdraw Consent" },
      {
        type: "paragraph",
        text: "Where we process personal data based on your consent (for example, newsletter subscriptions), you may withdraw consent at any time by contacting us at info@zypher-solutions.com or using the unsubscribe link in any marketing communication. Withdrawal of consent will not affect processing carried out before withdrawal.",
      },
      { type: "subheading", text: "Response Timeline" },
      {
        type: "paragraph",
        text: "We will respond to valid privacy rights requests within 7 days of receipt, in accordance with Rule 14 of the DPDP Rules, 2025. We may need to verify your identity before responding to a request.",
      },
      { type: "subheading", text: "How to Exercise Your Rights" },
      {
        type: "paragraph",
        text: "To exercise any privacy right or raise a grievance, contact our designated grievance mechanism at:",
      },
      {
        type: "contact",
        lines: [
          "Email: info@zypher-solutions.com",
          'Subject line: "Privacy Request – [Nature of Request]"',
        ],
      },
      {
        type: "paragraph",
        text: "If you are not satisfied with our response, you may escalate your complaint to the Data Protection Board of India once it becomes operational in accordance with applicable timelines under the DPDP Framework.",
      },
    ],
  },
  {
    id: "international-users",
    number: "09",
    title: "International Users",
    blocks: [
      {
        type: "paragraph",
        text: "Zypher is established in India, but our Website and services may be accessed by individuals in other countries, including in the GCC region, Asia, Europe, and the United States.",
      },
      {
        type: "paragraph",
        text: "Our privacy practices are primarily governed by applicable Indian law, including the DPDP Framework. Depending on your location and the nature of the processing, additional privacy rights may apply under the laws of your jurisdiction — including the General Data Protection Regulation (GDPR) for individuals in the European Economic Area, or applicable GCC data protection regulations.",
      },
      {
        type: "paragraph",
        text: "We will consider valid privacy requests in accordance with applicable law. The fact that our Website is accessible from a particular country does not automatically mean that every privacy law of that country applies to every interaction with Zypher.",
      },
    ],
  },
  {
    id: "recruitment",
    number: "10",
    title: "Recruitment",
    blocks: [
      {
        type: "paragraph",
        text: "If you submit an application for employment or another opportunity with Zypher, we use the information you provide to evaluate your application, communicate with you, manage the recruitment process, and comply with applicable requirements.",
      },
      {
        type: "paragraph",
        text: "Where appropriate, we may retain application information for future opportunities. Application information is handled with the same security and access controls applied to other personal data we process.",
      },
    ],
  },
  {
    id: "childrens-privacy",
    number: "11",
    title: "Children's Privacy",
    blocks: [
      {
        type: "paragraph",
        text: "Our Website and services are intended primarily for businesses, organisations, and professionals and are not directed to children under the age of 18.",
      },
      {
        type: "paragraph",
        text: "We do not knowingly seek to collect personal information from children through the Website for business-development or marketing purposes. If you believe a child has provided personal information to us inappropriately, please contact us and we will take steps to delete such information.",
      },
    ],
  },
  {
    id: "client-projects",
    number: "12",
    title: "Client Projects",
    blocks: [
      {
        type: "paragraph",
        text: "Zypher may process personal information on behalf of clients while providing software development, automation, cloud, consulting, or related technology services.",
      },
      {
        type: "paragraph",
        text: "In such cases, processing may be governed by the relevant client agreement, data-processing terms, and instructions of the client. Zypher acts as a data processor in those contexts, and the client retains responsibility as the data fiduciary/controller for that data.",
      },
      {
        type: "paragraph",
        text: "This Privacy Policy primarily applies to information collected by Zypher for its own Website, enquiries, communications, recruitment, marketing, and business operations.",
      },
    ],
  },
  {
    id: "changes-to-this-policy",
    number: "13",
    title: "Changes to This Policy",
    blocks: [
      {
        type: "paragraph",
        text: "We may update this Privacy Policy from time to time to reflect changes in our Website, technology, business practices, or applicable law.",
      },
      {
        type: "paragraph",
        text: 'When we update the Policy, we will revise the "Last Updated" date above. For material changes, we may also notify you by email or a prominent notice on our Website.',
      },
    ],
  },
  {
    id: "contact-and-grievance-officer",
    number: "14",
    title: "Contact and Grievance Officer",
    blocks: [
      {
        type: "paragraph",
        text: "If you have questions about this Privacy Policy, wish to exercise a privacy right, or want to raise a concern or grievance, contact us at:",
      },
      {
        type: "contact",
        lines: [
          "Zypher Software Solutions LLP",
          "WORK WELL COWORKING",
          "5th Floor, Kannur Rd",
          "Vikas Nagar Housing Colony",
          "West Nadakkave, Chakkorathukulam",
          "Kozhikode, Kerala 673006",
          "India",
          "",
          "Email: info@zypher-solutions.com",
          "Website: zypher-solutions.com",
        ],
      },
      {
        type: "paragraph",
        text: 'For privacy-related requests, please use the subject line: "Privacy Request – [Nature of Request]" to ensure prompt handling. We will acknowledge your request and respond within 7 days.',
      },
      {
        type: "paragraph",
        text: "Our privacy practices are primarily governed by applicable laws of India, including the Digital Personal Data Protection Act, 2023 and the Digital Personal Data Protection Rules, 2025.",
      },
    ],
  },
];
