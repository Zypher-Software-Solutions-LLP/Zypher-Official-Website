import type { FaqItem } from "@/features/home/faq/faq-data";

export const softwareDevelopmentFaqItems: readonly FaqItem[] = [
  {
    id: "project-team",
    question:
      "Who actually works on my project, the people I speak to during the sales process, or a different team after we sign?",
    answer:
      "The same people. The engineers and designers you speak to during discovery are the ones building your product. There are no account managers relaying messages, no subcontractors brought in after the contract is signed. You have direct access to the people doing the work throughout the engagement.",
  },
  {
    id: "ownership",
    question: "Do I own the code, the infrastructure, and everything else after the build?",
    answer:
      "Yes, full ownership transfers at handoff. Codebase, configs, credentials, deployment pipelines, documentation. No proprietary framework that locks you in, no ongoing dependency on our infrastructure. You can take it to another team, extend it internally, or leave it exactly as it is. It's yours.",
  },
  {
    id: "tech-stack",
    question: "How do you decide which tech stack to use for my project?",
    answer:
      "Based on the problem, your scale, and your long-term maintenance reality, not on what's most popular or what we're most comfortable building with. During Architecture & Scoping, we explain the stack decision and why it fits your specific context. You'll understand what was chosen and why before anything is built.",
  },
  {
    id: "scope-changes",
    question: "What happens if the scope needs to change during the build?",
    answer:
      "Scope changes are documented and quoted before they're built, never absorbed silently and billed at the end. If something changes, you're told what it means for timeline and cost before it affects either. Nothing moves without your sign-off on the change.",
  },
  {
    id: "timeline",
    question: "How long does a custom software project take?",
    answer:
      "A focused internal tool or single-surface application, clearly scoped, can ship in weeks. A multi-integration platform or system replacement takes longer, typically several months. You get a realistic timeline locked to your fixed quote during Architecture & Scoping. We don't give directional timelines before scope is done because they're not accurate and they're not useful.",
  },
  {
    id: "pricing",
    question: "How is a custom software project priced?",
    answer:
      "Pricing is based on scope, what's being built, what it needs to connect to, and the complexity of the architecture required. No hourly rates, no retainers, no open-ended engagements. You get one fixed quote after discovery. That number doesn't move unless you change the scope, and if the scope changes, you approve the new number first.",
  },
  {
    id: "nontechnical-team",
    question: "We don't have an internal technical team. Can we still manage this after handoff?",
    answer:
      "Yes, that's why documentation is a deliverable, not an afterthought. Handoff documentation is written for the people who will actually maintain the system. For teams with no internal technical resource, ongoing support is a defined scope option, discussed and priced before the build starts, not introduced after launch.",
  },
  {
    id: "existing-systems",
    question: "Can you work with our existing systems, or does everything need to be rebuilt?",
    answer:
      "That's one of the first things we establish in discovery. Most engagements involve connecting new software to something that already exists, a database, a third-party tool, a legacy system. We map your current stack before scoping anything. Where rebuilding makes sense, we migrate incrementally, the business keeps running while the new system takes over.",
  },
] as const;
