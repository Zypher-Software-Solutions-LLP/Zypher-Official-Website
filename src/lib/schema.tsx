import type { ReactNode } from "react";
import type { BlogPost } from "@/integrations/cms/sanity/types";
import type { FaqItem } from "@/features/home/faq/faq-data";
import type { ServiceDefinition } from "@/features/services/service-data";
import { absoluteUrl, DEFAULT_SOCIAL_IMAGE_PATH, SITE_NAME } from "@/lib/seo";

const ORGANIZATION_ID = absoluteUrl("/#organization");
const ORGANIZATION_DESCRIPTION =
  "Zypher Software Solutions is an AI and automation company building custom software, AI automation, mobile apps and CRM/ERP systems for businesses worldwide.";
const ORGANIZATION_PROFILES = [
  "https://www.facebook.com/profile.php?id=61594146397661",
  "https://x.com/ZyphersSolution",
  "https://www.instagram.com/zyphersolutions/",
  "https://www.linkedin.com/company/zypher-solutions/",
];
const LOGO_URL = absoluteUrl("/icon-512.png");

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
        "@id": ORGANIZATION_ID,
        name: SITE_NAME,
        description: ORGANIZATION_DESCRIPTION,
        url: absoluteUrl("/"),
        logo: LOGO_URL,
        email: "info@zypher-solutions.com",
        telephone: "+918075725045",
        address: {
          "@type": "PostalAddress",
          streetAddress:
            "Work Well Coworking, 5th Floor, C.M Mathew Brothers Arcade, Kannur Rd, West Nadakkave",
          addressLocality: "Kozhikode (Calicut)",
          addressRegion: "Kerala",
          postalCode: "673006",
          addressCountry: "IN",
        },
        areaServed: "Worldwide",
        sameAs: ORGANIZATION_PROFILES,
      }}
    />
  );
}

export function FaqJsonLd({ items }: { items: readonly FaqItem[] }): ReactNode {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: items.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: item.answer,
          },
        })),
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
          "@id": ORGANIZATION_ID,
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
        image: post.image?.url || absoluteUrl(DEFAULT_SOCIAL_IMAGE_PATH),
        datePublished: post.publishedAt,
        dateModified: post.updatedAt,
        author: {
          "@type": post.author?.name === "Zypher Team" ? "Organization" : "Person",
          name: post.author?.name || SITE_NAME,
          ...(post.author?.url ? { url: post.author.url } : {}),
        },
        publisher: {
          "@type": "Organization",
          "@id": ORGANIZATION_ID,
          name: SITE_NAME,
          url: absoluteUrl("/"),
          logo: {
            "@type": "ImageObject",
            url: LOGO_URL,
          },
        },
        articleSection: (post.categories || []).map((category) => category.title),
        url: absoluteUrl(`/blog/${post.slug}`),
        mainEntityOfPage: absoluteUrl(`/blog/${post.slug}`),
      }}
    />
  );
}
