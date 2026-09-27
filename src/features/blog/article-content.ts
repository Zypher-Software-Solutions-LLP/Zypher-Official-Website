import type { PortableTextBlock } from "@/integrations/cms/sanity/types";

export type BlogArticleSection = {
  id: string;
  key?: string;
  level: 2 | 3;
  text: string;
};

export function getPortableTextBlockText(
  block: Pick<PortableTextBlock, "children"> | null | undefined,
): string {
  return (
    block?.children
      ?.map((child) => child.text)
      .join("")
      .replace(/\s+/g, " ")
      .trim() ?? ""
  );
}

export function slugifyHeading(text: string): string {
  return (
    text
      .toLowerCase()
      .normalize("NFKD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-") || "section"
  );
}

export function getArticleSections(body: PortableTextBlock[]): BlogArticleSection[] {
  const headingCounts = new Map<string, number>();

  return body.flatMap((block) => {
    if (block._type !== "block" || (block.style !== "h2" && block.style !== "h3")) {
      return [];
    }

    const text = getPortableTextBlockText(block);
    if (!text) return [];

    const baseId = slugifyHeading(text);
    const count = (headingCounts.get(baseId) ?? 0) + 1;
    headingCounts.set(baseId, count);
    const section: BlogArticleSection = {
      id: count === 1 ? baseId : `${baseId}-${count}`,
      level: block.style === "h2" ? 2 : 3,
      text,
    };

    if (block._key) section.key = block._key;
    return [section];
  });
}

export function getArticleHeadingIds(body: PortableTextBlock[]): ReadonlyMap<string, string> {
  return new Map(
    getArticleSections(body)
      .filter((section): section is BlogArticleSection & { key: string } => Boolean(section.key))
      .map((section) => [section.key, section.id]),
  );
}
