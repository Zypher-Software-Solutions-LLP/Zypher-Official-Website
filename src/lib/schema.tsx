import type { ReactNode } from "react";
import type { BlogPost } from "@/integrations/cms/sanity/types";
import type { ServiceDefinition } from "@/features/services/service-data";
import { absoluteUrl, SITE_NAME } from "@/lib/seo";

function serializeJsonLd(value: unknown): string {
  return JSON.stringify(value).replaceAll("<", "\\u003c");
}

export function JsonLd({ data }: { data: Record<string, unknown> }): ReactNode {
  return (
    <script
      dangerouslySetInnerHTML={{ __html: serializeJsonLd(data) }}
      type="application/ld+json"
    />
  );
}

export function OrganizationJsonLd(): ReactNode {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "ProfessionalService",
        name: SITE_NAME,
        url: absoluteUrl("/"),
      }}
    />
  );
}

export function WebsiteJsonLd(): ReactNode {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: SITE_NAME,
        url: absoluteUrl("/"),
      }}
    />
  );
}

export function ServiceJsonLd({ service }: { service: ServiceDefinition }): ReactNode {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "Service",
        name: service.name,
        description: service.description,
        serviceType: service.name,
        provider: {
          "@type": "ProfessionalService",
          name: SITE_NAME,
          url: absoluteUrl("/"),
        },
        url: absoluteUrl(`/services/${service.slug}`),
      }}
    />
  );
}

type BreadcrumbItem = {
  name: string;
  path: string;
};

export function BreadcrumbJsonLd({ items }: { items: BreadcrumbItem[] }): ReactNode {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: items.map((item, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: item.name,
          item: absoluteUrl(item.path),
        })),
      }}
    />
  );
}

export function BlogPostingJsonLd({ post }: { post: BlogPost }): ReactNode {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        headline: post.title,
        description: post.excerpt,
        datePublished: post.publishedAt,
        dateModified: post.updatedAt || post.publishedAt,
        author: {
          "@type": "Person",
          name: post.author?.name || SITE_NAME,
        },
        publisher: {
          "@type": "Organization",
          name: SITE_NAME,
          url: absoluteUrl("/"),
        },
        mainEntityOfPage: absoluteUrl(`/blog/${post.slug}`),
      }}
    />
  );
}
