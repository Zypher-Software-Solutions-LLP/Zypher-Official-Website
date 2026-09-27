import type { Metadata } from "next";
import { LegalPolicyPage } from "@/features/legal/LegalPolicyPage";
import {
  COOKIE_POLICY_LAST_UPDATED,
  cookiePolicyIntroduction,
  cookiePolicySections,
} from "@/features/legal/cookie-policy-content";
import { getStaticPageMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  return getStaticPageMetadata("/cookie-policy");
}

export default function CookiePolicyPage(): React.ReactNode {
  return (
    <LegalPolicyPage
      bodyLabel="Cookie Policy content"
      eyebrow="Legal"
      heroDescription="How cookies and optional analytics are used on the Zypher website."
      indexLabel="Cookie Policy sections"
      intro={cookiePolicyIntroduction}
      lastUpdated={COOKIE_POLICY_LAST_UPDATED}
      lastUpdatedLabel="Last Updated"
      pageKey="cookie-policy"
      sections={cookiePolicySections}
      title="Cookie Policy"
    />
  );
}
