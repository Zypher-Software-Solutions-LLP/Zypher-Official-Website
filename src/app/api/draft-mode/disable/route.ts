import { draftMode } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(request: Request): Promise<NextResponse> {
  const requestUrl = new URL(request.url);
  const configuredSecret = process.env.SANITY_PREVIEW_SECRET;
  const suppliedSecret = requestUrl.searchParams.get("secret");

  if (!configuredSecret || suppliedSecret !== configuredSecret) {
    return NextResponse.json({ error: "Unauthorized", code: "UNAUTHORIZED" }, { status: 401 });
  }

  const preview = await draftMode();
  preview.disable();
  return NextResponse.redirect(new URL("/", request.url));
}
