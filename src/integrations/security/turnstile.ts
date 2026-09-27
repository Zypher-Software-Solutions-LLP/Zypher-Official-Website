import { getEnvironment } from "@/lib/env";

const TURNSTILE_VERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";
const TURNSTILE_TIMEOUT_MS = 10_000;
const CONTACT_TURNSTILE_ACTION = "contact";

type TurnstileVerificationResponse = {
  success: boolean;
  action?: string;
  hostname?: string;
};

function getAllowedHostnames(value: string | undefined): Set<string> {
  return new Set(
    (value ?? "")
      .split(",")
      .map((hostname) => hostname.trim().toLowerCase())
      .filter(Boolean),
  );
}

export async function verifyTurnstile(token: string): Promise<boolean> {
  const {
    NODE_ENV: nodeEnvironment,
    TURNSTILE_HOSTNAMES: configuredHostnames,
    TURNSTILE_SECRET_KEY: secret,
  } = getEnvironment();

  if (!secret && nodeEnvironment !== "production" && token === "local-development-token") {
    return true;
  }

  const allowedHostnames = getAllowedHostnames(configuredHostnames);
  if (!secret || !token || allowedHostnames.size === 0) {
    return false;
  }

  const response = await fetch(TURNSTILE_VERIFY_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ secret, response: token }).toString(),
    cache: "no-store",
    signal: AbortSignal.timeout(TURNSTILE_TIMEOUT_MS),
  });

  if (!response.ok) {
    return false;
  }

  const result = (await response.json()) as TurnstileVerificationResponse;
  const hostname = result.hostname?.trim().toLowerCase();

  if (!hostname) {
    return false;
  }

  return (
    result.success === true &&
    result.action === CONTACT_TURNSTILE_ACTION &&
    allowedHostnames.has(hostname)
  );
}
