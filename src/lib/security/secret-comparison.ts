import { createHash, timingSafeEqual } from "node:crypto";

function digestSecret(secret: string): Buffer {
  return createHash("sha256").update(secret, "utf8").digest();
}

export function secretsMatch(
  suppliedSecret: string | null,
  configuredSecret: string | undefined,
): boolean {
  if (suppliedSecret === null || configuredSecret === undefined || configuredSecret.length === 0) {
    return false;
  }

  return timingSafeEqual(digestSecret(suppliedSecret), digestSecret(configuredSecret));
}
