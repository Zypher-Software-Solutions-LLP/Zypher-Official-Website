import type { Metadata } from "next";
import { StaticPage } from "@/features/pages/StaticPage";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Terms of Service",
  description: "The terms governing use of the Zypher website.",
  path: "/terms-of-service",
});

export default function TermsOfServicePage(): React.ReactNode {
  return (
    <StaticPage
      description="This page will contain the approved terms of service for the Zypher website."
      eyebrow="Legal"
      title="Terms of Service"
    />
  );
}
