import type { LegalPolicySection } from "./legal-policy-types";

export const COOKIE_POLICY_LAST_UPDATED = "Last Updated Date";

export const cookiePolicyIntroduction: readonly string[] = [
  'This Cookie Policy explains how Zypher Software Solutions LLP ("Zypher", "we", "us", or "our") uses cookies and similar technologies on zypher-solutions.com (the "Website").',
  'This Policy should be read together with our Privacy Policy, which also describes our data handling practices under applicable laws including the Digital Personal Data Protection Act, 2023 and the Digital Personal Data Protection Rules, 2025 (together, the "DPDP Framework").',
];

export const cookiePolicySections: readonly LegalPolicySection[] = [
  {
    id: "what-are-cookies",
    number: "01",
    title: "What Are Cookies?",
    blocks: [
      {
        type: "paragraph",
        text: "Cookies are small files stored on your device when you visit a website.",
      },
      {
        type: "paragraph",
        text: "They may be used to keep a website functioning, remember preferences, maintain security, understand Website usage, and measure performance.",
      },
      {
        type: "paragraph",
        text: 'Similar technologies such as local storage, tags, pixels, and scripts may also be used. In this Policy, we refer to these collectively as "cookies".',
      },
    ],
  },
  {
    id: "how-we-use-cookies",
    number: "02",
    title: "How We Use Cookies",
    blocks: [
      {
        type: "paragraph",
        text: "We use or may use cookies and similar technologies to:",
      },
      {
        type: "list",
        items: [
          "operate essential Website functionality;",
          "maintain Website and infrastructure security;",
          "prevent spam, fraud, bots, and malicious activity;",
          "remember cookie preferences;",
          "understand how visitors use the Website;",
          "measure traffic and Website performance; and",
          "improve our Website, content, and user experience.",
        ],
      },
      {
        type: "paragraph",
        text: "We may introduce additional technologies for campaign measurement or marketing in the future. Where we do, this Policy will be updated accordingly.",
      },
    ],
  },
  {
    id: "types-of-cookies-we-use",
    number: "03",
    title: "Types of Cookies We Use",
    blocks: [
      {
        type: "subheading",
        text: "Necessary Cookies",
      },
      {
        type: "paragraph",
        text: "These cookies or technologies are required for the Website to function securely and reliably.",
      },
      {
        type: "paragraph",
        text: "They may support:",
      },
      {
        type: "list",
        items: [
          "Website security;",
          "fraud and bot prevention;",
          "network management;",
          "consent preference storage; and",
          "essential Website functionality.",
        ],
      },
      {
        type: "paragraph",
        text: "These technologies may operate without optional consent where permitted by applicable law. They cannot be disabled without affecting core Website function.",
      },
      {
        type: "paragraph",
        text: "Typical duration: session-based or up to 12 months depending on the function.",
      },
      {
        type: "subheading",
        text: "Analytics and Performance Cookies",
      },
      {
        type: "paragraph",
        text: "These technologies help us understand how visitors interact with the Website.",
      },
      {
        type: "paragraph",
        text: "They may collect information such as:",
      },
      {
        type: "list",
        items: [
          "pages viewed;",
          "Website interactions;",
          "browser and device information;",
          "referral source;",
          "approximate location;",
          "session information; and",
          "Website performance data.",
        ],
      },
      {
        type: "paragraph",
        text: "Our analytics environment may include services such as Google Analytics, Google Tag Manager, and Vercel Analytics.",
      },
      {
        type: "paragraph",
        text: "Where applicable law requires consent, optional analytics technologies will only be activated after consent has been provided through our cookie consent mechanism.",
      },
      {
        type: "paragraph",
        text: "Typical duration: session-based to 24 months, depending on the provider.",
      },
      {
        type: "subheading",
        text: "Functional Cookies",
      },
      {
        type: "paragraph",
        text: "Functional technologies may remember choices or preferences to improve your experience.",
      },
      {
        type: "paragraph",
        text: "Some may be necessary for a feature you request, while others may be optional.",
      },
      {
        type: "paragraph",
        text: "Typical duration: session-based or up to 12 months.",
      },
      {
        type: "subheading",
        text: "Marketing Cookies",
      },
      {
        type: "paragraph",
        text: "We may introduce marketing or advertising technologies in the future for purposes such as campaign measurement or conversion tracking.",
      },
      {
        type: "paragraph",
        text: "Where consent is required, these technologies will not be activated unless you choose to allow them. This Policy will be updated before any marketing cookies are introduced.",
      },
    ],
  },
  {
    id: "third-party-services",
    number: "04",
    title: "Third-Party Services",
    blocks: [
      {
        type: "paragraph",
        text: "Our Website uses or may use technology providers including:",
      },
      {
        type: "list",
        items: [
          "Google;",
          "Vercel;",
          "Cloudflare;",
          "Sanity;",
          "Cloudinary;",
          "Cal.com; and",
          "other providers supporting our Website and business operations.",
        ],
      },
      {
        type: "paragraph",
        text: "These providers may process technical information or use cookies depending on the services and configuration involved. Not every provider listed above necessarily places cookies on your device.",
      },
      {
        type: "paragraph",
        text: "Third-party services may also process information according to their own privacy policies and terms, over which Zypher has no control.",
      },
    ],
  },
  {
    id: "security-technologies",
    number: "05",
    title: "Security Technologies",
    blocks: [
      {
        type: "paragraph",
        text: "We may use services such as Cloudflare or similar providers to protect our Website from malicious traffic, spam, bots, abuse, and security threats.",
      },
      {
        type: "paragraph",
        text: "These services may process information such as IP addresses, request information, browser or device characteristics, and security signals.",
      },
      {
        type: "paragraph",
        text: "Certain security technologies are considered necessary for the safe and reliable operation of the Website and may function without consent.",
      },
    ],
  },
  {
    id: "embedded-and-external-services",
    number: "06",
    title: "Embedded and External Services",
    blocks: [
      {
        type: "paragraph",
        text: "Our Website may include or link to third-party services such as Cal.com, WhatsApp, LinkedIn, or other communication and social platforms.",
      },
      {
        type: "paragraph",
        text: "When you interact with these services, the relevant provider may use its own cookies or similar technologies. Zypher does not control cookies placed directly by third-party websites or platforms.",
      },
    ],
  },
  {
    id: "your-cookie-choices",
    number: "07",
    title: "Your Cookie Choices",
    blocks: [
      {
        type: "paragraph",
        text: "Where required by applicable law, we provide controls that allow you to manage optional cookies.",
      },
      {
        type: "subheading",
        text: "Cookie Consent Banner",
      },
      {
        type: "paragraph",
        text: "When you first visit our Website, you may be presented with a cookie consent banner or notice that allows you to accept or reject non-essential cookies by category. Strictly necessary cookies will remain active regardless of your choice.",
      },
      {
        type: "subheading",
        text: "Managing Preferences",
      },
      {
        type: "paragraph",
        text: "Depending on the technologies in use, you may be able to:",
      },
      {
        type: "list",
        items: [
          "accept optional cookies;",
          "reject non-essential cookies; or",
          "manage individual cookie categories.",
        ],
      },
      {
        type: "paragraph",
        text: "You can update or withdraw your cookie preferences at any time by [using our cookie settings link / re-visiting our consent banner]. Withdrawing consent will stop the use of non-essential cookies going forward but does not affect any processing that occurred before withdrawal.",
      },
      {
        type: "subheading",
        text: "Browser Controls",
      },
      {
        type: "paragraph",
        text: "You may also manage or delete cookies through your browser settings. Most browsers allow you to block or delete cookies, or to be notified when a cookie is set. Disabling certain cookies may affect Website functionality or prevent features from working as intended.",
      },
      {
        type: "paragraph",
        text: "Useful browser-level guidance is available at:",
      },
      {
        type: "list",
        items: [
          "Google Chrome: chrome://settings/cookies",
          "Mozilla Firefox: about:preferences#privacy",
          "Safari: Preferences → Privacy",
          "Microsoft Edge: edge://settings/privacy",
        ],
      },
    ],
  },
  {
    id: "how-long-cookies-are-stored",
    number: "08",
    title: "How Long Cookies Are Stored",
    blocks: [
      {
        type: "paragraph",
        text: "Cookies may be:",
      },
      {
        type: "list",
        items: [
          "Session cookies — stored only for the duration of your browser session and deleted when you close your browser; or",
          "Persistent cookies — stored on your device for a set period after your session ends, ranging from a few days to up to 24 months depending on purpose and provider.",
        ],
      },
      {
        type: "paragraph",
        text: "Specific cookie names, durations, and providers may change as our Website and technology systems evolve. For the most current information, please refer to our cookie consent controls or contact us.",
      },
    ],
  },
  {
    id: "international-visitors",
    number: "09",
    title: "International Visitors",
    blocks: [
      {
        type: "paragraph",
        text: "Zypher is based in India, while our Website may be accessed internationally, including from the Gulf Cooperation Council (GCC) region, Europe, and the United States.",
      },
      {
        type: "paragraph",
        text: "Cookie requirements differ between jurisdictions. Where applicable law requires consent for non-essential cookies — including under the DPDP Framework for Indian residents or the General Data Protection Regulation (GDPR) for individuals in the European Economic Area — we will provide appropriate consent controls before activating those technologies.",
      },
    ],
  },
  {
    id: "changes-to-this-cookie-policy",
    number: "10",
    title: "Changes to This Cookie Policy",
    blocks: [
      {
        type: "paragraph",
        text: "We may update this Cookie Policy to reflect changes in our Website, technologies, providers, or applicable legal requirements.",
      },
      {
        type: "paragraph",
        text: 'When we update this Policy, we will revise the "Last Updated" date above. For material changes, we may also notify you by email or a prominent notice on our Website.',
      },
    ],
  },
  {
    id: "contact-us",
    number: "11",
    title: "Contact Us",
    blocks: [
      {
        type: "paragraph",
        text: "If you have questions about our use of cookies or wish to raise a concern, contact:",
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
        text: 'Please use the subject line "Cookie Enquiry – [Your Query]" to ensure prompt handling. We will respond within 7 days.',
      },
      {
        type: "paragraph",
        text: "For more information about how we handle personal information, please refer to our Privacy Policy.",
      },
    ],
  },
];
