import { getEnvironment } from "@/lib/env";

export function getR2AssetUrl(key: string): string {
  const normalizedKey = key.trim().replace(/^\/+/, "");

  if (!normalizedKey || normalizedKey.split("/").some((segment) => segment === "..")) {
    throw new Error("R2 asset keys must be non-empty and cannot traverse directories.");
  }

  const baseUrl = getEnvironment().NEXT_PUBLIC_R2_MEDIA_BASE_URL;
  if (!baseUrl) {
    throw new Error("R2 media delivery is not configured.");
  }

  return new URL(normalizedKey, `${baseUrl.replace(/\/+$/, "")}/`).toString();
}
