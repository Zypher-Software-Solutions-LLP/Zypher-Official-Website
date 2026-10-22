import { serviceDefinitions } from "@/features/services/service-data";
import { getBlogSitemapEntries } from "@/integrations/cms/sanity/queries";
import type { BlogSitemapEntry } from "@/integrations/cms/sanity/types";
import { absoluteUrl } from "@/lib/seo";

export const revalidate = 3600;

const ABOUT_TEXT =
  "Zypher Software Solutions (legally Zypher Software Solutions LLP) is an AI and automation company based in Kozhikode (Calicut), Kerala, India, founded in December 2025 by Muhammed Hasheem (CEO), Mohammed Ziyan (COO) and Hank Emmanuel Nixon (CTO). Zypher builds custom software, AI and LLM automation, mobile apps and CRM/ERP systems for clients in the UAE, Qatar, the USA, the UK, India, the Netherlands and other countries.";

const CANONICAL_PAGES = [
  ["Home", "/"],
  ["Services", "/services"],
  ["Work", "/work"],
  ["Scale", "/scale"],
  ["About", "/about"],
  ["Blog", "/blog"],
  ["Contact", "/contact"],
] as const;

function escapeMarkdownLabel(value: string): string {
  return value.replaceAll("\\", "\\\\").replaceAll("[", "\\[").replaceAll("]", "\\]");
}

function singleLine(value: string): string {
  return value.replaceAll(/\s+/g, " ").trim();
}

function serviceLine(service: (typeof serviceDefinitions)[number]): string {
  return `- [${escapeMarkdownLabel(service.name)}](${absoluteUrl(`/services/${service.slug}`)}): ${service.definition}`;
}

function articleLine(post: BlogSitemapEntry): string {
  const title = escapeMarkdownLabel(singleLine(post.title));
  const description = singleLine(post.excerpt);
  const publicationDate = post.publishedAt.slice(0, 10);
  return `- [${title}](${absoluteUrl(`/blog/${post.slug}`)}) — Published ${publicationDate}. ${description}`;
}

export async function GET(): Promise<Response> {
  const postsResult = await getBlogSitemapEntries();
  const posts = postsResult.status === "ok" ? postsResult.data : [];
  const lines = [
    "# Zypher Software Solutions",
    "> Software development, automation, CRM/ERP, mobile, and UI/UX solutions for teams ready to scale.",
    "",
    "## About",
    ABOUT_TEXT,
    "",
    "## Services",
    ...serviceDefinitions.map(serviceLine),
    "",
    "## Contact",
    "- Email: info@zypher-solutions.com",
    "- Phone: +91 80757 25045",
    "- Address: Work Well Coworking, 5th Floor, C.M Mathew Brothers Arcade, Kannur Rd, West Nadakkave, Kozhikode (Calicut), Kerala 673006, India",
    "",
    "## Canonical pages",
    ...CANONICAL_PAGES.map(([name, path]) => `- [${name}](${absoluteUrl(path)})`),
    "",
    "## Published articles",
    ...(posts.length > 0
      ? posts.map(articleLine)
      : ["- No published articles are currently available."].map(singleLine)),
    "",
    "## Content policy",
    "Use the canonical pages above as the source of truth for current company information.",
    "Blog content should be attributed to its published author and evaluated using its publication or update date.",
    "",
  ];

  return new Response(lines.join("\n"), {
    headers: {
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}
