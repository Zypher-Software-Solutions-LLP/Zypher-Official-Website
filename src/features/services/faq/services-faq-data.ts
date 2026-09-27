import type { FaqItem } from "@/features/home/faq/faq-data";

export const servicesFaqItems: readonly FaqItem[] = [
  {
    id: "ai-existing-app",
    question: "Do you build AI features into an existing app, or only from scratch?",
    answer:
      "Both. Most AI & LLM Automation work is integrated into a product you already have; a small share is greenfield.",
  },
  {
    id: "ai-vs-software-development",
    question: "What's the difference between AI & LLM Automation and Software Development?",
    answer:
      "Software Development covers the application itself, the system your business runs on. AI & LLM Automation adds intelligence on top of it: chatbots, automation pipelines, and AI features layered into that system or an existing one.",
  },
  {
    id: "crm-integrations",
    question: "Can you build a CRM that integrates with tools we already use, like Salesforce?",
    answer:
      "Yes, third-party integration is part of the CRM/ERP service by default, not an add-on.",
  },
  {
    id: "mobile-maintenance",
    question: "Do you offer ongoing maintenance after a mobile app launches?",
    answer: "Yes, including OS-update maintenance and store deployment support.",
  },
  {
    id: "seo-aeo-geo",
    question: "Is SEO/AEO/GEO optimization included with a new website build, or is it separate?",
    answer:
      "It's a separate service, but it's commonly bundled with a new build. It is worth raising in the discovery call if it matters to you.",
  },
  {
    id: "cybersecurity-only",
    question: "Do you take on cybersecurity-only engagements, or only alongside a build?",
    answer: "Both. Security audits and penetration testing are offered standalone.",
  },
  {
    id: "which-service",
    question: "What if we're not sure which service we need?",
    answer:
      "That's what the discovery call is for. Tell us the problem, not the service you think you need. We will tell you which of the ten actually solves it.",
  },
] as const;
