export const SANITY_CACHE_TAGS = {
  blog: "sanity:blog",
  blogList: "sanity:blog:list",
  blogCategories: "sanity:blog:categories",
  pageSeo: "sanity:page-seo",
  siteSettings: "sanity:site-settings",
} as const;

export function blogPostTag(slug: string): string {
  return `sanity:blog:post:${slug}`;
}

export function blogTags(slug?: string): string[] {
  return [SANITY_CACHE_TAGS.blog, SANITY_CACHE_TAGS.blogList, ...(slug ? [blogPostTag(slug)] : [])];
}
