import { createClient, type SanityClient } from "@sanity/client";
import { getEnvironment } from "@/lib/env";

type SanityClientOptions = {
  preview?: boolean;
};

export function getSanityClient(options: SanityClientOptions = {}): SanityClient | null {
  const environment = getEnvironment();

  if (!environment.NEXT_PUBLIC_SANITY_PROJECT_ID) {
    return null;
  }

  return createClient({
    projectId: environment.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: environment.NEXT_PUBLIC_SANITY_DATASET,
    apiVersion: "2026-09-16",
    useCdn: !options.preview,
    perspective: options.preview ? "drafts" : "published",
    token: environment.SANITY_API_READ_TOKEN,
  });
}
