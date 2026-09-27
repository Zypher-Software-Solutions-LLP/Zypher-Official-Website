import type { MetadataRoute } from "next";
import { getBlogSitemapEntries } from "@/integrations/cms/sanity/queries";
import { absoluteUrl } from "@/lib/seo";
import { publicRoutes } from "@/lib/routes";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const blogPostsResult = await getBlogSitemapEntries();
  const blogPosts = blogPostsResult.status === "ok" ? blogPostsResult.data : [];
  const staticEntries = publicRoutes.map((path) => ({
    url: absoluteUrl(path),
    changeFrequency: path === "/blog" ? "weekly" : "monthly",
    priority: path === "/" ? 1 : path.startsWith("/services") ? 0.8 : 0.6,
  })) satisfies MetadataRoute.Sitemap;
  const postEntries = blogPosts.map((post) => ({
    url: absoluteUrl(`/blog/${post.slug}`),
    changeFrequency: "monthly" as const,
    priority: 0.5,
    lastModified: post.updatedAt,
    images: post.image?.url ? [post.image.url] : undefined,
  }));

  return [...staticEntries, ...postEntries];
}
