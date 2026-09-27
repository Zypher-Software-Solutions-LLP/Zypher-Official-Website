import { beforeEach, describe, expect, it, vi } from "vitest";
import type { NextRequest } from "next/server";

const { parseBodyMock, revalidatePathMock, revalidateTagMock } = vi.hoisted(() => ({
  parseBodyMock: vi.fn(),
  revalidatePathMock: vi.fn(),
  revalidateTagMock: vi.fn(),
}));

vi.mock("next-sanity/webhook", () => ({ parseBody: parseBodyMock }));
vi.mock("next/cache", () => ({
  revalidatePath: revalidatePathMock,
  revalidateTag: revalidateTagMock,
}));

import { POST } from "@/app/api/revalidate/sanity/route";

function request(body = "{}", method = "POST"): NextRequest {
  return new Request("http://localhost:3000/api/revalidate/sanity", {
    method,
    body: method === "POST" ? body : undefined,
    headers: { "content-type": "application/json", "sanity-webhook-signature": "signed" },
  }) as unknown as NextRequest;
}

describe("Sanity revalidation webhook", () => {
  beforeEach(() => {
    parseBodyMock.mockReset();
    revalidatePathMock.mockReset();
    revalidateTagMock.mockReset();
    process.env.SANITY_REVALIDATE_SECRET = "test-webhook-secret";
  });

  it("should immediately expire affected blog and slug tags", async () => {
    parseBodyMock.mockResolvedValue({
      isValidSignature: true,
      body: {
        documentType: "blogPost",
        slug: "new-slug",
        previousSlug: "old-slug",
      },
    });

    const response = await POST(request());

    expect(response.status).toBe(200);
    expect(revalidateTagMock).toHaveBeenCalledWith("sanity:blog", { expire: 0 });
    expect(revalidateTagMock).toHaveBeenCalledWith("sanity:blog:list", { expire: 0 });
    expect(revalidateTagMock).toHaveBeenCalledWith("sanity:blog:post:new-slug", { expire: 0 });
    expect(revalidateTagMock).toHaveBeenCalledWith("sanity:blog:post:old-slug", { expire: 0 });
    expect(revalidatePathMock).toHaveBeenCalledWith("/blog");
    expect(revalidatePathMock).toHaveBeenCalledWith("/blog/new-slug");
    expect(revalidatePathMock).toHaveBeenCalledWith("/blog/old-slug");
    expect(revalidatePathMock).toHaveBeenCalledWith("/sitemap.xml");
    expect(revalidatePathMock).toHaveBeenCalledWith("/llms.txt");
    expect(parseBodyMock).toHaveBeenCalledWith(expect.anything(), "test-webhook-secret", true);
  });

  it("should revalidate the static page when its Sanity SEO document changes", async () => {
    parseBodyMock.mockResolvedValue({
      isValidSignature: true,
      body: { documentType: "pageSeo", slug: null, previousSlug: null, pagePath: "/about" },
    });

    const response = await POST(request());

    expect(response.status).toBe(200);
    expect(revalidateTagMock).toHaveBeenCalledWith("sanity:page-seo", { expire: 0 });
    expect(revalidatePathMock).toHaveBeenCalledWith("/about");
  });

  it("should reject invalid signatures without invalidating cache", async () => {
    parseBodyMock.mockResolvedValue({ isValidSignature: false, body: null });

    const response = await POST(request());

    expect(response.status).toBe(401);
    expect(revalidateTagMock).not.toHaveBeenCalled();
  });

  it("should reject unsupported document types and methods", async () => {
    parseBodyMock.mockResolvedValue({
      isValidSignature: true,
      body: { documentType: "unknown" },
    });

    const response = await POST(request());
    const methodResponse = await POST(request("", "GET"));

    expect(response.status).toBe(400);
    expect(methodResponse.status).toBe(405);
  });

  it("should reject non-JSON webhook requests before signature processing", async () => {
    const response = await POST(
      new Request("http://localhost:3000/api/revalidate/sanity", {
        method: "POST",
        body: "{}",
        headers: { "content-type": "text/plain" },
      }) as unknown as NextRequest,
    );

    expect(response.status).toBe(415);
    expect(parseBodyMock).not.toHaveBeenCalled();
  });

  it("should reject streamed webhook bodies over the limit before signature processing", async () => {
    const body = new ReadableStream<Uint8Array>({
      start(controller) {
        controller.enqueue(new Uint8Array(32_769));
        controller.close();
      },
    });

    const response = await POST(
      new Request("http://localhost:3000/api/revalidate/sanity", {
        method: "POST",
        body,
        duplex: "half",
        headers: { "content-type": "application/json" },
      } as RequestInit & { duplex: "half" }) as unknown as NextRequest,
    );

    expect(response.status).toBe(413);
    expect(parseBodyMock).not.toHaveBeenCalled();
  });

  it("should reject malformed slugs and unknown payload keys", async () => {
    parseBodyMock.mockResolvedValue({
      isValidSignature: true,
      body: { documentType: "blogPost", slug: "not a safe slug", unexpected: true },
    });

    const response = await POST(request());

    expect(response.status).toBe(400);
    expect(revalidateTagMock).not.toHaveBeenCalled();
  });
});
