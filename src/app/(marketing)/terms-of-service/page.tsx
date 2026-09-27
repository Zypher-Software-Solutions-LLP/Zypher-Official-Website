import type { Metadata } from "next";
import { LegalPolicyPage } from "@/features/legal/LegalPolicyPage";
import {
  TERMS_OF_USE_LAST_UPDATED,
  termsOfUseIntroduction,
  termsOfUseSections,
} from "@/features/legal/terms-of-use-content";
import { getStaticPageMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  return getStaticPageMetadata("/terms-of-use");
}

export default function TermsOfUsePage(): React.ReactNode {
  return (
    <LegalPolicyPage
      bodyLabel="Terms of Use content"
      eyebrow="Legal"
      heroDescription="The terms governing use of the Zypher website."
      indexLabel="Terms of Use sections"
      intro={termsOfUseIntroduction}
      lastUpdated={TERMS_OF_USE_LAST_UPDATED}
      lastUpdatedLabel="Last Updated"
      pageKey="terms-of-use"
      sections={termsOfUseSections}
      title="Terms of Use"
    />
  );
}
