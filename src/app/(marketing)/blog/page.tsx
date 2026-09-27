import type { Metadata } from "next";
import { draftMode } from "next/headers";
import { BlogListingPage } from "@/features/blog/BlogListingPage";
import { parseBlogSort } from "@/features/blog/blog-route";
import { getStaticPageMetadata } from "@/lib/seo";
import { notFound } from "next/navigation";

type BlogRouteProps = {
  searchParams: Promise<{ sort?: string | string[] }>;
};

export async function generateMetadata({ searchParams }: BlogRouteProps): Promise<Metadata> {
  const sort = parseBlogSort((await searchParams).sort);
  if (!sort) notFound();
  const { isEnabled: isPreview } = await draftMode();

  return getStaticPageMetadata("/blog", {
    noIndex: isPreview || sort === "oldest",
    noFollow: isPreview,
    preview: isPreview,
  });
}

export default async function BlogPage({ searchParams }: BlogRouteProps): Promise<React.ReactNode> {
  const sort = parseBlogSort((await searchParams).sort);
  if (!sort) notFound();
  return <BlogListingPage page={1} sort={sort} />;
}
