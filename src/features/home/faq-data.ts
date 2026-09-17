export type FaqItem = {
  id: string;
  question: string;
  answer: string;
};

export const faqItems: readonly FaqItem[] = [
  {
    id: "development-cost",
    question: "How much does custom software development cost?",
    answer:
      "There's no fixed package price, because the answer depends entirely on scope: a mobile app, an AI-integrated automation, and a full custom platform aren't priced the same. What you get is a fixed quote before any work starts: we scope the project first, price it once, and that number doesn't move unless the scope does.",
  },
  {
    id: "large-scale-projects",
    question: "Can a small software agency actually handle large scale project?",
    answer:
      "Team size determines process, not capability. A smaller, senior team means direct access to the people actually building your software. There are no account managers relaying messages. That is often faster and more accountable than a large agency layered with middle management. We scope every project honestly against what we can deliver well.",
  },
  {
    id: "code-ownership",
    question: "Do I own the code and intellectual property after the project is delivered",
    answer:
      "Yes. Unless otherwise specified in the agreement, full code and IP ownership transfers to you. What we build is yours outright, not something you keep renting access to or depend on us to keep running.",
  },
  {
    id: "ai-and-software-development",
    question:
      "Does Zypher only build AI products, or does it handle regular software development too?",
    answer:
      "AI and automation are one of five core service lines, alongside software development, mobile app development, CRM/ERP systems, and UI/UX design. We use AI where it genuinely speeds up delivery or solves a real bottleneck, not as a default feature bolted onto every project.",
  },
  {
    id: "post-launch-support",
    question: "What happens after the project launches, are we on our own?",
    answer:
      "No. Support after handoff is part of the engagement, agreed upfront, not something you have to negotiate for once problems start showing up. You keep the same direct access to the team you had during the build.",
  },
  {
    id: "data-security",
    question: "How do you handle data security and privacy on client projects?",
    answer:
      "Your data stays yours, hosted on infrastructure agreed with you during scoping. It is never locked into a system only we control. Security practices scale with what's actually being built: a customer-facing app and an internal automation tool carry different risk profiles, and we scope accordingly during Discovery.",
  },
  {
    id: "time-zones",
    question:
      "How does working with a remote software agency across different time zones actually work?",
    answer:
      "We currently serve clients across the UAE, Qatar, USA, India, and the Netherlands, so overlapping time zones is a normal part of how we operate, not an edge case. Calls and check-ins are scheduled around your working hours, and support stays reachable outside a rigid 9-to-5 window.",
  },
  {
    id: "development-timeline",
    question: "How long does custom software development take?",
    answer:
      "Timeline depends on scope the same way cost does. A focused automation build might take a few weeks, a full custom platform can take a few months. You get a realistic timeline attached to your fixed quote during the Scope & Quote stage, before any work starts.",
  },
  {
    id: "freelancer-or-agency",
    question:
      "What’s the difference between hiring a freelancer and working with an agency like Zypher?",
    answer:
      "A freelancer is one person managing the whole project alone; an agency brings a full team of design, development, and structure, so you do not have to coordinate each piece yourself. At Zypher specifically, you still get the direct, no-middleman access a freelancer offers, just backed by a team rather than one person's bandwidth.",
  },
] as const;
