export const contactServiceOptions = [
  "Software Development",
  "Mobile App Development",
  "AI & LLM Automation",
  "CRM/ERP Solutions",
  "Design & Creative",
  "Cybersecurity",
  "Data Analytics & Data Science",
  "SEO, AEO & GEO",
  "Cloud & Infrastructure",
] as const;

export type ContactServiceInterest = (typeof contactServiceOptions)[number];

export const contactBudgetOptions = [
  "Under 30000 INR",
  "30000-100000",
  "100000-500000",
  "5 Lakh +",
  "Prefer not to say",
] as const;

export type ContactBudgetRange = (typeof contactBudgetOptions)[number];

const contactBudgetLabels: Readonly<Record<ContactBudgetRange, string>> = {
  "Under 30000 INR": "Under 30,000",
  "30000-100000": "30,000 – 1,00,000",
  "100000-500000": "1,00,000 – 5,00,000",
  "5 Lakh +": "5,00,000 and above",
  "Prefer not to say": "Prefer not to say",
};

export function getContactBudgetLabel(budget: ContactBudgetRange): string {
  return contactBudgetLabels[budget];
}
