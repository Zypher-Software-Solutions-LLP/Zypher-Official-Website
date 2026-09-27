export type ScaleTestimonial = {
  readonly company: string;
  readonly id:
    | "divin-siby"
    | "kenzy-attia"
    | "andrew-kong"
    | "muhammed-shuhaib"
    | "bharat-kaistha"
    | "umair-moideen"
    | "shaji-parakandi";
  readonly imageAlt: string;
  readonly imageSrc: string;
  readonly name: string;
  readonly quote: string;
  readonly role: string;
};

export const scaleTestimonials: readonly ScaleTestimonial[] = [
  {
    id: "divin-siby",
    name: "Divin Siby",
    role: "Manager",
    company: "ES Decorations",
    quote:
      "Zypher delivered a site we're proud to send clients to. Clean, fast, and exactly what we asked for, no chasing, no surprises.",
    imageAlt: "Portrait of Divin Siby",
    imageSrc: "https://media.zypher-solutions.com/scale-page/section-5/Divin%20Siby.jpeg",
  },
  {
    id: "kenzy-attia",
    name: "Kenzy Attia",
    role: "Acoustic Engineer",
    company: "Sonexia",
    quote:
      "They asked the right questions before touching anything. The result communicates what we do better than anything we had before.",
    imageAlt: "Portrait of Kenzy Attia",
    imageSrc: "https://media.zypher-solutions.com/scale-page/section-5/Kenzy%20Attia.jpg",
  },
  {
    id: "andrew-kong",
    name: "Andrew Kong",
    role: "HR Manager",
    company: "Lylux Lighting Trading Equipment LLC",
    quote:
      "Built around how our team actually works, not the other way around. The CRM has run cleanly since day one.",
    imageAlt: "Portrait of Andrew Kong",
    imageSrc: "https://media.zypher-solutions.com/scale-page/section-5/Andrew%20Kong.jpeg",
  },
  {
    id: "muhammed-shuhaib",
    name: "Muhammed Shuhaib",
    role: "Senior Lighting Engineer",
    company: "Lylux Trading Equipment LLC",
    quote:
      "The product site gives our catalogue the presence it deserves. Structured, fast, and reflects the quality of what we sell.",
    imageAlt: "Portrait of Muhammed Shuhaib",
    imageSrc: "https://media.zypher-solutions.com/scale-page/section-5/Muhammed%20Shuhaib.jpeg",
  },
  {
    id: "bharat-kaistha",
    name: "Bharat Kaistha",
    role: "CEO",
    company: "SecureThread OPS",
    quote:
      "Solid platform, real documentation, no hand-holding required. Zypher built the VMS to handle actual workloads and delivered on time.",
    imageAlt: "Portrait of Bharat Kaistha",
    imageSrc: "https://media.zypher-solutions.com/scale-page/section-5/Bharat%20Kaistha.png",
  },
  {
    id: "umair-moideen",
    name: "Umair Moideen",
    role: "Founder",
    company: "USR Lighting",
    quote:
      "They shaped everything around our niche, not a generic template. The branding and marketing work has been consistent and measurable.",
    imageAlt: "Portrait of Umair Moideen",
    imageSrc: "https://media.zypher-solutions.com/scale-page/section-5/Umair%20Moideen.jpeg",
  },
  {
    id: "shaji-parakandi",
    name: "Shaji Parakandi",
    role: "Founder",
    company: "TRENDZ SPORT",
    quote:
      "Early access to the rental system and it already handles everything we need. Thoughtful build, responsive team, clear communication throughout.",
    imageAlt: "Portrait of Shaji Parakandi",
    imageSrc: "https://media.zypher-solutions.com/scale-page/section-5/Shaji%20Parakandi.jpeg",
  },
];
