import type { Metadata } from "next";
import { StaticPage } from "@/features/pages/StaticPage";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "About",
  description:
    "Learn how Zypher approaches software, design, automation, and long-term partnerships.",
  path: "/about",
});

export default function AboutPage(): React.ReactNode {
  return (
    <StaticPage
      body={[
        "Zypher brings software development, product design, automation, and operational thinking together around the outcomes a business needs.",
        "The final story, team details, principles, and proof points will be implemented from the approved Figma and verified company brief.",
      ]}
      description="A practical software partner for teams building their next stage with intention."
      eyebrow="About Zypher"
      title="Build clearly. Grow deliberately."
    />
  );
}
