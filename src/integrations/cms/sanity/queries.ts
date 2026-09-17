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
  } catch {
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
  } catch {
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
  } catch {
    return [];
  }
}
