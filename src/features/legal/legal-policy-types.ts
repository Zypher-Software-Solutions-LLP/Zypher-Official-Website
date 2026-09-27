export type LegalPolicyBlock =
  | { type: "paragraph"; text: string }
  | { type: "subheading"; text: string }
  | { type: "list"; items: readonly string[] }
  | { type: "contact"; lines: readonly string[] };

export type LegalPolicySection = {
  id: string;
  number: string;
  title: string;
  blocks: readonly LegalPolicyBlock[];
};
