import { describe, expect, it } from "vitest";
import { ContactPayloadSchema } from "@/lib/validation/contact";

describe("ContactPayloadSchema", () => {
  it("should accept a valid contact submission when required fields are present", () => {
    const result = ContactPayloadSchema.safeParse({
      name: "Hank Nixon",
      email: "hank@example.com",
      company: "Zypher",
      serviceInterest: "Software Development",
      budgetRange: "Under 30000 INR",
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
      serviceInterest: "Software Development",
      budgetRange: "Under 30000 INR",
      message: "A valid message.",
      consentAcknowledged: true,
      turnstileToken: "token",
      submissionId: "00000000-0000-4000-8000-000000000001",
    });

    expect(result.success).toBe(false);
  });

  it("should reject unsupported service and budget values", () => {
    const result = ContactPayloadSchema.safeParse({
      name: "Hank Nixon",
      email: "hank@example.com",
      serviceInterest: "Something else",
      budgetRange: "A lot",
      message: "A valid message for a project enquiry.",
      consentAcknowledged: true,
      turnstileToken: "token",
      submissionId: "00000000-0000-4000-8000-000000000001",
    });

    expect(result.success).toBe(false);
  });

  it("should reject malformed international phone numbers", () => {
    const result = ContactPayloadSchema.safeParse({
      name: "Hank Nixon",
      email: "hank@example.com",
      phone: "+91 abc",
      serviceInterest: "Software Development",
      budgetRange: "Under 30000 INR",
      message: "A valid message for a project enquiry.",
      consentAcknowledged: true,
      turnstileToken: "token",
      submissionId: "00000000-0000-4000-8000-000000000001",
    });

    expect(result.success).toBe(false);
  });

  it("should reject names that do not contain letters", () => {
    const result = ContactPayloadSchema.safeParse({
      name: "1234",
      email: "hank@example.com",
      serviceInterest: "Software Development",
      budgetRange: "Under 30000 INR",
      message: "A valid message for a project enquiry.",
      consentAcknowledged: true,
      turnstileToken: "token",
      submissionId: "00000000-0000-4000-8000-000000000001",
    });

    expect(result.success).toBe(false);
  });

  it("should reject a company name shorter than two characters when provided", () => {
    const result = ContactPayloadSchema.safeParse({
      name: "Hank Nixon",
      email: "hank@example.com",
      company: "Z",
      serviceInterest: "Software Development",
      budgetRange: "Under 30000 INR",
      message: "A valid message for a project enquiry.",
      consentAcknowledged: true,
      turnstileToken: "token",
      submissionId: "00000000-0000-4000-8000-000000000001",
    });

    expect(result.success).toBe(false);
  });

  it("should require phone numbers to use E.164 international structure", () => {
    const result = ContactPayloadSchema.safeParse({
      name: "Hank Nixon",
      email: "hank@example.com",
      phone: "1234567",
      serviceInterest: "Software Development",
      budgetRange: "Under 30000 INR",
      message: "A valid message for a project enquiry.",
      consentAcknowledged: true,
      turnstileToken: "token",
      submissionId: "00000000-0000-4000-8000-000000000001",
    });

    expect(result.success).toBe(false);
  });

  it("should reject line breaks in single-line email fields", () => {
    const result = ContactPayloadSchema.safeParse({
      name: "Hank Nixon",
      email: "hank@example.com",
      serviceInterest: "Software Development",
      budgetRange: "Under 30000 INR",
      subject: "Project enquiry\nBcc: attacker@example.com",
      message: "A valid message for a project enquiry.",
      consentAcknowledged: true,
      turnstileToken: "token",
      submissionId: "00000000-0000-4000-8000-000000000001",
    });

    expect(result.success).toBe(false);
  });

  it("should reject unrecognized payload fields", () => {
    const result = ContactPayloadSchema.safeParse({
      name: "Hank Nixon",
      email: "hank@example.com",
      serviceInterest: "Software Development",
      budgetRange: "Under 30000 INR",
      message: "A valid message for a project enquiry.",
      consentAcknowledged: true,
      turnstileToken: "token",
      submissionId: "00000000-0000-4000-8000-000000000001",
      isAdmin: true,
    });

    expect(result.success).toBe(false);
  });
});
