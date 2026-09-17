import { z } from "zod";

const optionalText = (maxLength: number) =>
  z.string().trim().max(maxLength).optional().or(z.literal(""));

export const ContactPayloadSchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(254),
  company: optionalText(120),
  phone: optionalText(40),
  subject: optionalText(160),
  message: z.string().trim().min(20).max(5000),
  consentAcknowledged: z.literal(true),
  turnstileToken: z.string().trim().min(1).max(2048),
  submissionId: z.string().uuid(),
});

export type ContactPayload = z.infer<typeof ContactPayloadSchema>;
