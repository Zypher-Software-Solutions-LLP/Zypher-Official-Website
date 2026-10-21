import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { BlogPostingJsonLd, FaqJsonLd, OrganizationJsonLd } from "@/lib/schema";
import type { BlogPostDetail } from "@/integrations/cms/sanity/types";

const article: BlogPostDetail = {
  id: "post-1",
  title: "Building resilient systems for growing teams",
  slug: "resilient-systems",
  excerpt: "A practical guide to shaping software around the way your team actually works.",
  author: { name: "Zypher Team", url: "https://www.linkedin.com/company/zypher-solutions/" },
  categories: [{ title: "Engineering", slug: "engineering" }],
  publishedAt: "2026-09-20T08:00:00.000Z",
  updatedAt: "2026-09-21T08:00:00.000Z",
  image: {
    alt: "A systems dashboard",
    url: "https://cdn.sanity.io/images/project/production/post.jpg",
    width: 1200,
    height: 800,
  },
  body: [],
};

describe("BlogPostingJsonLd", () => {
  it("should expose article image, dates, publisher, and canonical URL", () => {
    render(<BlogPostingJsonLd post={article} />);
    const articleImage = article.image;
    if (!articleImage) throw new Error("Test article image is required");
    const script = document.querySelector('script[type="application/ld+json"]');
    const data = JSON.parse(script?.textContent || "{}");

    expect(data["@type"]).toBe("BlogPosting");
    expect(data.image).toBe(articleImage.url);
    expect(data.datePublished).toBe(article.publishedAt);
    expect(data.dateModified).toBe(article.updatedAt);
    expect(data.url).toBe("http://localhost:3000/blog/resilient-systems");
    expect(data.author).toEqual({
      "@type": "Organization",
      name: article.author.name,
      url: article.author.url,
    });
    expect(data.publisher["@id"]).toBe("http://localhost:3000/#organization");
    expect(data.publisher.logo.url).toBe("http://localhost:3000/icon-512.png");
  });
});

describe("FaqJsonLd", () => {
  it("should expose every FAQ item as an escaped FAQPage question", () => {
    const items = [
      { id: "cost", question: "How much does it cost?", answer: "It depends on scope." },
      { id: "markup", question: "Is </script> escaped?", answer: "Yes, <b>always</b>." },
    ];

    render(<FaqJsonLd items={items} />);
    const script = document.querySelector('script[type="application/ld+json"]');
    const rawJson = script?.innerHTML || "";
    const data = JSON.parse(rawJson || "{}");

    expect(rawJson).not.toContain("<");
    expect(data["@type"]).toBe("FAQPage");
    expect(data.mainEntity).toEqual(
      items.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: { "@type": "Answer", text: item.answer },
      })),
    );
  });
});

describe("OrganizationJsonLd", () => {
  it("should expose the description, office address, service area, and profiles", () => {
    render(<OrganizationJsonLd />);
    const script = document.querySelector('script[type="application/ld+json"]');
    const data = JSON.parse(script?.textContent || "{}");

    expect(data.description).toBe(
      "Zypher Software Solutions is an AI and automation company building custom software, AI automation, mobile apps and CRM/ERP systems for businesses worldwide.",
    );
    expect(data.address).toEqual({
      "@type": "PostalAddress",
      streetAddress:
        "Work Well Coworking, 5th Floor, C.M Mathew Brothers Arcade, Kannur Rd, West Nadakkave",
      addressLocality: "Kozhikode (Calicut)",
      addressRegion: "Kerala",
      postalCode: "673006",
      addressCountry: "IN",
    });
    expect(data.areaServed).toBe("Worldwide");
    expect(data.sameAs).toContain("https://x.com/ZyphersSolution");
  });
});
