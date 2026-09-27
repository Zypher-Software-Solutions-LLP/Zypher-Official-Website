import { z } from "zod";
import { contactBudgetOptions, contactServiceOptions } from "@/features/contact/contact-options";

const CONTROL_CHARACTERS = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/;
const LINE_BREAKS = /[\r\n]/;
const UNICODE_LETTER = /\p{L}/u;
const E164_PHONE_NUMBER = /^\+[1-9]\d{6,14}$/;

const singleLineText = (minimumLength: number, maximumLength: number) =>
  z
    .string()
    .max(maximumLength)
    .refine((value) => !LINE_BREAKS.test(value) && !CONTROL_CHARACTERS.test(value), {
      message: "Use a single line without control characters",
    })
    .transform((value) => value.trim())
    .pipe(z.string().min(minimumLength).max(maximumLength));

const optionalSingleLineText = (minimumLength: number, maximumLength: number) =>
  z
    .string()
    .max(maximumLength)
    .refine((value) => !LINE_BREAKS.test(value) && !CONTROL_CHARACTERS.test(value), {
      message: "Use a single line without control characters",
    })
    .transform((value) => value.trim())
    .pipe(z.union([z.literal(""), z.string().min(minimumLength).max(maximumLength)]))
    .optional();

const phoneNumber = z
  .string()
  .trim()
  .max(16)
  .refine((value) => value.length === 0 || E164_PHONE_NUMBER.test(value), {
    message: "Enter a valid international phone number",
  });

export const ContactPayloadSchema = z
  .object({
    name: singleLineText(2, 100).refine((value) => UNICODE_LETTER.test(value), {
      message: "Enter a valid name",
    }),
    email: z.string().trim().email().max(254),
    company: optionalSingleLineText(2, 120),
    phone: phoneNumber.optional(),
    serviceInterest: z.enum(contactServiceOptions),
    budgetRange: z.enum(contactBudgetOptions),
    subject: optionalSingleLineText(1, 160),
    message: z
      .string()
      .trim()
      .min(20)
      .max(5000)
      .refine((value) => !CONTROL_CHARACTERS.test(value), {
        message: "Remove unsupported control characters",
      }),
    consentAcknowledged: z.literal(true),
    turnstileToken: z.string().trim().min(1).max(2048),
    submissionId: z.string().uuid(),
  })
  .strict();

export type ContactPayload = z.infer<typeof ContactPayloadSchema>;
