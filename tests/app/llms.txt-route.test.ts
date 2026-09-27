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
});
