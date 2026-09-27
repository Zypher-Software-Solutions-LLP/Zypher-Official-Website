import type { FaqItem } from "@/features/home/faq/faq-data";

export const crmErpSolutionsFaqItems: readonly FaqItem[] = [
  {
    id: "configure-or-custom",
    question: "Should we configure an existing platform or build a custom CRM?",
    answer:
      "It depends on your workflow complexity and long-term cost. Major platforms like Salesforce, HubSpot, or Odoo cover most standard processes well, so configuration is faster and cheaper upfront. Custom makes sense when your process is complex enough that the platform fights you at every turn, or when licensing costs over three to five years exceed the build cost. We tell you honestly which makes sense for your situation during discovery, before anything is scoped.",
  },
  {
    id: "spreadsheets",
    question: "We're currently running everything on spreadsheets. Where do we start?",
    answer:
      "Discovery. We map what's actually happening in your spreadsheets, what data you have, how it's structured, what's missing, and what the system needs to do. Most spreadsheet-to-CRM migrations are more manageable than they look once the data is properly audited. We start there, not with a platform recommendation.",
  },
  {
    id: "timeline",
    question: "How long does a CRM or ERP implementation take?",
    answer:
      "A focused CRM setup, one team, standard pipeline, clean data, can go live in four to eight weeks. A multi-department ERP implementation with data migration and integrations takes longer, typically three to six months. You get a realistic timeline attached to your fixed quote during System Mapping and Configuration, not before.",
  },
  {
    id: "existing-data",
    question: "What happens to our existing data?",
    answer:
      "It gets audited, cleaned, and migrated, including contacts, deal history, documents, and records. We verify everything before it goes live. Nothing is deleted without your sign-off, and nothing goes into the new system until it has been validated. Data migration is the highest-risk part of any CRM project, and we treat it that way.",
  },
  {
    id: "integrations",
    question: "Will this connect to the other tools we already use?",
    answer:
      "That's mapped during discovery. We document every tool your team uses that needs to talk to the CRM or ERP, then design the integration layer before any configuration starts. Native connectors where they exist, custom API integration where they don't.",
  },
  {
    id: "pricing",
    question: "How is a CRM or ERP project priced?",
    answer:
      "Based on scope, platform choice, customisation depth, number of integrations, data volume, and training requirements. No hourly rates, no open retainers. One fixed quote after discovery. That number doesn't move unless the scope changes, and if it does, you approve the change before anything moves.",
  },
  {
    id: "adoption",
    question: "What if our team doesn't adopt the system after go-live?",
    answer:
      "Adoption starts before go-live, not after. Your team is trained on the system as part of the engagement, not handed a manual after the fact. We also document the system in plain language so managers can onboard new team members without coming back to us. Post-launch support is scoped if ongoing help is needed.",
  },
  {
    id: "ownership",
    question: "Do we own the system and data after the engagement?",
    answer:
      "Yes, full admin access, all credentials, and all configurations. For custom builds, you get full codebase ownership with no licensing dependency on us. For platform implementations, you keep your accounts, your data, and your admin rights. We don't hold anything back.",
  },
] as const;
