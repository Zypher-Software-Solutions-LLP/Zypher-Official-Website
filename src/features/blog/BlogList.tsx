"use client";

import Link from "next/link";
import Image from "next/image";
import { useMemo, useState, type ReactNode } from "react";
import type { BlogCategory, BlogPostSummary, BlogSort } from "@/integrations/cms/sanity/types";
import { BlogSortOptions } from "./BlogSortOptions";
import styles from "./BlogList.module.css";

type PaginationItem = number | "ellipsis";

function getPaginationItems(totalPages: number, currentPage: number): PaginationItem[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  if (currentPage <= 4) {
    return [1, 2, 3, 4, 5, "ellipsis", totalPages];
  }

  if (currentPage >= totalPages - 3) {
    return [
      1,
      "ellipsis",
      totalPages - 4,
      totalPages - 3,
      totalPages - 2,
      totalPages - 1,
      totalPages,
    ];
  }

  return [1, "ellipsis", currentPage - 1, currentPage, currentPage + 1, "ellipsis", totalPages];
}

function getPageHref(page: number, categorySlug: string | undefined, sort: BlogSort): string {
  const basePath = categorySlug ? `/blog/category/${categorySlug}` : "/blog";
  const pagePath = page > 1 ? `${basePath}/page/${page}` : basePath;
  return sort === "oldest" ? `${pagePath}?sort=oldest` : pagePath;
}

type BlogListProps = {
  posts: BlogPostSummary[];
  categories: BlogCategory[];
  totalPages: number;
  currentPage: number;
  categorySlug?: string;
  sort: BlogSort;
  hasError?: boolean;
  interactive?: boolean;
};

export function BlogList({
  posts,
  categories,
  totalPages,
  currentPage,
  categorySlug,
  sort,
  hasError = false,
  interactive = false,
}: BlogListProps): ReactNode {
  const basePath = categorySlug ? `/blog/category/${categorySlug}` : "/blog";
  const [selectedCategorySlug, setSelectedCategorySlug] = useState<string | undefined>(
    categorySlug,
  );
  const [selectedSort, setSelectedSort] = useState<BlogSort>(sort);
  const activeCategorySlug = interactive ? selectedCategorySlug : categorySlug;
  const activeSort = interactive ? selectedSort : sort;
  const selectedCategoryLabel = categories.find(
    (category) => category.slug === activeCategorySlug,
  )?.title;
  const visiblePosts = useMemo(() => {
    if (!interactive) return posts;

    const filteredPosts = selectedCategorySlug
      ? posts.filter((post) =>
          post.categories.some((category) => category.slug === selectedCategorySlug),
        )
      : posts;

    return [...filteredPosts].sort((firstPost, secondPost) => {
      const firstDate = new Date(firstPost.publishedAt).getTime();
      const secondDate = new Date(secondPost.publishedAt).getTime();
      return selectedSort === "oldest" ? firstDate - secondDate : secondDate - firstDate;
    });
  }, [interactive, posts, selectedCategorySlug, selectedSort]);

  return (
    <section
      aria-labelledby="blog-posts-title"
      className={styles.section}
      data-motion-section="true"
      data-testid="blog-posts-section"
      id="blog-posts"
    >
      <div className={styles.inner} data-motion-item="true">
        <h2 className={styles.visuallyHidden} id="blog-posts-title">
          {selectedCategoryLabel ? `${selectedCategoryLabel} articles` : "Blog posts"}
        </h2>

        <div className={styles.toolbar}>
          <nav aria-label="Blog categories" className={styles.categories}>
            {interactive ? (
              <button
                aria-pressed={!selectedCategorySlug}
                className={
                  styles.categoryButton +
                  " " +
                  (!selectedCategorySlug ? styles.categoryButtonActive : "")
                }
                onClick={() => setSelectedCategorySlug(undefined)}
                type="button"
              >
                All
              </button>
            ) : (
              <Link
                aria-current={!categorySlug ? "page" : undefined}
                className={
                  styles.categoryButton + " " + (!categorySlug ? styles.categoryButtonActive : "")
                }
                href={getPageHref(1, undefined, sort)}
              >
                All
              </Link>
            )}
            {categories.map((category) =>
              interactive ? (
                <button
                  aria-pressed={category.slug === selectedCategorySlug}
                  className={
                    styles.categoryButton +
                    " " +
                    (category.slug === selectedCategorySlug ? styles.categoryButtonActive : "")
                  }
                  key={category.slug}
                  onClick={() => setSelectedCategorySlug(category.slug)}
                  type="button"
                >
                  {category.title}
                </button>
              ) : (
                <Link
                  aria-current={category.slug === categorySlug ? "page" : undefined}
                  className={
                    styles.categoryButton +
                    " " +
                    (category.slug === categorySlug ? styles.categoryButtonActive : "")
                  }
                  href={getPageHref(1, category.slug, sort)}
                  key={category.slug}
                >
                  {category.title}
                </Link>
              ),
            )}
          </nav>

          <BlogSortOptions
            basePath={basePath}
            interactive={interactive}
            onValueChange={setSelectedSort}
            value={activeSort}
          />
        </div>

        {visiblePosts.length > 0 ? (
          <div aria-live="polite" className={styles.grid} data-testid="blog-post-grid">
            {visiblePosts.map((post) => (
              <article className={styles.card} data-testid="blog-post-card" key={post.id}>
                <Link
                  aria-label={post.title}
                  className={styles.cardLinkWrap}
                  href={`/blog/${post.slug}`}
                >
                  <div className={styles.cardMedia}>
                    {post.image?.url ? (
                      <Image
                        alt={post.image.alt}
                        className={styles.cardImage}
                        fill
                        sizes="(max-width: 48rem) 100vw, (max-width: 64rem) 50vw, 25vw"
                        src={post.image.url}
                      />
                    ) : null}
                  </div>
                  <div className={styles.cardContent}>
                    <h3 className={styles.cardTitle}>{post.title}</h3>
                    <p className={styles.cardDescription}>{post.excerpt}</p>
                    <time className={styles.cardDate} dateTime={post.publishedAt}>
                      {new Date(post.publishedAt).toLocaleDateString("en-US")}
                    </time>
                    <div className={styles.cardFooter}>
                      <span className={styles.cardReadMore}>
                        Read More <span aria-hidden="true">&rarr;</span>
                      </span>
                      <span className={styles.cardCategory}>
                        {post.categories?.[0]?.title || "Insights"}
                      </span>
                    </div>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        ) : (
          <div className={styles.emptyState} data-testid="blog-post-empty-state">
            {hasError
              ? "We could not load the blog right now. Please try again shortly."
              : selectedCategoryLabel
                ? `No ${selectedCategoryLabel} posts are available yet.`
                : "Blog content will appear here once the Sanity editorial workspace is connected."}
          </div>
        )}

        {totalPages > 1 ? (
          <nav aria-label="Blog pagination" className={styles.pagination}>
            <Link
              aria-disabled={currentPage === 1}
              className={styles.paginationButton}
              href={
                currentPage === 1
                  ? getPageHref(1, categorySlug, sort)
                  : getPageHref(currentPage - 1, categorySlug, sort)
              }
            >
              <span aria-hidden="true">&larr;</span> Previous
            </Link>

            <div className={styles.pageNumbers}>
              {getPaginationItems(totalPages, currentPage).map((item, index) =>
                item === "ellipsis" ? (
                  <span aria-hidden="true" className={styles.ellipsis} key={"ellipsis-" + index}>
                    ...
                  </span>
                ) : (
                  <Link
                    aria-current={currentPage === item ? "page" : undefined}
                    aria-label={"Go to page " + item}
                    className={
                      styles.pageButton +
                      " " +
                      (currentPage === item ? styles.pageButtonActive : "")
                    }
                    href={getPageHref(item, categorySlug, sort)}
                    key={item}
                  >
                    {item}
                  </Link>
                ),
              )}
            </div>

            <Link
              aria-disabled={currentPage === totalPages}
              className={styles.paginationButton}
              href={
                currentPage === totalPages
                  ? getPageHref(totalPages, categorySlug, sort)
                  : getPageHref(currentPage + 1, categorySlug, sort)
              }
            >
              Next <span aria-hidden="true">&rarr;</span>
            </Link>
          </nav>
        ) : null}
      </div>
    </section>
  );
}
