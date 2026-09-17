import { getEnvironment } from "@/lib/env";

const TURNSTILE_VERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";
const TURNSTILE_TIMEOUT_MS = 10_000;

type TurnstileVerificationResponse = { success: boolean };

export async function verifyTurnstile(token: string): Promise<boolean> {
  const { TURNSTILE_SECRET_KEY: secret, NODE_ENV: nodeEnvironment } = getEnvironment();

  if (!secret && nodeEnvironment !== "production" && token === "local-development-token") {
    return true;
  }

  if (!secret || !token) {
    return false;
  }

  const response = await fetch(TURNSTILE_VERIFY_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ secret, response: token }),
    cache: "no-store",
    signal: AbortSignal.timeout(TURNSTILE_TIMEOUT_MS),
  });

  if (!response.ok) {
    return false;
  }

  const result = (await response.json()) as TurnstileVerificationResponse;
  return result.success === true;
}
