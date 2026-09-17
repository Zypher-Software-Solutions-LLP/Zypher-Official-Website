import type { Metadata } from "next";
import { StaticPage } from "@/features/pages/StaticPage";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Work",
  description:
    "A high-level view of the kind of software and systems Zypher helps teams move forward.",
  path: "/work",
});

export default function WorkPage(): React.ReactNode {
  return (
    <StaticPage
      body={[
        "The Work page will become Zypher’s portfolio and outcomes overview. It will present verified work, capabilities, and the context behind each result without inventing case-study claims.",
        "Detailed case-study routes are intentionally reserved for a future milestone once the source material, permissions, and measurable outcomes are ready.",
      ]}
      description="A considered view of the products, systems, and partnerships that shape Zypher’s work."
      eyebrow="Selected work"
      title="Useful work has a reason behind it."
    />
  );
}
