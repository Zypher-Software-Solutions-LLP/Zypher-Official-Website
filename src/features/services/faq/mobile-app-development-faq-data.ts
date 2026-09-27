import type { FaqItem } from "@/features/home/faq/faq-data";

export const mobileAppDevelopmentFaqItems: readonly FaqItem[] = [
  {
    id: "flutter-or-native",
    question: "Should we build with Flutter or go native iOS and Android?",
    answer:
      "That depends on what the app needs to do. Flutter is our default recommendation for most business apps, near-native performance, one codebase, both platforms, significantly lower build and maintenance cost. Native Swift or Kotlin is the right call when you need deep hardware access, platform-specific integrations, or performance that cross-platform genuinely can't match. We make that recommendation during Architecture & Scoping, explain the rationale, and you make the final call.",
  },
  {
    id: "shared-data",
    question: "We have a website already. Can the app connect to it and share the same data?",
    answer:
      "Yes, and that's usually the right architecture. A shared backend means one data source, one authentication layer, and one admin panel managing both your web and mobile product. We map the existing web infrastructure during discovery and design the integration before anything is built.",
  },
  {
    id: "ownership",
    question: "Do I own the app, the codebase, and the store accounts after launch?",
    answer:
      "Yes, everything transfers at handoff. Codebase, credentials, App Store and Google Play accounts, backend access, and all documentation. No ongoing dependency on our infrastructure, no lock-in. The app is yours to run, update, or hand to another team.",
  },
  {
    id: "timeline",
    question: "How long does it take to build a mobile app?",
    answer:
      "A focused MVP, core features, one user flow, clearly scoped, typically takes three to five months. A multi-integration app with a custom backend and both platforms runs longer, usually five to nine months. You get a realistic timeline locked to your fixed quote during Architecture & Scoping. We don't give directional timelines before scope is done because they're not accurate and set the wrong expectations.",
  },
  {
    id: "pricing",
    question: "How is a mobile app project priced?",
    answer:
      "Based on scope, features, platform choice, backend complexity, and third-party integrations. No hourly rates, no open-ended retainers. One fixed quote after discovery. That number doesn't move unless the scope changes, and if it changes, you approve the new number before anything moves.",
  },
  {
    id: "post-launch",
    question: "What happens after the app launches? Do you just hand it over and disappear?",
    answer:
      "No, and post-launch is where most agencies drop the ball. OS updates break things. User behaviour reveals gaps. New features get requested. We offer defined post-launch support scopes, discussed and priced before the build starts, so your app stays functional and current without you scrambling every time Apple or Google pushes an update.",
  },
  {
    id: "nontechnical-team",
    question: "We don't have a technical team. Can we manage the app after handoff?",
    answer:
      "Yes, documentation is written for the people actually maintaining the app, not for engineers who already understand how it was built. For teams with no internal technical resource, the post-launch support scope covers ongoing maintenance so you're not left managing something you didn't build.",
  },
  {
    id: "idea-stage",
    question:
      "We just have an idea, no spec, no wireframes, nothing on paper. Can we still reach out?",
    answer:
      "That's the most common starting point for a mobile project. You don't need a spec or wireframes before the discovery call. You need to know what problem the app is solving and who it's solving it for. We figure out the rest together, and there's no obligation on the first conversation.",
  },
] as const;
