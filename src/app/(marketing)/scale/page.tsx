import type { Metadata } from "next";
import { StaticPage } from "@/features/pages/StaticPage";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Scale",
  description:
    "Understand who Zypher works with, what makes a strong fit, and how to start a conversation.",
  path: "/scale",
});

export default function ScalePage(): React.ReactNode {
  return (
    <StaticPage
      body={[
        "Scale will help founders and business leaders understand where Zypher is most useful: when a product, workflow, or operating system needs a thoughtful partner to move from uncertainty to momentum.",
        "The final page will use verified client profiles, fit signals, and engagement expectations from the approved design and content brief.",
      ]}
      description="Find out whether Zypher is the right partner for the stage your business is entering."
      eyebrow="Find your fit"
      title="The right partner changes with the stage."
    />
  );
}
