import type { Metadata } from "next";
import { StaticPage } from "@/features/pages/StaticPage";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Privacy Policy",
  description: "How Zypher handles personal information on this website.",
  path: "/privacy-policy",
});

export default function PrivacyPolicyPage(): React.ReactNode {
  return (
    <StaticPage
      description="This page will contain the approved privacy policy for the Zypher website."
      eyebrow="Legal"
      title="Privacy Policy"
    />
  );
}
