import { draftMode } from "next/headers";
import { notFound } from "next/navigation";
import { BlogHeroSection } from "@/features/blog/BlogHeroSection";
import { BlogList } from "@/features/blog/BlogList";
import {
  getAllPublishedBlogPosts,
  getBlogCategories,
  getLatestPublishedPost,
  getPaginatedBlogPosts,
} from "@/integrations/cms/sanity/queries";
import type { BlogSort } from "@/integrations/cms/sanity/types";

type BlogListingPageProps = {
  page: number;
  categorySlug?: string;
  sort: BlogSort;
};

export async function BlogListingPage({
  page,
  categorySlug,
  sort,
}: BlogListingPageProps): Promise<React.ReactNode> {
  const { isEnabled: isPreview } = await draftMode();
  const latestResult = await getLatestPublishedPost({ preview: isPreview });
  const latestPost = latestResult.status === "ok" ? latestResult.data || undefined : undefined;
  const isInteractiveListing = page === 1 && !categorySlug;
  const [postsResult, categoriesResult] = await Promise.all([
    isInteractiveListing
      ? getAllPublishedBlogPosts({ preview: isPreview })
      : getPaginatedBlogPosts({
          page,
          categorySlug,
          heroPostId: latestPost?.id,
          preview: isPreview,
          sort,
        }),
    getBlogCategories({ preview: isPreview }),
  ]);

  const categories = categoriesResult.status === "ok" ? categoriesResult.data : [];
  if (
    categorySlug &&
    categoriesResult.status === "ok" &&
    !categories.some((category) => category.slug === categorySlug)
  ) {
    notFound();
  }

  const interactivePosts =
    isInteractiveListing && postsResult.status === "ok" && Array.isArray(postsResult.data)
      ? postsResult.data
      : null;
  const paginatedPosts =
    !isInteractiveListing && postsResult.status === "ok" && !Array.isArray(postsResult.data)
      ? postsResult.data
      : null;
  if (paginatedPosts && paginatedPosts.totalPages > 0 && page > paginatedPosts.totalPages) {
    notFound();
  }
  if (page > 1 && paginatedPosts?.totalPages === 0) notFound();
  const featuredPostBelongsToCategory = Boolean(
    categorySlug && latestPost?.categories.some((category) => category.slug === categorySlug),
  );
  if (categorySlug && paginatedPosts?.totalItems === 0 && !featuredPostBelongsToCategory) {
    notFound();
  }

  const hasError = [latestResult, postsResult, categoriesResult].some(
    (result) => result.status === "error" || result.status === "unconfigured",
  );

  return (
    <main id="main-content">
      <BlogHeroSection hasError={hasError} post={latestPost} />
      <BlogList
        categories={categories}
        categorySlug={categorySlug}
        currentPage={page}
        hasError={hasError}
        interactive={isInteractiveListing}
        key={`${categorySlug || "all"}-${page}-${sort}`}
        posts={interactivePosts || paginatedPosts?.items || []}
        sort={sort}
        totalPages={isInteractiveListing ? 1 : paginatedPosts?.totalPages || 0}
      />
    </main>
  );
}
