import type { Metadata } from "next";
import { draftMode } from "next/headers";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { BlogList } from "@/features/blog/BlogList";
import { getFeaturedPosts } from "@/integrations/cms/sanity/queries";
import { buildPageMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const { isEnabled: isPreview } = await draftMode();

  return buildPageMetadata({
    title: "Blog",
    description: "Practical perspectives on software, design, automation, and building for growth.",
    path: "/blog",
    noIndex: isPreview,
  });
}

export default async function BlogPage(): Promise<React.ReactNode> {
  const { isEnabled: isPreview } = await draftMode();
  const posts = await getFeaturedPosts(12, { preview: isPreview });

  return (
    <main id="main-content">
      <section className="border-b border-mist-300/10">
        <div className="site-container py-24 sm:py-32">
          <SectionHeading
            eyebrow="From Zypher"
            title="Useful ideas for the work ahead."
            description="Notes, perspectives, and practical guidance for teams building better software and operations."
          />
        </div>
      </section>
      <section className="site-container py-20 sm:py-28">
        <BlogList posts={posts} />
      </section>
    </main>
  );
}
