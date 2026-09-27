import type { Metadata } from "next";
import { draftMode } from "next/headers";
import { BlogListingPage } from "@/features/blog/BlogListingPage";
import { getBlogPageNumber, parseBlogSort } from "@/features/blog/blog-route";
import { buildPageMetadata } from "@/lib/seo";
import { notFound } from "next/navigation";

type BlogPageRouteProps = {
  params: Promise<{ page: string }>;
  searchParams: Promise<{ sort?: string | string[] }>;
};

export async function generateMetadata({
  params,
  searchParams,
}: BlogPageRouteProps): Promise<Metadata> {
  const { page: rawPage } = await params;
  const page = getBlogPageNumber(rawPage);
  const search = await searchParams;
  const sort = parseBlogSort(search.sort);
  if (!page || page < 2 || !sort) notFound();
  const { isEnabled: isPreview } = await draftMode();

  return buildPageMetadata({
    title: `Blog — Page ${page}`,
    description: `Page ${page} of Zypher's practical perspectives on software, design, automation, and building for growth.`,
    path: `/blog/page/${page}`,
    noIndex: true,
    noFollow: isPreview,
  });
}

export default async function BlogPageRoute({
  params,
  searchParams,
}: BlogPageRouteProps): Promise<React.ReactNode> {
  const { page: rawPage } = await params;
  const page = getBlogPageNumber(rawPage);
  const sort = parseBlogSort((await searchParams).sort);
  if (!page || page < 2 || !sort) notFound();

  return <BlogListingPage page={page} sort={sort} />;
}
