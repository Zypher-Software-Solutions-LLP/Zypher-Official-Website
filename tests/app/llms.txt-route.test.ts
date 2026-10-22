import { beforeEach, describe, expect, it, vi } from "vitest";

const { getBlogSitemapEntriesMock } = vi.hoisted(() => ({
  getBlogSitemapEntriesMock: vi.fn(),
}));

vi.mock("@/integrations/cms/sanity/queries", () => ({
  getBlogSitemapEntries: getBlogSitemapEntriesMock,
}));

import { GET } from "@/app/llms.txt/route";

describe("llms.txt route", () => {
  beforeEach(() => {
    getBlogSitemapEntriesMock.mockReset();
  });

  it("should expose standards-shaped absolute links for published content", async () => {
    getBlogSitemapEntriesMock.mockResolvedValue({
      status: "ok",
      data: [
        {
          title: "Building resilient systems",
          excerpt: "A practical guide to resilient systems.",
          slug: "resilient-systems",
          publishedAt: "2026-09-20T08:00:00.000Z",
          updatedAt: "2026-09-21T08:00:00.000Z",
        },
      ],
    });

    const response = await GET();
    const body = await response.text();

    expect(response.headers.get("content-type")).toContain("text/plain");
    expect(body).toContain("# Zypher Software Solutions");
    expect(body).toContain(
      "> Software development, automation, CRM/ERP, mobile, and UI/UX solutions",
    );
    expect(body).toContain(
      "- [Building resilient systems](http://localhost:3000/blog/resilient-systems)",
    );
    expect(body).toContain("A practical guide to resilient systems.");
    expect(body).not.toContain("- Home: /");
  });

  it("should describe the company, services and contact details with absolute links", async () => {
    getBlogSitemapEntriesMock.mockResolvedValue({ status: "ok", data: [] });

    const body = await (await GET()).text();

    expect(body).toContain(
      "## About\nZypher Software Solutions (legally Zypher Software Solutions LLP)",
    );
    expect(body).toContain("founded in December 2025");
    expect(body).toContain(
      "- [AI & LLM Automation](http://localhost:3000/services/ai-llm-automation): AI and LLM automation uses language models to handle repetitive business tasks. Zypher Software Solutions builds custom chatbots and workflows.",
    );
    expect(body).toContain(
      "- [Software Development](http://localhost:3000/services/software-development): Custom software is built around a company's own workflows, not an off-the-shelf tool. Zypher Software Solutions builds web platforms and internal tools.",
    );
    expect(body).toContain(
      "- [Mobile App Development](http://localhost:3000/services/mobile-app-development): Mobile app development means building iOS and Android apps. Zypher Software Solutions builds apps from strategy and UX through launch and support.",
    );
    expect(body).toContain(
      "- [CRM/ERP Solutions](http://localhost:3000/services/crm-erp-solutions): A CRM manages customers and sales; an ERP connects finance, inventory and operations. Zypher Software Solutions builds custom CRM and ERP systems.",
    );
    expect(body).toContain(
      "- [Design & Creative](http://localhost:3000/services/design-creative): Product design covers the research, UX and UI behind a digital product. Zypher Software Solutions delivers product design and design systems.",
    );
    expect(body.match(/^- \[.*\]\(http:\/\/localhost:3000\/services\/[a-z-]+\): /gm)).toHaveLength(
      5,
    );
    expect(body).toContain("## Contact");
    expect(body).toContain("info@zypher-solutions.com");
    expect(body).toContain("+91 80757 25045");
    expect(body).toContain(
      "Work Well Coworking, 5th Floor, C.M Mathew Brothers Arcade, Kannur Rd, West Nadakkave, Kozhikode (Calicut), Kerala 673006, India",
    );
    expect(body).toContain("## Canonical pages");
    expect(body).toContain("## Published articles");
    expect(body).toContain("## Content policy");
  });
});
