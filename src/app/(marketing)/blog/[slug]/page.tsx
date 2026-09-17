import type { Metadata } from "next";
import { draftMode } from "next/headers";
import { notFound } from "next/navigation";
import { BlogViewTracker } from "@/features/blog/BlogViewTracker";
import { getBlogPost, getBlogPostSlugs } from "@/integrations/cms/sanity/queries";
import { BreadcrumbJsonLd, BlogPostingJsonLd } from "@/lib/schema";
import { buildPageMetadata } from "@/lib/seo";

type BlogPostRouteProps = { params: Promise<{ slug: string }> };

export async function generateStaticParams(): Promise<Array<{ slug: string }>> {
  const slugs = await getBlogPostSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: BlogPostRouteProps): Promise<Metadata> {
  const { slug } = await params;
  const { isEnabled: isPreview } = await draftMode();
  const post = await getBlogPost(slug, { preview: isPreview });

  if (!post) {
    return buildPageMetadata({
      title: "Blog Post",
      description: "Zypher blog post.",
      path: `/blog/${slug}`,
      noIndex: true,
    });
  }

  return buildPageMetadata({
    title: post.seo?.title || post.title,
    description: post.seo?.description || post.excerpt,
    path: `/blog/${post.slug}`,
    noIndex: isPreview,
  });
}

export default async function BlogPostPage({
  params,
}: BlogPostRouteProps): Promise<React.ReactNode> {
  const { slug } = await params;
  const { isEnabled: isPreview } = await draftMode();
  const post = await getBlogPost(slug, { preview: isPreview });
  if (!post) notFound();

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
      <main id="main-content">
        <article className="site-container max-w-3xl py-24 sm:py-32">
          <p className="eyebrow">{post.categories[0] || "Insights"}</p>
          <h1 className="mt-5 text-4xl font-semibold tracking-tight text-mist-100 sm:text-6xl">
            {post.title}
          </h1>
          <p className="mt-6 text-lg leading-8 text-mist-300">{post.excerpt}</p>
          <div className="mt-8 flex gap-3 text-sm text-mist-500">
            <span>{post.author?.name || "Zypher"}</span>
            <span aria-hidden="true">·</span>
            <time dateTime={post.publishedAt}>
              {new Date(post.publishedAt).toLocaleDateString("en-US")}
            </time>
          </div>
          <div className="mt-14 rounded-3xl border border-mist-300/15 bg-ink-900 p-6 text-sm leading-7 text-mist-300 sm:p-8">
            Portable text rendering will be connected to this typed Sanity body in the blog-content
            milestone.
          </div>
        </article>
      </main>
    </>
  );
}
