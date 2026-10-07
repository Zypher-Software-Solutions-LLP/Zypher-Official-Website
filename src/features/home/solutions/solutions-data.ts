export type SolutionCard = {
  id: string;
  number: string;
  heading: string;
  description: string;
  imageSrc: string;
};

export const solutionCards = [
  {
    id: "01",
    number: "/01",
    heading: "You own everything you pay for",
    description:
      "Full code and IP ownership (unless specified), no vendor lock-in. What we build is yours outright, not something you keep renting access to.",
    imageSrc: "https://media.zypher-solutions.com/home-page/section-4/Solution%20-%201.webp",
  },
  {
    id: "02",
    number: "/02",
    heading: "Direct line to the people building it",
    description:
      "No account managers relaying messages. You talk to the engineers and designers actually doing the work.",
    imageSrc: "https://media.zypher-solutions.com/home-page/section-4/Solution%20-%202.webp",
  },
  {
    id: "03",
    number: "/03",
    heading: "Whatever stack actually fits, not whatever we default to",
    description:
      "The tool gets chosen for the job, not because it is the one thing on the team's resume.",
    imageSrc: "https://media.zypher-solutions.com/home-page/section-4/Solution%20-%203.webp",
  },
  {
    id: "04",
    number: "/04",
    heading: "A.I Where it earns its place, not everywhere",
    description:
      "User to move faster and dig deeper on the parts that benefit from it. Not slapped on as a headline feature.",
    imageSrc: "https://media.zypher-solutions.com/home-page/section-4/Solution%20-%204.webp",
  },
] as const satisfies readonly SolutionCard[];
