import type { Metadata } from "next";
import { draftMode } from "next/headers";
import { BlogListingPage } from "@/features/blog/BlogListingPage";
import { getBlogCategories } from "@/integrations/cms/sanity/queries";
import { buildPageMetadata } from "@/lib/seo";
import { notFound } from "next/navigation";

type BlogCategoryRouteProps = {
  params: Promise<{ category: string }>;
  searchParams: Promise<{ sort?: string | string[] }>;
};

export async function generateMetadata({
  params,
  searchParams,
}: BlogCategoryRouteProps): Promise<Metadata> {
  const { category: slug } = await params;
  const sortValue = (await searchParams).sort;
  const rawSort = Array.isArray(sortValue) ? sortValue[0] : sortValue;
  if (rawSort && rawSort !== "oldest" && rawSort !== "newest") notFound();
  const { isEnabled: isPreview } = await draftMode();
  const categoriesResult = await getBlogCategories({ preview: isPreview });
  const category =
    categoriesResult.status === "ok"
      ? categoriesResult.data.find((item) => item.slug === slug)
      : null;
  if (!category) notFound();
  return buildPageMetadata({
    title: `${category.title} articles`,
    description:
      category.description ||
      `Insights and practical notes from Zypher about ${category.title.toLowerCase()}.`,
    path: `/blog/category/${category.slug}`,
    noIndex: true,
    noFollow: isPreview,
  });
}

export default async function BlogCategoryPage({
  params,
  searchParams,
}: BlogCategoryRouteProps): Promise<React.ReactNode> {
  const { category } = await params;
  const sortValue = (await searchParams).sort;
  const rawSort = Array.isArray(sortValue) ? sortValue[0] : sortValue;
  if (rawSort && rawSort !== "oldest" && rawSort !== "newest") notFound();

  return (
    <BlogListingPage
      categorySlug={category}
      page={1}
      sort={rawSort === "oldest" ? "oldest" : "newest"}
    />
  );
}
