import { getSanityClient } from "@/integrations/cms/sanity/client";
import type { BlogPost } from "@/integrations/cms/sanity/types";

const blogPostProjection = `{
  "id": _id,
  title,
  "slug": slug.current,
  excerpt,
  "author": author->{name, role},
  "categories": categories[]->title,
  publishedAt,
  updatedAt,
  image,
  body,
  seo
}`;

function logSanityQueryFailure(operation: string, error: unknown): void {
  const message = error instanceof Error ? error.message : "Unknown Sanity query error";
  console.error(JSON.stringify({ event: "sanity_query_failed", operation, error: message }));
}
export type SanityQueryOptions = {
  preview?: boolean;
};

export async function getFeaturedPosts(
  limit = 3,
  options: SanityQueryOptions = {},
): Promise<BlogPost[]> {
  const client = getSanityClient(options);
  if (!client) return [];

  try {
    return await client.fetch<BlogPost[]>(
      `*[_type == "blogPost" && defined(publishedAt)] | order(publishedAt desc)[0...$limit]${blogPostProjection}`,
      { limit },
    );
  } catch (error) {
    logSanityQueryFailure("getFeaturedPosts", error);
    return [];
  }
}

export async function getBlogPost(
  slug: string,
  options: SanityQueryOptions = {},
): Promise<BlogPost | null> {
  const client = getSanityClient(options);
  if (!client) return null;

  try {
    return await client.fetch<BlogPost | null>(
      `*[_type == "blogPost" && slug.current == $slug][0]${blogPostProjection}`,
      { slug },
    );
  } catch (error) {
    logSanityQueryFailure("getBlogPost", error);
    return null;
  }
}

export async function getBlogPostSlugs(options: SanityQueryOptions = {}): Promise<string[]> {
  const client = getSanityClient(options);
  if (!client) return [];

  try {
    return await client.fetch<string[]>(
      `*[_type == "blogPost" && defined(publishedAt)].slug.current`,
    );
  } catch (error) {
    logSanityQueryFailure("getBlogPostSlugs", error);
    return [];
  }
}
