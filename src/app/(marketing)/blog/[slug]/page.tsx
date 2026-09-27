import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { draftMode } from "next/headers";
import { notFound } from "next/navigation";
import { getArticleHeadingIds, getArticleSections } from "@/features/blog/article-content";
import { ArticleTableOfContents } from "@/features/blog/ArticleTableOfContents";
import styles from "@/features/blog/BlogArticle.module.css";
import { BlogViewTracker } from "@/features/blog/BlogViewTracker";
import { getBlogPost, getBlogPostSlugs } from "@/integrations/cms/sanity/queries";
import { PortableTextBody } from "@/features/blog/PortableTextBody";
import { BreadcrumbJsonLd, BlogPostingJsonLd } from "@/lib/schema";
import { buildBlogPostMetadata, buildPageMetadata } from "@/lib/seo";

type BlogPostRouteProps = { params: Promise<{ slug: string }> };

export async function generateStaticParams(): Promise<Array<{ slug: string }>> {
  const result = await getBlogPostSlugs();
  return result.status === "ok" ? result.data.map((slug) => ({ slug })) : [];
}

export async function generateMetadata({ params }: BlogPostRouteProps): Promise<Metadata> {
  const { slug } = await params;
  const { isEnabled: isPreview } = await draftMode();
  const result = await getBlogPost(slug, { preview: isPreview });
  const post = result.status === "ok" ? result.data : null;

  if (!post) {
    return buildPageMetadata({
      title: "Blog Post",
      description: "Zypher blog post.",
      path: `/blog/${slug}`,
      noIndex: true,
      noFollow: true,
    });
  }

  return buildBlogPostMetadata(post, isPreview, isPreview);
}

export default async function BlogPostPage({
  params,
}: BlogPostRouteProps): Promise<React.ReactNode> {
  const { slug } = await params;
  const { isEnabled: isPreview } = await draftMode();
  const result = await getBlogPost(slug, { preview: isPreview });
  if (result.status === "error" || result.status === "unconfigured") {
    return (
      <main className={styles.page} id="main-content">
        <article className={styles.errorPage}>
          <h1 className={styles.errorTitle}>Blog unavailable</h1>
          <p className={styles.errorDescription}>
            We could not load this article right now. Please check back shortly.
          </p>
        </article>
      </main>
    );
  }
  const post = result.data;
  if (!post) notFound();
  const sections = getArticleSections(post.body);
  const headingIds = getArticleHeadingIds(post.body);

  return (
    <>
      <BlogPostingJsonLd post={post} />
      <BlogViewTracker slug={post.slug} />
      <BreadcrumbJsonLd
        items={[
          { name: "Home", path: "/" },
          { name: "Blog", path: "/blog" },
          { name: post.title, path: `/blog/${post.slug}` },
        ]}
      />
      <main className={styles.page} id="main-content">
        <Link className={styles.backLink} href="/blog">
          &larr; Back to Blog
        </Link>
        <article className={styles.article} data-motion-intro="true">
          <header className={styles.articleHeader}>
            <span className={styles.category}>{post.categories[0]?.title || "Insights"}</span>
            <h1 className={styles.title}>{post.title}</h1>
            <p className={styles.excerpt}>{post.excerpt}</p>
            <div className={styles.meta}>
              <span>{post.author.name}</span>
              <span aria-hidden="true">&middot;</span>
              <time dateTime={post.publishedAt}>
                {new Date(post.publishedAt).toLocaleDateString("en-US")}
              </time>
            </div>
          </header>
          {post.image?.url ? (
            <div className={styles.featuredMedia}>
              <Image
                alt={post.image.alt}
                className={styles.featuredImage}
                fill
                priority
                sizes="(max-width: 768px) calc(100vw - 2rem), (max-width: 1280px) calc(100vw - 4rem), 1152px"
                src={post.image.url}
              />
            </div>
          ) : null}
          <div className={styles.contentLayout}>
            <ArticleTableOfContents sections={sections} />
            <div className={styles.articleBody} data-testid="blog-article-body">
              <PortableTextBody headingIds={headingIds} value={post.body} />
            </div>
          </div>
        </article>
      </main>
    </>
  );
}
