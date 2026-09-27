import { describe, expect, it } from "vitest";
import { readBoundedBody } from "@/lib/http/read-bounded-body";

describe("readBoundedBody", () => {
  it("should read a UTF-8 request body under the configured limit", async () => {
    const request = new Request("http://localhost", {
      method: "POST",
      body: JSON.stringify({ message: "hello" }),
    });

    await expect(readBoundedBody(request, 128)).resolves.toEqual({
      status: "ok",
      body: JSON.stringify({ message: "hello" }),
    });
  });

  it("should reject an oversized declared body before reading it", async () => {
    const request = new Request("http://localhost", {
      method: "POST",
      headers: { "content-length": "129" },
      body: "{}",
    });

    await expect(readBoundedBody(request, 128)).resolves.toEqual({
      status: "payload-too-large",
    });
  });

  it("should reject a chunked body when the stream crosses the limit", async () => {
    const body = new ReadableStream<Uint8Array>({
      start(controller) {
        controller.enqueue(new Uint8Array(64));
        controller.enqueue(new Uint8Array(65));
        controller.close();
      },
    });
    const request = new Request("http://localhost", {
      method: "POST",
      body,
      duplex: "half",
    } as RequestInit & { duplex: "half" });

    await expect(readBoundedBody(request, 128)).resolves.toEqual({
      status: "payload-too-large",
    });
  });

  it("should reject invalid UTF-8 instead of silently replacing bytes", async () => {
    const body = new ReadableStream<Uint8Array>({
      start(controller) {
        controller.enqueue(new Uint8Array([0xff]));
        controller.close();
      },
    });
    const request = new Request("http://localhost", {
      method: "POST",
      body,
      duplex: "half",
    } as RequestInit & { duplex: "half" });

    await expect(readBoundedBody(request, 128)).resolves.toEqual({
      status: "invalid-encoding",
    });
  });
});
