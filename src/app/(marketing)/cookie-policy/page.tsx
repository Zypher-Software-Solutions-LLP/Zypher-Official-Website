import type { Metadata } from "next";
import { StaticPage } from "@/features/pages/StaticPage";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Cookie Policy",
  description: "How cookies and optional analytics are used on the Zypher website.",
  path: "/cookie-policy",
});

export default function CookiePolicyPage(): React.ReactNode {
  return (
    <StaticPage
      description="This page will contain the approved cookie policy and consent details for the Zypher website."
      eyebrow="Legal"
      title="Cookie Policy"
    />
  );
}
