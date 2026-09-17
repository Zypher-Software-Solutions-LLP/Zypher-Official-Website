import type { ContactPayload } from "@/lib/validation/contact";

type ContactEmailProps = Omit<
  ContactPayload,
  "consentAcknowledged" | "turnstileToken" | "submissionId"
>;

function escapeHtml(value: string | undefined): string {
  return (value || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export function renderContactEmail(input: ContactEmailProps): string {
  return `<!doctype html>
<html lang="en">
  <body style="font-family: Arial, sans-serif; color: #172033; line-height: 1.6;">
    <h1>New Zypher contact enquiry</h1>
    <p><strong>Name:</strong> ${escapeHtml(input.name)}</p>
    <p><strong>Email:</strong> ${escapeHtml(input.email)}</p>
    <p><strong>Company:</strong> ${escapeHtml(input.company)}</p>
    <p><strong>Phone:</strong> ${escapeHtml(input.phone)}</p>
    <p><strong>Subject:</strong> ${escapeHtml(input.subject)}</p>
    <p><strong>Message:</strong></p>
    <p>${escapeHtml(input.message).replaceAll("\n", "<br />")}</p>
  </body>
</html>`;
}
