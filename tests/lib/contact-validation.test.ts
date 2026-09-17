import { describe, expect, it } from "vitest";
import { ContactPayloadSchema } from "@/lib/validation/contact";

describe("ContactPayloadSchema", () => {
  it("should accept a valid contact submission when required fields are present", () => {
    const result = ContactPayloadSchema.safeParse({
      name: "Hank Nixon",
      email: "hank@example.com",
      company: "Zypher",
      subject: "Website project",
      message: "I would like to discuss a website project.",
      consentAcknowledged: true,
      turnstileToken: "local-development-token",
      submissionId: "00000000-0000-4000-8000-000000000001",
    });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.name).toBe("Hank Nixon");
    }
  });

  it("should reject a submission when required fields are missing", () => {
    const result = ContactPayloadSchema.safeParse({
      name: "Hank Nixon",
      email: "",
      message: "",
      consentAcknowledged: false,
    });

    expect(result.success).toBe(false);
  });

  it("should reject a submission when the email address is malformed", () => {
    const result = ContactPayloadSchema.safeParse({
      name: "Hank Nixon",
      email: "not-an-email",
      message: "A valid message.",
      consentAcknowledged: true,
      turnstileToken: "token",
      submissionId: "00000000-0000-4000-8000-000000000001",
    });

    expect(result.success).toBe(false);
  });
});
