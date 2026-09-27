import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const { draftModeMock, enableMock, disableMock } = vi.hoisted(() => ({
  draftModeMock: vi.fn(),
  enableMock: vi.fn(),
  disableMock: vi.fn(),
}));

vi.mock("next/headers", () => ({ draftMode: draftModeMock }));

import { GET as enableDraftMode } from "@/app/api/draft-mode/enable/route";
import { GET as disableDraftMode } from "@/app/api/draft-mode/disable/route";

const previewSecret = "preview-secret";

function request(path: string): Request {
  return new Request(`http://localhost:3000${path}`);
}

describe("draft-mode routes", () => {
  beforeEach(() => {
    process.env.SANITY_PREVIEW_SECRET = previewSecret;
    enableMock.mockReset();
    disableMock.mockReset();
    draftModeMock.mockResolvedValue({ enable: enableMock, disable: disableMock });
  });

  afterEach(() => {
    delete process.env.SANITY_PREVIEW_SECRET;
  });

  it("should enable preview and redirect only to a local destination", async () => {
    const response = await enableDraftMode(
      request("/api/draft-mode/enable?secret=preview-secret&redirect=%2Fblog"),
    );

    expect(response.status).toBe(307);
    expect(response.headers.get("location")).toBe("http://localhost:3000/blog");
    expect(response.headers.get("cache-control")).toBe("no-store, private");
    expect(response.headers.get("x-robots-tag")).toBe("noindex, nofollow");
    expect(response.headers.get("referrer-policy")).toBe("no-referrer");
    expect(enableMock).toHaveBeenCalledOnce();
  });

  it("should replace an external preview redirect with the site root", async () => {
    const response = await enableDraftMode(
      request("/api/draft-mode/enable?secret=preview-secret&redirect=https%3A%2F%2Fevil.example"),
    );

    expect(response.headers.get("location")).toBe("http://localhost:3000/");
    expect(enableMock).toHaveBeenCalledOnce();
  });

  it("should reject an invalid enable secret without enabling preview", async () => {
    const response = await enableDraftMode(request("/api/draft-mode/enable?secret=wrong"));

    expect(response.status).toBe(401);
    expect(await response.json()).toEqual({ error: "Unauthorized", code: "UNAUTHORIZED" });
    expect(response.headers.get("cache-control")).toBe("no-store, private");
    expect(response.headers.get("x-robots-tag")).toBe("noindex, nofollow");
    expect(enableMock).not.toHaveBeenCalled();
    expect(draftModeMock).not.toHaveBeenCalled();
  });

  it("should disable preview and redirect to the site root", async () => {
    const response = await disableDraftMode(
      request("/api/draft-mode/disable?secret=preview-secret"),
    );

    expect(response.status).toBe(307);
    expect(response.headers.get("location")).toBe("http://localhost:3000/");
    expect(response.headers.get("cache-control")).toBe("no-store, private");
    expect(disableMock).toHaveBeenCalledOnce();
  });

  it("should reject disable requests when preview is not configured", async () => {
    delete process.env.SANITY_PREVIEW_SECRET;

    const response = await disableDraftMode(
      request("/api/draft-mode/disable?secret=preview-secret"),
    );

    expect(response.status).toBe(401);
    expect(disableMock).not.toHaveBeenCalled();
    expect(draftModeMock).not.toHaveBeenCalled();
  });
});
