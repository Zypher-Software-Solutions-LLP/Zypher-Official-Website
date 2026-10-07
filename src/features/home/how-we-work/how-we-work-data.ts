export type HowWeWorkPanel = {
  id: string;
  label: string;
  heading: string;
  description: string;
  iconSrc: string;
  imageSrc: string;
  imageAlt: string;
};

export type HowWeWorkStep = {
  id: "discover" | "scope-quote" | "build" | "launch-stay-on";
  number: string;
  label: string;
  panels: readonly HowWeWorkPanel[];
  children?: readonly HowWeWorkPanel[];
};

const MEDIA_BASE_URL = "https://media.zypher-solutions.com/home-page/section-5";

export const howWeWorkSteps: readonly HowWeWorkStep[] = [
  {
    id: "discover",
    number: "1",
    label: "Discover",
    panels: [
      {
        id: "discover",
        label: "Discover",
        heading: "A Conversation, not a pitch",
        description:
          "We start with a short call to understand what’s actually broken, not to sell you a package. No slides, no canned demo, just questions until we understand the real problem worth solving.",
        iconSrc: MEDIA_BASE_URL + "/Icon%20-%201.png",
        imageSrc: MEDIA_BASE_URL + "/Work%20-%201.webp",
        imageAlt: "A founder speaking with a software team during a discovery call",
      },
    ],
  },
  {
    id: "scope-quote",
    number: "2",
    label: "Scope & Quote",
    panels: [
      {
        id: "scope-quote",
        label: "Scope & Quote",
        heading: "Fixed scope & price before you commit to anything.",
        description:
          'You get a written scope and one fixed quote, not a range, not a "starting from." If something changes later, you’re told before it affects cost, not after.',
        iconSrc: MEDIA_BASE_URL + "/Icon%20-%202.png",
        imageSrc: MEDIA_BASE_URL + "/Work%20-%202.webp",
        imageAlt: "A founder reviewing a fixed project quote at a desk",
      },
    ],
  },
  {
    id: "build",
    number: "3",
    label: "Build",
    panels: [],
    children: [
      {
        id: "built-from-scratch",
        label: "Built from scratch",
        heading: "Built from scratch",
        description:
          "For work that doesn’t fit an existing platform, bespoke software and apps coded around your exact process, not bent to fit someone else’s structure.",
        iconSrc: MEDIA_BASE_URL + "/Icon%20-%203.1.png",
        imageSrc: MEDIA_BASE_URL + "/Work%20-%203.1.webp",
        imageAlt: "A developer building bespoke software from scratch",
      },
      {
        id: "customized-existing-platforms",
        label: "Customized on existing platforms",
        heading: "Customized on existing platforms",
        description:
          "For CRM and ERP work, we configure and extend proven platforms around your workflow instead of rebuilding what already works.",
        iconSrc: MEDIA_BASE_URL + "/Icon%20-%203.2.png",
        imageSrc: MEDIA_BASE_URL + "/Work%20-%203.2.webp",
        imageAlt: "A team customizing an existing software platform around a workflow",
      },
      {
        id: "automated-ai-integrated",
        label: "Automated & AI-Integrated",
        heading: "Automated & AI-Integrated",
        description:
          "Where automation and AI genuinely save time, we build it in, targeted at the actual bottleneck, not added for the sake of a feature list.",
        iconSrc: MEDIA_BASE_URL + "/Icon%20-%203.3.png",
        imageSrc: MEDIA_BASE_URL + "/Work%20-%203.3.webp",
        imageAlt: "A team building targeted automation and AI into a software system",
      },
    ],
  },
  {
    id: "launch-stay-on",
    number: "4",
    label: "Launch & Stay On",
    panels: [
      {
        id: "launch-stay-on",
        label: "Launch & Stay On",
        heading: "Launch & Stay on",
        description:
          "Support after handoff is part of the engagement, not an upsell, we stay reachable for the issues that only show up once real users start using it.",
        iconSrc: MEDIA_BASE_URL + "/Icon%20-%204.png",
        imageSrc: MEDIA_BASE_URL + "/Work%20-%204.webp",
        imageAlt: "A software team supporting a product after it launches",
      },
    ],
  },
];
