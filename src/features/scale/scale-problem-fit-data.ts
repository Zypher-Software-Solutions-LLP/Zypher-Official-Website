export type ScaleProblemFitItem = {
  readonly description: string;
  readonly id:
    "problem-clarity" | "openness-to-process" | "long-term-thinking" | "direct-communication";
  readonly imageAlt: string;
  readonly imageSrc: string;
  readonly title: string;
};

export const scaleProblemFitItems: readonly ScaleProblemFitItem[] = [
  {
    id: "problem-clarity",
    title: "Problem Clarity",
    description:
      "You've identified something costing you time, money, customers, or growth. You may not have a solution in mind yet. That's exactly where we start.",
    imageAlt: "A workspace representing problem clarity",
    imageSrc: "https://media.zypher-solutions.com/scale-page/section-4/Problem%20Clarity.png",
  },
  {
    id: "openness-to-process",
    title: "Openness to Process",
    description:
      "We scope before we build and quote before we start. Clients who work best with us trust the discovery phase and don't skip it to get straight to delivery.",
    imageAlt: "A workspace representing openness to process",
    imageSrc: "https://media.zypher-solutions.com/scale-page/section-4/Openness%20to%20Process.png",
  },
  {
    id: "long-term-thinking",
    title: "Long-Term Thinking",
    description:
      "We build things meant to last and scale. If you need something thrown together quickly and left behind after a demo, we're probably not the right fit for that specific job.",
    imageAlt: "A workspace representing long-term thinking",
    imageSrc: "https://media.zypher-solutions.com/scale-page/section-4/Long%20Term%20Thinking.png",
  },
  {
    id: "direct-communication",
    title: "Direct Communication",
    description:
      "Our clients talk directly to the people building their product. We don't route everything through account managers. That works best when clients are equally direct with us.",
    imageAlt: "A workspace representing direct communication",
    imageSrc: "https://media.zypher-solutions.com/scale-page/section-4/Direct%20Communication.png",
  },
];
