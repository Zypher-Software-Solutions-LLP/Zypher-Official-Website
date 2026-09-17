import type { Metadata } from "next";
import { StaticPage } from "@/features/pages/StaticPage";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Careers",
  description: "Explore opportunities to work with Zypher.",
  path: "/careers",
});

export default function CareersPage(): React.ReactNode {
  return (
    <StaticPage
      description="We are building a thoughtful team around meaningful software work."
      eyebrow="Careers"
      title="Make useful things with good people."
    />
  );
}
