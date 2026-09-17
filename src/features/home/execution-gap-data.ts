export type ExecutionGapItem = {
  id: string;
  heading: string;
  problem: string;
  solution: string;
  imageSrc: string;
  mobileImageSrc: string;
  imageAlt: string;
};

const sectionThreeAssetBase = "https://media.zypher-solutions.com/home-page/section-3";

export const executionGapItems = [
  {
    id: "average-software",
    heading: "Built for average, not for you.",
    problem:
      "Most software is built for the average customer, then sold to everyone as if that average is you. You end up restructuring how your team works around a tool that was never designed with your business in mind, adapting to it, instead of it adapting to you.",
    solution:
      "We start with how your team actually works, and build the system around that, not the other way around.",
    imageSrc: sectionThreeAssetBase + "/Problem%20-%201.png",
    mobileImageSrc: sectionThreeAssetBase + "/Problem%20-%201%20Mobile.png",
    imageAlt: "Abstract illustration representing software built around a generic average",
  },
  {
    id: "shifting-scope",
    heading: "Scope that shifts, pricing that surprises",
    problem:
      "A project starts with a rough quote, then grows, one more feature, one more integration, until the final invoice bears no resemblance to what you agreed to. You're left managing the vendor relationship instead of your business.",
    solution:
      "Scope and price are fixed before work starts. If something changes, you're told before it costs you anything, not after.",
    imageSrc: sectionThreeAssetBase + "/Problem%20-%202.png",
    mobileImageSrc: sectionThreeAssetBase + "/Problem%20-%202%20Mobile.png",
    imageAlt: "Abstract illustration representing shifting project scope and pricing",
  },
  {
    id: "missed-bottleneck",
    heading: "Automation that skips the real bottleneck",
    problem:
      "Most \"automation\" targets whatever's easiest to automate, not whatever's actually slowing you down. You get a chatbot for FAQs while the real bottleneck, the manual process eating hours every week, stays untouched.",
    solution:
      "We find the actual bottleneck first, then automate that, even when it's the harder thing to build.",
    imageSrc: sectionThreeAssetBase + "/Problem%20-%203.png",
    mobileImageSrc: sectionThreeAssetBase + "/Problem%20-%203%20Mobile.png",
    imageAlt: "Abstract illustration representing automation missing the real bottleneck",
  },
  {
    id: "post-launch-support",
    heading: "Support that disappears after launch",
    problem:
      "The moment a project ships, most vendors go quiet. Bugs surface, questions pile up, and the person who built it is already on the next client.",
    solution:
      "We stay in the room after launch, support is part of the engagement, not something you have to negotiate for separately.",
    imageSrc: sectionThreeAssetBase + "/Problem%20-%204.png",
    mobileImageSrc: sectionThreeAssetBase + "/Problem%20-%204%20Mobile.png",
    imageAlt: "Abstract illustration representing support after a software launch",
  },
] as const satisfies readonly ExecutionGapItem[];
