import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { serviceDefinitions } from "@/features/services/service-data";
import { BlogPostingJsonLd, FaqJsonLd, OrganizationJsonLd, ServiceJsonLd } from "@/lib/schema";
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
    expect(data.sameAs).not.toContain("https://wa.me/918075725045");
  });
});

describe("OrganizationJsonLd", () => {
  function renderOrganization(): Record<string, unknown> & { address: Record<string, unknown> } {
    render(<OrganizationJsonLd />);
    const script = document.querySelector('script[type="application/ld+json"]');
    return JSON.parse(script?.textContent || "{}");
  }

  it("should expose legal identity, founding date, founders and expertise", () => {
    const data = renderOrganization();

    expect(data.legalName).toBe("Zypher Software Solutions LLP");
    expect(data.alternateName).toEqual(["Zypher", "Zypher Software Solutions LLP"]);
    expect(data.foundingDate).toBe("2025-12-09");
    expect(data.founder).toEqual([
      {
        "@type": "Person",
        name: "Muhammed Hasheem",
        jobTitle: "Co-founder & CEO",
        sameAs: ["https://www.linkedin.com/in/muhammedhasheem/"],
      },
      {
        "@type": "Person",
        name: "Mohammed Ziyan",
        jobTitle: "Co-founder & COO",
        sameAs: ["https://www.linkedin.com/in/mohammedziyan7/"],
      },
      {
        "@type": "Person",
        name: "Hank Emmanuel Nixon",
        jobTitle: "Co-founder & CTO",
        sameAs: ["https://www.linkedin.com/in/hanknixon/"],
      },
    ]);
    expect(data.knowsAbout).toEqual([
      "AI automation",
      "LLM integration",
      "Custom software development",
      "Mobile app development",
      "CRM and ERP systems",
      "Product design",
    ]);
  });

  it("should keep the existing address and profile fields", () => {
    const data = renderOrganization();

    expect(data.address.addressLocality).toBe("Kozhikode (Calicut)");
    expect(data.email).toBe("info@zypher-solutions.com");
    expect(data.sameAs).toContain("https://www.linkedin.com/company/zypher-solutions/");
    expect(JSON.stringify(data.sameAs)).not.toContain("wa.me");
    expect(JSON.stringify(data.sameAs)).not.toContain("whatsapp");
  });
});

describe("ServiceJsonLd", () => {
  const DEFINITIONS: Record<string, string> = {
    "ai-llm-automation":
      "AI and LLM automation uses language models to handle repetitive business tasks. Zypher Software Solutions builds custom chatbots and workflows.",
    "software-development":
      "Custom software is built around a company's own workflows, not an off-the-shelf tool. Zypher Software Solutions builds web platforms and internal tools.",
    "mobile-app-development":
      "Mobile app development means building iOS and Android apps. Zypher Software Solutions builds apps from strategy and UX through launch and support.",
    "crm-erp-solutions":
      "A CRM manages customers and sales; an ERP connects finance, inventory and operations. Zypher Software Solutions builds custom CRM and ERP systems.",
    "design-creative":
      "Product design covers the research, UX and UI behind a digital product. Zypher Software Solutions delivers product design and design systems.",
  };

  it.each(serviceDefinitions)(
    "should use the definition as the description for $slug",
    (service) => {
      render(<ServiceJsonLd service={service} />);
      const script = document.querySelector('script[type="application/ld+json"]');
      const data = JSON.parse(script?.textContent || "{}");

      expect(service.definition).toBe(DEFINITIONS[service.slug]);
      expect(data.description).toBe(DEFINITIONS[service.slug]);
      expect(data.areaServed).toBe("Worldwide");
      expect(data.name).toBe(service.name);
      expect(data.url).toBe(`http://localhost:3000/services/${service.slug}`);
      expect(data.provider["@id"]).toBe("http://localhost:3000/#organization");
    },
  );
});
