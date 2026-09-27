import { draftMode } from "next/headers";
import { NextResponse } from "next/server";
import { getEnvironment } from "@/lib/env";
import { markPrivateResponse } from "@/lib/security/private-response";
import { secretsMatch } from "@/lib/security/secret-comparison";

export async function GET(request: Request): Promise<NextResponse> {
  const requestUrl = new URL(request.url);
  let configuredSecret: string | undefined;

  try {
    configuredSecret = getEnvironment().SANITY_PREVIEW_SECRET;
  } catch {
    return markPrivateResponse(
      NextResponse.json(
        { error: "Preview unavailable", code: "PREVIEW_UNAVAILABLE" },
        { status: 503 },
      ),
    );
  }

  const suppliedSecret = requestUrl.searchParams.get("secret");

  if (!secretsMatch(suppliedSecret, configuredSecret)) {
    return markPrivateResponse(
      NextResponse.json({ error: "Unauthorized", code: "UNAUTHORIZED" }, { status: 401 }),
    );
  }

  const preview = await draftMode();
  preview.disable();
  return markPrivateResponse(NextResponse.redirect(new URL("/", request.url)));
}
