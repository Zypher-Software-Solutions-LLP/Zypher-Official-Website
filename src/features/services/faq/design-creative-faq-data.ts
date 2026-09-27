import type { FaqItem } from "@/features/home/faq/faq-data";

export const designCreativeFaqItems: readonly FaqItem[] = [
  {
    id: "ai-and-design",
    question: "Can't AI just generate the designs we need? Why do we need a designer?",
    answer:
      "AI can generate screens quickly. What it can't do is tell you whether the screen solves the right problem, whether the user will understand it, or whether it matches how your specific audience actually behaves. We use AI tools where they speed up the work, including variations, asset generation, and layout iteration. The research, the decisions, and the judgment behind every screen are still ours. That's the difference between something that looks designed and something that works.",
  },
  {
    id: "design-with-build",
    question: "Do we need UI/UX design if we're also getting a build from Zypher?",
    answer:
      "Yes, and it's included as part of the engagement when a build is scoped. Design and development running from separate sources is one of the most common reasons products ship late, go over budget, or need rebuilding. When design and build happen under the same roof, the handoff is clean, the specs are buildable, and the product ships as designed.",
  },
  {
    id: "ui-vs-ux",
    question: "What's the difference between UI design and UX design, and do we need both?",
    answer:
      "UX is the structure, how the product flows, what decisions the user has to make, and where they get stuck. UI is the surface, how it looks, how it feels, and what it communicates visually. You need both. A product with good UX and weak UI loses credibility before the user tries it. Good UI on broken UX is a beautiful thing nobody can use. We do both, in the right order.",
  },
  {
    id: "creative-scope",
    question:
      "Do you only do digital product design, or do you cover branding, video, and creative production as well?",
    answer:
      "All of it. Brand identity, including logo, color system, typography, and guidelines, is a standalone service and part of larger engagements. Video editing, motion graphics, 3D rendering, and animation are full capabilities, not side services. If it's visual and needs to be good, it's in scope. We start with a conversation to figure out what the engagement actually needs.",
  },
  {
    id: "deliverables",
    question: "What do we actually get at the end of a design engagement?",
    answer:
      "Developer-ready Figma files with annotated components, a documented design system, interactive prototypes, brand guidelines if applicable, motion specs, and exported assets in whatever formats your team needs. Everything organised so whoever builds from it, whether that's our team or yours, doesn't need to come back and ask questions.",
  },
  {
    id: "timeline",
    question: "How long does a design or creative project take?",
    answer:
      "A focused UI/UX scope, one user flow, clearly defined, can be delivered in two to four weeks. A full design system takes six to ten weeks. Brand identity depends on scope. Video and motion production timelines are set during discovery based on volume and complexity. Every engagement gets a realistic timeline locked to a fixed quote, not a range.",
  },
  {
    id: "full-process",
    question: "Do you handle the full creative process or just the final execution?",
    answer:
      "The full process. For product design that means research, wireframing, prototyping, and testing, not just making screens look good. For brand and creative work that means strategy, concept development, and production, not just executing a brief someone else wrote. We start where the work actually starts, not where it's easiest to jump in.",
  },
  {
    id: "existing-designs",
    question:
      "We already have designs from another agency. Can you continue from where they left off?",
    answer:
      "Yes, but we always start by auditing what exists before continuing it. If the existing design has structural problems, continuing it compounds them. We'll tell you honestly what's worth keeping, what needs fixing, and what the fastest path forward looks like. No obligation to hear that assessment.",
  },
] as const;
