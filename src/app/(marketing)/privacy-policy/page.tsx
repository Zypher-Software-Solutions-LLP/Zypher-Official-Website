import type { Metadata } from "next";
import { PrivacyPolicyPage as PrivacyPolicyDocument } from "@/features/legal/PrivacyPolicyPage";
import { getStaticPageMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  return getStaticPageMetadata("/privacy-policy");
}

export default function PrivacyPolicyPage(): React.ReactNode {
  return <PrivacyPolicyDocument />;
}
