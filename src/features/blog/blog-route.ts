import type { BlogSort } from "@/integrations/cms/sanity/types";

export function parseBlogSort(value: string | string[] | undefined): BlogSort | null {
  const rawValue = Array.isArray(value) ? value[0] : value;
  if (rawValue === undefined || rawValue === "newest") return "newest";
  if (rawValue === "oldest") return "oldest";
  return null;
}

export function getBlogPageNumber(value: string): number | null {
  if (!/^\d+$/.test(value)) return null;
  const page = Number(value);
  return Number.isSafeInteger(page) && page >= 1 ? page : null;
}
