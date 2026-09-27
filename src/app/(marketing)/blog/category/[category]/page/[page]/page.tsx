import type { Metadata } from "next";
import { draftMode } from "next/headers";
import { BlogListingPage } from "@/features/blog/BlogListingPage";
import { getBlogCategories } from "@/integrations/cms/sanity/queries";
import { getBlogPageNumber, parseBlogSort } from "@/features/blog/blog-route";
import { buildPageMetadata } from "@/lib/seo";
import { notFound } from "next/navigation";

type BlogCategoryPageRouteProps = {
  params: Promise<{ category: string; page: string }>;
  searchParams: Promise<{ sort?: string | string[] }>;
};

async function getCategory(categorySlug: string, preview: boolean) {
  const result = await getBlogCategories({ preview });
  return result.status === "ok"
    ? result.data.find((category) => category.slug === categorySlug)
    : null;
}

export async function generateMetadata({
  params,
  searchParams,
}: BlogCategoryPageRouteProps): Promise<Metadata> {
  const { category: slug, page: rawPage } = await params;
  const page = getBlogPageNumber(rawPage);
  const sort = parseBlogSort((await searchParams).sort);
  const { isEnabled: isPreview } = await draftMode();
  const category = await getCategory(slug, isPreview);
  if (!page || page < 2 || !sort || !category) notFound();

  return buildPageMetadata({
    title: `${category.title} — Page ${page}`,
    description: `Page ${page} of Zypher's ${category.title.toLowerCase()} articles.`,
    path: `/blog/category/${category.slug}/page/${page}`,
    noIndex: true,
    noFollow: isPreview,
  });
}

export default async function BlogCategoryPageRoute({
  params,
  searchParams,
}: BlogCategoryPageRouteProps): Promise<React.ReactNode> {
  const { category, page: rawPage } = await params;
  const page = getBlogPageNumber(rawPage);
  const sort = parseBlogSort((await searchParams).sort);
  if (!page || page < 2 || !sort) notFound();

  return <BlogListingPage categorySlug={category} page={page} sort={sort} />;
}
