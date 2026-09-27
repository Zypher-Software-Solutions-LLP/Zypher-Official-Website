import { LegalPolicyPage } from "./LegalPolicyPage";
import {
  PRIVACY_POLICY_LAST_UPDATED,
  privacyPolicyIntroduction,
  privacyPolicySections,
} from "./privacy-policy-content";

export function PrivacyPolicyPage(): React.ReactNode {
  return (
    <LegalPolicyPage
      bodyLabel="Privacy policy content"
      eyebrow="Legal"
      heroDescription="Your privacy matters. Here’s how we collect, use, protect, and handle your information at Zypher."
      indexLabel="Privacy policy sections"
      intro={privacyPolicyIntroduction}
      lastUpdated={PRIVACY_POLICY_LAST_UPDATED}
      lastUpdatedDateTime="2026-09-10"
      lastUpdatedLabel="Last Updated"
      pageKey="privacy-policy"
      sections={privacyPolicySections}
      title="Privacy Policy"
    />
  );
}
