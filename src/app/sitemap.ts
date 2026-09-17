import type { MetadataRoute } from "next";
import { getBlogPostSlugs } from "@/integrations/cms/sanity/queries";
import { absoluteUrl } from "@/lib/seo";
import { publicRoutes } from "@/lib/routes";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const blogPostSlugs = await getBlogPostSlugs();
  const staticEntries = publicRoutes.map((path) => ({
    url: absoluteUrl(path),
    changeFrequency: path === "/blog" ? "weekly" : "monthly",
    priority: path === "/" ? 1 : path.startsWith("/services") ? 0.8 : 0.6,
  })) satisfies MetadataRoute.Sitemap;
  const postEntries = blogPostSlugs.map((slug) => ({
    url: absoluteUrl(`/blog/${slug}`),
    changeFrequency: "monthly" as const,
    priority: 0.5,
  }));

  return [...staticEntries, ...postEntries];
}
