import type { FaqItem } from "@/features/home/faq/faq-data";

export const aiLlmAutomationFaqItems: readonly FaqItem[] = [
  {
    id: "ownership",
    question: "Do I own everything after the build: code, prompts, configs, and data?",
    answer:
      "Yes, full ownership transfers at handoff. Code, prompts, configs, credentials, and documentation are yours. There is no ongoing subscription to us, no infrastructure dependency, and no lock-in. You can run it, modify it, or hand it to another team entirely.",
  },
  {
    id: "existing-systems",
    question: "Will this work with the tools and systems we already have?",
    answer:
      "That's the first thing we establish in discovery. We don't build in isolation. We map your existing tools, data sources, and workflows before scoping anything. If there's an API, we can usually connect to it. If there isn't, we build the integration layer that makes it possible.",
  },
  {
    id: "production-failures",
    question: "What happens when the AI makes a mistake or hits an edge case in production?",
    answer:
      "Every system we build includes defined fail-safes, logic that determines what happens when the AI encounters something unexpected. That means graceful fallbacks, human escalation triggers where needed, and documented exception handling. We scope for edge cases before launch, not after. That's what separates a production system from a demo.",
  },
  {
    id: "nontechnical-maintenance",
    question: "We don't have a technical team. Can we still maintain this after you hand it off?",
    answer:
      "Yes. Documentation is written for the people actually maintaining the system, not just engineers who already understand how it was built. That means plain-language runbooks, annotated configs, and a system map your team can follow without needing to call us every time something needs adjusting. For teams with no internal technical resource, ongoing support is a scope option discussed and priced before the build starts, not introduced after launch.",
  },
  {
    id: "unclear-scope",
    question: "We're not sure exactly what we need. Can we still reach out?",
    answer:
      "That's actually the most common starting point. You don't need a spec, a brief, or a clear idea of the solution. You need to know what isn't working. The discovery call exists to figure out the rest, and there's no obligation on the first conversation.",
  },
  {
    id: "project-pricing",
    question: "How is an AI automation project priced? What affects the cost?",
    answer:
      "Pricing is based on scope: what's being built, what it needs to connect to, and how much discovery is required before anything is mapped. There's no package pricing because two automation projects that sound similar can be very different in complexity. You always get a fixed quote after discovery: one number, not a range or a retainer. Nothing starts until that's agreed.",
  },
  {
    id: "project-timeline",
    question: "How long does an AI automation build actually take?",
    answer:
      "A focused automation with one workflow, one integration, and clear scope can be delivered in a few weeks. A multi-system AI layer connecting several tools and data sources takes longer, typically a few months. You get a realistic timeline with your fixed quote during Architecture & Scoping, before any build starts. We don't give directional timelines before scope is done because they're rarely accurate or useful.",
  },
  {
    id: "ai-data-access",
    question: "Where is our data processed during the build, and who has access to it?",
    answer:
      "Your data stays on infrastructure agreed with you during discovery, never on systems only we control. Access during the build is limited to the people directly working on your project. For engagements involving sensitive customer data or regulated information, security and access controls are scoped explicitly before work starts, not treated as a default assumption.",
  },
] as const;
