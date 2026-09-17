import Link from "next/link";
import type { BlogPost } from "@/integrations/cms/sanity/types";

export function BlogList({ posts }: { posts: BlogPost[] }): React.ReactNode {
  if (posts.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-mist-300/20 p-8 text-mist-300">
        Blog content will appear here once the Sanity editorial workspace is connected.
      </div>
    );
  }

  return (
    <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
      {posts.map((post) => (
        <article className="rounded-3xl border border-mist-300/15 p-6" key={post.id}>
          <p className="eyebrow">{post.categories[0] || "Insights"}</p>
          <h2 className="mt-5 text-xl font-semibold text-mist-100">
            <Link className="hover:text-cyan-300" href={`/blog/${post.slug}`}>
              {post.title}
            </Link>
          </h2>
          <p className="mt-3 text-sm leading-6 text-mist-300">{post.excerpt}</p>
          <p className="mt-6 text-xs text-mist-500">
            {post.author?.name || "Zypher"} ·{" "}
            {new Date(post.publishedAt).toLocaleDateString("en-US")}
          </p>
        </article>
      ))}
    </div>
  );
}
