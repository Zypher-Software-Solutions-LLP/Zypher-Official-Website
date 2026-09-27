export type PhoneCountry = {
  id: string;
  name: string;
  dialCode: string;
  grouping: readonly number[];
  maxDigits: number;
};

export const phoneCountryOptions: readonly PhoneCountry[] = [
  { id: "india", name: "India", dialCode: "+91", grouping: [5, 5], maxDigits: 10 },
  { id: "uae", name: "United Arab Emirates", dialCode: "+971", grouping: [2, 3, 4], maxDigits: 9 },
  { id: "saudi-arabia", name: "Saudi Arabia", dialCode: "+966", grouping: [2, 3, 4], maxDigits: 9 },
  { id: "qatar", name: "Qatar", dialCode: "+974", grouping: [4, 4], maxDigits: 8 },
  { id: "oman", name: "Oman", dialCode: "+968", grouping: [4, 4], maxDigits: 8 },
  { id: "kuwait", name: "Kuwait", dialCode: "+965", grouping: [4, 4], maxDigits: 8 },
  { id: "bahrain", name: "Bahrain", dialCode: "+973", grouping: [4, 4], maxDigits: 8 },
  { id: "pakistan", name: "Pakistan", dialCode: "+92", grouping: [3, 3, 4], maxDigits: 10 },
  { id: "bangladesh", name: "Bangladesh", dialCode: "+880", grouping: [4, 3, 3], maxDigits: 10 },
  { id: "sri-lanka", name: "Sri Lanka", dialCode: "+94", grouping: [2, 3, 4], maxDigits: 9 },
  { id: "nepal", name: "Nepal", dialCode: "+977", grouping: [2, 3, 4], maxDigits: 9 },
  {
    id: "united-states",
    name: "United States",
    dialCode: "+1",
    grouping: [3, 3, 4],
    maxDigits: 10,
  },
  { id: "canada", name: "Canada", dialCode: "+1", grouping: [3, 3, 4], maxDigits: 10 },
  {
    id: "united-kingdom",
    name: "United Kingdom",
    dialCode: "+44",
    grouping: [4, 3, 4],
    maxDigits: 11,
  },
  { id: "australia", name: "Australia", dialCode: "+61", grouping: [1, 4, 4], maxDigits: 9 },
  { id: "new-zealand", name: "New Zealand", dialCode: "+64", grouping: [1, 3, 4], maxDigits: 8 },
  { id: "singapore", name: "Singapore", dialCode: "+65", grouping: [4, 4], maxDigits: 8 },
  { id: "malaysia", name: "Malaysia", dialCode: "+60", grouping: [2, 4, 4], maxDigits: 10 },
  { id: "indonesia", name: "Indonesia", dialCode: "+62", grouping: [3, 4, 4], maxDigits: 11 },
  { id: "philippines", name: "Philippines", dialCode: "+63", grouping: [3, 3, 4], maxDigits: 10 },
  { id: "japan", name: "Japan", dialCode: "+81", grouping: [2, 4, 4], maxDigits: 10 },
  { id: "south-korea", name: "South Korea", dialCode: "+82", grouping: [2, 4, 4], maxDigits: 10 },
  { id: "china", name: "China", dialCode: "+86", grouping: [3, 4, 4], maxDigits: 11 },
  { id: "germany", name: "Germany", dialCode: "+49", grouping: [3, 4, 4], maxDigits: 11 },
  { id: "france", name: "France", dialCode: "+33", grouping: [1, 4, 4], maxDigits: 9 },
  { id: "netherlands", name: "Netherlands", dialCode: "+31", grouping: [1, 4, 4], maxDigits: 9 },
  { id: "italy", name: "Italy", dialCode: "+39", grouping: [3, 4, 4], maxDigits: 10 },
  { id: "spain", name: "Spain", dialCode: "+34", grouping: [3, 3, 3], maxDigits: 9 },
  { id: "switzerland", name: "Switzerland", dialCode: "+41", grouping: [2, 3, 4], maxDigits: 9 },
  { id: "sweden", name: "Sweden", dialCode: "+46", grouping: [2, 3, 4], maxDigits: 9 },
  { id: "norway", name: "Norway", dialCode: "+47", grouping: [3, 2, 3], maxDigits: 8 },
  { id: "denmark", name: "Denmark", dialCode: "+45", grouping: [2, 2, 2, 2], maxDigits: 8 },
  { id: "ireland", name: "Ireland", dialCode: "+353", grouping: [2, 3, 4], maxDigits: 9 },
  { id: "russia", name: "Russia", dialCode: "+7", grouping: [3, 3, 2, 2], maxDigits: 10 },
  { id: "turkey", name: "Türkiye", dialCode: "+90", grouping: [3, 3, 4], maxDigits: 10 },
  { id: "israel", name: "Israel", dialCode: "+972", grouping: [2, 3, 4], maxDigits: 9 },
  { id: "south-africa", name: "South Africa", dialCode: "+27", grouping: [2, 3, 4], maxDigits: 9 },
  { id: "nigeria", name: "Nigeria", dialCode: "+234", grouping: [3, 3, 4], maxDigits: 10 },
  { id: "kenya", name: "Kenya", dialCode: "+254", grouping: [3, 3, 3], maxDigits: 9 },
  { id: "egypt", name: "Egypt", dialCode: "+20", grouping: [2, 4, 4], maxDigits: 10 },
  { id: "brazil", name: "Brazil", dialCode: "+55", grouping: [2, 5, 4], maxDigits: 11 },
  { id: "mexico", name: "Mexico", dialCode: "+52", grouping: [2, 4, 4], maxDigits: 10 },
  { id: "argentina", name: "Argentina", dialCode: "+54", grouping: [2, 4, 4], maxDigits: 10 },
  { id: "chile", name: "Chile", dialCode: "+56", grouping: [1, 4, 4], maxDigits: 9 },
  { id: "colombia", name: "Colombia", dialCode: "+57", grouping: [3, 3, 4], maxDigits: 10 },
  { id: "peru", name: "Peru", dialCode: "+51", grouping: [1, 4, 4], maxDigits: 9 },
  {
    id: "international",
    name: "Other / international",
    dialCode: "+",
    grouping: [3, 3, 3, 3, 3],
    maxDigits: 15,
  },
] as const;

const countryCodes: Readonly<Record<string, string>> = {
  india: "in",
  uae: "ae",
  "saudi-arabia": "sa",
  qatar: "qa",
  oman: "om",
  kuwait: "kw",
  bahrain: "bh",
  pakistan: "pk",
  bangladesh: "bd",
  "sri-lanka": "lk",
  nepal: "np",
  "united-states": "us",
  canada: "ca",
  "united-kingdom": "gb",
  australia: "au",
  "new-zealand": "nz",
  singapore: "sg",
  malaysia: "my",
  indonesia: "id",
  philippines: "ph",
  japan: "jp",
  "south-korea": "kr",
  china: "cn",
  germany: "de",
  france: "fr",
  netherlands: "nl",
  italy: "it",
  spain: "es",
  switzerland: "ch",
  sweden: "se",
  norway: "no",
  denmark: "dk",
  ireland: "ie",
  russia: "ru",
  turkey: "tr",
  israel: "il",
  "south-africa": "za",
  nigeria: "ng",
  kenya: "ke",
  egypt: "eg",
  brazil: "br",
  mexico: "mx",
  argentina: "ar",
  chile: "cl",
  colombia: "co",
  peru: "pe",
  international: "un",
};

export function getPhoneCountryCode(country: PhoneCountry): string {
  return countryCodes[country.id] ?? "un";
}

export function getPhoneCountryFlagUrl(country: PhoneCountry): string {
  return `https://flagcdn.com/${getPhoneCountryCode(country)}.svg`;
}

export function getPhoneCountryLabel(country: PhoneCountry): string {
  return `${country.name} (${country.dialCode})`;
}
export function formatPhoneNumber(value: string, country: PhoneCountry): string {
  const digits = value.replace(/\D/g, "").slice(0, country.maxDigits);
  const chunks: string[] = [];
  let cursor = 0;

  for (const groupLength of country.grouping) {
    if (cursor >= digits.length) break;
    chunks.push(digits.slice(cursor, cursor + groupLength));
    cursor += groupLength;
  }

  return chunks.join(" ");
}

export function getPhoneDigits(value: string, country: PhoneCountry): string {
  return value.replace(/\D/g, "").slice(0, country.maxDigits);
}

export function getPhonePlaceholder(country: PhoneCountry): string {
  const example = formatPhoneNumber("123456789012345", country);
  return example ? `${country.dialCode} ${example}` : `${country.dialCode} phone number`;
}
