import { draftMode } from "next/headers";
import { NextResponse } from "next/server";
import { getEnvironment } from "@/lib/env";
import { markPrivateResponse } from "@/lib/security/private-response";
import { secretsMatch } from "@/lib/security/secret-comparison";

function getSafeDestination(request: Request): URL {
  const destination = new URL(request.url).searchParams.get("redirect") || "/";
  return destination.startsWith("/") && !destination.startsWith("//")
    ? new URL(destination, request.url)
    : new URL("/", request.url);
}

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
  preview.enable();
  return markPrivateResponse(NextResponse.redirect(getSafeDestination(request)));
}
