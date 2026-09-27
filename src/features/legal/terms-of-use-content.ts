import type { LegalPolicySection } from "./legal-policy-types";

export const TERMS_OF_USE_LAST_UPDATED = "Last Updated Date";

export const termsOfUseIntroduction: readonly string[] = [
  'These Terms of Use ("Terms") govern your access to and use of zypher-solutions.com (the "Website"), operated by Zypher Software Solutions LLP ("Zypher", "we", "us", or "our").',
  "By using this Website, you agree to these Terms. If you do not agree, please discontinue use of the Website.",
  "These Terms apply to the Website and general interactions through it. Any separate proposal, statement of work, service agreement, NDA, maintenance agreement, or other contract entered into with Zypher will govern that specific engagement.",
  "Our handling of personal information is governed by applicable laws including the Digital Personal Data Protection Act, 2023 and the Digital Personal Data Protection Rules, 2025, as further described in our Privacy Policy.",
];

export const termsOfUseSections: readonly LegalPolicySection[] = [
  {
    id: "about-zypher",
    number: "01",
    title: "About Zypher",
    blocks: [
      {
        type: "paragraph",
        text: "Zypher Software Solutions LLP is a technology services company based in Kerala, India, registered as a Limited Liability Partnership.",
      },
      {
        type: "paragraph",
        text: "We provide services including software development, web and mobile application development, AI and automation solutions, UI/UX design, CRM and ERP solutions, cloud services, integrations, consulting, maintenance, and related technology services.",
      },
    ],
  },
  {
    id: "use-of-the-website",
    number: "02",
    title: "Use of the Website",
    blocks: [
      {
        type: "paragraph",
        text: "You may use the Website for lawful purposes, including to:",
      },
      {
        type: "list",
        items: [
          "learn about Zypher and our services;",
          "review our work and published content;",
          "contact us regarding potential projects;",
          "schedule consultations;",
          "apply for opportunities with us; and",
          "access other functionality made available through the Website.",
        ],
      },
      {
        type: "paragraph",
        text: "You must not use the Website in a way that is unlawful, harmful, fraudulent, abusive, or disruptive.",
      },
    ],
  },
  {
    id: "website-information",
    number: "03",
    title: "Website Information",
    blocks: [
      {
        type: "paragraph",
        text: "We aim to keep Website information accurate and up to date, but we do not guarantee that all content will always be complete, current, or error-free.",
      },
      {
        type: "paragraph",
        text: "Descriptions of services, capabilities, technologies, timelines, pricing, case studies, or project approaches are provided for general informational purposes and do not create a binding commitment unless expressly included in a written agreement with Zypher.",
      },
      {
        type: "paragraph",
        text: "If Website content conflicts with a signed agreement, the signed agreement will govern.",
      },
    ],
  },
  {
    id: "enquiries-and-proposals",
    number: "04",
    title: "Enquiries and Proposals",
    blocks: [
      {
        type: "paragraph",
        text: "Submitting an enquiry, scheduling a consultation, or requesting a quotation does not by itself create a contractual relationship with Zypher.",
      },
      {
        type: "paragraph",
        text: "Preliminary discussions, estimates, timelines, recommendations, and indicative pricing remain subject to review and confirmation.",
      },
      {
        type: "paragraph",
        text: "A project or service engagement begins only after the applicable commercial and contractual terms have been agreed in writing.",
      },
    ],
  },
  {
    id: "intellectual-property",
    number: "05",
    title: "Intellectual Property",
    blocks: [
      {
        type: "paragraph",
        text: "Unless otherwise stated, the Website and its contents are owned by or licensed to Zypher.",
      },
      {
        type: "paragraph",
        text: "This includes our:",
      },
      {
        type: "list",
        items: [
          "branding and logos;",
          "Website design;",
          "text and written content;",
          "graphics and illustrations;",
          "photographs and media;",
          "layouts and interface designs;",
          "articles and case studies; and",
          "other original Website materials.",
        ],
      },
      {
        type: "paragraph",
        text: "You may view and use Website content for legitimate personal or business evaluation purposes.",
      },
      {
        type: "paragraph",
        text: "You may not reproduce, republish, commercially distribute, modify, scrape, or misuse our protected content without permission, except where permitted by applicable law.",
      },
      {
        type: "paragraph",
        text: "Nothing in these Terms transfers ownership of Zypher intellectual property to you.",
      },
    ],
  },
  {
    id: "client-and-portfolio-work",
    number: "06",
    title: "Client and Portfolio Work",
    blocks: [
      {
        type: "paragraph",
        text: "The Website may include examples of projects, designs, screenshots, systems, or case studies relating to client work.",
      },
      {
        type: "paragraph",
        text: "Rights in such materials remain subject to the relevant agreement between Zypher and the client. Client names, trademarks, logos, and other third-party intellectual property remain the property of their respective owners.",
      },
      {
        type: "paragraph",
        text: "Displaying work on our Website does not grant visitors permission to copy, reproduce, modify, or commercially use it.",
      },
    ],
  },
  {
    id: "acceptable-use",
    number: "07",
    title: "Acceptable Use",
    blocks: [
      {
        type: "paragraph",
        text: "You must not:",
      },
      {
        type: "list",
        items: [
          "attempt unauthorised access to our Website or systems;",
          "interfere with Website security or availability;",
          "introduce malware or harmful code;",
          "bypass security or bot-protection measures;",
          "conduct excessive automated scraping or crawling;",
          "submit spam, fraudulent enquiries, or misleading information;",
          "impersonate another person or organisation;",
          "exploit or attempt to exploit security vulnerabilities; or",
          "use the Website in violation of applicable law.",
        ],
      },
      {
        type: "paragraph",
        text: "We may restrict or block access where necessary to protect our Website, systems, users, or business.",
      },
    ],
  },
  {
    id: "information-you-submit",
    number: "08",
    title: "Information You Submit",
    blocks: [
      {
        type: "paragraph",
        text: "You are responsible for ensuring that information you submit through the Website is accurate and that you are authorised to provide it.",
      },
      {
        type: "paragraph",
        text: "Please do not submit unnecessary sensitive information, passwords, payment credentials, confidential third-party information, malicious files, or unlawful material.",
      },
      {
        type: "paragraph",
        text: "Information submitted through the Website is handled in accordance with our Privacy Policy.",
      },
      {
        type: "paragraph",
        text: "Submitting information to us does not automatically create a confidential relationship. Where confidential business information must be exchanged — for example, technical specifications, commercial terms, or proprietary processes — an appropriate Non-Disclosure Agreement should be used prior to disclosure. We recommend requesting one before sharing sensitive business or project information.",
      },
    ],
  },
  {
    id: "third-party-services",
    number: "09",
    title: "Third-Party Services",
    blocks: [
      {
        type: "paragraph",
        text: "Our Website may include links to or integrations with third-party services such as Cal.com, WhatsApp, LinkedIn, Google services, or other platforms.",
      },
      {
        type: "paragraph",
        text: "These services are operated independently from Zypher and are subject to their own terms and privacy practices. We are not responsible for the availability, security, content, or practices of third-party services.",
      },
    ],
  },
  {
    id: "website-availability",
    number: "10",
    title: "Website Availability",
    blocks: [
      {
        type: "paragraph",
        text: "We take reasonable steps to maintain the security and availability of the Website but do not guarantee uninterrupted or error-free operation.",
      },
      {
        type: "paragraph",
        text: "We may update, modify, suspend, or discontinue Website content or functionality at any time. We do not guarantee that the Website will be free from every technical issue, security vulnerability, or compatibility problem.",
      },
    ],
  },
  {
    id: "disclaimer",
    number: "11",
    title: "Disclaimer",
    blocks: [
      {
        type: "paragraph",
        text: 'The Website and its content are provided on an "as is" and "as available" basis.',
      },
      {
        type: "paragraph",
        text: "To the extent permitted by applicable law, Zypher does not make warranties regarding the accuracy, completeness, availability, reliability, or suitability of Website content.",
      },
      {
        type: "paragraph",
        text: "Information published on the Website is general in nature and should not be treated as legal, financial, regulatory, or other professional advice.",
      },
    ],
  },
  {
    id: "limitation-of-liability",
    number: "12",
    title: "Limitation of Liability",
    blocks: [
      {
        type: "paragraph",
        text: "To the maximum extent permitted by applicable law, Zypher will not be liable for indirect, incidental, consequential, or similar losses arising solely from your use of, reliance on, or inability to access this Website.",
      },
      {
        type: "paragraph",
        text: "Nothing in these Terms limits liability where such limitation is prohibited by law.",
      },
      {
        type: "paragraph",
        text: "Liability relating to professional services provided under a separate agreement will be governed by that agreement.",
      },
    ],
  },
  {
    id: "privacy-and-cookies",
    number: "13",
    title: "Privacy and Cookies",
    blocks: [
      {
        type: "paragraph",
        text: "Our handling of personal information is described in our Privacy Policy.",
      },
      {
        type: "paragraph",
        text: "Our use of cookies and similar technologies is described in our Cookie Policy.",
      },
      {
        type: "paragraph",
        text: "Where consent is required for particular processing or technologies, it will be requested separately where appropriate.",
      },
    ],
  },
  {
    id: "international-access",
    number: "14",
    title: "International Access",
    blocks: [
      {
        type: "paragraph",
        text: "Zypher is established in India, but our Website may be accessed internationally, including from the Gulf Cooperation Council (GCC) region, Europe, and the United States.",
      },
      {
        type: "paragraph",
        text: "If you access the Website from another country, you are responsible for complying with laws applicable to your use of the Website. Specific client engagements may be subject to additional legal or contractual requirements depending on the relevant jurisdiction and project.",
      },
    ],
  },
  {
    id: "changes-to-these-terms",
    number: "15",
    title: "Changes to These Terms",
    blocks: [
      {
        type: "paragraph",
        text: "We may update these Terms from time to time to reflect changes in our Website, services, business practices, or applicable law.",
      },
      {
        type: "paragraph",
        text: 'When updated, the "Last Updated" date at the top of this page will be revised. For material changes, we may also provide notice by email or a prominent notice on our Website.',
      },
    ],
  },
  {
    id: "severability",
    number: "16",
    title: "Severability",
    blocks: [
      {
        type: "paragraph",
        text: "If any provision of these Terms is found to be invalid, unlawful, or unenforceable under applicable law, that provision will be modified to the minimum extent necessary to make it enforceable, or severed from these Terms if modification is not possible. The remaining provisions will continue in full force and effect.",
      },
    ],
  },
  {
    id: "no-waiver",
    number: "17",
    title: "No Waiver",
    blocks: [
      {
        type: "paragraph",
        text: "A failure or delay by Zypher in exercising any right or remedy under these Terms does not constitute a waiver of that right or remedy. A waiver of any breach does not constitute a waiver of any subsequent or other breach.",
      },
    ],
  },
  {
    id: "governing-law-and-dispute-resolution",
    number: "18",
    title: "Governing Law and Dispute Resolution",
    blocks: [
      {
        type: "paragraph",
        text: "These Terms are governed by the laws of India.",
      },
      {
        type: "paragraph",
        text: "In the event of any dispute arising from or in connection with your use of this Website, the parties will first attempt to resolve the matter through good-faith discussion.",
      },
      {
        type: "paragraph",
        text: "If a dispute cannot be resolved informally, it may be referred to arbitration under the Arbitration and Conciliation Act, 1996 (as amended), with the seat of arbitration in Kozhikode, Kerala, India, and proceedings conducted in English.",
      },
      {
        type: "paragraph",
        text: "Subject to the above, and to any mandatory rights that cannot lawfully be excluded, disputes arising specifically from use of this Website will be subject to the jurisdiction of competent courts in Kozhikode, Kerala, India.",
      },
      {
        type: "paragraph",
        text: "Any separate agreement with a client may contain different governing-law or dispute-resolution provisions, which will govern that engagement.",
      },
    ],
  },
  {
    id: "contact-us",
    number: "19",
    title: "Contact Us",
    blocks: [
      {
        type: "paragraph",
        text: "If you have questions about these Terms, contact:",
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
    ],
  },
];
