import { NextResponse } from "next/server";
import { sendContactEmail } from "@/integrations/email/resend";
import { verifyTurnstile } from "@/integrations/security/turnstile";
import { readBoundedBody } from "@/lib/http/read-bounded-body";
import { ContactPayloadSchema } from "@/lib/validation/contact";

export const runtime = "nodejs";

const MAX_CONTACT_REQUEST_BYTES = 32_768;
const JSON_CONTENT_TYPE = "application/json";

export async function POST(request: Request): Promise<NextResponse> {
  const requestId = crypto.randomUUID();
  const contentType = request.headers.get("content-type")?.split(";", 1)[0].trim().toLowerCase();

  if (contentType !== JSON_CONTENT_TYPE) {
    return NextResponse.json(
      { error: "Please check your form details.", code: "UNSUPPORTED_MEDIA_TYPE" },
      { status: 415 },
    );
  }

  let input: unknown;

  try {
    const requestBody = await readBoundedBody(request, MAX_CONTACT_REQUEST_BYTES);
    if (requestBody.status === "payload-too-large") {
      return NextResponse.json(
        { error: "Please check your form details.", code: "PAYLOAD_TOO_LARGE" },
        { status: 413 },
      );
    }

    if (requestBody.status !== "ok") {
      throw new Error("Request body could not be decoded");
    }

    input = JSON.parse(requestBody.body) as unknown;
  } catch {
    return NextResponse.json(
      { error: "Please check your form details.", code: "INVALID_INPUT" },
      { status: 400 },
    );
  }

  const result = ContactPayloadSchema.safeParse(input);
  if (!result.success) {
    return NextResponse.json(
      { error: "Please check your form details.", code: "INVALID_INPUT" },
      { status: 400 },
    );
  }

  try {
    const turnstileValid = await verifyTurnstile(result.data.turnstileToken);
    if (!turnstileValid) {
      return NextResponse.json(
        { error: "Please complete the verification and try again.", code: "VERIFICATION_FAILED" },
        { status: 400 },
      );
    }

    await sendContactEmail(result.data);
    return NextResponse.json({ ok: true }, { status: 200 });
  } catch {
    console.error(JSON.stringify({ event: "contact_delivery_failed", requestId }));
    return NextResponse.json(
      { error: "We could not send your message right now.", code: "DELIVERY_FAILED" },
      { status: 500 },
    );
  }
}
