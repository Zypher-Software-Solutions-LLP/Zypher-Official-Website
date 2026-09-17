import { draftMode } from "next/headers";
import { NextResponse } from "next/server";

function getSafeDestination(request: Request): URL {
  const destination = new URL(request.url).searchParams.get("redirect") || "/";
  return destination.startsWith("/") && !destination.startsWith("//")
    ? new URL(destination, request.url)
    : new URL("/", request.url);
}

export async function GET(request: Request): Promise<NextResponse> {
  const requestUrl = new URL(request.url);
  const configuredSecret = process.env.SANITY_PREVIEW_SECRET;
  const suppliedSecret = requestUrl.searchParams.get("secret");

  if (!configuredSecret || suppliedSecret !== configuredSecret) {
    return NextResponse.json({ error: "Unauthorized", code: "UNAUTHORIZED" }, { status: 401 });
  }

  const preview = await draftMode();
  preview.enable();
  return NextResponse.redirect(getSafeDestination(request));
}
