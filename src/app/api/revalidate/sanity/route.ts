import { revalidatePath, revalidateTag } from "next/cache";
import type { NextRequest } from "next/server";
import { parseBody } from "next-sanity/webhook";
import { z } from "zod";
import { blogPostTag, SANITY_CACHE_TAGS } from "@/integrations/cms/sanity/cache-tags";
import { readBoundedBody } from "@/lib/http/read-bounded-body";
import { getEnvironment } from "@/lib/env";
import { publicRoutes } from "@/lib/routes";

export const runtime = "nodejs";

const supportedDocumentTypes = new Set([
  "blogPost",
  "author",
  "category",
  "pageSeo",
  "siteSettings",
]);
const publicRouteSet = new Set<string>(publicRoutes);
const MAX_SANITY_WEBHOOK_BYTES = 32_768;
const JSON_CONTENT_TYPE = "application/json";

const slugSchema = z
  .string()
  .trim()
  .min(1)
  .max(200)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);

const documentIdSchema = z
  .string()
  .trim()
  .min(1)
  .max(128)
  .regex(/^[a-zA-Z0-9._-]+$/);

const sanityWebhookPayloadSchema = z
  .object({
    documentId: documentIdSchema.optional(),
    documentType: z.enum(["blogPost", "author", "category", "pageSeo", "siteSettings"]),
    slug: slugSchema.nullable().optional(),
    previousSlug: slugSchema.nullable().optional(),
    pagePath: z.string().trim().max(200).optional().nullable(),
  })
  .strict();

type SanityWebhookPayload = z.infer<typeof sanityWebhookPayloadSchema>;

function logWebhookEvent(event: string, documentType?: string): void {
  console.info(JSON.stringify({ event, documentType: documentType || "unknown" }));
}

function parsePayload(value: unknown): SanityWebhookPayload | null {
  const result = sanityWebhookPayloadSchema.safeParse(value);
  if (!result.success) return null;

  if (
    result.data.documentType === "pageSeo" &&
    (!result.data.pagePath || !publicRouteSet.has(result.data.pagePath))
  ) {
    return null;
  }

  return result.data;
}

function getTagsForPayload(payload: SanityWebhookPayload): string[] {
  const tags = new Set<string>();

  if (payload.documentType === "siteSettings") {
    tags.add(SANITY_CACHE_TAGS.siteSettings);
  }

  if (payload.documentType === "pageSeo") {
    tags.add(SANITY_CACHE_TAGS.pageSeo);
  }

  if (
    payload.documentType === "blogPost" ||
    payload.documentType === "author" ||
    payload.documentType === "category" ||
    payload.documentType === "siteSettings"
  ) {
    tags.add(SANITY_CACHE_TAGS.blog);
    tags.add(SANITY_CACHE_TAGS.blogList);
    tags.add(SANITY_CACHE_TAGS.blogCategories);
  }

  if (payload.documentType === "blogPost") {
    if (payload.slug) tags.add(blogPostTag(payload.slug));
    if (payload.previousSlug) tags.add(blogPostTag(payload.previousSlug));
  }

  return [...tags];
}

export async function POST(request: NextRequest): Promise<Response> {
  if (request.method !== "POST") {
    return Response.json({ error: "Method not allowed" }, { status: 405 });
  }

  const contentType = request.headers.get("content-type")?.split(";", 1)[0].trim().toLowerCase();
  if (contentType !== JSON_CONTENT_TYPE) {
    return Response.json({ error: "Unsupported media type" }, { status: 415 });
  }

  const requestBody = await readBoundedBody(request.clone(), MAX_SANITY_WEBHOOK_BYTES);
  if (requestBody.status === "payload-too-large") {
    return Response.json({ error: "Payload too large" }, { status: 413 });
  }
  if (requestBody.status !== "ok") {
    return Response.json({ error: "Invalid webhook request" }, { status: 400 });
  }

  let secret: string | undefined;
  try {
    secret = getEnvironment().SANITY_REVALIDATE_SECRET;
  } catch {
    logWebhookEvent("sanity_webhook_configuration_error");
    return Response.json({ error: "Webhook unavailable" }, { status: 503 });
  }

  if (!secret) {
    logWebhookEvent("sanity_webhook_configuration_error");
    return Response.json({ error: "Webhook unavailable" }, { status: 503 });
  }

  try {
    const parsed = await parseBody<SanityWebhookPayload>(request, secret, true);
    if (parsed.isValidSignature !== true) {
      logWebhookEvent("sanity_webhook_rejected");
      return Response.json({ error: "Invalid signature" }, { status: 401 });
    }

    const payload = parsePayload(parsed.body);
    if (!payload || !supportedDocumentTypes.has(payload.documentType)) {
      logWebhookEvent("sanity_webhook_invalid_payload");
      return Response.json({ error: "Invalid webhook payload" }, { status: 400 });
    }

    const tags = getTagsForPayload(payload);
    tags.forEach((tag) => revalidateTag(tag, { expire: 0 }));
    revalidatePath("/blog");
    revalidatePath("/sitemap.xml");
    revalidatePath("/llms.txt");

    if (payload.documentType === "blogPost") {
      if (payload.slug) revalidatePath(`/blog/${payload.slug}`);
      if (payload.previousSlug) revalidatePath(`/blog/${payload.previousSlug}`);
    }

    if (payload.documentType === "category" && payload.slug) {
      revalidatePath(`/blog/category/${payload.slug}`);
    }

    if (payload.documentType === "pageSeo" && payload.pagePath) {
      revalidatePath(payload.pagePath);
    }

    if (payload.documentType === "siteSettings") {
      publicRoutes.forEach((path) => revalidatePath(path));
    }

    logWebhookEvent("sanity_webhook_revalidated", payload.documentType);

    return Response.json({ revalidated: true, documentType: payload.documentType });
  } catch {
    logWebhookEvent("sanity_webhook_processing_error");
    return Response.json({ error: "Invalid webhook request" }, { status: 400 });
  }
}
