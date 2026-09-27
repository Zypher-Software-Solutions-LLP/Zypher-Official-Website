import { getSanityClient } from "@/integrations/cms/sanity/client";
import { blogTags, SANITY_CACHE_TAGS } from "@/integrations/cms/sanity/cache-tags";
import type {
  BlogCategory,
  BlogPostDetail,
  BlogPostSummary,
  BlogQueryResult,
  BlogPostsQuery,
  BlogSitemapEntry,
  PaginatedBlogPosts,
  StaticPageSeo,
} from "@/integrations/cms/sanity/types";

export type SanityQueryOptions = { preview?: boolean };
export const BLOG_PAGE_SIZE = 8;

const imageProjection = `
  "image": image{
    alt,
    "url": asset->url,
    "width": asset->metadata.dimensions.width,
    "height": asset->metadata.dimensions.height
  }`;

const pageSeoProjection = `{
  "id": _id,
  "path": pagePath,
  title,
  description,
  noIndex,
  noFollow,
  "socialImage": socialImage{
    alt,
    "url": asset->url,
    "width": asset->metadata.dimensions.width,
    "height": asset->metadata.dimensions.height
  }
}`;

const authorProjection = `
  "author": author->{
    name,
    url,
    role,
    bio,
    "image": image{
      alt,
      "url": asset->url,
      "width": asset->metadata.dimensions.width,
      "height": asset->metadata.dimensions.height
    }
  }`;

const categoriesProjection = `
  "categories": categories[]->{title, "slug": slug.current, description}`;

const summaryProjection = `{
  "id": _id,
  title,
  "slug": slug.current,
  excerpt,
  ${authorProjection},
  ${categoriesProjection},
  publishedAt,
  "updatedAt": coalesce(updatedAt, _updatedAt),
  ${imageProjection},
  seo
}`;

const detailProjection = `{
  "id": _id,
  title,
  "slug": slug.current,
  excerpt,
  ${authorProjection},
  ${categoriesProjection},
  publishedAt,
  "updatedAt": coalesce(updatedAt, _updatedAt),
  ${imageProjection},
  body[]{
    ...,
    _type == "image" => {
      ...,
      "asset": asset->{url, "metadata": metadata{dimensions}}
    }
  },
  seo
}`;

function logSanityQueryFailure(operation: string, error: unknown): string {
  const message = error instanceof Error ? error.message : "Unknown Sanity query error";
  console.error(JSON.stringify({ event: "sanity_query_failed", operation, error: message }));
  return message;
}

function publishedFilter(preview: boolean): string {
  return preview
    ? "defined(publishedAt) && defined(slug.current)"
    : "defined(publishedAt) && publishedAt <= now() && defined(slug.current)";
}

async function querySanity<T>(
  operation: string,
  query: string,
  params: Record<string, unknown> = {},
  options: SanityQueryOptions = {},
  tags: string[] = [],
): Promise<BlogQueryResult<T>> {
  let client: ReturnType<typeof getSanityClient>;

  try {
    client = getSanityClient(options);
  } catch (error) {
    return { status: "error", data: null, message: logSanityQueryFailure(operation, error) };
  }

  if (!client) return { status: "unconfigured", data: null };

  try {
    const shouldBypassCache = options.preview || process.env.NODE_ENV === "development";
    const requestOptions = shouldBypassCache
      ? { cache: "no-store" as const }
      : { cache: "force-cache" as const, next: { tags } };
    const data = await client.fetch<T>(query, params, requestOptions);
    return { status: "ok", data };
  } catch (error) {
    return { status: "error", data: null, message: logSanityQueryFailure(operation, error) };
  }
}

export async function getLatestPublishedPost(
  options: SanityQueryOptions = {},
): Promise<BlogQueryResult<BlogPostSummary | null>> {
  const filter = publishedFilter(Boolean(options.preview));
  return querySanity<BlogPostSummary | null>(
    "getLatestPublishedPost",
    `*[_type == "blogPost" && ${filter}] | order(publishedAt desc, _createdAt desc)[0]${summaryProjection}`,
    {},
    options,
    blogTags(),
  );
}

export async function getAllPublishedBlogPosts(
  options: SanityQueryOptions = {},
): Promise<BlogQueryResult<BlogPostSummary[]>> {
  const filter = publishedFilter(Boolean(options.preview));
  return querySanity<BlogPostSummary[]>(
    "getAllPublishedBlogPosts",
    `*[_type == "blogPost" && ${filter}] | order(publishedAt desc, _createdAt desc)${summaryProjection}`,
    {},
    options,
    [SANITY_CACHE_TAGS.blog, SANITY_CACHE_TAGS.blogList, SANITY_CACHE_TAGS.blogCategories],
  );
}

export async function getPaginatedBlogPosts({
  page,
  pageSize = BLOG_PAGE_SIZE,
  categorySlug,
  sort = "newest",
  heroPostId,
  preview = false,
}: BlogPostsQuery): Promise<BlogQueryResult<PaginatedBlogPosts>> {
  const safePage = Math.max(1, page);
  const safePageSize = Math.max(1, pageSize);
  const start = (safePage - 1) * safePageSize;
  const end = start + safePageSize;
  const order =
    sort === "oldest" ? "publishedAt asc, _createdAt asc" : "publishedAt desc, _createdAt desc";
  const filter = `${publishedFilter(preview)} && ($categorySlug == null || $categorySlug in categories[]->slug.current) && ($heroPostId == null || _id != $heroPostId)`;
  const query = `{
    "totalItems": count(*[_type == "blogPost" && ${filter}]),
    "items": *[_type == "blogPost" && ${filter}] | order(${order})[${start}...${end}]${summaryProjection}
  }`;

  return querySanity<{ totalItems: number; items: BlogPostSummary[] }>(
    "getPaginatedBlogPosts",
    query,
    { categorySlug: categorySlug || null, heroPostId: heroPostId || null },
    { preview },
    [SANITY_CACHE_TAGS.blog, SANITY_CACHE_TAGS.blogList, SANITY_CACHE_TAGS.blogCategories],
  ).then((result) => {
    if (result.status !== "ok") return result;
    const totalPages = Math.ceil(result.data.totalItems / safePageSize);
    return {
      status: "ok",
      data: {
        items: result.data.items,
        page: safePage,
        pageSize: safePageSize,
        totalItems: result.data.totalItems,
        totalPages,
      },
    };
  });
}

export async function getBlogCategories(
  options: SanityQueryOptions = {},
): Promise<BlogQueryResult<BlogCategory[]>> {
  return querySanity<BlogCategory[]>(
    "getBlogCategories",
    `*[_type == "category" && defined(slug.current)] | order(title asc){title, "slug": slug.current, description}`,
    {},
    options,
    [SANITY_CACHE_TAGS.blog, SANITY_CACHE_TAGS.blogCategories],
  );
}

export async function getBlogPost(
  slug: string,
  options: SanityQueryOptions = {},
): Promise<BlogQueryResult<BlogPostDetail | null>> {
  const filter = publishedFilter(Boolean(options.preview));
  return querySanity<BlogPostDetail | null>(
    "getBlogPost",
    `*[_type == "blogPost" && ${filter} && slug.current == $slug][0]${detailProjection}`,
    { slug },
    options,
    blogTags(slug),
  );
}

export async function getBlogPostSlugs(
  options: SanityQueryOptions = {},
): Promise<BlogQueryResult<string[]>> {
  const filter = publishedFilter(Boolean(options.preview));
  return querySanity<string[]>(
    "getBlogPostSlugs",
    `*[_type == "blogPost" && ${filter}].slug.current`,
    {},
    options,
    [SANITY_CACHE_TAGS.blog],
  );
}

export async function getBlogSitemapEntries(
  options: SanityQueryOptions = {},
): Promise<BlogQueryResult<BlogSitemapEntry[]>> {
  const filter = publishedFilter(Boolean(options.preview));
  return querySanity<BlogSitemapEntry[]>(
    "getBlogSitemapEntries",
    `*[_type == "blogPost" && ${filter}] | order(publishedAt desc){title, excerpt, "slug": slug.current, publishedAt, "updatedAt": coalesce(updatedAt, _updatedAt), ${imageProjection}}`,
    {},
    options,
    [SANITY_CACHE_TAGS.blog],
  );
}

export async function getStaticPageSeo(
  path: string,
  options: SanityQueryOptions = {},
): Promise<BlogQueryResult<StaticPageSeo | null>> {
  return querySanity<StaticPageSeo | null>(
    "getStaticPageSeo",
    `*[_type == "pageSeo" && pagePath == $path][0]${pageSeoProjection}`,
    { path },
    options,
    [SANITY_CACHE_TAGS.pageSeo],
  );
}
