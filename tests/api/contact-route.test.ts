import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { POST } from "@/app/api/contact/route";
import { sendContactEmail } from "@/integrations/email/resend";
import { verifyTurnstile } from "@/integrations/security/turnstile";

vi.mock("@/integrations/email/resend", () => ({
  sendContactEmail: vi.fn(),
}));

vi.mock("@/integrations/security/turnstile", () => ({
  verifyTurnstile: vi.fn(),
}));

const mockedSendContactEmail = vi.mocked(sendContactEmail);
const mockedVerifyTurnstile = vi.mocked(verifyTurnstile);

const validPayload = {
  name: "Hank Nixon",
  email: "hank@example.com",
  company: "Zypher",
  phone: "+918075725045",
  subject: "Project enquiry",
  message: "I would like to discuss a tailored software project for our team.",
  consentAcknowledged: true,
  turnstileToken: "turnstile-token",
  submissionId: "00000000-0000-4000-8000-000000000001",
};

function createRequest(body: string, contentLength?: string): Request {
  const headers = new Headers({ "content-type": "application/json" });

  if (contentLength) {
    headers.set("content-length", contentLength);
  }

  return new Request("http://localhost/api/contact", {
    method: "POST",
    headers,
    body,
  });
}

describe("contact route", () => {
  beforeEach(() => {
    mockedSendContactEmail.mockResolvedValue({ id: "email-id" });
    mockedVerifyTurnstile.mockResolvedValue(true);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should reject invalid JSON with a client error", async () => {
    const response = await POST(createRequest("{"));

    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({
      error: "Please check your form details.",
      code: "INVALID_INPUT",
    });
    expect(mockedVerifyTurnstile).not.toHaveBeenCalled();
  });

  it("should reject oversized payloads before parsing", async () => {
    const response = await POST(createRequest("{}", "32769"));

    expect(response.status).toBe(413);
    expect(await response.json()).toEqual({
      error: "Please check your form details.",
      code: "PAYLOAD_TOO_LARGE",
    });
  });

  it("should reject schema validation errors", async () => {
    const response = await POST(
      createRequest(JSON.stringify({ ...validPayload, email: "invalid" })),
    );

    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({
      error: "Please check your form details.",
      code: "INVALID_INPUT",
    });
    expect(mockedVerifyTurnstile).not.toHaveBeenCalled();
  });

  it("should reject failed Turnstile verification", async () => {
    mockedVerifyTurnstile.mockResolvedValue(false);

    const response = await POST(createRequest(JSON.stringify(validPayload)));

    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({
      error: "Please complete the verification and try again.",
      code: "VERIFICATION_FAILED",
    });
    expect(mockedSendContactEmail).not.toHaveBeenCalled();
  });

  it("should deliver valid contact submissions", async () => {
    const response = await POST(createRequest(JSON.stringify(validPayload)));

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ ok: true });
    expect(mockedVerifyTurnstile).toHaveBeenCalledWith(validPayload.turnstileToken);
    expect(mockedSendContactEmail).toHaveBeenCalledWith(validPayload);
  });

  it("should return a server error when the provider fails", async () => {
    mockedSendContactEmail.mockRejectedValue(new Error("provider unavailable"));
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => undefined);

    const response = await POST(createRequest(JSON.stringify(validPayload)));

    expect(response.status).toBe(500);
    expect(await response.json()).toEqual({
      error: "We could not send your message right now.",
      code: "DELIVERY_FAILED",
    });
    expect(errorSpy).toHaveBeenCalledWith(expect.stringContaining("contact_delivery_failed"));
  });
});
