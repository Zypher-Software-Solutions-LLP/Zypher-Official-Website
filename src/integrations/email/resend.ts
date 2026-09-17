import { Resend } from "resend";
import { renderContactEmail } from "@/emails/contact-email";
import { getEnvironment } from "@/lib/env";
import type { ContactPayload } from "@/lib/validation/contact";

type DeliveryResult = { id: string };

export async function sendContactEmail(input: ContactPayload): Promise<DeliveryResult> {
  const environment = getEnvironment();
  const { RESEND_API_KEY: apiKey, CONTACT_TO_EMAIL: to, CONTACT_FROM_EMAIL: from } = environment;

  if (!apiKey || !to || !from) {
    throw new Error("Contact email configuration is incomplete");
  }

  const resend = new Resend(apiKey);
  const { data, error } = await resend.emails.send(
    {
      from,
      to: [to],
      replyTo: input.email,
      subject: input.subject || `New enquiry from ${input.name}`,
      html: renderContactEmail(input),
    },
    { idempotencyKey: input.submissionId },
  );

  if (error || !data?.id) {
    throw new Error("Contact email delivery failed");
  }

  return { id: data.id };
}
